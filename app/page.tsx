import { FooterBand, StatusBar } from "@/components/chrome";
import { Hero } from "@/components/hero";
import {
  ChatPanel,
  InfoA,
  InfoB,
  PipelineStrip,
  TitleRow,
} from "@/components/sections";

export default function DashboardPage() {
  return (
    <div>
      <StatusBar />
      <Hero />
      <TitleRow />

      <div className="mt-6 grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_330px]">
        <div className="grid items-start gap-4 sm:grid-cols-2">
          <InfoA />
          <InfoB />
        </div>
        <ChatPanel />
      </div>

      <PipelineStrip />
      <FooterBand />
    </div>
  );
}
