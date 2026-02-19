import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { DEMO_MODE, validateDemoCredentials } from "@/lib/demo-mode";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  isApproved: boolean;
  registrationStatus: string | null;
  isDemoMode: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  
  // Check if Supabase is properly configured
  const isSupabaseConfigured = () => {
    const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
    return key && 
      key !== 'your_supabase_anon_key_here' && 
      key !== 'placeholder-key-for-demo-mode' &&
      key.length > 20;
  };

  const checkUserRole = async (userId: string) => {
    try {
      const { data: adminData, error: adminError } = await supabase.rpc('has_role', {
        _user_id: userId,
        _role: 'admin'
      });
      
      if (adminError) {
        console.warn('Could not check admin role:', adminError.message);
        setIsAdmin(false);
      } else {
        setIsAdmin(adminData || false);
      }

      const { data: statusData, error: statusError } = await supabase.rpc('get_user_status', {
        _user_id: userId
      });
      
      if (statusError) {
        console.warn('Could not check user status:', statusError.message);
        setRegistrationStatus('approved');
        setIsApproved(true);
      } else {
        setRegistrationStatus(statusData);
        setIsApproved(statusData === 'approved');
      }
    } catch (error) {
      console.error('Error checking user role:', error);
      setIsAdmin(false);
      setIsApproved(true);
      setRegistrationStatus('approved');
    }
  };

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      console.warn('⚠️ Running in DEMO MODE - Supabase not configured');
      setIsDemoMode(true);
      
      const demoUser = localStorage.getItem('demo_user');
      if (demoUser) {
        const userData = JSON.parse(demoUser);
        setUser({ id: userData.id, email: userData.email } as User);
        setIsAdmin(userData.role === 'admin');
        setIsApproved(true);
        setRegistrationStatus('approved');
      }
      setLoading(false);
      return;
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setTimeout(() => checkUserRole(session.user.id), 0);
        } else {
          setIsAdmin(false);
          setIsApproved(false);
          setRegistrationStatus(null);
        }
        
        setLoading(false);
      }
    );

    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          checkUserRole(session.user.id);
        }
        
        setLoading(false);
      })
      .catch(error => {
        console.error('Error getting session:', error);
        setLoading(false);
      });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    if (isDemoMode || !isSupabaseConfigured()) {
      const demoUser = validateDemoCredentials(email, password);
      if (demoUser) {
        localStorage.setItem('demo_user', JSON.stringify(demoUser));
        setUser({ id: demoUser.id, email: demoUser.email } as User);
        setIsAdmin(demoUser.role === 'admin');
        setIsApproved(true);
        setRegistrationStatus('approved');
        return { error: null };
      }
      return { error: new Error('Invalid demo credentials') };
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error: error instanceof Error ? error : new Error('Failed to sign in') };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    if (isDemoMode || !isSupabaseConfigured()) {
      return { error: new Error('Sign up is not available in demo mode') };
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            full_name: fullName,
          },
        },
      });
      return { error };
    } catch (error) {
      console.error('Sign up error:', error);
      return { error: error instanceof Error ? error : new Error('Failed to sign up') };
    }
  };

  const signOut = async () => {
    if (isDemoMode || !isSupabaseConfigured()) {
      localStorage.removeItem('demo_user');
      setUser(null);
      setSession(null);
      setIsAdmin(false);
      setIsApproved(false);
      setRegistrationStatus(null);
      return;
    }

    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
    setUser(null);
    setSession(null);
    setIsAdmin(false);
    setIsApproved(false);
    setRegistrationStatus(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signIn,
        signUp,
        signOut,
        isAdmin,
        isApproved,
        registrationStatus,
        isDemoMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
