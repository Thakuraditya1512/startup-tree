import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rleawbxosstqlbzourqt.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_1NQJlYrh9KrIE-_EGmOlPQ_VEmjRuO6';

export const supabase = createClient(supabaseUrl, supabaseKey);
