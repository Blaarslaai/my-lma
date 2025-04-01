import { NextResponse } from "next/server";
import "dotenv/config";

export async function POST(req: Request) {
  try {
    const baseUrl = process.env.OLLAMA_BASE_URL;
    const { customersalary, loanamount, loanterm, interestrate, startdate } =
      await req.json();

    if (
      !customersalary ||
      !loanamount ||
      !loanterm ||
      !interestrate ||
      !startdate
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // AI Prompt
    const prompt = `
      Given a loan with:
      - Salary: ${customersalary}
      - Loan Amount: ${loanamount}
      - Interest Rate: ${interestrate}%
      - Loan Term: ${loanterm} months
      - Start Date: ${startdate} months

      Calculate:
      - The monthly payment amount
      - The total repayment amount
      - Any financial insights

      Only supply the three values in the order 
    `;

    // Send request to Ollama
    const response = await fetch(baseUrl + "/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "llama3:latest", prompt }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to get AI response" },
        { status: 500 }
      );
    }

    const data = await response.text();

    return NextResponse.json({ result: data });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
