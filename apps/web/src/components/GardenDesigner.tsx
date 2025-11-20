import { Stack, Group, Title, Card, Button, Box, Text } from '@mantine/core';

export default function GardenDesigner() {
  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Title order={2} size="h3" c="green.8">
          Garden Designer
        </Title>
        <Button color="green" px="xl">
          Open Designer
        </Button>
      </Group>

      <Card shadow="sm" padding="xl">
        {/* Garden plot visualization */}
        <Box
          pos="relative"
          bg="yellow.0"
          p="xl"
          bd="1px solid var(--mantine-color-yellow-1)"
          style={{
            borderRadius: 'var(--mantine-radius-md)',
            minHeight: '450px',
          }}
        >
          {/* Compass directions */}
          <Text
            fw={600}
            size="sm"
            c="gray.6"
            pos="absolute"
            top={24}
            left="50%"
            style={{ transform: 'translateX(-50%)' }}
          >
            N
          </Text>
          <Text
            fw={600}
            size="sm"
            c="gray.6"
            pos="absolute"
            bottom={24}
            left="50%"
            style={{ transform: 'translateX(-50%)' }}
          >
            S
          </Text>
          <Text
            fw={600}
            size="sm"
            c="gray.6"
            pos="absolute"
            left={24}
            top="50%"
            style={{ transform: 'translateY(-50%)' }}
          >
            W
          </Text>
          <Text
            fw={600}
            size="sm"
            c="gray.6"
            pos="absolute"
            right={24}
            top="50%"
            style={{ transform: 'translateY(-50%)' }}
          >
            E
          </Text>
        </Box>
      </Card>
    </Stack>
  );
}
