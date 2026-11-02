import { useState } from "react";

function MovieCard(props) {
    const [ticket, setTicket] = useState(null);

    async function bookTicket() {
        if (!props.userId) {
            alert("Please login first.");
            return;
        }

        const seats = prompt("Enter number of seats:");

        if (!seats || seats < 1) {
            return;
        }

        try {
            const response = await fetch("http://localhost:8080/api/book", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    userId: props.userId,
                    showId: props.showId,
                    seats: seats
                })
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Booking failed.");
                return;
            }

            setTicket({
                movie: props.title,
                seats: seats,
                bookingId: data.bookingCode,
                date: new Date().toLocaleDateString()
            });

            alert("Booking successful!");
        } catch (error) {
            alert("Cannot connect to backend.");
        }
    }

    return (
        <div className="movie-card">
            <img src={props.image} alt={props.title} />

            <h3>{props.title}</h3>

            <p>{props.info}</p>

            <button onClick={bookTicket}>
                Book Ticket
            </button>

            {ticket && (
                <div className="ticket">
                    <h4>Digital Ticket</h4>

                    <p>Movie: {ticket.movie}</p>
                    <p>Seats: {ticket.seats}</p>
                    <p>Booking ID: {ticket.bookingId}</p>
                    <p>Date: {ticket.date}</p>
                </div>
            )}
        </div>
    );
}

export default MovieCard;