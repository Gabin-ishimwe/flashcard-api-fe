import {
  Box,
  Grid,
  Modal,
  Typography,
  TextField,
  Button,
  InputLabel,
  MenuItem,
  FormControl,
  FormHelperText,
  IconButton,
} from "@mui/material";
import * as React from "react";
import Title from "./title";
import { gql, useMutation, useQuery } from "@apollo/client";
import CircularProgress from "@mui/material/CircularProgress";
import { useParams, useLocation } from "react-router-dom";
import CardDisplay from "./card";
import AddIcon from "@mui/icons-material/Add";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import UpdateModal from "../components/modal";
import AlertDialogSlide from "../components/dialog";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import { styled, alpha } from "@mui/material/styles";

const DELETE_FLASHCARD = gql`
  mutation ($id: Int!) {
    deleteFlashCard(id: $id) {
      id
      title
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

const CREATE_FLASHCARD = gql`
  mutation ($input: flashCard) {
    addFlashCard(input: $input) {
      id
      title
      question
      answer
    }
  }
`;

const SUBCATEGORIES = gql`
  query {
    subCategories {
      id
      name
    }
  }
`;

type Category = {
  id: number;
  name: string;
};

type FlashCard = {
  id: number;
  title: string;
  question: string;
  answer: string;
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

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.primary.main, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.light, 0.25),
  },
  marginLeft: 0,
  [theme.breakpoints.up("sm")]: {
    width: "max-content",
  },
  marginBottom: "20px",
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "max-content",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AllFlashCards = () => {
  const { subCategoryId } = useParams();
  const location = useLocation();
  const [title, setTitle] = React.useState("");
  const [question, setQuestion] = React.useState("");
  const [answer, setAnswer] = React.useState("");
  const [categoriesError, setCategoriesError] = React.useState<string>("");
  const [openAlert, setOpenAlert] = React.useState(false);
  const [openAlertSucess, setOpenAlertSucess] = React.useState(false);
  const [errorField, setErrorField] = React.useState<boolean>(false);
  const [helperText, setHelperText] = React.useState<string>("");
  const [subCategory, setSubCategory] = React.useState("");
  const [openModal, setOpenModal] = React.useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [cardToDelete, setCardToDelete] = React.useState(0);
  const [order, setOrder] = React.useState("asc");
  const [search, setSearch] = React.useState("");
  const [updateData, setUpdateData] = React.useState<FlashCard>({
    id: 0,
    title: "",
    question: "",
    answer: "",
  });

  const handleOrder = (event: SelectChangeEvent) => {
    setOrder(event.target.value);
  };

  const handleChange = (event: SelectChangeEvent) => {
    setSubCategory(event.target.value as string);
  };
  const handleOpenDialog = (id: number) => {
    setOpenDialog(true);
    setCardToDelete(id);
  };
  const closeDialog = () => {
    setOpenDialog(false);
  };
  const [flipped, setFlipped] = React.useState<boolean>(false);
  const { data, loading, error, refetch } = useQuery(GET_FLASHCARDS, {
    variables: {
      input: {
        order: order,
        field: search,
      },
    },
    onError: (error) => {
      setCategoriesError(error.message);
      setOpenAlert(true);
    },
  });
  const resSubCategories = useQuery(SUBCATEGORIES, {
    onError: (error) => {
      setCategoriesError(error.message);
      setOpenAlert(true);
    },
  });
  const [deleteFlashcard, resDeleteFlashcard] = useMutation(DELETE_FLASHCARD, {
    onCompleted: () => {
      setCategoriesError("Flashcard deleted");
      setOpenAlertSucess(true);
    },
  });
  const [addFlashcard, resFlashCard] = useMutation(CREATE_FLASHCARD, {
    variables: {
      input: {
        title,
        question,
        answer,
        subCategoryId: parseInt(subCategory),
      },
    },
    onError: (error) => {
      setCategoriesError(error.message);
      setOpenAlert(true);
    },
    onCompleted: () => {
      setCategoriesError("Flashcard created");
      setOpenAlertSucess(true);
    },
  });
  const [open, setOpen] = React.useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleClick = () => {
    setFlipped(!flipped);
  };
  const add = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    if (!title.trim() || !question.trim() || !answer.trim() || !subCategory) {
      setErrorField(true);
      setHelperText("All fields are required");
      return;
    }
    await addFlashcard();
    setTitle("");
    setQuestion("");
    setAnswer("");
    setSubCategory("");
    refetch();
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

  const updateCard = async (data: FlashCard) => {
    setUpdateData(data);
    setOpenModal(true);
  };

  const onClose = () => {
    setOpenModal(false);
  };

  const deleteCard = async (id: number) => {
    setOpenDialog(false);
    await deleteFlashcard({
      variables: {
        id,
      },
    });
    refetch();
  };
  React.useLayoutEffect(() => {
    console.log("useeffect......");
    refetch();
  }, [order, search]);
  // if (loading) return <CircularProgress />;
  return (
    <Box>
      <Box
        sx={{
          my: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Title children="Flash cards" />
        <FormControl>
          <InputLabel id="demo-simple-select-label">Order by</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={order}
            label="Order by"
            onChange={handleOrder}
          >
            <MenuItem value={"asc"}>Ascending</MenuItem>
            <MenuItem value={"desc"}>Descending</MenuItem>
          </Select>
        </FormControl>
      </Box>
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
      {location.pathname === "/dashboard/flashCards" && (
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            textTransform: "none",
            my: 2,
            fontSize: "16px",
            marginTop: "-20px",
          }}
          onClick={handleOpen}
        >
          Create Flashcard
        </Button>
      )}

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Flashcard
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
          <FormControl
            error={errorField}
            sx={{
              my: 2,
            }}
            fullWidth
          >
            <InputLabel id="demo-simple-select-error-label">
              Subcategory
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={subCategory}
              label="Category"
              onChange={handleChange}
            >
              {resSubCategories.loading ? (
                <MenuItem value={""}>Loading...</MenuItem>
              ) : (
                resSubCategories.data?.subCategories.map(
                  (category: Category) => (
                    <MenuItem value={category.id} key={category.id}>
                      {category.name}
                    </MenuItem>
                  )
                )
              )}
            </Select>
            <FormHelperText>{helperText}</FormHelperText>
          </FormControl>
          <Button
            variant="contained"
            sx={{ textTransform: "none", height: 55, fontSize: 18 }}
            onClick={(e) => add(e)}
            fullWidth
          >
            {resFlashCard.loading ? (
              <CircularProgress sx={{ color: "white" }} />
            ) : (
              "Add"
            )}
          </Button>
        </Box>
      </Modal>
      <Search>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          placeholder="Search by title..."
          inputProps={{ "aria-label": "search" }}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
      </Search>
      {loading ? (
        <CircularProgress sx={{ display: "block" }} />
      ) : (
        <Grid container spacing={2}>
          {data?.flashCards.map((flashcard: FlashCard, index: number) => (
            <Grid item md={4} key={index}>
              <Box
                sx={{
                  display: "flex",
                  maxWidth: "100%",
                }}
              >
                <CardDisplay
                  title={flashcard.title}
                  question={flashcard.question}
                  answer={flashcard.answer}
                  id={flashcard.id}
                />
                {location.pathname === "/dashboard/flashCards" && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      flexDirection: "column",
                    }}
                  >
                    <IconButton onClick={() => updateCard(flashcard)}>
                      <EditIcon sx={{ color: "primary.main" }} />
                    </IconButton>
                    <IconButton onClick={() => handleOpenDialog(flashcard.id)}>
                      <DeleteIcon sx={{ color: "primary.main" }} />
                    </IconButton>
                  </Box>
                )}
              </Box>
            </Grid>
          ))}
          <UpdateModal
            input={updateData}
            openModal={openModal}
            onClose={onClose}
          />
          <AlertDialogSlide
            dialog={openDialog}
            closeDialog={closeDialog}
            action={() => deleteCard(cardToDelete)}
          />
        </Grid>
      )}
    </Box>
  );
};

export default AllFlashCards;
