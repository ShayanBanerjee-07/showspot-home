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
import { Ticket, CheckCircle, ArrowLeft, Receipt, Calendar, MapPin } from "lucide-react";
import TheaterSelection from "@/components/booking/TheaterSelection";
import SeatSelection from "@/components/booking/SeatSelection";
import PaymentPage from "@/components/booking/PaymentPage";
import type { Movie } from "@/hooks/useMovies";

interface BookingModalProps {
  movie: Movie | null;
  isOpen: boolean;
  onClose: () => void;
}

type BookingStep = "theaters" | "select" | "seats" | "payment" | "confirmation";

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
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);
  const [bookingId, setBookingId] = useState<string | null>(null);

  const price = movie?.price ? Number(movie.price) : 250;
  const totalAmount = seatsCount * price;

  const handleClose = () => {
    setStep("theaters");
    setSelectedShowtime(null);
    setSeatsCount(1);
    setSelectedSeatIds([]);
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
      case "seats":
        return "Select Your Seats";
      case "payment":
        return "Payment";
      case "confirmation":
        return "Booking Confirmed!";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg bg-card border-border max-h-[90vh] overflow-hidden flex flex-col">
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
              onClick={() => setStep("seats")} 
              className="w-full gap-2"
            >
              <Ticket className="h-4 w-4" />
              Select Seats
            </Button>
          </div>
        )}

        {step === "seats" && selectedShowtime && (
          <div className="py-4">
            <SeatSelection
              availableSeats={selectedShowtime.available_seats ?? 100}
              requiredSeats={seatsCount}
              onConfirm={(seats) => {
                setSelectedSeatIds(seats);
                handleProceedToPayment();
              }}
              onBack={() => setStep("select")}
            />
          </div>
        )}

        {step === "payment" && selectedShowtime && (
          <div className="py-4">
            <PaymentPage
              movie={movie}
              showtime={selectedShowtime}
              selectedSeats={selectedSeatIds}
              totalAmount={totalAmount}
              pricePerTicket={price}
              onPayment={handlePayment}
              onBack={() => setStep("seats")}
              isProcessing={processPayment.isPending || createBooking.isPending}
            />
          </div>
        )}

        {step === "confirmation" && selectedShowtime && (
          <div className="space-y-6 py-4 text-center">
            <CheckCircle className="h-16 w-16 mx-auto text-green-500" />
            <div>
              <h3 className="text-xl font-bold text-foreground">Booking Confirmed!</h3>
              <p className="text-muted-foreground mt-2">
                Your tickets have been booked successfully
              </p>
            </div>

            {/* Booking Receipt */}
            <div className="bg-secondary/50 rounded-lg p-4 text-left space-y-4">
              <div className="flex items-center gap-2 text-primary font-semibold">
                <Receipt className="h-4 w-4" />
                Booking Receipt
              </div>
              
              <div className="flex gap-3">
                <img
                  src={movie.poster_url || "/placeholder.svg"}
                  alt={movie.title}
                  className="w-14 h-20 object-cover rounded"
                />
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{movie.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {movie.language} • {movie.duration}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span className="text-foreground">{selectedShowtime.theater_name}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span className="text-foreground">
                    {selectedShowtime.show_date} at {selectedShowtime.show_time.slice(0, 5)}
                  </span>
                </div>
              </div>

              <div className="border-t border-dashed border-border pt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Seats</span>
                  <span className="text-foreground font-medium">
                    {selectedSeatIds.length > 0 ? selectedSeatIds.sort().join(", ") : `${seatsCount} seat(s)`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tickets</span>
                  <span className="text-foreground">{seatsCount}</span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t border-border">
                  <span className="text-foreground">Amount Paid</span>
                  <span className="text-primary">₹{totalAmount}</span>
                </div>
              </div>

              {bookingId && (
                <div className="text-xs text-center text-muted-foreground pt-2 border-t border-border">
                  Booking ID: {bookingId.slice(0, 8).toUpperCase()}
                </div>
              )}
            </div>

            <p className="text-xs text-muted-foreground">
              📧 Confirmation email has been sent to your registered email
            </p>

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
