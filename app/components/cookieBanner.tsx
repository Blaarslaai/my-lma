"use client";

import { useState, useEffect } from "react";
import { acceptCookies } from "../utils/serverActions";

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Read the cookie from the server (via an API call)
    async function checkCookie() {
      const res = await fetch("/api/check-cookie");
      const data = await res.json();

      if (!data.hasConsent) {
        setShowBanner(true);
      }
    }

    checkCookie();
  }, []);

  const handleAccept = async () => {
    await acceptCookies();
    setShowBanner(false);
  };

  return showBanner ? (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 flex justify-between items-center">
      <p className="text-sm">
        We use cookies to improve your experience. By continuing, you agree to
        our cookie policy.
      </p>
      <button
        onClick={handleAccept}
        className="bg-blue-500 px-4 py-2 text-white rounded"
      >
        Accept
      </button>
    </div>
  ) : null;
}
