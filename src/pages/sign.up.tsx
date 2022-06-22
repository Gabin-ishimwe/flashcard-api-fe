import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { gql, useMutation } from "@apollo/client";
import CircularProgress from "@mui/material/CircularProgress";
import { Link } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";

const SIGNIN_USER = gql`
  mutation ($input: userRegister!) {
    userRegister(input: $input) {
      firstName
      lastName
      email
      password
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

export default function SignUp() {
  const [firstName, setFirstName] = React.useState<string>("");
  const [lastName, setLastName] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [errorField, setErrorField] = React.useState<boolean>(false);
  const [helperText, setHelperText] = React.useState<string>("");
  const [signUpError, setSignUpError] = React.useState<string>("");
  const [open, setOpen] = React.useState(false);
  const [openSuccess, setOpenSuccess] = React.useState(false);
  const [userRegister, { data, loading, error }] = useMutation(SIGNIN_USER, {
    onError: (error) => {
      setSignUpError(error.message);
      setOpen(true);
    },
    onCompleted: () => {
      setSignUpError("User successfully registered");
      setOpenSuccess(true);
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
    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !password.trim()
    ) {
      setErrorField(true);
      setHelperText("All Fields are required");
      return;
    }
    userRegister({
      variables: {
        input: {
          firstName: dataForm.get("firstName"),
          lastName: dataForm.get("lastName"),
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
              severity={"error"}
              sx={{ width: "100%" }}
            >
              {signUpError}
            </Alert>
          </Snackbar>
          <Snackbar
            open={openSuccess}
            autoHideDuration={6000}
            onClose={handleClose}
          >
            <Alert
              onClose={handleClose}
              severity={"success"}
              sx={{ width: "100%" }}
            >
              {signUpError}
            </Alert>
          </Snackbar>
          <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                  }}
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  error={errorField}
                  helperText={helperText}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value);
                  }}
                  name="lastName"
                  autoComplete="family-name"
                  error={errorField}
                  helperText={helperText}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  name="email"
                  autoComplete="email"
                  error={errorField}
                  helperText={helperText}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  error={errorField}
                  helperText={helperText}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? (
                <CircularProgress sx={{ color: "white" }} />
              ) : (
                "Sign Up"
              )}
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link to="/login" style={{ textDecoration: "none" }}>
                  <Typography variant="body2" sx={{ color: "primary.main" }}>
                    Already have an account? Sign in
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
