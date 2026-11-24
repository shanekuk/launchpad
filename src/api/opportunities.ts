import { supabase } from '../lib/supabase';
import type { Opportunity } from '../types';

const COLUMNS = 'id, organization, description, link, areas_of_interest, lat, lng';

export async function fetchOpportunities(): Promise<Opportunity[]> {
  if (!supabase) {
    throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY in .env');
  }

  const { data, error } = await supabase
    .from('opportunities')
    .select(COLUMNS)
    .order('organization')
    .overrideTypes<Opportunity[], { merge: false }>();

  if (error) {
    throw new Error(`Failed to load opportunities: ${error.message}`);
  }

  return data;
}
