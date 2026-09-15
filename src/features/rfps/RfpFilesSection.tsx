import { zodResolver } from '@hookform/resolvers/zod';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { useAddRfpFile, useDeleteRfpFile, useRfpFiles } from './useRfpFiles';

const addFileSchema = z.object({
  drive_url: z
    .string()
    .trim()
    .min(1, 'Drive link is required')
    .url('Must be a valid URL')
    .refine(
      (url) => /^https:\/\/(drive|docs)\.google\.com\//.test(url),
      'Must be a Google Drive or Docs link',
    ),
  file_name: z.string().trim().min(1, 'File name is required'),
});

type AddFileInput = z.infer<typeof addFileSchema>;

export function RfpFilesSection({ rfpId }: { rfpId: string }) {
  const { data: files, isLoading } = useRfpFiles(rfpId);
  const addFile = useAddRfpFile(rfpId);
  const deleteFile = useDeleteRfpFile(rfpId);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddFileInput>({
    resolver: zodResolver(addFileSchema),
    defaultValues: { drive_url: '', file_name: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    await addFile.mutateAsync(values);
    reset();
  });

  return (
    <Card variant="outlined" sx={{ mt: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Reference Files
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Link to source documents stored in Google Drive for reference throughout the pursuit.
        </Typography>

        {!isLoading && files && files.length > 0 && (
          <List disablePadding>
            {files.map((file) => (
              <ListItem
                key={file.id}
                divider
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="remove"
                    onClick={() => deleteFile.mutate(file.id)}
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                }
              >
                <ListItemIcon>
                  <InsertDriveFileOutlinedIcon />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Link href={file.drive_url} target="_blank" rel="noopener noreferrer">
                      {file.file_name}
                    </Link>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}

        {!isLoading && files?.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            No files linked yet.
          </Typography>
        )}

        <Box component="form" onSubmit={onSubmit} sx={{ mt: 2 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <Controller
              name="file_name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="File Name"
                  size="small"
                  error={!!errors.file_name}
                  helperText={errors.file_name?.message}
                  fullWidth
                />
              )}
            />
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
            <Button type="submit" variant="outlined" disabled={addFile.isPending} sx={{ flexShrink: 0 }}>
              Add
            </Button>
          </Stack>
          {addFile.isError && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              Failed to add file. Please try again.
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
