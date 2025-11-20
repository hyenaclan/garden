import { useState } from 'react';
import { Tabs, Tab, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Box, useMediaQuery, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import HomeIcon from '@mui/icons-material/Home';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonIcon from '@mui/icons-material/Person';

type NavItem = 'home' | 'cults' | 'profile';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<NavItem>('home');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const navItems = [
    { id: 'home' as NavItem, label: 'Home', icon: HomeIcon },
    { id: 'cults' as NavItem, label: 'Cult', icon: GroupsIcon },
    { id: 'profile' as NavItem, label: 'Profile', icon: PersonIcon },
  ];

  const handleTabChange = (_event: React.SyntheticEvent, newValue: NavItem) => {
    setActiveItem(newValue);
  };

  return (
    <>
      {/* Desktop Navigation */}
      {!isMobile && (
        <Tabs
          value={activeItem}
          onChange={handleTabChange}
          sx={{
            '& .MuiTab-root': {
              minHeight: '40px',
              gap: 1,
              color: 'primary.main',
              '&:hover': {
                backgroundColor: 'primary.lightest',
              },
            },
          }}
        >
          {navItems.map(({ id, label, icon: Icon }) => (
            <Tab
              key={id}
              value={id}
              label={label}
              icon={<Icon sx={{ fontSize: 18 }} />}
              iconPosition="start"
            />
          ))}
        </Tabs>
      )}

      {/* Mobile Navigation */}
      {isMobile && (
        <>
          <IconButton
            onClick={() => setIsOpen(true)}
            aria-label="Toggle menu"
            sx={{ color: 'text.primary' }}
          >
            <MenuIcon />
          </IconButton>
          <Drawer
            anchor="right"
            open={isOpen}
            onClose={() => setIsOpen(false)}
            PaperProps={{
              sx: {
                width: 256,
                backgroundColor: 'white',
              },
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
              <IconButton
                onClick={() => setIsOpen(false)}
                aria-label="Close menu"
                sx={{ color: 'grey.600' }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
            <Box>
              <List sx={{ p: 0 }}>
                {navItems.map(({ id, label, icon: Icon }) => (
                  <ListItem key={id} disablePadding>
                    <ListItemButton
                      selected={activeItem === id}
                      onClick={() => {
                        setActiveItem(id);
                        setIsOpen(false);
                      }}
                      sx={{
                        px: 3,
                        py: 1.5,
                        borderBottom: '1px solid',
                        borderColor: 'grey.100',
                        borderRadius: 0,
                        '&.Mui-selected': {
                          backgroundColor: 'transparent',
                          color: 'primary.main',
                          fontWeight: 500,
                          '&:hover': {
                            backgroundColor: 'primary.lightest',
                          },
                        },
                        '&:not(.Mui-selected)': {
                          color: 'grey.500',
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>
                        <Icon sx={{ fontSize: 18 }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={label}
                        primaryTypographyProps={{
                          fontSize: '0.875rem',
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Box>
          </Drawer>
        </>
      )}
    </>
  );
}
