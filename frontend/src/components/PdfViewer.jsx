import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
import { Button, IconButton, Tooltip } from "@mui/material";
import SimCardDownloadIcon from "@mui/icons-material/SimCardDownload";

const PdfViewer = ({ pdf,name }) => {
   const [numPages, setNumPages] = useState(null);
   const [pageNumber, setPageNumber] = useState(1);
   const [file, setFile] = useState(null);

   // function handleFile(e) {
   //    const file = e.target.files[0];
   //    const fileReader = new FileReader();
   //    fileReader.readAsArrayBuffer(file);
   //    fileReader.onload = (e) => {
   //       const file = e.target.result;
   //       const fileByteArray = new Uint8Array(file);
   //       setFile(file);
   //    };
   // }

   // Implement the handleDownloadPDF function
   const handleDownloadPDF = () => {
      if (pdf) {
         //   const fileByteArray = new Uint8Array(pdf);
         const blob = new Blob([pdf], { type: "application/pdf" });
         const url = URL.createObjectURL(blob);

         const a = document.createElement("a");
         a.href = url;
         a.download = name; // You can set the file name here
         document.body.appendChild(a);
         a.click();

         // Clean up
         document.body.removeChild(a);
         URL.revokeObjectURL(url);
      }
   };

   useEffect(() => {
      if (pdf) {
         const fileReader = new FileReader();
         fileReader.readAsArrayBuffer(pdf);

         fileReader.onload = (e) => {
            const file = e.target.result;
            setFile(file);
         };
      }
   }, [pdf]);

   function onDocumentLoadSuccess({ numPages }) {
      setNumPages(numPages);
   }

   function goToPreviousPage() {
      if (pageNumber > 1) {
         setPageNumber(pageNumber - 1);
      }
   }

   function goToNextPage() {
      if (pageNumber < numPages) {
         setPageNumber(pageNumber + 1);
      }
   }

   return (
      <div className="h-fit">
         <div className="flex items-center justify-between my-2">
            <span></span>
            <Button
               onClick={goToPreviousPage}
               sx={{ fontSize: "0.8rem" }}
               color="secondary"
               variant="contained"
               disabled={pageNumber <= 1}
               className="text-xs py-2 px-4 bg-blue-500 text-white rounded"
            >
               Previous
            </Button>
            <span className="text-left text-xs">
               Page {pageNumber} of {numPages}
            </span>
            <Button
               sx={{ fontSize: "0.8rem" }}
               onClick={goToNextPage}
               color="secondary"
               variant="contained"
               disabled={pageNumber >= numPages}
               className="text-xs py-2 px-4 bg-blue-500 text-white rounded"
            >
               Next
            </Button>
            <Tooltip arrow placement="bottom-end" title="Unduh Dokumen">
               <IconButton onClick={handleDownloadPDF}>
                  <SimCardDownloadIcon />
               </IconButton>
            </Tooltip>

         </div>

         <div>
            <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
               <Page
                  className="border border-gray-400"
                  pageNumber={pageNumber}
                  height={300}
                  width={550}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
               />
            </Document>
         </div>
      </div>
   );
};

export default PdfViewer;
