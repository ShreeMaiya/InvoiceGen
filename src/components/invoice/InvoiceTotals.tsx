import React from "react";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import { InvoiceData } from "./InvoiceForm";

interface InvoiceTotalsProps {
  data: InvoiceData;
  calculateSubtotal: () => number;
  calculateDiscount: () => number;
  calculateNetPrice: () => number;
  calculateTax: () => number;
  calculateTotal: () => number;
}

const InvoiceTotals: React.FC<InvoiceTotalsProps> = ({ 
  data, 
  calculateSubtotal,
  calculateDiscount,
  calculateNetPrice,
  calculateTax, 
  calculateTotal 
}) => {
  return (
    <div className="flex flex-col items-end mb-10">
      <div className="w-full max-w-xs space-y-3">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal:</span>
          <span>{formatCurrency(calculateSubtotal())}</span>
        </div>
        {data.discount > 0 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              Discount ({data.discount}%):
            </span>
            <span>- {formatCurrency(calculateDiscount())}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-muted-foreground">Net Price:</span>
          <span>{formatCurrency(calculateNetPrice())}</span>
        </div>
        {data.taxRate > 0 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              Tax ({data.taxRate}%):
            </span>
            <span>+ {formatCurrency(calculateTax())}</span>
          </div>
        )}
        <Separator />
        <div className="flex justify-between font-medium text-lg">
          <span>Total:</span>
          <span>{formatCurrency(calculateTotal())}</span>
        </div>
      </div>
    </div>
  );
};

export default InvoiceTotals;