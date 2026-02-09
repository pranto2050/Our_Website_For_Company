import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Plus, 
  Pencil, 
  X,
  Crown,
  Zap,
  Star,
  Rocket,
  Shield,
  Diamond,
  Check,
  Clock,
  DollarSign
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Tier {
  id: string;
  tier_key: string;
  name: string;
  description: string | null;
  icon: string;
  color_from: string;
  color_to: string;
  delivery_multiplier: number;
  price_multiplier: number;
  features: string[];
  display_order: number;
  is_active: boolean;
}

const iconOptions = [
  { value: 'Star', label: 'Star', icon: Star },
  { value: 'Zap', label: 'Zap', icon: Zap },
  { value: 'Crown', label: 'Crown', icon: Crown },
  { value: 'Rocket', label: 'Rocket', icon: Rocket },
  { value: 'Shield', label: 'Shield', icon: Shield },
  { value: 'Diamond', label: 'Diamond', icon: Diamond },
];

const colorOptions = [
  { value: 'slate-500', label: 'Slate' },
  { value: 'blue-500', label: 'Blue' },
  { value: 'amber-500', label: 'Amber' },
  { value: 'orange-500', label: 'Orange' },
  { value: 'green-500', label: 'Green' },
  { value: 'purple-500', label: 'Purple' },
  { value: 'pink-500', label: 'Pink' },
  { value: 'red-500', label: 'Red' },
];

const iconMap: Record<string, React.ElementType> = {
  Star, Zap, Crown, Rocket, Shield, Diamond
};

const colorMap: Record<string, string> = {
  'slate-500': 'from-slate-500 to-slate-600',
  'slate-600': 'from-slate-500 to-slate-600',
  'blue-500': 'from-blue-500 to-blue-600',
  'blue-600': 'from-blue-500 to-blue-600',
  'amber-500': 'from-amber-500 to-orange-500',
  'orange-500': 'from-amber-500 to-orange-500',
  'green-500': 'from-green-500 to-emerald-600',
  'purple-500': 'from-purple-500 to-violet-600',
  'pink-500': 'from-pink-500 to-rose-600',
  'red-500': 'from-red-500 to-rose-600',
};

