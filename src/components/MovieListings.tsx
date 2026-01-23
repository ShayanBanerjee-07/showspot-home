import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { useMovies, type Movie } from "@/hooks/useMovies";
import MovieCard from "./MovieCard";
import BookingModal from "./BookingModal";
import { Skeleton } from "@/components/ui/skeleton";

const MovieListings = () => {
  const { data: movies, isLoading } = useMovies();
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  if (isLoading) {
    return (
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i}>
                <Skeleton className="aspect-[2/3] rounded-lg mb-3" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
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
            {movies?.map((movie, index) => (
              <div key={movie.id} style={{ animationDelay: `${index * 100}ms` }}>
                <MovieCard 
                  movie={movie} 
                  onClick={() => setSelectedMovie(movie)}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <BookingModal
        movie={selectedMovie}
        isOpen={!!selectedMovie}
        onClose={() => setSelectedMovie(null)}
      />
    </>
  );
};

export default MovieListings;
