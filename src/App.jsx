import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./Home";
import CardCollection from "./CardCollection";
import EditCard from "./EditCard";
import Nav from "./Nav";
import AddCard from "./AddCard";

function App() {
  return (
    <div>
      <h1>My Cards</h1>
      <p>version: {import.meta.env.VITE_APP_VERSION}</p>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="collection" element={<CardCollection />} />
        <Route path="collection/:id" element={<EditCard />} />
        <Route path="collection/add" element={<AddCard />} />
      </Routes>
    </div>
  );
}

export default App;
