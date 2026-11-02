import { useEffect, useState } from "react";

function Header({
    isLoggedIn,
    user,
    showProfile,
    setShowProfile,
    setShowLogin,
    setIsLoggedIn,
    setUser
}) {
    const [tickets, setTickets] = useState([]);

    useEffect(() => {
        if (!isLoggedIn || !user.id || !showProfile) {
            return;
        }

        fetch(`http://localhost:8080/api/bookings?userId=${user.id}`)
            .then(response => response.json())
            .then(data => {
                setTickets(data);
            })
            .catch(() => {
                setTickets([]);
            });

    }, [isLoggedIn, user.id, showProfile]);


    async function deleteTicket(ticketId) {
    try {
        const response = await fetch(
            "http://localhost:8080/api/cancel",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    bookingId: String(ticketId),
                    userId: String(user.id)
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            alert(data.message || "Delete failed.");
            return;
        }

        // Immediately strike the ticket in the screen
        setTickets(prevTickets =>
            prevTickets.map(ticket =>
                String(ticket.id) === String(ticketId)
                    ? { ...ticket, deleted: true }
                    : ticket
            )
        );

    } catch (error) {
        console.log(error);
        alert("Cannot connect to backend.");
    }
}
    function handleLogout() {

        setIsLoggedIn(false);
        setUser({});
        setTickets([]);
        setShowProfile(false);

        alert("Logged out successfully!");
    }


    return (
        <header>

            <nav>

                <div className="logo">
                    🎬 MakeMyShow
                </div>

                <ul>
                    <li><a href="#home">Home</a></li>
                    <li><a href="#movies">Movies</a></li>
                    <li><a href="#events">Events</a></li>
                    <li><a href="#offers">Offers</a></li>
                    <li><a href="#contact">Contact</a></li>
                </ul>

                <div id="userSection">

                    {!isLoggedIn ? (

                        <button
                            className="login-btn"
                            onClick={() => setShowLogin(true)}
                        >
                            Login
                        </button>

                    ) : (

                        <div className="profile-container">

                            <button
                                className="profile-btn"
                                onClick={() =>
                                    setShowProfile(!showProfile)
                                }
                            >
                                👤 Profile
                            </button>


                            {showProfile && (

                                <div className="profile-popup">

                                    <button
                                        className="profile-close"
                                        onClick={() => setShowProfile(false)}
                                    >
                                        ×
                                    </button>

                                    <h3>My Profile</h3>

                                    <p>
                                        <strong>Name:</strong>{" "}
                                        {user.username}
                                    </p>

                                    <p>
                                        <strong>Email:</strong>{" "}
                                        {user.email}
                                    </p>

                                    <p>
                                        <strong>Contact:</strong>{" "}
                                        {user.contact}
                                    </p>

                                    <p>
                                        <strong>Gender:</strong>{" "}
                                        {user.gender}
                                    </p>


                                    <h3>My Tickets</h3>

                                    {tickets.length === 0 ? (

                                        <p>No tickets booked yet.</p>

                                    ) : (

                                        tickets.map(ticket => (

    <div
        className={
            ticket.deleted
                ? "profile-ticket deleted-ticket"
                : "profile-ticket"
        }
        key={ticket.id}
    >

        <div>
            <strong>{ticket.title}</strong>

            <br />

            Seats: {ticket.seats}

            <br />

            Booking ID: {ticket.bookingCode}

            <br />

            Date: {new Date(ticket.date).toLocaleDateString()}
        </div>

        {!ticket.deleted && (
            <button onClick={() => deleteTicket(ticket.id)}>
                Delete
            </button>
        )}

    </div>

))
                                    )}


                                    <button
                                        className="logout-btn"
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </button>

                                </div>

                            )}

                        </div>
                    )}

                </div>

            </nav>

        </header>
    );
}

export default Header;