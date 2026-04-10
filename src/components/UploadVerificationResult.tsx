import { motion } from "framer-motion";
import { ShieldAlert, ShieldCheck, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export type VerificationResult = {
  type: "real" | "ai" | "deepfake";
  risk_score: number;
  decision: "allow" | "tag" | "block";
  reason: string;
};

interface UploadVerificationResultProps {
  result: VerificationResult;
}

const typeLabel: Record<VerificationResult["type"], string> = {
  real: "Real content",
  ai: "AI-generated",
  deepfake: "Deepfake suspected",
};

const decisionLabel: Record<VerificationResult["decision"], string> = {
  allow: "Allow",
  tag: "Tag",
  block: "Block",
};

export const UploadVerificationResult = ({ result }: UploadVerificationResultProps) => {
  const isBlocked = result.decision === "block";
  const isTagged = result.decision === "tag";
  const riskScore = Math.round(result.risk_score);

  const badgeClass = isBlocked
    ? "bg-destructive"
    : isTagged
      ? "bg-amber-500"
      : "bg-green-500";

  const toneClass = isBlocked
    ? "text-destructive"
    : isTagged
      ? "text-amber-600"
      : "text-green-500";

  const progressClass = isBlocked
    ? "[&>div]:bg-destructive"
    : isTagged
      ? "[&>div]:bg-amber-500"
      : "[&>div]:bg-green-500";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      <Card
        className={`border-2 ${
          isBlocked
            ? "border-destructive/50 bg-destructive/5"
            : isTagged
              ? "border-amber-500/40 bg-amber-500/5"
              : "border-green-500/50 bg-green-500/5"
        }`}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-4">
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
                <CardTitle className={`text-lg ${toneClass}`}>{typeLabel[result.type]}</CardTitle>
                <p className="text-sm text-muted-foreground">Upload verification result</p>
              </div>
            </div>
            <Badge className={`${badgeClass} text-white`}>{decisionLabel[result.decision]}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Risk score</span>
              <span className={toneClass}>{riskScore}%</span>
            </div>
            <Progress value={riskScore} className={`h-2 ${progressClass}`} />
          </div>
          <div className="p-3 rounded-lg bg-muted/50 border">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
              <p className="text-sm">{result.reason}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
