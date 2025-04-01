import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const baseUrl = process.env.OLLAMA_BASE_URL;
    const { customersalary, loanamount, loanterm, interestrate } =
      await req.json();

    if (!customersalary || !loanamount || !loanterm || !interestrate) {
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

      Calculate:
      - The monthly payment amount
      - The total repayment amount
      - Any financial insights
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

    const data = await response.json();

    return NextResponse.json({ result: data.response });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
