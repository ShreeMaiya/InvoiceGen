
import React from "react";
import { formatCurrency } from "@/lib/utils";
import { InvoiceData } from "./InvoiceForm";
import { useIsMobile } from "@/hooks/use-mobile";

interface InvoiceItemsTableProps {
  data: InvoiceData;
}

const InvoiceItemsTable: React.FC<InvoiceItemsTableProps> = ({ data }) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="mb-10">
        <div className="bg-muted rounded-t-lg p-4 font-medium">
          <h3>Items</h3>
        </div>
        <div className="border rounded-b-lg divide-y">
          {data.items.map((item) => (
            <div key={item.id} className="p-4 space-y-2">
              <div className="flex justify-between items-start">
                <div className="font-medium">{item.name}</div>
                <div className="font-medium">{formatCurrency(item.quantity * item.rate)}</div>
              </div>
              {item.description && (
                <div className="text-sm text-muted-foreground">{item.description}</div>
              )}
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Qty: {item.quantity}</span>
                <span>Rate: {formatCurrency(item.rate)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-10">
      <div className="bg-muted rounded-t-lg grid grid-cols-12 gap-4 p-4 font-medium">
        <div className="col-span-5">Item</div>
        <div className="col-span-3">Quantity</div>
        <div className="col-span-2 text-right">Rate</div>
        <div className="col-span-2 text-right">Amount</div>
      </div>
      <div className="border rounded-b-lg divide-y">
        {data.items.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-12 gap-4 p-4 items-center"
          >
            <div className="col-span-5">
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-muted-foreground">
                {item.description}
              </p>
            </div>
            <div className="col-span-3">{item.quantity}</div>
            <div className="col-span-2 text-right">
              {formatCurrency(item.rate)}
            </div>
            <div className="col-span-2 text-right font-medium">
              {formatCurrency(item.quantity * item.rate)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InvoiceItemsTable;
