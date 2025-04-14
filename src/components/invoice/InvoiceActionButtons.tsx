import React from "react";
import { Button } from "@/components/ui/button";
import { Download, Mail, Share } from "lucide-react";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/utils";
import { InvoiceData } from "./InvoiceForm";
import { useToast } from "@/hooks/use-toast";

interface InvoiceActionButtonsProps {
  data: InvoiceData;
  onBack: () => void;
  downloadPDF: () => Promise<void>;
  calculateTotal: () => number;
}

const InvoiceActionButtons: React.FC<InvoiceActionButtonsProps> = ({ 
  data, 
  onBack, 
  downloadPDF,
  calculateTotal
}) => {
  const { toast } = useToast();

  const shareViaEmail = () => {
    const subject = `Invoice ${data.invoiceNumber} from ${data.fromName}`;
    const body = `Dear ${data.toName},\n\nPlease find attached invoice ${data.invoiceNumber} for your records.\n\nTotal amount due: ${formatCurrency(calculateTotal())}\nDue date: ${format(data.dueDate, "PPP")}\n\nThank you for your business.\n\nBest regards,\n${data.fromName}`;
    
    window.location.href = `mailto:${data.toEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    toast({
      title: "Email client opened",
      description: "An email draft has been created with the invoice details.",
    });
  };

  const shareViaWhatsApp = () => {
    const message = `Invoice ${data.invoiceNumber} from ${data.fromName}\n\nTotal amount due: ${formatCurrency(calculateTotal())}\nDue date: ${format(data.dueDate, "PPP")}\n\nThank you for your business.`;
    
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
    
    toast({
      title: "WhatsApp opened",
      description: "Share your invoice details via WhatsApp.",
    });
  };

  return (
    <div className="space-y-8">
      <Button
        variant="outline"
        onClick={onBack}
        className="px-6"
      >
        Back to Edit
      </Button>

      <div className="flex flex-col items-center gap-4 max-w-md mx-auto">
        <Button
          className="flex items-center gap-3 bg-primary text-primary-foreground text-lg py-6 px-8 rounded-full shadow-lg hover:shadow-xl transition-all"
          onClick={downloadPDF}
        >
          <Download className="h-6 w-6" />
          Download Invoice
        </Button>

        <div className="flex gap-4">
          <Button
            variant="outline"
            className="flex items-center gap-2 px-6 py-5"
            onClick={shareViaEmail}
          >
            <Mail className="h-5 w-5" />
            Email
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2 px-6 py-5"
            onClick={shareViaWhatsApp}
          >
            <Share className="h-5 w-5" />
            WhatsApp
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceActionButtons;
