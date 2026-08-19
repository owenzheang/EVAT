import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import profileImage from '../assets/game-car.png';
import backgroundImage from '../assets/background.jpg';
import ChatBubble from "../components/ChatBubble";

import '../styles/Buttons.css';
import '../styles/Elements.css';
import '../styles/NavBar.css';

function Game() {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("currentUser")));
  const [gameProfile, setGameProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loginMessage, setLoginMessage] = useState("");

  useEffect(() => {
    if (!user || !user.token) {
      navigate("/signin");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/gamification/profile", {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch gamification profile");

        const data = await res.json();
        setGameProfile(data.data);
      } catch (err) {
        console.error("Error fetching gamification profile:", err);
        setError("Could not load game profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, navigate]);

  const refreshProfile = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/gamification/profile", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (!res.ok) throw new Error("Failed to refresh profile");
      const profileData = await res.json();
      setGameProfile(profileData.data);
    } catch (err) {
      console.error("Profile refresh error:", err);
    }
  };

  const handleAppLogin = async () => {
    if (!user?.token) return;

    try {
      const oldBalance = gameProfile?.gamification_profile?.points_balance || 0;

      const res = await fetch("http://localhost:8080/api/gamification/action", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          action_type: "app_login",
          session_id: `web-session-${Date.now()}`,
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "App login failed");

      const newBalance = result.data?.new_balance;
      const delta = newBalance !== undefined ? newBalance - oldBalance : null;

      if (delta !== null) {
        setLoginMessage(`App login successful! +${delta} points`);
      } else {
        setLoginMessage("App login successful!");
      }

      await refreshProfile();
    } catch (err) {
      console.error("App login error:", err);
      setLoginMessage(err.message || "App login failed.");
    }
  };

  const triggerGamificationAction = async (actionType) => {
    if (!user?.token) return;

    try {
      const oldBalance = gameProfile?.gamification_profile?.points_balance || 0;

      const res = await fetch("http://localhost:8080/api/gamification/action", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          action_type: actionType,
          session_id: `web-session-${Date.now()}-${actionType}`,
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Action failed");

      const newBalance = result.data?.new_balance;
      const delta = newBalance !== undefined ? newBalance - oldBalance : null;

      if (delta !== null) {
        setLoginMessage(`Action "${actionType}" completed! +${delta} points`);
      } else {
        setLoginMessage(`Action "${actionType}" completed!`);
      }

      await refreshProfile();
    } catch (err) {
      console.error(`Action "${actionType}" failed:`, err);
      setLoginMessage(`Action "${actionType}" failed: ${err.message}`);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("currentUser");
    navigate("/signin");
  };

  return (
    <div className="relative isolate min-h-screen overflow-x-hidden bg-[#172235] text-white">
      <NavBar />
      {/* background */}
      <div
        className="fixed inset-0 -z-20 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div className="fixed inset-0 -z-10 bg-[#172235]/70" />
      {/* title */}
      <h1 className="px-4 py-4 text-center text-5xl font-bold sm:text-6xl lg:text-7xl">Rewards</h1>
      <div className="mx-auto grid w-full max-w-[120rem] gap-8 rounded-lg border border-[#62d48c] bg-[#ffffff2a] p-4 shadow-lg backdrop-blur-sm sm:p-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10">
        <div className="flex flex-col items-center lg:items-start">
          <h5 className="mb-4 text-2xl font-bold">Character</h5>
          <div>
            <img src={profileImage} className="size-48 rounded-full object-cover sm:size-52" alt="Character Image"  />
          </div>
        </div>
        <div className="flex min-w-0 flex-col items-center text-center">
          <div>
            <button className="cursor-pointer rounded-lg border-0 bg-linear-to-r from-[#62d48c] via-[#62d48c] to-[#3f795b] px-5 py-3 text-lg font-semibold uppercase tracking-wide text-white shadow-sm transition hover:-translate-y-px hover:shadow-md" onClick={handleAppLogin}>
              App Login Check-In
            </button>
          </div>

          <div className="mt-8 w-full">
            <h5 className="mb-5 text-2xl font-bold">Try Action-Based Rewards:</h5>
            <div className="flex flex-wrap justify-center gap-2">
              <button 
                className="cursor-pointer rounded-lg border-0 bg-linear-to-r from-[#62d48c] via-[#62d48c] to-[#3f795b] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-px hover:shadow-md sm:text-base"
                onClick={() => triggerGamificationAction("check_in")}
              >Check-In</button>
              <button 
                className="cursor-pointer rounded-lg border-0 bg-linear-to-r from-[#62d48c] via-[#62d48c] to-[#3f795b] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-px hover:shadow-md sm:text-base"
                onClick={() => triggerGamificationAction("report_fault")}
              >Fault Report</button>
              <button 
                className="cursor-pointer rounded-lg border-0 bg-linear-to-r from-[#62d48c] via-[#62d48c] to-[#3f795b] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-px hover:shadow-md sm:text-base"
                onClick={() => triggerGamificationAction("validate_ai_prediction")}
              >AI Validation</button>
              <button 
                className="cursor-pointer rounded-lg border-0 bg-linear-to-r from-[#62d48c] via-[#62d48c] to-[#3f795b] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-px hover:shadow-md sm:text-base"
                onClick={() => triggerGamificationAction("discover_new_station_in_black_spot")}
              >Black Spot Discovery</button>
              <button 
                className="cursor-pointer rounded-lg border-0 bg-linear-to-r from-[#62d48c] via-[#62d48c] to-[#3f795b] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-px hover:shadow-md sm:text-base"
                onClick={() => triggerGamificationAction("use_route_planner")}
              >Route Plan</button>
              <button 
                className="cursor-pointer rounded-lg border-0 bg-linear-to-r from-[#62d48c] via-[#62d48c] to-[#3f795b] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-px hover:shadow-md sm:text-base"
                onClick={() => triggerGamificationAction("ask_chatbot_question")}
              >Chatbot Question</button>
            </div>
          </div>

          <div className="mt-8 text-base sm:text-lg">
            {loading ? (
              <div className="rounded-lg border border-black bg-white px-4 py-2 text-black">Loading game profile...</div>
            ) : error ? (
              <p className="text-white">{error}</p>
            ) : gameProfile ? (
              <div className="flex flex-col gap-2 rounded-lg border border-[#62d48c] bg-white/10 p-4 text-left text-white">
                <p>🎯 <strong>Points:</strong> {gameProfile.gamification_profile?.points_balance}</p>
                <p>🔥 <strong>Streak:</strong> {gameProfile.engagement_metrics?.current_app_login_streak} day(s)</p>
                <p>🏆 <strong>Longest Streak:</strong> {gameProfile.engagement_metrics?.longest_app_login_streak} day(s)</p>
                <p>📅 <strong>Last Login:</strong> {new Date(gameProfile.engagement_metrics?.last_login_date).toLocaleDateString()}</p>
                {loginMessage && <p className="rounded-lg border border-green-800 bg-green-100 p-2 text-center font-bold text-green-900">{loginMessage}</p>}
              </div>
            ) : (
              <p className="text-white">No game profile data.</p>
            )}
          </div>
        </div>
      </div>
      <ChatBubble />
    </div>
  );
}

export default Game;
