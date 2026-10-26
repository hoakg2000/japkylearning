/** Structured data for SEO. The only allowed dangerouslySetInnerHTML (ADR 0013): JSON with `<` escaped. */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  // eslint-disable-next-line react/no-danger
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\u003c') }} />;
}
