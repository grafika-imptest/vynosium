import { jsonLdScript } from "@/lib/seo";

/** Renders one or more schema.org objects as inline JSON-LD script tags. */
export function JsonLd({ data }: { data: object | object[] }) {
  const items = Array.isArray(data) ? data : [data];
  return (
    <>
      {items.map((item, i) => (
        // eslint-disable-next-line react/no-danger
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(item)} />
      ))}
    </>
  );
}
