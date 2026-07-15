import { cn } from "../../utils/cn";
import EmptyState from "./EmptyState";

const DataTable = ({
  columns,
  data,
  keyField = "id",
  emptyTitle = "No records found",
  emptyDescription = "Try changing your filters or add a new record.",
}) => {
  if (!data?.length) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-950 dark:text-slate-400">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className={cn("px-5 py-3 font-semibold", column.className)}>
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700 dark:divide-slate-800 dark:text-slate-300">
            {data.map((row, index) => (
              <tr key={row[keyField] ?? index} className="transition hover:bg-slate-50/80 dark:hover:bg-slate-800/60">
                {columns.map((column) => (
                  <td key={column.key} className={cn("px-5 py-4", column.cellClassName)}>
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
