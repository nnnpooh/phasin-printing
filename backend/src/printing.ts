import sharp from "sharp";
import Debug from "debug";
import escpos from "escpos";
// @ts-ignore
import USB from "escpos-usb";
escpos.USB = USB;
const device = new escpos.USB();
const options = { encoding: "GB18030" /* default */ };
const printer = new escpos.Printer(device, options);

const debug = Debug("myapp");

// Thermal printer specs: adjust for your model
const THERMAL_WIDTH_PX = 384; // 58mm printer @ 203 DPI
const THERMAL_HEIGHT_MAX = 1024; // max height to avoid overflow

// Function to optimize image for thermal printing
export function optimizeImage(buffer: Buffer) {
  const optimizedBuffer = sharp(buffer)
    .rotate(90) // Rotate 90 degrees for landscape
    .resize({
      width: THERMAL_WIDTH_PX,
      height: THERMAL_HEIGHT_MAX,
      fit: "inside",
    })
    .threshold(128) // convert to black and white
    .toFormat("png") // ensure format is compatible
    .toBuffer();

  return optimizedBuffer;
}

export function createPrintJob(file?: Express.Multer.File) {
  return async () => {
    if (!file) {
      throw new Error("No file provided for print job.");
    }
    debug(
      `Processing print job for file: ${file.originalname}, size: ${file.size} bytes`
    );

    const optimizedImage = await optimizeImage(file.buffer);

    // Save to file for debugging purposes
    const imgUrl = `temp/printed_${Date.now()}_.png`;
    await sharp(optimizedImage).toFile(imgUrl);

    const image = await new Promise((resolve, reject) => {
      escpos.Image.load(imgUrl, (image) => {
        if (!image) return reject(new Error("Failed to create escpos.Image"));
        resolve(image); // this is the escpos.Image instance
      });
    });

    await new Promise<void>((resolve, reject) => {
      device.open((err) => {
        if (err) {
          debug("Error opening device:", err);
          return reject(err);
        }

        try {
          printer
            .align("CT")
            .raster(image as any)
            // .drawLine()
            .cut()
            .close();
          resolve();
        } catch (e) {
          reject(e);
        }
      });
    });

    // Simulate print job processing
    // await new Promise((resolve) => setTimeout(resolve, 5000)); // Simulate delay
    // debug(`Print job completed for file: ${file.originalname}`);
  };
}
