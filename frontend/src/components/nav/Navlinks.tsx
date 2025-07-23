import { Link } from 'react-router-dom';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Box,
  useMediaQuery,
  useTheme
} from '@mui/material';

// MUI Icons
import HomeIcon from '@mui/icons-material/Home';
import HelpIcon from '@mui/icons-material/Help';
import SettingsIcon from '@mui/icons-material/Settings';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import ViewQuiltIcon from '@mui/icons-material/ViewQuilt';

import { UserRole } from '../../types/auth';

interface NavLinksProps {
  role: UserRole;
}

export default function Navlinks({ role }: NavLinksProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Render either mobile list items or desktop buttons based on screen size
  const renderNavLinks = (links: { to: string; icon: JSX.Element; label: string }[]) => {
    if (isMobile) {
      return (
        <List disablePadding>
          {links.map((link, index) => (
            <ListItem
              key={index}
              component={Link}
              to={link.to}
              sx={{
                borderRadius: 2,
                mb: 1,
                color: 'white',
                '&:hover': { bgcolor: '#003166' },
                transition: 'background-color 250ms ease',
              }}
            >
              <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                {link.icon}
              </ListItemIcon>
              <ListItemText primary={link.label} />
            </ListItem>
          ))}
        </List>
      );
    }

    return (
      <Box sx={{ display: 'flex', gap: 1 }}>
        {links.map((link, index) => (
          <Button
            key={index}
            component={Link}
            to={link.to}
            startIcon={link.icon}
            variant="text"
            sx={{
              color: 'white',
              textTransform: 'none',
              borderRadius: 2,
              px: 2,
              py: 1,
              '&:hover': { bgcolor: '#003166' },
              transition: 'background-color 250ms ease'
            }}
          >
            {link.label}
          </Button>
        ))}
      </Box>
    );
  };

  // Define links based on user role
  switch (role) {
    case 'FACULTY':
      return renderNavLinks([
        { to: '/faculty/dashboard', icon: <HomeIcon />, label: 'Dashboard' },
        { to: '/faculty/QuickHelp', icon: <HelpIcon />, label: 'Help' }
      ]);

    case 'HOD_CSE':
      return renderNavLinks([
        { to: '/hod/dashboard', icon: <HomeIcon />, label: 'Dashboard' },
        { to: '/hod/QuickHelp', icon: <HelpIcon />, label: 'Help' }
      ]);

    case 'DIRECTOR':
      return renderNavLinks([
        { to: '/director/dashboard', icon: <HomeIcon />, label: 'Dashboard' },
        { to: '/director/QuickHelp', icon: <HelpIcon />, label: 'Help' }
      ]);

    case 'ADMIN':
      return renderNavLinks([
        { to: '/admin/dashboard', icon: <HomeIcon />, label: 'Dashboard' },
        { to: '/admin/services', icon: <ViewQuiltIcon />, label: 'Services' },
        { to: '/admin/reports', icon: <BarChartIcon />, label: 'Reports' },
        { to: '/admin/users', icon: <PeopleIcon />, label: 'Users' },
        { to: '/admin/settings', icon: <SettingsIcon />, label: 'Settings' }
      ]);

    default:
      return null;
  }
}