import axios from "axios";
import type { Movie } from "../types/movie";

export interface TMDBResponse {
  results: Movie[];
  total_pages: number;
  total_results: number;
  page: number;
}

export const fetchMovies = async (
  query: string,
  page: number
): Promise<TMDBResponse> => {
  const response = await axios.get<TMDBResponse>(
    "https://api.themoviedb.org/3/search/movie",
    {
      params: {
        query,
        page,
        language: "en-US",
        include_adult: false,
      },
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
      },
    }
  );

  return response.data;
};
