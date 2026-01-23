import moviePoster1 from "@/assets/movie-poster-1.jpg";
import moviePoster2 from "@/assets/movie-poster-2.jpg";
import moviePoster3 from "@/assets/movie-poster-3.jpg";
import moviePoster4 from "@/assets/movie-poster-4.jpg";
import moviePoster5 from "@/assets/movie-poster-5.jpg";
import moviePoster6 from "@/assets/movie-poster-6.jpg";

export interface Movie {
  id: string;
  title: string;
  poster: string;
  rating: number;
  votes: string;
  genres: string[];
  language: string;
  duration: string;
  releaseDate: string;
  featured?: boolean;
  description?: string;
}

export const movies: Movie[] = [
  {
    id: "1",
    title: "Shadow Strike",
    poster: moviePoster1,
    rating: 8.4,
    votes: "125.2K",
    genres: ["Action", "Thriller"],
    language: "English",
    duration: "2h 18m",
    releaseDate: "Jan 15, 2026",
    featured: true,
    description: "A gripping action thriller that will keep you on the edge of your seat."
  },
  {
    id: "2",
    title: "Love in Paris",
    poster: moviePoster2,
    rating: 7.9,
    votes: "89.5K",
    genres: ["Romance", "Comedy"],
    language: "English",
    duration: "1h 52m",
    releaseDate: "Jan 10, 2026",
    featured: true,
    description: "A heartwarming romantic comedy set in the city of love."
  },
  {
    id: "3",
    title: "Beyond the Stars",
    poster: moviePoster3,
    rating: 9.1,
    votes: "234.1K",
    genres: ["Sci-Fi", "Adventure"],
    language: "English",
    duration: "2h 45m",
    releaseDate: "Jan 20, 2026",
    featured: true,
    description: "An epic space adventure that explores the mysteries of the universe."
  },
  {
    id: "4",
    title: "The Haunting",
    poster: moviePoster4,
    rating: 7.2,
    votes: "67.3K",
    genres: ["Horror", "Thriller"],
    language: "English",
    duration: "1h 48m",
    releaseDate: "Jan 5, 2026"
  },
  {
    id: "5",
    title: "Mighty Guardian",
    poster: moviePoster5,
    rating: 8.8,
    votes: "189.7K",
    genres: ["Action", "Superhero"],
    language: "English",
    duration: "2h 32m",
    releaseDate: "Jan 22, 2026"
  },
  {
    id: "6",
    title: "Wonder World",
    poster: moviePoster6,
    rating: 8.1,
    votes: "156.4K",
    genres: ["Animation", "Family"],
    language: "English",
    duration: "1h 45m",
    releaseDate: "Jan 18, 2026"
  }
];

export const featuredMovies = movies.filter(movie => movie.featured);
