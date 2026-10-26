export function formatPosition(position?: string): string | undefined {
  switch (position) {
    case "F":
      return "Forward"
    case "M":
      return "Midfielder"
    case "D":
      return "Defender"
    case "G":
      return "Goalkeeper"
    default:
      return position
  }
}
