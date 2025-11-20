import { Card, CardContent, Box, Typography, Button } from '@mui/material';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';

export default function Seedbox() {
  return (
    <Box component="section">
      <Card>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              <LocalFloristIcon sx={{ fontSize: 32, color: 'primary.main', flexShrink: 0, mt: 0.5 }} />
              <Box>
                <Typography variant="h5" sx={{ color: 'secondary.main', mb: 1 }}>
                  Seedbox
                </Typography>
                <Typography sx={{ color: 'primary.main' }}>
                  Manage your seed inventory, planting schedules, and variety information
                </Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              color="primary"
              sx={{
                px: 3,
                flexShrink: 0
              }}
            >
              Go to Seedbox
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
