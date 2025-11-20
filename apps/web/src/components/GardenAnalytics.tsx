import { Box, Typography } from '@mui/material';
import { StatCard } from '@/components/ui/stat-card';

export default function GardenAnalytics() {
  return (
    <Box component="section">
      <Typography variant="h5" sx={{ color: 'secondary.main', mb: 3 }}>
        Garden Analytics
      </Typography>

      <Box sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          lg: 'repeat(3, 1fr)',
          xl: 'repeat(5, 1fr)'
        },
        gap: 2.5
      }}>
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
      </Box>
    </Box>
  );
}
