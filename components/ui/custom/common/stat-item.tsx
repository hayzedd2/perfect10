export function StatItem({
  label,
  value,
  highlight,
}: {
  label: string
  value?: string | number | null
  highlight?: boolean
}) {
  if (value === undefined || value === null) return null

  return (
    <div className="bg-white/5 px-3 py-2">
      <p className="text-[10px] tracking-wider text-white/30 uppercase">
        {label}
      </p>
      <p
        className={`text-sm font-semibold ${
          highlight && Number(value) > 0 ? "text-green-400" : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  )
}
