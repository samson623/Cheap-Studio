import { Badge } from "@/components/ui/badge";
import { formatUSD } from "@/lib/pricing";

type PricingBadgeProps = {
  label?: string;
  valueUSD: number;
};

export default function PricingBadge({ label = "Est. Cost", valueUSD }: PricingBadgeProps) {
  return (
    <Badge className="border-white/20 bg-gradient-to-r from-sky-500/30 to-indigo-500/30 text-sky-100 shadow-[0_8px_30px_rgba(46,91,255,0.25)]">
      {label}: {formatUSD(valueUSD)}
    </Badge>
  );
}

