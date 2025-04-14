import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface InvoiceNotesProps {
  notes: string | undefined;
}

const InvoiceNotes: React.FC<InvoiceNotesProps> = ({ notes }) => {
  const isMobile = useIsMobile();
  
  if (!notes) return null;

  return (
    <div className={`bg-secondary/50 ${isMobile ? 'p-4' : 'p-6'} rounded-lg`}>
      <h2 className="font-medium mb-2">Notes</h2>
      <p className="text-muted-foreground whitespace-pre-line text-sm md:text-base">
        {notes}
      </p>
    </div>
  );
};

export default InvoiceNotes;
