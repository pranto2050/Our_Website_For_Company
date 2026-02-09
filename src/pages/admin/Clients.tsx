import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { 
  Search, 
  UserCheck,
  UserX,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  Ban,
  Eye,
  Mail,
  Phone,
  Building,
  Calendar,
  Globe
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";

interface Client {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  company_name: string | null;
  country: string | null;
  registration_status: string;
  created_at: string;
  services_interested: string[] | null;
  project_description: string | null;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" },
  approved: { label: "Approved", className: "bg-green-500/10 text-green-500 border-green-500/20" },
  rejected: { label: "Rejected", className: "bg-red-500/10 text-red-500 border-red-500/20" },
  suspended: { label: "Suspended", className: "bg-orange-500/10 text-orange-500 border-orange-500/20" },
};

export default function AdminClients() {
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateClientStatus = async (clientUserId: string, newStatus: 'pending' | 'approved' | 'rejected' | 'suspended') => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          registration_status: newStatus,
          status_updated_at: new Date().toISOString(),
          status_updated_by: user?.id,
        })
        .eq('user_id', clientUserId);

      if (error) throw error;

      setClients(prev => 
        prev.map(c =>
          c.user_id === clientUserId 
            ? { ...c, registration_status: newStatus }
            : c
        )
      );

      if (selectedClient?.user_id === clientUserId) {
        setSelectedClient({ ...selectedClient, registration_status: newStatus });
      }

      toast.success(`Client ${newStatus}`);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.company_name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || client.registration_status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: clients.length,
    pending: clients.filter(c => c.registration_status === 'pending').length,
    approved: clients.filter(c => c.registration_status === 'approved').length,
    suspended: clients.filter(c => c.registration_status === 'suspended').length,
  };

  const viewClient = (client: Client) => {
    setSelectedClient(client);
    setDialogOpen(true);
  };

  return (
    <AdminLayout 
      title="Client Management" 
      description="Manage client registrations and accounts"
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-muted rounded-lg">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-sm text-muted-foreground">Total Clients</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-yellow-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-500">{stats.pending}</div>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-green-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-500">{stats.approved}</div>
                <p className="text-sm text-muted-foreground">Approved</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-orange-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <Ban className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-500">{stats.suspended}</div>
                <p className="text-sm text-muted-foreground">Suspended</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search clients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Clients List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            All Clients ({filteredClients.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading clients...</div>
          ) : filteredClients.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No clients found matching your criteria.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredClients.map((client) => {
                const status = statusConfig[client.registration_status] || statusConfig.pending;

                return (
                  <div
                    key={client.id}
                    className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium truncate">{client.full_name}</h3>
                        <Badge variant="outline" className={status.className}>
                          {status.label}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {client.email}
                        </span>
                        {client.company_name && (
                          <span className="flex items-center gap-1">
                            <Building className="w-3 h-3" />
                            {client.company_name}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDistanceToNow(new Date(client.created_at), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-3 md:mt-0">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => viewClient(client)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      {client.registration_status === 'pending' && (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-green-600"
                            onClick={() => updateClientStatus(client.user_id, 'approved')}
                          >
                            <UserCheck className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-red-600"
                            onClick={() => updateClientStatus(client.user_id, 'rejected')}
                          >
                            <UserX className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                      {client.registration_status === 'approved' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-orange-600"
                          onClick={() => updateClientStatus(client.user_id, 'suspended')}
                        >
                          <Ban className="w-4 h-4 mr-1" />
                          Suspend
                        </Button>
                      )}
                      {client.registration_status === 'suspended' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-green-600"
                          onClick={() => updateClientStatus(client.user_id, 'approved')}
                        >
                          <UserCheck className="w-4 h-4 mr-1" />
                          Reactivate
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Client Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Client Details</DialogTitle>
            <DialogDescription>
              View and manage client information
            </DialogDescription>
          </DialogHeader>
          {selectedClient && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">{selectedClient.full_name}</h3>
                  {selectedClient.company_name && (
                    <p className="text-muted-foreground">{selectedClient.company_name}</p>
                  )}
                </div>
                <Badge variant="outline" className={statusConfig[selectedClient.registration_status]?.className}>
                  {statusConfig[selectedClient.registration_status]?.label}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>{selectedClient.email}</span>
                </div>
                {selectedClient.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{selectedClient.phone}</span>
                  </div>
                )}
                {selectedClient.country && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    <span>{selectedClient.country}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>Joined {format(new Date(selectedClient.created_at), 'MMM d, yyyy')}</span>
                </div>
              </div>

              {selectedClient.services_interested && selectedClient.services_interested.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Services Interested</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedClient.services_interested.map((service, i) => (
                      <Badge key={i} variant="secondary">{service}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {selectedClient.project_description && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Project Description</p>
                  <p className="text-sm bg-muted p-3 rounded-lg">{selectedClient.project_description}</p>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4 border-t">
                {selectedClient.registration_status === 'pending' && (
                  <>
                    <Button 
                      variant="outline"
                      className="text-red-600"
                      onClick={() => {
                        updateClientStatus(selectedClient.user_id, 'rejected');
                        setDialogOpen(false);
                      }}
                    >
                      <UserX className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                    <Button 
                      onClick={() => {
                        updateClientStatus(selectedClient.user_id, 'approved');
                        setDialogOpen(false);
                      }}
                    >
                      <UserCheck className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                  </>
                )}
                {selectedClient.registration_status === 'approved' && (
                  <Button 
                    variant="outline"
                    className="text-orange-600"
                    onClick={() => {
                      updateClientStatus(selectedClient.user_id, 'suspended');
                      setDialogOpen(false);
                    }}
                  >
                    <Ban className="w-4 h-4 mr-2" />
                    Suspend Account
                  </Button>
                )}
                {selectedClient.registration_status === 'suspended' && (
                  <Button 
                    onClick={() => {
                      updateClientStatus(selectedClient.user_id, 'approved');
                      setDialogOpen(false);
                    }}
                  >
                    <UserCheck className="w-4 h-4 mr-2" />
                    Reactivate Account
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}