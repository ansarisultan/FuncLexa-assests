export function buildTailwindClasses(params) {
  const {
    bgOpacity, blur, borderWidth, borderOpacity, shadowSize, shadowOpacity, radius, gradientStart, gradientStop, gradientAngle
  } = params;

  const bgClass = bgOpacity < 0.1 ? 'bg-slate-900/20' : bgOpacity < 0.2 ? 'bg-slate-900/30' : 'bg-slate-900/40';
  const blurClass = blur > 0 ? `backdrop-blur-[${blur}px]` : '';
  const borderClass = borderWidth > 0 ? `border border-slate-400/${Math.round(borderOpacity * 100)}` : '';
  const shadowClass = shadowSize > 0 ? `shadow-[0_${shadowSize}px_${shadowSize * 2}px_rgba(0,0,0,${shadowOpacity})]` : '';
  const roundedClass = `rounded-[${radius}px]`;
  const gradientClass = `bg-gradient-to-br from-[${gradientStart}]/20 to-[${gradientStop}]/20`;

  return `export const Card = () => (
  <div className="${bgClass} ${blurClass} ${borderClass} ${shadowClass} ${roundedClass} ${gradientClass} p-8">
    <h3 className="text-xl font-semibold text-white">Your Component</h3>
    <p className="text-slate-400 mt-2">Dynamic UI element</p>
  </div>
);`;
}
