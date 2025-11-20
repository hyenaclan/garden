import { Stack } from '@mui/material';
import GardenAnalytics from '@/components/GardenAnalytics';
import GardenDesigner from '@/components/GardenDesigner';
import Seedbox from '@/components/Seedbox';

export default function Home() {
  return (
    <Stack spacing={14}>
      <GardenAnalytics />
      <GardenDesigner />
      <Seedbox />
    </Stack>
  );
}
