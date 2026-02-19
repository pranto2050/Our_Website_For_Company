import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Lock, Mail, ArrowRight, Shield, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function AdminLogin() {
  const { signIn, isDemoMode } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const { error } = await signIn(formData.email, formData.password);

    if (error) {
      setError(error.message);
      setIsLoading(false);
      return;
    }

    // Navigate will be handled by the protected route after role check
    navigate('/admin/dashboard');
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 bg-background">
      <div className="w-full max-w-md px-4">
        {/* Demo Mode Banner */}
        {isDemoMode && (
          <div className="mb-6 bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-center">
            <p className="text-sm font-medium text-amber-600 dark:text-amber-400">
              🎭 Demo Mode Active
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Using demo credentials - No database connection required
            </p>
          </div>
        )}
        
        {/* Admin Badge */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full mb-4">
            <Shield className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-accent">Admin Access</span>
          </div>
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
              <span className="text-accent-foreground font-bold text-xl">A</span>
            </div>
          </Link>
          <h1 className="text-2xl font-bold mb-2">Admin Login</h1>
          <p className="text-muted-foreground">
            Access the administration panel
          </p>
        </div>

        {/* Demo Admin Credentials */}
        <div className="bg-muted/50 rounded-2xl p-6 border border-border mb-6">
          <div className="text-center mb-4">
            <h3 className="font-semibold text-sm text-foreground">🎯 Demo Admin Credentials</h3>
            <p className="text-xs text-muted-foreground mt-1">Click to auto-fill</p>
          </div>
          <button
            type="button"
            onClick={() => setFormData({ email: "demo.admin@abitsolutions.com", password: "Admin@123456" })}
            className="w-full bg-card rounded-xl p-4 border border-border hover:border-accent transition-colors text-left group"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Shield className="w-4 h-4 text-purple-500" />
              </div>
              <span className="font-semibold text-sm">Demo Admin Account</span>
            </div>
            <div className="space-y-1 text-xs">
              <p className="text-muted-foreground">Email:</p>
              <p className="font-mono text-foreground">demo.admin@abitsolutions.com</p>
              <p className="text-muted-foreground mt-2">Password:</p>
              <p className="font-mono text-foreground">Admin@123456</p>
            </div>
          </button>
        </div>

        {/* Login Form */}
        <div className="bg-card rounded-2xl p-8 border border-border shadow-lg">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Admin Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@abitsolutions.com"
                  className="pl-10"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="accent"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                "Signing in..."
              ) : (
                <>
                  Access Admin Panel
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Back Link */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          <Link to="/" className="text-accent hover:underline">
            ← Back to website
          </Link>
        </p>
      </div>
    </div>
  );
}
