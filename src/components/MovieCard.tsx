import { Star } from "lucide-react";
import { Movie } from "@/data/movies";

interface MovieCardProps {
  movie: Movie;
}

const MovieCard = ({ movie }: MovieCardProps) => {
  return (
    <div className="group cursor-pointer animate-fade-in">
      {/* Poster */}
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-3">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Rating Badge */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-primary text-primary" />
            <span className="text-sm font-semibold text-foreground">{movie.rating}/10</span>
            <span className="text-xs text-muted-foreground ml-1">{movie.votes} Votes</span>
          </div>
        </div>
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Info */}
      <div>
        <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
          {movie.title}
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          {movie.genres.join("/")}
        </p>
      </div>
    </div>
  );
};

export default MovieCard;
