import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import InstagramLogin from "@/components/instagram/InstagramLogin";
import InstagramSignup from "@/components/instagram/InstagramSignup";
import InstagramHome from "@/components/instagram/InstagramHome";
import InstagramCreatePost from "@/components/instagram/InstagramCreatePost";
import { InstagramBlockedModal, InstagramSuccessModal } from "@/components/instagram/InstagramResultModals";
import { VisualModerationResult } from "@/utils/moderationTypes";
import { submitModerationReport } from "@/utils/moderationReport";
import { useToast } from "@/hooks/use-toast";
import { SplineScene } from "@/components/SplineScene";

type InstagramView = "login" | "signup" | "home" | "create";

interface InstagramUser {
  username: string;
  isVerified: boolean;
}

interface Post {
  id: string;
  imageUrl: string;
  caption: string;
  likes: number;
  timestamp: Date;
  moderation: VisualModerationResult;
}

export default function ImpersonationGuard() {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [view, setView] = useState<InstagramView>("login");
  const [instagramUser, setInstagramUser] = useState<InstagramUser | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  
  // Modal states
  const [showBlockedModal, setShowBlockedModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [blockedResult, setBlockedResult] = useState<VisualModerationResult | null>(null);
  const [successResult, setSuccessResult] = useState<VisualModerationResult | null>(null);

  const { toast } = useToast();

  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/");
      } else {
        setAuthUser(session.user);
      }
    });
  }, [navigate]);

  const handleLogin = (username: string) => {
    setInstagramUser({ username, isVerified: false });
    setView("home");
  };

  const handleSignup = (username: string, isVerified: boolean) => {
    setInstagramUser({ username, isVerified });
    setView("home");
  };

  const handleLogout = () => {
    setInstagramUser(null);
    setPosts([]);
    setView("login");
  };

  const handleExitDemo = () => {
    navigate("/dashboard");
  };

  const handlePostBlocked = (result: VisualModerationResult) => {
    setBlockedResult(result);
    setShowBlockedModal(true);
  };

  const handlePostSuccess = (imageUrl: string, caption: string, result: VisualModerationResult) => {
    // Add the post to the posts array
    if (imageUrl) {
      const newPost: Post = {
        id: Date.now().toString(),
        imageUrl,
        caption: caption || "",
        likes: Math.floor(Math.random() * 100) + 1,
        timestamp: new Date(),
        moderation: result,
      };
      setPosts([newPost, ...posts]);
    }
    setSuccessResult(result);
    setShowSuccessModal(true);
  };

  const handleReport = async (result: VisualModerationResult, feedback: string) => {
    if (!instagramUser) return;

    try {
      await submitModerationReport({
        username: instagramUser.username,
        result,
        userFeedback: feedback,
      });
      toast({
        title: "Report submitted",
        description: "Thanks for helping us improve the model.",
      });
    } catch (error) {
      console.error("Report error:", error);
      toast({
        title: "Report failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleCloseBlockedModal = () => {
    setShowBlockedModal(false);
    setView("home");
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setView("home");
  };

  if (!authUser) return null;

  return (
    <div className="relative min-h-screen bg-slate-900 overflow-hidden">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0 opacity-40">
        <SplineScene scene="https://prod.spline.design/kZ9s743ubmSre0su/scene.splinecode" />
      </div>

      {/* Main Content Overlay */}
      <div className="relative z-10 min-h-screen">
      {/* Instagram Clone Views */}
      {view === "login" && (
        <InstagramLogin 
          onLogin={handleLogin} 
          onSwitchToSignup={() => setView("signup")} 
        />
      )}

      {view === "signup" && (
        <InstagramSignup 
          onSignup={handleSignup} 
          onSwitchToLogin={() => setView("login")} 
        />
      )}

      {view === "home" && instagramUser && (
        <InstagramHome
          username={instagramUser.username}
          isVerified={instagramUser.isVerified}
          onCreatePost={() => setView("create")}
          onLogout={handleLogout}
          onExitDemo={handleExitDemo}
          posts={posts}
        />
      )}

      {view === "create" && instagramUser && (
        <InstagramCreatePost
          username={instagramUser.username}
          isVerified={instagramUser.isVerified}
          onBack={() => setView("home")}
          onSuccess={handlePostSuccess}
          onBlocked={handlePostBlocked}
        />
      )}

      {/* Result Modals */}
      <InstagramBlockedModal
        open={showBlockedModal}
        result={blockedResult}
        onClose={handleCloseBlockedModal}
        onReport={(feedback) => blockedResult && handleReport(blockedResult, feedback)}
      />

      <InstagramSuccessModal
        open={showSuccessModal}
        onClose={handleCloseSuccessModal}
        result={successResult}
        onReport={(feedback) => successResult && handleReport(successResult, feedback)}
      />
      </div>
    </div>
  );
}
