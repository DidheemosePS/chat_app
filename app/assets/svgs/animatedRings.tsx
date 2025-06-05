export default function AnimatedRings() {
  return (
    <svg viewBox="0 0 240 240" height="120" width="120">
      <circle
        strokeLinecap="round"
        strokeDashoffset="-330"
        strokeDasharray="0 660"
        strokeWidth="20"
        stroke="#f42f25"
        fill="none"
        r="105"
        cy="120"
        cx="120"
        className="animate-ringA"
      ></circle>
      <circle
        strokeLinecap="round"
        strokeDashoffset="-110"
        strokeDasharray="0 220"
        strokeWidth="20"
        stroke="#ffdd00"
        fill="none"
        r="35"
        cy="120"
        cx="120"
        className="animate-ringB"
      ></circle>
      <circle
        strokeLinecap="round"
        strokeDasharray="0 440"
        strokeWidth="20"
        stroke="#255ff4"
        fill="none"
        r="70"
        cy="120"
        cx="85"
        className="animate-ringC"
      ></circle>
      <circle
        strokeLinecap="round"
        strokeDasharray="0 440"
        strokeWidth="20"
        stroke="#2cf425"
        fill="none"
        r="70"
        cy="120"
        cx="155"
        className="animate-ringD"
      ></circle>
    </svg>
  );
}
