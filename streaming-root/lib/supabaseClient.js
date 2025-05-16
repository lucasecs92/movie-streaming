import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL; 
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

// Verificações para garantir que as variáveis de ambiente estão carregadas
if (!supabaseUrl) {
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_URL");
}
if (!supabaseKey) {
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_KEY");
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;