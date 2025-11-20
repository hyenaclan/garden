import { Text, Box } from '@mantine/core';

export default function Footer() {
  const buildId = import.meta.env.VITE_BUILD_ID;
  const commitSha = import.meta.env.VITE_COMMIT_SHA?.slice(0, 7);

  return (
    <Box
      component="footer"
      ta="center"
      py="md"
      styles={{
        root: {
          borderTop: '1px solid var(--mantine-color-gray-2)',
        },
      }}
    >
      <Text size="xs" c="gray.5">
        Build #{buildId} ({commitSha})
      </Text>
    </Box>
  );
}
