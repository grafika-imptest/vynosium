/**
 * Lead submission, in one place.
 *
 * The site is a static export: there is no server of ours to post to, so a
 * lead needs an endpoint configured at build time (a form service, or the
 * client's own API / CRM).
 *
 * NEXT_PUBLIC_LEAD_ENDPOINT is not set in this prototype, and the important
 * part is what happens then. The contact form used to show "Děkujeme,
 * ozveme se do jednoho pracovního dne" whether or not anything left the
 * browser — so a prototype demo, or a launch with the variable forgotten,
 * looked exactly like a working form while dropping every enquiry on the
 * floor. That is the one failure mode a lead form must not have.
 *
 * So the result is explicit: a caller has to handle "not-configured"
 * separately from "sent" and say so on screen.
 */
export const LEAD_ENDPOINT = process.env.NEXT_PUBLIC_LEAD_ENDPOINT;

export type LeadResult = "sent" | "not-configured" | "error";

export async function submitLead(payload: Record<string, string>): Promise<LeadResult> {
  if (!LEAD_ENDPOINT) return "not-configured";

  try {
    const response = await fetch(LEAD_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return response.ok ? "sent" : "error";
  } catch {
    return "error";
  }
}
