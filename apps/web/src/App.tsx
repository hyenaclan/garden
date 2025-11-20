import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box, Container } from '@mui/material';
import { theme } from '@/theme';
import Header from '@/components/Header';
import Home from '@/components/Home';
import Footer from '@/components/Footer';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Header />

        {/* Main Content */}
        <Box component="main" sx={{ bgcolor: 'primary.lightest', pb: 8 }}>
          <Container maxWidth="xl" sx={{ py: 5 }}>
            <Home />
          </Container>
        </Box>

        <Footer />
      </Box>
    </ThemeProvider>
  );
}

export default App
