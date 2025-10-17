# Environment Setup Guide

## Required Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase Configuration
# Get these values from your Supabase project settings
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## How to Get Supabase Credentials

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project or select existing one
3. Go to Settings > API
4. Copy the following values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Example Configuration

```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0NjQ2NDQwMCwiZXhwIjoxOTYyMDQwNDAwfQ.example_key_here
```

## Security Notes

- Never commit `.env.local` to version control
- The `NEXT_PUBLIC_` prefix makes these variables available in the browser
- These are safe to expose as they're designed for client-side use
- The anon key has limited permissions defined by your RLS policies

## Troubleshooting

### "Your project's URL and Key are required"
- Make sure `.env.local` exists in the root directory
- Check that variable names are exactly as shown above
- Restart your development server after adding environment variables

### "Invalid API key"
- Verify you copied the correct anon key (not the service role key)
- Check for extra spaces or characters in the key
- Ensure the Supabase project is active and not paused
