import usePrinter from "../hooks/usePrinter";

function PrinterStatusBar() {
  const { printStatus, isLoading, error } = usePrinter();

  const statusLabel = printStatus
    ? printStatus.isPrinting
      ? "Printing"
      : "Idle"
    : "Unavailable";

  return (
    <div>
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-2">
          {isLoading ? (
            <svg
              className="h-4 w-4 animate-spin text-gray-700"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            <span
              className={`h-3 w-3 rounded-full ${
                printStatus?.isPrinting ? "bg-rose-500" : "bg-emerald-500"
              }`}
            />
          )}

          <span className="text-sm text-gray-800">Printer: {statusLabel}</span>
        </div>

        <span className="text-sm text-gray-600">
          Queue: {printStatus?.queueLength ?? "-"}
        </span>

        {error && <span className="ml-2 text-sm text-red-600">Error</span>}
      </div>

      {error && (
        <div className="mt-2 px-3 py-1 rounded-md bg-red-50 text-red-700 text-sm shadow-inner max-w-xs">
          {String((error as any)?.message ?? error)}
        </div>
      )}
    </div>
  );
}

export default PrinterStatusBar;
