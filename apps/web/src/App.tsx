import { MantineProvider, AppShell, Container } from '@mantine/core';
import '@mantine/core/styles.css';
import { theme } from '@/theme';
import Header from '@/components/Header';
import Home from '@/components/Home';
import Footer from '@/components/Footer';

function App() {
  return (
    <MantineProvider theme={theme}>
      <AppShell
        header={{ height: 64 }}
        styles={{
          main: {
            minHeight: '100vh',
            backgroundColor: 'var(--mantine-color-green-0)',
            paddingBottom: '4rem',
          },
        }}
      >
        <Header />

        <AppShell.Main>
          <Container size="xl" py="xl">
            <Home />
          </Container>
        </AppShell.Main>

        <Footer />
      </AppShell>
    </MantineProvider>
  );
}

export default App
