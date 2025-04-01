"use client";

import { LoanStatus } from "@/app/utils/LoanStatus";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";

export default function CreateEditLoan() {
  const { theme } = useTheme();

  const [values, setValues] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerSalary: 0,
    loanAmount: 0,
    interestRate: [17],
    loanTerm: 0,
    startDate: new Date(),
    endDate: new Date(),
    monthlyPayment: 0,
    totalRepayment: 0,
    loanStatus: LoanStatus,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement> | { name: string; value: number[] }
  ) => {
    if ("target" in e) {
      setValues((prev) => {
        return {
          ...prev,
          [e.target.name]: e.target.value, // Set the new value
        };
      });
    } else {
      setValues((prev) => {
        return {
          ...prev,
          interestRate: e.value, // Handle Slider value
        };
      });
    }
  };

  const handleSliderChange = (
    e: React.ChangeEvent<HTMLInputElement> | { name: string; value: number[] }
  ) => {
    if ("target" in e) {
      setValues((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    }
  };

  const handlePhoneChange = (e: {
    target: { name: string; value: string };
  }) => {
    let rawValue = e.target.value.replace(/[^0-9]/g, ""); // Remove non-numeric characters

    // Format the number according to the pattern (012) 345 6789
    if (rawValue.length <= 3) {
      rawValue = `(${rawValue}`;
    } else if (rawValue.length <= 6) {
      rawValue = `(${rawValue.slice(0, 3)}) ${rawValue.slice(3)}`;
    } else {
      rawValue = `(${rawValue.slice(0, 3)}) ${rawValue.slice(
        3,
        6
      )} ${rawValue.slice(6, 10)}`;
    }

    setValues((prev) => {
      return {
        ...prev,
        [e.target.name]: rawValue,
      };
    });
  };

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
              value={values.customerName}
              onChange={handleChange}
            />
          </div>
          <Label htmlFor="customerEmail">Customer Email</Label>
          <div className="mb-5">
            <Input
              type="email"
              name="customerEmail"
              value={values.customerEmail}
              onChange={handleChange}
            />
          </div>
          <Label htmlFor="customerPhone">Customer Phone Number</Label>
          <div className="mb-5">
            <Input
              type="text"
              placeholder="(012) 345 6789"
              name="customerPhone"
              maxLength={14}
              value={values.customerPhone}
              onChange={handlePhoneChange}
            />
          </div>
          <Label htmlFor="customerSalary">Customer Salary</Label>
          <div className="mb-10">
            <Input
              type="number"
              name="customerSalary"
              value={values.customerSalary}
              onChange={handleChange}
            />
          </div>
          <h1 className="text-2xl">Loan Details</h1>
          <Label htmlFor="loanAmount">Loan Amount</Label>
          <div className="mb-5">
            <Input
              type="number"
              name="loanAmount"
              value={values.loanAmount}
              onChange={handleChange}
            />
          </div>
          <Label htmlFor="loanTerm">
            Interest Rate ({values.interestRate}%)
          </Label>
          <div className="mb-5">
            <Slider
              max={100}
              step={1}
              name="interestRate"
              value={values.interestRate}
              onValueChange={(value) =>
                handleSliderChange({ name: "interestRate", value })
              }
              className={`${theme === "light" ? "bg-black" : "bg-white"} mt-5`}
            />
          </div>
          <Label htmlFor="loanTerm">Loan Term (Months)</Label>
          <div className="mb-5">
            <Input
              type="number"
              name="loanTerm"
              value={values.loanTerm}
              onChange={handleChange}
            />
          </div>

          <Label>Loan Start Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant={"outline"}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {values.startDate ? (
                  format(new Date(values.startDate), "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 z-10 bg-gray-100">
              <Calendar
                mode="single"
                selected={values.startDate}
                onSelect={(date) =>
                  setValues((prev) => ({
                    ...prev,
                    startDate: date || prev.startDate,
                  }))
                }
                initialFocus
              />
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
              value={values.monthlyPayment}
              onChange={handleChange}
            />
          </div>
          <Label htmlFor="totalRepayment">Total Repayment</Label>
          <div className="mb-5">
            <Input
              type="number"
              name="totalRepayment"
              value={values.totalRepayment}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Loan End Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant={"outline"}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {values.endDate ? (
                    format(new Date(values.endDate), "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-10 bg-gray-100">
                <Calendar
                  mode="single"
                  selected={values.endDate}
                  onSelect={(date) =>
                    setValues((prev) => ({
                      ...prev,
                      endDate: date || prev.endDate,
                    }))
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="mt-auto">
            <Button className="bg-yellow-400 float-end">
              Calculate Values with AI
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
