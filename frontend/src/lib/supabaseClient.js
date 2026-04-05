// src/lib/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://eniriyzmymueytrxadps.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVuaXJpeXpteW11ZXl0cnhhZHBzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5NTk0MDksImV4cCI6MjA5MDUzNTQwOX0.acm7JmRwTWMOacxWEA-P23I9YuQZeUdD4Kiim83HNvE";

export const supabase = createClient(supabaseUrl, supabaseKey);
export default supabase;

export const settingsAPI = {
  getAll: async () => {
    const { data, error } = await supabase
      .from("admin_settings")
      .select("key, value");
    if (error) throw new Error(error.message);
    return Object.fromEntries((data ?? []).map(r => [r.key, r.value]));
  },

  set: async (key, value) => {
    const { error } = await supabase
      .from("admin_settings")
      .upsert({ key, value }, { onConflict: "key" });
    if (error) throw new Error(error.message);
  },

  setMany: async (obj) => {
    const rows = Object.entries(obj).map(([key, value]) => ({ key, value }));
    const { error } = await supabase
      .from("admin_settings")
      .upsert(rows, { onConflict: "key" });
    if (error) throw new Error(error.message);
  },
};

export const authAPI = {
  signOut: async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("token");
    window.location.href = "/login";
  },
};