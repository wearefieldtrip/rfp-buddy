import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, Button, Card, CardContent, Chip, CircularProgress, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import { AiReviewCard } from './AiReviewCard';
import { DeleteRfpDialog } from './DeleteRfpDialog';
import { QuestionsCard } from './QuestionsCard';
import { RfpDocumentField } from './RfpDocumentField';
import { RfpForm } from './RfpForm';
import { RFP_STATUS_LABELS, WORK_TYPE_LABELS } from './types';
import { useDeleteRfp, useProfiles, useRfp, useUpdateRfp } from './useRfps';

export function RfpDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: rfp, isLoading, isError } = useRfp(id ?? '');
  const { data: profiles } = useProfiles();
  const updateRfp = useUpdateRfp(id ?? '');
  const deleteRfp = useDeleteRfp();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  if (isLoading) return <CircularProgress />;
  if (isError || !rfp) return <Typography color="error">RFP not found.</Typography>;

  const owner = profiles?.find((p) => p.id === rfp.owner_id);

  if (isEditing) {
    return (
      <Box sx={{ maxWidth: 480 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Edit RFP
        </Typography>
        <Card variant="outlined">
          <CardContent>
            <RfpForm
              defaultValues={{
                title: rfp.title,
                organization_name: rfp.organization_name,
                due_date: rfp.due_date ?? '',
                status: rfp.status,
                work_types: rfp.work_types,
              }}
              defaultOwnerId={rfp.owner_id ?? ''}
              submitLabel="Save Changes"
              pendingLabel="Saving…"
              isPending={updateRfp.isPending}
              isError={updateRfp.isError}
              onSubmit={async (input) => {
                await updateRfp.mutateAsync(input);
                setIsEditing(false);
              }}
            />
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box>
      <Button
        component={RouterLink}
        to="/rfps"
        startIcon={<ArrowBackIcon fontSize="small" />}
        sx={{ mb: 1 }}
      >
        Back to RFPs
      </Button>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Typography variant="h4" component="h1">
          {rfp.title}
        </Typography>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Chip label={RFP_STATUS_LABELS[rfp.status]} />
          <Button variant="outlined" onClick={() => setIsEditing(true)}>
            Edit
          </Button>
        </Stack>
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
            <RfpDocumentField rfp={rfp} />
          </Stack>
        </CardContent>
      </Card>

      <AiReviewCard rfp={rfp} />
      <QuestionsCard rfp={rfp} />

      <Box sx={{ mt: 4, pt: 2, borderTop: 1, borderColor: 'divider', textAlign: 'right' }}>
        <Button color="error" size="small" onClick={() => setIsDeleteDialogOpen(true)}>
          Delete RFP
        </Button>
      </Box>

      <DeleteRfpDialog
        rfp={rfp}
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        isPending={deleteRfp.isPending}
        onConfirm={async () => {
          await deleteRfp.mutateAsync(rfp.id);
          navigate('/rfps');
        }}
      />
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
