import React, { useState, useEffect, useMemo, useRef } from "react";
import { C, CATS, fmt, uid, MONO, DISPLAY, inputStyle } from "./constants.js";
import { DEFAULT_MENU } from "./defaultMenu.js";
import { PHOTOS } from "./photos.js";
import { ItemPic, FoodIcon } from "./FoodIcon.jsx";

const store = typeof window !== "undefined" && window.storage ? window.storage : null;

export default function PriceBoard() {
  const [menu, setMenu] = useState(DEFAULT_MENU);
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(null); // item id, or "__new__"
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(null); // { name, price, cat, photo? }
  const [delArmed, setDelArmed] = useState(false);
  const [resetArmed, setResetArmed] = useState(false);
  const [userPhotos, setUserPhotos] = useState({}); // id -> dataURL (photos the cashier uploaded)
  const fileRef = useRef(null);

  // ——— load saved menu (keep any price you set before, add new items) ———
  useEffect(() => {
    (async () => {
      if (!store) return;
      try {
        const r4 = await store.get("laverton-menu-v4");
        if (r4 && r4.value) {
          const m = JSON.parse(r4.value);
          if (Array.isArray(m) && m.length) {
            const merged = [...m];
            DEFAULT_MENU.forEach((d) => {
              if (!merged.some((x) => x.id === d.id)) merged.push(d);
            });
            setMenu(merged);
            return;
          }
        }
      } catch (e) { /* no v4 yet */ }
      for (const key of ["laverton-menu-v3", "laverton-menu-v2", "laverton-menu-v1"]) {
        try {
          const r = await store.get(key);
          if (r && r.value) {
            const old = JSON.parse(r.value);
            if (Array.isArray(old) && old.length) {
              const merged = DEFAULT_MENU.map((d) => {
                const prev = old.find((m) => m.id === d.id);
                return prev && typeof prev.price === "number" && prev.price > 0 ? { ...d, price: prev.price } : d;
              });
              old.forEach((m) => { if (m.id && String(m.id).startsWith("x")) merged.push(m); });
              setMenu(merged);
              try { await store.set("laverton-menu-v4", JSON.stringify(merged)); } catch (e) {}
              return;
            }
          }
        } catch (e) { /* keep looking */ }
      }
    })();
  }, []);

  // ——— load photos the cashier uploaded before ———
  useEffect(() => {
    (async () => {
      if (!store) return;
      try {
        const r = await store.list("labphoto-");
        if (r && r.keys && r.keys.length) {
          const out = {};
          for (const k of r.keys) {
            try {
              const g = await store.get(k);
              if (g && g.value) out[k.slice(9)] = g.value;
            } catch (e) { /* skip */ }
          }
          setUserPhotos(out);
        }
      } catch (e) { /* none yet */ }
    })();
  }, []);

  const saveMenu = async (m) => {
    setMenu(m);
    try { if (store) await store.set("laverton-menu-v4", JSON.stringify(m)); }
    catch (e) { console.error("Could not save menu", e); }
  };

  const photoSrc = (id) => {
    if (userPhotos[id]) return userPhotos[id];
    if (PHOTOS[id]) return "data:image/webp;base64," + PHOTOS[id];
    return null;
  };

  // ——— open / edit ———
  const open = (item) => {
    setSel(item.id);
    setDraft({ name: item.name, price: item.price > 0 ? String(item.price) : "", cat: item.cat, photo: null });
    setEditing(item.price <= 0);
    setDelArmed(false);
  };
  const openNew = () => {
    setSel("__new__");
    setDraft({ name: "", price: "", cat: cat === "All" ? "Hot Food" : cat, photo: null });
    setEditing(true);
    setDelArmed(false);
  };
  const close = () => { setSel(null); setEditing(false); setDraft(null); setDelArmed(false); };

  const savePhoto = async (id, dataUrl) => {
    setUserPhotos((p) => ({ ...p, [id]: dataUrl }));
    try { if (store) await store.set("labphoto-" + id, dataUrl); }
    catch (e) { console.error("Could not save photo", e); }
  };
  const removePhoto = async (id) => {
    setUserPhotos((p) => { const n = { ...p }; delete n[id]; return n; });
    try { if (store) await store.delete("labphoto-" + id); } catch (e) {}
  };

  const onFile = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const S = 480;
        const side = Math.min(img.width, img.height);
        const sx = (img.width - side) / 2, sy = (img.height - side) / 2;
        const cv = document.createElement("canvas");
        cv.width = S; cv.height = S;
        cv.getContext("2d").drawImage(img, sx, sy, side, side, 0, 0, S, S);
        setDraft((d) => ({ ...d, photo: cv.toDataURL("image/jpeg", 0.72) }));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(f);
    e.target.value = "";
  };

  const saveDraft = async () => {
    const p = parseFloat(String(draft.price).replace(",", "."));
    const name = (draft.name || "").trim();
    if (!name || isNaN(p) || p < 0) return;
    const price = Math.round(p * 100) / 100;
    if (sel === "__new__") {
      const id = uid();
      await saveMenu([...menu, { id, name, price, cat: draft.cat }]);
      if (draft.photo) await savePhoto(id, draft.photo);
      setSel(id);
    } else {
      await saveMenu(menu.map((m) => (m.id === sel ? { ...m, name, price, cat: draft.cat } : m)));
      if (draft.photo) await savePhoto(sel, draft.photo);
    }
    setDraft((d) => ({ ...d, photo: null }));
    setEditing(false);
  };

  const deleteItem = async () => {
    if (!delArmed) { setDelArmed(true); return; }
    await saveMenu(menu.filter((m) => m.id !== sel));
    removePhoto(sel);
    close();
  };

  const shown = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return menu.filter((m) => (cat === "All" || m.cat === cat) && (!qq || m.name.toLowerCase().includes(qq)));
  }, [menu, cat, q]);

  const selItem = sel && sel !== "__new__" ? menu.find((m) => m.id === sel) : null;

  // ————————————————— UI —————————————————
  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.cream, fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif", paddingBottom: 40 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&display=swap');
        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        button { font-family: inherit; }
        button:active { transform: scale(.97); }
        button:focus-visible, input:focus-visible, select:focus-visible { outline: 2px solid ${C.gold}; outline-offset: 2px; }
        input, select { font-family: inherit; }
        .chips::-webkit-scrollbar { display: none; }
        @media (prefers-reduced-motion: reduce) { * { transition: none !important; animation: none !important; } }
        @keyframes pop { from { transform: scale(.96); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `}</style>

      {/* Header */}
      <div style={{ padding: "14px 16px 10px", borderBottom: `1px solid ${C.line}`, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div>
          <div style={{ color: C.gold, fontSize: 10, letterSpacing: "0.22em", fontWeight: 700 }}>LAVERTON AWARD BAKERY</div>
          <div style={{ fontFamily: DISPLAY, fontSize: 26, letterSpacing: "0.04em", lineHeight: 1.1, marginTop: 2 }}>
            PRICE <span style={{ color: C.gold }}>BOARD</span>
          </div>
          <div style={{ color: C.muted, fontSize: 11.5, marginTop: 3 }}>Tap a product to see its price</div>
        </div>
        <button
          onClick={openNew}
          style={{ border: `1.5px dashed ${C.gold}`, background: "transparent", color: C.gold, borderRadius: 999, padding: "9px 14px", fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}
        >
          ＋ Add
        </button>
      </div>

      {/* Search */}
      <div style={{ padding: "12px 16px 4px" }}>
        <input
          value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search… e.g. butter chicken"
          style={{ width: "100%", background: C.panel, border: `1px solid ${C.line}`, color: C.cream, borderRadius: 12, padding: "13px 14px", fontSize: 16 }}
        />
      </div>

      {/* Category chips */}
      <div className="chips" style={{ display: "flex", gap: 8, overflowX: "auto", padding: "10px 16px", scrollbarWidth: "none" }}>
        {["All", ...CATS].map((c) => (
          <button key={c} onClick={() => setCat(c)}
            style={{ flex: "0 0 auto", padding: "8px 14px", borderRadius: 999, fontSize: 13, fontWeight: 700, cursor: "pointer", border: `1.5px solid ${cat === c ? C.gold : C.line}`, background: cat === c ? C.gold : "transparent", color: cat === c ? C.ink : C.muted }}>
            {c}
          </button>
        ))}
      </div>

      {/* Big photo grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 12, padding: "6px 16px 20px" }}>
        {shown.map((item) => {
          const src = photoSrc(item.id);
          const unpriced = item.price <= 0;
          return (
            <button
              key={item.id} onClick={() => open(item)}
              style={{ textAlign: "left", cursor: "pointer", background: C.panel, border: `1.5px solid ${C.line}`, borderRadius: 16, padding: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}
            >
              {src ? (
                <img src={src} alt="" style={{ width: "100%", aspectRatio: "1 / 1", objectFit: "cover", display: "block" }} />
              ) : (
                <div style={{ width: "100%", aspectRatio: "1 / 1", background: "#171310", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <FoodIcon item={item} size={84} />
                </div>
              )}
              <div style={{ padding: "9px 11px 11px" }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: C.cream, lineHeight: 1.25, minHeight: 34 }}>{item.name}</div>
                {unpriced ? (
                  <div style={{ color: C.red, fontSize: 12.5, fontWeight: 700, marginTop: 4 }}>Tap to set price</div>
                ) : (
                  <div style={{ color: C.gold, fontFamily: MONO, fontSize: 21, fontWeight: 800, marginTop: 3 }}>{fmt(item.price)}</div>
                )}
              </div>
            </button>
          );
        })}
        {shown.length === 0 && (
          <div style={{ gridColumn: "1 / -1", color: C.muted, textAlign: "center", padding: "32px 0", fontSize: 14 }}>
            Nothing matches "{q}". Check spelling, or add it with ＋ Add.
          </div>
        )}
      </div>

      {/* Reset (small, bottom) */}
      <div style={{ textAlign: "center", paddingBottom: 24 }}>
        <button
          onClick={() => { if (!resetArmed) { setResetArmed(true); return; } saveMenu(DEFAULT_MENU); setResetArmed(false); }}
          style={{ background: "transparent", border: `1.5px solid ${resetArmed ? C.red : C.line}`, color: resetArmed ? C.red : C.muted, borderRadius: 10, padding: "9px 16px", fontSize: 12.5, cursor: "pointer" }}
        >
          {resetArmed ? "Tap again — reset all prices to default" : "Reset menu"}
        </button>
      </div>

      {/* ——— Big price view / editor ——— */}
      {sel && draft && (
        <div onClick={close} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.72)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 14 }}>
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ width: "100%", maxWidth: 420, maxHeight: "94vh", overflowY: "auto", background: C.panel, border: `1px solid ${C.line}`, borderRadius: 20, animation: "pop .18s ease", overflowX: "hidden" }}
          >
            {/* photo */}
            {(() => {
              const src = draft.photo || (sel !== "__new__" ? photoSrc(sel) : null);
              return src ? (
                <img src={src} alt="" style={{ width: "100%", aspectRatio: "1 / 1", objectFit: "cover", display: "block" }} />
              ) : (
                <div style={{ width: "100%", aspectRatio: "16 / 10", background: "#171310", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {selItem ? <FoodIcon item={selItem} size={120} /> : <FoodIcon item={{ id: "?", cat: draft.cat }} size={120} />}
                </div>
              );
            })()}

            <div style={{ padding: "14px 16px 16px" }}>
              {!editing && selItem ? (
                <div>
                  <div style={{ display: "inline-block", border: `1px solid ${C.goldDim}`, color: C.gold, borderRadius: 999, padding: "3px 10px", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em" }}>{selItem.cat.toUpperCase()}</div>
                  <div style={{ fontFamily: DISPLAY, fontSize: 26, letterSpacing: "0.03em", lineHeight: 1.15, margin: "8px 0 2px" }}>{selItem.name}</div>
                  <div style={{ fontFamily: MONO, fontSize: 58, fontWeight: 800, color: C.gold, lineHeight: 1.1 }}>{fmt(selItem.price)}</div>
                  <div style={{ color: C.muted, fontFamily: MONO, fontSize: 14, marginTop: 6 }}>
                    ×2 {fmt(selItem.price * 2)} &nbsp;·&nbsp; ×3 {fmt(selItem.price * 3)} &nbsp;·&nbsp; ×4 {fmt(selItem.price * 4)}
                  </div>
                  <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                    <button onClick={() => { setEditing(true); setDelArmed(false); }} style={{ background: "none", border: `1.5px solid ${C.line}`, color: C.muted, borderRadius: 12, padding: "13px 16px", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
                      ✎ Edit
                    </button>
                    <button onClick={close} style={{ flex: 1, background: C.gold, color: C.ink, border: "none", borderRadius: 12, padding: "14px", fontSize: 16, fontWeight: 800, cursor: "pointer" }}>
                      Close
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ fontFamily: DISPLAY, fontSize: 20, letterSpacing: "0.04em", marginBottom: 10 }}>
                    {sel === "__new__" ? "ADD NEW ITEM" : "EDIT ITEM"}
                  </div>
                  {selItem && selItem.price <= 0 && (
                    <div style={{ background: "#3A2E17", border: `1px solid ${C.goldDim}`, color: C.gold, borderRadius: 10, padding: "8px 10px", fontSize: 13, marginBottom: 10 }}>
                      No price yet — set it once and it will be remembered.
                    </div>
                  )}

                  {/* photo upload */}
                  <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={onFile} style={{ display: "none" }} />
                  <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                    <button onClick={() => fileRef.current && fileRef.current.click()} style={{ flex: 1, background: C.panelUp, border: `1.5px dashed ${C.gold}`, color: C.gold, borderRadius: 12, padding: "12px", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
                      📷 Take / upload photo
                    </button>
                    {sel !== "__new__" && userPhotos[sel] && !draft.photo && (
                      <button onClick={() => removePhoto(sel)} style={{ background: "none", border: `1.5px solid ${C.line}`, color: C.muted, borderRadius: 12, padding: "12px", fontSize: 13, cursor: "pointer" }}>
                        Remove photo
                      </button>
                    )}
                  </div>
                  {draft.photo && <div style={{ color: C.gold, fontSize: 12.5, marginTop: -6, marginBottom: 10 }}>✓ New photo ready — press Save to keep it</div>}

                  <label style={{ fontSize: 12, color: C.muted, letterSpacing: "0.1em" }}>NAME</label>
                  <input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} style={inputStyle} />
                  <label style={{ fontSize: 12, color: C.muted, letterSpacing: "0.1em" }}>PRICE $</label>
                  <input value={draft.price} onChange={(e) => setDraft({ ...draft, price: e.target.value })} inputMode="decimal" placeholder="e.g. 7.90" style={inputStyle} />
                  <label style={{ fontSize: 12, color: C.muted, letterSpacing: "0.1em" }}>CATEGORY</label>
                  <select value={draft.cat} onChange={(e) => setDraft({ ...draft, cat: e.target.value })} style={{ ...inputStyle, appearance: "none" }}>
                    {CATS.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>

                  <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                    {sel !== "__new__" && (
                      <button onClick={deleteItem} style={{ background: "none", border: `1.5px solid ${C.red}`, color: C.red, borderRadius: 12, padding: "12px 13px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                        {delArmed ? "Tap again" : "Delete"}
                      </button>
                    )}
                    <button onClick={() => (sel === "__new__" ? close() : (setEditing(false), setDraft((d) => ({ ...d, photo: null }))))} style={{ background: "none", border: `1.5px solid ${C.line}`, color: C.muted, borderRadius: 12, padding: "12px 14px", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
                      Cancel
                    </button>
                    <button onClick={saveDraft} style={{ flex: 1, background: C.gold, color: C.ink, border: "none", borderRadius: 12, padding: "13px", fontSize: 15, fontWeight: 800, cursor: "pointer" }}>
                      Save
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

