import { AppShell, Group, Title, Container } from '@mantine/core';
import Navigation from '@/components/Navigation';

export default function Header() {
  return (
    <AppShell.Header
      styles={{
        header: {
          borderBottom: '1px solid var(--mantine-color-gray-2)',
        },
      }}
    >
      <Container size="xl" h="100%">
        <Group h="100%" justify="space-between">
          <Group gap="xs">
            <span style={{ fontSize: '1.125rem' }}>🌱</span>
            <Title order={1} size="h4" c="green.8">
              Garden Manager
            </Title>
          </Group>
          <Navigation />
        </Group>
      </Container>
    </AppShell.Header>
  );
}
