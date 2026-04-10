import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface InstagramSignupProps {
  onSignup: (username: string, isVerified: boolean) => void;
  onSwitchToLogin: () => void;
}

export default function InstagramSignup({ onSignup, onSwitchToLogin }: InstagramSignupProps) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onSignup(username.trim(), isVerified);
    }
  };

  const isValid = username.trim() && email.trim() && password.trim();

  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-4">
        {/* Main Signup Card */}
        <div className="bg-white border border-gray-300 rounded-sm p-10 text-center">
          {/* Instagram Logo */}
          <div className="mb-4">
            <h1 className="text-4xl font-semibold text-gray-900" style={{ fontFamily: "'Billabong', cursive" }}>
              Instagram
            </h1>
            <p className="text-xs text-primary mt-1 font-medium">Protected by Secura.AI</p>
          </div>

          {/* Signup Text */}
          <p className="text-gray-500 text-base font-semibold mb-6">
            Sign up to see photos and videos from your friends.
          </p>

          {/* Signup Form */}
          <form onSubmit={handleSignup} className="space-y-2">
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-[#fafafa] border-gray-300 text-sm h-10 rounded-sm"
            />
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-[#fafafa] border-gray-300 text-sm h-10 rounded-sm"
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[#fafafa] border-gray-300 text-sm h-10 rounded-sm"
            />
            
            {/* Verified Identity Checkbox */}
            <div className="flex items-start space-x-3 py-3 text-left">
              <Checkbox
                id="verified"
                checked={isVerified}
                onCheckedChange={(checked) => setIsVerified(checked === true)}
                className="mt-0.5"
              />
              <label htmlFor="verified" className="text-sm text-gray-700 cursor-pointer">
                This is my real identity (verified user)
              </label>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-[#0095f6] hover:bg-[#1877f2] text-white font-semibold h-9 rounded-lg"
              disabled={!isValid}
            >
              Sign up
            </Button>
          </form>

          {/* Terms */}
          <p className="text-xs text-gray-500 mt-4 px-4">
            By signing up, you agree to our Terms, Privacy Policy and Cookies Policy.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white border border-gray-300 rounded-sm p-5 text-center">
          <p className="text-sm text-gray-900">
            Have an account?{" "}
            <button 
              onClick={onSwitchToLogin}
              className="text-[#0095f6] font-semibold hover:underline"
            >
              Log in
            </button>
          </p>
        </div>

        {/* Demo Note */}
        <p className="text-xs text-center text-gray-400">
          For demo purposes only
        </p>
      </div>
    </div>
  );
}
