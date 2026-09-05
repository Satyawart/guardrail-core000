import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../utils/supabase';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  role: string | null;
  merchantName: string | null;
  accountType: 'OPERATOR' | 'MERCHANT' | null;
  authState: 'unauthenticated' | 'loading' | 'authenticated' | 'provisioning';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authState, setAuthState] = useState<'unauthenticated' | 'loading' | 'authenticated' | 'provisioning'>('loading');
  
  const [role, setRole] = useState<string | null>(null);
  const [merchantName, setMerchantName] = useState<string | null>(null);
  const [accountType, setAccountType] = useState<'OPERATOR' | 'MERCHANT' | null>(null);

  const fetchIdentityContext = async (userId: string) => {
    try {
      // Fetch user role and linked merchant_id
      const { data: dbUser, error: userErr } = await supabase
        .from('users')
        .select('role, merchant_id')
        .eq('id', userId)
        .single();
        
      if (userErr && userErr.code !== 'PGRST116') {
        console.error('Error fetching user profile:', userErr);
      }

      if (dbUser) {
        setRole(dbUser.role);
        
        // Exact account type mapping based on Phase 10 role architecture
        if (dbUser.role === 'PLATFORM_OPERATOR') {
          setAccountType('OPERATOR');
        } else {
          setAccountType('MERCHANT');
        }
        
        // Fetch merchant details
        if (dbUser.merchant_id) {
          const { data: dbMerchant } = await supabase
            .from('merchants')
            .select('name')
            .eq('id', dbUser.merchant_id)
            .single();
          if (dbMerchant) {
            setMerchantName(dbMerchant.name);
          }
        }
      }
    } catch (e) {
      console.error('Failed to load identity context', e);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setAuthState('loading');
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user?.id) {
          await fetchIdentityContext(session.user.id);
          setAuthState('authenticated');
        } else {
          setAuthState('unauthenticated');
        }
      } catch (error) {
        console.error('Error fetching auth session:', error);
        setAuthState('unauthenticated');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user?.id) {
          setAuthState('loading');
          await fetchIdentityContext(session.user.id);
          setAuthState('authenticated');
        } else {
          setRole(null);
          setMerchantName(null);
          setAccountType(null);
          setAuthState('unauthenticated');
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setRole(null);
    setMerchantName(null);
    setAccountType(null);
    setAuthState('unauthenticated');
  };

  const value = {
    session,
    user,
    loading,
    signOut,
    role,
    merchantName,
    accountType,
    authState
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
