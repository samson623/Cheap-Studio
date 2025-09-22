"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function DashboardPage() {
  // Match the reference version in the screenshot
  const planName = "Free";
  const planPrice = "$0/mo";
  const imgUsed = 0;
  const imgLimit = 3;
  const vidUsed = 0;
  const vidLimit = 5;

  const imagePct = Math.min(100, Math.round((imgUsed / imgLimit) * 100));
  const videoPct = Math.min(100, Math.round((vidUsed / vidLimit) * 100));

  return (
    <div className="relative mx-auto max-w-6xl space-y-6 px-4 py-12">
      <div className="space-y-1 text-white">
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-white/70">
          Snapshot of your current plan usage and limits.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-white/10 bg-slate-900/70 text-slate-100 shadow-xl">
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-white/70">
            <div className="space-y-0.5">
              <div className="text-white">{planName}</div>
              <div className="text-white/60 text-xs">{planPrice}</div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-slate-900/70 text-slate-100 shadow-xl">
          <CardHeader>
            <CardTitle>Image Usage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm text-white/70">
              <span>
                {imgUsed} / {imgLimit}
              </span>
              <span>{imagePct}%</span>
            </div>
            <Progress value={imagePct} className="h-2" />
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-slate-900/70 text-slate-100 shadow-xl">
          <CardHeader>
            <CardTitle>Video Usage (seconds)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm text-white/70">
              <span>
                {vidUsed} / {vidLimit}
              </span>
              <span>{videoPct}%</span>
            </div>
            <Progress value={videoPct} className="h-2" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
