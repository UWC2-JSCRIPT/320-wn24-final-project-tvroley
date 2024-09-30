import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./Home";
import CardCollection from "./CardCollection";
import EditCard from "./EditCard";
import Nav from "./Nav";
import AddCard from "./AddCard";
import AddCardToCollection from "./AddCardToCollection";
import AllCollections from "./AllCollections";
import ManageCollections from "./ManageCollections";
import DeleteCard from "./DeleteCard";
import FindAnyCard from "./FindAnyCard";
import SignUp from "./SignUp";
import Account from "./Account";

function App() {
  return (
    <div>
      <h1>Card Collections</h1>
      <p>version: {import.meta.env.VITE_APP_VERSION}</p>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="collection" element={<CardCollection />} />
        <Route path="collection/:id" element={<EditCard />} />
        <Route path="collection/add" element={<AddCard />} />
        <Route path="collection/manage" element={<ManageCollections />} />
        <Route path="allcollections" element={<AllCollections />} />
        <Route path="findanycard" element={<FindAnyCard />} />
        <Route path="signup" element={<SignUp />} />
        <Route
          path="collection/addtocollection/:cardid"
          element={<AddCardToCollection />}
        />
        <Route path="collection/deletecard/:cardid" element={<DeleteCard />} />
        <Route path="account" element={<Account />} />
      </Routes>
    </div>
  );
}

export default App;
