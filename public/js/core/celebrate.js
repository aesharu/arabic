// A small burst of Sadu colours when something is finished (a story read, a perfect round, a step on the path).
// Nothing at all when the device asks for reduced motion.
const COLORS = ["#9E2A2B", "#F3E7CF", "#231A14", "#006C35", "#D4A437"];

export function celebrate(from) {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const r = from?.getBoundingClientRect?.() ?? { left: innerWidth / 2, top: innerHeight / 2, width: 0, height: 0 };
  const x = r.left + r.width / 2;
  const y = r.top + r.height / 2;
  for (let i = 0; i < 20; i++) {
    const s = document.createElement("span");
    s.className = "confetti";
    s.style.cssText = `left:${x}px;top:${y}px;background:${COLORS[i % COLORS.length]}`;
    document.body.append(s);
    const a = (Math.PI * 2 * i) / 20 + Math.random() * 0.4;
    const d = 50 + Math.random() * 80;
    const dx = Math.cos(a) * d;
    const dy = Math.sin(a) * d * 0.8 + 50;
    s.animate(
      [
        { transform: "translate(-50%, -50%) rotate(45deg) scale(1)", opacity: 1 },
        { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) rotate(${220 + Math.random() * 220}deg) scale(.5)`, opacity: 0 },
      ],
      { duration: 850 + Math.random() * 350, easing: "cubic-bezier(.2, .7, .3, 1)" },
    ).onfinish = () => s.remove();
  }
}
