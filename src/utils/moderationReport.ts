import { supabase } from "@/integrations/supabase/client";
import { VisualModerationResult } from "@/utils/moderationTypes";

export interface ModerationReportPayload {
  username: string;
  imageUrl?: string;
  caption?: string;
  result: VisualModerationResult;
  userFeedback: string;
}

export const submitModerationReport = async (payload: ModerationReportPayload) => {
  const { data, error } = await supabase.functions.invoke("moderation-report", {
    body: payload,
  });

  if (error) {
    throw error;
  }

  return data;
};
