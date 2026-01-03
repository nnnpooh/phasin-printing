import { useState } from "react";

interface PropsPrintButton {
  previewRef: React.RefObject<HTMLCanvasElement | null>;
  isPaid?: boolean;
  setIsPaid: (paid: boolean) => void;
}

function PrintButton({ previewRef, isPaid, setIsPaid }: PropsPrintButton) {
  const [printing, setPrinting] = useState(false);

  const handlePrint = async () => {
    setPrinting(true);
    // Reset payment status after printing
    setIsPaid(false);

    const canvasRef = previewRef.current;
    if (!canvasRef) return;

    canvasRef.toBlob((blob) => {
      const formData = new FormData();
      if (blob) {
        formData.append("image", blob, "image.png");

        fetch("/api/print", {
          method: "POST",
          body: formData,
        })
          .then((res) => {
            if (!res.ok) {
              console.error("Print request failed");
            }
          })
          .catch((err) => {
            console.error("Print request error:", err);
          })
          .finally(() => {
            setPrinting(false);
          });
      }
    }, "image/png");

    // const dataUrl = canvasRef.toDataURL("image/png");
    // const res = await fetch("/api/print", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({
    //     dataUrl: dataUrl,
    //   }),
    // });
    // if (!res.ok) {
    //   const text = await res.text();
    //   console.error("Print request failed:", text);
    // }
  };

  return (
    <button
      onClick={handlePrint}
      disabled={!isPaid || printing}
      className="flex items-center gap-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-2 text-md font-bold text-white shadow shadow-blue-400/50 transition-all duration-300 hover:shadow-blue-500/70 hover:scale-110 active:scale-100 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
    >
      {printing ? (
        <>
          <svg
            className="h-6 w-6 animate-spin"
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
          <span>Printing...</span>
        </>
      ) : (
        <>
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
            />
          </svg>
          <span>Print</span>
        </>
      )}
    </button>
  );
}

export default PrintButton;
