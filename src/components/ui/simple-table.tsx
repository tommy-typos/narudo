import * as React from "react"

import { cn } from "@/lib/utils"

const SimpleTable = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="my-6 w-full overflow-y-auto">
    <table
      ref={ref}
      className={cn("w-full", className)}
      {...props}
    />
  </div>
))
SimpleTable.displayName = "SimpleTable"

const SimpleTableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("", className)} {...props} />
))
SimpleTableHeader.displayName = "SimpleTableHeader"

const SimpleTableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("", className)}
    {...props}
  />
))
SimpleTableBody.displayName = "SimpleTableBody"

const SimpleTableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "m-0 border-t p-0 even:bg-muted",
      className
    )}
    {...props}
  />
))
SimpleTableRow.displayName = "SimpleTableRow"

const SimpleTableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right",
      className
    )}
    {...props}
  />
))
SimpleTableHead.displayName = "SimpleTableHead"

const SimpleTableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn("border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right", className)}
    {...props}
  />
))
SimpleTableCell.displayName = "SimpleTableCell"

export {
  SimpleTable,
  SimpleTableHeader,
  SimpleTableBody,
  SimpleTableHead,
  SimpleTableRow,
  SimpleTableCell,
}
