// import { useState } from "react";
// import { Toaster } from "react-hot-toast";
// import ReactPaginate from "react-paginate";
// import { useQuery } from "@tanstack/react-query";

// import SearchBar from "../SearchBar/SearchBar";
// import MovieGrid from "../MovieGrid/MovieGrid";
// import Loader from "../Loader/Loader";
// import ErrorMessage from "../ErrorMessage/ErrorMessage";
// import MovieModal from "../MovieModal/MovieModal";

// import { fetchMovies } from "../../services/movieService";
// import type { Movie } from "../../types/movie";

// import styles from "./App.module.css";
// import type { TMDBResponse } from "../../services/movieService";

// const App = () => {
//   const [query, setQuery] = useState("");
//   const [page, setPage] = useState(1);
//   const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const { data, isLoading, isError } = useQuery<TMDBResponse>({
//     queryKey: ["movies", query, page],
//     queryFn: () => fetchMovies(query, page),
//     enabled: !!query,
//     placeholderData: (previousData) => previousData,
//   });

//   const handleSearch = (newQuery: string) => {
//     if (newQuery !== query) {
//       setQuery(newQuery);
//       setPage(1);
//     }
//   };

//   const handlePageChange = ({ selected }: { selected: number }) => {
//     setPage(selected + 1);
//   };

//   const handleSelectMovie = (movie: Movie) => {
//     setSelectedMovie(movie);
//     setIsModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setSelectedMovie(null);
//     setIsModalOpen(false);
//   };

//   return (
//     <div className={styles.app}>
//       <SearchBar onSubmit={handleSearch} />

//       {data && data.results.length > 0 && data.total_pages > 1 && (
//         <ReactPaginate
//           pageCount={data.total_pages}
//           pageRangeDisplayed={5}
//           marginPagesDisplayed={1}
//           onPageChange={handlePageChange}
//           forcePage={page - 1}
//           containerClassName={styles.pagination}
//           activeLinkClassName={styles.active}
//           nextLabel="→"
//           previousLabel="←"
//         />
//       )}

//       {isLoading && <Loader />}
//       {isError && <ErrorMessage />}
//       {data && data.results.length === 0 && (
//         <p className={styles.text}>No movies found for your request.</p>
//       )}

//       {data && data.results.length > 0 && (
//         <MovieGrid movies={data.results} onSelect={handleSelectMovie} />
//       )}

//       {isModalOpen && selectedMovie && (
//         <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
//       )}

//       <Toaster />
//     </div>
//   );
// };

// export default App;



import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import ReactPaginate from "react-paginate";

import { fetchMovies } from "../../services/movieService";
import type { TMDBResponse } from "../../services/movieService";
import type { Movie } from "../../types/movie";

import SearchBar from "../../components/SearchBar/SearchBar";
import MovieGrid from "../../components/MovieGrid/MovieGrid";
import MovieModal from "../../components/MovieModal/MovieModal";
import Loader from "../../components/Loader/Loader";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";

import styles from "./App.module.css";

function App() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isLoading, isError, isSuccess, isFetching } =
    useQuery<TMDBResponse>({
      queryKey: ["movies", query, page],
      queryFn: () => fetchMovies(query, page),
      enabled: !!query,
      placeholderData: (prevData) => prevData,
    });

  useEffect(() => {
    if (isSuccess && data?.results.length === 0) {
      toast("No movies found. Try another search term.");
    }
  }, [isSuccess, data]);

  const handleSearch = (newQuery: string) => {
    if (newQuery !== query) {
      setQuery(newQuery);
      setPage(1);
    }
  };

  const handlePageChange = ({ selected }: { selected: number }) => {
    setPage(selected + 1);
  };

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  return (
    <div className={styles.container}>
      <Toaster position="top-right" />
      <SearchBar onSubmit={handleSearch} />

      
      {isSuccess && data.results.length > 0 && data.total_pages > 1 && (
        <ReactPaginate
          pageCount={data.total_pages > 500 ? 500 : data.total_pages}
          pageRangeDisplayed={3}
          marginPagesDisplayed={2}
          onPageChange={handlePageChange}
          forcePage={page - 1}
          containerClassName={styles.pagination}
          activeClassName={styles.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}

      {isLoading || isFetching ? (
        <Loader />
      ) : isError ? (
        <ErrorMessage message="Something went wrong. Please try again." />
      ) : isSuccess && data.results.length > 0 ? (
        <MovieGrid movies={data.results} onSelect={handleSelectMovie} />
      ) : null}

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </div>
  );
}

export default App;
