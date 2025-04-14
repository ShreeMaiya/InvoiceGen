
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface FeatureProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: number;
  className?: string;
}

const Feature = ({
  icon: Icon,
  title,
  description,
  delay = 0,
  className,
}: FeatureProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: delay * 0.1,
      }}
      viewport={{ once: true }}
      className={cn(
        "relative p-6 rounded-xl border bg-card shadow-sm",
        className
      )}
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="p-2 rounded-lg bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <h3 className="text-lg font-medium">{title}</h3>
      </div>
      <p className="text-muted-foreground">{description}</p>
    </motion.div>
  );
};

export default Feature;
