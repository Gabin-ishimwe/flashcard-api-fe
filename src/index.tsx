import React from "react";
import ReactDOM from "react-dom/client";
import App from "./routes/app";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  uri: "https://flashcard-api-production.up.railway.app",
});

interface Token {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  token: string;
}

const authLink = setContext((_, { headers }): Object => {
  const token: Token | null = localStorage.getItem("auth")
    ? JSON.parse(localStorage.getItem("auth") as string)
    : null;
  return {
    headers: {
      ...headers,
      authorization: token?.token ? token.token : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>
);
