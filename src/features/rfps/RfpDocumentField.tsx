import { zodResolver } from '@hookform/resolvers/zod';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import { Box, Button, Link, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import type { Rfp } from './types';
import { useAttachRfpDocument } from './useRfps';

const attachDocumentSchema = z.object({
  drive_url: z
    .string()
    .trim()
    .min(1, 'Drive link is required')
    .url('Must be a valid URL')
    .refine(
      (url) => /^https:\/\/(drive|docs)\.google\.com\//.test(url),
      'Must be a Google Drive or Docs link',
    ),
});

type AttachDocumentInput = z.infer<typeof attachDocumentSchema>;

export function RfpDocumentField({ rfp }: { rfp: Rfp }) {
  const [isEditing, setIsEditing] = useState(false);
  const attachDocument = useAttachRfpDocument(rfp.id);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AttachDocumentInput>({
    resolver: zodResolver(attachDocumentSchema),
    defaultValues: { drive_url: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    await attachDocument.mutateAsync(values);
    reset();
    setIsEditing(false);
  });

  if (isEditing || !rfp.document_drive_url) {
    return (
      <Box>
        <Typography variant="caption" color="text.secondary">
          RFP Document
        </Typography>
        <Box component="form" onSubmit={onSubmit} sx={{ mt: 0.5 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <Controller
              name="drive_url"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Google Drive Link"
                  size="small"
                  error={!!errors.drive_url}
                  helperText={errors.drive_url?.message}
                  fullWidth
                />
              )}
            />
            <Button
              type="submit"
              variant="outlined"
              disabled={attachDocument.isPending}
              sx={{ flexShrink: 0 }}
            >
              Attach
            </Button>
          </Stack>
          {attachDocument.isError && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              Failed to attach document. Please try again.
            </Typography>
          )}
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="caption" color="text.secondary">
        RFP Document
      </Typography>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mt: 0.5 }}>
        <InsertDriveFileOutlinedIcon fontSize="small" color="action" />
        <Link href={rfp.document_drive_url} target="_blank" rel="noopener noreferrer">
          RFP Document
        </Link>
        <Button size="small" onClick={() => setIsEditing(true)} sx={{ ml: 1 }}>
          Replace
        </Button>
      </Stack>
    </Box>
  );
}
