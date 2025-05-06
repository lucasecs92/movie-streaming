import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://cnfurmgscgczqzmtjems.supabase.co"; // Use as variáveis de ambiente do Next.js
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNuZnVybWdzY2djenF6bXRqZW1zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0NTA0NzIsImV4cCI6MjA2MjAyNjQ3Mn0.l_bc23bCCns6aHHXfv2WBJk5YwZBRtVap_jPk4elMLY";

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;