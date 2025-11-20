import { Stack } from '@mantine/core';
import GardenAnalytics from '@/components/GardenAnalytics';
import GardenDesigner from '@/components/GardenDesigner';
import Seedbox from '@/components/Seedbox';

export default function Home() {
  return (
    <Stack gap={56}>
      <GardenAnalytics />
      <GardenDesigner />
      <Seedbox />
    </Stack>
  );
}
