module.exports = {
  apps: [{
    name: "easy-report",
    script: "npm run build && npm run start",
    env: {
      NODE_ENV: "production", // Asegúrate de que esté establecido en "production"
      NEXT_PUBLIC_SUPABASE_URL: "https://ofhsozrjmzxtsbfoczsf.supabase.co",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9maHNvenJqbXp4dHNiZm9jenNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTY2MzExNjYsImV4cCI6MjAzMjIwNzE2Nn0.VEtNniWw1HwVaFRi3KALMvqD1RLGTZ3cjrrxeNmhCdA"
    }
  }]
}