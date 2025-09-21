"use client";
import { useState } from "react";
import { estimateImageUSD, estimateVideoUSD, mpFromWH } from "@/lib/pricing";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card className={cn("border-white/10 bg-[#101f3c]/60 text-slate-100 shadow-[0_20px_60px_rgba(8,15,40,0.45)]", className)}>
      <CardHeader>
        <CardTitle className="text-white">Cost Estimator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {mode === "image" ? (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="ce-width">Width (px)</Label>
                <Input
                  id="ce-width"
                  type="number"
                  value={w}
                  min={256}
                  max={2048}
                  onChange={(e) => setW(Number(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="ce-height">Height (px)</Label>
                <Input
                  id="ce-height"
                  type="number"
                  value={h}
                  min={256}
                  max={2048}
                  onChange={(e) => setH(Number(e.target.value))}
                />
              </div>
            </div>
            <div className="text-sm text-white/60">
              Megapixels billed (ceil): <b>{mp} MP</b>
            </div>
            <Separator />
            <div className="text-lg text-white">
              Estimated cost: <span className="font-semibold text-sky-300">${imgUSD.toFixed(3)}</span>
            </div>
          </>
        ) : (
          <>
            <Label htmlFor="ce-seconds">Duration (seconds)</Label>
            <Slider
              id="ce-seconds"
              value={[sec]}
              onValueChange={(value) => value[0] !== undefined && setSec(value[0])}
              min={1}
              max={30}
              step={1}
            />
            <div className="text-sm text-white/60">
              Seconds: <b>{sec}</b>
            </div>
            <Separator />
            <div className="text-lg text-white">
              Estimated cost: <span className="font-semibold text-sky-300">${vidUSD.toFixed(3)}</span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
