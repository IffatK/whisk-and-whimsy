import { createClient } from "@supabase/supabase-js";

const supabaseUrl ="https://eniriyzmymueytrxadps.supabase.co";
const supabaseKey= "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVuaXJpeXpteW11ZXl0cnhhZHBzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5NTk0MDksImV4cCI6MjA5MDUzNTQwOX0.acm7JmRwTWMOacxWEA-P23I9YuQZeUdD4Kiim83HNvE";

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;