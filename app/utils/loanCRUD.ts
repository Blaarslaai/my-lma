import { PrismaClient } from "@prisma/client";
import { LoanStatus } from "./LoanStatus";
import { LoanModel } from "./loanModel";

const prisma = new PrismaClient();

// Create Loan
export async function createLoan(loanDetails: LoanModel) {
  const newLoan = await prisma.loan.create({
    data: {
      customerName: loanDetails.customerName,
      customerEmail: loanDetails.customerEmail,
      customerPhone: loanDetails.customerPhone,
      customerSalary: loanDetails.customerSalary,
      loanAmount: loanDetails.loanAmount,
      interestRate: loanDetails.interestRate,
      loanTerm: loanDetails.loanTerm,
      startDate: loanDetails.startDate,
      endDate: loanDetails.endDate,
      monthlyPayment: loanDetails.monthlyPayment,
      totalRepayment: loanDetails.totalRepayment,
      outstandingAmount: loanDetails.outstandingAmount,
      loanStatus: loanDetails.loanStatus,
      createdAt: loanDetails.createdAt,
      updatedAt: loanDetails.updatedAt,
    },
  });
  console.log("Loan Created: ", newLoan);
}

// Get Loans
export async function getLoans() {
  const loans = await prisma.loan.findMany();
  console.log("All Loans: ", loans);
}

// Get Loan by ID
export async function getLoanById(loanId: number) {
  const loan = await prisma.loan.findUnique({
    where: {
      id: loanId,
    },
  });
  console.log("Loan Details: ", loan);
}

// Update Loan
export async function updateLoan(loanId: number) {
  const updatedLoan = await prisma.loan.update({
    where: {
      id: loanId,
    },
    data: {
      loanStatus: LoanStatus.APPROVED,
      outstandingAmount: 12000,
      updatedAt: new Date(),
    },
  });
  console.log("Updated Loan: ", updatedLoan);
}

// Delete Loan
export async function deleteLoan(loanId: number) {
  const deletedLoan = await prisma.loan.delete({
    where: {
      id: loanId,
    },
  });
  console.log("Deleted Loan: ", deletedLoan);
}
