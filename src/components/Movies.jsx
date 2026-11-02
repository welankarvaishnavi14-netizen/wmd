import { useState } from "react";
import MovieCard from "./MovieCard";

function Movies({ userId }) {

    return (
        <>
            {/* NOW SHOWING */}

            <section id="movies" className="movies">

                <h2>Now Showing</h2>

                <div className="movie-container">

    <MovieCard
    image="https://tse1.mm.bing.net/th/id/OIP.DVYDQX85lQdcPGsSxAd-rgHaKy?r=0&pid=Api&h=220&P=0"
    title="Avengers"
    info="⭐ 9.2/10"
    showId={1}
    userId={userId}
    />

    <MovieCard
    image="https://tse4.mm.bing.net/th/id/OIP.FQLoaB4t8j5FCZziBXMwXwAAAA?r=0&pid=Api&h=220&P=0"
    title="Dhamaal 4"
    info="⭐ 8.9/10"
    showId={2}
    userId={userId}
/>

<MovieCard
    image="https://tse2.mm.bing.net/th/id/OIP.uiaj_IMaC7h3NoieAhcmVwHaLG?r=0&pid=Api&h=220&P=0"
    title="Interstellar"
    info="⭐ 9.5/10"
    showId={3}
    userId={userId}
/>

<MovieCard
    image="https://tse1.mm.bing.net/th/id/OIP.X-p0vfrzIxh9NlDbG8L7xQAAAA?r=0&pid=Api&h=220&P=0"
    title="Dhurandhar"
    info="⭐ 8.8/10"
    showId={4}
    userId={userId}
/>


                </div>

            </section>


            {/* TRENDING */}

            <section id="trending" className="movies">

                <h2>Trending Movies</h2>

                <div className="movie-container">

                    <MovieCard
    image="https://tse2.mm.bing.net/th/id/OIP.b_do51ekbnlmeqUQweLISAHaL8?r=0&pid=Api&h=220&P=0"
    title="Pushpa 2"
    info="🔥 Trending | Action"
    showId={5}
    userId={userId}
/>

<MovieCard
    image="https://tse2.mm.bing.net/th/id/OIP.xIpgU4X4BF-N7uZ-TVINqgHaDh?r=0&pid=Api&h=220&P=0"
    title="Avatar"
    info="🔥 Popular | Fantasy"
    showId={6}
    userId={userId}
/>

<MovieCard
    image="https://tse3.mm.bing.net/th/id/OIP.SNhm4pNBzyCgBnpNdiaMtAHaDt?r=0&pid=Api&h=220&P=0"
    title="Spider-Man"
    info="🔥 Trending | Adventure"
    showId={7}
    userId={userId}
/>

<MovieCard
    image="https://tse1.mm.bing.net/th/id/OIP.DKmdJtGYD1qY0jLzlhusCAHaDt?r=0&pid=Api&h=220&P=0"
    title="Oppenheimer"
    info="🔥 Must Watch | Drama"
    showId={8}
    userId={userId}
/>

                </div>

            </section>

        </>
    );
}

export default Movies;