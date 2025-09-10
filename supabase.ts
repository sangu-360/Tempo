import { createClient } from '@supabase/supabase-js';

// Provided Supabase project credentials
const supabaseUrl = 'https://tshfzmvuyfrycgziwgfm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzaGZ6bXZ1eWZyeWNneml3Z2ZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NTIzNTEsImV4cCI6MjA3MzAyODM1MX0.3-J0WQIlPagxQDPDjOyV9Gj2veV65VpBpdqJ2Q3BH7c';

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);
