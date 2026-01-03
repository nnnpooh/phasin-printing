import { useAtom } from "jotai";
import { useState } from "react";
import { isModalOpenAtom } from "../utils/atoms";
import PrintButton from "./PrintButton";
import PrinterStatusBar from "./PrinterStatusBar";

interface PropsModal {
  previewRef: React.RefObject<HTMLCanvasElement | null>;
}

function PayPrintModal({ previewRef }: PropsModal) {
  const [isPaid, setIsPaid] = useState(false);
  const [isModalOpen, setIsModalOpen] = useAtom(isModalOpenAtom);
  const closeModal = () => {
    setIsModalOpen(false);
  };
  if (!isModalOpen) return null;
  return (
    // Overlay
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={closeModal}
    >
      {/* Modal Container */}
      <div
        className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full m-4"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        {/* Header with close button */}
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-2xl font-bold text-gray-800">
            Payment and Printing
          </h2>
          <button
            onClick={closeModal}
            className="text-gray-400 hover:text-gray-600 transition duration-150 text-3xl leading-none"
          >
            &times;
          </button>
        </div>

        <div className="flex gap-2">
          {/* QR Code */}
          <div
            className="flex-1 flex flex-col items-center bg-gray-50 p-4 rounded-lg shadow-inner hover:scale-105 transition-transform cursor-pointer"
            onClick={() => setIsPaid(true)}
          >
            <img
              src="/img/qr.png"
              alt="Payment QR Code"
              className="w-30 h-30 object-contain rounded-lg"
            />

            {isPaid ? (
              <span className="text-sm font-semibold text-green-600 mt-2">
                Payment Received
              </span>
            ) : (
              <>
                <span className="text-sm italic text-center">
                  Click to Simulate Payment
                </span>
              </>
            )}
          </div>
          {/* Print Button and Status */}
          <div className="flex-1 flex flex-col gap-3 bg-gray-50 p-4 rounded-lg shadow-inner justify-center items-center">
            <PrintButton
              previewRef={previewRef}
              isPaid={isPaid}
              setIsPaid={setIsPaid}
            />
            <PrinterStatusBar />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PayPrintModal;
