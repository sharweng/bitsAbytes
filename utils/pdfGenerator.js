const puppeteer = require("puppeteer")

/**
 * Generates a PDF from HTML content using Puppeteer.
 * @param {string} htmlContent - The HTML string to convert to PDF.
 * @returns {Promise<Buffer>} A Promise that resolves with the PDF buffer.
 */
const generatePdf = async (htmlContent) => {
  let browser
  try {
    browser = await puppeteer.launch({
      headless: true, // Set to 'new' for new headless mode, or true/false for old
      args: ["--no-sandbox", "--disable-setuid-sandbox"], // Required for Docker/CI environments
    })
    const page = await browser.newPage()

    // Set content and wait for network idle to ensure all resources are loaded
    await page.setContent(htmlContent, { waitUntil: "networkidle0" })

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true, // Ensures background colors/images are printed
      margin: {
        top: "20mm",
        right: "20mm",
        bottom: "20mm",
        left: "20mm",
      },
    })
    return pdfBuffer
  } catch (error) {
    console.error("Error generating PDF:", error)
    throw new Error("Failed to generate PDF.")
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}

module.exports = generatePdf
