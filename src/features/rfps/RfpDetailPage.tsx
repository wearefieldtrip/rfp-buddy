import { Box, Card, CardContent, Chip, CircularProgress, Stack, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useProfiles, useRfp } from './useRfps';
import { RFP_STATUS_LABELS, WORK_TYPE_LABELS } from './types';

export function RfpDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: rfp, isLoading, isError } = useRfp(id ?? '');
  const { data: profiles } = useProfiles();

  if (isLoading) return <CircularProgress />;
  if (isError || !rfp) return <Typography color="error">RFP not found.</Typography>;

  const owner = profiles?.find((p) => p.id === rfp.owner_id);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Typography variant="h4" component="h1">
          {rfp.title}
        </Typography>
        <Chip label={RFP_STATUS_LABELS[rfp.status]} />
      </Box>

      <Card variant="outlined">
        <CardContent>
          <Stack spacing={1.5}>
            <Field label="Organization Name" value={rfp.organization_name} />
            <Field label="Due Date" value={rfp.due_date ?? '—'} />
            <Field label="Owner" value={owner ? owner.full_name ?? owner.email : '—'} />
            <Field
              label="Work Type"
              value={
                rfp.work_types.length > 0
                  ? rfp.work_types.map((type) => WORK_TYPE_LABELS[type]).join(', ')
                  : '—'
              }
            />
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography>{value}</Typography>
    </Box>
  );
}
