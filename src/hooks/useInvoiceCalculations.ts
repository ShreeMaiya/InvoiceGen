import { InvoiceData } from "@/components/invoice/InvoiceForm";

export function useInvoiceCalculations(data: InvoiceData) {
  const calculateSubtotal = () => {
    return data.items.reduce(
      (total, item) => total + (item.quantity || 0) * (parseFloat(item.rate?.toString() || "0")),
      0
    );
  };

  const calculateDiscount = () => {
    const discountRate = parseFloat(data.discount?.toString() || "0");
    return calculateSubtotal() * (discountRate / 100);
  };

  const calculateNetPrice = () => {
    return calculateSubtotal() - calculateDiscount();
  };

  const calculateTax = () => {
    const taxRate = parseFloat(data.taxRate?.toString() || "0");
    return calculateNetPrice() * (taxRate / 100);
  };

  const calculateTotal = () => {
    return calculateNetPrice() + calculateTax();
  };

  return {
    calculateSubtotal,
    calculateDiscount,
    calculateNetPrice,
    calculateTax,
    calculateTotal
  };
}