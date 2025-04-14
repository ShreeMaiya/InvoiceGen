import React from "react";
import { format } from "date-fns";
import { InvoiceData } from "./InvoiceForm";

interface InvoiceHeaderProps {
  data: InvoiceData;
}

const InvoiceHeader: React.FC<InvoiceHeaderProps> = ({ data }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
      <div>
        <h1 className="text-2xl font-bold">INVOICE</h1>
        <p className="text-muted-foreground">{data.invoiceNumber}</p>
      </div>
      <div className="mt-4 md:mt-0 text-right">
        <p className="font-medium">Issue Date: {format(data.invoiceDate, "PPP")}</p>
        <p className="font-medium">Due Date: {format(data.dueDate, "PPP")}</p>
      </div>
    </div>
  );
};

export default InvoiceHeader;
