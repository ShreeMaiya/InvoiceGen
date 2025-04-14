
import { motion } from "framer-motion";
import { Calendar, FileText, Tag } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface InvoiceCardProps {
  id: string;
  client: string;
  amount: number;
  date: string;
  status: "paid" | "pending" | "draft";
}

const InvoiceCard = ({ id, client, amount, date, status }: InvoiceCardProps) => {
  const statusColors = {
    paid: "bg-green-100 text-green-800",
    pending: "bg-amber-100 text-amber-800",
    draft: "bg-blue-100 text-blue-800",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="p-6 rounded-xl border bg-card shadow-sm hover:shadow-md transition-all duration-300"
    >
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">
              Invoice #{id}
            </span>
          </div>
          <h3 className="text-xl font-medium">{client}</h3>
        </div>
        <div
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            statusColors[status]
          }`}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{date}</span>
        </div>
        <span className="text-lg font-medium">{formatCurrency(amount)}</span>
      </div>
    </motion.div>
  );
};

export default InvoiceCard;
