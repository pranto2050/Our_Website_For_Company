import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import {
  CreditCard,
  Shield,
  Check,
  Star,
  Zap,
  Crown,
  Lock,
  Calendar,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string;
  total_amount: number;
}

interface Tier {
  id: string;
  tier_key: string;
  name: string;
  description: string;
  features: string[];
  price_multiplier: number;
  delivery_multiplier: number;
  icon: string;
  color_from: string;
  color_to: string;
}

interface OrderModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

const tierIcons: Record<string, React.ElementType> = {
  Star: Star,
  Zap: Zap,
  Crown: Crown,
};

export function OrderModal({ project, isOpen, onClose }: OrderModalProps) {
  const [step, setStep] = useState<"tier" | "payment">("tier");
  const [selectedTier, setSelectedTier] = useState<Tier | null>(null);
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
  });

  useEffect(() => {
    if (isOpen) {
      fetchTiers();
      setStep("tier");
      setSelectedTier(null);
      setCardDetails({
        cardNumber: "",
        cardHolder: "",
        expiryMonth: "",
        expiryYear: "",
        cvv: "",
      });
    }
  }, [isOpen]);

  const fetchTiers = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("project_tiers")
      .select("*")
      .eq("is_active", true)
      .order("display_order");

    if (!error && data) {
      setTiers(data);
    }
    setIsLoading(false);
  };

  const calculatePrice = (tier: Tier) => {
    if (!project?.total_amount) return 0;
    return project.total_amount * tier.price_multiplier;
  };

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

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.length <= 19) {
      setCardDetails({ ...cardDetails, cardNumber: formatted });
    }
  };

  const handleSubmit = async () => {
    if (!selectedTier || !project) return;

    // Validate card details
    if (
      !cardDetails.cardNumber ||
      !cardDetails.cardHolder ||
      !cardDetails.expiryMonth ||
      !cardDetails.expiryYear ||
      !cardDetails.cvv
    ) {
      toast.error("Please fill in all payment details");
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    toast.success("Order placed successfully! We will contact you shortly.");
    setIsProcessing(false);
    onClose();
  };

  const getTierGradient = (tier: Tier) => {
    const gradients: Record<string, string> = {
      basic: "from-slate-500 to-slate-600",
      normal: "from-blue-500 to-blue-600",
      premium: "from-amber-500 to-orange-600",
    };
    return gradients[tier.tier_key] || "from-slate-500 to-slate-600";
  };

  const TierIcon = selectedTier ? tierIcons[selectedTier.icon] || Star : Star;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        {step === "tier" ? (
          <>
            <DialogHeader className="p-6 pb-0">
              <DialogTitle className="text-2xl font-bold text-center">
                Choose Your Service Package
              </DialogTitle>
              <p className="text-center text-muted-foreground mt-2">
                Select the tier that best fits your needs for{" "}
                <span className="font-semibold text-foreground">
                  {project?.title}
                </span>
              </p>
            </DialogHeader>

            <div className="p-6">
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent" />
                </div>
              ) : (
                <div className="grid md:grid-cols-3 gap-6">
                  {tiers.map((tier) => {
                    const Icon = tierIcons[tier.icon] || Star;
                    const isSelected = selectedTier?.id === tier.id;
                    const price = calculatePrice(tier);

                    return (
                      <div
                        key={tier.id}
                        onClick={() => setSelectedTier(tier)}
                        className={cn(
                          "relative rounded-2xl border-2 p-6 cursor-pointer transition-all duration-300 hover:shadow-xl",
                          isSelected
                            ? "border-accent bg-accent/5 shadow-lg scale-105"
                            : "border-border hover:border-accent/50"
                        )}
                      >
                        {tier.tier_key === "premium" && (
                          <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-600 text-white border-0">
                            Most Popular
                          </Badge>
                        )}

                        <div
                          className={cn(
                            "w-14 h-14 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br",
                            getTierGradient(tier)
                          )}
                        >
                          <Icon className="w-7 h-7 text-white" />
                        </div>

                        <h3 className="text-xl font-bold text-foreground mb-1">
                          {tier.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          {tier.description}
                        </p>

                        <div className="mb-6">
                          <span className="text-3xl font-bold text-foreground">
                            ${price.toLocaleString()}
                          </span>
                          <span className="text-muted-foreground text-sm ml-1">
                            /{" "}
                            {Math.round(30 * tier.delivery_multiplier)} days
                          </span>
                        </div>

                        <Separator className="mb-4" />

                        <ul className="space-y-3">
                          {tier.features?.map((feature, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-2 text-sm"
                            >
                              <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-muted-foreground">
                                {feature}
                              </span>
                            </li>
                          ))}
                        </ul>

                        {isSelected && (
                          <div className="absolute top-4 right-4">
                            <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center">
                              <Check className="w-4 h-4 text-accent-foreground" />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="flex justify-end mt-8">
                <Button
                  onClick={() => setStep("payment")}
                  disabled={!selectedTier}
                  size="lg"
                  className="px-8"
                >
                  Continue to Payment
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            <DialogHeader className="p-6 pb-0">
              <DialogTitle className="text-2xl font-bold text-center">
                Complete Your Payment
              </DialogTitle>
              <p className="text-center text-muted-foreground mt-2">
                Secure checkout for {project?.title}
              </p>
            </DialogHeader>

            <div className="p-6">
              <div className="grid lg:grid-cols-5 gap-8">
                {/* Payment Form */}
                <div className="lg:col-span-3 space-y-6">
                  <div className="flex items-center gap-2 p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
                    <Shield className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-green-700 dark:text-green-400">
                      Your payment is secured with 256-bit SSL encryption
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="cardNumber" className="flex items-center gap-2 mb-2">
                        <CreditCard className="w-4 h-4" />
                        Card Number
                      </Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={cardDetails.cardNumber}
                        onChange={handleCardNumberChange}
                        className="text-lg tracking-wider"
                      />
                    </div>

                    <div>
                      <Label htmlFor="cardHolder" className="flex items-center gap-2 mb-2">
                        <User className="w-4 h-4" />
                        Card Holder Name
                      </Label>
                      <Input
                        id="cardHolder"
                        placeholder="JOHN DOE"
                        value={cardDetails.cardHolder}
                        onChange={(e) =>
                          setCardDetails({
                            ...cardDetails,
                            cardHolder: e.target.value.toUpperCase(),
                          })
                        }
                        className="uppercase"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-2">
                        <Label className="flex items-center gap-2 mb-2">
                          <Calendar className="w-4 h-4" />
                          Expiry Date
                        </Label>
                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            placeholder="MM"
                            maxLength={2}
                            value={cardDetails.expiryMonth}
                            onChange={(e) =>
                              setCardDetails({
                                ...cardDetails,
                                expiryMonth: e.target.value.replace(/\D/g, ""),
                              })
                            }
                          />
                          <Input
                            placeholder="YYYY"
                            maxLength={4}
                            value={cardDetails.expiryYear}
                            onChange={(e) =>
                              setCardDetails({
                                ...cardDetails,
                                expiryYear: e.target.value.replace(/\D/g, ""),
                              })
                            }
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="cvv" className="flex items-center gap-2 mb-2">
                          <Lock className="w-4 h-4" />
                          CVV
                        </Label>
                        <Input
                          id="cvv"
                          type="password"
                          placeholder="•••"
                          maxLength={4}
                          value={cardDetails.cvv}
                          onChange={(e) =>
                            setCardDetails({
                              ...cardDetails,
                              cvv: e.target.value.replace(/\D/g, ""),
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setStep("tier")}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={isProcessing}
                      className="flex-1 bg-gradient-to-r from-accent to-primary hover:opacity-90"
                    >
                      {isProcessing ? (
                        <span className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                          Processing...
                        </span>
                      ) : (
                        <>
                          <Lock className="w-4 h-4 mr-2" />
                          Pay $
                          {selectedTier
                            ? calculatePrice(selectedTier).toLocaleString()
                            : 0}
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-2">
                  <div className="bg-secondary/50 rounded-2xl p-6 sticky top-4">
                    <h3 className="font-semibold text-lg mb-4">Order Summary</h3>

                    {project?.image_url && (
                      <div className="aspect-video rounded-lg overflow-hidden mb-4">
                        <img
                          src={project.image_url}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <h4 className="font-medium text-foreground mb-2">
                      {project?.title}
                    </h4>

                    {selectedTier && (
                      <div
                        className={cn(
                          "flex items-center gap-2 p-3 rounded-lg mb-4 bg-gradient-to-r",
                          getTierGradient(selectedTier)
                        )}
                      >
                        <TierIcon className="w-5 h-5 text-white" />
                        <span className="text-white font-medium">
                          {selectedTier.name} Package
                        </span>
                      </div>
                    )}

                    <Separator className="my-4" />

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Base Price
                        </span>
                        <span>
                          ${project?.total_amount?.toLocaleString() || 0}
                        </span>
                      </div>
                      {selectedTier && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Tier Multiplier
                          </span>
                          <span>x{selectedTier.price_multiplier}</span>
                        </div>
                      )}
                      <Separator className="my-2" />
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span className="text-accent">
                          $
                          {selectedTier
                            ? calculatePrice(selectedTier).toLocaleString()
                            : 0}
                        </span>
                      </div>
                    </div>

                    <div className="mt-6 p-3 bg-background rounded-lg">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Shield className="w-4 h-4 text-green-500" />
                        <span>
                          Secure payment powered by industry-leading encryption
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
