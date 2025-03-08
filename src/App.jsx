import  { useEffect, useState,} from 'react'
import Search from './components/search'
import Spinner from './components/Spinner';
import { MovieCard } from './components/MovieCard';
import { useDebounce } from 'react-use';
import { updateSearchCount, getTrendingMovies } from './appwrite';

//API - Application Programming Interface - a set of rules that allows one software application to talk to another

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json', // it is to define what kind of data do we accept in our application
    Authorization: `Bearer ${API_KEY}` // this one verifies who is trying to make that request    
  }
}



function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  useDebounce(()=> setDebouncedSearchTerm(searchTerm), 1000, [searchTerm]);

  const fetchMovies = async(query = '') => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const endpoint = query
      ?`${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
      :`${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS); 

      // alert(response)
      if(!response.ok){
        throw new Error("Failed to fetch movies");

      }

      const data = await response.json();
      // console.log(data);  
    

      if(data.Response === 'False') {
        setErrorMessage(data.Error || 'Failed to fetch movies');
        setMovieList([]);
        return;
      }

      if(query && data.results.length > 0){
        await updateSearchCount(query, data.results[0]);
      }

      getTrendingMovies();

      setMovieList(data.results || []);
      
    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      setErrorMessage('Failed to fetch movies. Please try again later.');
    } finally {
      setTimeout(() => {
        
        setIsLoading(false);
      }, 2000);
    }
  }

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();

      setTrendingMovies(movies);
    } catch (error) {
      console.error(`Error fetching trending movies: ${error}`);
    }
  }

  useEffect(()=>{
    fetchMovies(debouncedSearchTerm);
  },[debouncedSearchTerm])


  useEffect(()=> {
    loadTrendingMovies();
  })

  

  return (
    <main>
      <div className="class">
        <div className="wrapper bg-[url(./hero-bg.png)] bg-no-repeat w-full">
          <header className=''>
            <img src="./hero.png" alt="" />
            <h1>Find <span className="text-gradient">Movies</span> You&apos;ll Enjoy without the hassle</h1>

            <Search searchTerm = {searchTerm} setSearchTerm = {setSearchTerm} />
          
          </header>

          {trendingMovies.length > 0 && (
            <section className="trending">
              <h2>Trending Movies</h2>
              <ul>
                {trendingMovies.map((movie, index) => (
                  <li key={movie.$id}>
                    <p>{index+1}</p>
                    <img src={movie.poster_url} alt={movie.title} />
                    <p>{movie.title}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="all-movies">
            <h2>All Movies</h2>

            {isLoading? (
              <Spinner/>
            ): errorMessage? (
              <p className='text-red-600'>{errorMessage}</p>
            ): (
              <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
              </ul>
            )}

          </section>
            
        </div>
      </div>
    </main>
  )
}

export default App