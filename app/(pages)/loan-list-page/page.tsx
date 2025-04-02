"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LoanModel } from "@/app/utils/loanModel";
import { useEffect, useState } from "react";
import { deleteLoan, getLoans } from "@/app/utils/loanCRUD";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LoanStatus } from "@/app/utils/LoanStatus";
import { toast } from "sonner";

const getColumns = (
  onViewLoanDetails: (loan: LoanModel) => void
): ColumnDef<LoanModel>[] => {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "loanstatus",
      header: "Loan Status",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("loanstatus")}</div>
      ),
    },
    {
      accessorKey: "customername",
      header: "Customer Name",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("customername")}</div>
      ),
    },
    {
      accessorKey: "customerphone",
      header: "Customer Phone",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("customerphone")}</div>
      ),
    },
    {
      accessorKey: "customeremail",
      header: "Customer Email",
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("customeremail")}</div>
      ),
    },
    {
      accessorKey: "loanamount",
      header: () => <div className="text-right">Amount</div>,
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("loanamount"));
        const formatted = new Intl.NumberFormat("en-GB", {
          style: "currency",
          currency: "ZAR",
        }).format(amount);
        return <div className="text-right font-medium">{formatted}</div>;
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const loanData = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="z-10 bg-gray-100">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onViewLoanDetails(loanData)}>
                View Loan Detail
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
};

export default function ListLoans() {
  const [isDeleting, setIsDeleting] = useState(false);
  const [data, setData] = useState<LoanModel[]>([]);
  const router = useRouter();

  async function GetLoanData() {
    const data = await getLoans();
    // console.log(data);
    setData(
      data.map((loan) => ({
        ...loan,
        loanstatus: LoanStatus[loan.loanstatus as keyof typeof LoanStatus],
        createdat: loan.createdat ? new Date(loan.createdat) : new Date(),
        updatedat: loan.updatedat ? new Date(loan.updatedat) : new Date(),
      }))
    );
  }

  async function deleteCurrentLoan(id: number) {
    setIsDeleting(true);

    await deleteLoan(id);

    setIsDeleting(false);
    toast("Success", { description: "Loan(s) deleted successfully." });
  }

  useEffect(() => {
    GetLoanData();
  }, []);

  const onViewLoanDetails = (loan: LoanModel) => {
    router.push(`/loan-detail-page/${loan.id}`); // Navigate to loan details page
  };

  const columns = getColumns(onViewLoanDetails);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <div className="w-64 mr-10">
          <Input
            placeholder="Filter emails..."
            value={
              (table.getColumn("customeremail")?.getFilterValue() as string) ??
              ""
            }
            onChange={(event) =>
              table
                .getColumn("customeremail")
                ?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="z-10 bg-gray-100">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>

      <div className="flex h-[10vh] p-2">
        <div className="flex flex-col w-full">
          <div className="mt-auto flex justify-end">
            <Button
              className="bg-red-400"
              disabled={
                table.getFilteredSelectedRowModel().rows.length === 0 ||
                isDeleting
              }
              onClick={() => {
                // console.log(table.getFilteredSelectedRowModel().rows);
                table.getFilteredSelectedRowModel().rows.map((row) => {
                  console.log(row);
                  deleteCurrentLoan(Number(row.original.id));
                });

                GetLoanData();
              }}
            >
              Delete Selected Loans
            </Button>
            <div className="ml-10">
              <Button className="bg-yellow-400">
                <Link href="/create-edit-loan-page">Create New Loan</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
