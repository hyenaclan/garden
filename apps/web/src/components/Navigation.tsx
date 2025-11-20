import { useState } from 'react';
import { Tabs, Drawer, ActionIcon, Stack, NavLink, rem, useMatches } from '@mantine/core';
import { IconMenu2, IconHome, IconUsers, IconUser, IconX } from '@tabler/icons-react';

type NavItem = 'home' | 'cults' | 'profile';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<NavItem>('home');
  const isMobile = useMatches({ base: true, md: false });

  const navItems = [
    { id: 'home' as NavItem, label: 'Home', icon: IconHome },
    { id: 'cults' as NavItem, label: 'Cult', icon: IconUsers },
    { id: 'profile' as NavItem, label: 'Profile', icon: IconUser },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      {!isMobile && (
        <Tabs
          value={activeItem}
          onChange={(value) => setActiveItem(value as NavItem)}
          variant="pills"
          color="green"
        >
          <Tabs.List
            bg="gray.1"
            p={4}
            styles={{
              list: {
                borderRadius: 'var(--mantine-radius-md)',
              },
            }}
          >
            {navItems.map(({ id, label, icon: Icon }) => (
              <Tabs.Tab
                key={id}
                value={id}
                leftSection={<Icon style={{ width: rem(16), height: rem(16) }} />}
                c={activeItem === id ? 'white' : 'green.6'}
              >
                {label}
              </Tabs.Tab>
            ))}
          </Tabs.List>
        </Tabs>
      )}

      {/* Mobile Navigation */}
      {isMobile && (
        <>
          <ActionIcon variant="subtle" onClick={() => setIsOpen(true)} aria-label="Toggle menu">
            <IconMenu2 size={24} />
          </ActionIcon>
          <Drawer
            opened={isOpen}
            onClose={() => setIsOpen(false)}
            position="right"
            size="256px"
            padding={0}
            styles={{
              title: {
                width: '100%',
                display: 'flex',
                justifyContent: 'flex-end',
              },
            }}
          >
            <Stack gap={0} mt="xl">
              {navItems.map(({ id, label, icon: Icon }) => (
                <NavLink
                  key={id}
                  label={label}
                  leftSection={<Icon size={18} />}
                  active={activeItem === id}
                  onClick={() => {
                    setActiveItem(id);
                    setIsOpen(false);
                  }}
                  styles={{
                    root: {
                      borderRadius: 0,
                      borderBottom: '1px solid var(--mantine-color-gray-2)',
                    },
                    label: {
                      fontSize: rem(14),
                    },
                  }}
                  c={activeItem === id ? 'green.4' : 'gray.6'}
                />
              ))}
            </Stack>
          </Drawer>
        </>
      )}
    </>
  );
}
