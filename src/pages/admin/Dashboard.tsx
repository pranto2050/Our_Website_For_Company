import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { 
  Users, 
  FolderKanban, 
  TicketCheck, 
  UserCheck,
  UserX,
  Clock,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  ArrowRight
} from "lucide-react";

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingApprovals: 0,
    activeProjects: 0,
    completedProjects: 0,
    openTickets: 0,
    inProgressTickets: 0
  });
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);
  const [recentTickets, setRecentTickets] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // Fetch user stats
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, user_id, full_name, email, registration_status, created_at');

    if (profiles) {
      setStats(prev => ({
        ...prev,
        totalUsers: profiles.length,
        pendingApprovals: profiles.filter(p => p.registration_status === 'pending').length
      }));
      setPendingUsers(profiles.filter(p => p.registration_status === 'pending').slice(0, 5));
    }

    // Fetch project stats
    const { data: projects } = await supabase
      .from('projects')
      .select('id, status');

    if (projects) {
      setStats(prev => ({
        ...prev,
        activeProjects: projects.filter(p => p.status === 'in_progress').length,
        completedProjects: projects.filter(p => p.status === 'completed').length
      }));
    }

    // Fetch ticket stats
    const { data: tickets } = await supabase
      .from('support_tickets')
      .select('id, ticket_number, subject, status, priority, created_at, client_id')
      .order('created_at', { ascending: false })
      .limit(5);

    if (tickets) {
      // Get client info
      const clientIds = [...new Set(tickets.map(t => t.client_id))];
      const { data: clientProfiles } = await supabase
        .from('profiles')
        .select('user_id, full_name')
        .in('user_id', clientIds);

      const enrichedTickets = tickets.map(ticket => ({
        ...ticket,
        client_name: clientProfiles?.find(p => p.user_id === ticket.client_id)?.full_name || 'Unknown'
      }));

      setRecentTickets(enrichedTickets);
      
      const { data: allTickets } = await supabase
        .from('support_tickets')
        .select('id, status');
      
      if (allTickets) {
        setStats(prev => ({
          ...prev,
          openTickets: allTickets.filter(t => t.status === 'open').length,
          inProgressTickets: allTickets.filter(t => t.status === 'in_progress').length
        }));
      }
    }
  };

  const handleApproveUser = async (userId: string) => {
    const { error } = await supabase
      .from('profiles')
      .update({ 
        registration_status: 'approved',
        status_updated_at: new Date().toISOString(),
        status_updated_by: user?.id
      })
      .eq('user_id', userId);

    if (!error) {
      setPendingUsers(prev => prev.filter(u => u.user_id !== userId));
      setStats(prev => ({ ...prev, pendingApprovals: prev.pendingApprovals - 1 }));
    }
  };

  const handleRejectUser = async (userId: string) => {
    const { error } = await supabase
      .from('profiles')
      .update({ 
        registration_status: 'rejected',
        status_updated_at: new Date().toISOString(),
        status_updated_by: user?.id
      })
      .eq('user_id', userId);

    if (!error) {
      setPendingUsers(prev => prev.filter(u => u.user_id !== userId));
      setStats(prev => ({ ...prev, pendingApprovals: prev.pendingApprovals - 1 }));
    }
  };

  return (
    <AdminLayout 
      title="Dashboard" 
      description="Welcome to ABIT Solutions Admin Panel"
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card 
          className="cursor-pointer hover:border-accent/50 transition-colors"
          onClick={() => navigate('/admin/clients')}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Clients
            </CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-accent" />
              Registered clients
            </p>
          </CardContent>
        </Card>

        <Card className="border-destructive/30 cursor-pointer hover:border-destructive/50 transition-colors"
          onClick={() => navigate('/admin/clients')}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Approvals
            </CardTitle>
            <Clock className="w-4 h-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.pendingApprovals}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting review
            </p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:border-accent/50 transition-colors"
          onClick={() => navigate('/admin/projects')}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Projects
            </CardTitle>
            <FolderKanban className="w-4 h-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeProjects}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-accent" />
              {stats.completedProjects} completed
            </p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:border-accent/50 transition-colors"
          onClick={() => navigate('/admin/tickets')}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Open Tickets
            </CardTitle>
            <TicketCheck className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.openTickets}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <AlertCircle className="w-3 h-3 text-yellow-500" />
              {stats.inProgressTickets} in progress
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Approvals Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-destructive" />
                Pending User Approvals
              </CardTitle>
              <CardDescription>
                Review and approve new user registrations
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/admin/clients')}>
              View All
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            {pendingUsers.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No pending approvals at this time.
              </p>
            ) : (
              <div className="space-y-3">
                {pendingUsers.map((pendingUser) => (
                  <div 
                    key={pendingUser.id} 
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">{pendingUser.full_name}</p>
                      <p className="text-sm text-muted-foreground truncate">{pendingUser.email}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="h-8"
                        onClick={() => handleApproveUser(pendingUser.user_id)}
                      >
                        <UserCheck className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="h-8 text-destructive hover:text-destructive"
                        onClick={() => handleRejectUser(pendingUser.user_id)}
                      >
                        <UserX className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Tickets Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TicketCheck className="w-5 h-5 text-accent" />
                Recent Tickets
              </CardTitle>
              <CardDescription>
                Latest support requests
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/admin/tickets')}>
              View All
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            {recentTickets.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No support tickets yet.
              </p>
            ) : (
              <div className="space-y-3">
                {recentTickets.map((ticket) => (
                  <div 
                    key={ticket.id} 
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted transition-colors"
                    onClick={() => navigate(`/admin/tickets/${ticket.id}`)}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-muted-foreground">
                          {ticket.ticket_number}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          ticket.status === 'open' ? 'bg-blue-500/10 text-blue-500' :
                          ticket.status === 'in_progress' ? 'bg-yellow-500/10 text-yellow-500' :
                          'bg-green-500/10 text-green-500'
                        }`}>
                          {ticket.status}
                        </span>
                      </div>
                      <p className="font-medium truncate">{ticket.subject}</p>
                      <p className="text-sm text-muted-foreground">{ticket.client_name}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}