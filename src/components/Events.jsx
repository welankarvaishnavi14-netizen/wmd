import { useState } from "react";

function Events() {

    const [ticket, setTicket] = useState(null);

    function bookEvent(eventName) {

        const seats = prompt("Enter number of seats:");

        if (!seats || seats < 1) {
            return;
        }

        const bookingId =
            "MMS" + Math.floor(10000 + Math.random() * 90000);

        setTicket({
            event: eventName,
            seats: seats,
            bookingId: bookingId,
            date: new Date().toLocaleDateString()
        });
    }

    return (
        <section id="events">

            <h2>Events</h2>

            <div className="event-container">

                <div className="event-card">

                    <h3>🎤 Arijit Singh Live</h3>

                    <p>
                        Mumbai • Music Concert
                    </p>

                    <button
                        onClick={() =>
                            bookEvent("Arijit Singh Live")
                        }
                    >
                        Book Now
                    </button>

                </div>

                <div className="event-card">

                    <h3>🎸 Rock Music Festival</h3>

                    <p>
                        Bangalore • Live Event
                    </p>

                    <button
                        onClick={() =>
                            bookEvent("Rock Music Festival")
                        }
                    >
                        Book Now
                    </button>

                </div>

                <div className="event-card">

                    <h3>😂 Comedy Night</h3>

                    <p>
                        Delhi • Stand Up Show
                    </p>

                    <button
                        onClick={() =>
                            bookEvent("Comedy Night")
                        }
                    >
                        Book Now
                    </button>

                </div>

            </div>

            {ticket && (
                <div className="ticket">

                    <h4>Digital Ticket</h4>

                    <p>
                        Event: {ticket.event}
                    </p>

                    <p>
                        Seats: {ticket.seats}
                    </p>

                    <p>
                        Booking ID: {ticket.bookingId}
                    </p>

                    <p>
                        Date: {ticket.date}
                    </p>

                </div>
            )}

        </section>
    );
}

export default Events;