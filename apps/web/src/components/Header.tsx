import { AppBar, Toolbar, Typography, Container, Box } from '@mui/material';
import Navigation from '@/components/Navigation';

export default function Header() {
  return (
    <AppBar position="static" elevation={0} sx={{ bgcolor: 'background.paper', borderBottom: 1, borderColor: 'grey.100' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ height: 64 }}>
          <Typography
            variant="h6"
            component="h1"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              color: 'secondary.main',
              flexGrow: 1,
            }}
          >
            <Box component="span" sx={{ fontSize: '1.125rem' }}>🌱</Box>
            Garden Manager
          </Typography>
          <Navigation />
        </Toolbar>
      </Container>
    </AppBar>
  );
}
