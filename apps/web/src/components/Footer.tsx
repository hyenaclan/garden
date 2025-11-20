import { Box, Typography } from '@mui/material';

export default function Footer() {
  const buildId = import.meta.env.VITE_BUILD_ID;
  const commitSha = import.meta.env.VITE_COMMIT_SHA?.slice(0, 7);

  return (
    <Box
      component="footer"
      sx={{
        textAlign: 'center',
        py: 3,
        borderTop: 1,
        borderColor: 'grey.200',
      }}
    >
      <Typography variant="caption" sx={{ color: 'grey.400' }}>
        Build #{buildId} ({commitSha})
      </Typography>
    </Box>
  );
}
