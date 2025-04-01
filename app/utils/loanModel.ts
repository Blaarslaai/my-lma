import { LoanStatus } from "./LoanStatus"; // Make sure to import the LoanStatus enum

export interface LoanModel {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerSalary: number;
  loanAmount: number;
  interestRate: number;
  loanTerm: number;
  startDate: Date;
  endDate: Date;
  monthlyPayment: number;
  totalRepayment: number;
  outstandingAmount: number;
  loanStatus: LoanStatus;
  createdAt: Date;
  updatedAt: Date;
}
