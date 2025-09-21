import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PricingBadge from "@/components/PricingBadge";
import { formatUSD } from "@/lib/pricing";

export default function BillingPage() {
  const estMonthly = 24.5;
  const lastPayment = "October 1, 2024";

  return (
    <div className="relative mx-auto max-w-6xl space-y-8 px-4 py-12 text-white">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight">Billing</h1>
          <p className="text-sm text-white/70">
            Manage your subscription, invoices, and payment methods.
          </p>
        </div>
        <PricingBadge label="Monthly est." valueUSD={estMonthly} />
      </div>

      <Card className="border-white/10 bg-slate-900/70 text-slate-100 shadow-xl">
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
          <CardDescription className="text-white/70">
            Starter · Billed monthly · Next invoice {lastPayment}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="text-xs uppercase text-white/50">Plan</div>
            <div className="text-lg font-semibold text-white">Starter</div>
            <div className="text-xs text-white/60">Includes 100 image edits + 40s video</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="text-xs uppercase text-white/50">Payment method</div>
            <div className="text-lg font-semibold text-white">VISA ending 8214</div>
            <div className="text-xs text-white/60">Autopay active · Receipts sent via email</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 sm:col-span-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="text-xs uppercase text-white/50">Last charge</div>
                <div className="text-lg font-semibold text-white">{formatUSD(estMonthly)}</div>
              </div>
              <Button
                type="button"
                variant="ghost"
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-white hover:bg-white/10"
              >
                Download receipt
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
