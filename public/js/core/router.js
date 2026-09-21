// Hash routes: #/today, #/letters/3 … The part after the name is passed on as params.
export function startRouter(routes, fallback, onRoute) {
  const go = () => {
    const [name, ...params] = location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
    onRoute(routes[name] ? name : fallback, params);
  };
  addEventListener("hashchange", go);
  go();
}
