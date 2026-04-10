import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Image } from "https://deno.land/x/imagescript@1.2.15/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return new Response(
        JSON.stringify({ error: "No file provided" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const remoteUrl = Deno.env.get("VISUAL_CLASSIFIER_URL");

    if (remoteUrl) {
      const buffer = await file.arrayBuffer();
      const response = await fetch(remoteUrl, {
        method: "POST",
        headers: {
          "Content-Type": file.type || "application/octet-stream",
        },
        body: buffer,
      });

      if (response.ok) {
        const data = await response.json();
        if (data?.category && data?.confidence && data?.explanation) {
          return new Response(
            JSON.stringify({
              ...data,
              decision: data.category === "DEEPFAKE" ? "BLOCK" : "ALLOW",
              analysisType: "image",
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      }
    }

    const buffer = new Uint8Array(await file.arrayBuffer());
    const image = await Image.decode(buffer);

    const metrics = computeVisualMetrics(image);
    const result = buildHeuristicResult(metrics);

    console.log('Impersonation check result:', result);

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Impersonation check error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

const clamp = (value: number, min: number, max: number) => {
  return Math.min(max, Math.max(min, value));
};

const computeVisualMetrics = (image: Image) => {
  const totalPixels = image.width * image.height;
  const targetSamples = 50000;
  const step = Math.max(1, Math.floor(Math.sqrt(totalPixels / targetSamples)));

  let count = 0;
  let sum = 0;
  let sumSq = 0;
  let edge = 0;
  let color = 0;

  for (let y = 1; y < image.height - 1; y += step) {
    for (let x = 1; x < image.width - 1; x += step) {
      const pixel = image.getPixelAt(x, y);
      const { r, g, b } = Image.colorToRGBA(pixel);

      const luma = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
      sum += luma;
      sumSq += luma * luma;

      const right = image.getPixelAt(x + 1, y);
      const down = image.getPixelAt(x, y + 1);
      const { r: rRight, g: gRight, b: bRight } = Image.colorToRGBA(right);
      const { r: rDown, g: gDown, b: bDown } = Image.colorToRGBA(down);
      const lumaRight = (0.2126 * rRight + 0.7152 * gRight + 0.0722 * bRight) / 255;
      const lumaDown = (0.2126 * rDown + 0.7152 * gDown + 0.0722 * bDown) / 255;
      edge += Math.abs(luma - lumaRight) + Math.abs(luma - lumaDown);

      const colorDelta = (Math.abs(r - g) + Math.abs(g - b) + Math.abs(r - b)) / (3 * 255);
      color += colorDelta;

      count += 1;
    }
  }

  const mean = sum / count;
  const variance = Math.max(0, sumSq / count - mean * mean);
  const edgeDensity = edge / (count * 2);
  const colorInconsistency = color / count;

  return {
    width: image.width,
    height: image.height,
    sampleCount: count,
    variance,
    edgeDensity,
    colorInconsistency,
  };
};

const buildHeuristicResult = (metrics: {
  width: number;
  height: number;
  sampleCount: number;
  variance: number;
  edgeDensity: number;
  colorInconsistency: number;
}) => {
  const noiseScore = clamp(metrics.variance * 12, 0, 1);
  const edgeScore = clamp(metrics.edgeDensity * 2.5, 0, 1);
  const colorScore = clamp(metrics.colorInconsistency * 2.2, 0, 1);

  const smoothnessScore = 1 - noiseScore;
  const edgeScarcityScore = 1 - edgeScore;
  const syntheticScore = clamp(
    smoothnessScore * 0.45 + edgeScarcityScore * 0.35 + colorScore * 0.2,
    0,
    1
  );
  const artifactScore = clamp(colorScore * 0.6 + edgeScore * 0.4, 0, 1);

  let category: "REAL" | "AI_SAFE" | "DEEPFAKE" = "REAL";

  if (syntheticScore > 0.72 && artifactScore > 0.6) {
    category = "DEEPFAKE";
  } else if (syntheticScore > 0.55) {
    category = "AI_SAFE";
  }

  const baseConfidence =
    category === "REAL"
      ? 60 + Math.round((1 - syntheticScore) * 35)
      : category === "AI_SAFE"
        ? 55 + Math.round(syntheticScore * 35)
        : 70 + Math.round(artifactScore * 25);

  const confidence = clamp(Math.round(baseConfidence), 35, 95);
  const needsReview = confidence < 65 || metrics.sampleCount < 1000;

  return {
    category,
    decision: category === "DEEPFAKE" ? "BLOCK" : "ALLOW",
    confidence,
    label: category === "REAL" ? "Real photo" : category === "AI_SAFE" ? "AI-generated (safe)" : "Deepfake / inappropriate",
    explanation:
      "Visual-only analysis based on texture variance, edge density, and color consistency. This demo heuristic never uses filenames or text prompts.",
    evidence: [
      `Texture variance: ${(metrics.variance * 100).toFixed(2)}%`,
      `Edge density: ${(metrics.edgeDensity * 100).toFixed(2)}%`,
      `Color consistency: ${(100 - metrics.colorInconsistency * 100).toFixed(2)}%`,
      `Sampled pixels: ${metrics.sampleCount}`,
    ],
    needsReview,
    reviewReason: needsReview ? "Low confidence or limited sampling coverage." : undefined,
    model: {
      source: "heuristic",
      version: "visual-heuristic-v1",
    },
    analysisType: "image",
  };
};
