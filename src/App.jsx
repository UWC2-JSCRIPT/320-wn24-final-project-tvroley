import { Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './Home';
import CardCollection from './CardCollection';
import EditCard from './EditCard';
import Nav from './Nav';

function App() {
  return (
    <div>
      <h1>My Cards</h1>
      <p>version: {import.meta.env.VITE_APP_VERSION}</p>
      <Nav/>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="grandpa" element={<CardCollection/>} />
        <Route path="grandpa/:id" element={<EditCard/>} />
        <Route path="uncle" element={<CardCollection/>} />
        <Route path="uncle/:id" element={<EditCard/>} />
      </Routes>
    </div>
  );
}

export default App;
