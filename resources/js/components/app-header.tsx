import React, { useState } from 'react';
import AppLogo from './app-logo';
import { ShoppingCart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export function AppHeader() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/products');
    };

    const handleLogin = () => {
        navigate('/login');
    };

    return (
        <div className="w-full bg-white border-b border-gray-100">
            <div className="mx-auto flex h-16 items-center justify-between px-4 md:px-8 max-w-7xl">
                {/* Left: Logo */}
                <div className="flex items-center">
                    <AppLogo />
                </div>
                {/* Center: Desktop Nav */}
                <div className="hidden md:flex items-center space-x-6">
                    <span className="font-bold text-lg text-black cursor-pointer" onClick={() => navigate('/products')}>Products</span>
                    <span className="bg-black text-white font-semibold rounded-md px-6 py-2 ml-2 text-base cursor-pointer" onClick={() => navigate('/sell')}>Sell Your Product</span>
                </div>
                {/* Right: Cart + Auth */}
                <div className="flex items-center space-x-2 md:space-x-6">
                    <ShoppingCart className="w-7 h-7 text-black cursor-pointer" onClick={() => navigate('/cart')} />
                    {/* Desktop Auth */}
                    <div className="hidden md:block">
                        {user ? (
                            <>
                                <span className="font-semibold text-black mr-2">{user.name}</span>
                                <button
                                    className="bg-black text-white font-semibold rounded-md px-4 py-2 text-base"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <button
                                className="bg-black text-white font-semibold rounded-md px-4 py-2 text-base"
                                onClick={handleLogin}
                            >
                                Login
                            </button>
                        )}
                    </div>
                    {/* Mobile Hamburger */}
                    <button className="md:hidden ml-2 p-2" onClick={() => setMenuOpen(!menuOpen)}>
                        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-menu"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
                    </button>
                </div>
            </div>
            {/* Mobile Menu Drawer */}
            {menuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 shadow-lg absolute left-0 right-0 z-30">
                    <div className="flex flex-col px-4 py-3 space-y-2">
                        <span className="font-bold text-lg text-black cursor-pointer" onClick={() => { setMenuOpen(false); navigate('/products'); }}>Products</span>
                        <span className="bg-black text-white font-semibold rounded-md px-6 py-2 text-base cursor-pointer" onClick={() => { setMenuOpen(false); navigate('/sell'); }}>Sell Your Product</span>
                        {user ? (
                            <>
                                <span className="font-semibold text-black mt-2">{user.name}</span>
                                <button
                                    className="bg-black text-white font-semibold rounded-md px-4 py-2 text-base mt-2"
                                    onClick={() => { setMenuOpen(false); handleLogout(); }}
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <button
                                className="bg-black text-white font-semibold rounded-md px-4 py-2 text-base mt-2"
                                onClick={() => { setMenuOpen(false); handleLogin(); }}
                            >
                                Login
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
