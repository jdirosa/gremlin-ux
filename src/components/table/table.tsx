import {
  forwardRef,
  createContext,
  useContext,
  type ReactNode,
  type ComponentPropsWithoutRef,
} from "react";
import { cx } from "@styled-system/css";
import {
  tableRecipe,
  tableHeadStyles,
  tableBodyStyles,
  tableRowRecipe,
  tableHeaderCellStyles,
  tableCellRecipe,
  type TableVariantProps,
} from "./table.recipe";

// ── Table Context ─────────────────────────────────────────────────────

interface TableContextValue {
  striped: boolean;
  bordered: boolean;
}

const TableContext = createContext<TableContextValue>({ striped: false, bordered: false });

function useTableContext(): TableContextValue {
  return useContext(TableContext);
}

// ── Table Root ────────────────────────────────────────────────────────

export type TableProps = {
  /** Show alternating row backgrounds */
  striped?: boolean;
  /** Show borders on cells */
  bordered?: boolean;
  className?: string;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<"table">, "border">;

const TableRoot = forwardRef<HTMLTableElement, TableProps>(
  function TableRoot({ striped = false, bordered = false, className, children, ...rest }, ref) {
    return (
      <TableContext.Provider value={{ striped, bordered }}>
        <table
          ref={ref}
          className={cx(tableRecipe({ striped: striped || undefined, bordered: bordered || undefined }), className)}
          {...rest}
        >
          {children}
        </table>
      </TableContext.Provider>
    );
  },
);

// ── Table.Head ────────────────────────────────────────────────────────

export type TableHeadProps = {
  className?: string;
  children: ReactNode;
} & ComponentPropsWithoutRef<"thead">;

const TableHead = forwardRef<HTMLTableSectionElement, TableHeadProps>(
  function TableHead({ className, children, ...rest }, ref) {
    return (
      <thead
        ref={ref}
        className={cx(tableHeadStyles, className)}
        {...rest}
      >
        {children}
      </thead>
    );
  },
);

// ── Table.Body ────────────────────────────────────────────────────────

export type TableBodyProps = {
  className?: string;
  children: ReactNode;
} & ComponentPropsWithoutRef<"tbody">;

const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(
  function TableBody({ className, children, ...rest }, ref) {
    return (
      <tbody
        ref={ref}
        className={cx(tableBodyStyles, className)}
        {...rest}
      >
        {children}
      </tbody>
    );
  },
);

// ── Table.Row ─────────────────────────────────────────────────────────

export type TableRowProps = {
  className?: string;
  children: ReactNode;
} & ComponentPropsWithoutRef<"tr">;

const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  function TableRow({ className, children, ...rest }, ref) {
    const { striped } = useTableContext();

    return (
      <tr
        ref={ref}
        className={cx(tableRowRecipe({ striped: striped || undefined }), className)}
        {...rest}
      >
        {children}
      </tr>
    );
  },
);

// ── Table.HeaderCell ──────────────────────────────────────────────────

export type TableHeaderCellProps = {
  className?: string;
  children: ReactNode;
} & ComponentPropsWithoutRef<"th">;

const TableHeaderCell = forwardRef<HTMLTableCellElement, TableHeaderCellProps>(
  function TableHeaderCell({ className, children, ...rest }, ref) {
    return (
      <th
        ref={ref}
        className={cx(tableHeaderCellStyles, className)}
        {...rest}
      >
        {children}
      </th>
    );
  },
);

// ── Table.Cell ────────────────────────────────────────────────────────

export type TableCellProps = {
  className?: string;
  children: ReactNode;
} & ComponentPropsWithoutRef<"td">;

const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  function TableCell({ className, children, ...rest }, ref) {
    const { bordered } = useTableContext();

    return (
      <td
        ref={ref}
        className={cx(tableCellRecipe({ bordered: bordered || undefined }), className)}
        {...rest}
      >
        {children}
      </td>
    );
  },
);

// ── Compound Component Assembly ───────────────────────────────────────

export const Table = Object.assign(TableRoot, {
  Head: TableHead,
  Body: TableBody,
  Row: TableRow,
  HeaderCell: TableHeaderCell,
  Cell: TableCell,
});
