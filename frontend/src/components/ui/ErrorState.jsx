import { AlertTriangle, RefreshCw } from "lucide-react";

import Card from "./Card";

const ErrorState = ({
  title = "Something went wrong",
  description = "We could not load this data. Please try again.",
  onRetry,
  retryLabel = "Retry",
}) => {
  return (
    <Card className="border-red-200 bg-red-50 p-4 shadow-none dark:border-red-900/70 dark:bg-red-950/30">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-300">
            <AlertTriangle size={19} />
          </span>
          <div>
            <h3 className="text-sm font-semibold text-red-950 dark:text-red-100">{title}</h3>
            <p className="mt-1 text-sm leading-6 text-red-700 dark:text-red-200">{description}</p>
          </div>
        </div>

        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-red-600 px-3 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            <RefreshCw size={15} />
            {retryLabel}
          </button>
        ) : null}
      </div>
    </Card>
  );
};

export default ErrorState;
