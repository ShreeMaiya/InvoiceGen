import { formatCurrency } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { InvoiceData } from "./InvoiceForm";
import { format } from "date-fns";

interface InvoiceProps {
  invoiceData: InvoiceData;
}

const Invoice = ({ invoiceData }: InvoiceProps) => {
  const calculateSubtotal = () => {
    return invoiceData.items.reduce(
      (total, item) => total + (item.quantity || 0) * (parseFloat(item.rate?.toString() || "0")),
      0
    );
  };

  const calculateDiscount = () => {
    const discountRate = parseFloat(invoiceData.discount?.toString() || "0");
    return calculateSubtotal() * (discountRate / 100);
  };

  const calculateNetPrice = () => {
    return calculateSubtotal() - calculateDiscount();
  };

  const calculateTax = () => {
    const taxRate = parseFloat(invoiceData.taxRate?.toString() || "0");
    return calculateNetPrice() * (taxRate / 100);
  };

  const calculateTotal = () => {
    return calculateNetPrice() + calculateTax();
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold">INVOICE</h1>
          <p className="text-muted-foreground">#{invoiceData.invoiceNumber}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">
            Date: {format(invoiceData.invoiceDate, "PPP")}
          </p>
          <p className="text-sm text-muted-foreground">
            Due Date: {format(invoiceData.dueDate, "PPP")}
          </p>
        </div>
      </div>

      {/* Addresses */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="font-medium mb-2">From:</h3>
          <p className="font-medium">{invoiceData.fromName}</p>
          <p className="text-muted-foreground">{invoiceData.fromEmail}</p>
          <p className="text-muted-foreground whitespace-pre-line">
            {invoiceData.fromAddress}
          </p>
        </div>
        <div>
          <h3 className="font-medium mb-2">Bill To:</h3>
          <p className="font-medium">{invoiceData.toName}</p>
          <p className="text-muted-foreground">{invoiceData.toEmail}</p>
          <p className="text-muted-foreground whitespace-pre-line">
            {invoiceData.toAddress}
          </p>
        </div>
      </div>

      {/* Items */}
      <div className="mb-8">
        <div className="grid grid-cols-12 gap-4 mb-2 font-medium">
          <div className="col-span-4">Item</div>
          <div className="col-span-3">Description</div>
          <div className="col-span-1 text-right">Qty</div>
          <div className="col-span-2 text-right">Price</div>
          <div className="col-span-2 text-right">Amount</div>
        </div>
        <Separator className="mb-4" />
        {invoiceData.items.map((item) => (
          <div key={item.id} className="grid grid-cols-12 gap-4 mb-4">
            <div className="col-span-4">{item.name}</div>
            <div className="col-span-3 text-muted-foreground">
              {item.description}
            </div>
            <div className="col-span-1 text-right">{item.quantity}</div>
            <div className="col-span-2 text-right">
              {formatCurrency(item.rate || 0)}
            </div>
            <div className="col-span-2 text-right">
              {formatCurrency((item.rate || 0) * item.quantity)}
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="ml-auto w-full md:w-1/2 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Subtotal:</span>
          <span>{formatCurrency(calculateSubtotal())}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">
            Discount ({invoiceData.discount || 0}%):
          </span>
          <span>- {formatCurrency(calculateDiscount())}</span>
        </div>
        <div className="flex justify-between items-center font-medium">
          <span>Net Price:</span>
          <span>{formatCurrency(calculateNetPrice())}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">
            Tax ({invoiceData.taxRate || 0}%):
          </span>
          <span>+ {formatCurrency(calculateTax())}</span>
        </div>
        <Separator />
        <div className="flex justify-between items-center font-bold text-lg">
          <span>Total:</span>
          <span>{formatCurrency(calculateTotal())}</span>
        </div>
      </div>

      {/* Notes */}
      {invoiceData.notes && (
        <div className="mt-8 pt-8 border-t">
          <h3 className="font-medium mb-2">Notes:</h3>
          <p className="text-muted-foreground whitespace-pre-line">
            {invoiceData.notes}
          </p>
        </div>
      )}
    </div>
  );
};

export default Invoice; 