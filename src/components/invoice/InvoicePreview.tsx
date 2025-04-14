import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { InvoiceData } from "./InvoiceForm";
import { useToast } from "@/hooks/use-toast";
import InvoiceHeader from "./InvoiceHeader";
import InvoiceAddressSection from "./InvoiceAddressSection";
import InvoiceItemsTable from "./InvoiceItemsTable";
import InvoiceTotals from "./InvoiceTotals";
import InvoiceActionButtons from "./InvoiceActionButtons";
import { useInvoiceCalculations } from "@/hooks/useInvoiceCalculations";
import { useIsMobile } from "@/hooks/use-mobile";

interface InvoicePreviewProps {
  data: InvoiceData;
  onBack: () => void;
}

const InvoicePreview = ({ data, onBack }: InvoicePreviewProps) => {
  const { toast } = useToast();
  const { calculateSubtotal, calculateDiscount, calculateNetPrice, calculateTax, calculateTotal } = useInvoiceCalculations(data);
  const isMobile = useIsMobile();

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
          <CardContent className={`${isMobile ? 'p-4' : 'p-10'}`}>
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
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default InvoicePreview;