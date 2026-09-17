import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import type { Rfp } from './types';

interface DeleteRfpDialogProps {
  rfp: Rfp;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
}

export function DeleteRfpDialog({ rfp, open, onClose, onConfirm, isPending }: DeleteRfpDialogProps) {
  const [confirmText, setConfirmText] = useState('');

  const handleClose = () => {
    setConfirmText('');
    onClose();
  };

  const isMatch = confirmText === rfp.title;

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle>Delete RFP</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>
          This permanently deletes <strong>{rfp.title}</strong>, including its AI Review and
          attached document link. This cannot be undone.
        </DialogContentText>
        <Typography variant="body2" sx={{ mb: 1 }}>
          Type the RFP title to confirm:
        </Typography>
        <TextField
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          placeholder={rfp.title}
          fullWidth
          size="small"
          autoFocus
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button color="error" variant="contained" disabled={!isMatch || isPending} onClick={onConfirm}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
