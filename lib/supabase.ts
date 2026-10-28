import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConfigured: boolean;
  source: 'env' | 'custom' | 'none';
}

const STORAGE_KEY_URL = 'hideaway_supabase_url';
const STORAGE_KEY_KEY = 'hideaway_supabase_anon_key';

export function getSupabaseConfig(): SupabaseConfig {
  const envUrl = (
    (import.meta.env.VITE_SUPABASE_URL as string | undefined) ||
    ((import.meta.env as any).NEXT_PUBLIC_SUPABASE_URL as string | undefined)
  )?.trim();

  const envKey = (
    (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ||
    ((import.meta.env as any).NEXT_PUBLIC_SUPABASE_ANON_KEY as string | undefined)
  )?.trim();

  const customUrl = localStorage.getItem(STORAGE_KEY_URL)?.trim();
  const customKey = localStorage.getItem(STORAGE_KEY_KEY)?.trim();

  if (customUrl && customKey) {
    return {
      url: customUrl,
      anonKey: customKey,
      isConfigured: true,
      source: 'custom',
    };
  }

  if (envUrl && envKey && !envUrl.includes('your-project.supabase.co')) {
    return {
      url: envUrl,
      anonKey: envKey,
      isConfigured: true,
      source: 'env',
    };
  }

  return {
    url: customUrl || envUrl || '',
    anonKey: customKey || envKey || '',
    isConfigured: false,
    source: 'none',
  };
}

let cachedClient: SupabaseClient | null = null;
let lastUsedUrl = '';
let lastUsedKey = '';

export function getSupabaseClient(): SupabaseClient | null {
  const config = getSupabaseConfig();
  if (!config.isConfigured || !config.url || !config.anonKey) {
    return null;
  }

  if (cachedClient && lastUsedUrl === config.url && lastUsedKey === config.anonKey) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(config.url, config.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
    lastUsedUrl = config.url;
    lastUsedKey = config.anonKey;
    return cachedClient;
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error);
    return null;
  }
}

export function saveSupabaseConfig(url: string, anonKey: string): { success: boolean; error?: string } {
  const cleanUrl = url.trim();
  const cleanKey = anonKey.trim();

  if (!cleanUrl.startsWith('https://') || !cleanUrl.includes('.')) {
    return { success: false, error: 'Project URL must start with https:// (e.g. https://xyz.supabase.co)' };
  }

  if (cleanKey.length < 20) {
    return { success: false, error: 'The Anon Key looks too short or invalid. Please check your Supabase API keys.' };
  }

  localStorage.setItem(STORAGE_KEY_URL, cleanUrl);
  localStorage.setItem(STORAGE_KEY_KEY, cleanKey);
  cachedClient = null; // reset to re-instantiate
  return { success: true };
}

export function clearSupabaseConfig(): void {
  localStorage.removeItem(STORAGE_KEY_URL);
  localStorage.removeItem(STORAGE_KEY_KEY);
  cachedClient = null;
}

export async function testSupabaseConnection(url?: string, key?: string): Promise<{ ok: boolean; message: string }> {
  try {
    const targetUrl = url?.trim() || getSupabaseConfig().url;
    const targetKey = key?.trim() || getSupabaseConfig().anonKey;

    if (!targetUrl || !targetKey) {
      return { ok: false, message: 'Supabase URL and Anon Key are required.' };
    }

    const testClient = createClient(targetUrl, targetKey);
    // Ping by querying system_config or checking health endpoint
    const { error } = await testClient.from('system_config').select('key').limit(1);

    if (error) {
      // If table doesn't exist yet, it still reached Supabase PostgreSQL!
      if (error.code === '42P01') {
        return { 
          ok: true, 
          message: 'Connected to Supabase! (Database tables need to be created with the provided SQL script).' 
        };
      }
      return { ok: false, message: error.message || 'Connection test failed.' };
    }

    return { ok: true, message: 'Successfully connected to Supabase PostgreSQL database!' };
  } catch (err: any) {
    return { ok: false, message: err?.message || 'Could not connect to Supabase.' };
  }
}
