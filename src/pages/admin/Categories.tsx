import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
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
  Trash2, 
  FolderOpen,
  Clock,
  Percent,
  Globe,
  Palette,
  Smartphone,
  ShoppingCart,
  TrendingUp,
  PenTool,
  Wrench,
  Code,
  Database,
  Shield,
  Layers,
  Monitor,
  Megaphone,
  GripVertical
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  base_delivery_days: number;
  deposit_percentage: number;
  is_active: boolean;
  display_order: number;
}

const iconOptions = [
  { value: 'Globe', label: 'Globe', icon: Globe },
  { value: 'Palette', label: 'Palette', icon: Palette },
  { value: 'Smartphone', label: 'Smartphone', icon: Smartphone },
  { value: 'ShoppingCart', label: 'Shopping Cart', icon: ShoppingCart },
  { value: 'TrendingUp', label: 'Trending Up', icon: TrendingUp },
  { value: 'PenTool', label: 'Pen Tool', icon: PenTool },
  { value: 'Wrench', label: 'Wrench', icon: Wrench },
  { value: 'Code', label: 'Code', icon: Code },
  { value: 'Database', label: 'Database', icon: Database },
  { value: 'Shield', label: 'Shield', icon: Shield },
  { value: 'Layers', label: 'Layers', icon: Layers },
  { value: 'Monitor', label: 'Monitor', icon: Monitor },
  { value: 'Megaphone', label: 'Megaphone', icon: Megaphone },
];

const iconMap: Record<string, React.ElementType> = {
  Globe, Palette, Smartphone, ShoppingCart, TrendingUp, PenTool, Wrench, Code, Database, Shield, Layers, Monitor, Megaphone
};

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    icon: "Globe",
    base_delivery_days: 30,
    deposit_percentage: 30,
    is_active: true,
    display_order: 0
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('project_categories')
        .select('*')
        .order('display_order');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const openAddDialog = () => {
    setEditingCategory(null);
    setFormData({
      name: "",
      slug: "",
      description: "",
      icon: "Globe",
      base_delivery_days: 30,
      deposit_percentage: 30,
      is_active: true,
      display_order: categories.length
    });
    setDialogOpen(true);
  };

  const openEditDialog = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      icon: category.icon || "Globe",
      base_delivery_days: category.base_delivery_days,
      deposit_percentage: category.deposit_percentage,
      is_active: category.is_active,
      display_order: category.display_order
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.slug) {
      toast.error("Name and slug are required");
      return;
    }

    try {
      if (editingCategory) {
        const { error } = await supabase
          .from('project_categories')
          .update({
            name: formData.name,
            slug: formData.slug,
            description: formData.description || null,
            icon: formData.icon,
            base_delivery_days: formData.base_delivery_days,
            deposit_percentage: formData.deposit_percentage,
            is_active: formData.is_active,
            display_order: formData.display_order
          })
          .eq('id', editingCategory.id);

        if (error) throw error;
        toast.success("Category updated successfully");
      } else {
        const { error } = await supabase
          .from('project_categories')
          .insert({
            name: formData.name,
            slug: formData.slug,
            description: formData.description || null,
            icon: formData.icon,
            base_delivery_days: formData.base_delivery_days,
            deposit_percentage: formData.deposit_percentage,
            is_active: formData.is_active,
            display_order: formData.display_order
          });

        if (error) throw error;
        toast.success("Category created successfully");
      }

      setDialogOpen(false);
      fetchCategories();
    } catch (error: any) {
      console.error('Error saving category:', error);
      toast.error(error.message || "Failed to save category");
    }
  };

  const handleDelete = async () => {
    if (!editingCategory) return;

    try {
      const { error } = await supabase
        .from('project_categories')
        .delete()
        .eq('id', editingCategory.id);

      if (error) throw error;
      toast.success("Category deleted successfully");
      setDeleteDialogOpen(false);
      setEditingCategory(null);
      fetchCategories();
    } catch (error: any) {
      console.error('Error deleting category:', error);
      toast.error(error.message || "Failed to delete category");
    }
  };

  const toggleActive = async (category: Category) => {
    try {
      const { error } = await supabase
        .from('project_categories')
        .update({ is_active: !category.is_active })
        .eq('id', category.id);

      if (error) throw error;
      fetchCategories();
      toast.success(`Category ${!category.is_active ? 'activated' : 'deactivated'}`);
    } catch (error) {
      toast.error("Failed to update category");
    }
  };

  return (
    <AdminLayout 
      title="Project Categories" 
      description="Manage project categories with delivery times and deposit settings"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <FolderOpen className="w-5 h-5 text-accent" />
          <span className="text-muted-foreground">{categories.length} categories</span>
        </div>
        <Button onClick={openAddDialog}>
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            Loading categories...
          </div>
        ) : categories.length === 0 ? (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            No categories found. Add your first category to get started.
          </div>
        ) : (
          categories.map((category) => {
            const Icon = iconMap[category.icon || 'Globe'] || Globe;
            
            return (
              <Card 
                key={category.id} 
                className={`relative transition-all ${!category.is_active ? 'opacity-60' : ''}`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-primary flex items-center justify-center">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{category.name}</CardTitle>
                        <p className="text-xs text-muted-foreground font-mono">{category.slug}</p>
                      </div>
                    </div>
                    <Switch 
                      checked={category.is_active}
                      onCheckedChange={() => toggleActive(category)}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  {category.description && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {category.description}
                    </p>
                  )}

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                      <Clock className="w-4 h-4 text-blue-500" />
                      <div>
                        <p className="text-xs text-muted-foreground">Delivery</p>
                        <p className="text-sm font-semibold">{category.base_delivery_days} days</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                      <Percent className="w-4 h-4 text-green-500" />
                      <div>
                        <p className="text-xs text-muted-foreground">Deposit</p>
                        <p className="text-sm font-semibold">{category.deposit_percentage}%</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => openEditDialog(category)}
                    >
                      <Pencil className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-destructive hover:text-destructive"
                      onClick={() => {
                        setEditingCategory(category);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </DialogTitle>
            <DialogDescription>
              Configure the category details, delivery time, and deposit percentage.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Category Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Web Development"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      name: e.target.value,
                      slug: editingCategory ? prev.slug : generateSlug(e.target.value)
                    }));
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  placeholder="web-development"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe this category..."
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="delivery">Base Delivery (days)</Label>
                <Input
                  id="delivery"
                  type="number"
                  min="1"
                  value={formData.base_delivery_days}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    base_delivery_days: parseInt(e.target.value) || 1 
                  }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deposit">Deposit (%)</Label>
                <Input
                  id="deposit"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.deposit_percentage}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    deposit_percentage: parseInt(e.target.value) || 0 
                  }))}
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <Label>Active Status</Label>
                <p className="text-xs text-muted-foreground">Show this category for new projects</p>
              </div>
              <Switch 
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>
              {editingCategory ? 'Update Category' : 'Create Category'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{editingCategory?.name}"? 
              This action cannot be undone and may affect existing projects using this category.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
