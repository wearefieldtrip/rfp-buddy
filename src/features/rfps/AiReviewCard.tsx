import AutorenewIcon from '@mui/icons-material/Autorenew';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  LinearProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import type { Recommendation, Rfp } from './types';
import { useScoreRfp } from './useRfps';

const RECOMMENDATION_COLOR: Record<Recommendation, 'success' | 'warning' | 'error'> = {
  Go: 'success',
  'Conditional Go': 'warning',
  'No-Go': 'error',
};

function SectionHeading({ children }: { children: string }) {
  return (
    <Typography
      variant="overline"
      sx={{ color: 'text.secondary', display: 'block', letterSpacing: '0.08em' }}
    >
      {children}
    </Typography>
  );
}

export function AiReviewCard({ rfp }: { rfp: Rfp }) {
  const scoreRfp = useScoreRfp(rfp);

  if (rfp.ai_review_status === 'scoring') {
    return (
      <Card variant="outlined" sx={{ mt: 3 }}>
        <LinearProgress />
        <CardContent>
          <Typography variant="h6" gutterBottom>
            AI Review
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5, py: 2 }}>
            <CircularProgress size={20} />
            <Typography color="text.secondary">Scoring against the pursuit rubric…</Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (rfp.ai_review_status === 'completed' && rfp.ai_review_result) {
    const result = rfp.ai_review_result;
    return (
      <Card variant="outlined" sx={{ mt: 3 }}>
        <CardContent>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Typography variant="h6">AI Review</Typography>
            <Button
              size="small"
              variant="outlined"
              startIcon={<AutorenewIcon fontSize="small" />}
              disabled={scoreRfp.isPending}
              onClick={() => scoreRfp.mutate()}
            >
              Re-score
            </Button>
          </Box>
          <Typography variant="body2" color="text.secondary">
            {rfp.ai_review_scored_at && new Date(rfp.ai_review_scored_at).toLocaleString()}
          </Typography>

          {/* Recommendation stat block */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 3,
              mt: 2.5,
              mb: 2.5,
              p: 2,
              borderRadius: 1,
              bgcolor: 'action.hover',
            }}
          >
            <Box sx={{ textAlign: 'center', minWidth: 88 }}>
              <Typography variant="h4" sx={{ lineHeight: 1 }}>
                {result.total_score}
                <Typography component="span" variant="body2" color="text.secondary">
                  {' '}
                  / 12
                </Typography>
              </Typography>
              <Typography variant="caption" color="text.secondary">
                rubric score
              </Typography>
            </Box>
            <Divider orientation="vertical" flexItem />
            <Box sx={{ flex: 1 }}>
              <Chip
                label={result.recommendation}
                color={RECOMMENDATION_COLOR[result.recommendation]}
                size="small"
                sx={{ mb: 1 }}
              />
              <Typography variant="body2">{result.executive_summary}</Typography>
            </Box>
          </Box>

          <Stack spacing={3} divider={<Divider />}>
            {/* Org intelligence */}
            <Box>
              <SectionHeading>Organizational Intelligence</SectionHeading>
              <Table size="small" sx={{ mt: 1 }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, width: '26%' }}>Signal</TableCell>
                    <TableCell sx={{ fontWeight: 600, width: '32%' }}>Finding</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Implication for Fieldtrip</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {result.org_intelligence.map((row) => (
                    <TableRow
                      key={row.signal}
                      sx={{ '&:last-child td': { borderBottom: 0 } }}
                    >
                      <TableCell sx={{ verticalAlign: 'top' }}>{row.signal}</TableCell>
                      <TableCell sx={{ verticalAlign: 'top' }}>{row.finding}</TableCell>
                      <TableCell sx={{ verticalAlign: 'top', color: 'text.secondary' }}>
                        {row.implication}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>

            {/* Rubric */}
            <Box>
              <SectionHeading>Rubric Scoring Breakdown</SectionHeading>
              <Table size="small" sx={{ mt: 1 }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, width: '24%' }}>Dimension</TableCell>
                    <TableCell sx={{ fontWeight: 600, width: '12%' }}>Score</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Rationale</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {result.rubric.map((row) => (
                    <TableRow key={row.dimension} sx={{ '&:last-child td': { borderBottom: 0 } }}>
                      <TableCell sx={{ verticalAlign: 'top' }}>{row.dimension}</TableCell>
                      <TableCell sx={{ verticalAlign: 'top' }}>{row.score} / 3</TableCell>
                      <TableCell sx={{ verticalAlign: 'top', color: 'text.secondary' }}>
                        {row.rationale}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>

            {/* Risks */}
            <Box>
              <SectionHeading>Strategic Risks &amp; Leadership Guardrails</SectionHeading>
              <Stack spacing={1.5} sx={{ mt: 1 }}>
                {result.risks.map((item) => (
                  <Box
                    key={item.risk}
                    sx={{ pl: 1.5, borderLeft: '3px solid', borderColor: 'divider' }}
                  >
                    <Typography variant="body2">
                      <Typography component="span" variant="body2" sx={{ fontWeight: 600 }}>
                        Risk:{' '}
                      </Typography>
                      {item.risk}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontWeight: 600 }}
                      >
                        Guardrail:{' '}
                      </Typography>
                      {item.guardrail}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>

            {/* Next steps */}
            <Box>
              <SectionHeading>Next Steps</SectionHeading>
              <Stack component="ol" spacing={0.75} sx={{ mt: 1, pl: 2.5, m: 0 }}>
                {result.next_steps.map((step) => (
                  <Typography key={step} component="li" variant="body2">
                    {step}
                  </Typography>
                ))}
              </Stack>
            </Box>
          </Stack>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: 'block', mt: 3, fontStyle: 'italic' }}
          >
            A recommendation to help your go/no-go decision, not a decision itself.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  if (rfp.ai_review_status === 'failed') {
    return (
      <Card variant="outlined" sx={{ mt: 3, borderColor: 'error.main' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h6">AI Review</Typography>
              <Typography color="error">Scoring failed.</Typography>
              {rfp.ai_review_error && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {rfp.ai_review_error}
                </Typography>
              )}
            </Box>
            <Button
              variant="contained"
              disabled={scoreRfp.isPending}
              onClick={() => scoreRfp.mutate()}
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
            <Typography variant="h6">AI Review</Typography>
            <Typography color="text.secondary">
              {hasDocument ? 'Not scored yet.' : 'Attach an RFP document to enable scoring.'}
            </Typography>
          </Box>
          <Button
            variant="contained"
            disabled={!hasDocument || scoreRfp.isPending}
            onClick={() => scoreRfp.mutate()}
          >
            Score
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
