import { Box, Grid } from "@mui/material";
import Title from "./title";
import { gql, useQuery } from "@apollo/client";
import CircularProgress from "@mui/material/CircularProgress";
import { useParams } from "react-router-dom";
import CardDisplay from "./card";

const GET_FLASHCARDS = gql`
  query ($id: Int!) {
    readSubCategory(id: $id) {
      id
      name
      flashCards {
        id
        title
        question
        answer
      }
    }
  }
`;

type Category = {
  id: number;
  title: string;
  question: string;
  answer: string;
};

const SubCategory = () => {
  const { subCategoryId } = useParams();
  const { data, loading, error } = useQuery(GET_FLASHCARDS, {
    variables: {
      id: parseInt(subCategoryId as string),
    },
  });
  // if (loading) return <CircularProgress />;
  return (
    <Box>
      <Title children="Flash cards" />
      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={2}>
          {data.readSubCategory.flashCards.map((category: Category) => (
            <Grid item md={4}>
              <CardDisplay
                title={category.title}
                question={category.question}
                answer={category.answer}
                id={category.id}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default SubCategory;
