import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  Box,
  Container,
  BottomNavigation,
  BottomNavigationAction,
  Paper
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { useNavigate, useLocation } from 'react-router-dom';
import Navlinks from '../nav/Navlinks';
import { User } from '../../types/auth';

interface NavbarProps {
  user: User | null;
  logout: () => void;
  isMobile: boolean;
}

export default function Navbar({ user, logout, isMobile }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = useState(() => {
    const path = location.pathname;
    if (path.includes('dashboard')) return 0;
    if (path.includes('reports') || path.includes('services')) return 1;
    if (path.includes('QuickHelp')) return 2;
    if (path.includes('settings') || path.includes('users')) return 3;
    return 0;
  });

  const getNavigationItems = () => {
    if (!user) return [];

    const baseItems = [
      { label: 'Dashboard', icon: <DashboardIcon />, path: `/${user.role.toLowerCase()}/dashboard` },
      { label: 'Reports', icon: <AssessmentIcon />, path: user.role === 'ADMIN' ? '/admin/reports' : `/${user.role.toLowerCase()}/reports` },
      { label: 'Help', icon: <HelpOutlineIcon />, path: `/${user.role.toLowerCase()}/QuickHelp` },
      { label: 'Settings', icon: <SettingsIcon />, path: user.role === 'ADMIN' ? '/admin/settings' : `/${user.role.toLowerCase()}/settings` }
    ];

    const roleSpecificItems = {
      'ADMIN': [
        { label: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
        { label: 'Services', icon: <AssessmentIcon />, path: '/admin/services' },
        { label: 'Reports', icon: <AssessmentIcon />, path: '/admin/reports' },
        { label: 'Settings', icon: <SettingsIcon />, path: '/admin/settings' }
      ],
      'FACULTY': baseItems,
      'HOD_CSE': baseItems,
      'DIRECTOR': baseItems
    };

    return roleSpecificItems[user.role] || baseItems;
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  if (isMobile) {
    return (
      <>
        <Paper
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            boxShadow: '0px -2px 10px rgba(0, 0, 0, 0.1)'
          }}
          elevation={3}
        >
          <BottomNavigation
            value={value}
            onChange={(event, newValue) => {
              setValue(newValue);
              const navItems = getNavigationItems();
              if (navItems[newValue]) {
                handleNavigation(navItems[newValue].path);
              }
            }}
            showLabels
            sx={{
              height: 64,
              bgcolor: '#002147',
              '& .MuiBottomNavigationAction-root': {
                color: 'rgba(255, 255, 255, 0.6)',
                minWidth: 0
              },
              '& .Mui-selected': {
                color: 'white'
              }
            }}
          >
            {getNavigationItems().map((item, index) => (
              <BottomNavigationAction
                key={index}
                label={item.label}
                icon={item.icon}
                sx={{
                  '& .MuiBottomNavigationAction-label': {
                    fontSize: '0.75rem',
                    transition: 'font-size 0.2s, opacity 0.2s',
                    opacity: 0.7
                  },
                  '& .Mui-selected .MuiBottomNavigationAction-label': {
                    fontSize: '0.75rem',
                    opacity: 1
                  }
                }}
              />
            ))}
          </BottomNavigation>
        </Paper>

        <AppBar position="fixed" sx={{ bgcolor: '#002147', boxShadow: 3, height: 56 }}>
          <Toolbar sx={{ justifyContent: 'space-between', minHeight: 56, px: 1 }}>
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 700,
                fontSize: '1.1rem',
                letterSpacing: '-0.025em'
              }}
            >
              MANIT ATMS
            </Typography>
            {user && (
              <IconButton
                size="small"
                onClick={logout}
                sx={{ color: 'white' }}
              >
                <LogoutIcon />
              </IconButton>
            )}
          </Toolbar>
        </AppBar>

        <Toolbar sx={{ height: 56, minHeight: 56 }} />
      </>
    );
  }

  return (
    <>
      <AppBar position="fixed" sx={{ bgcolor: '#002147', boxShadow: 3, zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Container maxWidth="lg">
          <Toolbar sx={{ justifyContent: 'space-between', height: { xs: 64, md: 80 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton
                color="inherit"
                edge="start"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                sx={{ display: { md: 'none' } }}
                aria-label="Toggle menu"
              >
                <MenuIcon />
              </IconButton>
              <Typography
                variant="h6"
                component="div"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: '1.25rem', md: '1.5rem' },
                  letterSpacing: '-0.025em'
                }}
              >
                MANIT ATMS
              </Typography>
            </Box>

            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
              {user?.role && <Navlinks role={user.role} />}
              {user && (
                <Button
                  variant="contained"
                  startIcon={<LogoutIcon />}
                  onClick={logout}
                  sx={{
                    bgcolor: '#003166',
                    '&:hover': { bgcolor: '#004186' },
                    borderRadius: 2,
                    textTransform: 'none',
                    px: 2,
                    py: 1
                  }}
                >
                  Logout
                </Button>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Toolbar sx={{ height: { xs: 64, md: 80 } }} />

      <Drawer
        anchor="left"
        open={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: 280,
            bgcolor: '#002147',
            color: 'white',
            boxSizing: 'border-box'
          },
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: 1, borderColor: '#003166' }}>
            <Typography variant="h6" fontWeight={700} color="white">
              MANIT ATMS
            </Typography>
            <IconButton onClick={() => setIsMenuOpen(false)} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box sx={{ flexGrow: 1, overflow: 'auto', py: 2, px: 2 }}>
            {user?.role && (
              <List sx={{ p: 0 }}>
                <Navlinks role={user.role} />
              </List>
            )}
          </Box>

          {user && (
            <Box sx={{ p: 2, borderTop: 1, borderColor: '#003166' }}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<LogoutIcon />}
                onClick={logout}
                sx={{
                  bgcolor: '#003166',
                  '&:hover': { bgcolor: '#004186' },
                  borderRadius: 2,
                  py: 1.5,
                  textTransform: 'none'
                }}
              >
                Logout
              </Button>
            </Box>
          )}
        </Box>
      </Drawer>
    </>
  );
}