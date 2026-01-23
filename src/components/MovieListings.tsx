import { ChevronRight } from "lucide-react";
import { movies } from "@/data/movies";
import MovieCard from "./MovieCard";

const MovieListings = () => {
  return (
    <section className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Recommended Movies
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              Top picks for you based on popular releases
            </p>
          </div>
          <button className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors text-sm font-medium">
            See All
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Movie Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {movies.map((movie, index) => (
            <div key={movie.id} style={{ animationDelay: `${index * 100}ms` }}>
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MovieListings;
