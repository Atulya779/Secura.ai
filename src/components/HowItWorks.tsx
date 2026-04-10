import { motion } from "framer-motion";
import { Fingerprint, Radar, Brain, ShieldCheck } from "lucide-react";

export const HowItWorks = () => {
  
  const steps = [
    {
      icon: Fingerprint,
      title: "Digital Identity Creation",
      description: "Create a unique, blockchain-verified fingerprint for your digital content",
      color: "primary"
    },
    {
      icon: Radar,
      title: "Continuous Monitoring",
      description: "AI scans the web 24/7 for unauthorized use of your identity",
      color: "secondary"
    },
    {
      icon: Brain,
      title: "AI Threat Prediction",
      description: "Machine learning models predict deepfake patterns before they spread",
      color: "accent"
    },
    {
      icon: ShieldCheck,
      title: "Real-time Protection",
      description: "Automated blocking and alerts prevent damage before it happens",
      color: "primary"
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-background">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4 mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold">
            How <span className="gradient-text">It Works</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Four powerful steps to complete digital protection
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className="relative"
            >
              <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
                {/* Step Number & Icon */}
                <div className="flex-shrink-0 relative">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 flex items-center justify-center">
                    <step.icon className="w-10 h-10 text-primary" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
