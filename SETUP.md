# Setup Guide

## Quick Setup Steps

### 1. Environment Variables
Create a `.env.local` file with your Supabase credentials:

```bash
cp .env.example .env.local
```

Then edit `.env.local` with your actual values.

### 2. Database Setup
The migration file has been generated in `drizzle/0000_friendly_maestro.sql`.

**To set up your database:**

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy the contents of `drizzle/0000_friendly_maestro.sql`
4. Paste and execute the SQL

### 3. Seed Data (Optional)
After setting up the database, you can seed it with mock influencers:

```bash
npm run db:seed
```

### 4. Start Development Server
```bash
npm run dev
```

## Database Schema Created

The following tables will be created:
- `users` - User accounts
- `campaigns` - Campaign information
- `influencers` - Mock influencer data
- `campaign_influencers` - Junction table for assignments

## Next Steps

1. Set up your Supabase project
2. Configure environment variables
3. Run the SQL migration
4. Start developing!

## Troubleshooting

- Make sure your Supabase project is active
- Verify your environment variables are correct
- Check that the database connection string is valid
- Ensure you have the necessary permissions in Supabase

