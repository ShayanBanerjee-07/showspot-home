import { useState, useMemo } from "react";
import { format, parseISO, isToday, isTomorrow, addDays } from "date-fns";
import { MapPin, Clock, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
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
  // Get all unique dates from showtimes
  const availableDates = useMemo(() => {
    const dateSet = new Set<string>();
    theaters.forEach((theater) => {
      theater.showtimes.forEach((showtime) => {
        dateSet.add(showtime.show_date);
      });
    });
    return Array.from(dateSet).sort();
  }, [theaters]);

  const [selectedDate, setSelectedDate] = useState<string | null>(
    availableDates.length > 0 ? availableDates[0] : null
  );

  // Filter theaters and showtimes by selected date
  const filteredTheaters = useMemo(() => {
    if (!selectedDate) return [];
    
    return theaters
      .map((theater) => ({
        ...theater,
        showtimes: theater.showtimes.filter(
          (showtime) => showtime.show_date === selectedDate
        ),
      }))
      .filter((theater) => theater.showtimes.length > 0);
  }, [theaters, selectedDate]);

  const getDateLabel = (dateStr: string) => {
    const date = parseISO(dateStr);
    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    return format(date, "EEE");
  };

  const getDateNumber = (dateStr: string) => {
    return format(parseISO(dateStr), "d");
  };

  const getMonth = (dateStr: string) => {
    return format(parseISO(dateStr), "MMM");
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-16 w-full" />
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

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-foreground">
        Theaters Showing {movieTitle}
      </h2>

      {/* Horizontal Date Selector */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>Select Date</span>
        </div>
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex gap-2 pb-2">
            {availableDates.map((dateStr) => (
              <button
                key={dateStr}
                onClick={() => setSelectedDate(dateStr)}
                className={cn(
                  "flex flex-col items-center justify-center min-w-[70px] px-3 py-2 rounded-lg border-2 transition-all",
                  selectedDate === dateStr
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-secondary/30 text-muted-foreground hover:border-primary/50 hover:bg-secondary/50"
                )}
              >
                <span className="text-xs font-medium">{getDateLabel(dateStr)}</span>
                <span className="text-xl font-bold">{getDateNumber(dateStr)}</span>
                <span className="text-xs">{getMonth(dateStr)}</span>
              </button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* Theaters and Showtimes for Selected Date */}
      {selectedDate && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Showtimes for {format(parseISO(selectedDate), "EEEE, MMM d, yyyy")}
          </p>
          
          <div className="space-y-4 max-h-[280px] overflow-y-auto pr-2">
            {filteredTheaters.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                No showtimes available for this date.
              </p>
            ) : (
              filteredTheaters.map((theater) => (
                <div 
                  key={theater.theaterName} 
                  className="bg-secondary/30 rounded-lg p-4 border border-border"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="h-4 w-4 text-primary" />
                    <h3 className="font-semibold text-foreground">
                      {theater.theaterName}
                    </h3>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {theater.showtimes
                      .sort((a, b) => a.show_time.localeCompare(b.show_time))
                      .map((showtime) => (
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
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TheaterSelection;
