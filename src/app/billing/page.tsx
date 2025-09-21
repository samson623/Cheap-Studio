import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PricingBadge from "@/components/PricingBadge";
import { Progress } from "@/components/ui/progress";

const invoices = [
  { id: "INV-0052", period: "Dec 2024", amount: "$28.40", status: "Paid" },
  { id: "INV-0051", period: "Nov 2024", amount: "$31.90", status: "Paid" },
  { id: "INV-0050", period: "Oct 2024", amount: "$24.15", status: "Paid" },
];

export default function BillingPage() {
  const estimated = 34.12;
  const imagePct = 68;
  const videoPct = 44;

  return (
    <div className="relative mx-auto max-w-6xl space-y-8 px-4 py-10 text-white">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-3">
          <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-sky-200/80">
            Billing
          </span>
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold">Plan & usage</h1>
            <p className="max-w-xl text-sm text-white/70">
              Track your subscription, review usage against monthly quotas, and download past invoices.
            </p>
          </div>
        </div>
        <PricingBadge label="Est. this month" valueUSD={estimated} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,_2fr)_minmax(0,_1fr)]">
        <div className="space-y-6">
          <Card className="border-white/10 bg-[#101f3c]/60 text-white shadow-[0_25px_60px_rgba(8,15,40,0.45)]">
            <CardHeader>
              <CardTitle className="text-white">Studio plan</CardTitle>
              <CardDescription className="text-white/60">Unlimited projects, priority access, and dedicated support.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
                <p className="text-xs uppercase tracking-[0.3em] text-white/40">Plan</p>
                <p className="mt-1 text-lg font-semibold text-white">Studio · $29/mo</p>
                <p className="mt-3 text-xs text-white/50">Includes 120 image edits, 180s of video, realtime credits, and analytics.</p>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-white/40">Renewal</p>
                  <p className="text-sm text-white/70">Renews on 01 Feb 2025</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-white/40">Payment method</p>
                  <p className="text-sm text-white/70">**** 5124 · Mastercard</p>
                </div>
                <Button className="w-fit rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 px-5 text-xs font-medium text-white shadow-[0_8px_26px_rgba(56,189,248,0.35)] hover:from-sky-400 hover:to-indigo-400">
                  Update billing
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-[#101f3c]/60 text-white shadow-[0_25px_60px_rgba(8,15,40,0.45)]">
            <CardHeader>
              <CardTitle className="text-white">Invoices</CardTitle>
              <CardDescription className="text-white/60">Download receipts for your records.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-white/70">
              {invoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-white">{invoice.period}</p>
                    <p className="text-xs text-white/50">{invoice.id}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-white/70">{invoice.amount}</span>
                    <Button
                      variant="ghost"
                      className="rounded-full border border-white/10 bg-white/5 px-4 text-xs text-white hover:border-sky-400/40 hover:bg-sky-500/10"
                    >
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-white/10 bg-[#101f3c]/60 text-white shadow-[0_25px_60px_rgba(8,15,40,0.45)]">
            <CardHeader>
              <CardTitle className="text-white">Usage snapshot</CardTitle>
              <CardDescription className="text-white/60">Your activity resets on the first of each month.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2 text-sm text-white/70">
                <div className="flex items-center justify-between">
                  <span>Images</span>
                  <span>68 / 120</span>
                </div>
                <Progress
                  value={imagePct}
                  className="h-2 bg-white/10"
                  indicatorClassName="bg-gradient-to-r from-sky-400 to-indigo-500"
                />
              </div>
              <div className="space-y-2 text-sm text-white/70">
                <div className="flex items-center justify-between">
                  <span>Video seconds</span>
                  <span>44 / 180</span>
                </div>
                <Progress
                  value={videoPct}
                  className="h-2 bg-white/10"
                  indicatorClassName="bg-gradient-to-r from-violet-400 to-indigo-500"
                />
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-xs text-white/60">
                <p>Tip: upgrade to the <span className="text-sky-300">Producer plan</span> for 3× video quota and collaboration seats.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-[#101f3c]/60 text-white shadow-[0_25px_60px_rgba(8,15,40,0.45)]">
            <CardHeader>
              <CardTitle className="text-white">Support</CardTitle>
              <CardDescription className="text-white/60">We typically respond within 2 hours.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-white/70">
              <p>Email: support@cheapstudio.dev</p>
              <p>Slack: #studio-support</p>
              <Button className="w-fit rounded-full border border-white/10 bg-white/5 px-4 text-xs text-white hover:border-sky-400/40 hover:bg-sky-500/10">
                Contact support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

