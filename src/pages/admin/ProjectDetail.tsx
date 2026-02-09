import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  ArrowLeft, 
  Save, 
  Clock, 
  User, 
  Building, 
  Mail,
  Phone,
  FolderKanban,
  Calendar,
  DollarSign,
  CheckCircle2,
  XCircle,
  Edit,
  FileText,
  TrendingUp
} from "lucide-react";
import { format, differenceInDays } from "date-fns";

interface Project {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  service_type: string | null;
  budget: number | null;
  start_date: string | null;
  due_date: string | null;
  completed_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  client_id: string;
}

interface ClientProfile {
  full_name: string;
  email: string;
  phone: string | null;
  company_name: string | null;
}

const statusConfig: Record<string, { label: string; icon: React.ElementType; className: string }> = {
  pending: { label: "Pending", icon: Clock, className: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" },
  in_progress: { label: "In Progress", icon: FolderKanban, className: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  completed: { label: "Completed", icon: CheckCircle2, className: "bg-green-500/10 text-green-500 border-green-500/20" },
  cancelled: { label: "Cancelled", icon: XCircle, className: "bg-red-500/10 text-red-500 border-red-500/20" },
};

export default function AdminProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [project, setProject] = useState<Project | null>(null);
  const [client, setClient] = useState<ClientProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [progress, setProgress] = useState(0);

  // Edit form state
  const [formData, setFormData] = useState({
    status: '',
    priority: '',
    notes: '',
    due_date: '',
    budget: '',
  });

  useEffect(() => {
    if (id) fetchProjectData();
  }, [id]);

  const fetchProjectData = async () => {
    try {
      const { data: projectData, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setProject(projectData);
      
      // Set initial form data
      setFormData({
        status: projectData.status || 'pending',
        priority: projectData.priority || 'medium',
        notes: projectData.notes || '',
        due_date: projectData.due_date || '',
        budget: projectData.budget?.toString() || '',
      });

      // Calculate mock progress
      if (projectData.status === 'completed') setProgress(100);
      else if (projectData.status === 'in_progress') setProgress(50);
      else setProgress(0);

      // Fetch client profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('full_name, email, phone, company_name')
        .eq('user_id', projectData.client_id)
        .single();

      setClient(profileData);
    } catch (error) {
      console.error('Error fetching project:', error);
      toast.error('Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!project) return;

    setSaving(true);
    try {
      const updateData: Record<string, any> = {
        status: formData.status,
        priority: formData.priority,
        notes: formData.notes || null,
        due_date: formData.due_date || null,
        budget: formData.budget ? parseFloat(formData.budget) : null,
        updated_at: new Date().toISOString(),
      };

      if (formData.status === 'completed' && project.status !== 'completed') {
        updateData.completed_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('projects')
        .update(updateData)
        .eq('id', project.id);

      if (error) throw error;

      setProject({ ...project, ...updateData });
      setIsEditing(false);
      toast.success('Project updated successfully');
    } catch (error) {
      console.error('Error updating project:', error);
      toast.error('Failed to update project');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Loading..." description="Please wait">
        <div className="text-center py-8 text-muted-foreground">Loading project...</div>
      </AdminLayout>
    );
  }

  if (!project) {
    return (
      <AdminLayout title="Project Not Found" description="The requested project could not be found">
        <Button onClick={() => navigate('/admin/projects')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Projects
        </Button>
      </AdminLayout>
    );
  }

  const status = statusConfig[project.status] || statusConfig.pending;
  const StatusIcon = status.icon;

  // Calculate remaining days
  const daysRemaining = project.due_date 
    ? differenceInDays(new Date(project.due_date), new Date()) 
    : null;

  return (
    <AdminLayout 
      title={project.title}
      description={project.service_type || "Project Details"}
    >
      {/* Back Button & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/admin/projects')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Projects
        </Button>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Project
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Project Overview */}
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className={status.className}>
                  <StatusIcon className="w-3 h-3 mr-1" />
                  {status.label}
                </Badge>
                {project.priority && (
                  <Badge variant="outline">
                    {project.priority.charAt(0).toUpperCase() + project.priority.slice(1)} Priority
                  </Badge>
                )}
              </div>
              <CardTitle className="text-xl mt-2">{project.title}</CardTitle>
              {project.description && (
                <CardDescription className="text-base">
                  {project.description}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              {/* Progress Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-accent" />
                    <span className="font-medium">Project Progress</span>
                  </div>
                  <span className="text-2xl font-bold">{progress}%</span>
                </div>
                
                {isEditing ? (
                  <div className="space-y-2">
                    <Slider
                      value={[progress]}
                      onValueChange={([value]) => setProgress(value)}
                      max={100}
                      step={5}
                    />
                    <p className="text-sm text-muted-foreground text-center">
                      Drag to update progress
                    </p>
                  </div>
                ) : (
                  <Progress value={progress} className="h-3" />
                )}

                {daysRemaining !== null && (
                  <div className={`flex items-center gap-2 text-sm ${daysRemaining < 0 ? 'text-destructive' : daysRemaining < 7 ? 'text-yellow-500' : 'text-muted-foreground'}`}>
                    <Clock className="w-4 h-4" />
                    {daysRemaining < 0 
                      ? `Overdue by ${Math.abs(daysRemaining)} days`
                      : daysRemaining === 0 
                      ? 'Due today'
                      : `${daysRemaining} days remaining`
                    }
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Project Details (Editable) */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Project Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {isEditing ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select 
                        value={formData.status} 
                        onValueChange={(v) => setFormData({...formData, status: v})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Priority</Label>
                      <Select 
                        value={formData.priority} 
                        onValueChange={(v) => setFormData({...formData, priority: v})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Due Date</Label>
                      <Input
                        type="date"
                        value={formData.due_date}
                        onChange={(e) => setFormData({...formData, due_date: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Budget ($)</Label>
                      <Input
                        type="number"
                        placeholder="Enter budget"
                        value={formData.budget}
                        onChange={(e) => setFormData({...formData, budget: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Admin Notes</Label>
                    <Textarea
                      placeholder="Add internal notes about this project..."
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      rows={4}
                    />
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Service Type</p>
                    <p className="font-medium">{project.service_type || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Budget</p>
                    <p className="font-medium">
                      {project.budget ? `$${project.budget.toLocaleString()}` : 'Not set'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Start Date</p>
                    <p className="font-medium">
                      {project.start_date ? format(new Date(project.start_date), 'MMM d, yyyy') : 'Not set'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Due Date</p>
                    <p className="font-medium">
                      {project.due_date ? format(new Date(project.due_date), 'MMM d, yyyy') : 'Not set'}
                    </p>
                  </div>
                </div>
              )}

              {!isEditing && project.notes && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Admin Notes</p>
                    <p className="whitespace-pre-wrap">{project.notes}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => {
                  setFormData({...formData, status: 'in_progress'});
                  setIsEditing(true);
                }}
                disabled={project.status === 'in_progress'}
              >
                <FolderKanban className="w-4 h-4 mr-2" />
                Mark In Progress
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start text-green-600"
                onClick={() => {
                  setFormData({...formData, status: 'completed'});
                  setIsEditing(true);
                }}
                disabled={project.status === 'completed'}
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Mark Completed
              </Button>
            </CardContent>
          </Card>

          {/* Client Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Client Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-muted-foreground" />
                <span>{client?.full_name || 'Unknown'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span>{client?.email || 'N/A'}</span>
              </div>
              {client?.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{client.phone}</span>
                </div>
              )}
              {client?.company_name && (
                <div className="flex items-center gap-2 text-sm">
                  <Building className="w-4 h-4 text-muted-foreground" />
                  <span>{client.company_name}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <span className="text-muted-foreground">Created:</span>
                <span className="ml-2">
                  {format(new Date(project.created_at), 'MMM d, yyyy')}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Last Updated:</span>
                <span className="ml-2">
                  {format(new Date(project.updated_at), 'MMM d, yyyy')}
                </span>
              </div>
              {project.completed_at && (
                <div>
                  <span className="text-muted-foreground">Completed:</span>
                  <span className="ml-2">
                    {format(new Date(project.completed_at), 'MMM d, yyyy')}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}