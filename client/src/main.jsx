import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import CreateTrip from "./create-trip/index.jsx";
import { Toaster } from "./components/ui/toaster.jsx";
import Hero from "./components/custom/Hero.jsx";
import Signin from "./components/custom/Signin.jsx";
import Signup from "./components/custom/Signup.jsx";
import { Provider } from "react-redux";
import { persistor, store } from "./redux/store.js";
import { PersistGate } from "redux-persist/integration/react";
import ViewTrip from "./view-trip/[tripId]/index.jsx";
import MyTrip from "./my-trip/index.jsx";

const router = createBrowserRouter([
  {
    element: <App />, 
    children: [
      {
        path: 'view-trip/:tripId',
        element: <ViewTrip />
      },
      {
        path: "/create-trip",
        element: <CreateTrip />,
      },
      {
        path: "/my-trip",
        element: <MyTrip />
      }
    ],
  },
  {
    path: "/",
    element: <Hero />,
  },
  {
    path: "/sign-in",
    element: <Signin />,
  },
  {
    path: "/sign-up",
    element: <Signup />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Toaster />
      <RouterProvider router={router} />
    </PersistGate>
  </Provider>
);
