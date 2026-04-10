import { motion } from "framer-motion";
import { Shield, Database, Eye, Zap } from "lucide-react";

export const About = () => {
  const features = [
    {
      icon: Shield,
      title: "Blockchain Security",
      description: "Verified digital fingerprints"
    },
    {
      icon: Eye,
      title: "24/7 Monitoring",
      description: "Continuous deepfake detection"
    },
    {
      icon: Database,
      title: "AI Learning",
      description: "Adaptive threat intelligence"
    },
    {
      icon: Zap,
      title: "Real-time Protection",
      description: "Instant threat response"
    }
  ];

  return (
    <section id="about" className="py-24 bg-gradient-to-b from-background to-muted/20">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center space-y-8"
        >
          <h2 className="text-4xl md:text-5xl font-bold">
            What is <span className="gradient-text">Secura.AI</span>?
          </h2>
          
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Secura.AI combines AI and blockchain to protect your digital identity. 
            It creates verified digital fingerprints for your content, monitors deepfake 
            activity across the web, and auto-blocks harmful content before it spreads.
          </p>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-12">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="group"
              >
                <div className="relative p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_hsl(var(--primary)/0.2)]">
                  <div className="mb-4 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
