import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

export const supabaseConfig = {
  hasUrl: Boolean(supabaseUrl),
  hasAnonKey: Boolean(supabaseAnonKey),
};

export const supabaseClient = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const supabaseDiagnostics = {
  isReady: Boolean(supabaseClient),
  envStatus: `url=${supabaseConfig.hasUrl ? "present" : "missing"}; anon=${supabaseConfig.hasAnonKey ? "present" : "missing"}`,
};

if (!supabaseClient) {
  console.warn("Supabase client is not configured. Expected VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in the environment.");
}

export type ForumPostRecord = {
  id: string;
  author_name: string;
  message: string;
  created_at: string;
};

export type ReportRecord = {
  id: string;
  category: string;
  severity: string;
  description: string;
  created_at: string;
};

export async function loadForumPostsFromSupabase() {
  if (!supabaseClient) return null;

  const { data, error } = await supabaseClient
    .from("forum_posts")
    .select("id, author_name, message, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.warn("Supabase forum load failed:", {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
    });
    return null;
  }

  return data as ForumPostRecord[];
}

export async function saveForumPostToSupabase(post: {
  author_name: string;
  message: string;
}) {
  if (!supabaseClient) return null;

  const { data, error } = await supabaseClient
    .from("forum_posts")
    .insert({
      author_name: post.author_name,
      message: post.message,
    })
    .select("id, author_name, message, created_at")
    .single();

  if (error) {
    console.warn("Supabase forum save failed:", {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
    });
    return null;
  }

  return data as ForumPostRecord;
}

export async function loadReportsFromSupabase() {
  if (!supabaseClient) return null;

  const { data, error } = await supabaseClient
    .from("report_submissions")
    .select("id, category, severity, description, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.warn("Supabase report load failed:", {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
    });
    return null;
  }

  return data as ReportRecord[];
}

export async function saveReportToSupabase(report: {
  category: string;
  severity: string;
  description: string;
}) {
  if (!supabaseClient) return null;

  const { data, error } = await supabaseClient
    .from("report_submissions")
    .insert({
      category: report.category,
      severity: report.severity,
      description: report.description,
    })
    .select("id, category, severity, description, created_at")
    .single();

  if (error) {
    console.warn("Supabase report save failed:", {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
    });
    return null;
  }

  return data as ReportRecord;
}
