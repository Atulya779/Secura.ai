import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, LogOut, Fingerprint, ShieldAlert, FlaskConical } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { User, Session } from "@supabase/supabase-js";
import { DigitalIdentityForm } from "@/components/DigitalIdentityForm";

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [showDigitalIdentity, setShowDigitalIdentity] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (!session) {
          navigate("/");
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      navigate("/");
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <Shield className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold gradient-text">Secura.AI</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`} 
                  alt="User avatar"
                  className="w-full h-full"
                />
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium">{user.email?.split('@')[0]}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          {!showDigitalIdentity ? (
            <>
              <div>
                <h1 className="text-4xl font-bold mb-2">Welcome back!</h1>
                <p className="text-muted-foreground">
                  Email: {user.email}
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Create Digital Identity Card */}
                <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setShowDigitalIdentity(true)}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-full bg-primary/10">
                        <Fingerprint className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle>Create Digital Identity</CardTitle>
                        <CardDescription>
                          Secure your identity on the blockchain
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Capture your biometric data and generate a unique blockchain-verified digital fingerprint.
                    </p>
                    <Button className="w-full">
                      Get Started
                    </Button>
                  </CardContent>
                </Card>

                {/* AI Forensics Lab Card */}
                <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/try-demo")}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-full bg-secondary/10">
                        <FlaskConical className="h-6 w-6 text-secondary" />
                      </div>
                      <div>
                        <CardTitle>AI Forensics Lab</CardTitle>
                        <CardDescription>
                          Analyze media for deepfakes
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Upload images, videos, or links to detect potential deepfakes using our AI.
                    </p>
                    <Button className="w-full" variant="secondary">
                      Try Demo
                    </Button>
                  </CardContent>
                </Card>

                {/* Impersonation Protection Card */}
                <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/impersonation-guard")}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-full bg-accent/10">
                        <ShieldAlert className="h-6 w-6 text-accent" />
                      </div>
                      <div>
                        <CardTitle>Impersonation Protection</CardTitle>
                        <CardDescription>
                          Prevent fake accounts from uploading deepfakes
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      See how Secura.AI protects identities on social media platforms.
                    </p>
                    <Button className="w-full" variant="outline">
                      Try Demo
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </>
          ) : (
            <div className="space-y-6">
              <Button variant="ghost" onClick={() => setShowDigitalIdentity(false)}>
                ← Back to Dashboard
              </Button>
              <DigitalIdentityForm />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
