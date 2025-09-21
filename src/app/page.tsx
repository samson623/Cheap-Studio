import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ImageIcon, LightningBoltIcon, RocketIcon, VideoIcon } from "@radix-ui/react-icons";

const stats = [
  {
    label: "Images this month",
    used: 68,
    limit: 120,
    icon: ImageIcon,
  },
  {
    label: "Video seconds",
    used: 44,
    limit: 180,
    icon: VideoIcon,
  },
  {
    label: "Realtime credits",
    used: 12,
    limit: 40,
    icon: LightningBoltIcon,
  },
];

export default function Dashboard() {
  return (
    <div className="relative mx-auto max-w-6xl space-y-8 px-4 py-10 text-white">
      <section className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-3">
          <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-sky-200/80">
            Overview
          </span>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Creative control at a glance</h1>
            <p className="mt-2 max-w-xl text-sm text-white/70">
              Monitor usage, unlock quick actions, and jump back into your favourite generative workflows.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-xl border border-white/10 bg-[#101f3c]/60 px-4 py-3 text-sm shadow-[0_15px_45px_rgba(8,15,40,0.45)]">
              <p className="text-white/50">Current plan</p>
              <p className="text-lg font-semibold text-white">Studio · $29/mo</p>
            </div>
            <Button className="rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 px-6 text-sm font-medium text-white shadow-[0_10px_30px_rgba(56,189,248,0.35)] hover:from-sky-400 hover:to-indigo-400">
              Open gallery
            </Button>
          </div>
        </div>
        <Card className="border-white/10 bg-[#101f3c]/60 text-white shadow-[0_25px_60px_rgba(8,15,40,0.45)] lg:w-[320px]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <RocketIcon className="h-5 w-5 text-sky-300" />
              Latest launch
            </CardTitle>
            <CardDescription className="text-white/60">
              Keep iterating with presets and recent prompts.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-white/70">
            <div>
              <p className="font-semibold text-white">Animated product hero</p>
              <p className="text-white/60">Video · 12 seconds · 4k</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 p-3">
              <p className="text-[11px] uppercase tracking-[0.3em] text-white/40">Prompt highlight</p>
              <p className="mt-2 text-sm text-white/80">
                Futuristic office with volumetric lighting and confident presenter delivering a bold pitch.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const pct = Math.min(100, Math.round((stat.used / stat.limit) * 100));
          const Icon = stat.icon;
          return (
            <Card
              key={stat.label}
              className="border-white/10 bg-[#101f3c]/60 text-white shadow-[0_20px_60px_rgba(8,15,40,0.45)]"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-base font-semibold text-white">{stat.label}</CardTitle>
                <span className="rounded-full bg-sky-500/15 p-2 text-sky-300">
                  <Icon className="h-4 w-4" />
                </span>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-end justify-between text-sm text-white/70">
                  <span>
                    <span className="text-lg font-semibold text-white">{stat.used}</span>
                    <span className="text-white/40"> / {stat.limit}</span>
                  </span>
                  <span>{pct}%</span>
                </div>
                <Progress
                  value={pct}
                  className="h-2 bg-white/10"
                  indicatorClassName="bg-gradient-to-r from-sky-400 to-indigo-500"
                />
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,_2fr)_minmax(0,_1fr)]">
        <Card className="border-white/10 bg-[#101f3c]/60 text-white shadow-[0_20px_60px_rgba(8,15,40,0.45)]">
          <CardHeader>
            <CardTitle className="text-white">Quick start</CardTitle>
            <CardDescription className="text-white/60">
              Pick up from saved prompts or explore new styles.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {[
              {
                title: "Portrait enhancer",
                description: "Clean up lighting and sharpen key features for hero shots.",
              },
              {
                title: "Cinematic storyboards",
                description: "Generate consistent keyframes before full video renders.",
              },
              {
                title: "Studio lighting swap",
                description: "Transform ambient office scenes into polished studio looks.",
              },
              {
                title: "Product hero loop",
                description: "Loop-ready 6s sequences with focus pulls and parallax.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-white/10 bg-white/5 p-4 transition hover:border-sky-400/40 hover:bg-sky-500/10"
              >
                <p className="text-sm font-semibold text-white">{item.title}</p>
                <p className="mt-2 text-xs text-white/60">{item.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-[#101f3c]/60 text-white shadow-[0_20px_60px_rgba(8,15,40,0.45)]">
          <CardHeader>
            <CardTitle className="text-white">Session timeline</CardTitle>
            <CardDescription className="text-white/60">
              A quick look at what you generated today.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 text-sm text-white/70">
            {[
              {
                time: "14:24",
                label: "Gallery upload",
                detail: "Portrait enhancer v4",
              },
              {
                time: "13:10",
                label: "Video render",
                detail: "Product launch sequence · 8s",
              },
              {
                time: "09:47",
                label: "Image edit",
                detail: "Backdrop cleanup for social teaser",
              },
            ].map((entry) => (
              <div key={entry.time} className="relative pl-6">
                <span className="absolute left-0 top-1 h-3 w-3 rounded-full bg-gradient-to-r from-sky-400 to-indigo-500" />
                <p className="text-xs uppercase tracking-[0.3em] text-white/40">{entry.time}</p>
                <p className="mt-1 text-sm font-semibold text-white">{entry.label}</p>
                <p className="text-xs text-white/60">{entry.detail}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

