export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080",
  supabaseUrl:
    import.meta.env.VITE_SUPABASE_URL ??
    "https://dekrjvlxwxoxwjosmwss.supabase.co",
  supabaseAnonKey:
    import.meta.env.VITE_SUPABASE_ANON_KEY ??
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRla3Jqdmx4d3hveHdqb3Ntd3NzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxOTMxNDYsImV4cCI6MjA5NDc2OTE0Nn0.s1EAWqZNg6JkCW_RuizDUh5eiG51Bv8b8a7xTEmQCtM",
}
