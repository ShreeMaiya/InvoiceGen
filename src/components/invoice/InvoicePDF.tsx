const calculateSubtotal = () => {
  return invoiceData.items.reduce(
    (total, item) => total + item.quantity * (item.rate || 0),
    0
  );
};

const calculateDiscount = () => {
  return calculateSubtotal() * ((invoiceData.discount || 0) / 100);
};

const calculateNetPrice = () => {
  return calculateSubtotal() - calculateDiscount();
};

const calculateTax = () => {
  return calculateNetPrice() * ((invoiceData.taxRate || 0) / 100);
};

const calculateTotal = () => {
  return calculateNetPrice() + calculateTax();
};

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
              <Text style={[styles.summaryValue, styles.mediumText]}>{formatCurrency(calculateNetPrice())}</Text>
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

const styles = StyleSheet.create({
  // ... existing styles ...
  
  netPrice: {
    marginVertical: 8,
  },
  mediumText: {
    fontFamily: 'Helvetica-Bold',
  },
}); 