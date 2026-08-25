/**
 * Structured data. Rendered from server components only, so the payload is
 * in the initial HTML where crawlers read it.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // Schema payloads are authored in this repo, never user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
