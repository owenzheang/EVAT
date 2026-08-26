
import React, { useState, useEffect, useRef, useContext } from 'react';
import { UserContext } from "../context/user";
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';
import { Menu, LogOut} from "lucide-react";

function NavBar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [mainMenu, setMainMenuOpen] = useState(false);
    const [devMenu, setDevMenuOpen] = useState(false);
    const isDev = import.meta.env.DEV; // check if in dev mode

    const { user, updateUser } = useContext(UserContext);
    
    // Handle Sign out
    const handleSignOut = () => {
        localStorage.removeItem("currentUser");
        navigate("/signin");
    };

    // Highlight active button
    const isActive = (path) => location.pathname === path;

    const toggleMainMenu = () => {
        setMainMenuOpen(!mainMenu);
        setDevMenuOpen(false);
    }

    const toggleDevMenu = () => {
        setDevMenuOpen(!devMenu);
        setMainMenuOpen(false);
    }

    return (
        <nav className="relative z-[5000] flex h-14 w-full items-center justify-between border-b border-slate-200 bg-white px-3 text-slate-900 sm:px-4 lg:px-5">
            <div className="relative z-10 flex h-full items-center">
                <div className="flex items-center">
                    <div className="relative flex items-center gap-0 sm:gap-0.5">
                        {/* Main Menu Button */}
                        <button
                            className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-slate-700 transition-all duration-200 hover:bg-emerald-50 hover:text-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
                            onClick={toggleMainMenu}
                        >
                            {<Menu className="h-5 w-5" />}
                        </button>
                        {/* Main Menu Options */}
                        {mainMenu && (
                            <div className="absolute left-0 top-full mt-2 flex w-56 flex-col rounded-xl border border-slate-200 bg-white p-2 shadow-[0_8px_30px_rgba(15,23,42,0.08)]">
                                <button className="w-full cursor-pointer rounded-lg px-3 py-2 text-left text-sm text-slate-700 transition-all duration-200 hover:bg-emerald-50 hover:text-emerald-700" onClick={() => navigate('/profile')}>
                                    Profile
                                </button>
                                <button className="w-full cursor-pointer rounded-lg px-3 py-2 text-left text-sm text-slate-700 transition-all duration-200 hover:bg-emerald-50 hover:text-emerald-700" onClick={() => navigate('/map')}>
                                    Map
                                </button>
                                <button className="w-full cursor-pointer rounded-lg px-3 py-2 text-left text-sm text-slate-700 transition-all duration-200 hover:bg-emerald-50 hover:text-emerald-700" onClick={() => navigate('/dashboard')}>
                                    Dashboard
                                </button>
                                <button className="w-full cursor-pointer rounded-lg px-3 py-2 text-left text-sm text-slate-700 transition-all duration-200 hover:bg-emerald-50 hover:text-emerald-700" onClick={() => navigate('/favourites')}>
                                    Favourite Chargers
                                </button>
                                <button className="w-full cursor-pointer rounded-lg px-3 py-2 text-left text-sm text-slate-700 transition-all duration-200 hover:bg-emerald-50 hover:text-emerald-700" onClick={() => navigate('/game')}>
                                    Rewards
                                </button>
                                <button className="w-full cursor-pointer rounded-lg px-3 py-2 text-left text-sm text-slate-700 transition-all duration-200 hover:bg-emerald-50 hover:text-emerald-700" onClick={() => navigate('/feedback')}>
                                    Feedback
                                </button>
                                <button className="w-full cursor-pointer rounded-lg px-3 py-2 text-left text-sm text-slate-700 transition-all duration-200 hover:bg-emerald-50 hover:text-emerald-700" onClick={() => navigate('/support')}>
                                    Support
                                </button>
                            </div>
                        )}

                        {/* ==================== DEVELOPER MENU ==================== */}
                        {isDev && (
                            <>
                                <div className="relative">
                                    {/* Developer Menu Button */}
                                    <button
                                        className="inline-flex h-9 cursor-pointer items-center justify-center rounded-lg px-1.5 text-xs font-medium text-slate-700 transition-all duration-200 hover:bg-emerald-50 hover:text-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 sm:px-2 sm:text-sm"
                                        onClick={toggleDevMenu}
                                    >
                                        <span className="sm:hidden">Dev</span>
                                        <span className="hidden sm:inline">Developer Pages</span>
                                    </button>

                                    {/* Developer Menu Options */}
                                    {devMenu && (
                                        <div className="absolute left-0 top-full mt-2 flex w-64 flex-col rounded-xl border border-slate-200 bg-white p-2 shadow-[0_8px_30px_rgba(15,23,42,0.08)]">
                                            <button className="w-full cursor-pointer rounded-lg px-3 py-2 text-left text-sm text-slate-700 transition-all duration-200 hover:bg-emerald-50 hover:text-emerald-700" onClick={() => navigate('/use-cases')}>
                                                Use Case Dashboard
                                            </button>
                                            <button className="w-full cursor-pointer rounded-lg px-3 py-2 text-left text-sm text-slate-700 transition-all duration-200 hover:bg-emerald-50 hover:text-emerald-700" onClick={() => navigate('/apitester')}>
                                                API Tester
                                            </button>
                                            <button className="w-full cursor-pointer rounded-lg px-3 py-2 text-left text-sm text-slate-700 transition-all duration-200 hover:bg-emerald-50 hover:text-emerald-700" onClick={() => navigate('/voice-query')}>
                                                Voice Query
                                            </button>
                                            <button className="w-full cursor-pointer rounded-lg px-3 py-2 text-left text-sm text-slate-700 transition-all duration-200 hover:bg-emerald-50 hover:text-emerald-700" onClick={() => navigate('/cost-comparison')}>
                                                Cost Comparison
                                            </button>
                                            <button className="w-full cursor-pointer rounded-lg px-3 py-2 text-left text-sm text-slate-700 transition-all duration-200 hover:bg-emerald-50 hover:text-emerald-700" onClick={() => navigate('/environmental-impact')}>
                                                Environmental Impact
                                            </button>
                                            <button className="w-full cursor-pointer rounded-lg px-3 py-2 text-left text-sm text-slate-700 transition-all duration-200 hover:bg-emerald-50 hover:text-emerald-700" onClick={() => navigate('/demand-forecasting')}>
                                                Demand Forecasting
                                            </button>
                                            <button className="w-full cursor-pointer rounded-lg px-3 py-2 text-left text-sm text-slate-700 transition-all duration-200 hover:bg-emerald-50 hover:text-emerald-700" onClick={() => navigate('/congestion-prediction')}>
                                                Congestion Prediction
                                            </button>
                                            <button className="w-full cursor-pointer rounded-lg px-3 py-2 text-left text-sm text-slate-700 transition-all duration-200 hover:bg-emerald-50 hover:text-emerald-700" onClick={() => navigate('/weather-routing')}>
                                                Weather Routing
                                            </button>
                                            <button className="w-full cursor-pointer rounded-lg px-3 py-2 text-left text-sm text-slate-700 transition-all duration-200 hover:bg-emerald-50 hover:text-emerald-700" onClick={() => navigate('/chatbot')}>
                                                Chatbot
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                        {/* ======================================================= */}
                    </div>
                </div>
            </div>


            {/* Center Navbar */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 text-slate-900">
                <img src={logo} alt="Logo" className="h-7 w-auto shrink-0 sm:h-8"/>
                <span className="hidden whitespace-nowrap text-base font-semibold tracking-tight md:inline lg:text-lg">
                    Electric Vehicle Adoption Tool
                </span>
            </div>


            {/* Right Navbar */}
            <div className="relative z-10 flex h-full items-center gap-0.5">
                <img 
                    src={user?.avatarURL || "defaultProfilePictures/default-white.png"}
                    alt="User Avatar"
                    className="h-9 w-9 cursor-pointer rounded-full border border-slate-300 object-cover transition-all duration-200 hover:border-emerald-400 hover:ring-4 hover:ring-emerald-500/10"
                    onClick={() => navigate('/profile')}
                    key={user?.avatarURL}
                />
                <button
                    alt="Sign Out"
                    className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-slate-700 transition-all duration-200 hover:bg-emerald-50 hover:text-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
                    onClick={handleSignOut}
                ><LogOut className="h-5 w-5"/></button>
            </div>
        </nav>
    );
}

export default NavBar;


