import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useAuth } from "@/hooks/useAuth";
import { useCreateBooking, useProcessPayment } from "@/hooks/useBookings";
import { useGroupedShowtimes, type Showtime } from "@/hooks/useShowtimes";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Ticket, CreditCard, CheckCircle, ArrowLeft } from "lucide-react";
import TheaterSelection from "@/components/booking/TheaterSelection";
import type { Movie } from "@/hooks/useMovies";

interface BookingModalProps {
  movie: Movie | null;
  isOpen: boolean;
  onClose: () => void;
}

type BookingStep = "theaters" | "select" | "payment" | "confirmation";

const BookingModal = ({ movie, isOpen, onClose }: BookingModalProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const createBooking = useCreateBooking();
  const processPayment = useProcessPayment();
  const { data: theaters, isLoading: showtimesLoading } = useGroupedShowtimes(movie?.id);
  
  const [step, setStep] = useState<BookingStep>("theaters");
  const [selectedShowtime, setSelectedShowtime] = useState<Showtime | null>(null);
  const [seatsCount, setSeatsCount] = useState(1);
  const [bookingId, setBookingId] = useState<string | null>(null);

  const price = movie?.price ? Number(movie.price) : 250;
  const totalAmount = seatsCount * price;

  const handleClose = () => {
    setStep("theaters");
    setSelectedShowtime(null);
    setSeatsCount(1);
    setBookingId(null);
    onClose();
  };

  const handleSelectShowtime = (showtime: Showtime) => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to book tickets.",
        variant: "destructive",
      });
      navigate("/auth");
      handleClose();
      return;
    }
    setSelectedShowtime(showtime);
    setStep("select");
  };

  const handleBackToTheaters = () => {
    setSelectedShowtime(null);
    setStep("theaters");
  };

  const handleProceedToPayment = async () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to book tickets.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    if (!movie || !selectedShowtime) return;

    try {
      const booking = await createBooking.mutateAsync({
        movieId: movie.id,
        seatsCount,
        totalAmount,
        showtimeId: selectedShowtime.id,
      });
      setBookingId(booking.id);
      setStep("payment");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Booking failed",
        description: "Could not create booking. Please try again.",
      });
    }
  };

  const handlePayment = async () => {
    if (!bookingId) return;

    try {
      await processPayment.mutateAsync(bookingId);
      setStep("confirmation");
    } catch (error) {
      // Error handled in mutation
    }
  };

  if (!movie) return null;

  const getStepTitle = () => {
    switch (step) {
      case "theaters":
        return "Select Showtime";
      case "select":
        return "Book Tickets";
      case "payment":
        return "Payment";
      case "confirmation":
        return "Booking Confirmed!";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg bg-card border-border max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {getStepTitle()}
          </DialogTitle>
          <DialogDescription>
            {movie.title}
          </DialogDescription>
        </DialogHeader>

        {step === "theaters" && (
          <div className="py-4">
            <TheaterSelection
              movieTitle={movie.title}
              theaters={theaters}
              isLoading={showtimesLoading}
              onSelectShowtime={handleSelectShowtime}
            />
          </div>
        )}

        {step === "select" && selectedShowtime && (
          <div className="space-y-6 py-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToTheaters}
              className="gap-1 -ml-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Change Showtime
            </Button>

            <div className="flex gap-4">
              <img
                src={movie.poster_url || "/placeholder.svg"}
                alt={movie.title}
                className="w-24 h-36 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{movie.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {movie.genres?.join(", ")}
                </p>
                <p className="text-sm text-muted-foreground">
                  {movie.duration} • {movie.language}
                </p>
                <div className="mt-2 text-xs text-primary-foreground bg-primary/80 rounded px-2 py-1 inline-block">
                  {selectedShowtime.theater_name}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {selectedShowtime.show_date} at {selectedShowtime.show_time.slice(0, 5)}
                </p>
                <div className="mt-2 text-primary font-semibold">
                  ₹{price} per ticket
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-foreground">Number of Tickets: {seatsCount}</Label>
              <Slider
                value={[seatsCount]}
                onValueChange={(value) => setSeatsCount(value[0])}
                min={1}
                max={Math.min(10, selectedShowtime.available_seats ?? 10)}
                step={1}
                className="py-2"
              />
            </div>

            <div className="bg-secondary/50 rounded-lg p-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tickets</span>
                <span className="text-foreground">{seatsCount} x ₹{price}</span>
              </div>
              <div className="flex justify-between text-lg font-bold mt-2 pt-2 border-t border-border">
                <span className="text-foreground">Total</span>
                <span className="text-primary">₹{totalAmount}</span>
              </div>
            </div>

            <Button 
              onClick={handleProceedToPayment} 
              className="w-full gap-2"
              disabled={createBooking.isPending}
            >
              {createBooking.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Ticket className="h-4 w-4" />
              )}
              Proceed to Payment
            </Button>
          </div>
        )}

        {step === "payment" && (
          <div className="space-y-6 py-4">
            <div className="bg-secondary/50 rounded-lg p-4 text-center">
              <CreditCard className="h-12 w-12 mx-auto text-primary mb-3" />
              <h3 className="font-semibold text-foreground">Mock Payment</h3>
              <p className="text-sm text-muted-foreground mt-1">
                This is a simulated payment for testing
              </p>
              <div className="text-2xl font-bold text-primary mt-4">
                ₹{totalAmount}
              </div>
            </div>

            <Button 
              onClick={handlePayment} 
              className="w-full gap-2"
              disabled={processPayment.isPending}
            >
              {processPayment.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing Payment...
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4" />
                  Pay ₹{totalAmount}
                </>
              )}
            </Button>
          </div>
        )}

        {step === "confirmation" && selectedShowtime && (
          <div className="space-y-6 py-4 text-center">
            <CheckCircle className="h-16 w-16 mx-auto text-green-500" />
            <div>
              <h3 className="text-xl font-bold text-foreground">Booking Successful!</h3>
              <p className="text-muted-foreground mt-2">
                Your tickets for {movie.title} have been booked.
              </p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-4 text-left space-y-2">
              <div className="text-sm">
                <span className="text-muted-foreground">Theater:</span>
                <span className="text-foreground ml-2">{selectedShowtime.theater_name}</span>
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">Date & Time:</span>
                <span className="text-foreground ml-2">
                  {selectedShowtime.show_date} at {selectedShowtime.show_time.slice(0, 5)}
                </span>
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">Tickets:</span>
                <span className="text-foreground ml-2">{seatsCount}</span>
              </div>
              <div className="pt-2 border-t border-border">
                <span className="text-muted-foreground text-sm">Total Paid:</span>
                <span className="text-primary font-bold ml-2">₹{totalAmount}</span>
              </div>
            </div>
            <Button onClick={handleClose} className="w-full">
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
