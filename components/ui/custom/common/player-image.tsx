const FALLBACK_SRC = "/player.svg"

export function PlayerImage({
  playerId,
  alt = "",
  className,
}: {
  playerId: number
  alt?: string
  className?: string
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/api/player/${playerId}/image`}
      alt={alt}
      className={className}
      onError={(event) => {
        const image = event.currentTarget
        if (!image.src.endsWith(FALLBACK_SRC)) {
          image.src = FALLBACK_SRC
        }
      }}
    />
  )
}
