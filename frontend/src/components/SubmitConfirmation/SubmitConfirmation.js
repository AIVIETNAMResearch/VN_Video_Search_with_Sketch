import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';


const SubmitConfirmationPopup = ({ open, handleClose, handleSubmit, show}) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle >Danger Zone</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to submit?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} >
          Cancel
        </Button>
        <Button onClick={handleSubmit}>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SubmitConfirmationPopup;