export default function AdminTiers() {
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTier, setEditingTier] = useState<Tier | null>(null);
  const [newFeature, setNewFeature] = useState("");
  const [formData, setFormData] = useState({
    tier_key: "",
    name: "",
    description: "",
    icon: "Star",
    color_from: "slate-500",
    color_to: "slate-600",
    delivery_multiplier: 1.0,
    price_multiplier: 1.0,
    features: [] as string[],
    display_order: 0,
    is_active: true
  });

  useEffect(() => {
    fetchTiers();
  }, []);

  const fetchTiers = async () => {
    try {
      const { data, error } = await supabase
        .from('project_tiers')
        .select('*')
        .order('display_order');

      if (error) throw error;
      setTiers(data || []);
    } catch (error) {
      console.error('Error fetching tiers:', error);
      toast.error("Failed to load tiers");
    } finally {
      setLoading(false);
    }
  };

  const openEditDialog = (tier: Tier) => {
    setEditingTier(tier);
    setFormData({
      tier_key: tier.tier_key,
      name: tier.name,
      description: tier.description || "",
      icon: tier.icon,
      color_from: tier.color_from,
      color_to: tier.color_to,
      delivery_multiplier: tier.delivery_multiplier,
      price_multiplier: tier.price_multiplier,
      features: tier.features || [],
      display_order: tier.display_order,
      is_active: tier.is_active
    });
    setDialogOpen(true);
  };

  const addFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature("");
    }
  };

  const removeFeature = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter(f => f !== feature)
    }));
  };

  const handleSave = async () => {
    if (!editingTier) return;

    try {
      const { error } = await supabase
        .from('project_tiers')
        .update({
          name: formData.name,
          description: formData.description || null,
          icon: formData.icon,
          color_from: formData.color_from,
          color_to: formData.color_to,
          delivery_multiplier: formData.delivery_multiplier,
          price_multiplier: formData.price_multiplier,
          features: formData.features,
          is_active: formData.is_active
        })
        .eq('id', editingTier.id);

      if (error) throw error;
      toast.success("Tier updated successfully");
      setDialogOpen(false);
      fetchTiers();
    } catch (error: any) {
      console.error('Error saving tier:', error);
      toast.error(error.message || "Failed to save tier");
    }
  };

  const toggleActive = async (tier: Tier) => {
    try {
      const { error } = await supabase
        .from('project_tiers')
        .update({ is_active: !tier.is_active })
        .eq('id', tier.id);

      if (error) throw error;
      fetchTiers();
      toast.success(`Tier ${!tier.is_active ? 'activated' : 'deactivated'}`);
    } catch (error) {
      toast.error("Failed to update tier");
    }
  };

  return (
    <AdminLayout 
      title="Project Tiers" 
      description="Customize tier features, pricing multipliers, and delivery times"
    >
      {/* Info Banner */}
      <Card className="mb-6 border-accent/30 bg-accent/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Crown className="w-5 h-5 text-accent mt-0.5" />
            <div>
              <h3 className="font-semibold">Project Tier System</h3>
              <p className="text-sm text-muted-foreground">
                Each tier has a delivery multiplier (affects base category days) and price multiplier (suggested pricing). 
                Features are shown to clients during project selection.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tiers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            Loading tiers...
          </div>
        ) : (
          tiers.map((tier) => {
            const Icon = iconMap[tier.icon] || Star;
            const gradientClass = colorMap[tier.color_from] || 'from-slate-500 to-slate-600';
            
            return (
              <Card 
                key={tier.id} 
                className={cn(
                  "relative overflow-hidden transition-all",
                  !tier.is_active && "opacity-60"
                )}
              >
                {/* Header Gradient */}
                <div className={cn("h-2 bg-gradient-to-r", gradientClass)} />
                
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br",
                        gradientClass
                      )}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{tier.name}</CardTitle>
                        <Badge variant="outline" className="font-mono text-xs">
                          {tier.tier_key}
                        </Badge>
                      </div>
                    </div>
                    <Switch 
                      checked={tier.is_active}
                      onCheckedChange={() => toggleActive(tier)}
                    />
                  </div>
                  {tier.description && (
                    <CardDescription className="mt-2">{tier.description}</CardDescription>
                  )}
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Multipliers */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-muted/50 text-center">
                      <Clock className="w-4 h-4 mx-auto mb-1 text-blue-500" />
                      <p className="text-xs text-muted-foreground">Delivery</p>
                      <p className="text-lg font-bold">{tier.delivery_multiplier}x</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50 text-center">
                      <DollarSign className="w-4 h-4 mx-auto mb-1 text-green-500" />
                      <p className="text-xs text-muted-foreground">Price</p>
                      <p className="text-lg font-bold">{tier.price_multiplier}x</p>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Features</Label>
                    <div className="space-y-1.5">
                      {(tier.features || []).map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <Check className="w-3.5 h-3.5 text-green-500 shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => openEditDialog(tier)}
                  >
                    <Pencil className="w-4 h-4 mr-2" />
                    Edit Tier
                  </Button>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit {editingTier?.name} Tier</DialogTitle>
            <DialogDescription>
              Customize the tier appearance, multipliers, and features.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Tier Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="key">Tier Key</Label>
                <Input
                  id="key"
                  value={formData.tier_key}
                  disabled
                  className="bg-muted"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe this tier..."
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Icon</Label>
                <Select 
                  value={formData.icon} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, icon: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {iconOptions.map((option) => {
                      const IconComp = option.icon;
                      return (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <IconComp className="w-4 h-4" />
                            {option.label}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Color</Label>
                <Select 
                  value={formData.color_from} 
                  onValueChange={(value) => setFormData(prev => ({ 
                    ...prev, 
                    color_from: value,
                    color_to: value.replace('500', '600')
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {colorOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "w-4 h-4 rounded-full",
                            `bg-${option.value}`
                          )} style={{ backgroundColor: `var(--${option.value.replace('-', '-')})` }} />
                          {option.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="delivery">Delivery Multiplier</Label>
                <Input
                  id="delivery"
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={formData.delivery_multiplier}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    delivery_multiplier: parseFloat(e.target.value) || 1 
                  }))}
                />
                <p className="text-xs text-muted-foreground">
                  {formData.delivery_multiplier < 1 ? 'Faster' : formData.delivery_multiplier > 1 ? 'Slower' : 'Standard'} delivery
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price Multiplier</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.1"
                  min="0.5"
                  value={formData.price_multiplier}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    price_multiplier: parseFloat(e.target.value) || 1 
                  }))}
                />
                <p className="text-xs text-muted-foreground">
                  Suggested pricing: {formData.price_multiplier}x base
                </p>
              </div>
            </div>

            {/* Features Management */}
            <div className="space-y-3">
              <Label>Tier Features</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a feature..."
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                />
                <Button type="button" onClick={addFeature} variant="outline">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-2 max-h-40 overflow-y-auto">
                {formData.features.map((feature, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-green-500" />
                      <span className="text-sm">{feature}</span>
                    </div>
                    <Button 
                      type="button"
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6"
                      onClick={() => removeFeature(feature)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <Label>Active Status</Label>
                <p className="text-xs text-muted-foreground">Show this tier for project selection</p>
              </div>
              <Switch 
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
