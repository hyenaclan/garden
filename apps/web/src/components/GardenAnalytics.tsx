import { Stack, Title, SimpleGrid } from '@mantine/core';
import { StatCard } from '@/components/ui/stat-card';

export default function GardenAnalytics() {
  return (
    <Stack gap="lg">
      <Title order={2} size="h3" c="green.8">
        Garden Analytics
      </Title>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3, xl: 5 }} spacing="lg">
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
      </SimpleGrid>
    </Stack>
  );
}
