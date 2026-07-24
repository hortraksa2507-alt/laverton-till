import React from "react";
import { C, I, ICONS, CAT_FALLBACK } from "./constants.js";
import { PHOTOS } from "./photos.js";

function ItemPic({ item, size = 44, radius = 10 }) {
  const b64 = PHOTOS[item.id];
  if (b64) {
    return (
      <img
        src={"data:image/webp;base64," + b64}
        alt=""
        width={size}
        height={size}
        style={{ width: size, height: size, borderRadius: radius, objectFit: "cover", display: "block", flexShrink: 0 }}
      />
    );
  }
  return <FoodIcon item={item} size={size} />;
}

function FoodIcon({ item, size = 44 }) {
  const spec = ICONS[item.id] || CAT_FALLBACK[item.cat] || ["tag"];
  const [k, a, b, extra] = spec;
  const u = "ic" + item.id;
  let body = null;

  const speck = (pts, r, fill) => pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r={r} fill={fill} />);

  if (k === "pie" || k === "pieSmall") {
    const s = k === "pieSmall" ? 0.78 : 1;
    body = (
      <g transform={`translate(${24 - 24 * s} ${26 - 26 * s}) scale(${s})`}>
        <path d="M9 30 L39 30 L35 41 L13 41 Z" fill={I.crust} />
        <path d="M9 30 L39 30 L38 34 L10 34 Z" fill="#00000022" />
        <path d="M8 30 C8 21 14 16 24 16 C34 16 40 21 40 30 Z" fill={I.pastry} />
        <path d="M11 27 C13 20 18 18 24 18" stroke={I.cream} strokeWidth="2.4" fill="none" strokeLinecap="round" opacity=".8" />
        <path d="M8 30 Q12 27 16 30 Q20 27 24 30 Q28 27 32 30 Q36 27 40 30" fill="none" stroke={I.crust} strokeWidth="2.6" strokeLinecap="round" />
        <circle cx="35" cy="37" r="3.4" fill={a || I.meat} />
      </g>
    );
  } else if (k === "sroll") {
    body = (
      <g>
        <rect x="7" y="17" width="34" height="15" rx="7.5" fill={I.pastry} />
        <rect x="7" y="17" width="34" height="7" rx="3.5" fill={I.cream} opacity=".35" />
        <path d="M17 17 V32 M24 17 V32 M31 17 V32" stroke={I.crust} strokeWidth="2" />
        <ellipse cx="8.5" cy="24.5" rx="2.6" ry="5.4" fill={I.meat} />
        <ellipse cx="39.5" cy="24.5" rx="2.6" ry="5.4" fill={I.meat} />
      </g>
    );
  } else if (k === "sandwich") {
    body = (
      <g>
        <clipPath id={u}><path d="M24 9 L43 39 L5 39 Z" /></clipPath>
        <path d="M24 9 L43 39 L5 39 Z" fill={I.bread} stroke={I.crust} strokeWidth="2" strokeLinejoin="round" />
        <g clipPath={`url(#${u})`}>
          <rect x="4" y="29" width="40" height="4" fill={a} />
          <rect x="4" y="34" width="40" height="3" fill={b || a} />
        </g>
        <path d="M24 9 L43 39 L5 39 Z" fill="none" stroke={I.crust} strokeWidth="2" strokeLinejoin="round" />
      </g>
    );
  } else if (k === "roll") {
    body = (
      <g>
        <rect x="8" y="27" width="32" height="8" rx="4" fill={I.bread} stroke={I.crust} strokeWidth="1.6" />
        <path d="M9 27 q3 -5 6 0 q3 -5 6 0 q3 -5 6 0 q3 -5 6 0 q3 -5 6 0" fill={a} />
        {speck([[15, 25], [24, 24.5], [33, 25]], 2.2, b || I.red)}
        <path d="M8 24 C8 15 40 15 40 24 L40 26 L8 26 Z" fill={I.pastry} stroke={I.crust} strokeWidth="1.6" />
        <path d="M13 20 C17 17.4 31 17.4 35 20" stroke={I.cream} strokeWidth="2" fill="none" strokeLinecap="round" opacity=".7" />
      </g>
    );
  } else if (k === "fruitcup") {
    body = (
      <g>
        <path d="M12 16 L36 16 L33 40 L15 40 Z" fill="#EDE6D6" stroke={I.grey} strokeWidth="1.8" />
        <circle cx="19" cy="24" r="3.2" fill="#A9C070" /><circle cx="26" cy="22" r="3.2" fill="#E8963E" />
        <circle cx="30" cy="27" r="3.2" fill={I.red} /><circle cx="21" cy="30" r="3.2" fill="#8A4A8A" />
        <circle cx="27" cy="33" r="3.2" fill="#E8963E" /><circle cx="19" cy="35" r="3" fill={I.red} />
        <path d="M11 15 Q24 7 37 15" fill="none" stroke={I.grey} strokeWidth="1.8" />
      </g>
    );
  } else if (k === "donut") {
    body = (
      <g>
        <path d="M8 25 C8 15 40 15 40 25 Z" fill={I.pastry} stroke={I.crust} strokeWidth="1.5" />
        {b && <path d="M10 20 C16 14.5 32 14.5 38 20 L38 22 C30 17 18 17 10 22 Z" fill={b} />}
        <path d="M8 26 q4 -6 8 0 q4 -6 8 0 q4 -6 8 0 q4 -6 8 0 L40 30 C40 37 8 37 8 30 Z" fill={I.cream} />
        <path d="M8 30 C8 37 40 37 40 30 L40 31 C40 38 8 38 8 31 Z" fill={I.pastry} stroke={I.crust} strokeWidth="1.5" />
        <circle cx="24" cy="20" r="2.8" fill={a} />
      </g>
    );
  } else if (k === "ringdonut") {
    body = (
      <g>
        <circle cx="24" cy="25" r="15" fill={I.pastry} />
        <path d="M9 25 a15 15 0 0 1 30 0 q-4 4 -7.5 0 q-3.7 4.5 -7.5 0 q-3.7 4.5 -7.5 0 q-3.6 4 -7.5 0 Z" fill={I.choc} />
        <circle cx="24" cy="25" r="5.2" fill={C.panel} stroke={I.crust} strokeWidth="1.4" />
        <path d="M14 18 q4 -3 9 -2 M27 15.5 q4 .3 7 3" stroke={I.cream} strokeWidth="1.8" fill="none" strokeLinecap="round" opacity=".85" />
      </g>
    );
  } else if (k === "turnover") {
    body = (
      <g>
        {a && <path d="M12 32 q3 5 6 0 q3 5 6 0 q3 5 6 0 q3 5 6 0 L34 32 Z" fill={I.cream} />}
        <path d="M9 31 A16 15 0 0 1 39 31 Z" fill={I.pastry} stroke={I.crust} strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M13 24 C16 18.6 21 16.4 26 16.8" stroke={I.cream} strokeWidth="2.2" fill="none" strokeLinecap="round" opacity=".8" />
        <path d="M9 31 h30" stroke={I.crust} strokeWidth="2.6" strokeDasharray="3 3" strokeLinecap="round" />
      </g>
    );
  } else if (k === "lamington") {
    body = (
      <g>
        <path d="M12 19 L30 19 L37 13 L19 13 Z" fill={a} opacity=".85" />
        <path d="M30 19 L37 13 L37 31 L30 37 Z" fill={a} opacity=".7" />
        <rect x="12" y="19" width="18" height="18" fill={a} />
        {b && <rect x="12" y="26" width="18" height="4.5" fill={I.cream} />}
        {b && <circle cx="21" cy="28" r="1.8" fill={I.jam} />}
        {speck([[15, 22], [26, 21], [20, 24], [27, 33], [15, 34], [22, 35.5], [33, 22], [34, 29]], 1.2, I.white)}
      </g>
    );
  } else if (k === "slice") {
    body = (
      <g>
        <rect x="9" y="30" width="30" height="8" fill={I.biscuit} />
        <rect x="9" y="24" width="30" height="6" fill={b} />
        <rect x="9" y="16" width="30" height="8" rx="2" fill={a} />
        {extra === "drizzle" && <path d="M10 19 q3 3 6 0 q3 3 6 0 q3 3 6 0 q3 3 6 0 q2.5 3 5 0" stroke={I.white} strokeWidth="1.8" fill="none" strokeLinecap="round" />}
        {extra === "coconut" && speck([[13, 19], [19, 21], [25, 18.5], [31, 20.5], [36, 18.5]], 1.2, I.white)}
        {extra === "flake" && speck([[14, 19.5], [21, 18.5], [28, 20.5], [34, 18.5]], 1.4, "#00000033")}
      </g>
    );
  } else if (k === "lolly") {
    body = (
      <g>
        <rect x="11" y="14" width="26" height="24" rx="3" fill={I.pink} />
        <circle cx="18" cy="21" r="3" fill="#B7D89A" /><circle cx="28" cy="19" r="3" fill={I.yellow} />
        <circle cx="31" cy="29" r="3" fill={I.white} /><circle cx="19" cy="31" r="3" fill="#E88BC8" />
        {speck([[24, 25], [14, 26], [33, 23], [24, 35], [15, 16.5], [33, 35]], 1.1, I.white)}
      </g>
    );
  } else if (k === "rockyroad") {
    body = (
      <g>
        <rect x="11" y="14" width="26" height="24" rx="3" fill={I.choc} />
        <circle cx="18" cy="21" r="3.4" fill={I.pink} /><circle cx="29" cy="27" r="3.4" fill={I.pink} />
        <circle cx="19" cy="32" r="3" fill={I.white} /><circle cx="29" cy="18" r="2.6" fill={I.white} />
        {speck([[24, 24], [14, 28], [33, 33], [24, 35]], 1.1, "#FFFFFF55")}
      </g>
    );
  } else if (k === "cake") {
    body = (
      <g>
        <rect x="11" y="22" width="26" height="16" rx="2" fill={b} />
        <rect x="11" y="15" width="26" height="9" rx="3" fill={a} />
        <path d="M14 23.5 a2.6 2.6 0 0 0 5.2 0 M22 23.5 a2.6 2.6 0 0 0 5.2 0 M30 23.5 a2.6 2.6 0 0 0 5.2 0" fill={a} />
      </g>
    );
  } else if (k === "tart") {
    body = (
      <g>
        <circle cx="24" cy="25" r="15" fill="#F0DCA9" />
        <circle cx="24" cy="25" r="14" fill="none" stroke={I.crust} strokeWidth="3.4" strokeDasharray="1.6 4.6" strokeLinecap="round" />
        {b ? (
          <g>
            <path d="M24 15.6 a9.4 9.4 0 0 1 0 18.8 Z" fill={b} />
            <path d="M24 15.6 a9.4 9.4 0 0 0 0 18.8 Z" fill={a} />
          </g>
        ) : (
          <circle cx="24" cy="25" r="9.4" fill={a} />
        )}
        <ellipse cx="20.5" cy="21" rx="2.6" ry="1.6" fill="#FFFFFF66" transform="rotate(-25 20.5 21)" />
      </g>
    );
  } else if (k === "yoyo") {
    body = (
      <g>
        <ellipse cx="24" cy="20" rx="13" ry="5.6" fill="#E7C078" stroke={I.crust} strokeWidth="1.4" />
        <rect x="12.5" y="24" width="23" height="3.6" rx="1.8" fill={I.cream} />
        <ellipse cx="24" cy="31.5" rx="13" ry="5.6" fill="#E7C078" stroke={I.crust} strokeWidth="1.4" />
        {speck([[19, 19], [27, 20.5]], 1.1, I.crust)}
      </g>
    );
  } else if (k === "gingerman") {
    body = (
      <g fill="#B97A3E">
        <circle cx="24" cy="13" r="6.4" />
        <path d="M20 18.5 h8 l6 5 -2.6 3.4 -4.4 -3 v6 l4.6 8 -3.6 2.6 -4 -7 -4 7 -3.6 -2.6 4.6 -8 v-6 l-4.4 3 L14 23.5 Z" />
        <path d="M18.5 11 a7.4 7.4 0 0 1 11 0" fill="none" stroke={I.white} strokeWidth="2.6" strokeLinecap="round" strokeDasharray="0.5 3.4" />
        <circle cx="21.8" cy="12.6" r="1.1" fill={I.ink ? "#3A2A1A" : "#3A2A1A"} /><circle cx="26.2" cy="12.6" r="1.1" fill="#3A2A1A" />
        <circle cx="24" cy="22" r="1.5" fill={I.red} /><circle cx="24" cy="27" r="1.5" fill={I.green} />
      </g>
    );
  } else if (k === "cookie") {
    body = (
      <g>
        <circle cx="24" cy="25" r="15" fill="#C89A55" />
        <circle cx="18" cy="20" r="2.3" fill={I.red} /><circle cx="28" cy="18" r="2.3" fill="#3E7AC0" />
        <circle cx="31" cy="27" r="2.3" fill={I.green} /><circle cx="22" cy="30" r="2.3" fill={I.yellow} />
        <circle cx="16" cy="28" r="2.3" fill="#E8963E" /><circle cx="27" cy="34" r="2.1" fill={I.red} />
      </g>
    );
  } else if (k === "marshstick") {
    const dots = [[21, 10], [26, 12], [22, 15], [27, 17], [21, 20], [26, 22], [22, 25], [27, 27], [21, 30], [26, 31]];
    const cols = [I.red, I.yellow, "#3E7AC0", I.green, I.white, "#E88BC8", I.yellow, I.red, "#3E7AC0", I.green];
    body = (
      <g>
        <rect x="22.6" y="32" width="2.8" height="12" rx="1.4" fill="#C8A878" />
        <rect x="17.5" y="7" width="13" height="27" rx="6.5" fill={I.milk} />
        {dots.map((p, i) => <circle key={i} cx={p[0] + 1} cy={p[1]} r="1.5" fill={cols[i]} />)}
      </g>
    );
  } else if (k === "log") {
    body = (
      <g>
        <rect x="9" y="20" width="30" height="11" rx="5.5" fill={I.milk} />
        <ellipse cx="38" cy="25.5" rx="2.4" ry="5.5" fill="#5A3820" />
        {speck([[14, 24], [20, 27], [26, 23.5], [31, 27], [17, 22.5], [29, 28.5]], 1.2, I.white)}
      </g>
    );
  } else if (k === "corndog") {
    body = (
      <g>
        <rect x="22.6" y="30" width="2.8" height="14" rx="1.4" fill="#C8A878" />
        <rect x="16.5" y="5" width="15" height="27" rx="7.5" fill="#D89A3F" />
        <path d="M20 9 C22 7.4 26 7.4 28 9" stroke={I.cream} strokeWidth="2" fill="none" strokeLinecap="round" opacity=".75" />
      </g>
    );
  } else if (k === "potatocake") {
    body = (
      <g>
        <ellipse cx="24" cy="26" rx="16" ry="10" fill="#E2A94F" stroke={I.crust} strokeWidth="1.6" />
        <path d="M15 24 q4 -3 8 -1 M25 29 q4 -2 8 0 M18 30 q3 1 5 0" stroke={I.crust} strokeWidth="1.6" fill="none" strokeLinecap="round" opacity=".7" />
      </g>
    );
  } else if (k === "hashbrown") {
    body = (
      <g>
        <rect x="9" y="18" width="30" height="16" rx="8" fill="#E8B356" stroke={I.crust} strokeWidth="1.6" />
        {speck([[15, 23], [21, 27], [27, 22.5], [33, 27], [24, 24], [18, 30], [30, 30]], 1.2, I.crust)}
      </g>
    );
  } else if (k === "dimsim") {
    body = (
      <g>
        <path d="M13 34 C11 26 14 18 19 16 C20 12 28 12 29 16 C34 18 37 26 35 34 Z" fill="#C98E3E" stroke={I.dark} strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M18 20 q2 -3 5 -3 M26 18 q3 1 4 4 M17 27 q3 2 7 1" stroke={I.dark} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity=".65" />
      </g>
    );
  } else if (k === "springroll") {
    body = (
      <g>
        <rect x="7" y="19" width="34" height="13" rx="6.5" fill="#D89A3F" stroke={I.crust} strokeWidth="1.5" />
        <path d="M16 19 l-4 13 M25 19 l-4 13 M34 19 l-4 13" stroke={I.crust} strokeWidth="1.5" opacity=".7" />
        <ellipse cx="40" cy="25.5" rx="2.2" ry="6.5" fill="#B9742C" />
      </g>
    );
  } else if (k === "wing") {
    body = (
      <g>
        <path d="M11 27 C11 18 20 13 27 17 C34 20 36 26 32 31 C27 37 14 36 11 27 Z" fill="#B06A2E" />
        <path d="M30 30 L37 36" stroke="#B06A2E" strokeWidth="6" strokeLinecap="round" />
        <circle cx="38.5" cy="37.5" r="3" fill={I.white} />
        {speck([[18, 22], [24, 27], [16, 29]], 1.3, "#7A4A1E")}
      </g>
    );
  } else if (k === "sausage") {
    body = (
      <g>
        <path d="M12 31 Q24 15 36 31" stroke={a} strokeWidth="10.5" fill="none" strokeLinecap="round" />
        <path d="M15 27.5 Q24 18 33 27.5" stroke="#FFFFFF44" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      </g>
    );
  } else if (k === "fritter") {
    body = (
      <g>
        <rect x="15.5" y="8" width="17" height="31" rx="7" fill="#EED9A8" stroke={I.crust} strokeWidth="1.5" />
        <path d="M20 13 v21 M24 12 v23 M28 13 v21" stroke={I.ham} strokeWidth="2.4" strokeLinecap="round" opacity=".85" />
      </g>
    );
  } else if (k === "can") {
    body = (
      <g>
        <rect x="15" y="11" width="18" height="28" rx="3" fill={a} />
        <rect x="15" y="20" width="18" height="9" fill={I.white} opacity=".9" />
        <ellipse cx="24" cy="11" rx="9" ry="2.6" fill="#C9C2B2" />
        <circle cx="24" cy="11" r="1.4" fill="#8F8878" />
      </g>
    );
  } else if (k === "bottle") {
    body = (
      <g>
        <path d="M20 16 L20 12 L28 12 L28 16 C31 18 32 21 32 25 L32 36 C32 38.8 30 40 24 40 C18 40 16 38.8 16 36 L16 25 C16 21 17 18 20 16 Z" fill="#DCE8EE" stroke="#AFC4CE" strokeWidth="1.4" />
        <rect x="17.5" y="24" width="13" height="10" fill={a} opacity=".9" />
        <rect x="19" y="8" width="10" height="4.6" rx="1.4" fill={a} />
      </g>
    );
  } else if (k === "coffee") {
    body = (
      <g>
        <path d="M14 14 L34 14 L31.5 40 L16.5 40 Z" fill={I.cream} stroke={I.crust} strokeWidth="1.6" />
        <rect x="12.5" y="10" width="23" height="4.6" rx="1.6" fill="#6E4526" />
        <path d="M15 22 L33 22 L32 31 L16 31 Z" fill={C.gold ? "#D8A63F" : "#D8A63F"} />
        <path d="M21 26.8 q1.4 -2.4 3 0 q1.6 2.2 3 0" stroke={I.ink ? "#1C1712" : "#1C1712"} strokeWidth="1.4" fill="none" strokeLinecap="round" />
      </g>
    );
  } else {
    body = (
      <g>
        <circle cx="24" cy="24" r="14" fill="none" stroke={C.gold} strokeWidth="2" />
        <text x="24" y="29" textAnchor="middle" fontSize="14" fill={C.gold} fontWeight="800">$</text>
      </g>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" style={{ flexShrink: 0, display: "block" }} aria-hidden="true">
      {body}
    </svg>
  );
}

const fmt = (n) => "$" + (Math.round(n * 100) / 100).toFixed(2);
const uid = () => "x" + Math.random().toString(36).slice(2, 9);
const store = typeof window !== "undefined" && window.storage ? window.storage : null;

const MONO = "'SF Mono', ui-monospace, Menlo, Consolas, monospace";
const DISPLAY = "'Anton', 'Arial Narrow', Impact, sans-serif";

export { ItemPic, FoodIcon };
