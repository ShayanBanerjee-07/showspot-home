import { Star } from "lucide-react";
import type { Movie } from "@/hooks/useMovies";
import moviePoster1 from "@/assets/movie-poster-1.jpg";
import moviePoster2 from "@/assets/movie-poster-2.jpg";
import moviePoster3 from "@/assets/movie-poster-3.jpg";
import moviePoster4 from "@/assets/movie-poster-4.jpg";
import moviePoster5 from "@/assets/movie-poster-5.jpg";
import moviePoster6 from "@/assets/movie-poster-6.jpg";

interface MovieCardProps {
  movie: Movie;
  onClick?: () => void;
}

// Map poster URLs to local assets
const posterMap: Record<string, string> = {
  "/movie-poster-1.jpg": moviePoster1,
  "/movie-poster-2.jpg": moviePoster2,
  "/movie-poster-3.jpg": moviePoster3,
  "/movie-poster-4.jpg": moviePoster4,
  "/movie-poster-5.jpg": moviePoster5,
  "/movie-poster-6.jpg": moviePoster6,
};

const formatVotes = (votes: number) => {
  if (votes >= 1000) {
    return `${(votes / 1000).toFixed(1)}K`;
  }
  return votes.toString();
};

const MovieCard = ({ movie, onClick }: MovieCardProps) => {
  const posterSrc = movie.poster_url ? posterMap[movie.poster_url] || movie.poster_url : "/placeholder.svg";

  return (
    <div className="group cursor-pointer animate-fade-in" onClick={onClick}>
      {/* Poster */}
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-3">
        <img
          src={posterSrc}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Rating Badge */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-primary text-primary" />
            <span className="text-sm font-semibold text-foreground">
              {movie.rating ? Number(movie.rating).toFixed(1) : "N/A"}/10
            </span>
            <span className="text-xs text-muted-foreground ml-1">
              {movie.votes_count ? formatVotes(movie.votes_count) : "0"} Votes
            </span>
          </div>
        </div>
        {/* Availability Badge */}
        {movie.availability_status === "limited" && (
          <div className="absolute top-2 right-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded">
            Limited
          </div>
        )}
        {movie.availability_status === "sold_out" && (
          <div className="absolute top-2 right-2 bg-destructive text-white text-xs font-bold px-2 py-1 rounded">
            Sold Out
          </div>
        )}
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold">
            Book Now
          </span>
        </div>
      </div>

      {/* Info */}
      <div>
        <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
          {movie.title}
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          {movie.genres?.join("/") || "General"}
        </p>
      </div>
    </div>
  );
};

export default MovieCard;
