export default function GradientText({
  children,
  className = "",
  colors = ["#ffaa40", "#9c40ff", "#ffaa40"],
  animationSpeed = 8,
  showBorder = false,
}) {
  const gradientStyle = {
    backgroundImage: `linear-gradient(90deg, ${colors.join(", ")})`,
    backgroundSize: "300% 100%",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    color: "transparent",
    "--speed": `${animationSpeed}s`,
  };

  return (
    <span
      className={`inline-block animate-gradient ${className}`}
      style={gradientStyle}
    >
      {children}
    </span>
  );
}
