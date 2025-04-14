
import { InvoiceData } from "@/components/invoice/InvoiceForm";

export function useInvoiceCalculations(data: InvoiceData) {
  const calculateSubtotal = () => {
    return data.items.reduce(
      (total, item) => total + item.quantity * item.rate,
      0
    );
  };

  const calculateTax = () => {
    return calculateSubtotal() * (data.taxRate / 100);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  return {
    calculateSubtotal,
    calculateTax,
    calculateTotal
  };
}
