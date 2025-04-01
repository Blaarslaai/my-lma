"use server";

import { PrismaClient } from "@prisma/client";
import { LoanStatus } from "./LoanStatus";
import { LoanModel } from "./loanModel";

const prisma = new PrismaClient();

// Create Loan
export async function createLoan(loanDetails: LoanModel) {
  const newLoan = await prisma.loan.create({
    data: {
      customername: loanDetails.customername,
      customeremail: loanDetails.customeremail,
      customerphone: loanDetails.customerphone,
      customersalary: loanDetails.customersalary,
      loanamount: loanDetails.loanamount,
      interestrate: loanDetails.interestrate,
      loanterm: loanDetails.loanterm,
      startdate: loanDetails.startdate,
      enddate: loanDetails.enddate,
      monthlypayment: loanDetails.monthlypayment,
      totalrepayment: loanDetails.totalrepayment,
      outstandingamount: loanDetails.outstandingamount,
      loanstatus: loanDetails.loanstatus,
      createdat: loanDetails.createdat,
      updatedat: loanDetails.updatedat,
    },
  });
  console.log("Loan Created: ", newLoan);
}

// Get Loans
export async function getLoans() {
  const loans = await prisma.loan.findMany();
  return loans;
}

// Get Loan by ID
export async function getLoanById(loanId: number) {
  const loan = await prisma.loan.findUnique({
    where: {
      id: loanId,
    },
  });
  return loan;
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
  return updatedLoan;
}

// Delete Loan
export async function deleteLoan(loanId: number) {
  const deletedLoan = await prisma.loan.delete({
    where: {
      id: loanId,
    },
  });
  return deletedLoan;
}
