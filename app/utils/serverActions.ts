"use server";

import { cookies } from "next/headers";

// Function to set the cookie
export async function acceptCookies() {
  (await cookies()).set("cookieConsent", "true", {
    httpOnly: true,
    path: "/",
    maxAge: 365 * 24 * 60 * 60, // 1 year
  });

  return { success: true };
}

export async function calculateLoanPayment(
  customersalary: number,
  loanamount: number,
  loanterm: number,
  interestrate: number,
  startdate: Date
) {
  try {
    const baseUrl = process.env.OLLAMA_BASE_URL;

    if (!baseUrl) {
      throw new Error("OLLAMA_BASE_URL is not set in environment variables.");
    }

    if (
      !customersalary ||
      !loanamount ||
      !loanterm ||
      !interestrate ||
      !startdate
    ) {
      return { error: "Missing required fields" };
    }

    // AI Prompt
    const prompt = `
      Given a loan with:
      - Salary: ${customersalary}
      - Loan Amount: ${loanamount}
      - Interest Rate: ${interestrate}%
      - Loan Term: ${loanterm} months
      - Start Date: ${startdate}

      Calculate:
      - The monthly payment amount.
      - The total repayment amount.
      - The calculated end date (Make sure the day value is the same as the day value in startdate, only count up the months with the loan term).

      Only supply the three values as follows:
      monthlypayment: 0, totalrepayment: 0, enddate: "".

      Make sure that the response ONLY contains the three values as described above.
    `;

    // Send request to Ollama API
    const response = await fetch(`${baseUrl}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "llama3:latest", prompt }),
    });

    if (!response.ok) {
      throw new Error("Failed to get AI response");
    }

    const data = await response.text();

    return { result: data };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unknown error" };
  }
}
