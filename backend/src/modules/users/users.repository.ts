import { supabaseAdmin } from '../../config/supabase.js';

const PROFILE_SELECT = 'id, email, name, role, status, created_at';

export async function listUsers(opts: {
  search?: string;
  role?: 'all' | 'admin' | 'customer';
  status?: 'all' | 'active' | 'deactivated' | 'blocked';
  from: number;
  to: number;
}) {
  let query = supabaseAdmin
    .from('profiles')
    .select(PROFILE_SELECT, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(opts.from, opts.to);

  if (opts.search) {
    query = query.or(`name.ilike.%${opts.search}%,email.ilike.%${opts.search}%`);
  }
  if (opts.role && opts.role !== 'all') {
    query = query.eq('role', opts.role);
  }
  if (opts.status && opts.status !== 'all') {
    query = query.eq('status', opts.status);
  }

  const { data, error, count } = await query;
  if (error) throw error;
  return { data: data ?? [], count: count ?? 0 };
}

export async function getUserById(id: string) {
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select(PROFILE_SELECT)
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return data;
}

export async function updateUser(id: string, updates: Record<string, unknown>) {
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select(PROFILE_SELECT)
    .single();

  if (error || !data) throw error ?? new Error('Failed to update user');
  return data;
}

export async function hardDeleteUser(id: string): Promise<void> {
  const { error } = await supabaseAdmin.auth.admin.deleteUser(id);
  if (error) throw error;
}
