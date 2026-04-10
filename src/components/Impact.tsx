import { motion } from "framer-motion";
import { TrendingDown, Users, AlertTriangle } from "lucide-react";

export const Impact = () => {
  const stats = [
    {
      icon: TrendingDown,
      value: "92%",
      label: "Reduction in fake media reach",
      color: "text-secondary"
    },
    {
      icon: Users,
      value: "1M+",
      label: "Users protected globally",
      color: "text-primary"
    },
    {
      icon: AlertTriangle,
      value: "1000+",
      label: "New deepfake patterns detected weekly",
      color: "text-accent"
    }
  ];

  return (
    <section id="impact" className="py-24 bg-gradient-to-b from-muted/20 to-background">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4 mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold">
            Our <span className="gradient-text">Impact</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real-time protection delivering measurable results
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="relative group"
            >
              <div className="p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_40px_hsl(var(--primary)/0.2)]">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`p-3 rounded-xl bg-primary/10 ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div className={`text-4xl md:text-5xl font-bold ${stat.color}`}>
                    {stat.value}
                  </div>
                </div>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Threat Heatmap Visualization */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="p-8 rounded-2xl bg-card border border-border">
            <h3 className="text-2xl font-bold mb-6 text-center">
              Global Deepfake Threat Levels
            </h3>
            
            {/* Simplified Heatmap Representation */}
            <div className="space-y-4">
              {[
                { region: "North America", level: 85, color: "bg-destructive" },
                { region: "Europe", level: 72, color: "bg-accent" },
                { region: "Asia Pacific", level: 68, color: "bg-primary" },
                { region: "South America", level: 45, color: "bg-secondary" },
                { region: "Africa", level: 32, color: "bg-muted" }
              ].map((region, index) => (
                <motion.div
                  key={region.region}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  className="space-y-2"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{region.region}</span>
                    <span className="text-sm text-muted-foreground">{region.level}% threat level</span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${region.level}%` }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 + 0.3, duration: 0.8 }}
                      className={`h-full ${region.color} rounded-full`}
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Live data updated every 5 minutes
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
