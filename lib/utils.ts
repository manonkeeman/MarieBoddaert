export function getReadingTime(content: string, portableContent?: any[]): number {
  let text = ''
  if (portableContent && portableContent.length > 0) {
    text = portableContent
      .filter((b: any) => b._type === 'block')
      .flatMap((b: any) => b.children ?? [])
      .map((c: any) => c.text ?? '')
      .join(' ')
  } else {
    text = content.replace(/<[^>]+>/g, '')
  }
  const words = text.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}
