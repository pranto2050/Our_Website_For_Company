import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Lock, Mail, ArrowRight, AlertCircle, User, Shield } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function Login() {
  const { signIn, user, isAdmin, isApproved, loading, isDemoMode } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      if (isAdmin) {
        navigate('/admin/dashboard');
      } else if (isApproved) {
        navigate('/client/dashboard');
      }
    }
  }, [user, isAdmin, isApproved, loading, navigate]);

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

    // Navigation will be handled by useEffect after auth state updates
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-32 bg-background">
        <div className="container-custom">
          <div className="max-w-md mx-auto">
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
            
            {/* Logo */}
            <div className="text-center mb-8">
              <Link to="/" className="inline-flex items-center gap-2 mb-4">
                <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
                  <span className="text-accent-foreground font-bold text-xl">A</span>
                </div>
              </Link>
              <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
              <p className="text-muted-foreground">
                Sign in to access your client dashboard
              </p>
            </div>

            {/* Demo Credentials */}
            <div className="bg-muted/50 rounded-2xl p-6 border border-border mb-6">
              <div className="text-center mb-4">
                <h3 className="font-semibold text-sm text-foreground">🎯 Demo Credentials</h3>
                <p className="text-xs text-muted-foreground mt-1">Click to auto-fill</p>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {/* Demo Client */}
                <button
                  type="button"
                  onClick={() => setFormData({ email: "demo.client@abitsolutions.com", password: "Demo@123456" })}
                  className="bg-card rounded-xl p-4 border border-border hover:border-accent transition-colors text-left group"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <User className="w-4 h-4 text-blue-500" />
                    </div>
                    <span className="font-semibold text-sm">Demo Client</span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <p className="text-muted-foreground">Email:</p>
                    <p className="font-mono text-foreground">demo.client@abitsolutions.com</p>
                    <p className="text-muted-foreground mt-2">Password:</p>
                    <p className="font-mono text-foreground">Demo@123456</p>
                  </div>
                </button>

                {/* Demo Admin */}
                <button
                  type="button"
                  onClick={() => setFormData({ email: "demo.admin@abitsolutions.com", password: "Admin@123456" })}
                  className="bg-card rounded-xl p-4 border border-border hover:border-accent transition-colors text-left group"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                      <Shield className="w-4 h-4 text-purple-500" />
                    </div>
                    <span className="font-semibold text-sm">Demo Admin</span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <p className="text-muted-foreground">Email:</p>
                    <p className="font-mono text-foreground">demo.admin@abitsolutions.com</p>
                    <p className="text-muted-foreground mt-2">Password:</p>
                    <p className="font-mono text-foreground">Admin@123456</p>
                  </div>
                </button>
              </div>
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
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
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
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <a
                      href="#"
                      className="text-sm text-accent hover:underline"
                    >
                      Forgot password?
                    </a>
                  </div>
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
                      Sign In
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 pt-6 border-t border-border text-center">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Link to="/contact" className="text-accent hover:underline font-medium">
                    Contact us
                  </Link>
                </p>
              </div>
            </div>

            {/* Security Note */}
            <p className="text-center text-xs text-muted-foreground mt-6">
              Protected by enterprise-grade security. Your data is safe with us.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
