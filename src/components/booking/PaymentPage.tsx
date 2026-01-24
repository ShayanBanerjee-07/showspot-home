import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Smartphone, Loader2, ArrowLeft } from "lucide-react";
import type { Movie } from "@/hooks/useMovies";
import type { Showtime } from "@/hooks/useShowtimes";

interface PaymentPageProps {
  movie: Movie;
  showtime: Showtime;
  selectedSeats: string[];
  totalAmount: number;
  pricePerTicket: number;
  onPayment: () => Promise<void>;
  onBack: () => void;
  isProcessing: boolean;
}

type PaymentMethod = "debit" | "credit" | "upi";

const PaymentPage = ({
  movie,
  showtime,
  selectedSeats,
  totalAmount,
  pricePerTicket,
  onPayment,
  onBack,
  isProcessing,
}: PaymentPageProps) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("upi");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [upiId, setUpiId] = useState("");

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(" ") : value;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  const isFormValid = () => {
    if (paymentMethod === "upi") {
      return upiId.includes("@");
    }
    return (
      cardNumber.replace(/\s/g, "").length === 16 &&
      cardExpiry.length === 5 &&
      cardCvv.length === 3 &&
      cardName.length > 0
    );
  };

  return (
    <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={onBack}
        className="gap-1 -ml-2"
        disabled={isProcessing}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Seats
      </Button>

      {/* Booking Summary */}
      <div className="bg-secondary/50 rounded-lg p-4 space-y-3">
        <h3 className="font-semibold text-foreground">Booking Summary</h3>
        <Separator />
        
        <div className="flex gap-3">
          <img
            src={movie.poster_url || "/placeholder.svg"}
            alt={movie.title}
            className="w-16 h-24 object-cover rounded"
          />
          <div className="flex-1 space-y-1">
            <p className="font-medium text-foreground">{movie.title}</p>
            <p className="text-xs text-muted-foreground">
              {movie.language} • {movie.duration}
            </p>
            <p className="text-xs text-primary">
              {showtime.theater_name}
            </p>
            <p className="text-xs text-muted-foreground">
              {showtime.show_date} • {showtime.show_time.slice(0, 5)}
            </p>
          </div>
        </div>

        <Separator />

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Seats</span>
            <span className="text-foreground font-medium">
              {selectedSeats.sort().join(", ")}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tickets</span>
            <span className="text-foreground">
              {selectedSeats.length} x ₹{pricePerTicket}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Convenience Fee</span>
            <span className="text-foreground">₹0</span>
          </div>
        </div>

        <Separator />

        <div className="flex justify-between text-lg font-bold">
          <span className="text-foreground">Total Amount</span>
          <span className="text-primary">₹{totalAmount}</span>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="space-y-4">
        <h3 className="font-semibold text-foreground">Select Payment Method</h3>
        
        <RadioGroup
          value={paymentMethod}
          onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
          className="space-y-3"
        >
          <div
            className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
              paymentMethod === "upi"
                ? "border-primary bg-primary/10"
                : "border-border hover:bg-secondary/50"
            }`}
            onClick={() => setPaymentMethod("upi")}
          >
            <RadioGroupItem value="upi" id="upi" />
            <Smartphone className="h-5 w-5 text-primary" />
            <Label htmlFor="upi" className="flex-1 cursor-pointer">
              <span className="font-medium">UPI</span>
              <p className="text-xs text-muted-foreground">
                Pay using any UPI app
              </p>
            </Label>
          </div>

          <div
            className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
              paymentMethod === "debit"
                ? "border-primary bg-primary/10"
                : "border-border hover:bg-secondary/50"
            }`}
            onClick={() => setPaymentMethod("debit")}
          >
            <RadioGroupItem value="debit" id="debit" />
            <CreditCard className="h-5 w-5 text-green-500" />
            <Label htmlFor="debit" className="flex-1 cursor-pointer">
              <span className="font-medium">Debit Card</span>
              <p className="text-xs text-muted-foreground">
                Visa, Mastercard, Rupay
              </p>
            </Label>
          </div>

          <div
            className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
              paymentMethod === "credit"
                ? "border-primary bg-primary/10"
                : "border-border hover:bg-secondary/50"
            }`}
            onClick={() => setPaymentMethod("credit")}
          >
            <RadioGroupItem value="credit" id="credit" />
            <CreditCard className="h-5 w-5 text-blue-500" />
            <Label htmlFor="credit" className="flex-1 cursor-pointer">
              <span className="font-medium">Credit Card</span>
              <p className="text-xs text-muted-foreground">
                Visa, Mastercard, Amex
              </p>
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Payment Form */}
      <div className="space-y-4">
        {paymentMethod === "upi" && (
          <div className="space-y-2">
            <Label htmlFor="upi-id">UPI ID</Label>
            <Input
              id="upi-id"
              placeholder="yourname@upi"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              disabled={isProcessing}
            />
            <p className="text-xs text-muted-foreground">
              Enter your UPI ID (e.g., name@paytm, name@gpay)
            </p>
          </div>
        )}

        {(paymentMethod === "debit" || paymentMethod === "credit") && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="card-number">Card Number</Label>
              <Input
                id="card-number"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                maxLength={19}
                disabled={isProcessing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="card-name">Name on Card</Label>
              <Input
                id="card-name"
                placeholder="John Doe"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                disabled={isProcessing}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input
                  id="expiry"
                  placeholder="MM/YY"
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                  maxLength={5}
                  disabled={isProcessing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  type="password"
                  placeholder="•••"
                  value={cardCvv}
                  onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ""))}
                  maxLength={3}
                  disabled={isProcessing}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pay Button */}
      <Button
        onClick={onPayment}
        className="w-full gap-2"
        size="lg"
        disabled={!isFormValid() || isProcessing}
      >
        {isProcessing ? (
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

      <p className="text-xs text-center text-muted-foreground">
        🔒 Your payment is secure and encrypted
      </p>
    </div>
  );
};

export default PaymentPage;
