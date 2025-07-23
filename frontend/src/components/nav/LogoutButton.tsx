import { Button } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../../hooks/useAuth';

export default function LogoutButton() {
  const { logout } = useAuth();

  return (
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
  );
}