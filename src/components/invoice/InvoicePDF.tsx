import { View, Text, StyleSheet, Document, Page } from "@react-pdf/renderer";
import { formatCurrency } from "@/lib/utils";
import { InvoiceData } from "./InvoiceForm";
import { format } from "date-fns";

interface InvoicePDFProps {
  invoiceData: InvoiceData;
}

const InvoicePDF = ({ invoiceData }: InvoicePDFProps) => {
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

  // Helper function to safely render text
  const renderText = (text: string | undefined): string => {
    if (text === undefined || text === null || text === '') {
      return '';  // Return empty string for undefined, null or empty values
    }
    return String(text); // Convert to string for non-empty values
  };

  // Simple number formatting function
  const formatNumber = (num: number): string => {
    // Ensure num is a valid number
    const validNum = Number(num) || 0;
    // Convert to string with exactly 1 decimal place (changed from 2)
    const numStr = validNum.toFixed(1);
    // Split into parts
    const parts = numStr.split('.');
    // Format the integer part with commas
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    // Return the formatted number
    return parts.join('.');
  };

  // Use this function for all currency displays in the PDF
  const formatCurrencyForPDF = (num: number): string => {
    return `Rs. ${formatNumber(num)}`; // Using "Rs." instead of ₹ symbol for better compatibility
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>INVOICE</Text>
              <Text style={styles.invoiceNumber}>#{renderText(invoiceData.invoiceNumber)}</Text>
            </View>
            <View style={styles.dates}>
              <Text style={styles.date}>
                Date: {format(invoiceData.invoiceDate, "PPP")}
              </Text>
              <Text style={styles.date}>
                Due Date: {format(invoiceData.dueDate, "PPP")}
              </Text>
            </View>
          </View>

          {/* Addresses */}
          <View style={styles.addresses}>
            <View style={styles.addressBlock}>
              <Text style={styles.addressTitle}>From:</Text>
              <Text style={styles.addressName}>{renderText(invoiceData.fromName)}</Text>
              <Text style={styles.addressText}>{renderText(invoiceData.fromEmail)}</Text>
              <Text style={styles.addressText}>{renderText(invoiceData.fromAddress)}</Text>
            </View>
            <View style={styles.addressBlock}>
              <Text style={styles.addressTitle}>Bill To:</Text>
              <Text style={styles.addressName}>{renderText(invoiceData.toName)}</Text>
              <Text style={styles.addressText}>{renderText(invoiceData.toEmail)}</Text>
              <Text style={styles.addressText}>{renderText(invoiceData.toAddress)}</Text>
            </View>
          </View>

          {/* Items */}
          <View style={styles.items}>
            <View style={styles.itemsHeader}>
              <Text style={[styles.itemColumn, { flex: 2 }]}>Item</Text>
              <Text style={[styles.itemColumn, { flex: 3 }]}>Description</Text>
              <Text style={[styles.itemColumn, { flex: 1 }]}>Qty</Text>
              <Text style={[styles.itemColumn, { flex: 1 }]}>Price</Text>
              <Text style={[styles.itemColumn, { flex: 1 }]}>Amount</Text>
            </View>
            {invoiceData.items.map((item) => {
              const rate = parseFloat(renderText(item.rate?.toString()));
              const quantity = parseFloat(renderText(item.quantity?.toString()));
              return (
                <View key={item.id} style={styles.itemRow}>
                  <Text style={[styles.itemColumn, { flex: 2 }]}>{renderText(item.name)}</Text>
                  <Text style={[styles.itemColumn, { flex: 3 }]}>{renderText(item.description)}</Text>
                  <Text style={[styles.itemColumn, { flex: 1 }]}>{formatNumber(quantity)}</Text>
                  <Text style={[styles.itemColumn, { flex: 1 }]}>
                    {formatCurrencyForPDF(rate)}
                  </Text>
                  <Text style={[styles.itemColumn, { flex: 1 }]}>
                    {formatCurrencyForPDF(rate * quantity)}
                  </Text>
                </View>
              );
            })}
          </View>

          {/* Summary Section */}
          <View style={styles.summarySection}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal:</Text>
              <Text style={styles.summaryValue}>{formatCurrencyForPDF(calculateSubtotal())}</Text>
            </View>
            {invoiceData.discount > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>
                  Discount ({renderText(invoiceData.discount?.toString())}%):
                </Text>
                <Text style={styles.summaryValue}>- {formatCurrencyForPDF(calculateDiscount())}</Text>
              </View>
            )}
            <View style={[styles.summaryRow, styles.netPrice]}>
              <Text style={[styles.summaryLabel, styles.mediumText]}>Net Price:</Text>
              <Text style={[styles.summaryValue, styles.mediumText]}>
                {formatCurrencyForPDF(calculateNetPrice())}
              </Text>
            </View>
            {invoiceData.taxRate > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>
                  Tax ({renderText(invoiceData.taxRate?.toString())}%):
                </Text>
                <Text style={styles.summaryValue}>+ {formatCurrencyForPDF(calculateTax())}</Text>
              </View>
            )}
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalValue}>{formatCurrencyForPDF(calculateTotal())}</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Helvetica",
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: "Helvetica-Bold",
  },
  invoiceNumber: {
    fontSize: 12,
    color: "#666",
  },
  dates: {
    fontSize: 10,
  },
  date: {
    marginBottom: 4,
  },
  addresses: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  addressBlock: {
    flex: 1,
    maxWidth: "40%",
  },
  addressTitle: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
  },
  addressName: {
    fontSize: 10,
    marginBottom: 4,
  },
  addressText: {
    fontSize: 10,
    color: "#666",
  },
  items: {
    marginBottom: 30,
  },
  itemsHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
    paddingBottom: 8,
    marginBottom: 8,
  },
  itemRow: {
    flexDirection: "row",
    paddingVertical: 4,
  },
  itemColumn: {
    fontSize: 10,
    paddingHorizontal: 4,
  },
  summarySection: {
    marginTop: 20,
    alignSelf: "flex-end",
    width: "40%",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  summaryLabel: {
    color: "#666",
    fontSize: 10,
  },
  summaryValue: {
    fontSize: 10,
  },
  netPrice: {
    marginVertical: 8,
  },
  mediumText: {
    fontFamily: "Helvetica-Bold",
  },
  totalRow: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
    paddingTop: 8,
  },
  totalLabel: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
  },
  totalValue: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
  }
});

export default InvoicePDF;