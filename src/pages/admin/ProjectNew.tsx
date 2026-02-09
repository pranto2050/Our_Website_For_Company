import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Upload,
  X,
  Plus,
  Crown,
  Zap,
  Star,
  Clock,
  DollarSign,
  Calendar,
  Sparkles,
  Rocket,
  Shield,
  Diamond,
  ImageIcon,
  ArrowLeft,
  Check,
  Globe,
  Palette,
  Smartphone,
  ShoppingCart,
  TrendingUp,
  PenTool,
  Wrench,
  Code,
  Database,
  Layers,
  Monitor,
  Megaphone
} from "lucide-react";
import { format, addDays } from "date-fns";
import { cn } from "@/lib/utils";

interface ProjectCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  base_delivery_days: number;
  deposit_percentage: number;
}

interface ProjectTier {
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

interface Profile {
  user_id: string;
  full_name: string;
  company_name: string | null;
  email: string;
}

const iconMap: Record<string, React.ElementType> = {
  Globe, Palette, Smartphone, ShoppingCart, TrendingUp, PenTool, Wrench, Code, Database, Shield, Layers, Monitor, Megaphone,
  Star, Zap, Crown, Rocket, Diamond
};

const colorMap: Record<string, { gradient: string; border: string; bg: string; text: string }> = {
  'slate-500': { gradient: 'from-slate-500 to-slate-600', border: 'border-slate-500/30', bg: 'bg-slate-500/10', text: 'text-slate-400' },
  'blue-500': { gradient: 'from-blue-500 to-blue-600', border: 'border-blue-500/30', bg: 'bg-blue-500/10', text: 'text-blue-400' },
  'amber-500': { gradient: 'from-amber-500 to-orange-500', border: 'border-amber-500/30', bg: 'bg-amber-500/10', text: 'text-amber-400' },
  'green-500': { gradient: 'from-green-500 to-emerald-600', border: 'border-green-500/30', bg: 'bg-green-500/10', text: 'text-green-400' },
  'purple-500': { gradient: 'from-purple-500 to-violet-600', border: 'border-purple-500/30', bg: 'bg-purple-500/10', text: 'text-purple-400' },
  'pink-500': { gradient: 'from-pink-500 to-rose-600', border: 'border-pink-500/30', bg: 'bg-pink-500/10', text: 'text-pink-400' },
  'red-500': { gradient: 'from-red-500 to-rose-600', border: 'border-red-500/30', bg: 'bg-red-500/10', text: 'text-red-400' },
  'orange-500': { gradient: 'from-amber-500 to-orange-500', border: 'border-amber-500/30', bg: 'bg-amber-500/10', text: 'text-amber-400' },
};

export default function AdminProjectNew() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<ProjectCategory[]>([]);
  const [tiers, setTiers] = useState<ProjectTier[]>([]);
  const [clients, setClients] = useState<Profile[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    client_id: "",
    category_id: "",
    tier_key: "normal",
    total_amount: "",
    delivery_date: "",
    features: [] as string[],
  });
  const [newFeature, setNewFeature] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch categories
      const { data: categoriesData } = await supabase
        .from('project_categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order');

      // Fetch tiers
      const { data: tiersData } = await supabase
        .from('project_tiers')
        .select('*')
        .eq('is_active', true)
        .order('display_order');

      // Fetch approved clients
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('user_id, full_name, company_name, email')
        .eq('registration_status', 'approved');

      if (categoriesData) setCategories(categoriesData);
      if (tiersData) setTiers(tiersData);
      if (profilesData) setClients(profilesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const selectedCategory = categories.find(c => c.id === formData.category_id);
  const selectedTier = tiers.find(t => t.tier_key === formData.tier_key);

  // Calculate delivery days based on category and tier
  const getDeliveryDays = () => {
    if (!selectedCategory || !selectedTier) return 0;
    return Math.ceil(selectedCategory.base_delivery_days * selectedTier.delivery_multiplier);
  };

  // Calculate deposit amount
  const getDepositAmount = () => {
    if (!selectedCategory || !formData.total_amount) return 0;
    return (parseFloat(formData.total_amount) * selectedCategory.deposit_percentage) / 100;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageFile(null);
  };

  const addFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()],
      }));
      setNewFeature("");
    }
  };

  const removeFeature = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter(f => f !== feature),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.client_id || !formData.title) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      let imageUrl = null;

      // Upload image if exists
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('project-images')
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('project-images')
          .getPublicUrl(fileName);

        imageUrl = urlData.publicUrl;
      }

      // Calculate values
      const deliveryDays = getDeliveryDays();
      const dueDate = formData.delivery_date || format(addDays(new Date(), deliveryDays || 30), 'yyyy-MM-dd');
      const depositAmount = getDepositAmount();

      // Create project - use raw insert for new columns not yet in types
      const projectData = {
        client_id: formData.client_id,
        title: formData.title,
        description: formData.description,
        service_type: selectedCategory?.name || null,
        status: 'pending' as const,
        priority: (formData.tier_key === 'premium' ? 'high' : formData.tier_key === 'basic' ? 'low' : 'medium') as 'low' | 'medium' | 'high' | 'urgent',
        due_date: dueDate,
        budget: formData.total_amount ? parseFloat(formData.total_amount) : null,
        notes: formData.features.length > 0 ? `Features: ${formData.features.join(', ')}` : null,
      };

      const { error } = await supabase.from('projects').insert(projectData);

      if (error) throw error;

      toast.success("Project created successfully!");
      navigate('/admin/projects');
    } catch (error: any) {
      console.error('Error creating project:', error);
      toast.error(error.message || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  const getTierColors = (colorFrom: string) => {
    return colorMap[colorFrom] || colorMap['slate-500'];
  };

  return (
    <AdminLayout 
      title="Create New Project" 
      description="Set up a new client project with all details"
    >
      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-6">
        {/* Back Button */}
        <Button 
          type="button" 
          variant="ghost" 
          onClick={() => navigate('/admin/projects')}
          className="mb-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Projects
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Image */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-accent" />
                  Project Image
                </CardTitle>
                <CardDescription>Upload a cover image or mockup for the project</CardDescription>
              </CardHeader>
              <CardContent>
                {imagePreview ? (
                  <div className="relative rounded-xl overflow-hidden border-2 border-dashed border-accent/30">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-48 object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={removeImage}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-muted-foreground/25 rounded-xl cursor-pointer hover:border-accent/50 transition-colors bg-muted/20">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-10 h-10 mb-3 text-muted-foreground" />
                      <p className="mb-2 text-sm text-muted-foreground">
                        <span className="font-semibold text-accent">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground">PNG, JPG or WEBP (max 5MB)</p>
                    </div>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                )}
              </CardContent>
            </Card>

            {/* Project Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-accent" />
                  Project Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Project Name *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., E-Commerce Platform Redesign"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the project requirements and goals..."
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="client">Select Client *</Label>
                  <Select 
                    value={formData.client_id} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, client_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.user_id} value={client.user_id}>
                          {client.full_name} {client.company_name && `(${client.company_name})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Project Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Rocket className="w-5 h-5 text-accent" />
                  Project Features
                </CardTitle>
                <CardDescription>Add features and deliverables for this project</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g., User authentication system"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                  />
                  <Button type="button" onClick={addFeature} variant="outline">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {formData.features.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {formData.features.map((feature, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary"
                        className="px-3 py-1.5 text-sm flex items-center gap-2"
                      >
                        <Check className="w-3 h-3" />
                        {feature}
                        <button
                          type="button"
                          onClick={() => removeFeature(feature)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Right Side */}
          <div className="space-y-6">
            {/* Category Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Project Category</CardTitle>
              </CardHeader>
              <CardContent>
                <Select 
                  value={formData.category_id} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => {
                      const Icon = iconMap[category.icon] || Globe;
                      return (
                        <SelectItem key={category.id} value={category.id}>
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4" />
                            {category.name}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>

                {selectedCategory && (
                  <div className="mt-4 p-3 rounded-lg bg-muted/50 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Base Delivery</span>
                      <span className="font-medium">{selectedCategory.base_delivery_days} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Deposit</span>
                      <span className="font-medium">{selectedCategory.deposit_percentage}%</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tier Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Project Tier</CardTitle>
                <CardDescription>Select the service level</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {tiers.map((tier) => {
                  const Icon = iconMap[tier.icon] || Star;
                  const colors = getTierColors(tier.color_from);
                  const isSelected = formData.tier_key === tier.tier_key;

                  return (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, tier_key: tier.tier_key }))}
                      className={cn(
                        "w-full p-4 rounded-xl border-2 text-left transition-all",
                        isSelected 
                          ? `${colors.border} ${colors.bg}` 
                          : "border-border hover:border-accent/30"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br",
                          colors.gradient
                        )}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold">{tier.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {tier.description}
                          </div>
                        </div>
                        {isSelected && (
                          <div className={cn("w-5 h-5 rounded-full flex items-center justify-center", colors.bg)}>
                            <Check className={cn("w-3 h-3", colors.text)} />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}

                {/* Tier Features */}
                {selectedTier && (
                  <div className="pt-3 space-y-2">
                    {(selectedTier.features || []).map((feature, index) => {
                      const colors = getTierColors(selectedTier.color_from);
                      return (
                        <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Check className={cn("w-3 h-3", colors.text)} />
                          {feature}
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-accent" />
                  Pricing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Total Amount ($)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    value={formData.total_amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, total_amount: e.target.value }))}
                  />
                </div>

                {formData.total_amount && selectedCategory && (
                  <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Deposit ({selectedCategory.deposit_percentage}%)</span>
                      <span className="font-bold text-accent">${getDepositAmount().toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Delivery */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-accent" />
                  Delivery
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="delivery_date">Custom Delivery Date</Label>
                  <Input
                    id="delivery_date"
                    type="date"
                    value={formData.delivery_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, delivery_date: e.target.value }))}
                    min={format(new Date(), 'yyyy-MM-dd')}
                  />
                </div>

                {selectedCategory && selectedTier && (
                  <div className="p-3 rounded-lg bg-muted/50 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Estimated Days</span>
                      <span className="font-medium">{getDeliveryDays()} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Expected Date</span>
                      <span className="font-medium">
                        {formData.delivery_date 
                          ? format(new Date(formData.delivery_date), 'MMM d, yyyy')
                          : format(addDays(new Date(), getDeliveryDays()), 'MMM d, yyyy')
                        }
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Submit Button */}
            <Button 
              type="submit" 
              size="lg" 
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Rocket className="w-4 h-4 mr-2" />
                  Create Project
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}
