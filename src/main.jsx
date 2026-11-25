import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';

import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import NewTicket from './pages/NewTicket.jsx';
import Cadastro from './pages/Cadastro.jsx';
import TicketDetails from './pages/TicketDetails.jsx';

import './global-css/Variables.css';
import './global-css/PageTransitions.css';

import { ThemeProvider } from './context/ThemeContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import PageTransitionLayout from './components/PageTransitionLayout.jsx';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <ThemeProvider>
            <BrowserRouter>
                <Routes>
                    <Route element={<PageTransitionLayout />}>
                        <Route path="/" element={<Login />} />
                        <Route
                            path="/home"
                            element={
                                <ProtectedRoute>
                                    <Home />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/newTicket"
                            element={
                                <ProtectedRoute>
                                    <NewTicket />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/ticket/:id"
                            element={
                                <ProtectedRoute>
                                    <TicketDetails />
                                </ProtectedRoute>
                            }
                        />
                        <Route path="/cadastro" element={<Cadastro />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    </StrictMode>
);