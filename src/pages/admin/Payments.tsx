import React, { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  Plus,
  Search,
  Filter,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  CreditCard,
  Building,
  Wallet,
  Banknote,
  Bitcoin,
  MoreHorizontal,
  Eye,
  Edit,
  TrendingUp,
  TrendingDown,
  Calendar,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type PaymentStatus = "pending" | "completed" | "failed" | "rejected";
type PaymentType = "bank_transfer" | "credit_card" | "paypal" | "cash" | "crypto" | "other";

interface Payment {
  id: string;
  client_id: string;
  project_id: string | null;
  amount: number;
  payment_type: PaymentType;
  status: PaymentStatus;
  transaction_id: string | null;
  notes: string | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
}

interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  company_name: string | null;
}

interface Project {
  id: string;
  title: string;
  budget: number | null;
}

const statusConfig: Record<PaymentStatus, { label: string; icon: React.ElementType; className: string }> = {
  pending: { label: "Pending", icon: Clock, className: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
  completed: { label: "Completed", icon: CheckCircle, className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
  failed: { label: "Failed", icon: AlertCircle, className: "bg-red-500/10 text-red-500 border-red-500/20" },
  rejected: { label: "Rejected", icon: XCircle, className: "bg-destructive/10 text-destructive border-destructive/20" },
};

const paymentTypeConfig: Record<PaymentType, { label: string; icon: React.ElementType }> = {
  bank_transfer: { label: "Bank Transfer", icon: Building },
  credit_card: { label: "Credit Card", icon: CreditCard },
  paypal: { label: "PayPal", icon: Wallet },
  cash: { label: "Cash", icon: Banknote },
  crypto: { label: "Crypto", icon: Bitcoin },
  other: { label: "Other", icon: MoreHorizontal },
};

export default function AdminPayments() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [formData, setFormData] = useState({
    client_id: "",
    project_id: "",
    amount: "",
    payment_type: "bank_transfer" as PaymentType,
    status: "pending" as PaymentStatus,
    transaction_id: "",
    notes: "",
  });

  // Fetch payments with client and project info
  const { data: payments = [], isLoading } = useQuery({
    queryKey: ["admin-payments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payments")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Payment[];
    },
  });

  // Fetch clients for dropdown
  const { data: clients = [] } = useQuery({
    queryKey: ["admin-clients-list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, user_id, full_name, email, company_name")
        .eq("registration_status", "approved");

      if (error) throw error;
      return data as Profile[];
    },
  });

  // Fetch projects for dropdown
  const { data: projects = [] } = useQuery({
    queryKey: ["admin-projects-list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("id, title, budget");

      if (error) throw error;
      return data as Project[];
    },
  });

  // Create payment mutation
  const createPayment = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase.from("payments").insert({
        client_id: data.client_id,
        project_id: data.project_id || null,
        amount: parseFloat(data.amount),
        payment_type: data.payment_type,
        status: data.status,
        transaction_id: data.transaction_id || null,
        notes: data.notes || null,
        paid_at: data.status === "completed" ? new Date().toISOString() : null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-payments"] });
      toast.success("Payment created successfully");
      setIsAddDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error("Failed to create payment: " + error.message);
    },
  });

  // Update payment status mutation
  const updatePaymentStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: PaymentStatus }) => {
      const updateData: Record<string, unknown> = { status };
      if (status === "completed") {
        updateData.paid_at = new Date().toISOString();
      }
      const { error } = await supabase
        .from("payments")
        .update(updateData)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-payments"] });
      toast.success("Payment status updated");
    },
    onError: (error) => {
      toast.error("Failed to update payment: " + error.message);
    },
  });

  const resetForm = () => {
    setFormData({
      client_id: "",
      project_id: "",
      amount: "",
      payment_type: "bank_transfer",
      status: "pending",
      transaction_id: "",
      notes: "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.client_id || !formData.amount) {
      toast.error("Please fill in required fields");
      return;
    }
    createPayment.mutate(formData);
  };

  // Filter payments
  const filteredPayments = payments.filter((payment) => {
    const client = clients.find((c) => c.user_id === payment.client_id);
    const project = projects.find((p) => p.id === payment.project_id);
    
    const matchesSearch =
      client?.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.transaction_id?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const stats = {
    total: payments.reduce((sum, p) => sum + Number(p.amount), 0),
    completed: payments.filter((p) => p.status === "completed").reduce((sum, p) => sum + Number(p.amount), 0),
    pending: payments.filter((p) => p.status === "pending").reduce((sum, p) => sum + Number(p.amount), 0),
    failed: payments.filter((p) => p.status === "failed" || p.status === "rejected").length,
  };

  const getClientName = (clientId: string) => {
    const client = clients.find((c) => c.user_id === clientId);
    return client?.full_name || "Unknown Client";
  };

  const getProjectTitle = (projectId: string | null) => {
    if (!projectId) return "No Project";
    const project = projects.find((p) => p.id === projectId);
    return project?.title || "Unknown Project";
  };

  return (
    <AdminLayout
      title="Payment Management"
      description="Track and manage all client payments"
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="border-border/50 bg-gradient-to-br from-card to-muted/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">${stats.total.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-gradient-to-br from-card to-emerald-500/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-emerald-500">${stats.completed.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-emerald-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-gradient-to-br from-card to-amber-500/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-amber-500">${stats.pending.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-gradient-to-br from-card to-red-500/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Failed/Rejected</p>
                <p className="text-2xl font-bold text-red-500">{stats.failed}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by client, project, or transaction ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Payment
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Record New Payment</DialogTitle>
                  <DialogDescription>
                    Add a new payment record for a client
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <Label>Client *</Label>
                      <Select
                        value={formData.client_id}
                        onValueChange={(value) =>
                          setFormData({ ...formData, client_id: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select client" />
                        </SelectTrigger>
                        <SelectContent>
                          {clients.map((client) => (
                            <SelectItem key={client.user_id} value={client.user_id}>
                              {client.full_name} ({client.email})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="col-span-2">
                      <Label>Project (Optional)</Label>
                      <Select
                        value={formData.project_id}
                        onValueChange={(value) =>
                          setFormData({ ...formData, project_id: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select project" />
                        </SelectTrigger>
                        <SelectContent>
                          {projects.map((project) => (
                            <SelectItem key={project.id} value={project.id}>
                              {project.title} {project.budget ? `($${project.budget})` : ""}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Amount *</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          value={formData.amount}
                          onChange={(e) =>
                            setFormData({ ...formData, amount: e.target.value })
                          }
                          className="pl-9"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Payment Type</Label>
                      <Select
                        value={formData.payment_type}
                        onValueChange={(value: PaymentType) =>
                          setFormData({ ...formData, payment_type: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(paymentTypeConfig).map(([key, config]) => (
                            <SelectItem key={key} value={key}>
                              <div className="flex items-center gap-2">
                                <config.icon className="w-4 h-4" />
                                {config.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Status</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value: PaymentStatus) =>
                          setFormData({ ...formData, status: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(statusConfig).map(([key, config]) => (
                            <SelectItem key={key} value={key}>
                              <div className="flex items-center gap-2">
                                <config.icon className="w-4 h-4" />
                                {config.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Transaction ID</Label>
                      <Input
                        placeholder="e.g., TXN-123456"
                        value={formData.transaction_id}
                        onChange={(e) =>
                          setFormData({ ...formData, transaction_id: e.target.value })
                        }
                      />
                    </div>

                    <div className="col-span-2">
                      <Label>Notes</Label>
                      <Textarea
                        placeholder="Additional notes about this payment..."
                        value={formData.notes}
                        onChange={(e) =>
                          setFormData({ ...formData, notes: e.target.value })
                        }
                        rows={3}
                      />
                    </div>
                  </div>

                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsAddDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={createPayment.isPending}>
                      {createPayment.isPending ? "Creating..." : "Create Payment"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Payment Records
            <Badge variant="secondary" className="ml-2">
              {filteredPayments.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="text-center py-12">
              <DollarSign className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium mb-2">No payments found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your filters"
                  : "Start by recording your first payment"}
              </p>
              {!searchTerm && statusFilter === "all" && (
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Payment
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((payment) => {
                    const statusInfo = statusConfig[payment.status];
                    const typeInfo = paymentTypeConfig[payment.payment_type];
                    const StatusIcon = statusInfo.icon;
                    const TypeIcon = typeInfo.icon;

                    return (
                      <TableRow key={payment.id}>
                        <TableCell>
                          <div className="font-medium">{getClientName(payment.client_id)}</div>
                        </TableCell>
                        <TableCell>
                          <span className="text-muted-foreground">
                            {getProjectTitle(payment.project_id)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="font-semibold">
                            ${Number(payment.amount).toLocaleString()}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <TypeIcon className="w-4 h-4" />
                            <span className="hidden sm:inline">{typeInfo.label}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={cn("gap-1", statusInfo.className)}
                          >
                            <StatusIcon className="w-3 h-3" />
                            {statusInfo.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            {format(new Date(payment.created_at), "MMM d, yyyy")}
                          </div>
                          <div className="text-xs text-muted-foreground/70">
                            {format(new Date(payment.created_at), "h:mm a")}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedPayment(payment);
                                  setIsViewDialogOpen(true);
                                }}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              {payment.status === "pending" && (
                                <>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      updatePaymentStatus.mutate({
                                        id: payment.id,
                                        status: "completed",
                                      })
                                    }
                                    className="text-emerald-600"
                                  >
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Mark Completed
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      updatePaymentStatus.mutate({
                                        id: payment.id,
                                        status: "failed",
                                      })
                                    }
                                    className="text-red-600"
                                  >
                                    <AlertCircle className="w-4 h-4 mr-2" />
                                    Mark Failed
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      updatePaymentStatus.mutate({
                                        id: payment.id,
                                        status: "rejected",
                                      })
                                    }
                                    className="text-destructive"
                                  >
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Reject Payment
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Payment Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
          </DialogHeader>
          {selectedPayment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Client</Label>
                  <p className="font-medium">{getClientName(selectedPayment.client_id)}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Project</Label>
                  <p className="font-medium">{getProjectTitle(selectedPayment.project_id)}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Amount</Label>
                  <p className="text-2xl font-bold">${Number(selectedPayment.amount).toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <Badge
                    variant="outline"
                    className={cn("gap-1 mt-1", statusConfig[selectedPayment.status].className)}
                  >
                    {React.createElement(statusConfig[selectedPayment.status].icon, { className: "w-3 h-3" })}
                    {statusConfig[selectedPayment.status].label}
                  </Badge>
                </div>
                <div>
                  <Label className="text-muted-foreground">Payment Type</Label>
                  <div className="flex items-center gap-2 mt-1">
                    {React.createElement(paymentTypeConfig[selectedPayment.payment_type].icon, { className: "w-4 h-4" })}
                    {paymentTypeConfig[selectedPayment.payment_type].label}
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Transaction ID</Label>
                  <p className="font-mono text-sm">{selectedPayment.transaction_id || "N/A"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Created</Label>
                  <p>{format(new Date(selectedPayment.created_at), "MMM d, yyyy h:mm a")}</p>
                </div>
                {selectedPayment.paid_at && (
                  <div>
                    <Label className="text-muted-foreground">Paid At</Label>
                    <p>{format(new Date(selectedPayment.paid_at), "MMM d, yyyy h:mm a")}</p>
                  </div>
                )}
              </div>
              {selectedPayment.notes && (
                <div>
                  <Label className="text-muted-foreground">Notes</Label>
                  <p className="mt-1 text-sm bg-muted p-3 rounded-lg">{selectedPayment.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
