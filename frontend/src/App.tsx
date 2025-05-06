import { Routes, Route } from 'react-router-dom';
import './App.css';
import MainLayout from './layouts/MainLayout';
import Home from './components/Home';
import Token from './components/Token';
import Nft from './components/Nft';
import Swap from './components/Swap';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route path="" element={<Home />} />
        <Route path="token" element={<Token />} />
        <Route path="nft" element={<Nft />} />
        <Route path="swap" element={<Swap />} />
      </Route>
    </Routes>
  );
}

export default App;
