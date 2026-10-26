export { cn } from "cn"

export function truncate(text: string, maxLength: number): string {
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text
}

export function formatMatchDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function getRatingBg(rating: number): string {
  if (rating >= 9.0) return "bg-[#2F41BF]"
  if (rating >= 8.0) return "bg-[#01ADC4]"
  if (rating >= 7.0) return "bg-[#01C424]"
  if (rating >= 6.5) return "bg-[#D9AF01]"
  if (rating >= 6.0) return "bg-[#ED7E07]"
  return "bg-[#CD0B01]"
}
