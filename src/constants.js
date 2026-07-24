// ————— Laverton Award Bakery — Cashier Till v2 —————
// Shared constants, styles, and helpers

export const C = {
  bg: "#151210",
  panel: "#201C17",
  panelUp: "#2A2520",
  line: "#332D25",
  gold: "#D8A63F",
  goldDim: "#8A6F2E",
  cream: "#F5EDDB",
  muted: "#9C907A",
  ink: "#1C1712",
  red: "#E06A5A",
};;

export const CATS = ["Pies", "Sandwiches", "Rolls & Buns", "Sweets", "Hot Food", "Drinks"];;

// ————— illustration palette —————
const I = {
  pastry: "#E8B95B", crust: "#C08A3E", dark: "#7A5222", biscuit: "#E4C98C",
  cream: "#FFF3DC", white: "#FBF6EA", choc: "#4A2F1D", milk: "#6E4526",
  caramel: "#C97F35", pink: "#F09CB4", red: "#D8483A", jam: "#B83A34",
  yellow: "#F2CE4B", green: "#7FA85A", avo: "#A9C070", bread: "#F3DCA8",
  meat: "#6B3A20", chick: "#F5E6C8", ham: "#F1A9B8", grey: "#B9AE99",
};

// item id → [kind, param1, param2]
const ICONS = {
  p01: ["pie", I.meat], p02: ["pie", I.yellow], p03: ["pie", "#3A3A3A"],
  p04: ["pie", "#C9B49A"], p05: ["pie", I.red], p06: ["pie", I.green],
  p07: ["pie", I.yellow], p08: ["pie", "#8A4A2A"], p09: ["pie", I.yellow],
  p10: ["pie", "#3A3A3A"], p11: ["pie", "#C9B49A"], p12: ["pie", I.chick],
  p13: ["pie", "#E0862F"], p14: ["pie", I.yellow], p15: ["pie", I.gold ? I.caramel : I.caramel],
  p16: ["pieSmall", "#8A4A2A"], p17: ["pieSmall", I.cream], p18: ["sroll"],
  s01: ["sandwich", I.ham, I.yellow], s02: ["sandwich", I.yellow, I.green],
  s03: ["sandwich", I.red, I.yellow], s04: ["sandwich", I.ham, I.yellow],
  s05: ["sandwich", I.ham, I.red], s06: ["sandwich", I.ham, I.green],
  s07: ["sandwich", I.chick, I.cream], s08: ["sandwich", I.chick, I.green],
  s09: ["sandwich", I.meat, I.caramel], s10: ["sandwich", I.chick, I.avo],
  s11: ["fruitcup"],
  s12: ["sandwich", I.yellow, I.cream], s13: ["sandwich", I.ham, I.yellow],
  s14: ["sandwich", "#E0A93E", I.yellow], s15: ["sandwich", "#E0A93E", I.green],
  s16: ["sandwich", I.chick, I.green], s17: ["sandwich", I.ham, I.green],
  s18: ["sandwich", I.meat, I.green], s19: ["sandwich", "#A33B3B", I.green],
  r01: ["roll", I.green, I.red], r02: ["roll", "#A33B3B", I.green],
  r07: ["roll", I.ham, I.green], r08: ["roll", I.meat, I.red],
  r09: ["roll", I.chick, I.cream], r10: ["roll", I.chick, "#A33B3B"],
  r03: ["roll", I.red, I.avo], r04: ["roll", I.chick, I.avo],
  r05: ["roll", I.ham, I.green], r06: ["roll", I.yellow, I.red],
  d01: ["donut", I.jam, null], d02: ["donut", I.jam, I.choc],
  d03: ["donut", "#B9CF7E", null], d04: ["donut", I.milk, null],
  d05: ["ringdonut"], d06: ["turnover", false], d07: ["turnover", true],
  d08: ["lamington", I.choc, false], d09: ["lamington", I.choc, true],
  d10: ["slice", "#5A3A26", I.caramel, "flake"], d11: ["slice", "#5A3A26", I.caramel, null],
  d12: ["slice", "#7A4A26", I.caramel, "drizzle"], d13: ["slice", "#2E2622", I.caramel, "drizzle"],
  d14: ["slice", "#5A3A26", I.caramel, "coconut"], d15: ["slice", "#D9A648", I.biscuit, null],
  d16: ["slice", I.yellow, I.biscuit, "drizzle"], d17: ["lolly"],
  d18: ["rockyroad"], d19: ["slice", I.white, I.choc, "flake"],
  d20: ["slice", "#2E2622", I.white, "coconut"], d21: ["slice", "#3A2418", "#4A2F1D", null],
  d22: ["cake", I.red, I.white], d23: ["cake", I.white, "#8A5A2E"],
  d24: ["cake", "#C9955A", "#E8D29A"], d25: ["tart", "#F2D98A", null],
  d26: ["tart", I.pink, I.choc], d27: ["yoyo"], d28: ["tart", I.jam, null],
  d29: ["tart", I.yellow, null], d30: ["gingerman"], d31: ["cookie"],
  d32: ["marshstick"], d33: ["log"],
  h01: ["corndog"], h02: ["potatocake"], h03: ["hashbrown"], h04: ["dimsim"],
  h05: ["springroll"], h06: ["wing"], h07: ["sausage", "#D8483A"],
  h08: ["sausage", "#F0C88A"], h09: ["fritter"],
  h10: ["fritter"], h11: ["dimsim"], h12: ["wing"], h13: ["fritter"],
  h14: ["sroll"], h15: ["sandwich", I.red, I.yellow], h16: ["sandwich", I.red, I.yellow],
  h17: ["roll", I.red, I.yellow], h18: ["roll", I.red, I.yellow],
  k01: ["can", "#C8402F"], k02: ["can", "#E8B84A"], k03: ["bottle", "#C8402F"],
  k04: ["bottle", "#7FB2D8"], k05: ["coffee"], k06: ["bottle", "#8A5A34"],
};
const CAT_FALLBACK = {
  "Pies": ["pie", I.meat], "Sandwiches": ["sandwich", I.ham, I.green],
  "Rolls & Buns": ["roll", I.green, I.red], "Sweets": ["slice", I.caramel, I.biscuit, null],
  "Hot Food": ["potatocake"], "Drinks": ["can", "#9C907A"],
};

const fmt = (n) => "$" + (Math.round(n * 100) / 100).toFixed(2);
const uid = () => "x" + Math.random().toString(36).slice(2, 9);

const MONO = "'SF Mono', ui-monospace, Menlo, Consolas, monospace";
const DISPLAY = "'Anton', 'Arial Narrow', Impact, sans-serif";

const inputStyle = { width: "100%", background: "#151210", border: "1px solid #332D25", color: "#F5EDDB", borderRadius: 10, padding: "12px 12px", fontSize: 16, margin: "5px 0 12px" };


export { I, ICONS, CAT_FALLBACK, fmt, uid, MONO, DISPLAY, inputStyle };
