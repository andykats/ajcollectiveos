# User Profile Database Migration

This document explains the migration from storing user profile data in `auth.users.user_metadata` to a dedicated `user_profiles` table.

## 🗄️ Database Schema

### user_profiles Table

The new `user_profiles` table stores all user profile information with proper typing and constraints:

```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Basic Information
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  email VARCHAR(255) NOT NULL,
  
  -- Contact Information
  phone_country_code VARCHAR(10),
  phone_number VARCHAR(20),
  whatsapp_country_code VARCHAR(10),
  whatsapp_number VARCHAR(20),
  
  -- Personal Information
  birthday DATE,
  company VARCHAR(200),
  country VARCHAR(100),
  
  -- Avatar
  avatar_url TEXT,
  
  -- Preferences
  theme_preference VARCHAR(20) DEFAULT 'system' CHECK (theme_preference IN ('light', 'dark', 'system')),
  language_preference VARCHAR(10) DEFAULT 'en',
  
  -- Notification Preferences
  email_notifications BOOLEAN DEFAULT true,
  sms_notifications BOOLEAN DEFAULT false,
  push_notifications BOOLEAN DEFAULT true,
  
  -- Security
  two_factor_enabled BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🔗 Key Features

### 1. **Automatic Profile Creation**
- Trigger automatically creates a profile when a new user signs up
- Populates initial data from `auth.users.user_metadata`

### 2. **Row Level Security (RLS)**
- Users can only read their own profile
- Users can only update their own profile
- Prevents unauthorized access to user data

### 3. **Automatic Timestamps**
- `created_at` is set automatically on creation
- `updated_at` is updated automatically on any modification

### 4. **Data Integrity**
- Foreign key constraint ensures profiles are linked to valid users
- `ON DELETE CASCADE` removes profile when user is deleted
- Unique constraint prevents duplicate profiles per user

## 🚀 Migration Process

### Step 1: Run the SQL Migration
```bash
# Apply the migration to create the table and triggers
supabase db push supabase/migrations/20240101000000_create_user_profiles.sql
```

### Step 2: Migrate Existing Data (One-time)
```bash
# Call the migration API endpoint
POST /api/migrate-user-profiles
```

This will:
- Copy all existing user data from `user_metadata` to `user_profiles`
- Create profiles for users who don't have them
- Report migration statistics

### Step 3: Update Application Code
The application has been updated to use the new API endpoints:
- `GET /api/account/v2` - Fetch user profile
- `PUT /api/account/v2` - Update user profile

## 📊 Benefits

### 1. **Better Data Management**
- Dedicated table for user profiles
- Proper data types and constraints
- Easier to query and maintain

### 2. **Improved Performance**
- Indexed columns for faster lookups
- Separate table reduces auth table size
- Optimized for profile-specific queries

### 3. **Enhanced Security**
- Row Level Security (RLS) policies
- Proper access control
- Data isolation from auth system

### 4. **Future Extensibility**
- Easy to add new profile fields
- Support for additional features (preferences, notifications)
- Better integration with application logic

## 🔧 API Changes

### New API Endpoints
- `GET /api/account/v2` - Get user profile from user_profiles table
- `PUT /api/account/v2` - Update user profile in user_profiles table
- `POST /api/migrate-user-profiles` - One-time migration endpoint

### Response Format
The API response format remains the same for backward compatibility:
```json
{
  "token": "session_token",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "@John Doe",
    "firstName": "John",
    "lastName": "Doe",
    "avatar_url": "https://...",
    "phone": "+1 555-1234",
    "whatsapp": "+1 555-5678",
    "birthday": "1990-01-01",
    "company": "Acme Inc",
    "country": "United States",
    "phoneCountryCode": "+1",
    "phoneNumber": "555-1234",
    "whatsappCountryCode": "+1",
    "whatsappNumber": "555-5678"
  }
}
```

## 🔒 Security Considerations

1. **RLS Policies**: All profile data is protected by Row Level Security
2. **Foreign Keys**: Ensures data integrity between auth and profile tables
3. **Automatic Cleanup**: Profiles are automatically deleted when users are deleted
4. **Access Control**: Only authenticated users can access their own data

## 📈 Next Steps

1. **Test the Migration**: Run the migration on a development environment first
2. **Monitor Performance**: Check query performance after migration
3. **Update Documentation**: Keep API documentation up to date
4. **Plan Future Features**: Consider adding more profile fields as needed

## 🆘 Rollback Plan

If needed, you can rollback by:
1. Reverting the application code to use `/api/account` (original endpoints)
2. Dropping the `user_profiles` table
3. Removing the migration file

The original `user_metadata` approach remains functional as a fallback.