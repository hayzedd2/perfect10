export function TeamImage({
  teamId,
  alt = "",
  className,
}: {
  teamId: number
  alt?: string
  className?: string
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/api/team/${teamId}/image`}
      alt={alt}
      className={className}
      onError={(event) => {
        event.currentTarget.style.display = "none"
      }}
    />
  )
}
