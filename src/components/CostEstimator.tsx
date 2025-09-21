"use client";

import { useState } from "react";
import { estimateImageUSD, estimateVideoUSD, mpFromWH } from "@/lib/pricing";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";

import { cn } from "@/lib/utils";

type Props = { mode: "image" | "video"; className?: string };

export default function CostEstimator({ mode, className }: Props) {
  const [w, setW] = useState(1024);
  const [h, setH] = useState(1024);
  const [sec, setSec] = useState(5);

  const mp = mpFromWH(w, h);
  const imgUSD = estimateImageUSD(w, h);
  const vidUSD = estimateVideoUSD(sec);

  return (
    <Card className={cn("border-white/10 bg-slate-900/70 text-slate-100 shadow-xl", className)}>
      <CardHeader className="pb-4">
        <CardTitle>Cost Estimator</CardTitle>
        <CardDescription className="text-white/70">
          Quick approximations based on public pricing references.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 text-sm text-white/70">
        {mode === "image" ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="ce-width" className="text-xs uppercase tracking-wide text-white/60">
                  Width (px)
                </Label>
                <Input
                  id="ce-width"
                  type="number"
                  value={w}
                  min={256}
                  max={2048}
                  onChange={(e) => setW(Number(e.target.value))}
                  className="border-white/10 bg-slate-950/60 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ce-height" className="text-xs uppercase tracking-wide text-white/60">
                  Height (px)
                </Label>
                <Input
                  id="ce-height"
                  type="number"
                  value={h}
                  min={256}
                  max={2048}
                  onChange={(e) => setH(Number(e.target.value))}
                  className="border-white/10 bg-slate-950/60 text-white"
                />
              </div>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-white">
              <div className="flex items-center justify-between">
                <span className="text-white/70">Megapixels billed (ceil)</span>
                <span className="font-semibold">{mp} MP</span>
              </div>
              <Separator className="my-3 border-white/10" />
              <div className="flex items-center justify-between">
                <span className="text-white/70">Estimated cost</span>
                <span className="text-lg font-semibold">${imgUSD.toFixed(3)}</span>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="space-y-2">
              <Label htmlFor="ce-seconds" className="text-xs uppercase tracking-wide text-white/60">
                Duration (seconds)
              </Label>
              <Slider
                id="ce-seconds"
                value={[sec]}
                onValueChange={(value) => value[0] !== undefined && setSec(value[0])}
                min={1}
                max={30}
                step={1}
                className="pt-2"
              />
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-white">
              <div className="flex items-center justify-between">
                <span className="text-white/70">Seconds billed</span>
                <span className="font-semibold">{sec}s</span>
              </div>
              <Separator className="my-3 border-white/10" />
              <div className="flex items-center justify-between">
                <span className="text-white/70">Estimated cost</span>
                <span className="text-lg font-semibold">${vidUSD.toFixed(3)}</span>
              </div>
            </div>
          </>
        )}
        <p className="text-xs text-white/50">
          Estimates are for preview only. Actual billing depends on provider
          pricing tiers and regional taxes.
        </p>
      </CardContent>
    </Card>
  );
}
