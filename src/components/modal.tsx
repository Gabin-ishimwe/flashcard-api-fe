import { gql, useMutation, useQuery } from "@apollo/client";
import Category from "@mui/icons-material/Category";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
  Modal,
  Snackbar,
} from "@mui/material";
import * as React from "react";
import MuiAlert, { AlertProps } from "@mui/material/Alert";

const SUBCATEGORIES = gql`
  query {
    subCategories {
      id
      name
    }
  }
`;

const GET_FLASHCARDS = gql`
  query ($input: sortBy) {
    flashCards(input: $input) {
      id
      title
      question
      answer
    }
  }
`;

const UPDATE_FLASHCARD = gql`
  mutation ($input: updateFlashCard) {
    updateFlashCard(input: $input) {
      id
      title
      question
      answer
    }
  }
`;

type Category = {
  id: number;
  name: string;
};
const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
};
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

type Input = {
  id: number;
  title: string;
  question: string;
  answer: string;
};

type Props = {
  input: Input;
  openModal: boolean;
  onClose: () => void;
};

const UpdateModal = ({ input, openModal, onClose }: Props) => {
  const [title, setTitle] = React.useState(input.title);
  const [question, setQuestion] = React.useState(input.question);
  const [answer, setAnswer] = React.useState(input.answer);
  const [openAlert, setOpenAlert] = React.useState(false);
  const [errorField, setErrorField] = React.useState<boolean>(false);
  const [helperText, setHelperText] = React.useState<string>("");
  const [categoriesError, setCategoriesError] = React.useState<string>("");
  const [openAlertSucess, setOpenAlertSucess] = React.useState(false);
  const { data, loading, error, refetch } = useQuery(GET_FLASHCARDS, {
    onError: (error) => {
      setCategoriesError(error.message);
      setOpenAlert(true);
    },
    variables: {
      input: {
        order: "asc",
      },
    },
  });
  const [updateFlashcard, resUpdateFlashCard] = useMutation(UPDATE_FLASHCARD, {
    onError: (error) => {
      setCategoriesError(error.message);
      setOpenAlert(true);
    },
    variables: {
      input: {
        id: input.id,
        title,
        question,
        answer,
      },
    },
    onCompleted: () => {
      refetch();
      setCategoriesError("Flashcard updated");
      setOpenAlertSucess(true);
    },
  });
  const update = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    if (!title.trim() || !question.trim() || !answer.trim()) {
      setErrorField(true);
      setHelperText("All fields are required");
      return;
    }
    updateFlashcard();
  };
  const handleCloseAlert = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenAlert(false);
    setOpenAlertSucess(false);
  };
  React.useEffect(() => {
    setTitle(input.title);
    setQuestion(input.question);
    setAnswer(input.answer);
  }, [input]);
  return (
    <Box>
      <Snackbar
        open={openAlert}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
      >
        <Alert
          onClose={handleCloseAlert}
          severity="error"
          sx={{ width: "100%" }}
        >
          {categoriesError}
        </Alert>
      </Snackbar>
      <Snackbar
        open={openAlertSucess}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
      >
        <Alert
          onClose={handleCloseAlert}
          severity="success"
          sx={{ width: "100%" }}
        >
          {categoriesError}
        </Alert>
      </Snackbar>
      <Modal
        open={openModal}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Update Flashcard
          </Typography>
          <TextField
            id="outlined-basic"
            label="Title"
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={errorField}
            helperText={helperText}
          />
          <TextField
            id="outlined-basic"
            label="Question"
            variant="outlined"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            error={errorField}
            helperText={helperText}
            sx={{
              my: 2,
            }}
          />
          <TextField
            id="outlined-basic"
            label="Answer"
            variant="outlined"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            error={errorField}
            helperText={helperText}
          />
          <Button
            variant="contained"
            sx={{ textTransform: "none", height: 55, fontSize: 18, my: 2 }}
            onClick={(e) => update(e)}
            fullWidth
          >
            {resUpdateFlashCard.loading ? (
              <CircularProgress sx={{ color: "white" }} />
            ) : (
              "Add"
            )}
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default UpdateModal;
