import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import flashCard from "../assets/flash-cards.webp";
import { Link, useNavigate } from "react-router-dom";

const theme = createTheme();

export default function Home() {
  const navigate = useNavigate();
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
  };

  const dashboard = () => {
    if (localStorage.getItem("auth")) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: `url(${flashCard})`,
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
            }}
          >
            <Typography
              variant="h2"
              sx={{ fontWeight: 700, color: "primary.main" }}
            >
              Rise to your Challenge.
            </Typography>
            <Typography variant="h5" sx={{ my: 5 }}>
              Flashcards for serious learners.
            </Typography>
            <Button
              variant="contained"
              sx={{
                width: 220,
                height: 70,
                textTransform: "none",
              }}
              onClick={dashboard}
            >
              Find Flashcard
            </Button>
            <Grid container my={3}>
              <Grid item xs>
                <Link to="/login" style={{ textDecoration: "none" }}>
                  <Typography variant="body2" sx={{ color: "primary.main" }}>
                    Already have an account? Sign in
                  </Typography>
                </Link>
              </Grid>
              <Grid item>
                <Link to="/signup" style={{ textDecoration: "none" }}>
                  <Typography variant="body2" sx={{ color: "primary.main" }}>
                    {"Don't have an account? Sign Up"}
                  </Typography>
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
