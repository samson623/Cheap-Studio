"use client";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import CostEstimator from "@/components/CostEstimator";
import OutputCard from "@/components/OutputCard";
import { estimateVideoUSD, formatUSD } from "@/lib/pricing";

export default function VideoGeneratorPage() {
  const [prompt, setPrompt] = useState("");
  const [duration, setDuration] = useState(8);
  const [loading, setLoading] = useState(false);
  const [resultKey, setResultKey] = useState(0);

  const sanitizedDuration = Math.max(1, duration);
  const est = estimateVideoUSD(sanitizedDuration);

  const onGenerate = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setResultKey((k) => k + 1);
    setLoading(false);
  };

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-6 space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Generate Video</h1>
          <p className="text-sm text-muted-foreground">Prompt-to-video (UI-only demo)</p>
        </div>
        <div className="text-sm text-muted-foreground">Est: {formatUSD(est)}</div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Prompt</CardTitle>
          <CardDescription>Describe the scene and motion</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="prompt">Prompt</Label>
            <Textarea id="prompt" value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={3} />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2 sm:col-span-2">
              <Label>Duration: {sanitizedDuration}s</Label>
              <Slider value={[sanitizedDuration]} min={1} max={60} step={1} onValueChange={([v]) => setDuration(v)} />
              <p className="text-xs text-muted-foreground">Framepack pricing: {formatUSD(estimateVideoUSD(1))} per second</p>
            </div>
            <div className="flex items-end">
              <Button onClick={onGenerate} disabled={loading || !prompt} className="w-full">
                {loading ? "Generating..." : "Generate"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <CostEstimator mode="video" />

      <div key={resultKey}>
        <OutputCard kind="video" title="Result" description={prompt || "Your video will appear here"} />
      </div>
    </div>
  );
}
