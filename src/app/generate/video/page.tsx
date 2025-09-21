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
import { Slider } from "@/components/ui/slider";
import CostEstimator from "@/components/CostEstimator";
import { estimateVideoUSD, formatUSD } from "@/lib/pricing";
import {
  UploadDropzone,
  type UploadedFile,
} from "@/components/UploadDropzone";

const MODELS = [
  "gemini-2.0-pro-video",
  "gemini-1.5-pro-video",
  "gemini-1.5-flash-video",
];

export default function VideoGeneratorPage() {
  const [model, setModel] = useState(MODELS[0]);
  const [prompt, setPrompt] = useState("");
  const [narration, setNarration] = useState("");
  const [duration, setDuration] = useState(8);
  const [startImage, setStartImage] = useState<UploadedFile | null>(null);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<string>("");

  const sanitizedDuration = Math.max(1, duration);
  const est = estimateVideoUSD(sanitizedDuration);

  const onGenerate = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setOutput(
      `Generated a ${sanitizedDuration}s preview for "${prompt || "your video idea"}" using ${model}.`
    );
    setLoading(false);
  };

  const onClear = () => {
    setPrompt("");
    setNarration("");
    setStartImage(null);
    setOutput("");
  };

  return (
    <div className="relative mx-auto max-w-6xl space-y-10 px-4 py-12">
      <div className="flex flex-wrap items-end justify-between gap-6 text-white">
        <div className="space-y-3">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-300">
            Gemini 2.5 Flash video playground
          </span>
          <h1 className="text-3xl font-semibold tracking-tight">Video Generation</h1>
          <p className="max-w-2xl text-sm text-white/70">
            Craft short cinematic clips with Gemini video models. Provide a
            detailed prompt, optional narration beats, and an initial frame to
            guide composition.
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-slate-900/60 px-6 py-4 text-sm text-white/70 shadow-xl">
          <div className="text-xs uppercase tracking-wide text-white/50">
            Estimated cost
          </div>
          <div className="text-2xl font-semibold text-white">
            {formatUSD(est)}
          </div>
          <div className="text-xs text-white/50">For {sanitizedDuration}s preview</div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,_2fr)_minmax(0,_1fr)]">
        <Card className="border-white/10 bg-slate-900/70 text-slate-100 shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Model Configuration</CardTitle>
            <CardDescription className="text-white/70">
              Fine-tune the model, duration, and provide creative direction.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 text-sm">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="video-model" className="text-xs uppercase tracking-wide">
                  Model
                </Label>
                <select
                  id="video-model"
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
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wide text-white/60">
                  Duration ({sanitizedDuration}s)
                </Label>
                <Slider
                  value={[sanitizedDuration]}
                  min={1}
                  max={30}
                  step={1}
                  onValueChange={([v]) => setDuration(v)}
                />
                <p className="text-xs text-white/50">
                  Framepack pricing ~{formatUSD(estimateVideoUSD(1))} per second.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="video-prompt" className="text-xs uppercase tracking-wide">
                Prompt
              </Label>
              <Textarea
                id="video-prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                placeholder="Example: Drone shot flying over a neon-soaked city street, raining softly, cinematic lighting."
                className="resize-none border-white/10 bg-slate-950/60 text-white placeholder:text-white/40"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-white/60">
                <Label
                  htmlFor="video-narration"
                  className="text-xs uppercase tracking-wide text-white/70"
                >
                  Narration script (optional)
                </Label>
                <span>Use short beats for voice-over timing.</span>
              </div>
              <Textarea
                id="video-narration"
                value={narration}
                onChange={(e) => setNarration(e.target.value)}
                rows={3}
                placeholder="Example: Intro line, action beat, closing CTA."
                className="resize-none border-white/10 bg-slate-950/60 text-white placeholder:text-white/40"
              />
            </div>

            <UploadDropzone
              label="Start image (optional)"
              helper="Drop a style or storyboard frame"
              file={startImage}
              onFileChange={setStartImage}
            />

            <div className="flex flex-wrap items-center gap-3">
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
              <span className="ml-auto text-xs text-white/60">
                Max duration 30 seconds in this demo.
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="flex h-full flex-col border-white/10 bg-slate-900/70 text-slate-100 shadow-xl">
          <CardHeader>
            <CardTitle>Output</CardTitle>
            <CardDescription className="text-white/70">
              Your generated video preview appears here.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col gap-4">
            <div className="flex-1 rounded-xl border border-dashed border-white/15 bg-slate-950/60 p-6 text-center text-sm text-white/60">
              {loading && <span>Rendering preview...</span>}
              {!loading && output && <span>{output}</span>}
              {!loading && !output && (
                <span>Your generated clip will be displayed after you run a prompt.</span>
              )}
            </div>
            {output && (
              <div className="flex items-center justify-between text-xs text-white/60">
                <span>Review frames before sharing publicly.</span>
                <Button
                  type="button"
                  variant="secondary"
                  className="border border-white/10 bg-white/10 text-white hover:bg-white/20"
                >
                  Download MP4
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
                Choose a Gemini video model, target duration, and optional reference image.
              </li>
              <li className="list-decimal">
                Describe the camera motion, subject actions, and overall mood in the prompt fields.
              </li>
              <li className="list-decimal">
                Hit Generate to simulate <code>generateContent</code> calls combining text, audio beats, and inline imagery.
              </li>
            </ol>
            <div className="rounded-lg border border-amber-400/40 bg-amber-400/10 p-3 text-xs text-amber-200">
              Tip: keep narration sections short so timing aligns with the generated clip.
            </div>
            <div className="text-xs text-white/60">Docs: Gemini video generation best practices.</div>
          </CardContent>
        </Card>

        <CostEstimator mode="video" />
      </div>
    </div>
  );
}
