import * as React from "react";
import Title from "./title";
import {
  Box,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Button,
  Paper,
  Modal,
  Typography,
  TextField,
} from "@mui/material";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";

const CATEGORIES = gql`
  query {
    categories {
      id
      name
    }
  }
`;

const CREATE_CATEGORY = gql`
  mutation ($input: category!) {
    addCategory(input: $input) {
      id
      name
    }
  }
`;

export interface Category {
  id?: number;
  name?: string;
}
const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const Categories = () => {
  const [name, setName] = React.useState<string>("");
  const [errorField, setErrorField] = React.useState<boolean>(false);
  const [helperText, setHelperText] = React.useState<string>("");
  const [categoriesError, setCategoriesError] = React.useState<string>("");
  const [openAlert, setOpenAlert] = React.useState(false);
  const navigate = useNavigate();
  const { data, loading, error, refetch } = useQuery(CATEGORIES, {
    onError: (error) => {
      setCategoriesError(error.message);
      setOpenAlert(true);
    },
  });
  const [addCategory, res] = useMutation(CREATE_CATEGORY, {
    variables: {
      input: {
        name,
      },
    },
    onError: (error) => {
      setCategoriesError(error.message);
      setOpenAlert(true);
    },
  });
  const handleCloseAlert = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenAlert(false);
  };
  const [open, setOpen] = React.useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const click = (id: any) => {
    navigate("/dashboard/categories/" + id);
  };
  const add = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorField(true);
      setHelperText("Category name is required");
      return;
    }
    await addCategory();
    setName("");
    refetch();
  };
  // if (loading) return <CircularProgress />;
  return (
    <Box>
      <Title children="Categories" />
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
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        sx={{ textTransform: "none", my: 2, fontSize: "16px" }}
        onClick={handleOpen}
      >
        Create category
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Category
          </Typography>
          <TextField
            id="outlined-basic"
            label="Category"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errorField}
            helperText={helperText}
          />
          <Button
            variant="contained"
            sx={{ textTransform: "none", height: 55, mx: 2 }}
            onClick={(e) => add(e)}
          >
            {res.loading ? <CircularProgress sx={{ color: "white" }} /> : "Add"}
          </Button>
        </Box>
      </Modal>
      {loading ? (
        <CircularProgress sx={{ display: "block" }} />
      ) : (
        <List>
          <Grid container spacing={2}>
            {data?.categories.map((category: Category) => (
              <Grid item md={3} key={category.id}>
                <Paper elevation={3}>
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => click(category.id)}>
                      <ListItemText primary={category.name} />
                    </ListItemButton>
                  </ListItem>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </List>
      )}
    </Box>
  );
};

export default Categories;
