const PDFDocument = require("pdfkit");
const fs = require("fs");

function processPDF(files, outputPath) {
    return new Promise((resolve, reject) => {
        const pdf = new PDFDocument({ autoFirstPage: false });
        const stream = fs.createWriteStream(outputPath);

        pdf.pipe(stream);

        try {
            files.forEach((file) => {
                const image = pdf.openImage(file.path);
                pdf.addPage({ size: [image.width, image.height] });
                pdf.image(file.path, 0, 0, { fit: [image.width, image.height] });

                // Cleanup uploaded file
                fs.unlinkSync(file.path);
            });

            pdf.end();
            stream.on("finish", resolve);
            stream.on("error", reject);
        } catch (error) {
            reject(error);
        }
    });
}

module.exports = { processPDF };
