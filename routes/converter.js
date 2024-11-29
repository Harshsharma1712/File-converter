const express = require("express");
const multer = require("multer");
const { processPDF } = require("../models/pdfModel");
const path = require("path");
const fs = require("fs");

const { wordToPdf } = require('../models/wordToPdf');

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// this section handle file conversion routes

// Render the main page
router.get("/", (req, res) => {
    res.render("main");
});

// // Render the index page
// router.get("/main", (req, res) => {
//     res.render("main");
// });

// Route for Word to PDF converter
router.get('/wordToPdf', (req, res) => {
    res.render('wordToPdf'); // Render the 'wordToPdf.ejs' file
});

// Handle file conversion
router.post("/convert", upload.array("images", 10), (req, res) => {
    const outputPath = `converted/${Date.now()}_output.pdf`;

    // Process images into a PDF
    processPDF(req.files, outputPath)
        .then(() => {
            res.render("index", {
                message: "PDF successfully created!",
                downloadLink: `/download/${path.basename(outputPath)}`,
            });
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send("An error occurred while creating the PDF.");
        });
});


// convert word to pdf
router.post("/convert-word", upload.single("wordFile"), (req, res) => {
    const inputPath = req.file.path;
    const outputPath = `converted/${Date.now()}_output.pdf`;

    wordToPdf(inputPath, outputPath)
        .then(() => {
            res.render("index", {
                message: "Word file successfully converted to PDF!",
                downloadLink: `/download/${path.basename(outputPath)}`,
            });
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send("An error occurred while converting the Word file.");
        })
        // .finally(() => {
        //     fs.unlinkSync(inputPath); // Cleanup uploaded Word file
        // });
});



// This Section is only handle downlaod 

// Handle file download
router.get("/download/:fileName", (req, res) => {
    const filePath = path.join(__dirname, "../converted", req.params.fileName);

    if (!fs.existsSync(filePath)) {
        return res.status(404).send("File not found.");
    }

    res.download(filePath, (err) => {
        if (err) {
            console.error(err);
        }
        // fs.unlinkSync(filePath); // Optional cleanup
    });
});

module.exports = router;
