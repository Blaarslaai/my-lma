"use server";

import { PrismaClient } from "@prisma/client";
import { LoanModel } from "./loanModel";
import { LoanStatus } from "./LoanStatus";

const prisma = new PrismaClient();

// Create Loan
export async function createLoan(loanDetails: LoanModel) {
  const newLoan = await prisma.loan.create({
    data: {
      customername: loanDetails.customername,
      customeremail: loanDetails.customeremail,
      customerphone: loanDetails.customerphone,
      customersalary: Number(loanDetails.customersalary),
      loanamount: Number(loanDetails.loanamount),
      interestrate: loanDetails.interestrate,
      loanterm: Number(loanDetails.loanterm),
      startdate: loanDetails.startdate,
      enddate: loanDetails.enddate,
      monthlypayment: Number(loanDetails.monthlypayment),
      totalrepayment: Number(loanDetails.totalrepayment),
      loanstatus: LoanStatus[loanDetails.loanstatus as keyof typeof LoanStatus],
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
export async function updateLoan(loanDetails: LoanModel) {
  const updatedLoan = await prisma.loan.update({
    where: {
      id: loanDetails.id,
    },
    data: {
      customername: loanDetails.customername,
      customeremail: loanDetails.customeremail,
      customerphone: loanDetails.customerphone,
      customersalary: Number(loanDetails.customersalary),
      loanamount: Number(loanDetails.loanamount),
      interestrate: loanDetails.interestrate,
      loanterm: Number(loanDetails.loanterm),
      startdate: loanDetails.startdate,
      enddate: loanDetails.enddate,
      monthlypayment: Number(loanDetails.monthlypayment),
      totalrepayment: Number(loanDetails.totalrepayment),
      loanstatus: LoanStatus[loanDetails.loanstatus as keyof typeof LoanStatus],
      updatedat: loanDetails.updatedat,
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
