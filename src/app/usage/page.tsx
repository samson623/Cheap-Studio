import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PricingBadge from "@/components/PricingBadge";
import { formatUSD } from "@/lib/pricing";

export default function UsagePage() {
  const monthlyImage = 120;
  const monthlyVideoSec = 180; // demo numbers
  const estMonthlyUSD = 2.4; // placeholder aggregate

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-6 space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Usage</h1>
          <p className="text-sm text-muted-foreground">Simple overview of your recent activity</p>
        </div>
        <PricingBadge label="Monthly Est." valueUSD={estMonthlyUSD} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Images</CardTitle>
            <CardDescription>Generated this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{monthlyImage}</div>
            <div className="text-sm text-muted-foreground">Across all sizes</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Video</CardTitle>
            <CardDescription>Total seconds this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{monthlyVideoSec}s</div>
            <div className="text-sm text-muted-foreground">Mixed resolutions</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Billing Snapshot</CardTitle>
          <CardDescription>Non-binding estimate for preview purposes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-lg">Estimated charges: {formatUSD(estMonthlyUSD)}</div>
          <div className="text-sm text-muted-foreground">Actuals may differ based on provider rates.</div>
        </CardContent>
      </Card>
    </div>
  );
}

