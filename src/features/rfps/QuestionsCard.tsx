import AutorenewIcon from '@mui/icons-material/Autorenew';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';
import type { Rfp } from './types';
import { useGenerateQuestions } from './useRfps';

export function QuestionsCard({ rfp }: { rfp: Rfp }) {
  const generateQuestions = useGenerateQuestions(rfp);

  if (rfp.questions_status === 'generating') {
    return (
      <Card variant="outlined" sx={{ mt: 3 }}>
        <LinearProgress />
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Clarification Questions
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5, py: 2 }}>
            <CircularProgress size={20} />
            <Typography color="text.secondary">Drafting questions from the RFP…</Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (rfp.questions_status === 'completed' && rfp.questions_result) {
    const { questions } = rfp.questions_result;
    return (
      <Card variant="outlined" sx={{ mt: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Typography variant="h6">Clarification Questions</Typography>
            <Button
              size="small"
              variant="outlined"
              startIcon={<AutorenewIcon fontSize="small" />}
              disabled={generateQuestions.isPending}
              onClick={() => generateQuestions.mutate()}
            >
              Regenerate
            </Button>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {rfp.questions_generated_at &&
              `Drafted ${new Date(rfp.questions_generated_at).toLocaleString()} · `}
            AI-drafted — review before sending anything to the issuing organization.
          </Typography>

          <Stack spacing={2}>
            {questions.map((item, index) => (
              <Box
                key={item.question}
                sx={{ pl: 1.5, borderLeft: '3px solid', borderColor: 'divider' }}
              >
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {index + 1}. {item.question}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {item.rationale}
                </Typography>
              </Box>
            ))}
          </Stack>
        </CardContent>
      </Card>
    );
  }

  if (rfp.questions_status === 'failed') {
    return (
      <Card variant="outlined" sx={{ mt: 3, borderColor: 'error.main' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h6">Clarification Questions</Typography>
              <Typography color="error">Generation failed.</Typography>
              {rfp.questions_error && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {rfp.questions_error}
                </Typography>
              )}
            </Box>
            <Button
              variant="contained"
              disabled={generateQuestions.isPending}
              onClick={() => generateQuestions.mutate()}
            >
              Try Again
            </Button>
          </Box>
        </CardContent>
      </Card>
    );
  }

  const hasDocument = !!rfp.document_drive_url;

  return (
    <Card variant="outlined" sx={{ mt: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h6">Clarification Questions</Typography>
            <Typography color="text.secondary">
              {hasDocument
                ? 'No questions drafted yet.'
                : 'Attach an RFP document to enable this.'}
            </Typography>
          </Box>
          <Button
            variant="contained"
            disabled={!hasDocument || generateQuestions.isPending}
            onClick={() => generateQuestions.mutate()}
          >
            Generate Questions
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
