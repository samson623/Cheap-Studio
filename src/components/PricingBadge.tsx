import { Badge } from "@/components/ui/badge";
import { formatUSD } from "@/lib/pricing";

type PricingBadgeProps = {
  label?: string;
  valueUSD: number;
};

export default function PricingBadge({ label = "Est. Cost", valueUSD }: PricingBadgeProps) {
  return (
    <Badge variant="secondary">
      {label}: {formatUSD(valueUSD)}
    </Badge>
  );
}

