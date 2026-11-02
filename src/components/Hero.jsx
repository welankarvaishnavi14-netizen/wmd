function Hero() {

    function bookNow() {
        alert("Book Now clicked!");
    }

    return (
        <section id="home" className="hero">

            <div className="hero-content">

                <h1>Book Movie Tickets Online</h1>

                <p>
                    Discover the latest movies, book your seats,
                    and enjoy your favourite shows.
                </p>

                <button onClick={bookNow}>
                    Book Now
                </button>

            </div>

        </section>
    );
}

export default Hero;