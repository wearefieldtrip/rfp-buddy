import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useRfps } from './useRfps';
import { RFP_STATUS_LABELS } from './types';

export function RfpListPage() {
  const { data: rfps, isLoading, isError } = useRfps();

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h1">
          Pursuit Dashboard
        </Typography>
        <Button variant="contained" component={RouterLink} to="/rfps/new">
          New RFP
        </Button>
      </Box>

      {isLoading && <CircularProgress />}

      {isError && <Typography color="error">Failed to load RFPs.</Typography>}

      {!isLoading && !isError && rfps?.length === 0 && (
        <Card variant="outlined">
          <CardContent>
            <Typography color="text.secondary">
              No RFPs yet. Create one to get started.
            </Typography>
          </CardContent>
        </Card>
      )}

      {!isLoading && !isError && rfps && rfps.length > 0 && (
        <Card variant="outlined">
          <List disablePadding>
            {rfps.map((rfp) => (
              <ListItemButton
                key={rfp.id}
                component={RouterLink}
                to={`/rfps/${rfp.id}`}
                divider
              >
                <ListItemText
                  primary={rfp.title}
                  secondary={`${rfp.organization_name}${rfp.due_date ? ` · Due ${rfp.due_date}` : ''}`}
                />
                <Chip label={RFP_STATUS_LABELS[rfp.status]} size="small" />
              </ListItemButton>
            ))}
          </List>
        </Card>
      )}
    </Box>
  );
}
