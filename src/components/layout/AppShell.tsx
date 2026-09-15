import { AppBar, Box, Button, Container, Toolbar, Typography } from '@mui/material';
import type { ReactNode } from 'react';
import { useAuth } from '../../features/auth/useAuth';

export function AppShell({ children }: { children: ReactNode }) {
  const { session, signOut } = useAuth();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            RFP Buddy
          </Typography>
          {session && (
            <Button color="inherit" onClick={() => void signOut()}>
              Sign out
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Container component="main" maxWidth="lg" sx={{ flex: 1, py: 4 }}>
        {children}
      </Container>
    </Box>
  );
}
