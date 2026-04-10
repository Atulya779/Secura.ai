import { motion } from "framer-motion";
import { AlertCircle, CheckCircle, ShieldAlert, ShieldCheck, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { VisualModerationResult } from "@/utils/moderationTypes";

interface ImageAnalysisResultProps {
  result: VisualModerationResult;
}

export const ImageAnalysisResult = ({ result }: ImageAnalysisResultProps) => {
  const isBlocked = result.category === "DEEPFAKE";
  const confidence = result.confidence || 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      <Card className={`border-2 ${
        isBlocked 
          ? 'border-destructive/50 bg-destructive/5' 
          : 'border-green-500/50 bg-green-500/5'
      }`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isBlocked ? (
                <div className="w-12 h-12 rounded-full bg-destructive/20 flex items-center justify-center">
                  <ShieldAlert className="w-6 h-6 text-destructive" />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-green-500" />
                </div>
              )}
              <div>
                <CardTitle className={`text-lg ${isBlocked ? 'text-destructive' : 'text-green-500'}`}>
                  {result.label}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Visual-only analysis complete
                </p>
              </div>
            </div>
            <Badge 
              variant={isBlocked ? "destructive" : "default"}
              className={!isBlocked ? "bg-green-500 hover:bg-green-600" : ""}
            >
              {confidence}% Confidence
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Confidence Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Detection Confidence</span>
              <span className={isBlocked ? 'text-destructive' : 'text-green-500'}>
                {confidence}%
              </span>
            </div>
            <Progress 
              value={confidence} 
              className={`h-2 ${isBlocked ? '[&>div]:bg-destructive' : '[&>div]:bg-green-500'}`}
            />
          </div>

          {/* Summary */}
          <div className="p-3 rounded-lg bg-muted/50 border">
            <div className="flex items-start gap-2">
              {isBlocked ? (
                <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
              ) : (
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
              )}
              <p className="text-sm">{result.explanation}</p>
            </div>
          </div>

          {/* Detailed Analysis */}
          {result.needsReview && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Review Recommendation</span>
              </div>
              <div className="p-3 rounded-lg bg-muted/30 border text-sm text-muted-foreground">
                {result.reviewReason || "Low confidence or limited sampling coverage."}
              </div>
            </div>
          )}

          {/* Artifacts Found */}
          {result.evidence && result.evidence.length > 0 && (
            <div className="space-y-2">
              <span className="text-sm font-medium">Evidence Signals:</span>
              <div className="flex flex-wrap gap-2">
                {result.evidence.map((artifact, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className={isBlocked ? "border-destructive/50 text-destructive" : "border-green-500/50 text-green-600"}
                  >
                    {artifact}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Analysis Type Badge */}
          {result.analysisType && (
            <div className="flex justify-end">
              <Badge variant="secondary" className="text-xs">
                {result.analysisType === 'image' ? '🖼️ Image Analysis' : '📹 Video Analysis'}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
