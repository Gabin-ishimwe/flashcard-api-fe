import {
  Box,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Paper,
  Modal,
  Typography,
  TextField,
  Button,
  InputLabel,
  MenuItem,
  FormControl,
  FormHelperText,
} from "@mui/material";
import * as React from "react";
import Title from "./title";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";

const SUBCATEGORIES = gql`
  query {
    subCategories {
      id
      name
    }
  }
`;

const ADD_SUBCATEGORIES = gql`
  mutation ($input: subCategory!) {
    addSubCategory(input: $input) {
      id
      name
    }
  }
`;

const CATEGORIES = gql`
  query {
    categories {
      id
      name
    }
  }
`;

type Params = {
  id?: string;
};

type SubCategory = {
  id: number;
  name: string;
};

type Category = {
  id: number;
  name: string;
  subCategory: SubCategory[];
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

const AllSubCategory = () => {
  const { id } = useParams<Params>();
  const [name, setName] = React.useState<string>("");
  const [errorField, setErrorField] = React.useState<boolean>(false);
  const [helperText, setHelperText] = React.useState<string>("");
  const [category, setCategory] = React.useState("");
  const [categoriesError, setCategoriesError] = React.useState<string>("");
  const [openAlert, setOpenAlert] = React.useState(false);
  const handleChange = (event: SelectChangeEvent) => {
    setCategory(event.target.value as string);
  };
  const navigate = useNavigate();
  const resCategories = useQuery(CATEGORIES);
  const { data, loading, error, refetch } = useQuery(SUBCATEGORIES, {
    onError: (error) => {
      setCategoriesError(error.message);
      setOpenAlert(true);
    },
  });
  const [addSubCategory, res] = useMutation(ADD_SUBCATEGORIES, {
    variables: {
      input: {
        name,
        categoryId: parseInt(category),
      },
    },
    onError: (error) => {
      setCategoriesError(error.message);
      setOpenAlert(true);
    },
  });
  const [open, setOpen] = React.useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const click = (categoryId: number) => {
    navigate("/dashboard/subCategories/" + categoryId);
  };
  const handleCloseAlert = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenAlert(false);
  };
  const add = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    if (!name.trim() || !category) {
      setErrorField(true);
      setHelperText("All fields are required");
      return;
    }
    await addSubCategory();
    setName("");
    setCategory("");
    refetch();
  };
  // if (loading) return <CircularProgress />;
  return (
    <Box>
      <Title children="Sub categories" />
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
        Create Sub Category
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Sub Category
          </Typography>
          <TextField
            id="outlined-basic"
            label="Name"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
              Category
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={category}
              label="Category"
              onChange={handleChange}
            >
              {resCategories.loading ? (
                <MenuItem value={""}>Loading...</MenuItem>
              ) : (
                resCategories.data?.categories.map((category: Category) => (
                  <MenuItem value={category.id} key={category.id}>
                    {category.name}
                  </MenuItem>
                ))
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
            {res.loading ? <CircularProgress sx={{ color: "white" }} /> : "Add"}
          </Button>
        </Box>
      </Modal>
      {loading ? (
        <CircularProgress sx={{ display: "block" }} />
      ) : (
        <List>
          <Grid container spacing={2}>
            {data?.subCategories.map((category: Category) => (
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

export default AllSubCategory;
