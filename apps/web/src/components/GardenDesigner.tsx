import { Card, CardContent, Box, Typography, Button } from '@mui/material';

export default function GardenDesigner() {
  return (
    <Box component="section" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h5" sx={{ color: 'secondary.main' }}>
          Garden Designer
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ px: 3 }}
        >
          Open Designer
        </Button>
      </Box>

      <Card>
        <CardContent sx={{ p: 4 }}>
          {/* Garden plot visualization */}
          <Box
            sx={{
              position: 'relative',
              bgcolor: 'warning.light',
              borderRadius: 1,
              p: 6,
              minHeight: 450,
              border: 1,
              borderColor: 'warning.main',
            }}
          >
            {/* Compass directions */}
            <Box sx={{ position: 'absolute', top: 24, left: '50%', transform: 'translateX(-50%)' }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                N
              </Typography>
            </Box>
            <Box sx={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)' }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                S
              </Typography>
            </Box>
            <Box sx={{ position: 'absolute', left: 24, top: '50%', transform: 'translateY(-50%)' }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                W
              </Typography>
            </Box>
            <Box sx={{ position: 'absolute', right: 24, top: '50%', transform: 'translateY(-50%)' }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                E
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
