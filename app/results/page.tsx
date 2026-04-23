import { AuroraBackground } from "@/components/AuroraBackground";
import { ResultsDashboard } from "@/components/ResultsDashboard";

export const metadata = {
  title: "Live Results — Workshop Pulse",
};

export default function ResultsPage() {
  return (
    <>
      <AuroraBackground />
      <main className="flex-1 flex flex-col">
        <ResultsDashboard />
      </main>
    </>
  );
}
