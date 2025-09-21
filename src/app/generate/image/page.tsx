"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import CostEstimator from "@/components/CostEstimator";
import {
  UploadDropzone,
  type UploadedFile,
} from "@/components/UploadDropzone";
import { generateImageAction } from "@/lib/actions";
import { GenerationResult } from "@/lib/ai-generation";

const MODELS = [
  { id: "flux-pro", name: "FLUX Pro - Fast and stable" },
  { id: "gpt-image-1", name: "GPT Image - Advanced editing" },
  { id: "imagen4", name: "Imagen 4 - Latest Google model" },
  { id: "recraft-v3", name: "Recraft V3 - Realistic images" },
];

const QUICK_PRESETS = [
  "Remove background distractions",
  "Studio portrait lighting",
  "Convert to watercolor",
  "Swap outfit",
  "Add cinematic glow",
  "Color grade for sunset",
];

export default function ImageGeneratorPage() {
  const [model, setModel] = useState(MODELS[0].id);
  const [prompt, setPrompt] = useState("");
  const [imageOne, setImageOne] = useState<UploadedFile | null>(null);
  const [imageTwo, setImageTwo] = useState<UploadedFile | null>(null);
  const [requestDetail, setRequestDetail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [error, setError] = useState<string>("");

  const onGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please provide a prompt");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      // Prepare image URLs if uploaded
      const imageUrls: string[] = [];
      if (imageOne?.url) imageUrls.push(imageOne.url);
      if (imageTwo?.url) imageUrls.push(imageTwo.url);

      const generationResult = await generateImageAction({
        prompt,
        model,
        aspectRatio: "1:1", // You could make this configurable
        imageUrls
      });

      setResult(generationResult);
      
      if (!generationResult.success) {
        setError(generationResult.error || "Generation failed");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error("Generation error:", err);
    } finally {
      setLoading(false);
    }
  };

  const onClear = () => {
    setPrompt("");
    setImageOne(null);
    setImageTwo(null);
    setResult(null);
    setError("");
    setRequestDetail(false);
  };

  const onSwap = () => {
    setImageOne(imageTwo);
    setImageTwo(imageOne);
  };

  const applyPreset = (preset: string) => {
    setPrompt((current) => (current ? `${current}\n${preset}` : preset));
  };

  return (
    <div className="relative mx-auto max-w-6xl space-y-10 px-4 py-12">
      <div className="space-y-3 text-white">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-300">
          AI Powered Image Generation
        </span>
        <h1 className="text-3xl font-semibold tracking-tight">Image Studio</h1>
        <p className="max-w-2xl text-sm text-white/70">
          Generate stunning images using advanced AI models. Upload reference images,
          write detailed prompts, and create professional-quality visuals in seconds.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,_2fr)_minmax(0,_1fr)]">
        <Card className="border-white/10 bg-slate-900/70 text-slate-100 shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Model Configuration</CardTitle>
            <CardDescription className="text-white/70">
              Drop your input image, add reference styles, and fine-tune prompt
              details.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 text-sm">
            <div className="space-y-2">
              <Label htmlFor="model" className="text-xs uppercase tracking-wide">
                AI Model
              </Label>
              <select
                id="model"
                value={model}
                onChange={(event) => setModel(event.target.value)}
                className="h-10 w-full rounded-md border border-white/10 bg-slate-950/60 px-3 text-sm text-white"
              >
                {MODELS.map((item) => (
                  <option key={item.id} value={item.id} className="bg-slate-900 text-white">
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-white/60">
                <Label
                  htmlFor="prompt"
                  className="text-xs uppercase tracking-wide text-white/70"
                >
                  Prompt
                </Label>
                <span>Describe what to add, remove, or change.</span>
              </div>
              <Textarea
                id="prompt"
                rows={4}
                placeholder="Example: Replace the phone in the subject's hand with a sketchbook. Keep the lighting consistent."
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                className="resize-none border-white/10 bg-slate-950/60 text-white placeholder:text-white/40"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <UploadDropzone
                label="Image 1"
                helper="Required for edits"
                file={imageOne}
                onFileChange={setImageOne}
              />
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-white/60">
                  <span className="uppercase tracking-wide">Image 2 (style)</span>
                  <button
                    type="button"
                    onClick={onSwap}
                    className="text-xs font-medium text-sky-300 hover:text-sky-200"
                  >
                    Swap 1 ↔ 2
                  </button>
                </div>
                <UploadDropzone
                  label="Image 2"
                  helper="Optional reference"
                  file={imageTwo}
                  onFileChange={setImageTwo}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {QUICK_PRESETS.map((preset) => (
                <Button
                  key={preset}
                  type="button"
                  variant="secondary"
                  className="border border-white/10 bg-white/10 text-white hover:bg-white/20"
                  onClick={() => applyPreset(preset)}
                >
                  {preset}
                </Button>
              ))}
            </div>

            <Separator className="border-white/10" />

            <div className="flex flex-wrap items-center gap-4">
              <label className="flex items-center gap-2 text-xs text-white/70">
                <input
                  id="detail"
                  type="checkbox"
                  checked={requestDetail}
                  onChange={(event) => setRequestDetail(event.target.checked)}
                  className="h-4 w-4 rounded border-white/30 bg-slate-950"
                />
                Request higher detail (may cost more)
              </label>
              <div className="ml-auto flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  className="border border-white/10 bg-white/5 text-white hover:bg-white/10"
                  onClick={onClear}
                >
                  Clear
                </Button>
                <Button
                  type="button"
                  disabled={loading || !prompt}
                  onClick={onGenerate}
                  className="bg-sky-500 text-white hover:bg-sky-400"
                >
                  {loading ? "Generating..." : "Generate"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="flex h-full flex-col border-white/10 bg-slate-900/70 text-slate-100 shadow-xl">
          <CardHeader>
            <CardTitle>Output</CardTitle>
            <CardDescription className="text-white/70">
              Your generated image preview appears here.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col gap-4">
            <div className="flex-1 rounded-xl border border-dashed border-white/15 bg-slate-950/60 p-6 text-center text-sm">
              {loading && (
                <div className="text-white/60">
                  <div className="mb-2">🎨 Generating your image...</div>
                  <div className="text-xs">This may take 30-60 seconds</div>
                </div>
              )}
              
              {error && (
                <div className="text-red-400">
                  <div className="mb-2">❌ Generation failed</div>
                  <div className="text-xs">{error}</div>
                </div>
              )}
              
              {result?.success && result.data && (
                <div className="text-white/80">
                  <div className="mb-3">✅ Image generated & saved to gallery!</div>
                  <div className="text-xs space-y-1">
                    <div>Model: {String(result.data.metadata?.model || 'Unknown')}</div>
                    <div>Processing time: {String(result.data.metadata?.processingTime || 'Unknown')}</div>
                    <div>Cost: {String(result.data.metadata?.cost || 'Unknown')}</div>
                  </div>
                  {result.data.url && (
                    <div className="mt-4 p-4 bg-white/5 rounded-lg">
                      <div className="text-xs mb-2">Generated Image:</div>
                      <div className="text-sky-300 mb-3">{result.data.url}</div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="border-white/10 bg-white/10 text-white hover:bg-white/20"
                          onClick={() => window.location.href = '/gallery'}
                        >
                          🖼️ View Gallery
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {!loading && !error && !result && (
                <span className="text-white/60">Your generated image will appear here.</span>
              )}
            </div>
            
            {result?.success && result.data?.url && (
              <div className="flex items-center justify-between text-xs text-white/60">
                <span>Ready to download and use!</span>
                <Button
                  type="button"
                  variant="secondary"
                  className="border border-white/10 bg-white/10 text-white hover:bg-white/20"
                  onClick={() => window.open(result.data?.url, '_blank')}
                >
                  View Image
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,_2fr)_minmax(0,_1fr)]">
        <Card className="border-white/10 bg-slate-900/70 text-slate-100 shadow-xl">
          <CardHeader>
            <CardTitle>How it works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-white/75">
            <ol className="space-y-2 pl-4">
              <li className="list-decimal">
                Paste your Gemini API key and pick the flash image model.
              </li>
              <li className="list-decimal">
                Describe the edit. Optionally drop a source image and style reference.
              </li>
              <li className="list-decimal">
                Press Generate. The app will call <code>generateContent</code> with text plus inline images.
              </li>
            </ol>
            <div className="rounded-lg border border-sky-500/30 bg-sky-500/10 p-3 text-xs text-sky-200">
              Troubleshooting: enable CORS for localhost or proxy through your backend.
            </div>
            <div className="text-xs text-white/60">
              Docs: Gemini image generation and editing.
            </div>
          </CardContent>
        </Card>

        <CostEstimator
          mode="image"
          className="border-white/10 bg-slate-900/70 text-slate-100 shadow-xl"
        />
      </div>
    </div>
  );
}
