import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { featuredMovies } from "@/data/movies";
import heroBanner from "@/assets/hero-banner.jpg";

const HeroCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredMovies.length) % featuredMovies.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
  };

  const currentMovie = featuredMovies[currentIndex];

  return (
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
                src={currentMovie.poster}
                alt={currentMovie.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Movie Info */}
          <div className="text-center md:text-left max-w-xl animate-slide-in">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
              {currentMovie.genres.map((genre) => (
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
              <span>{currentMovie.releaseDate}</span>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-3">
              <Button size="lg" className="gap-2">
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
  );
};

export default HeroCarousel;
