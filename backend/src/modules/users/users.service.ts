import { supabaseAdmin } from '../../config/supabase.js';
import { AppError } from '../../utils/app-error.js';
import { getPaginationRange, buildMeta } from '../../utils/pagination.js';
import * as repo from './users.repository.js';
import type { UserProfile, CreateUserInput, UpdateUserInput, UserListQuery } from './users.types.js';

function mapUser(row: Record<string, unknown>): UserProfile {
  return {
    id: row.id as string,
    email: row.email as string,
    name: row.name as string,
    role: row.role as 'customer' | 'admin',
    status: (row.status as string ?? 'active') as 'active' | 'deactivated' | 'blocked',
    createdAt: row.created_at as string,
  };
}

export async function listUsers(query: UserListQuery) {
  const { from, to } = getPaginationRange(query.page, query.limit);
  const { data, count } = await repo.listUsers({
    search: query.search,
    role: query.role,
    status: query.status,
    from,
    to,
  });
  return {
    data: data.map((row) => mapUser(row as Record<string, unknown>)),
    meta: buildMeta(query.page, query.limit, count),
  };
}

export async function getUser(id: string): Promise<UserProfile> {
  const row = await repo.getUserById(id);
  if (!row) throw new AppError(404, 'Not Found', 'User not found');
  return mapUser(row as Record<string, unknown>);
}

export async function createUser(input: CreateUserInput): Promise<UserProfile> {
  const { data: createData, error: createError } = await supabaseAdmin.auth.admin.createUser({
    email: input.email,
    password: input.password,
    email_confirm: true,
    user_metadata: { name: input.name },
  });

  if (createError) {
    if (createError.message.toLowerCase().includes('already')) {
      throw new AppError(409, 'Conflict', 'Email address is already registered');
    }
    throw new AppError(500, 'Internal Server Error', createError.message);
  }

  const authUser = createData.user!;

  const { error: profileError } = await supabaseAdmin.from('profiles').insert({
    id: authUser.id,
    email: input.email,
    name: input.name,
    role: input.role,
    status: 'active',
  });

  if (profileError) {
    await supabaseAdmin.auth.admin.deleteUser(authUser.id).catch(() => {});
    throw new AppError(500, 'Internal Server Error', 'Failed to create user profile');
  }

  const row = await repo.getUserById(authUser.id);
  if (!row) throw new AppError(500, 'Internal Server Error', 'Failed to fetch created user');
  return mapUser(row as Record<string, unknown>);
}

export async function updateUser(
  adminId: string,
  targetId: string,
  input: UpdateUserInput,
): Promise<UserProfile> {
  const existing = await repo.getUserById(targetId);
  if (!existing) throw new AppError(404, 'Not Found', 'User not found');

  if (adminId === targetId && (input.role !== undefined || input.status !== undefined)) {
    throw new AppError(400, 'Bad Request', 'Admins cannot change their own role or status');
  }

  const updates: Record<string, unknown> = {};
  if (input.name !== undefined) updates.name = input.name;
  if (input.role !== undefined) updates.role = input.role;
  if (input.status !== undefined) updates.status = input.status;

  if (input.email !== undefined) {
    const { error: emailError } = await supabaseAdmin.auth.admin.updateUserById(targetId, {
      email: input.email,
    });
    if (emailError) throw new AppError(500, 'Internal Server Error', 'Failed to update email');
    updates.email = input.email;
  }

  if (Object.keys(updates).length === 0) {
    return mapUser(existing as Record<string, unknown>);
  }

  const row = await repo.updateUser(targetId, updates);
  return mapUser(row as Record<string, unknown>);
}

export async function deleteUser(adminId: string, targetId: string): Promise<void> {
  if (adminId === targetId) {
    throw new AppError(400, 'Bad Request', 'Admins cannot delete their own account');
  }
  const existing = await repo.getUserById(targetId);
  if (!existing) throw new AppError(404, 'Not Found', 'User not found');
  await repo.hardDeleteUser(targetId);
}
