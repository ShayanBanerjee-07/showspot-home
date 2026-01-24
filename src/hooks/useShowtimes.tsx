import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Showtime = Tables<"showtimes">;

export interface TheaterShowtimes {
  theaterName: string;
  showtimes: Showtime[];
}

export const useShowtimes = (movieId: string | undefined) => {
  return useQuery({
    queryKey: ["showtimes", movieId],
    queryFn: async () => {
      if (!movieId) return [];
      
      const { data, error } = await supabase
        .from("showtimes")
        .select("*")
        .eq("movie_id", movieId)
        .gte("show_date", new Date().toISOString().split("T")[0])
        .order("show_date", { ascending: true })
        .order("show_time", { ascending: true });

      if (error) throw error;
      return data as Showtime[];
    },
    enabled: !!movieId,
  });
};

export const useGroupedShowtimes = (movieId: string | undefined) => {
  const { data: showtimes, ...rest } = useShowtimes(movieId);

  const grouped: TheaterShowtimes[] = [];
  
  if (showtimes) {
    const theaterMap = new Map<string, Showtime[]>();
    
    showtimes.forEach((showtime) => {
      const theaterName = showtime.theater_name || "Unknown Theater";
      if (!theaterMap.has(theaterName)) {
        theaterMap.set(theaterName, []);
      }
      theaterMap.get(theaterName)!.push(showtime);
    });
    
    theaterMap.forEach((showtimes, theaterName) => {
      grouped.push({ theaterName, showtimes });
    });
  }

  return { data: grouped, showtimes, ...rest };
};
