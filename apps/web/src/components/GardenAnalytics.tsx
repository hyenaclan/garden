import { StatCard } from '@/components/ui/stat-card';

export default function GardenAnalytics() {
  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold text-garden-primary-darkest">Garden Analytics</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
        <StatCard
          title="Total Garden Area"
          value="3,333.3"
          unit="sq ft"
          accentColor="blue"
        />

        <StatCard
          title="Total Area Planted"
          value="136.1"
          unit="sq ft"
          accentColor="green"
        />

        <StatCard
          title="Available Area to Plant"
          value="3,197.2"
          unit="sq ft"
          accentColor="yellow"
        />

        <StatCard
          title="Total Harvest Weight"
          subtitle="Fall Season"
          value="245"
          unit="lbs"
          accentColor="orange"
        />

        <StatCard
          title="Total Harvest Weight"
          subtitle="Last Fall"
          value="198"
          unit="lbs"
          accentColor="teal"
          change={{
            value: "23.7%",
            positive: true,
          }}
        />
      </div>
    </section>
  );
}
