import {
  Card,
  CardContent,
  Typography,
  CardActionArea,
  Box,
} from "@mui/material";
import * as React from "react";
import Title from "./title";
import ReactCardFlip from "react-card-flip";

type Props = {
  title: string;
  question: string;
  answer: string;
  id: number;
};

const CardDisplay = ({ title, question, answer, id }: Props) => {
  const [flipped, setFlipped] = React.useState<boolean>(false);
  const handleClick = () => {
    setFlipped(!flipped);
  };
  return (
    <React.Fragment>
      <ReactCardFlip isFlipped={flipped} flipDirection={"horizontal"}>
        <CardActionArea onClick={handleClick}>
          <Card sx={{ width: "100%" }}>
            <CardContent>
              <Title children={title} />
              <Typography>{question}</Typography>
            </CardContent>
          </Card>
        </CardActionArea>
        <CardActionArea onClick={handleClick}>
          <Card sx={{ width: "100%" }}>
            <CardContent>
              <Typography>{answer}</Typography>
            </CardContent>
          </Card>
        </CardActionArea>
      </ReactCardFlip>
    </React.Fragment>
  );
};
export default CardDisplay;
