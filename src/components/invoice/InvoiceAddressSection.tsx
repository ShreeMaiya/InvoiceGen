import React from "react";
import { InvoiceData } from "./InvoiceForm";

interface InvoiceAddressSectionProps {
  data: InvoiceData;
}

const InvoiceAddressSection: React.FC<InvoiceAddressSectionProps> = ({ data }) => {
  return (
    <div className="grid md:grid-cols-2 gap-10 mb-10">
      <div>
        <h2 className="text-lg font-semibold mb-2">From</h2>
        <p className="font-medium">{data.fromName}</p>
        <p className="text-muted-foreground">{data.fromEmail}</p>
        <p className="whitespace-pre-line text-muted-foreground">
          {data.fromAddress}
        </p>
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-2">Bill To</h2>
        <p className="font-medium">{data.toName}</p>
        <p className="text-muted-foreground">{data.toEmail}</p>
        <p className="whitespace-pre-line text-muted-foreground">
          {data.toAddress}
        </p>
      </div>
    </div>
  );
};

export default InvoiceAddressSection;
