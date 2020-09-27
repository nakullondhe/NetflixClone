import React, { useState, useEffect } from 'react';
import axios from './axios';
import "./Row.css"
import YouTube from 'react-youtube';
import movieTrailer from 'movie-trailer'

const base_url = "https://image.tmdb.org/t/p/original/"

const Row = ({ title ,fetchUrl, isLargeRow}) => {

    const [movies, setMovies] = useState([]); 
    const [trailerUrl, setTrailerUrl] = useState("");

    useEffect(() => {
        async function fetchData() {
            const request = await axios.get(fetchUrl);
            setMovies(request.data.results);
            return request;
        }
        fetchData();
    } ,[fetchUrl]);
    
    const handleCLick = (movie) => {
        if(trailerUrl){
            setTrailerUrl('');
        } else {
            movieTrailer(movie?.name || "")
            .then((url) => {
                const urlParams = new URLSearchParams(new URL(url).search);
                setTrailerUrl(urlParams.get('v'))
            }).catch(err => console.log(err))        }

    }
    const opts = {
        height:"390px",
        width:"100%",
        playerVars: {

            autoplay: 1,
        }
    }
    return ( 
    <div className="row">
        {/* Title */}
            <h2>{title}</h2>
        
        {/* Container -> Posters*/}

        <div className="row__posters">
            {movies.map(movie => (  
                <img 
                key={movie.id}
                onClick={()=> handleCLick(movie)}
                className={`row__poster ${isLargeRow && "row__posterLarge"}`}
                src={`${base_url}${isLargeRow ? movie.poster_path : movie.backdrop_path}`} alt={movie.name}/>
            ))}
        </div>

        {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}

    </div>
     );
}
 
export default Row;