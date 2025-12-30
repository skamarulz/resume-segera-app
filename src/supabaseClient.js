import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://yfccopfkteoqopvraqkg.supabase.co"; // https://xxxxx.supabase.co
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlmY2NvcGZrdGVvcW9wdnJhcWtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUwODU1NzgsImV4cCI6MjA4MDY2MTU3OH0.NxbBgN-IV-qUwtwFpeyxEKQP2T-dJcwPEdJhq9s3UtA"; // eyJhbGci...

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
