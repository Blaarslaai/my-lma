"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { LoanModel } from "@/app/utils/loanModel";
import { getLoanById } from "@/app/utils/loanCRUD";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

export default function LoanDetails() {
  const { id } = useParams(); // Get loan ID from URL
  const [loan, setLoan] = useState<LoanModel | null>(null);

  useEffect(() => {
    async function fetchLoan() {
      if (id) {
        const data = await getLoanById(Number(id)); // Fetch loan data
        setLoan(data);
      }
    }

    fetchLoan();
  }, [id]);

  if (!loan) {
    return <p>Loading loan details...</p>;
  }

  return (
    <>
      <div className="flex flex-row mt-5">
        <div className="flex-1 mr-5">
          <h1 className="text-2xl">Customer Details</h1>
          <Label htmlFor="customerName">Customer Name</Label>
          <div className="mb-5">
            <Input
              type="text"
              name="customerName"
              defaultValue={loan.customername}
              readOnly
            />
          </div>
          <Label htmlFor="customerEmail">Customer Email</Label>
          <div className="mb-5">
            <Input
              type="email"
              name="customerEmail"
              defaultValue={loan.customeremail}
              readOnly
            />
          </div>
          <Label htmlFor="customerPhone">Customer Phone Number</Label>
          <div className="mb-5">
            <Input
              type="text"
              placeholder="(012) 345 6789"
              name="customerPhone"
              maxLength={14}
              defaultValue={loan.customerphone}
              readOnly
            />
          </div>
          <Label htmlFor="customerSalary">Customer Salary</Label>
          <div className="mb-10">
            <Input
              type="number"
              name="customerSalary"
              defaultValue={loan.customersalary}
              readOnly
            />
          </div>
          <h1 className="text-2xl">Loan Details</h1>
          <Label htmlFor="loanAmount">Loan Amount</Label>
          <div className="mb-5">
            <Input
              type="number"
              name="loanAmount"
              defaultValue={loan.loanamount}
              readOnly
            />
          </div>
          <Label htmlFor="interestrate" className="mb-5">
            Interest Rate ({loan.interestrate}%)
          </Label>
          <Label htmlFor="loanTerm">Loan Term (Months)</Label>
          <div className="mb-5">
            <Input
              type="number"
              name="loanTerm"
              defaultValue={loan.loanterm}
              readOnly
            />
          </div>

          <Label>Loan Start Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant={"outline"}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {loan.startdate ? (
                  format(new Date(loan.startdate), "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 z-10 bg-gray-100">
              <Calendar mode="single" selected={loan.startdate} initialFocus />
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex-1 flex flex-col">
          <h1 className="text-2xl">Calculated Details</h1>
          <Label htmlFor="monthlyPayment">Monthly Payment</Label>
          <div className="mb-5">
            <Input
              type="number"
              name="monthlyPayment"
              defaultValue={loan.monthlypayment}
              readOnly
            />
          </div>
          <Label htmlFor="totalRepayment">Total Repayment</Label>
          <div className="mb-5">
            <Input
              type="number"
              name="totalRepayment"
              defaultValue={loan.totalrepayment}
              readOnly
            />
          </div>
          <div>
            <Label>Loan End Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant={"outline"}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {loan.enddate ? (
                    format(new Date(loan.enddate), "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-10 bg-gray-100">
                <Calendar mode="single" selected={loan.enddate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
          <div className="mt-auto">
            <Button className="bg-yellow-400 float-end">
              Edit Loan Details
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
