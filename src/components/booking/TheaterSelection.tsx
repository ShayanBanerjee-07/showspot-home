import { format, parseISO } from "date-fns";
import { MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Showtime, TheaterShowtimes } from "@/hooks/useShowtimes";

interface TheaterSelectionProps {
  movieTitle: string;
  theaters: TheaterShowtimes[];
  isLoading: boolean;
  onSelectShowtime: (showtime: Showtime) => void;
}

const TheaterSelection = ({ 
  movieTitle, 
  theaters, 
  isLoading, 
  onSelectShowtime 
}: TheaterSelectionProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (theaters.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No showtimes available for this movie.</p>
      </div>
    );
  }

  // Group showtimes by date for each theater
  const groupByDate = (showtimes: Showtime[]) => {
    const dateMap = new Map<string, Showtime[]>();
    
    showtimes.forEach((showtime) => {
      const dateKey = showtime.show_date;
      if (!dateMap.has(dateKey)) {
        dateMap.set(dateKey, []);
      }
      dateMap.get(dateKey)!.push(showtime);
    });
    
    return Array.from(dateMap.entries());
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-foreground">
        Theaters Showing {movieTitle}
      </h2>
      
      <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2">
        {theaters.map((theater) => (
          <div 
            key={theater.theaterName} 
            className="bg-secondary/30 rounded-lg p-4 border border-border"
          >
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground text-lg">
                {theater.theaterName}
              </h3>
            </div>
            
            <div className="space-y-4">
              {groupByDate(theater.showtimes).map(([date, showtimes]) => (
                <div key={date}>
                  <p className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {format(parseISO(date), "EEEE, MMM d, yyyy")}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {showtimes.map((showtime) => (
                      <Button
                        key={showtime.id}
                        variant="outline"
                        size="sm"
                        onClick={() => onSelectShowtime(showtime)}
                        className="hover:bg-primary hover:text-primary-foreground transition-colors"
                        disabled={(showtime.available_seats ?? 0) === 0}
                      >
                        {showtime.show_time.slice(0, 5)}
                        {(showtime.available_seats ?? 0) < 20 && (showtime.available_seats ?? 0) > 0 && (
                          <span className="ml-1 text-xs text-yellow-500">
                            ({showtime.available_seats} left)
                          </span>
                        )}
                        {(showtime.available_seats ?? 0) === 0 && (
                          <span className="ml-1 text-xs text-destructive">
                            Sold Out
                          </span>
                        )}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TheaterSelection;
