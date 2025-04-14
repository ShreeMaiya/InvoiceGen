
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-9xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60"
        >
          404
        </motion.div>
        <h1 className="text-3xl font-bold mb-4">Page not found</h1>
        <p className="text-muted-foreground mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Button asChild variant="default" className="rounded-full px-6">
          <Link to="/" className="inline-flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return to Home
          </Link>
        </Button>
      </motion.div>
    </div>
  );
};

export default NotFound;
