import { Box, Card, CardContent, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { RfpForm } from './RfpForm';
import { useCreateRfp } from './useRfps';

export function CreateRfpPage() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const createRfp = useCreateRfp();

  return (
    <Box sx={{ maxWidth: 480 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        New RFP
      </Typography>
      <Card variant="outlined">
        <CardContent>
          <RfpForm
            defaultValues={{
              title: '',
              organization_name: '',
              due_date: '',
              status: 'new',
              work_types: [],
            }}
            defaultOwnerId={session?.user.id ?? ''}
            submitLabel="Create RFP"
            pendingLabel="Creating…"
            isPending={createRfp.isPending}
            isError={createRfp.isError}
            onSubmit={async (input) => {
              const rfp = await createRfp.mutateAsync(input);
              navigate(`/rfps/${rfp.id}`);
            }}
          />
        </CardContent>
      </Card>
    </Box>
  );
}
