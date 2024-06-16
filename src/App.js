import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './components/home';
import Sales from './components/sales';
import React from 'react';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sales" element={<Sales />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
