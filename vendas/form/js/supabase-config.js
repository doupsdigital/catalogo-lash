/* ==========================================================================
   SUPABASE CONFIGURATION & CLIENT INITIALIZATION
   ========================================================================== */

const SUPABASE_URL = 'https://xyyvheqklealrhyliakc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5eXZoZXFrbGVhbHJoeWxpYWtjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODczMjE0NjgsImV4cCI6MjEwMjg5NzQ2OH0.gKTV7wSBG2JIMcTj0_8GCeYpcqhj82UxVuJXhs3ItEs';

// Cria o cliente Supabase global
window.supabaseClient = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;
