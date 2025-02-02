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
import DeleteAccount from "./DeleteAccount";
import Collectors from "./Collectors";

function App() {
  return (
    <div>
      <h1>Card Show Off</h1>
      <p>version: {import.meta.env.VITE_APP_VERSION}</p>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="collection" element={<CardCollection />} />
        <Route path="collection/:id" element={<EditCard />} />
        <Route path="collection/add" element={<AddCard />} />
        <Route path="collection/manage" element={<ManageCollections />} />
        <Route path="allcollections" element={<AllCollections />} />
        <Route path="collectors" element={<Collectors />} />
        <Route path="signup" element={<SignUp />} />
        <Route
          path="collection/addtocollection/:cardid"
          element={<AddCardToCollection />}
        />
        <Route path="collection/deletecard/:cardid" element={<DeleteCard />} />
        <Route path="account" element={<Account />} />
        <Route path="deleteaccount" element={<DeleteAccount />} />
      </Routes>
    </div>
  );
}

export default App;
