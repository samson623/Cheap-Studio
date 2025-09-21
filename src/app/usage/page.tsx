import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PricingBadge from "@/components/PricingBadge";
import { formatUSD } from "@/lib/pricing";

export default function UsagePage() {
  const monthlyImage = 120;
  const monthlyVideoSec = 180; // demo numbers
  const estMonthlyUSD = 2.4; // placeholder aggregate

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-12 text-white">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Usage</h1>
          <p className="text-sm text-white/70">Simple overview of your recent activity</p>
        </div>
        <PricingBadge label="Monthly Est." valueUSD={estMonthlyUSD} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="border-white/10 bg-slate-900/70 text-slate-100 shadow-xl">
          <CardHeader>
            <CardTitle>Images</CardTitle>
            <CardDescription>Generated this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{monthlyImage}</div>
            <div className="text-sm text-white/70">Across all sizes</div>
          </CardContent>
        </Card>
        <Card className="border-white/10 bg-slate-900/70 text-slate-100 shadow-xl">
          <CardHeader>
            <CardTitle>Video</CardTitle>
            <CardDescription>Total seconds this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{monthlyVideoSec}s</div>
            <div className="text-sm text-white/70">Mixed resolutions</div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-white/10 bg-slate-900/70 text-slate-100 shadow-xl">
        <CardHeader>
          <CardTitle>Billing Snapshot</CardTitle>
          <CardDescription>Non-binding estimate for preview purposes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-lg">Estimated charges: {formatUSD(estMonthlyUSD)}</div>
          <div className="text-sm text-white/70">Actuals may differ based on provider rates.</div>
        </CardContent>
      </Card>
    </div>
  );
}

