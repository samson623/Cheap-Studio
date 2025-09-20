"use client";
import { useState } from "react";
import { estimateImageUSD, estimateVideoUSD, mpFromWH } from "@/lib/pricing";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";

type Props = { mode: "image" | "video"; className?: string };

export default function CostEstimator({ mode, className }: Props) {
  const [w, setW] = useState(1024);
  const [h, setH] = useState(1024);
  const [sec, setSec] = useState(5);

  const mp = mpFromWH(w, h);
  const imgUSD = estimateImageUSD(w, h);
  const vidUSD = estimateVideoUSD(sec);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Cost Estimator</CardTitle>
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
            <div className="text-sm text-muted-foreground">
              Megapixels billed (ceil): <b>{mp} MP</b>
            </div>
            <Separator />
            <div className="text-lg">
              Estimated cost: <b>${imgUSD.toFixed(3)}</b>
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
            <div className="text-sm text-muted-foreground">
              Seconds: <b>{sec}</b>
            </div>
            <Separator />
            <div className="text-lg">
              Estimated cost: <b>${vidUSD.toFixed(3)}</b>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
