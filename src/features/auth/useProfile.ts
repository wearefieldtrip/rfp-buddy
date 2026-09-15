import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from './useAuth';

interface ProfileState {
  loading: boolean;
  hasProfile: boolean;
}

export function useProfile(): ProfileState {
  const { session } = useAuth();
  const [state, setState] = useState<ProfileState>({ loading: true, hasProfile: false });

  useEffect(() => {
    if (!session) {
      return;
    }

    let cancelled = false;

    supabase
      .from('profiles')
      .select('id')
      .eq('id', session.user.id)
      .limit(1)
      .then(({ data }) => {
        if (!cancelled) {
          setState({ loading: false, hasProfile: (data?.length ?? 0) > 0 });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [session]);

  if (!session) {
    return { loading: false, hasProfile: false };
  }

  return state;
}
