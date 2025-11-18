import GardenAnalytics from '@/components/GardenAnalytics';
import GardenDesigner from '@/components/GardenDesigner';
import Seedbox from '@/components/Seedbox';

export default function Home() {
  return (
    <div className="space-y-14">
      <GardenAnalytics />
      <GardenDesigner />
      <Seedbox />
    </div>
  );
}
