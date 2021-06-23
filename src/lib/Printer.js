const printer = require('@thiagoelg/node-printer');

class Printer {
  constructor() {
    this.printer = printer;
  }

  getPrinters() {
    return this.printer.getPrinters();
  }

  getPrinter(printerName) {
    try {
      return this.printer.getPrinter(printerName);
    } catch (e) {
      return null
    }
  }

  getDefaultPrinterName() {
    try {
      return this.printer.getDefaultPrinterName()
    } catch (error) {
      return null
    }
  }

  getSelectedPaperSize(printerName) {
    try {
      return this.printer.getSelectedPaperSize(printerName);
    } catch (error) {
      return null
    }
  }

  print(data, printerName, { success: onSuccess, error: onError }) {
    this.printer.printDirect({
      data: data,
      printer: printerName,
      type: 'RAW',
      success: (jobID) => {
        onSuccess(jobID)
        return true
      },
      error: (err) => {
        onError(err)
        return false
      }
    })
  }
}

module.exports = Printer;