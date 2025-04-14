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

  {/* Invoice Summary */}
  <div className="mt-8">
    <div className="flex justify-between items-center mb-2">
      <span className="text-muted-foreground">Subtotal:</span>
      <span>{formatCurrency(calculateSubtotal())}</span>
    </div>
    <div className="flex justify-between items-center mb-2">
      <span className="text-muted-foreground">
        Discount ({invoiceData.discount || 0}%):
      </span>
      <span>- {formatCurrency(calculateDiscount())}</span>
    </div>
    <div className="flex justify-between items-center mb-2 font-medium">
      <span>Net Price:</span>
      <span>{formatCurrency(calculateNetPrice())}</span>
    </div>
    <div className="flex justify-between items-center mb-2">
      <span className="text-muted-foreground">
        Tax ({invoiceData.taxRate || 0}%):
      </span>
      <span>+ {formatCurrency(calculateTax())}</span>
    </div>
    <Separator className="my-4" />
    <div className="flex justify-between items-center font-bold text-lg">
      <span>Total:</span>
      <span>{formatCurrency(calculateTotal())}</span>
    </div>
  </div> 