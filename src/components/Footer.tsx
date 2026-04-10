import { Shield, Github, Twitter, Linkedin, Mail } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold gradient-text">Secura.AI</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Predict. Prevent. Protect.
            </p>
            <p className="text-muted-foreground text-sm">
              AI-powered deepfake detection and prevention platform
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#about" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  About
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#impact" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Impact
                </a>
              </li>
              <li>
                <a href="#team" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Team
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Connect With Us</h3>
            <div className="flex gap-3">
              <a 
                href="#" 
                className="p-3 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-all hover:shadow-[0_0_20px_hsl(var(--primary)/0.4)]"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="p-3 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-all hover:shadow-[0_0_20px_hsl(var(--primary)/0.4)]"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="p-3 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-all hover:shadow-[0_0_20px_hsl(var(--primary)/0.4)]"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href="mailto:contact@secura.ai" 
                className="p-3 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-all hover:shadow-[0_0_20px_hsl(var(--primary)/0.4)]"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
            <p className="text-sm text-muted-foreground">
              <a href="mailto:contact@secura.ai" className="hover:text-primary transition-colors">
                contact@secura.ai
              </a>
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 Secura.AI by Team Ballerina. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
