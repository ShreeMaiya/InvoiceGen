
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/ui-custom/Navbar";
import InvoiceForm, { InvoiceData } from "@/components/invoice/InvoiceForm";
import InvoicePreview from "@/components/invoice/InvoicePreview";

const Create = () => {
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  const [isPreview, setIsPreview] = useState(false);

  const handleFormSubmit = (data: InvoiceData) => {
    setInvoiceData(data);
    setIsPreview(true);
    window.scrollTo(0, 0);
  };

  const handleBackToEdit = () => {
    setIsPreview(false);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-32 pb-20 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              {isPreview ? "Invoice Preview" : "Create Your Invoice"}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {isPreview
                ? "Review your invoice and share it with your client."
                : "Fill in the details below to generate a professional invoice."}
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {isPreview && invoiceData ? (
              <InvoicePreview data={invoiceData} onBack={handleBackToEdit} />
            ) : (
              <InvoiceForm onSubmit={handleFormSubmit} />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Create;
