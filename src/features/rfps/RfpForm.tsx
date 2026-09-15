import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormLabel,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  RFP_STATUSES,
  RFP_STATUS_LABELS,
  WORK_TYPES,
  WORK_TYPE_LABELS,
  createRfpSchema,
} from './types';
import type { CreateRfpInput } from './types';
import { useProfiles } from './useRfps';

interface RfpFormProps {
  defaultValues: CreateRfpInput;
  defaultOwnerId: string;
  submitLabel: string;
  pendingLabel: string;
  isPending: boolean;
  isError: boolean;
  onSubmit: (input: CreateRfpInput & { owner_id: string | null }) => Promise<void>;
}

export function RfpForm({
  defaultValues,
  defaultOwnerId,
  submitLabel,
  pendingLabel,
  isPending,
  isError,
  onSubmit,
}: RfpFormProps) {
  const { data: profiles } = useProfiles();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateRfpInput>({
    resolver: zodResolver(createRfpSchema),
    defaultValues,
  });

  const [ownerId, setOwnerId] = useState<string>(defaultOwnerId);

  const submit = handleSubmit(async (values) => {
    await onSubmit({ ...values, owner_id: ownerId || null });
  });

  return (
    <Box component="form" onSubmit={submit}>
      <Stack spacing={2}>
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Title"
              error={!!errors.title}
              helperText={errors.title?.message}
              fullWidth
              required
            />
          )}
        />
        <Controller
          name="organization_name"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Organization Name"
              error={!!errors.organization_name}
              helperText={errors.organization_name?.message}
              fullWidth
              required
            />
          )}
        />
        <Controller
          name="due_date"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Due Date"
              type="date"
              slotProps={{ inputLabel: { shrink: true } }}
              fullWidth
            />
          )}
        />
        <TextField
          select
          label="Owner"
          value={ownerId}
          onChange={(e) => setOwnerId(e.target.value)}
          fullWidth
        >
          {profiles?.map((profile) => (
            <MenuItem key={profile.id} value={profile.id}>
              {profile.full_name ?? profile.email}
            </MenuItem>
          ))}
        </TextField>
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <TextField {...field} select label="Status" fullWidth>
              {RFP_STATUSES.map((status) => (
                <MenuItem key={status} value={status}>
                  {RFP_STATUS_LABELS[status]}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
        <Controller
          name="work_types"
          control={control}
          render={({ field }) => (
            <Box>
              <FormLabel component="legend">Work Type</FormLabel>
              <FormGroup row>
                {WORK_TYPES.map((type) => (
                  <FormControlLabel
                    key={type}
                    control={
                      <Checkbox
                        checked={field.value.includes(type)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            field.onChange([...field.value, type]);
                          } else {
                            field.onChange(field.value.filter((t) => t !== type));
                          }
                        }}
                      />
                    }
                    label={WORK_TYPE_LABELS[type]}
                  />
                ))}
              </FormGroup>
            </Box>
          )}
        />
        <Button type="submit" variant="contained" disabled={isPending}>
          {isPending ? pendingLabel : submitLabel}
        </Button>
        {isError && <Typography color="error">Something went wrong. Please try again.</Typography>}
      </Stack>
    </Box>
  );
}
