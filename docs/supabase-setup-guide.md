# Supabase Installation and Setup Guide

## ✅ What's Installed

### 1. **Supabase CLI** (v2.76.12)
- Installed as a dev dependency: `npm install -D supabase`
- Available via: `npx supabase [command]`
- Configuration initialized in `supabase/config.toml`

### 2. **Supabase JavaScript Client Libraries**
- `@supabase/supabase-js` (v2.97.0) - Core Supabase client
- `@supabase/ssr` (v0.8.0) - Server-side rendering support

### 3. **Project Configuration**
- Supabase initialized with `npx supabase init`
- Configuration file: `supabase/config.toml`
- Migration directory: `supabase/migrations/`

## 🚀 Available Commands

### Database Management
```bash
# Start local Supabase (requires Docker)
npx supabase start

# Stop local Supabase
npx supabase stop

# Create a new migration
npx supabase migration new migration_name

# Apply migrations
npx supabase db push

# Generate types from database
npx supabase gen types typescript --local > types/database.ts
```

### Project Management
```bash
# Link to remote Supabase project
npx supabase login
npx supabase link --project-ref your-project-ref

# Show project status
npx supabase status

# Show all commands
npx supabase --help
```

## 📋 Next Steps

### 1. **Apply Database Migration**
To create the user_profiles table we designed:

```bash
# Apply the migration to your local database (if Docker is running)
npx supabase start
npx supabase db push supabase/migrations/20240101000000_create_user_profiles.sql

# Or apply to your remote Supabase project
npx supabase login
npx supabase link --project-ref your-project-ref
npx supabase db push
```

### 2. **Generate Database Types**
```bash
# Generate TypeScript types from your database
npx supabase gen types typescript --local > types/database.types.ts
```

### 3. **Test the Migration API**
```bash
# Call the migration endpoint to transfer existing data
curl -X POST http://localhost:3000/api/migrate-user-profiles
```

## 🔧 Current Project Status

### ✅ Completed
- [x] Supabase CLI installed and configured
- [x] User profile database schema created
- [x] New API endpoints using user_profiles table
- [x] Migration utility for existing data
- [x] TypeScript types defined

### 🔄 Ready to Use
- [ ] Apply database migration to your Supabase project
- [ ] Test new API endpoints
- [ ] Verify data migration works correctly

## 🆘 Troubleshooting

### Docker Not Running
If you see Docker errors, that's normal for local development. You can:
1. Use your remote Supabase project instead
2. Install Docker Desktop for local development
3. Use the Supabase web interface to apply migrations

### Migration Issues
If migrations fail:
1. Check your Supabase project connection
2. Verify database permissions
3. Review migration SQL syntax
4. Check the migration documentation in `docs/user-profile-migration.md`

## 📚 Useful Resources

- [Supabase CLI Documentation](https://supabase.com/docs/guides/cli)
- [Database Migrations Guide](https://supabase.com/docs/guides/local-development/cli/config)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Project Migration Guide](docs/user-profile-migration.md)