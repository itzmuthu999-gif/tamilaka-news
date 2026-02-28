/* ---------- helper logger ---------- */
export const logState = (state, actionName) => {
  console.log(`📦 PAGE LAYOUT UPDATED → ${actionName}`);
  console.log(JSON.parse(JSON.stringify(state)));
};