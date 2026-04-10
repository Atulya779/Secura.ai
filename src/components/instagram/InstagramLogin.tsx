import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Instagram } from "lucide-react";

interface InstagramLoginProps {
  onLogin: (username: string) => void;
  onSwitchToSignup: () => void;
}

export default function InstagramLogin({ onLogin, onSwitchToSignup }: InstagramLoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onLogin(username.trim());
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-4">
        {/* Main Login Card */}
        <div className="bg-white border border-gray-300 rounded-sm p-10 text-center">
          {/* Instagram Logo */}
          <div className="mb-6">
            <h1 className="text-4xl font-semibold text-gray-900" style={{ fontFamily: "'Billabong', cursive" }}>
              Instagram
            </h1>
            <p className="text-xs text-primary mt-1 font-medium">Protected by Secura.AI</p>
          </div>

          {/* Welcome Text */}
          <p className="text-gray-500 text-sm mb-6">
            Log in to see photos and videos from your friends.
          </p>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-2">
            <Input
              type="text"
              placeholder="Username or email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-[#fafafa] border-gray-300 text-sm h-10 rounded-sm"
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[#fafafa] border-gray-300 text-sm h-10 rounded-sm"
            />
            <Button 
              type="submit" 
              className="w-full bg-[#0095f6] hover:bg-[#1877f2] text-white font-semibold h-9 rounded-lg mt-4"
              disabled={!username.trim()}
            >
              Log In
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-5">
            <div className="flex-1 h-px bg-gray-300" />
            <span className="px-4 text-sm text-gray-500 font-semibold">OR</span>
            <div className="flex-1 h-px bg-gray-300" />
          </div>

          {/* Forgot Password */}
          <button className="text-xs text-[#00376b] hover:underline">
            Forgot password?
          </button>
        </div>

        {/* Sign Up Card */}
        <div className="bg-white border border-gray-300 rounded-sm p-5 text-center">
          <p className="text-sm text-gray-900">
            Don't have an account?{" "}
            <button 
              onClick={onSwitchToSignup}
              className="text-[#0095f6] font-semibold hover:underline"
            >
              Sign up
            </button>
          </p>
        </div>

        {/* Demo Note */}
        <p className="text-xs text-center text-gray-400">
          This is a simulated Instagram demo for Secura.AI
        </p>
      </div>
    </div>
  );
}
