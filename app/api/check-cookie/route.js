import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = cookies();
  const hasConsent = await cookieStore.get("cookieConsent");

  return Response.json({ hasConsent: !!hasConsent });
}
