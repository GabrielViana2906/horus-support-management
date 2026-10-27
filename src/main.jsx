import { StrictMode, ViewTransition } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router';

import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import NewTicket from './pages/NewTicket.jsx';

import './global-css/Variables.css';
import './global-css/PageTransitions.css';

import { ThemeProvider } from './context/ThemeContext.jsx';

function PageTransitionLayout() {
    return (
        <ViewTransition>
            <Outlet />
        </ViewTransition>
    );
}

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <ThemeProvider>
            <BrowserRouter>
                <Routes>
                    <Route element={<PageTransitionLayout />}>
                        <Route path="/" element={<Login />} />
                        <Route path="/home" element={<Home />} />
                        <Route path="/newTicket" element={<NewTicket />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    </StrictMode>
);