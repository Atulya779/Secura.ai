import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, CheckCircle2, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { VisualModerationResult } from "@/utils/moderationTypes";

interface BlockedModalProps {
  open: boolean;
  result: VisualModerationResult | null;
  onClose: () => void;
  onReport?: (feedback: string) => void;
}

export function InstagramBlockedModal({ open, result, onClose, onReport }: BlockedModalProps) {
  const [feedback, setFeedback] = useState("");

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white p-0 overflow-hidden">
        {/* Red Header */}
        <div className="bg-red-500 p-6 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
          >
            <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center mb-3">
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </motion.div>
          <h2 className="text-xl font-semibold text-white">Upload blocked</h2>
        </div>

        {/* Content */}
        <div className="p-6 text-center space-y-4">
          <p className="text-gray-700">
            We detected manipulated or inappropriate content.
          </p>
          <p className="text-gray-500 text-sm">
            This post goes against our authenticity guidelines.
          </p>

          {/* Secura.AI Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-sm text-gray-600">
              Secura.AI blocked this upload
            </span>
          </div>

          {/* Details */}
          {result && (
            <div className="bg-red-50 rounded-lg p-4 text-left space-y-2">
              <p className="text-sm">
                <span className="font-semibold text-red-700">Label:</span>{" "}
                <span className="text-red-600">{result.label}</span>
              </p>
              <p className="text-sm">
                <span className="font-semibold text-red-700">Confidence:</span>{" "}
                <span className="text-red-600">{result.confidence}%</span>
              </p>
              <p className="text-sm">
                <span className="font-semibold text-red-700">Explanation:</span>{" "}
                <span className="text-red-600">{result.explanation}</span>
              </p>
              {result.evidence?.length > 0 && (
                <div className="text-xs text-red-600 space-y-1">
                  {result.evidence.map((item) => (
                    <div key={item}>• {item}</div>
                  ))}
                </div>
              )}
            </div>
          )}

          <p className="text-xs text-gray-400">
            Incident logged for security monitoring (demo)
          </p>

          {onReport && (
            <div className="space-y-2 text-left">
              <p className="text-xs text-gray-500">Request a review or report a mistake</p>
              <Textarea
                placeholder="Optional details..."
                value={feedback}
                onChange={(event) => setFeedback(event.target.value)}
                className="min-h-[72px]"
              />
              <Button
                variant="outline"
                className="w-full"
                onClick={() => onReport(feedback || "User requested review.")}
              >
                Request review
              </Button>
            </div>
          )}

          <Button
            onClick={onClose}
            className="w-full bg-[#0095f6] hover:bg-[#1877f2] text-white"
          >
            OK
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface SuccessModalProps {
  open: boolean;
  onClose: () => void;
  result: VisualModerationResult | null;
  onReport?: (feedback: string) => void;
}

export function InstagramSuccessModal({ open, onClose, result, onReport }: SuccessModalProps) {
  const [feedback, setFeedback] = useState("");

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white p-0 overflow-hidden">
        {/* Green Header */}
        <div className="bg-green-500 p-6 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
          >
            <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center mb-3">
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
          </motion.div>
          <h2 className="text-xl font-semibold text-white">Post shared</h2>
        </div>

        {/* Content */}
        <div className="p-6 text-center space-y-4">
          <p className="text-gray-700 text-lg">
            Your post has been shared.
          </p>

          {/* Secura.AI Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full">
            <Shield className="h-4 w-4 text-green-600" />
            <span className="text-sm text-green-700 font-medium">
              Verified by Secura.AI
            </span>
          </div>

          {result && (
            <div className="bg-green-50 rounded-lg p-4 text-left space-y-2">
              <p className="text-sm">
                <span className="font-semibold text-green-700">Label:</span>{" "}
                <span className="text-green-700">{result.label}</span>
              </p>
              <p className="text-sm">
                <span className="font-semibold text-green-700">Confidence:</span>{" "}
                <span className="text-green-700">{result.confidence}%</span>
              </p>
              <p className="text-xs text-green-700">{result.explanation}</p>
              {result.needsReview && (
                <p className="text-xs text-amber-600">
                  Review recommended: {result.reviewReason}
                </p>
              )}
            </div>
          )}

          {onReport && (
            <div className="space-y-2 text-left">
              <p className="text-xs text-gray-500">Report a misclassification</p>
              <Textarea
                placeholder="Optional details..."
                value={feedback}
                onChange={(event) => setFeedback(event.target.value)}
                className="min-h-[72px]"
              />
              <Button
                variant="outline"
                className="w-full"
                onClick={() => onReport(feedback || "User reported a possible misclassification.")}
              >
                Report issue
              </Button>
            </div>
          )}

          <Button 
            onClick={onClose}
            className="w-full bg-[#0095f6] hover:bg-[#1877f2] text-white"
          >
            Back to Home
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
