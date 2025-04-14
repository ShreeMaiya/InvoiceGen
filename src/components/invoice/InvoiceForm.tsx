import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import ImageUpload from "../ui-custom/ImageUpload";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";

export interface InvoiceItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  rate: number;
}

export interface InvoiceData {
  invoiceNumber: string;
  invoiceDate: Date;
  dueDate: Date;
  fromName: string;
  fromEmail: string;
  fromAddress: string;
  toName: string;
  toEmail: string;
  toAddress: string;
  items: InvoiceItem[];
  notes: string;
  taxRate: number;
  discount: number;
}

interface InvoiceFormProps {
  onSubmit: (data: InvoiceData) => void;
}

const InvoiceForm = ({ onSubmit }: InvoiceFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<InvoiceData>({
    invoiceNumber: `INV-${Math.floor(Math.random() * 10000).toString().padStart(4, "0")}`,
    invoiceDate: new Date(),
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    fromName: "",
    fromEmail: "",
    fromAddress: "",
    toName: "",
    toEmail: "",
    toAddress: "",
    items: [
      {
        id: crypto.randomUUID(),
        name: "",
        description: "",
        quantity: 1,
        rate: undefined,
      },
    ],
    notes: "",
    taxRate: undefined,
    discount: undefined,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    // Handle numeric fields
    if (name === "taxRate" || name === "discount") {
      const numValue = value === "" ? undefined : parseFloat(value);
      setFormData((prev) => ({ ...prev, [name]: numValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleItemChange = (
    id: string,
    field: keyof InvoiceItem,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: crypto.randomUUID(),
          name: "",
          description: "",
          quantity: 1,
          rate: undefined,
        },
      ],
    }));
  };

  const removeItem = (id: string) => {
    if (formData.items.length === 1) {
      toast({
        title: "Cannot remove item",
        description: "An invoice must have at least one item",
        variant: "destructive",
      });
      return;
    }
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }));
  };

  const calculateSubtotal = () => {
    return formData.items.reduce(
      (total, item) => total + item.quantity * (item.rate || 0),
      0
    );
  };

  const calculateDiscount = () => {
    return calculateSubtotal() * ((formData.discount || 0) / 100);
  };

  const calculateNetPrice = () => {
    return calculateSubtotal() - calculateDiscount();
  };

  const calculateTax = () => {
    return calculateNetPrice() * ((formData.taxRate || 0) / 100);
  };

  const calculateTotal = () => {
    return calculateNetPrice() + calculateTax();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Convert all numeric values properly
    const submissionData = {
      ...formData,
      taxRate: parseFloat(formData.taxRate?.toString() || "0"),
      discount: parseFloat(formData.discount?.toString() || "0"),
      items: formData.items.map(item => ({
        ...item,
        rate: parseFloat(item.rate?.toString() || "0"),
        quantity: parseInt(item.quantity?.toString() || "1")
      }))
    };
    onSubmit(submissionData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10 pb-10">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-4"
      >
        {/* Invoice Details */}
        <div className="space-y-4 md:space-y-0">
          <div className="space-y-2 md:space-y-0 md:grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="invoiceNumber">Invoice Number</Label>
              <Input
                id="invoiceNumber"
                name="invoiceNumber"
                value={formData.invoiceNumber}
                onChange={handleChange}
                placeholder="INV-0001"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="invoiceDate">Invoice Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="invoiceDate"
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.invoiceDate ? (
                        format(formData.invoiceDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.invoiceDate}
                      onSelect={(date) =>
                        setFormData((prev) => ({
                          ...prev,
                          invoiceDate: date || new Date(),
                        }))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="dueDate"
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.dueDate ? (
                        format(formData.dueDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.dueDate}
                      onSelect={(date) =>
                        setFormData((prev) => ({
                          ...prev,
                          dueDate: date || new Date(),
                        }))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <Separator />

      {/* From and To Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="grid md:grid-cols-2 gap-8"
      >
        {/* From Section */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">From</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="fromName">Business Name</Label>
                <Input
                  id="fromName"
                  name="fromName"
                  value={formData.fromName}
                  onChange={handleChange}
                  placeholder="Your Business Name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="fromEmail">Email</Label>
                <Input
                  id="fromEmail"
                  name="fromEmail"
                  type="email"
                  value={formData.fromEmail}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="fromAddress">Address</Label>
                <Textarea
                  id="fromAddress"
                  name="fromAddress"
                  value={formData.fromAddress}
                  onChange={handleChange}
                  placeholder="Your business address"
                  rows={3}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* To Section */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Bill To</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="toName">Client Name</Label>
                <Input
                  id="toName"
                  name="toName"
                  value={formData.toName}
                  onChange={handleChange}
                  placeholder="Client Name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="toEmail">Email</Label>
                <Input
                  id="toEmail"
                  name="toEmail"
                  type="email"
                  value={formData.toEmail}
                  onChange={handleChange}
                  placeholder="client@email.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="toAddress">Address</Label>
                <Textarea
                  id="toAddress"
                  name="toAddress"
                  value={formData.toAddress}
                  onChange={handleChange}
                  placeholder="Client address"
                  rows={3}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Separator />

      {/* Items Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <h3 className="text-lg font-medium mb-4">Items</h3>
        <div className="space-y-4">
          {formData.items.map((item) => (
            <Card key={item.id}>
              <CardContent className="pt-6">
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`item-name-${item.id}`}>Item Name</Label>
                      <Input
                        id={`item-name-${item.id}`}
                        value={item.name}
                        onChange={(e) =>
                          handleItemChange(item.id, "name", e.target.value)
                        }
                        placeholder="Item name"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`item-quantity-${item.id}`}>Quantity</Label>
                      <Input
                        id={`item-quantity-${item.id}`}
                        type="number"
                        min="1"
                        step="1"
                        value={item.quantity}
                        onChange={(e) =>
                          handleItemChange(
                            item.id,
                            "quantity",
                            parseInt(e.target.value) || 1
                          )
                        }
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`item-price-${item.id}`}>Price</Label>
                      <Input
                        id={`item-price-${item.id}`}
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.rate || ""}
                        onChange={(e) =>
                          handleItemChange(
                            item.id,
                            "rate",
                            parseFloat(e.target.value) || undefined
                          )
                        }
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`item-description-${item.id}`}>Description</Label>
                      <Input
                        id={`item-description-${item.id}`}
                        value={item.description}
                        onChange={(e) =>
                          handleItemChange(item.id, "description", e.target.value)
                        }
                        placeholder="Item description"
                      />
                    </div>
                  </div>
                  <div className="mt-4 text-right">
                    <p className="text-sm text-muted-foreground">
                      Subtotal: {formatCurrency(item.quantity * (item.rate || 0))}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Tax and Discount Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="space-y-6"
      >
        <div className="grid md:grid-cols-2 gap-8">
          {/* Discount Section */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Discount</h3>
              <div>
                <Label htmlFor="discount">Discount Rate (%)</Label>
                <Input
                  id="discount"
                  name="discount"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={formData.discount || ""}
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>
            </CardContent>
          </Card>

          {/* Tax Section */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Tax</h3>
              <div>
                <Label htmlFor="taxRate">Tax Rate (%)</Label>
                <Input
                  id="taxRate"
                  name="taxRate"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={formData.taxRate || ""}
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary Card */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Subtotal:</span>
              <span>{formatCurrency(calculateSubtotal())}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">
                Discount ({formData.discount || 0}%):
              </span>
              <span>- {formatCurrency(calculateDiscount())}</span>
            </div>
            <div className="flex justify-between items-center font-medium">
              <span>Net Price:</span>
              <span>{formatCurrency(calculateNetPrice())}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">
                Tax ({formData.taxRate || 0}%):
              </span>
              <span>+ {formatCurrency(calculateTax())}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center font-medium">
              <span>Total:</span>
              <span className="text-xl">{formatCurrency(calculateTotal())}</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Submit Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="flex justify-center"
      >
        <Button
          type="submit"
          size="lg"
          className="px-10 text-base rounded-full shadow-lg hover:shadow-xl transition-all bg-primary"
        >
          Generate Invoice
        </Button>
      </motion.div>
    </form>
  );
};

export default InvoiceForm;
