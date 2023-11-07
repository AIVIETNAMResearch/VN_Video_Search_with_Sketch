import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';


const LogoutDialog = ({ open, handleClose, handleLogout, show}) => {

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle >Logout</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to logout?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} >
          Cancel
        </Button>
        <Button onClick={handleLogout}>
          Logout
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LogoutDialog;
