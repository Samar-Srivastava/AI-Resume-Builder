import { useAuth } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { setAiAuthTokenGetter } from '../../service/AIModal';

/**
 * Wires Clerk session tokens into API clients (resume CRUD + AI proxy).
 */
export default function AuthTokenProvider({ children }) {
  const { getToken, isLoaded } = useAuth();

  useEffect(() => {
    if (!isLoaded) return;

    const getter = () => getToken();
    setAiAuthTokenGetter(getter);
  }, [getToken, isLoaded]);

  return children;
}
