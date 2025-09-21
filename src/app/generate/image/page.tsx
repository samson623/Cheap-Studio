"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import CostEstimator from "@/components/CostEstimator";

type UploadedImage = {
  name: string;
  sizeLabel: string;
  file: File;
  preview: string;
};

const MODELS = [
  "gemini-2.5-flash-image-preview",
  "gemini-2.5-flash",
  "gemini-1.5-pro-latest",
];

const QUICK_PRESETS = [
  "Remove people",
  "Phone -> banana",
  "Side angle",
  "Studio Ghibli style",
  "Colorize black and white",
  "Isometric",
];

export default function ImageGeneratorPage() {
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState(MODELS[0]);
  const [prompt, setPrompt] = useState("");
  const [imageOne, setImageOne] = useState<UploadedImage | null>(null);
  const [imageTwo, setImageTwo] = useState<UploadedImage | null>(null);
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
    <div className="relative mx-auto max-w-6xl space-y-8 px-4 py-10 text-white">
      <div className="space-y-3">
        <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-sky-200/80">
          Gemini 2.5 · Playground
        </span>
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold">Image Generator</h1>
          <p className="max-w-2xl text-sm text-white/70">
            Paste your Gemini API key, describe the change you want, and preview the generated image. This is a client-only playground.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,_2fr)_minmax(0,_1fr)]">
        <Card className="border-white/10 bg-[#101f3c]/60 text-white shadow-[0_25px_60px_rgba(8,15,40,0.45)]">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-white">Gemini setup</CardTitle>
                <CardDescription className="text-white/60">Stored only while this tab is open.</CardDescription>
              </div>
              <span className="rounded-full bg-sky-500/10 px-3 py-1 text-xs text-sky-300">
                Model ready
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 text-sm text-white/70">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="api-key">Gemini API key</Label>
                <Input
                  id="api-key"
                  type="password"
                  placeholder="Alza..."
                  value={apiKey}
                  onChange={(event) => setApiKey(event.target.value)}
                  className="border-white/10 bg-[#0b1229]/70 text-white placeholder:text-white/40 focus-visible:ring-sky-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <select
                  id="model"
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
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-white/60">
                <Label htmlFor="prompt" className="text-xs uppercase tracking-wide text-white/70">
                  Prompt
                </Label>
                <span>Tip: describe what to add, remove, or change.</span>
              </div>
              <Textarea
                id="prompt"
                rows={4}
                placeholder="Example: Replace the phone in the person hand with a banana. Keep lighting consistent."
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                className="resize-none border-white/10 bg-[#0b1229]/70 text-white placeholder:text-white/40 focus-visible:ring-sky-500"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <DropSlot
                label="Image 1"
                helper="Required for edits"
                file={imageOne}
                onFileChange={setImageOne}
              />
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-white/60">
                  <span>Image 2 (style or reference)</span>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={onSwap}
                    className="h-7 rounded-full border border-white/15 bg-white/5 px-3 text-[11px] font-medium uppercase tracking-wider text-white hover:border-sky-400/40 hover:bg-sky-500/10"
                  >
                    Swap 1 ↔ 2
                  </Button>
                </div>
                <DropSlot
                  label="Image 2"
                  helper="Optional"
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
                  variant="ghost"
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white hover:border-sky-400/40 hover:bg-sky-500/10"
                  onClick={() => applyPreset(preset)}
                >
                  {preset}
                </Button>
              ))}
            </div>

            <Separator className="border-white/10" />

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 text-xs text-white/70">
                <input
                  id="detail"
                  type="checkbox"
                  checked={requestDetail}
                  onChange={(event) => setRequestDetail(event.target.checked)}
                  className="h-4 w-4 rounded border-white/20 bg-slate-950"
                />
                <label htmlFor="detail">Request higher detail (may cost more)</label>
              </div>
              <div className="ml-auto flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  className="rounded-full border border-white/15 bg-white/5 px-5 text-sm text-white hover:border-sky-400/40 hover:bg-sky-500/10"
                  onClick={onClear}
                >
                  Clear
                </Button>
                <Button
                  type="button"
                  disabled={loading || !prompt}
                  onClick={onGenerate}
                  className="rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 px-5 text-sm font-medium text-white shadow-[0_10px_30px_rgba(56,189,248,0.35)] hover:from-sky-400 hover:to-indigo-400 disabled:opacity-60"
                >
                  {loading ? "Generating..." : "Generate"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="flex h-full flex-col border-white/10 bg-[#101f3c]/60 text-white shadow-[0_25px_60px_rgba(8,15,40,0.45)]">
          <CardHeader>
            <CardTitle className="text-white">Output</CardTitle>
            <CardDescription className="text-white/60">Your generated image preview appears here.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col gap-4">
            <div className="flex-1 rounded-xl border border-dashed border-white/15 bg-gradient-to-br from-[#0b1229]/70 via-[#091021]/70 to-[#060912]/80 p-6 text-center text-sm text-white/70">
              {loading && <span>Generating preview...</span>}
              {!loading && output && <span>{output}</span>}
              {!loading && !output && <span>Your results will display after you generate.</span>}
            </div>
            {output && (
              <div className="flex items-center justify-between text-xs text-white/60">
                <span>Download and inspect the output before sharing.</span>
                <Button
                  type="button"
                  className="rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 px-4 text-xs font-medium text-white shadow-[0_8px_26px_rgba(56,189,248,0.35)] hover:from-sky-400 hover:to-indigo-400"
                >
                  Download image
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,_2fr)_minmax(0,_1fr)]">
        <Card className="border-white/10 bg-[#101f3c]/60 text-white shadow-[0_25px_60px_rgba(8,15,40,0.45)]">
          <CardHeader>
            <CardTitle className="text-white">How it works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-white/70">
            <ol className="space-y-2 pl-4">
              <li className="list-decimal">
                Paste your Gemini API key and pick the flash image model.
              </li>
              <li className="list-decimal">
                Describe the edit. Optionally drop a source image and style reference.
              </li>
              <li className="list-decimal">
                Press Generate. The app will call generateContent with text plus any inline images.
              </li>
            </ol>
            <div className="text-xs text-amber-300/90">
              Troubleshooting: enable CORS for localhost or proxy through your backend.
            </div>
            <div className="text-xs text-white/60">
              Docs: Gemini image generation and editing.
            </div>
          </CardContent>
        </Card>

        <CostEstimator mode="image" />
      </div>
    </div>
  );
}

type DropSlotProps = {
  label: string;
  helper: string;
  file: UploadedImage | null;
  onFileChange: (value: UploadedImage | null) => void;
};

function DropSlot({ label, helper, file, onFileChange }: DropSlotProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!file && inputRef.current) {
      inputRef.current.value = "";
    }
  }, [file]);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) {
      onFileChange(null);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
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
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    };
    reader.readAsDataURL(fileBlob);
  };

  return (
    <div className="space-y-2">
      <div className="text-xs uppercase tracking-[0.3em] text-white/40">{label}</div>
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
            <p className="font-medium text-white/70">Drop or click to upload</p>
          )}
          <div className="text-xs text-white/50">
            <p>{helper}</p>
            {file && (
              <p className="mt-1 truncate text-sky-300">
                {file.name} · {file.sizeLabel}
              </p>
            )}
          </div>
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
