import { useEffect, useState } from 'react';
import { fetchOpportunities } from '../api/opportunities';
import type { Opportunity } from '../types';

type State = {
  opportunities: Opportunity[];
  isLoading: boolean;
  error: string | null;
};

export function useOpportunities(): State {
  const [state, setState] = useState<State>({
    opportunities: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    // ignore a response that arrives after unmount
    let ignore = false;

    fetchOpportunities()
      .then((opportunities) => {
        if (!ignore) setState({ opportunities, isLoading: false, error: null });
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : String(err);
        if (!ignore) setState({ opportunities: [], isLoading: false, error: message });
      });

    return () => {
      ignore = true;
    };
  }, []);

  return state;
}
