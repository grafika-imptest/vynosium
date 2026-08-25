export function Hairline({
  tone = "dark",
  orientation = "horizontal",
  className = "",
}: {
  tone?: "dark" | "light";
  orientation?: "horizontal" | "vertical";
  className?: string;
}) {
  const color = tone === "dark" ? "border-steel" : "border-light-gray";
  const dim = orientation === "horizontal" ? "w-full border-t" : "h-full border-l";
  return <div aria-hidden="true" className={`${dim} ${color} ${className}`} />;
}
