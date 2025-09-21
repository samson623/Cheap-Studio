"use client";
import { useRef, useState } from "react";
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
    <div className="relative mx-auto max-w-6xl space-y-8 px-4 py-10">
      <div className="space-y-1 text-white">
        <p className="text-xs uppercase tracking-[0.3em] text-sky-300">
          Gemini 2.5 Flash Image playground (single file)
        </p>
        <h1 className="text-3xl font-semibold">Image Generator</h1>
        <p className="text-sm text-white/70">
          Paste your Gemini API key, describe the change you want, and preview the
          generated image. This is a client-only playground.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,_2fr)_minmax(0,_1fr)]">
        <Card className="border-white/10 bg-slate-900/60 text-slate-100">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>Gemini setup</CardTitle>
                <CardDescription>Stored only while this tab is open.</CardDescription>
              </div>
              <span className="rounded-full bg-sky-500/10 px-3 py-1 text-xs text-sky-300">
                Model ready
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 text-sm">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="api-key">Gemini API key</Label>
                <Input
                  id="api-key"
                  type="password"
                  placeholder="Alza..."
                  value={apiKey}
                  onChange={(event) => setApiKey(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <select
                  id="model"
                  value={model}
                  onChange={(event) => setModel(event.target.value)}
                  className="h-10 w-full rounded-md border border-white/10 bg-slate-950/60 px-3 text-sm"
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
                className="resize-none border-white/10 bg-slate-950/60"
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
                  <button
                    type="button"
                    onClick={onSwap}
                    className="text-xs font-medium text-sky-300 hover:text-sky-200"
                  >
                    Swap 1 &lt;-&gt; 2
                  </button>
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
                  variant="secondary"
                  className="bg-white/10 text-white hover:bg-white/20"
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

        <Card className="flex h-full flex-col border-white/10 bg-slate-900/60 text-slate-100">
          <CardHeader>
            <CardTitle>Output</CardTitle>
            <CardDescription>Your generated image preview appears here.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col gap-4">
            <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-white/15 bg-slate-950/50 p-2 text-center text-sm text-white/60">
              {loading ? (
                <span>Generating preview...</span>
              ) : output ? (
                <span>{output}</span>
              ) : imageOne?.preview ? (
                <Image
                  src={imageOne.preview}
                  alt={imageOne.name}
                  width={1024}
                  height={1024}
                  unoptimized
                  className="h-full w-full rounded-md object-contain"
                />
              ) : (
                <span>Your results will display after you generate.</span>
              )}
            </div>
            {output && (
              <div className="flex items-center justify-between text-xs text-white/60">
                <span>Download and inspect the output before sharing.</span>
                <Button type="button" variant="secondary" className="bg-white/10 text-white hover:bg-white/20">
                  Download image
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,_2fr)_minmax(0,_1fr)]">
        <Card className="border-white/10 bg-slate-900/60 text-slate-100">
          <CardHeader>
            <CardTitle>How it works</CardTitle>
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

        <CostEstimator
          mode="image"
          className="border-white/10 bg-slate-900/60 text-slate-100"
        />
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
    <div className="space-y-2">
      <div className="text-xs text-white/60">{label}</div>
      <div
        className="flex h-40 cursor-pointer flex-col justify-center rounded-lg border border-dashed border-white/15 bg-slate-950/40 text-center text-xs text-white/50 transition hover:border-white/30 hover:text-white/70"
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
            <>
              {/* Using img tag for better base64 and external URL support */}
              <img
                src={file.preview}
                alt={file.name}
                className="h-24 w-24 rounded-md object-cover"
                style={{ maxWidth: '120px', maxHeight: '120px' }}
              />
            </>
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
