import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Link, useNavigate } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

const USER_SIGNIN = gql`
  mutation ($input: userLogin!) {
    userLogin(input: $input) {
      firstName
      lastName
      email
      token
    }
  }
`;

const theme = createTheme();

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [errorField, setErrorField] = React.useState(false);
  const [helperText, setHelperText] = React.useState("");
  const [signUpError, setSignUpError] = React.useState<string>("");
  const [open, setOpen] = React.useState(false);
  const [userSignIn, { data, loading, error }] = useMutation(USER_SIGNIN, {
    onError: (error) => {
      setSignUpError(error.message);
      setOpen(true);
    },
    onCompleted: (userSignIn) => {
      localStorage.setItem("auth", JSON.stringify(userSignIn.userLogin));
      navigate("/dashboard");
    },
  });

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const dataForm = new FormData(event.currentTarget);
    if (!email.trim() || !password.trim()) {
      setErrorField(true);
      setHelperText("All Fields are required");
      return;
    }
    userSignIn({
      variables: {
        input: {
          email: dataForm.get("email"),
          password: dataForm.get("password"),
        },
      },
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert
              onClose={handleClose}
              severity="error"
              sx={{ width: "100%" }}
            >
              {signUpError}
            </Alert>
          </Snackbar>
          <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              error={errorField}
              helperText={helperText}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              error={errorField}
              helperText={helperText}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? (
                <CircularProgress sx={{ color: "white" }} />
              ) : (
                "Sign In"
              )}
            </Button>
            <Grid container>
              <Grid item>
                <Link to="/signup" style={{ textDecoration: "none" }}>
                  <Typography variant="body2" sx={{ color: "primary.main" }}>
                    {"Don't have an account? Sign Up"}
                  </Typography>
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
