import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SeatSelectionProps {
  availableSeats: number;
  requiredSeats: number;
  onConfirm: (selectedSeats: string[]) => void;
  onBack: () => void;
}

interface Seat {
  id: string;
  row: string;
  number: number;
  isAvailable: boolean;
}

const ROWS = ["A", "B", "C", "D", "E", "F", "G", "H"];
const SEATS_PER_ROW = 12;

const generateSeats = (availableSeats: number): Seat[] => {
  const seats: Seat[] = [];
  const totalSeats = ROWS.length * SEATS_PER_ROW;
  
  // Randomly mark some seats as unavailable based on available count
  const unavailableCount = Math.max(0, totalSeats - availableSeats);
  const unavailableIndices = new Set<number>();
  
  while (unavailableIndices.size < unavailableCount) {
    unavailableIndices.add(Math.floor(Math.random() * totalSeats));
  }
  
  let index = 0;
  for (const row of ROWS) {
    for (let num = 1; num <= SEATS_PER_ROW; num++) {
      seats.push({
        id: `${row}${num}`,
        row,
        number: num,
        isAvailable: !unavailableIndices.has(index),
      });
      index++;
    }
  }
  
  return seats;
};

const SeatSelection = ({ availableSeats, requiredSeats, onConfirm, onBack }: SeatSelectionProps) => {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  useEffect(() => {
    setSeats(generateSeats(availableSeats));
    setSelectedSeats([]);
  }, [availableSeats]);

  const handleSeatClick = (seat: Seat) => {
    if (!seat.isAvailable) return;

    setSelectedSeats((prev) => {
      if (prev.includes(seat.id)) {
        return prev.filter((id) => id !== seat.id);
      }
      if (prev.length >= requiredSeats) {
        // Replace the first selected seat
        return [...prev.slice(1), seat.id];
      }
      return [...prev, seat.id];
    });
  };

  const handleConfirm = () => {
    if (selectedSeats.length === requiredSeats) {
      onConfirm(selectedSeats);
    }
  };

  return (
    <div className="space-y-4">
      <Button
        variant="ghost"
        size="sm"
        onClick={onBack}
        className="gap-1 -ml-2 mb-2"
      >
        ← Change Tickets
      </Button>

      {/* Screen indicator */}
      <div className="text-center mb-6">
        <div className="bg-primary/20 text-primary text-sm py-2 px-8 rounded-t-lg mx-auto max-w-xs">
          SCREEN
        </div>
        <div className="h-1 bg-gradient-to-b from-primary/30 to-transparent" />
      </div>

      {/* Seat grid */}
      <div className="overflow-x-auto pb-2">
        <div className="min-w-fit mx-auto">
          {ROWS.map((row) => (
            <div key={row} className="flex items-center justify-center gap-1 mb-1.5">
              <span className="w-5 text-xs text-muted-foreground font-medium">{row}</span>
              <div className="flex gap-1">
                {seats
                  .filter((seat) => seat.row === row)
                  .map((seat) => {
                    const isSelected = selectedSeats.includes(seat.id);
                    const isUnavailable = !seat.isAvailable;

                    return (
                      <button
                        key={seat.id}
                        onClick={() => handleSeatClick(seat)}
                        disabled={isUnavailable}
                        className={cn(
                          "w-7 h-7 text-xs font-medium rounded transition-all flex items-center justify-center",
                          isUnavailable && "bg-muted text-muted-foreground/50 cursor-not-allowed",
                          !isUnavailable && !isSelected && "border-2 border-green-500 text-green-500 hover:bg-green-500/20",
                          isSelected && "bg-green-500 text-white border-2 border-green-500"
                        )}
                        title={isUnavailable ? "Seat unavailable" : `Seat ${seat.id}`}
                      >
                        {seat.number}
                      </button>
                    );
                  })}
              </div>
              <span className="w-5 text-xs text-muted-foreground font-medium">{row}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 text-xs pt-2">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 border-2 border-green-500 rounded" />
          <span className="text-muted-foreground">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-green-500 rounded" />
          <span className="text-muted-foreground">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-muted rounded" />
          <span className="text-muted-foreground">Filled</span>
        </div>
      </div>

      {/* Selection info and confirm */}
      <div className="bg-secondary/50 rounded-lg p-4 mt-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-muted-foreground">
              Selected: <span className="text-foreground font-medium">{selectedSeats.length} / {requiredSeats}</span>
            </p>
            {selectedSeats.length > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                Seats: {selectedSeats.sort().join(", ")}
              </p>
            )}
          </div>
          <Button
            onClick={handleConfirm}
            disabled={selectedSeats.length !== requiredSeats}
          >
            Confirm Seats
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;
