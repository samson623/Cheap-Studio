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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import CostEstimator from "@/components/CostEstimator";
import {
  UploadDropzone,
  type UploadedFile,
} from "@/components/UploadDropzone";

const MODELS = [
  "gemini-2.5-flash-image-preview",
  "gemini-2.5-flash",
  "gemini-1.5-pro-latest",
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
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState(MODELS[0]);
  const [prompt, setPrompt] = useState("");
  const [imageOne, setImageOne] = useState<UploadedFile | null>(null);
  const [imageTwo, setImageTwo] = useState<UploadedFile | null>(null);
  const [requestDetail, setRequestDetail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<string>("");

  const onGenerate = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 900));
    setOutput(
      `Generated preview for "${prompt || "your prompt"}" using ${model}.`
    );
    setLoading(false);
  };

  const onClear = () => {
    setPrompt("");
    setImageOne(null);
    setImageTwo(null);
    setOutput("");
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
          Gemini 2.5 Flash image playground
        </span>
        <h1 className="text-3xl font-semibold tracking-tight">Image Playground</h1>
        <p className="max-w-2xl text-sm text-white/70">
          Configure the Gemini image model, describe the edit you want, and
          preview the generated result instantly. Nothing is uploaded to a
          server—this is a client-only playground.
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
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="api-key" className="text-xs uppercase tracking-wide">
                  Gemini API key
                </Label>
                <Input
                  id="api-key"
                  type="password"
                  placeholder="AIza..."
                  value={apiKey}
                  onChange={(event) => setApiKey(event.target.value)}
                  className="border-white/10 bg-slate-950/60 text-white placeholder:text-white/40"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="model" className="text-xs uppercase tracking-wide">
                  Model
                </Label>
                <select
                  id="model"
                  value={model}
                  onChange={(event) => setModel(event.target.value)}
                  className="h-10 w-full rounded-md border border-white/10 bg-slate-950/60 px-3 text-sm text-white"
                >
                  {MODELS.map((item) => (
                    <option key={item} value={item} className="bg-slate-900 text-white">
                      {item}
                    </option>
                  ))}
                </select>
              </div>
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
            <div className="flex-1 rounded-xl border border-dashed border-white/15 bg-slate-950/60 p-6 text-center text-sm text-white/60">
              {loading && <span>Generating preview...</span>}
              {!loading && output && <span>{output}</span>}
              {!loading && !output && (
                <span>Your results will display after you generate.</span>
              )}
            </div>
            {output && (
              <div className="flex items-center justify-between text-xs text-white/60">
                <span>Download and inspect the output before sharing.</span>
                <Button
                  type="button"
                  variant="secondary"
                  className="border border-white/10 bg-white/10 text-white hover:bg-white/20"
                >
                  Download image
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
