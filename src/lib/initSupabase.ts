// lib/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qcvttsuthocnpjgpxatr.supabase.co'; // Replace with your Supabase URL
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjdnR0c3V0aG9jbnBqZ3B4YXRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg5MDA4NTAsImV4cCI6MjA0NDQ3Njg1MH0.rWj1mDHPDR4DlhmQKVzoP5ePJsTdRkdI4P9_XBi13MI'; // Replace with your Supabase Anon Key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
