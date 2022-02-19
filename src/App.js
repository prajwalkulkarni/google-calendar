import "./styles.css";
import NavBar from "./components/NavBar";
import ViewWrapper from "./components/ViewWrapper";
import React from "react";

export default function App() {
  return (
    <React.Fragment>
      <NavBar />
      <ViewWrapper />
    </React.Fragment>
  );
}
