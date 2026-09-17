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

export async function updateRfp(
  id: string,
  input: CreateRfpInput & { owner_id: string | null },
): Promise<Rfp> {
  const { data, error } = await supabase
    .from('rfps')
    .update({
      title: input.title,
      organization_name: input.organization_name,
      due_date: input.due_date || null,
      owner_id: input.owner_id,
      status: input.status,
      work_types: input.work_types,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteRfp(id: string): Promise<void> {
  const { error } = await supabase.from('rfps').delete().eq('id', id);
  if (error) throw error;
}

export async function attachRfpDocument(
  id: string,
  input: { drive_url: string },
  attachedBy: string,
): Promise<Rfp> {
  const { data, error } = await supabase
    .from('rfps')
    .update({
      document_drive_url: input.drive_url,
      document_attached_by: attachedBy,
      document_attached_at: new Date().toISOString(),
      ai_review_status: 'not_scored',
      ai_review_result: null,
      ai_review_scored_at: null,
      questions_status: 'not_generated',
      questions_result: null,
      questions_generated_at: null,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function scoreRfp(id: string): Promise<void> {
  const { error } = await supabase.functions.invoke('score-rfp', {
    body: { rfp_id: id },
  });

  if (error) throw error;
}

export async function generateQuestions(id: string): Promise<void> {
  const { error } = await supabase.functions.invoke('generate-questions', {
    body: { rfp_id: id },
  });

  if (error) throw error;
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
