'use server'
import 'server-only'
import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/lib/db_types'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { type Chat } from '@/lib/types'

export async function getChats(userId?: string | null) {
  console.log('getChats called with userId:', userId)
  if (!userId) {
    console.log('No userId, returning empty array')
    return []
  }
  try {
    const cookieStore = cookies()
    const supabase = createServerActionClient<Database>({
      cookies: () => cookieStore
    })
    const result = await supabase
      .from('chats')
      .select('payload')
      .order('payload->createdAt', { ascending: false })
      .eq('user_id', userId)

    console.log('Supabase query result:', result)

    if (result.error) {
      console.error('Supabase error:', result.error)
      return []
    }

    const chats = (result.data?.map((entry: any) => entry.payload) as Chat[]) ?? []
    console.log('Returning chats:', chats.length)
    return chats
  } catch (error) {
    console.error('getChats error:', error)
    return []
  }
}

export async function getChat(id: string) {
  // Validate input
  if (!id || typeof id !== 'string' || id.length > 100) {
    return null
  }

  const cookieStore = cookies()
  const supabase = createServerActionClient<Database>({
    cookies: () => cookieStore
  })
  const { data } = await supabase
    .from('chats')
    .select('payload')
    .eq('id', id)
    .maybeSingle()

  return ((data as any)?.payload as Chat) ?? null
}

export async function removeChat({ id, path }: { id: string; path: string }) {
  try {
    // Validate inputs
    if (!id || typeof id !== 'string' || id.length > 100) {
      return { error: 'Invalid chat ID' }
    }
    if (!path || typeof path !== 'string' || path.length > 200) {
      return { error: 'Invalid path' }
    }

    const cookieStore = cookies()
    const supabase = createServerActionClient<Database>({
      cookies: () => cookieStore
    })
    await supabase.from('chats').delete().eq('id', id).throwOnError()

    revalidatePath('/')
    return revalidatePath(path)
  } catch (error) {
    return {
      error: 'Unauthorized'
    }
  }
}

export async function clearChats() {
  try {
    const cookieStore = cookies()
    const supabase = createServerActionClient<Database>({
      cookies: () => cookieStore
    })
    await supabase.from('chats').delete().throwOnError()
    revalidatePath('/')
    return redirect('/')
  } catch (error) {
    console.log('clear chats error', error)
    return {
      error: 'Unauthorized'
    }
  }
}

export async function getSharedChat(id: string) {
  // Validate input
  if (!id || typeof id !== 'string' || id.length > 100) {
    return null
  }

  const cookieStore = cookies()
  const supabase = createServerActionClient<Database>({
    cookies: () => cookieStore
  })
  const { data } = await supabase
    .from('chats')
    .select('payload')
    .eq('id', id)
    .not('payload->sharePath', 'is', null)
    .maybeSingle()

  return ((data as any)?.payload as Chat) ?? null
}

export async function shareChat(chat: Chat) {
  // Validate chat object
  if (!chat || !chat.id || typeof chat.id !== 'string') {
    throw new Error('Invalid chat object')
  }

  const payload = {
    ...chat,
    sharePath: `/share/${chat.id}`
  }

  const cookieStore = cookies()
  const supabase = createServerActionClient<Database>({
    cookies: () => cookieStore
  })
  await (supabase as any)
    .from('chats')
    .update({ payload: payload as any })
    .eq('id', chat.id)
    .throwOnError()

  return payload
}
