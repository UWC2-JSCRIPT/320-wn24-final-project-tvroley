import { Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './Home';
import CardCollection from './CardCollection';
import Nav from './Nav';
import db from './db';

function App() {
  console.log(db);
  return (
    <div>
      <h1>My Cards</h1>
      <p>version: {import.meta.env.VITE_APP_VERSION}</p>
      <Nav/>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="grandpa" element={<CardCollection/>} />
        <Route path="uncle" element={<CardCollection/>} />
      </Routes>
    </div>
  );
}

export default App;
