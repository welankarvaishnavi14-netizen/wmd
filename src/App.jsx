import { useState } from "react";

import { useEffect } from "react";
import { checkBackend } from "./api";
import Header from "./components/Header";
import LoginPopup from "./components/LoginPopup";
import Hero from "./components/Hero";
import Movies from "./components/Movies";
import Events from "./components/Events";
import Offers from "./components/Offers";
import Footer from "./components/Footer";

import "./App.css";

function App() {

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [showProfile, setShowProfile] = useState(false);

    const [user, setUser] = useState({
        username: "",
        contact: "",
        gender: ""
    });

    useEffect(() => {
    checkBackend()
        .then(data => console.log("Backend:", data))
        .catch(error => console.error("Backend error:", error));
    }, []);
    
    return (
        <>
            <Header
                isLoggedIn={isLoggedIn}
                user={user}
                showProfile={showProfile}
                setShowProfile={setShowProfile}
                setShowLogin={setShowLogin}
                setIsLoggedIn={setIsLoggedIn}
                setUser={setUser}
            />

            {isLoggedIn && (
            <div className="hello-user">
            Hello! {user.username}
            </div>
        )}

            {/* Login Popup */}
            {showLogin && (
                <LoginPopup
                    setShowLogin={setShowLogin}
                    setIsLoggedIn={setIsLoggedIn}
                    user={user}
                    setUser={setUser}
                />
            )}

            <Hero />

            <Movies userId={user.id} />

            <Events />

            <Offers />

            <section id="contact">
                <h2>Contact</h2>

                <p>
                    Email : support@makemyshow.com
                </p>
            </section>

            <Footer />
        </>
    );
}

export default App;