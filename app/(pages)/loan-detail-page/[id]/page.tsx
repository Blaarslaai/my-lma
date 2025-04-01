"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { LoanModel } from "@/app/utils/loanModel";
import { getLoanById, updateLoan } from "@/app/utils/loanCRUD";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { LoanStatus } from "@/app/utils/LoanStatus";
import { Slider } from "@/components/ui/slider";
import { useTheme } from "next-themes";

export default function LoanDetails() {
  const { theme } = useTheme();
  const { id } = useParams(); // Get loan ID from URL
  const [loan, setLoan] = useState<LoanModel>({
    id: 0,
    customername: "",
    customeremail: "",
    customerphone: "",
    customersalary: 0,
    loanamount: 0,
    interestrate: [17],
    loanterm: 0,
    startdate: new Date(),
    enddate: new Date(),
    monthlypayment: 0,
    totalrepayment: 0,
    loanstatus: LoanStatus.PENDING,
    createdat: new Date(),
    updatedat: new Date(),
  });

  useEffect(() => {
    async function fetchLoan() {
      if (id) {
        const data = await getLoanById(Number(id)); // Fetch loan data
        if (data) {
          setLoan({
            ...data,
            loanstatus: LoanStatus[data.loanstatus as keyof typeof LoanStatus],
            createdat: data.createdat ? new Date(data.createdat) : new Date(),
            updatedat: data.updatedat ? new Date(data.updatedat) : new Date(),
          });
        }
      }
    }

    fetchLoan();
  }, [id]);

  async function editLoan() {
    if (loan) {
      console.log(loan);
      await updateLoan(loan);
    }
  }

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | { name: string; value: number[] | string | number }
  ) => {
    if ("target" in e) {
      // Handle input change
      setLoan((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    } else {
      // Handle slider change
      setLoan((prev) => ({
        ...prev,
        [e.name]: e.value,
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

    setLoan((prev) => ({
      ...prev,
      [e.target.name]: rawValue,
    }));
  };

  if (!loan) {
    return <p>Loading loan details...</p>;
  }

  return (
    <>
      <div className="flex flex-row mt-5">
        <div className="flex-1 mr-5">
          <h1 className="text-2xl">Customer Details</h1>
          <Label htmlFor="customername">Customer Name</Label>
          <div className="mb-5">
            <Input
              type="text"
              name="customername"
              value={loan.customername}
              onChange={handleChange}
            />
          </div>
          <Label htmlFor="customeremail">Customer Email</Label>
          <div className="mb-5">
            <Input
              type="email"
              name="customeremail"
              value={loan.customeremail}
              onChange={handleChange}
            />
          </div>
          <Label htmlFor="customerphone">Customer Phone Number</Label>
          <div className="mb-5">
            <Input
              type="text"
              placeholder="(012) 345 6789"
              name="customerphone"
              maxLength={14}
              value={loan.customerphone}
              onChange={handlePhoneChange}
            />
          </div>
          <Label htmlFor="customersalary">Customer Salary</Label>
          <div className="mb-10">
            <Input
              type="number"
              name="customersalary"
              value={loan.customersalary}
              onChange={handleChange}
            />
          </div>
          <h1 className="text-2xl">Loan Details</h1>
          <Label htmlFor="loanamount">Loan Amount</Label>
          <div className="mb-5">
            <Input
              type="number"
              name="loanamount"
              value={loan.loanamount}
              onChange={handleChange}
            />
          </div>
          <Label htmlFor="interestrate">
            Interest Rate ({loan.interestrate}%)
          </Label>
          <div className="mb-5">
            <Slider
              max={100}
              step={1}
              name="interestrate"
              value={loan.interestrate}
              onValueChange={(value) =>
                handleChange({ name: "interestrate", value })
              }
              className={`${theme === "light" ? "bg-black" : "bg-white"} mt-5`}
            />
          </div>
          <Label htmlFor="loanterm">Loan Term (Months)</Label>
          <div className="mb-5">
            <Input
              type="number"
              name="loanterm"
              value={loan.loanterm}
              onChange={handleChange}
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
              <Calendar
                mode="single"
                selected={new Date(loan.startdate)}
                onSelect={(date) =>
                  setLoan((prev) => ({
                    ...prev,
                    startdate: date || prev.startdate,
                  }))
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex-1 flex flex-col">
          <h1 className="text-2xl">Calculated Details</h1>
          <Label htmlFor="monthlypayment">Monthly Payment</Label>
          <div className="mb-5">
            <Input
              type="number"
              name="monthlypayment"
              value={loan.monthlypayment}
              onChange={handleChange}
            />
          </div>
          <Label htmlFor="totalrepayment">Total Repayment</Label>
          <div className="mb-5">
            <Input
              type="number"
              name="totalrepayment"
              value={loan.totalrepayment}
              onChange={handleChange}
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
                <Calendar
                  mode="single"
                  selected={new Date(loan.enddate)}
                  onSelect={(date) =>
                    setLoan((prev) => ({
                      ...prev,
                      enddate: date || prev.enddate,
                    }))
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="mt-auto">
            <Button className="bg-yellow-400 float-end" onClick={editLoan}>
              Edit Loan Details
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
