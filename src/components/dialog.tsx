import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

type Props = {
  dialog: boolean;
  closeDialog: () => void;
  action: () => void;
};

export default function AlertDialogSlide({
  dialog,
  action,
  closeDialog,
}: Props) {
  // const [open, setOpen] = React.useState(false);

  // const handleClickOpen = () => {
  //   setOpen(true);
  // };

  // const handleClose = () => {
  //   setOpen(false);
  // };

  return (
    <div>
      <Dialog
        open={dialog}
        TransitionComponent={Transition}
        keepMounted
        onClose={closeDialog}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>Delete Flashcard</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Are you sure you want to delete this Flashcard?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>No</Button>
          <Button onClick={action}>Yes</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
