const fs = require("fs");
const PDFDocument = require("pdfkit");
const WordExtractor = require("word-extractor");

function wordToPdf(inputPath, outputPath) {
    return new Promise((resolve, reject) => {
        const extractor = new WordExtractor();
        const doc = extractor.extract(inputPath);
        const pdf = new PDFDocument();

        doc
            .then((document) => {
                const pdfStream = fs.createWriteStream(outputPath);
                pdf.pipe(pdfStream);

                // Add extracted text to the PDF
                pdf.text(document.getBody(), { align: "left" });
                pdf.end();

                pdfStream.on("finish", resolve);
                pdfStream.on("error", reject);
            })
            .catch((err) => {
                reject(err);
            });
    });
}

module.exports = { wordToPdf };
