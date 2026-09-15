import { Box, Card, CardContent, Typography } from '@mui/material';

export function DashboardPage() {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Pursuit Dashboard
      </Typography>
      <Card variant="outlined">
        <CardContent>
          <Typography color="text.secondary">
            No RFPs yet. The RFP list and record creation flow will appear here.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
