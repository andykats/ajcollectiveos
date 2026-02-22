// Supabase database types for user_profiles table
export interface UserProfile {
  id: string
  user_id: string
  first_name: string | null
  last_name: string | null
  email: string
  phone_country_code: string | null
  phone_number: string | null
  whatsapp_country_code: string | null
  whatsapp_number: string | null
  birthday: string | null // Date in ISO format
  company: string | null
  country: string | null
  avatar_url: string | null
  theme_preference: 'light' | 'dark' | 'system' | null
  language_preference: string | null
  email_notifications: boolean | null
  sms_notifications: boolean | null
  push_notifications: boolean | null
  two_factor_enabled: boolean | null
  created_at: string // Timestamp in ISO format
  updated_at: string // Timestamp in ISO format
}

export interface UserProfileInsert {
  id?: string
  user_id: string
  first_name?: string | null
  last_name?: string | null
  email: string
  phone_country_code?: string | null
  phone_number?: string | null
  whatsapp_country_code?: string | null
  whatsapp_number?: string | null
  birthday?: string | null
  company?: string | null
  country?: string | null
  avatar_url?: string | null
  theme_preference?: 'light' | 'dark' | 'system' | null
  language_preference?: string | null
  email_notifications?: boolean | null
  sms_notifications?: boolean | null
  push_notifications?: boolean | null
  two_factor_enabled?: boolean | null
  created_at?: string
  updated_at?: string
}

export interface UserProfileUpdate {
  first_name?: string | null
  last_name?: string | null
  email?: string
  phone_country_code?: string | null
  phone_number?: string | null
  whatsapp_country_code?: string | null
  whatsapp_number?: string | null
  birthday?: string | null
  company?: string | null
  country?: string | null
  avatar_url?: string | null
  theme_preference?: 'light' | 'dark' | 'system' | null
  language_preference?: string | null
  email_notifications?: boolean | null
  sms_notifications?: boolean | null
  push_notifications?: boolean | null
  two_factor_enabled?: boolean | null
  updated_at?: string
}