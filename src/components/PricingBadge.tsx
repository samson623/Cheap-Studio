import { Badge } from "@/components/ui/badge";
import { formatUSD } from "@/lib/pricing";

type PricingBadgeProps = {
  label?: string;
  valueUSD: number;
};

export default function PricingBadge({ label = "Est. Cost", valueUSD }: PricingBadgeProps) {
  return (
    <Badge className="border-white/10 bg-emerald-500/20 text-emerald-100">
      {label}: {formatUSD(valueUSD)}
    </Badge>
  );
}

