"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import CostEstimator from "@/components/CostEstimator";
import OutputCard from "@/components/OutputCard";
import { estimateVideoUSD, formatUSD } from "@/lib/pricing";

const MODELS = ["gemini-2.5-flash-video", "veo-3.0", "gemini-1.5-pro-latest"];

type UploadedImage = {
  name: string;
  sizeLabel: string;
  preview: string;
  file: File;
};

export default function VideoGeneratorPage() {
  const [model, setModel] = useState(MODELS[0]);
  const [prompt, setPrompt] = useState("");
  const [narration, setNarration] = useState("");
  const [duration, setDuration] = useState(8);
  const [loading, setLoading] = useState(false);
  const [resultKey, setResultKey] = useState(0);
  const [outputSummary, setOutputSummary] = useState("Your video will appear here");
  const [startImage, setStartImage] = useState<UploadedImage | null>(null);

  const sanitizedDuration = Math.max(1, duration);
  const est = estimateVideoUSD(sanitizedDuration);

  const onGenerate = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setResultKey((k) => k + 1);
    setOutputSummary(
      prompt
        ? `Generated a ${sanitizedDuration}s preview with ${model}${startImage ? " using your reference frame." : "."}`
        : "Your video will appear here"
    );
    setLoading(false);
  };

  return (
    <div className="relative mx-auto max-w-6xl space-y-8 px-4 py-10 text-white">
      <div className="space-y-3">
        <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-sky-200/80">
          Gemini 2.5 · Video
        </span>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Video Generation</h1>
          <p className="mt-2 max-w-2xl text-sm text-white/70">
            Describe your motion, optional narration, and starting image to orchestrate a short cinematic clip.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,_2fr)_minmax(0,_1fr)]">
        <div className="space-y-6">
          <Card className="border-white/10 bg-[#101f3c]/60 text-white shadow-[0_25px_60px_rgba(8,15,40,0.45)]">
            <CardHeader className="pb-2">
              <CardTitle className="text-white">Model configuration</CardTitle>
              <CardDescription className="text-white/60">Select the model and review cost guidance.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 text-sm text-white/70">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="video-model">Model</Label>
                  <select
                    id="video-model"
                    value={model}
                    onChange={(event) => setModel(event.target.value)}
                    className="h-10 w-full rounded-md border border-white/10 bg-[#0b1229]/70 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-sky-500/60"
                  >
                    {MODELS.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-[0.3em] text-white/40">Estimated cost</Label>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <p className="text-lg font-semibold text-sky-300">{formatUSD(est)}</p>
                    <p className="text-xs text-white/60">Approximate for a {sanitizedDuration}s render</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-[#101f3c]/60 text-white shadow-[0_25px_60px_rgba(8,15,40,0.45)]">
            <CardHeader>
              <CardTitle className="text-white">Prompt</CardTitle>
              <CardDescription className="text-white/60">Describe the scene, pacing, and camera moves.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 text-sm text-white/70">
              <div className="space-y-2">
                <Label htmlFor="prompt" className="text-xs uppercase tracking-[0.3em] text-white/50">
                  Prompt
                </Label>
                <Textarea
                  id="prompt"
                  value={prompt}
                  onChange={(event) => setPrompt(event.target.value)}
                  rows={4}
                  placeholder="Example: Drone shot through neon city canyons, night rain, reflective streets, slow parallax."
                  className="resize-none border-white/10 bg-[#0b1229]/70 text-white placeholder:text-white/40 focus-visible:ring-sky-500"
                />
              </div>
              <div className="grid gap-4 md:grid-cols-[minmax(0,_1fr)_auto]">
                <div className="space-y-3">
                  <Label className="text-xs uppercase tracking-[0.3em] text-white/50">Duration</Label>
                  <Slider
                    value={[sanitizedDuration]}
                    min={1}
                    max={60}
                    step={1}
                    onValueChange={([value]) => setDuration(value)}
                  />
                  <p className="text-xs text-white/60">
                    Framepack pricing: {formatUSD(estimateVideoUSD(1))} per second.
                  </p>
                </div>
                <div className="flex items-end justify-end">
                  <Button
                    onClick={onGenerate}
                    disabled={loading || !prompt}
                    className="rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 px-6 text-sm font-medium text-white shadow-[0_10px_30px_rgba(56,189,248,0.35)] hover:from-sky-400 hover:to-indigo-400 disabled:opacity-60"
                  >
                    {loading ? "Generating..." : "Generate"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-[#101f3c]/60 text-white shadow-[0_25px_60px_rgba(8,15,40,0.45)]">
            <CardHeader>
              <CardTitle className="text-white">Narration script (optional)</CardTitle>
              <CardDescription className="text-white/60">Add narration or captions to time your shots.</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                id="narration"
                value={narration}
                onChange={(event) => setNarration(event.target.value)}
                rows={4}
                placeholder="Example: Scene opens with a bold mission statement, transitions into key milestones, ends with call to action."
                className="resize-none border-white/10 bg-[#0b1229]/70 text-white placeholder:text-white/40 focus-visible:ring-sky-500"
              />
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-[#101f3c]/60 text-white shadow-[0_25px_60px_rgba(8,15,40,0.45)]">
            <CardHeader>
              <CardTitle className="text-white">Start image (optional)</CardTitle>
              <CardDescription className="text-white/60">Use a reference frame to anchor the first seconds.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <StartImageSlot file={startImage} onFileChange={setStartImage} />
              {startImage && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setStartImage(null)}
                  className="w-fit rounded-full border border-white/15 bg-white/5 px-4 text-xs text-white hover:border-sky-400/40 hover:bg-sky-500/10"
                >
                  Remove reference
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <OutputCard
            key={resultKey}
            kind="video"
            title="Output"
            description={outputSummary}
            className="h-full"
          />
          <CostEstimator mode="video" />
        </div>
      </div>
    </div>
  );
}

type StartImageSlotProps = {
  file: UploadedImage | null;
  onFileChange: (value: UploadedImage | null) => void;
};

function StartImageSlot({ file, onFileChange }: StartImageSlotProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!file && inputRef.current) {
      inputRef.current.value = "";
    }
  }, [file]);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) {
      onFileChange(null);
      return;
    }

    const fileBlob = files[0];
    const reader = new FileReader();
    reader.onload = () => {
      onFileChange({
        name: fileBlob.name,
        sizeLabel: formatSize(fileBlob.size),
        file: fileBlob,
        preview: typeof reader.result === "string" ? reader.result : "",
      });
    };
    reader.readAsDataURL(fileBlob);
  };

  return (
    <div>
      <div
        className="flex h-44 cursor-pointer flex-col justify-center rounded-xl border border-dashed border-white/15 bg-[#0b1229]/50 text-center text-xs text-white/60 transition hover:border-sky-400/40 hover:text-white"
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          event.stopPropagation();
        }}
        onDrop={(event) => {
          event.preventDefault();
          event.stopPropagation();
          handleFiles(event.dataTransfer.files);
        }}
      >
        <div className="flex h-full flex-col items-center justify-center gap-3 px-6">
          {file?.preview ? (
            <Image
              src={file.preview}
              alt={file.name}
              width={120}
              height={120}
              className="h-24 w-24 rounded-md object-cover"
              unoptimized
            />
          ) : (
            <>
              <p className="text-sm font-medium text-white/70">Drop or click to upload</p>
              <p className="text-xs text-white/50">JPEG or PNG · up to 10MB</p>
            </>
          )}
          {file && (
            <p className="text-xs text-sky-300">
              {file.name} · {file.sizeLabel}
            </p>
          )}
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => handleFiles(event.target.files)}
      />
    </div>
  );
}

function formatSize(size: number) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}
