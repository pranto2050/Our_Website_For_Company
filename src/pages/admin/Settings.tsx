import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { 
  Building2, 
  Mail, 
  Phone, 
  Globe, 
  MapPin,
  Shield,
  Bell,
  Palette,
  Save,
  RefreshCw
} from "lucide-react";

export default function AdminSettings() {
  const [saving, setSaving] = useState(false);

  // Company Settings
  const [companySettings, setCompanySettings] = useState({
    name: "ABIT Solutions",
    email: "info@abitsolutions.com",
    phone: "+1 (555) 123-4567",
    website: "https://abitsolutions.com",
    address: "123 Tech Street, Innovation City, IC 12345",
    description: "Premier IT solutions and digital services company providing cutting-edge technology solutions for businesses worldwide.",
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNewClient: true,
    emailNewProject: true,
    emailNewTicket: true,
    emailTicketReply: true,
    emailProjectUpdate: false,
    dashboardAlerts: true,
  });

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState({
    requireStrongPassword: true,
    sessionTimeout: 60,
    maxLoginAttempts: 5,
    twoFactorAuth: false,
  });

  const handleSaveCompany = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    toast.success("Company settings saved successfully");
  };

  const handleSaveNotifications = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    toast.success("Notification settings saved successfully");
  };

  const handleSaveSecurity = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    toast.success("Security settings saved successfully");
  };

  return (
    <AdminLayout 
      title="Settings" 
      description="Manage system configuration and preferences"
    >
      <Tabs defaultValue="company" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:w-auto lg:inline-flex">
          <TabsTrigger value="company" className="gap-2">
            <Building2 className="w-4 h-4 hidden sm:block" />
            Company
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="w-4 h-4 hidden sm:block" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="w-4 h-4 hidden sm:block" />
            Security
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-2">
            <Palette className="w-4 h-4 hidden sm:block" />
            Appearance
          </TabsTrigger>
        </TabsList>

        {/* Company Settings */}
        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Company Information
              </CardTitle>
              <CardDescription>
                Update your company details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={companySettings.name}
                    onChange={(e) => setCompanySettings(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyWebsite">Website</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="companyWebsite"
                      className="pl-10"
                      value={companySettings.website}
                      onChange={(e) => setCompanySettings(prev => ({ ...prev, website: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyEmail">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="companyEmail"
                      type="email"
                      className="pl-10"
                      value={companySettings.email}
                      onChange={(e) => setCompanySettings(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyPhone">Phone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="companyPhone"
                      className="pl-10"
                      value={companySettings.phone}
                      onChange={(e) => setCompanySettings(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyAddress">Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="companyAddress"
                    className="pl-10"
                    value={companySettings.address}
                    onChange={(e) => setCompanySettings(prev => ({ ...prev, address: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyDescription">Company Description</Label>
                <Textarea
                  id="companyDescription"
                  rows={4}
                  value={companySettings.description}
                  onChange={(e) => setCompanySettings(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveCompany} disabled={saving}>
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Configure when and how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-4">Email Notifications</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>New Client Registration</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive email when a new client registers
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.emailNewClient}
                      onCheckedChange={(checked) => 
                        setNotificationSettings(prev => ({ ...prev, emailNewClient: checked }))
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>New Project Request</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive email for new project submissions
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.emailNewProject}
                      onCheckedChange={(checked) => 
                        setNotificationSettings(prev => ({ ...prev, emailNewProject: checked }))
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>New Support Ticket</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive email when clients create tickets
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.emailNewTicket}
                      onCheckedChange={(checked) => 
                        setNotificationSettings(prev => ({ ...prev, emailNewTicket: checked }))
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Ticket Replies</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive email when clients reply to tickets
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.emailTicketReply}
                      onCheckedChange={(checked) => 
                        setNotificationSettings(prev => ({ ...prev, emailTicketReply: checked }))
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Project Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive email for project status changes
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.emailProjectUpdate}
                      onCheckedChange={(checked) => 
                        setNotificationSettings(prev => ({ ...prev, emailProjectUpdate: checked }))
                      }
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-medium mb-4">Dashboard Notifications</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable Dashboard Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Show notification badge and alerts in admin dashboard
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.dashboardAlerts}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({ ...prev, dashboardAlerts: checked }))
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveNotifications} disabled={saving}>
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Configure security and authentication options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Require Strong Passwords</Label>
                    <p className="text-sm text-muted-foreground">
                      Enforce minimum password requirements (8+ chars, mixed case, numbers)
                    </p>
                  </div>
                  <Switch
                    checked={securitySettings.requireStrongPassword}
                    onCheckedChange={(checked) => 
                      setSecuritySettings(prev => ({ ...prev, requireStrongPassword: checked }))
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Require 2FA for admin accounts
                    </p>
                  </div>
                  <Switch
                    checked={securitySettings.twoFactorAuth}
                    onCheckedChange={(checked) => 
                      setSecuritySettings(prev => ({ ...prev, twoFactorAuth: checked }))
                    }
                  />
                </div>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      min="5"
                      max="480"
                      value={securitySettings.sessionTimeout}
                      onChange={(e) => setSecuritySettings(prev => ({ 
                        ...prev, 
                        sessionTimeout: parseInt(e.target.value) || 60 
                      }))}
                    />
                    <p className="text-xs text-muted-foreground">
                      Auto logout after inactivity (5-480 minutes)
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxAttempts">Max Login Attempts</Label>
                    <Input
                      id="maxAttempts"
                      type="number"
                      min="3"
                      max="10"
                      value={securitySettings.maxLoginAttempts}
                      onChange={(e) => setSecuritySettings(prev => ({ 
                        ...prev, 
                        maxLoginAttempts: parseInt(e.target.value) || 5 
                      }))}
                    />
                    <p className="text-xs text-muted-foreground">
                      Lock account after failed attempts (3-10)
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveSecurity} disabled={saving}>
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Appearance Settings
              </CardTitle>
              <CardDescription>
                Customize the look and feel of your admin panel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center py-8">
                <Palette className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Theme Customization</h3>
                <p className="text-muted-foreground mb-4">
                  Advanced theme customization options coming soon.
                </p>
                <p className="text-sm text-muted-foreground">
                  The current design uses ABIT Solutions' brand colors (Cyan accent with Navy primary).
                </p>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label>Compact Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Use smaller spacing and fonts for more content density
                  </p>
                </div>
                <Switch disabled />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Sidebar Collapsed by Default</Label>
                  <p className="text-sm text-muted-foreground">
                    Start with sidebar in collapsed state
                  </p>
                </div>
                <Switch disabled />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" disabled>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset to Default
                </Button>
                <Button disabled>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}