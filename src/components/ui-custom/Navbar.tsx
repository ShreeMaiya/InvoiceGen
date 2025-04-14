import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out px-6 py-4 ${
        scrolled ? "glass shadow-sm" : "bg-transparent"
      }`}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-semibold tracking-tight">InvoiceGen</span>
        </Link>

        <div className="flex items-center gap-3">
          {location.pathname !== "/create" && (
            <Button
              asChild
              className="rounded-full px-6 shadow-sm transition-all hover:shadow bg-primary text-primary-foreground"
            >
              <Link to="/create">Create Invoice</Link>
            </Button>
          )}
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;
