import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import { useAuth } from './useAuth';

export function SignInPage() {
  const { signInWithGoogle } = useAuth();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '70vh',
      }}
    >
      <Card variant="outlined" sx={{ minWidth: 320 }}>
        <CardContent sx={{ textAlign: 'center' }}>
          <Typography variant="h5" component="h1" gutterBottom>
            RFP Buddy
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Sign in with your Fieldtrip Google account.
          </Typography>
          <Button variant="contained" onClick={() => void signInWithGoogle()}>
            Sign in with Google
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
