
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { deleteHookdeckSource } from "@/services/webhookService";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  deleteAccount: (reason: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state changed:", event, !!currentSession);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log("Initial session check:", !!currentSession);
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log("Attempting sign in for:", email);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        console.error("Sign in error:", error);
        throw error;
      }
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error.message || "An error occurred during sign in",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      console.log("Attempting sign up for:", email);
      
      const { error, data } = await supabase.auth.signUp({ 
        email, 
        password,
      });
      
      console.log("Sign up response:", { error, data });
      
      if (error) throw error;
      
      toast({
        title: "Sign up successful",
        description: "Your account has been created. You can now sign in.",
      });
      
      // Sign out to make sure the user goes through the login flow
      await supabase.auth.signOut();
      
      navigate("/auth/signin");
    } catch (error: any) {
      console.error("Sign up error in context:", error);
      toast({
        title: "Sign up failed",
        description: error.message || "An error occurred during sign up",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/auth/signin");
    } catch (error: any) {
      toast({
        title: "Sign out failed",
        description: error.message || "An error occurred during sign out",
        variant: "destructive",
      });
    }
  };

  const deleteAccount = async (reason: string) => {
    if (!user) {
      throw new Error("No user is logged in");
    }
    
    try {
      // First, check if the user has a Hookdeck source and delete it
      const { data: webhook } = await supabase
        .from('webhooks')
        .select('hookdeck_source_id')
        .eq('user_id', user.id)
        .single();
      
      if (webhook?.hookdeck_source_id) {
        console.log("Deleting Hookdeck source:", webhook.hookdeck_source_id);
        await deleteHookdeckSource(webhook.hookdeck_source_id, user.id);
      }
      
      // Log the reason for deletion (in a real app, you might want to store this)
      console.log(`User ${user.id} is deleting their account. Reason: ${reason}`);
      
      // Delete the user account from Supabase Auth
      const { error } = await supabase.auth.admin.deleteUser(user.id);
      
      if (error) {
        throw error;
      }
      
      // Sign out from the client side
      await supabase.auth.signOut();
      
      toast({
        title: "Account deleted",
        description: "Your account has been successfully deleted.",
      });
      
      // Redirect to the home page
      navigate("/");
      
    } catch (error: any) {
      console.error("Error deleting account:", error);
      toast({
        title: "Account deletion failed",
        description: error.message || "There was an error deleting your account.",
        variant: "destructive",
      });
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      loading, 
      signIn, 
      signUp, 
      signOut, 
      deleteAccount 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
