import { View, Text, StyleSheet } from "@react-pdf/renderer";
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

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>INVOICE</Text>
          <Text style={styles.invoiceNumber}>#{invoiceData.invoiceNumber}</Text>
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
          <Text style={styles.addressName}>{invoiceData.fromName}</Text>
          <Text style={styles.addressText}>{invoiceData.fromEmail}</Text>
          <Text style={styles.addressText}>{invoiceData.fromAddress}</Text>
        </View>
        <View style={styles.addressBlock}>
          <Text style={styles.addressTitle}>Bill To:</Text>
          <Text style={styles.addressName}>{invoiceData.toName}</Text>
          <Text style={styles.addressText}>{invoiceData.toEmail}</Text>
          <Text style={styles.addressText}>{invoiceData.toAddress}</Text>
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
        {invoiceData.items.map((item) => (
          <View key={item.id} style={styles.itemRow}>
            <Text style={[styles.itemColumn, { flex: 2 }]}>{item.name}</Text>
            <Text style={[styles.itemColumn, { flex: 3 }]}>{item.description}</Text>
            <Text style={[styles.itemColumn, { flex: 1 }]}>{item.quantity}</Text>
            <Text style={[styles.itemColumn, { flex: 1 }]}>
              {formatCurrency(item.rate || 0)}
            </Text>
            <Text style={[styles.itemColumn, { flex: 1 }]}>
              {formatCurrency((item.rate || 0) * item.quantity)}
            </Text>
          </View>
        ))}
      </View>

      {/* Summary Section */}
      <View style={styles.summarySection}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal:</Text>
          <Text style={styles.summaryValue}>{formatCurrency(calculateSubtotal())}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>
            Discount ({invoiceData.discount || 0}%):
          </Text>
          <Text style={styles.summaryValue}>- {formatCurrency(calculateDiscount())}</Text>
        </View>
        <View style={[styles.summaryRow, styles.netPrice]}>
          <Text style={[styles.summaryLabel, styles.mediumText]}>Net Price:</Text>
          <Text style={[styles.summaryValue, styles.mediumText]}>
            {formatCurrency(calculateNetPrice())}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>
            Tax ({invoiceData.taxRate || 0}%):
          </Text>
          <Text style={styles.summaryValue}>+ {formatCurrency(calculateTax())}</Text>
        </View>
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalValue}>{formatCurrency(calculateTotal())}</Text>
        </View>
      </View>

      {/* Notes */}
      {invoiceData.notes && (
        <View style={styles.notes}>
          <Text style={styles.notesTitle}>Notes:</Text>
          <Text style={styles.notesText}>{invoiceData.notes}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 30,
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
  },
  notes: {
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
  },
  notesTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
  },
  notesText: {
    fontSize: 10,
    color: "#666",
  },
});

export default InvoicePDF; 