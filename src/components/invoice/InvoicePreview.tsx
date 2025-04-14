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
  const { calculateSubtotal, calculateDiscount, calculateNetPrice, calculateTax, calculateTotal } = useInvoiceCalculations(data);
  const isMobile = useIsMobile();

  const downloadPDF = async () => {
    if (!invoiceRef.current) return;

    try {
      toast({
        title: "Generating PDF",
        description: "Please wait while we generate your invoice...",
      });

      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        scrollX: 0,
        scrollY: 0,
        windowWidth: document.documentElement.offsetWidth,
        windowHeight: document.documentElement.offsetHeight,
      });

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
      const contentWidth = pdfWidth - 20; // Consistent margins for all devices
      const aspectRatio = canvas.height / canvas.width;
      const contentHeight = contentWidth * aspectRatio;
      
      // Margins
      const xPos = 10;
      const yPos = 10;
      
      // Add image to PDF
      pdf.addImage(imgData, "PNG", xPos, yPos, contentWidth, contentHeight);
      
      // Handle multi-page PDF
      if (contentHeight > pdfHeight - 20) {
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
              calculateDiscount={calculateDiscount}
              calculateNetPrice={calculateNetPrice}
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