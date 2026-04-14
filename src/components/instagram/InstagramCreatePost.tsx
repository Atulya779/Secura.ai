import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Image, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { compressImage, blobToFile } from "@/utils/imageUtils";
import { useToast } from "@/hooks/use-toast";
import { VisualModerationResult } from "@/utils/moderationTypes";

interface InstagramCreatePostProps {
  username: string;
  isVerified: boolean;
  onBack: () => void;
  onSuccess: (imageUrl: string, caption: string, result: VisualModerationResult) => void;
  onBlocked: (result: VisualModerationResult) => void;
}

export default function InstagramCreatePost({
  username,
  isVerified,
  onBack,
  onSuccess,
  onBlocked,
}: InstagramCreatePostProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [caption, setCaption] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.match(/^image\/(jpeg|png|webp)$/)) {
        toast({
          title: "Invalid format",
          description: "Please upload JPG, PNG, or WEBP images only.",
          variant: "destructive",
        });
        return;
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleShare = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);

    try {
      // Compress image before sending
      const compressedBlob = await compressImage(selectedImage, 512, 0.7);
      const compressedFile = blobToFile(compressedBlob, selectedImage.name);

      const formData = new FormData();
      formData.append("file", compressedFile);
      
      // Attempt to use local high-precision backend if available
      let result: VisualModerationResult;
      try {
        const localResponse = await fetch("http://localhost:8000/verify-upload", {
          method: "POST",
          body: formData,
        });
        
        if (!localResponse.ok) throw new Error("Local backend unavailable");
        
        const localData = await localResponse.json();
        result = {
          category: localData.type === "deepfake" ? "DEEPFAKE" : localData.type === "ai" ? "AI_SAFE" : "REAL",
          decision: localData.decision.toUpperCase() as VisualModerationResult["decision"],
          confidence: localData.risk_score,
          label: localData.type === "deepfake" ? "Deepfake Detected" : "Verified Real",
          explanation: localData.reason,
          evidence: [localData.reason],
          needsReview: localData.risk_score > 50,
          model: { source: "remote", version: "gemini-1.5-flash" },
          analysisType: "image"
        };
      } catch (err) {
        console.warn("Local backend check failed, falling back to Supabase:", err);
        const { data, error } = await supabase.functions.invoke("impersonation-check", {
          body: formData,
        });
        if (error) throw error;
        result = data as VisualModerationResult;
      }

      if (result.decision === "BLOCK") {
        toast({
          title: "Content Blocked",
          description: "This photo was identified as a deepfake or inappropriate.",
          variant: "destructive",
        });
        onBlocked(result);
      } else {
        onSuccess(imagePreview, caption, result);
      }
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis Failed",
        description: "Could not verify content. Please check your connection.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-300 sticky top-0 z-50 bg-white">
        <div className="flex items-center justify-between px-4 h-12">
          <button onClick={onBack} className="p-2 -ml-2">
            <ArrowLeft className="h-6 w-6 text-gray-900" />
          </button>
          <h1 className="font-semibold text-gray-900">Create new post</h1>
          <Button
            variant="ghost"
            size="sm"
            className="text-[#0095f6] font-semibold hover:text-[#00376b] disabled:opacity-50"
            onClick={handleShare}
            disabled={!selectedImage || isAnalyzing}
          >
            {isAnalyzing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Share"
            )}
          </Button>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-lg mx-auto">
        {/* Image Upload Area */}
        {!imagePreview ? (
          <div 
            className="aspect-square bg-gray-50 flex flex-col items-center justify-center cursor-pointer border-b border-gray-200"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="text-center space-y-4">
              <div className="w-24 h-24 mx-auto border-2 border-gray-900 rounded-full flex items-center justify-center">
                <Image className="h-12 w-12 text-gray-900" strokeWidth={1} />
              </div>
              <div>
                <p className="text-xl text-gray-900 mb-2">Drag photos here</p>
                <Button 
                  variant="default"
                  className="bg-[#0095f6] hover:bg-[#1877f2] text-white"
                >
                  Select from computer
                </Button>
              </div>
              <p className="text-xs text-gray-500">JPG, PNG, WEBP</p>
            </div>
          </div>
        ) : (
          <div className="relative">
            <img 
              src={imagePreview} 
              alt="Selected" 
              className="w-full aspect-square object-cover"
            />
            <button
              onClick={() => {
                setSelectedImage(null);
                setImagePreview("");
              }}
              className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {selectedImage && (
              <div className="absolute bottom-4 left-4 right-4 bg-black/60 text-white p-2 rounded text-xs">
                File: {selectedImage.name}
              </div>
            )}
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleImageSelect}
        />

        {/* Caption */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-0.5 flex-shrink-0">
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                <span className="text-xs font-semibold text-gray-600">{username[0]?.toUpperCase()}</span>
              </div>
            </div>
            <Textarea
              placeholder="Write a caption..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="border-none resize-none p-0 focus-visible:ring-0 text-sm min-h-[80px]"
            />
          </div>
        </div>

        {/* Analyzing State */}
        {isAnalyzing && (
          <div className="p-6 text-center">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-primary/10 rounded-full">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span className="text-sm text-primary font-medium">
                Secura.AI is verifying your content...
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Info Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gray-50 border-t border-gray-200">
        <p className="text-xs text-center text-gray-500">
          All uploads are verified by Secura.AI to prevent deepfake impersonation
        </p>
      </div>
    </div>
  );
}
