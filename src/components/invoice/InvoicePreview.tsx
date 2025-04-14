import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { InvoiceData } from "./InvoiceForm";
import { useToast } from "@/hooks/use-toast";
import InvoiceHeader from "./InvoiceHeader";
import InvoiceAddressSection from "./InvoiceAddressSection";
import InvoiceItemsTable from "./InvoiceItemsTable";
import InvoiceTotals from "./InvoiceTotals";
import InvoiceNotes from "./InvoiceNotes";
import InvoiceActionButtons from "./InvoiceActionButtons";
import { useInvoiceCalculations } from "@/hooks/useInvoiceCalculations";
import { useIsMobile } from "@/hooks/use-mobile";

interface InvoicePreviewProps {
  data: InvoiceData;
  onBack: () => void;
}

const InvoicePreview = ({ data, onBack }: InvoicePreviewProps) => {
  const { toast } = useToast();
  const invoiceRef = React.useRef<HTMLDivElement>(null);
  const { calculateSubtotal, calculateTax, calculateTotal } = useInvoiceCalculations(data);
  const isMobile = useIsMobile();

  const downloadPDF = async () => {
    if (!invoiceRef.current) return;

    try {
      toast({
        title: "Generating PDF",
        description: "Please wait while we generate your invoice...",
      });

      // Optimized canvas options for mobile
      const canvasOptions = {
        scale: isMobile ? 1 : 2, // Lower scale for mobile to reduce size
        useCORS: true,
        logging: false,
        scrollX: 0,
        scrollY: 0,
        windowWidth: document.documentElement.offsetWidth,
        windowHeight: document.documentElement.offsetHeight,
      };

      const canvas = await html2canvas(invoiceRef.current, canvasOptions);
      const imgData = canvas.toDataURL("image/png");
      
      // PDF configuration
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
      });

      // Calculate dimensions for proper fitting
      const pdfWidth = 210; // A4 width in mm
      const pdfHeight = 297; // A4 height in mm
      
      // Improved mobile scaling - smaller content width for mobile
      const contentWidth = isMobile ? (pdfWidth - 30) : (pdfWidth - 20);
      const aspectRatio = canvas.height / canvas.width;
      const contentHeight = contentWidth * aspectRatio;
      
      // Margins
      const xPos = isMobile ? 15 : 10; // Increased margins for mobile
      const yPos = 10;
      
      // Add image to PDF
      pdf.addImage(imgData, "PNG", xPos, yPos, contentWidth, contentHeight);
      
      // For mobile, we'll compress the content to fit on a single page if possible
      if (isMobile && contentHeight > pdfHeight - 20) {
        // Clear the page and add the image with adjusted height to fit one page
        pdf.deletePage(1);
        pdf.addPage();
        const adjustedHeight = pdfHeight - 20;
        const adjustedWidth = adjustedHeight / aspectRatio;
        pdf.addImage(imgData, "PNG", xPos, yPos, adjustedWidth, adjustedHeight);
      } else if (contentHeight > pdfHeight - 20) {
        // For desktop or if content is still very long, use multiple pages
        const pageCount = Math.ceil(contentHeight / (pdfHeight - 20));
        for (let i = 1; i < pageCount; i++) {
          pdf.addPage();
          pdf.addImage(
            imgData, 
            "PNG", 
            xPos, 
            yPos - (pdfHeight - 20) * i, 
            contentWidth, 
            contentHeight
          );
        }
      }
      
      pdf.save(`Invoice-${data.invoiceNumber}.pdf`);

      toast({
        title: "Success!",
        description: "Your invoice has been downloaded successfully.",
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <InvoiceActionButtons 
          data={data} 
          onBack={onBack} 
          downloadPDF={downloadPDF}
          calculateTotal={calculateTotal}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex justify-center"
      >
        <Card className="w-full max-w-5xl shadow-lg">
          <CardContent className={`${isMobile ? 'p-4' : 'p-10'}`} ref={invoiceRef}>
            <InvoiceHeader data={data} />
            <InvoiceAddressSection data={data} />
            <InvoiceItemsTable data={data} />
            <InvoiceTotals 
              data={data}
              calculateSubtotal={calculateSubtotal}
              calculateTax={calculateTax}
              calculateTotal={calculateTotal}
            />
            <InvoiceNotes notes={data.notes} />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default InvoicePreview;
