
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  value: string | null;
  onChange: (value: string | null) => void;
  className?: string;
}

const ImageUpload = ({ value, onChange, className }: ImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [previewLoaded, setPreviewLoaded] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setPreviewLoaded(false);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        onChange(event.target.result as string);
        setIsLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={className}>
      <AnimatePresence mode="wait">
        {value ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative rounded-lg overflow-hidden border aspect-[3/2] flex items-center justify-center"
          >
            <div className={`blurred-img w-full h-full ${previewLoaded ? 'loaded' : ''}`} 
                 style={{backgroundImage: `url(${value})`}}>
              <img
                src={value}
                alt="Preview"
                className="w-full h-full object-contain"
                onLoad={() => setPreviewLoaded(true)}
              />
            </div>
            <Button
              size="icon"
              variant="destructive"
              className="absolute top-2 right-2 rounded-full h-8 w-8"
              onClick={removeImage}
            >
              <X className="h-4 w-4" />
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="border border-dashed rounded-lg flex flex-col items-center justify-center p-8 cursor-pointer hover:bg-secondary/50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="p-3 rounded-full bg-secondary mb-4">
              <Upload className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium mb-1">Upload logo</p>
            <p className="text-xs text-muted-foreground text-center">
              Drag and drop or click to browse
            </p>
            {isLoading && (
              <div className="mt-4 h-1.5 w-24 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary/60 to-primary animate-shimmer bg-[length:200%_100%]"></div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
};

export default ImageUpload;
