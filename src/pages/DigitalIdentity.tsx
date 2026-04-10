import { motion } from "framer-motion";
import { Camera, Mic, Copy, ArrowLeft, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

const DigitalIdentity = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [photoTaken, setPhotoTaken] = useState(false);
  const [voiceRecorded, setVoiceRecorded] = useState(false);
  const [photoHash, setPhotoHash] = useState("");
  const [voiceHash, setVoiceHash] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        context.drawImage(videoRef.current, 0, 0, 300, 300);
        setPhotoTaken(true);
        // Generate hash for photo
        const photoHashCode = Array.from({ length: 64 }, () =>
          Math.floor(Math.random() * 16).toString(16)
        ).join("");
        setPhotoHash(photoHashCode);
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
      }
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      setVoiceRecorded(true);
      // Generate hash for voice
      const voiceHashCode = Array.from({ length: 64 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join("");
      setVoiceHash(voiceHashCode);
    }, 3000);
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${type} hash code copied to clipboard`,
    });
  };

  return (
    <div className="min-h-screen bg-background py-24 px-4">
      <div className="container max-w-6xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4 mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold">
            Digital <span className="gradient-text">Identity Creation</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Create your unique digital fingerprint
          </p>
          <div className="inline-block px-4 py-2 rounded-full bg-accent/20 border border-accent/40">
            <p className="text-sm text-accent">
              🔒 Demo Purpose Only - Hash code uploaded to blockchain
            </p>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Selfie Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="p-8 rounded-2xl bg-card border border-primary/20"
          >
            <div className="flex flex-col items-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                <Camera className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">Capture Selfie</h3>
              
              <div className="relative">
                <div className="w-[300px] h-[300px] rounded-full overflow-hidden border-4 border-primary/30 bg-muted">
                  {!photoTaken ? (
                    <video
                      ref={videoRef}
                      autoPlay
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <canvas
                      ref={canvasRef}
                      width={300}
                      height={300}
                      className="w-full h-full"
                    />
                  )}
                </div>
                {photoTaken && (
                  <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-5 h-5 text-primary-foreground" />
                  </div>
                )}
              </div>

              {!photoTaken ? (
                <div className="flex gap-4">
                  <Button onClick={startCamera}>Start Camera</Button>
                  <Button onClick={capturePhoto} variant="secondary">
                    Capture Photo
                  </Button>
                </div>
              ) : (
                <Button onClick={() => { setPhotoTaken(false); setPhotoHash(""); }} variant="outline">
                  Retake
                </Button>
              )}

              {photoHash && (
                <div className="w-full space-y-2">
                  <p className="text-sm font-semibold text-primary">Photo Hash Code:</p>
                  <div className="p-3 rounded-lg bg-muted font-mono text-xs break-all border border-primary/20">
                    {photoHash}
                  </div>
                  <Button 
                    onClick={() => copyToClipboard(photoHash, "Photo")} 
                    variant="outline" 
                    size="sm"
                    className="w-full"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Photo Hash
                  </Button>
                </div>
              )}
            </div>
          </motion.div>

          {/* Voice Recording Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="p-8 rounded-2xl bg-card border border-secondary/20"
          >
            <div className="flex flex-col items-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center">
                <Mic className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-2xl font-bold">Record Voice</h3>
              
              <div className="relative w-full">
                <div className="w-full p-8 rounded-2xl border-2 border-dashed border-secondary/30 bg-muted/50 text-center">
                  <p className="text-lg mb-4">Say:</p>
                  <p className="text-2xl font-bold text-secondary mb-6">
                    "Hello, my name is XYZ"
                  </p>
                  {isRecording && (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                      className="w-16 h-16 rounded-full bg-secondary/40 mx-auto mb-4"
                    />
                  )}
                  {voiceRecorded && (
                    <div className="flex items-center justify-center gap-2 text-secondary">
                      <Check className="w-5 h-5" />
                      <span>Voice Recorded</span>
                    </div>
                  )}
                </div>
              </div>

              {!voiceRecorded ? (
                <Button onClick={startRecording} disabled={isRecording}>
                  {isRecording ? "Recording..." : "Start Recording"}
                </Button>
              ) : (
                <Button onClick={() => { setVoiceRecorded(false); setVoiceHash(""); }} variant="outline">
                  Re-record
                </Button>
              )}

              {voiceHash && (
                <div className="w-full space-y-2">
                  <p className="text-sm font-semibold text-secondary">Voice Hash Code:</p>
                  <div className="p-3 rounded-lg bg-muted font-mono text-xs break-all border border-secondary/20">
                    {voiceHash}
                  </div>
                  <Button 
                    onClick={() => copyToClipboard(voiceHash, "Voice")} 
                    variant="outline" 
                    size="sm"
                    className="w-full"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Voice Hash
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Combined Hash Code Section */}
        {photoHash && voiceHash && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="p-8 rounded-2xl bg-card border border-accent/20"
          >
            <div className="flex flex-col items-center space-y-6">
              <h3 className="text-2xl font-bold">Your Digital Fingerprint</h3>
              <div className="w-full p-4 rounded-lg bg-muted font-mono text-sm break-all">
                {photoHash + voiceHash}
              </div>
              <Button 
                onClick={() => copyToClipboard(photoHash + voiceHash, "Digital Fingerprint")} 
                className="flex items-center gap-2" 
                size="lg"
              >
                <Copy className="w-5 h-5" />
                Copy Digital Fingerprint
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DigitalIdentity;
