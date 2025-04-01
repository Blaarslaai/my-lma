import { LoanStatus } from "./LoanStatus"; // Make sure to import the LoanStatus enum

export interface LoanModel {
  id: number;
  customername: string;
  customeremail: string;
  customerphone: string;
  customersalary: number;
  loanamount: number;
  interestrate: number[];
  loanterm: number;
  startdate: Date;
  enddate: Date;
  monthlypayment: number;
  totalrepayment: number;
  loanstatus: LoanStatus;
  createdat: Date;
  updatedat: Date;
}
