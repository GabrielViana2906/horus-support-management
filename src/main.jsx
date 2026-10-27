import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';

import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx'
import NewTicket from './pages/NewTicket.jsx';

import './css/Variables.css';
import { ThemeProvider } from './context/ThemeContext.jsx';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <ThemeProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/newTicket" element={<NewTicket />} />
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    </StrictMode>
);