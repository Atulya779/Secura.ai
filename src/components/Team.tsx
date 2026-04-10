import { motion } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";

export const Team = () => {
  const team = [
    {
      name: "Sk Rehan Islam",
      role: "2nd Year BCA Student",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=male1"
    },
    {
      name: "Utkarsh Singh",
      role: "2nd Year Btech CSE AI&ML Student",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=male2"
    },
    {
      name: "Jatin Pant",
      role: "2nd Year Btech CSE CS",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=male3"
    },
    {
      name: "Atulya Kumar",
      role: "2nd Year BCA",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=male4"
    }
  ];

  return (
    <section id="team" className="py-24 bg-background">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4 mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold">
            Built by Team <span className="gradient-text">Ballerina</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A passionate group of AI innovators from DBUU dedicated to protecting digital truth
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {team.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group"
            >
              <div className="relative p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_hsl(var(--primary)/0.2)]">
                {/* Avatar */}
                <div className="mb-4 relative">
                  <div className="w-24 h-24 mx-auto rounded-full overflow-hidden ring-2 ring-primary/20 group-hover:ring-primary/50 transition-all">
                    <img 
                      src={member.avatar} 
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-b from-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Info */}
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-semibold">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>

                {/* Social Links */}
                <div className="flex justify-center gap-3 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors">
                    <Github className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors">
                    <Linkedin className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors">
                    <Mail className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
