import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFeaturedMovies, type Movie } from "@/hooks/useMovies";
import { Skeleton } from "@/components/ui/skeleton";
import heroBanner from "@/assets/hero-banner.jpg";
import moviePoster1 from "@/assets/movie-poster-1.jpg";
import moviePoster2 from "@/assets/movie-poster-2.jpg";
import moviePoster3 from "@/assets/movie-poster-3.jpg";
import moviePoster4 from "@/assets/movie-poster-4.jpg";
import moviePoster5 from "@/assets/movie-poster-5.jpg";
import moviePoster6 from "@/assets/movie-poster-6.jpg";
import BookingModal from "./BookingModal";

// Map poster URLs to local assets
const posterMap: Record<string, string> = {
  "/movie-poster-1.jpg": moviePoster1,
  "/movie-poster-2.jpg": moviePoster2,
  "/movie-poster-3.jpg": moviePoster3,
  "/movie-poster-4.jpg": moviePoster4,
  "/movie-poster-5.jpg": moviePoster5,
  "/movie-poster-6.jpg": moviePoster6,
};

const HeroCarousel = () => {
  const { data: featuredMovies, isLoading } = useFeaturedMovies();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  useEffect(() => {
    if (!featuredMovies?.length) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [featuredMovies]);

  const goToPrevious = () => {
    if (!featuredMovies?.length) return;
    setCurrentIndex((prev) => (prev - 1 + featuredMovies.length) % featuredMovies.length);
  };

  const goToNext = () => {
    if (!featuredMovies?.length) return;
    setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
  };

  if (isLoading) {
    return (
      <section className="relative h-[60vh] md:h-[70vh] overflow-hidden bg-secondary">
        <div className="container mx-auto px-4 h-full flex items-center">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <Skeleton className="w-48 md:w-64 aspect-[2/3] rounded-xl" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-12 w-64" />
              <Skeleton className="h-4 w-96" />
              <Skeleton className="h-10 w-48" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!featuredMovies?.length) {
    return null;
  }

  const currentMovie = featuredMovies[currentIndex];
  const posterSrc = currentMovie.poster_url ? posterMap[currentMovie.poster_url] || currentMovie.poster_url : "/placeholder.svg";

  return (
    <>
      <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src={heroBanner}
            alt="Cinema background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
        </div>

        {/* Content */}
        <div className="relative h-full container mx-auto px-4 flex items-center">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            {/* Movie Poster */}
            <div className="w-48 md:w-64 flex-shrink-0 animate-scale-in">
              <div className="aspect-[2/3] rounded-xl overflow-hidden shadow-2xl shadow-primary/20 ring-1 ring-white/10">
                <img
                  src={posterSrc}
                  alt={currentMovie.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Movie Info */}
            <div className="text-center md:text-left max-w-xl animate-slide-in">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                {currentMovie.genres?.map((genre) => (
                  <span
                    key={genre}
                    className="px-3 py-1 text-xs font-medium bg-genre-tag rounded-full text-foreground"
                  >
                    {genre}
                  </span>
                ))}
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-3">
                {currentMovie.title}
              </h1>
              <p className="text-muted-foreground mb-4 text-sm md:text-base">
                {currentMovie.description}
              </p>
              <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-muted-foreground mb-6">
                <span>{currentMovie.language}</span>
                <span>•</span>
                <span>{currentMovie.duration}</span>
                <span>•</span>
                <span>
                  {currentMovie.release_date 
                    ? new Date(currentMovie.release_date).toLocaleDateString("en-US", { 
                        month: "short", 
                        day: "numeric", 
                        year: "numeric" 
                      })
                    : "Coming Soon"
                  }
                </span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-3">
                <Button 
                  size="lg" 
                  className="gap-2"
                  onClick={() => setSelectedMovie(currentMovie)}
                  disabled={currentMovie.availability_status === "sold_out"}
                >
                  <Play className="h-4 w-4 fill-current" />
                  Book Tickets
                </Button>
                <Button size="lg" variant="outline">
                  Watch Trailer
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/50 backdrop-blur hover:bg-background/80 transition-colors"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/50 backdrop-blur hover:bg-background/80 transition-colors"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {featuredMovies.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? "bg-primary w-6"
                  : "bg-foreground/30 hover:bg-foreground/50"
              }`}
            />
          ))}
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

export default HeroCarousel;
