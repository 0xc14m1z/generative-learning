export default function InlineSvg({ data }: { data: Record<string, unknown> }) {
  const svg = (data.svg ?? '') as string
  return <div className="[&>svg]:w-full [&>svg]:h-auto" dangerouslySetInnerHTML={{ __html: svg }} />
}
