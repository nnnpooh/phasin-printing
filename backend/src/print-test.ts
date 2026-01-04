import { ThermalPrinter, PrinterTypes } from "node-thermal-printer";
import escpos from "escpos";
// @ts-ignore
import USB from "escpos-usb";
escpos.USB = USB;
const device = new escpos.USB();
const options = { encoding: "GB18030" /* default */ };
const printer = new escpos.Printer(device, options);

function testEscpos() {
  device.open(function (err) {
    if (err) {
      console.error("Error opening device:", err);
      return;
    }
    printer
      .align("CT")
      .style("B")
      .size(2, 2)
      .text("Test Receipt")
      .size(1, 1)
      .drawLine()
      .cut()
      .close();
  });
}
testEscpos();

// This one does not work
export async function testNodeThermalPrinter() {
  console.log("Starting test print...");
  const printer = new ThermalPrinter({
    type: PrinterTypes.STAR, // Printer type: 'star' or 'epson'
    interface: "printer:XP-58",
  });
  const isConnected = await printer.isPrinterConnected();
  console.log("Printer connected:", isConnected);
  printer.alignCenter();
  printer.setTextDoubleHeight();
  printer.println("Test Receipt");
  printer.setTextNormal();
  printer.drawLine();
}

// testNodeThermalPrinter();
testEscpos();
