import { Box, Button, CircularProgress, Typography } from '@mui/material';
import type { ReactNode } from 'react';
import { useAuth } from './useAuth';
import { SignInPage } from './SignInPage';
import { useProfile } from './useProfile';

function CenteredMessage({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '70vh',
        gap: 2,
        textAlign: 'center',
      }}
    >
      {children}
    </Box>
  );
}

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { session, loading: authLoading, signOut } = useAuth();
  const { loading: profileLoading, hasProfile } = useProfile();

  if (authLoading) {
    return (
      <CenteredMessage>
        <CircularProgress />
      </CenteredMessage>
    );
  }

  if (!session) {
    return <SignInPage />;
  }

  if (profileLoading) {
    return (
      <CenteredMessage>
        <CircularProgress />
      </CenteredMessage>
    );
  }

  if (!hasProfile) {
    return (
      <CenteredMessage>
        <Typography variant="h6">No access</Typography>
        <Typography color="text.secondary">
          Your account isn't authorized for RFP Buddy. Sign in with your Fieldtrip
          Google account, or contact an administrator if you believe this is a mistake.
        </Typography>
        <Button variant="outlined" onClick={() => void signOut()}>
          Sign out
        </Button>
      </CenteredMessage>
    );
  }

  return <>{children}</>;
}
