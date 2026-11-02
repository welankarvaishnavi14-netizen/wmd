import { useState } from "react";

function LoginPopup({
    setShowLogin,
    setIsLoggedIn,
    user,
    setUser
}) {

    const [activeTab, setActiveTab] = useState("login");

    // Login form
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    // Sign Up form
    const [profileUsername, setProfileUsername] = useState("");
    const [signupEmail, setSignupEmail] = useState("");
    const [signupPassword, setSignupPassword] = useState("");
    const [contact, setContact] = useState("");
    const [gender, setGender] = useState("");

    // Error message
    const [error, setError] = useState("");

    // Close popup
    function closePopup() {
        setShowLogin(false);
        setError("");
    }

    // Login
    // Login
async function loginUser(event) {

    event.preventDefault();
    setError("");

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const symbolPattern = /[!@#$%^&*(),.?":{}|<>_\-+=]/;

    if (!loginEmail) {
        setError("Please enter your email.");
        return;
    }

    if (!emailPattern.test(loginEmail)) {
        setError("Please enter a valid email address.");
        return;
    }

    if (!loginPassword) {
        setError("Please enter your password.");
        return;
    }

    if (!symbolPattern.test(loginPassword)) {
        setError("Password must contain at least one symbol.");
        return;
    }

    try {

        const response = await fetch(
            "http://localhost:8080/api/login",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email: loginEmail,
                    password: loginPassword
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            setError(data.message || "Invalid email or password.");
            return;
        }

        // Save logged-in user
        setUser({
           id: data.id,
           username: data.username,
           email: data.email,
           contact: data.contact,
           gender: data.gender
        });

        setIsLoggedIn(true);
        setShowLogin(false);

        alert("Login successful!");

    } catch (error) {

        setError("Cannot connect to backend.");

    }
}
    // Sign Up
    async function saveProfile(event) {

        event.preventDefault();
        setError("");

        const usernamePattern = /^[A-Za-z ]{3,}$/;
        const contactPattern = /^[0-9]{10}$/;
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const symbolPattern = /[!@#$%^&*(),.?":{}|<>_\-+=]/;

        if (!profileUsername.trim()) {
            setError("Please enter your username.");
            return;
        }

        if (!usernamePattern.test(profileUsername.trim())) {
            setError("Username must contain at least 3 letters.");
            return;
        }

        if (!signupEmail) {
            setError("Please enter your email.");
            return;
        }

        if (!emailPattern.test(signupEmail)) {
            setError("Please enter a valid email.");
            return;
        }

        if (!signupPassword) {
            setError("Please enter your password.");
            return;
        }

        if (!symbolPattern.test(signupPassword)) {
            setError("Password must contain at least one symbol.");
            return;
        }

        if (!contact) {
            setError("Please enter your contact number.");
            return;
        }

        if (!contactPattern.test(contact)) {
            setError("Contact number must contain exactly 10 digits.");
            return;
        }

        if (!gender) {
            setError("Please select your gender.");
            return;
        }

        try {

            const response = await fetch(
                "http://localhost:8080/api/signup",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        username: profileUsername.trim(),
                        email: signupEmail,
                        contact: contact,
                        gender: gender,
                        password: signupPassword
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Signup failed.");
                return;
            }

            setUser({
                username: profileUsername.trim(),
                contact: contact,
                gender: gender
            });

            alert("Signup successful!");

            // Go back to Login tab
            setActiveTab("login");

        } catch (error) {

            setError("Cannot connect to backend.");

        }
    }

    return (
        <div className="popup">

            <div className="popup-content">

                <span
                    className="close"
                    onClick={closePopup}
                >
                    &times;
                </span>

                {/* Tabs */}

                <div className="tabs">

                    <button
                        onClick={() => {
                            setActiveTab("login");
                            setError("");
                        }}
                        className={
                            activeTab === "login"
                                ? "active"
                                : ""
                        }
                    >
                        Login
                    </button>

                    <button
                        onClick={() => {
                            setActiveTab("signup");
                            setError("");
                        }}
                        className={
                            activeTab === "signup"
                                ? "active"
                                : ""
                        }
                    >
                        Sign Up
                    </button>

                </div>

                {/* Error */}

                {error && (
                    <p className="error">
                        {error}
                    </p>
                )}

                {/* Login Form */}

                {activeTab === "login" && (

                    <form onSubmit={loginUser}>

                        <input
                            type="email"
                            placeholder="Enter Email"
                            value={loginEmail}
                            onChange={(e) =>
                                setLoginEmail(e.target.value)
                            }
                        />

                        <input
                            type="password"
                            placeholder="Enter Password"
                            value={loginPassword}
                            onChange={(e) =>
                                setLoginPassword(e.target.value)
                            }
                        />

                        <small>
                            Password must contain at least one symbol.
                        </small>

                        <button type="submit">
                            Login
                        </button>

                    </form>

                )}

                {/* Sign Up Form */}

                {activeTab === "signup" && (

                    <form onSubmit={saveProfile}>

                        <input
                            type="text"
                            placeholder="Username"
                            value={profileUsername}
                            onChange={(e) =>
                                setProfileUsername(e.target.value)
                            }
                        />

                        <input
                            type="email"
                            placeholder="Email"
                            value={signupEmail}
                            onChange={(e) =>
                                setSignupEmail(e.target.value)
                            }
                        />

                        <input
                            type="password"
                            placeholder="Password"
                            value={signupPassword}
                            onChange={(e) =>
                                setSignupPassword(e.target.value)
                            }
                        />

                        <input
                            type="tel"
                            placeholder="Contact Number"
                            value={contact}
                            onChange={(e) =>
                                setContact(e.target.value)
                            }
                        />

                        <select
                            value={gender}
                            onChange={(e) =>
                                setGender(e.target.value)
                            }
                        >

                            <option value="">
                                Select Gender
                            </option>

                            <option value="Male">
                                Male
                            </option>

                            <option value="Female">
                                Female
                            </option>

                            <option value="Other">
                                Other
                            </option>

                        </select>

                        <button type="submit">
                            Save Profile
                        </button>

                    </form>

                )}

            </div>

        </div>
    );
}

export default LoginPopup;