import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from "@/components/ui-custom/Navbar";
import Feature from "@/components/ui-custom/Feature";
import { ArrowRight, FileText, Mail, PenTool, Share2, Shield } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4"
            >
              Fast. Beautiful. Professional.
            </motion.div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Create gorgeous invoices in seconds
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A beautiful invoice generator with pixel-perfect design and seamless sharing options. No account required.
            </p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Button
                asChild
                size="lg"
                className="rounded-full px-8 py-6 text-base shadow-lg hover:shadow-xl transition-all bg-primary text-primary-foreground"
              >
                <Link to="/create">
                  Create Invoice 
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 md:px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything you need for professional invoicing
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Simple, intuitive, and powerful. Create beautiful invoices without the complexity.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Feature
              icon={PenTool}
              title="Beautiful Design"
              description="Create professionally designed invoices that make a lasting impression on your clients."
              delay={0}
            />
            <Feature
              icon={FileText}
              title="Complete Details"
              description="Include all important information like invoice numbers, payment terms, taxes, and itemized billing."
              delay={1}
            />
            <Feature
              icon={Share2}
              title="Easy Sharing"
              description="Share your invoices instantly via WhatsApp, email, or download as a PDF for your records."
              delay={2}
            />
            <Feature
              icon={Shield}
              title="No Account Needed"
              description="Get started right away without needing to create an account or log in. Your data stays private."
              delay={3}
            />
            <Feature
              icon={Mail}
              title="Professional Communication"
              description="Send invoices directly to clients with pre-formatted professional emails."
              delay={4}
              className="md:col-span-2 lg:col-span-1"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center bg-gradient-to-b from-background to-muted/50 p-10 rounded-2xl border shadow-sm"
        >
          <h2 className="text-3xl font-bold mb-4">Ready to get paid?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Create your first invoice today and experience the simplicity of professional invoicing.
          </p>
          <Button
            asChild
            size="lg"
            className="rounded-full px-8 py-6 text-base shadow-lg hover:shadow-xl transition-all bg-primary text-primary-foreground"
          >
            <Link to="/create">
              Create an Invoice Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 md:px-6 border-t">
        <div className="max-w-7xl mx-auto">
          <p className="text-muted-foreground text-center">
            © {new Date().getFullYear()} InvoiceGen. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
