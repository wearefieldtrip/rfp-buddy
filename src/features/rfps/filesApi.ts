import { supabase } from '../../lib/supabase';

export interface RfpFile {
  id: string;
  rfp_id: string;
  drive_url: string;
  file_name: string;
  added_by: string;
  created_at: string;
}

export async function fetchRfpFiles(rfpId: string): Promise<RfpFile[]> {
  const { data, error } = await supabase
    .from('rfp_files')
    .select('*')
    .eq('rfp_id', rfpId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function addRfpFile(input: {
  rfp_id: string;
  drive_url: string;
  file_name: string;
  added_by: string;
}): Promise<RfpFile> {
  const { data, error } = await supabase.from('rfp_files').insert(input).select().single();

  if (error) throw error;
  return data;
}

export async function deleteRfpFile(id: string): Promise<void> {
  const { error } = await supabase.from('rfp_files').delete().eq('id', id);
  if (error) throw error;
}
