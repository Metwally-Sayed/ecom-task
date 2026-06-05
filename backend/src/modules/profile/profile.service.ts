import { supabaseAdmin } from '../../config/supabase.js';
import { AppError } from '../../utils/app-error.js';

export async function updateOwnProfile(
  userId: string,
  input: { name?: string; email?: string },
): Promise<void> {
  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (input.name !== undefined) updates.name = input.name;

  if (input.email !== undefined) {
    const { error: emailError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      email: input.email,
    });
    if (emailError) throw new AppError(500, 'Internal Server Error', 'Failed to update email');
    updates.email = input.email;
  }

  if (Object.keys(updates).length <= 1) return;

  const { error } = await supabaseAdmin
    .from('profiles')
    .update(updates)
    .eq('id', userId);

  if (error) throw new AppError(500, 'Internal Server Error', 'Failed to update profile');
}

export async function deactivateOwnProfile(userId: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from('profiles')
    .update({ status: 'deactivated', updated_at: new Date().toISOString() })
    .eq('id', userId);

  if (error) throw new AppError(500, 'Internal Server Error', 'Failed to deactivate account');
}

export async function deleteOwnProfile(userId: string): Promise<void> {
  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
  if (error) throw new AppError(500, 'Internal Server Error', 'Failed to delete account');
}
