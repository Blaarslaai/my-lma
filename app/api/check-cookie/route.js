import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const hasConsent = cookieStore.get("cookieConsent");

  return Response.json({ hasConsent: !!hasConsent });
}
