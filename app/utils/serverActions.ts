"use server";

import { cookies } from "next/headers";

// Function to set the cookie
export async function acceptCookies() {
  (await cookies()).set("cookieConsent", "true", {
    httpOnly: true, // More secure
    path: "/",
    maxAge: 365 * 24 * 60 * 60, // 1 year
  });
}
