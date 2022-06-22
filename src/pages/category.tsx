import {
  Box,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Paper,
} from "@mui/material";
import * as React from "react";
import Title from "./title";
import { gql, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";

const GET_SUBCATEGORIES = gql`
  query ($id: Int!) {
    readCategory(id: $id) {
      name
      subCategory {
        id
        name
      }
    }
  }
`;

type Params = {
  id: string;
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

const SubCategories = () => {
  const { id } = useParams<Params>();
  const navigate = useNavigate();
  const { data, loading, error } = useQuery(GET_SUBCATEGORIES, {
    variables: {
      id: parseInt(id as string),
    },
  });
  const click = (categoryId: number) => {
    navigate("/dashboard/categories/" + id + "/subcategory/" + categoryId);
  };
  // if (loading) return <CircularProgress />;
  return (
    <Box>
      <Title children="Sub categories" />
      {loading ? (
        <CircularProgress />
      ) : (
        <List>
          <Grid container spacing={2}>
            {data.readCategory.subCategory.map((category: Category) => (
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

export default SubCategories;
