import { supabase } from '../../lib/supabase';
import type { CreateRfpInput, Rfp } from './types';

export async function fetchRfps(): Promise<Rfp[]> {
  const { data, error } = await supabase
    .from('rfps')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function fetchRfp(id: string): Promise<Rfp> {
  const { data, error } = await supabase.from('rfps').select('*').eq('id', id).single();

  if (error) throw error;
  return data;
}

export async function createRfp(input: CreateRfpInput & { owner_id: string | null }, createdBy: string): Promise<Rfp> {
  const { data, error } = await supabase
    .from('rfps')
    .insert({
      title: input.title,
      organization_name: input.organization_name,
      due_date: input.due_date || null,
      owner_id: input.owner_id,
      status: input.status,
      work_types: input.work_types,
      created_by: createdBy,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export interface ProfileOption {
  id: string;
  full_name: string | null;
  email: string;
}

export async function fetchProfiles(): Promise<ProfileOption[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, email')
    .order('full_name', { ascending: true });

  if (error) throw error;
  return data;
}
