import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Header from "./components/custom/Header";
import { useSelector } from "react-redux";

const App = () => {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <>
      <Header />
      {currentUser ? <Outlet /> : <Navigate to={"/sign-in"} />}
    </>
  );
};

export default App;
