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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import "dotenv/config";
import { createLoan } from "@/app/utils/loanCRUD";

export default function CreateEditLoan() {
  const { theme } = useTheme();
  const environment = process.env.NEXT_PUBLIC_ENV;

  const [values, setValues] = useState({
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
  });

  async function createNewLoan() {
    await createLoan({
      ...values,
      id: 0,
      createdat: new Date(),
      updatedat: new Date(),
    });
  }

  const calculateWithAI = async () => {
    if (environment !== "AI") {
      setValues((prev) => {
        // Clone startDate to prevent modification of original state
        const startDate = new Date(values.startdate);
        const totalMonths = values.loanterm;

        const yearsToAdd = Math.floor(totalMonths / 12);
        const remainingMonths = totalMonths % 12;

        // Create a new date object to avoid modifying state directly
        const endDate = new Date(startDate);

        endDate.setFullYear(startDate.getFullYear() + yearsToAdd);
        endDate.setMonth(startDate.getMonth() + remainingMonths);

        // Ensure day stays valid (e.g., Feb 30 issue)
        if (endDate.getDate() !== startDate.getDate()) {
          endDate.setDate(0); // Set to last valid day of the month
        }

        // Correct interest rate calculation
        const interestRate = values.interestrate[0] / 100; // Convert to decimal
        const totalRepayment =
          values.loanamount * (1 + interestRate * values.loanterm);

        // Correct monthly payment calculation
        const monthlyPayment = totalRepayment / values.loanterm;

        return {
          ...prev,
          enddate: endDate,
          totalrepayment: totalRepayment,
          monthlypayment: monthlyPayment,
        };
      });
    } else {
      const response = await fetch("/api/ollama", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customersalary: values.customersalary,
          loanamount: values.loanamount,
          loanterm: values.loanterm,
          interestrate: values.interestrate[0],
          startdate: values.startdate,
        }),
      });

      const data = await response.json();

      if (data.error) {
        toast("Error", { description: data.error });
      } else {
        toast("Success", { description: "AI-calculated values received!" });
        console.log(data.result);
      }
    }
  };

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | { name: string; value: number[] | string | number }
  ) => {
    if ("target" in e) {
      // Handle input change
      setValues((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    } else {
      // Handle slider change
      setValues((prev) => ({
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

    setValues((prev) => ({
      ...prev,
      [e.target.name]: rawValue,
    }));
  };

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
              value={values.customername}
              onChange={handleChange}
            />
          </div>
          <Label htmlFor="customeremail">Customer Email</Label>
          <div className="mb-5">
            <Input
              type="email"
              name="customeremail"
              value={values.customeremail}
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
              value={values.customerphone}
              onChange={handlePhoneChange}
            />
          </div>
          <Label htmlFor="customersalary">Customer Salary</Label>
          <div className="mb-10">
            <Input
              type="number"
              name="customersalary"
              value={values.customersalary}
              onChange={handleChange}
            />
          </div>
          <h1 className="text-2xl">Loan Details</h1>
          <Label htmlFor="loanamount">Loan Amount</Label>
          <div className="mb-5">
            <Input
              type="number"
              name="loanamount"
              value={values.loanamount}
              onChange={handleChange}
            />
          </div>
          <Label htmlFor="interestrate">
            Interest Rate ({values.interestrate}%)
          </Label>
          <div className="mb-5">
            <Slider
              max={100}
              step={1}
              name="interestrate"
              value={values.interestrate}
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
              value={values.loanterm}
              onChange={handleChange}
            />
          </div>

          <Label>Loan Start Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant={"outline"}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {values.startdate ? (
                  format(new Date(values.startdate), "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 z-10 bg-gray-100">
              <Calendar
                mode="single"
                selected={values.startdate}
                onSelect={(date) =>
                  setValues((prev) => ({
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
              value={values.monthlypayment}
              readOnly
            />
          </div>
          <Label htmlFor="totalrepayment">Total Repayment</Label>
          <div className="mb-5">
            <Input
              type="number"
              name="totalrepayment"
              value={values.totalrepayment}
              readOnly
            />
          </div>
          <div>
            <Label>Loan End Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant={"outline"}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {values.enddate ? (
                    format(new Date(values.enddate), "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-10 bg-gray-100">
                <Calendar
                  mode="single"
                  selected={values.enddate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="mt-auto">
            <div className="float-right">
              <div className="flex">
                <Button
                  className="bg-green-400"
                  disabled={Object.entries(values).some(([key, value]) =>
                    [
                      "customername",
                      "customeremail",
                      "customerphone",
                      "customersalary",
                      "loanamount",
                      "loanterm",
                      "monthlypayment",
                      "totalrepayment",
                    ].includes(key)
                      ? !value || value == 0 || value === ""
                      : false
                  )}
                  onClick={createNewLoan}
                >
                  Create Loan
                </Button>
                <div className="ml-10">
                  <AlertDialog>
                    <AlertDialogTrigger>
                      <div className="bg-yellow-400 text-black rounded-sm py-2 px-6 font-semibold hover:bg-yellow-500 cursor-pointer">
                        Calculate Values with AI
                      </div>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-gray-100 text-black">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action will generate the outstanding values with
                          an AI model.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => {
                            if (
                              values.customersalary <= 0 ||
                              values.loanamount <= 0 ||
                              values.loanterm <= 0
                            ) {
                              toast("Error", {
                                style: { backgroundColor: "red" },
                                description:
                                  "Please complete all fields to continue.",
                                action: {
                                  label: "Okay",
                                  onClick: () => {},
                                },
                              });
                            } else {
                              calculateWithAI();
                            }
                          }}
                        >
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
