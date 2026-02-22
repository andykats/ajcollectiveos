"use client"

import { useState, useEffect, useRef } from "react"
import { useTheme } from "next-themes"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Field, FieldContent, FieldError, FieldLabel } from "@/components/ui/field"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SaveIcon, UploadIcon, CheckCircleIcon, AlertCircleIcon, ChevronDownIcon } from "lucide-react"
import { getInitials } from "@/lib/utils"
import { AvatarCropper } from "@/components/avatar-cropper"

// Function to detect user's country based on locale and timezone
const detectUserCountry = (): string => {
  try {
    // Try to get country from browser locale
    const locale = navigator.language || navigator.languages[0]
    const localeCountry = locale?.split('-')[1]
    
    if (localeCountry) {
      // Map common locale country codes to our country codes
      const localeToCountryCode: Record<string, string> = {
        'US': '+1', 'GB': '+44', 'IN': '+91', 'CN': '+86', 'JP': '+81',
        'DE': '+49', 'FR': '+33', 'IT': '+39', 'ES': '+34', 'AU': '+61',
        'BR': '+55', 'RU': '+7', 'KR': '+82', 'SG': '+65', 'HK': '+852',
        'EG': '+20', 'ZA': '+27', 'MX': '+52', 'TR': '+90', 'SA': '+966'
      }
      
      if (localeToCountryCode[localeCountry]) {
        return localeToCountryCode[localeCountry]
      }
    }
    
    // Fallback: try to guess from timezone
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const timezoneToCountry: Record<string, string> = {
      'America/New_York': '+1', 'America/Chicago': '+1', 'America/Denver': '+1',
      'America/Los_Angeles': '+1', 'America/Phoenix': '+1', 'Europe/London': '+44',
      'Europe/Paris': '+33', 'Europe/Berlin': '+49', 'Europe/Rome': '+39',
      'Europe/Madrid': '+34', 'Asia/Kolkata': '+91', 'Asia/Shanghai': '+86',
      'Asia/Tokyo': '+81', 'Australia/Sydney': '+61', 'America/Sao_Paulo': '+55',
      'Europe/Moscow': '+7', 'Asia/Seoul': '+82', 'Asia/Singapore': '+65',
      'Asia/Hong_Kong': '+852', 'Africa/Cairo': '+20', 'Africa/Johannesburg': '+27',
      'America/Mexico_City': '+52', 'Europe/Istanbul': '+90', 'Asia/Riyadh': '+966'
    }
    
    return timezoneToCountry[timezone] || '+1' // Default to US
  } catch (error) {
    return '+1' // Default to US if detection fails
  }
}

// Enhanced country data with flags and codes
const countries = [
  // Major countries
  { code: "+1", flag: "🇺🇸", name: "United States", iso: "US" },
  { code: "+44", flag: "🇬🇧", name: "United Kingdom", iso: "GB" },
  { code: "+91", flag: "🇮🇳", name: "India", iso: "IN" },
  { code: "+86", flag: "🇨🇳", name: "China", iso: "CN" },
  { code: "+81", flag: "🇯🇵", name: "Japan", iso: "JP" },
  { code: "+49", flag: "🇩🇪", name: "Germany", iso: "DE" },
  { code: "+33", flag: "🇫🇷", name: "France", iso: "FR" },
  { code: "+39", flag: "🇮🇹", name: "Italy", iso: "IT" },
  { code: "+34", flag: "🇪🇸", name: "Spain", iso: "ES" },
  { code: "+61", flag: "🇦🇺", name: "Australia", iso: "AU" },
  { code: "+55", flag: "🇧🇷", name: "Brazil", iso: "BR" },
  { code: "+7", flag: "🇷🇺", name: "Russia", iso: "RU" },
  { code: "+82", flag: "🇰🇷", name: "South Korea", iso: "KR" },
  { code: "+65", flag: "🇸🇬", name: "Singapore", iso: "SG" },
  { code: "+852", flag: "🇭🇰", name: "Hong Kong", iso: "HK" },
  { code: "+20", flag: "🇪🇬", name: "Egypt", iso: "EG" },
  { code: "+27", flag: "🇿🇦", name: "South Africa", iso: "ZA" },
  { code: "+52", flag: "🇲🇽", name: "Mexico", iso: "MX" },
  { code: "+90", flag: "🇹🇷", name: "Turkey", iso: "TR" },
  { code: "+966", flag: "🇸🇦", name: "Saudi Arabia", iso: "SA" },
  
  // Additional countries
  { code: "+1", flag: "🇨🇦", name: "Canada", iso: "CA" },
  { code: "+64", flag: "🇳🇿", name: "New Zealand", iso: "NZ" },
  { code: "+47", flag: "🇳🇴", name: "Norway", iso: "NO" },
  { code: "+46", flag: "🇸🇪", name: "Sweden", iso: "SE" },
  { code: "+45", flag: "🇩🇰", name: "Denmark", iso: "DK" },
  { code: "+358", flag: "🇫🇮", name: "Finland", iso: "FI" },
  { code: "+31", flag: "🇳🇱", name: "Netherlands", iso: "NL" },
  { code: "+32", flag: "🇧🇪", name: "Belgium", iso: "BE" },
  { code: "+43", flag: "🇦🇹", name: "Austria", iso: "AT" },
  { code: "+41", flag: "🇨🇭", name: "Switzerland", iso: "CH" },
  { code: "+353", flag: "🇮🇪", name: "Ireland", iso: "IE" },
  { code: "+351", flag: "🇵🇹", name: "Portugal", iso: "PT" },
  { code: "+34", flag: "🇦🇷", name: "Argentina", iso: "AR" },
  { code: "+51", flag: "🇵🇪", name: "Peru", iso: "PE" },
  { code: "+57", flag: "🇨🇴", name: "Colombia", iso: "CO" },
  { code: "+58", flag: "🇻🇪", name: "Venezuela", iso: "VE" },
  { code: "+56", flag: "🇨🇱", name: "Chile", iso: "CL" },
  { code: "+54", flag: "🇺🇾", name: "Uruguay", iso: "UY" },
  { code: "+55", flag: "🇪🇨", name: "Ecuador", iso: "EC" },
  { code: "+62", flag: "🇮🇩", name: "Indonesia", iso: "ID" },
  { code: "+63", flag: "🇵🇭", name: "Philippines", iso: "PH" },
  { code: "+66", flag: "🇹🇭", name: "Thailand", iso: "TH" },
  { code: "+84", flag: "🇻🇳", name: "Vietnam", iso: "VN" },
  { code: "+60", flag: "🇲🇾", name: "Malaysia", iso: "MY" },
  { code: "+95", flag: "🇲🇲", name: "Myanmar", iso: "MM" },
  { code: "+880", flag: "🇧🇩", name: "Bangladesh", iso: "BD" },
  { code: "+92", flag: "🇵🇰", name: "Pakistan", iso: "PK" },
  { code: "+94", flag: "🇱🇰", name: "Sri Lanka", iso: "LK" },
  { code: "+98", flag: "🇮🇷", name: "Iran", iso: "IR" },
  { code: "+964", flag: "🇮🇶", name: "Iraq", iso: "IQ" },
  { code: "+972", flag: "🇮🇱", name: "Israel", iso: "IL" },
  { code: "+962", flag: "🇯🇴", name: "Jordan", iso: "JO" },
  { code: "+961", flag: "🇱🇧", name: "Lebanon", iso: "LB" },
  { code: "+963", flag: "🇸🇾", name: "Syria", iso: "SY" },
  { code: "+965", flag: "🇰🇼", name: "Kuwait", iso: "KW" },
  { code: "+971", flag: "🇦🇪", name: "UAE", iso: "AE" },
  { code: "+968", flag: "🇴🇲", name: "Oman", iso: "OM" },
  { code: "+974", flag: "🇶🇦", name: "Qatar", iso: "QA" },
  { code: "+973", flag: "🇧🇭", name: "Bahrain", iso: "BH" },
  { code: "+966", flag: "🇾🇪", name: "Yemen", iso: "YE" },
  { code: "+216", flag: "🇹🇳", name: "Tunisia", iso: "TN" },
  { code: "+213", flag: "🇩🇿", name: "Algeria", iso: "DZ" },
  { code: "+212", flag: "🇲🇦", name: "Morocco", iso: "MA" },
  { code: "+218", flag: "🇱🇾", name: "Libya", iso: "LY" },
  { code: "+220", flag: "🇬🇲", name: "Gambia", iso: "GM" },
  { code: "+221", flag: "🇸🇳", name: "Senegal", iso: "SN" },
  { code: "+224", flag: "🇬🇳", name: "Guinea", iso: "GN" },
  { code: "+225", flag: "🇨🇮", name: "Ivory Coast", iso: "CI" },
  { code: "+226", flag: "🇧🇫", name: "Burkina Faso", iso: "BF" },
  { code: "+227", flag: "🇳🇪", name: "Niger", iso: "NE" },
  { code: "+228", flag: "🇹🇬", name: "Togo", iso: "TG" },
  { code: "+229", flag: "🇧🇯", name: "Benin", iso: "BJ" },
  { code: "+230", flag: "🇲🇺", name: "Mauritius", iso: "MU" },
  { code: "+231", flag: "🇱🇷", name: "Liberia", iso: "LR" },
  { code: "+232", flag: "🇸🇱", name: "Sierra Leone", iso: "SL" },
  { code: "+233", flag: "🇬🇭", name: "Ghana", iso: "GH" },
  { code: "+234", flag: "🇳🇬", name: "Nigeria", iso: "NG" },
  { code: "+235", flag: "🇹🇩", name: "Chad", iso: "TD" },
  { code: "+236", flag: "🇨🇫", name: "Central African Republic", iso: "CF" },
  { code: "+237", flag: "🇨🇲", name: "Cameroon", iso: "CM" },
  { code: "+238", flag: "🇨🇻", name: "Cape Verde", iso: "CV" },
  { code: "+239", flag: "🇸🇹", name: "Sao Tome & Principe", iso: "ST" },
  { code: "+240", flag: "🇬🇶", name: "Equatorial Guinea", iso: "GQ" },
  { code: "+241", flag: "🇬🇦", name: "Gabon", iso: "GA" },
  { code: "+242", flag: "🇨🇬", name: "Congo", iso: "CG" },
  { code: "+243", flag: "🇨🇩", name: "Democratic Republic of Congo", iso: "CD" },
  { code: "+244", flag: "🇦🇴", name: "Angola", iso: "AO" },
  { code: "+245", flag: "🇬🇼", name: "Guinea-Bissau", iso: "GW" },
  { code: "+246", flag: "🇩🇬", name: "Diego Garcia", iso: "DG" },
  { code: "+248", flag: "🇸🇨", name: "Seychelles", iso: "SC" },
  { code: "+249", flag: "🇸🇩", name: "Sudan", iso: "SD" },
  { code: "+250", flag: "🇷🇼", name: "Rwanda", iso: "RW" },
  { code: "+251", flag: "🇪🇹", name: "Ethiopia", iso: "ET" },
  { code: "+252", flag: "🇸🇴", name: "Somalia", iso: "SO" },
  { code: "+253", flag: "🇩🇯", name: "Djibouti", iso: "DJ" },
  { code: "+254", flag: "🇰🇪", name: "Kenya", iso: "KE" },
  { code: "+255", flag: "🇹🇿", name: "Tanzania", iso: "TZ" },
  { code: "+256", flag: "🇺🇬", name: "Uganda", iso: "UG" },
  { code: "+257", flag: "🇧🇮", name: "Burundi", iso: "BI" },
  { code: "+258", flag: "🇲🇿", name: "Mozambique", iso: "MZ" },
  { code: "+260", flag: "🇿🇲", name: "Zambia", iso: "ZM" },
  { code: "+261", flag: "🇲🇬", name: "Madagascar", iso: "MG" },
  { code: "+262", flag: "🇾🇹", name: "Mayotte", iso: "YT" },
  { code: "+262", flag: "🇷🇪", name: "Reunion", iso: "RE" },
  { code: "+263", flag: "🇿🇼", name: "Zimbabwe", iso: "ZW" },
  { code: "+264", flag: "🇳🇦", name: "Namibia", iso: "NA" },
  { code: "+265", flag: "🇲🇼", name: "Malawi", iso: "MW" },
  { code: "+266", flag: "🇱🇸", name: "Lesotho", iso: "LS" },
  { code: "+267", flag: "🇧🇼", name: "Botswana", iso: "BW" },
  { code: "+268", flag: "🇸🇿", name: "Swaziland", iso: "SZ" },
  { code: "+269", flag: "🇰🇲", name: "Comoros", iso: "KM" },
  { code: "+290", flag: "🇸🇭", name: "Saint Helena", iso: "SH" },
  { code: "+291", flag: "🇪🇷", name: "Eritrea", iso: "ER" },
  { code: "+297", flag: "🇦🇼", name: "Aruba", iso: "AW" },
  { code: "+298", flag: "🇫🇴", name: "Faroe Islands", iso: "FO" },
  { code: "+299", flag: "🇬🇱", name: "Greenland", iso: "GL" },
  { code: "+350", flag: "🇬🇮", name: "Gibraltar", iso: "GI" },
  { code: "+351", flag: "🇵🇹", name: "Portugal", iso: "PT" },
  { code: "+352", flag: "🇱🇺", name: "Luxembourg", iso: "LU" },
  { code: "+353", flag: "🇮🇪", name: "Ireland", iso: "IE" },
  { code: "+354", flag: "🇮🇸", name: "Iceland", iso: "IS" },
  { code: "+355", flag: "🇦🇱", name: "Albania", iso: "AL" },
  { code: "+356", flag: "🇲🇹", name: "Malta", iso: "MT" },
  { code: "+357", flag: "🇨🇾", name: "Cyprus", iso: "CY" },
  { code: "+358", flag: "🇫🇮", name: "Finland", iso: "FI" },
  { code: "+359", flag: "🇧🇬", name: "Bulgaria", iso: "BG" },
  { code: "+370", flag: "🇱🇹", name: "Lithuania", iso: "LT" },
  { code: "+371", flag: "🇱🇻", name: "Latvia", iso: "LV" },
  { code: "+372", flag: "🇪🇪", name: "Estonia", iso: "EE" },
  { code: "+373", flag: "🇲🇩", name: "Moldova", iso: "MD" },
  { code: "+374", flag: "🇦🇲", name: "Armenia", iso: "AM" },
  { code: "+375", flag: "🇧🇾", name: "Belarus", iso: "BY" },
  { code: "+376", flag: "🇦🇩", name: "Andorra", iso: "AD" },
  { code: "+377", flag: "🇲🇨", name: "Monaco", iso: "MC" },
  { code: "+378", flag: "🇸🇲", name: "San Marino", iso: "SM" },
  { code: "+380", flag: "🇺🇦", name: "Ukraine", iso: "UA" },
  { code: "+381", flag: "🇷🇸", name: "Serbia", iso: "RS" },
  { code: "+382", flag: "🇲🇪", name: "Montenegro", iso: "ME" },
  { code: "+383", flag: "🇽🇰", name: "Kosovo", iso: "XK" },
  { code: "+385", flag: "🇭🇷", name: "Croatia", iso: "HR" },
  { code: "+386", flag: "🇸🇮", name: "Slovenia", iso: "SI" },
  { code: "+387", flag: "🇧🇦", name: "Bosnia and Herzegovina", iso: "BA" },
  { code: "+389", flag: "🇲🇰", name: "North Macedonia", iso: "MK" },
  { code: "+420", flag: "🇨🇿", name: "Czech Republic", iso: "CZ" },
  { code: "+421", flag: "🇸🇰", name: "Slovakia", iso: "SK" },
  { code: "+423", flag: "🇱🇮", name: "Liechtenstein", iso: "LI" },
  { code: "+500", flag: "🇫🇰", name: "Falkland Islands", iso: "FK" },
  { code: "+501", flag: "🇧🇿", name: "Belize", iso: "BZ" },
  { code: "+502", flag: "🇬🇹", name: "Guatemala", iso: "GT" },
  { code: "+503", flag: "🇸🇻", name: "El Salvador", iso: "SV" },
  { code: "+504", flag: "🇭🇳", name: "Honduras", iso: "HN" },
  { code: "+505", flag: "🇳🇮", name: "Nicaragua", iso: "NI" },
  { code: "+506", flag: "🇨🇷", name: "Costa Rica", iso: "CR" },
  { code: "+507", flag: "🇵🇦", name: "Panama", iso: "PA" },
  { code: "+508", flag: "🇵🇲", name: "Saint Pierre and Miquelon", iso: "PM" },
  { code: "+509", flag: "🇭🇹", name: "Haiti", iso: "HT" },
  { code: "+590", flag: "🇬🇵", name: "Guadeloupe", iso: "GP" },
  { code: "+591", flag: "🇧🇴", name: "Bolivia", iso: "BO" },
  { code: "+592", flag: "🇬🇾", name: "Guyana", iso: "GY" },
  { code: "+593", flag: "🇪🇨", name: "Ecuador", iso: "EC" },
  { code: "+594", flag: "🇬🇫", name: "French Guiana", iso: "GF" },
  { code: "+595", flag: "🇵🇾", name: "Paraguay", iso: "PY" },
  { code: "+596", flag: "🇲🇶", name: "Martinique", iso: "MQ" },
  { code: "+597", flag: "🇸🇷", name: "Suriname", iso: "SR" },
  { code: "+598", flag: "🇺🇾", name: "Uruguay", iso: "UY" },
  { code: "+599", flag: "🇨🇼", name: "Curacao", iso: "CW" },
  { code: "+670", flag: "🇹🇱", name: "East Timor", iso: "TL" },
  { code: "+672", flag: "🇳🇫", name: "Norfolk Island", iso: "NF" },
  { code: "+673", flag: "🇧🇳", name: "Brunei", iso: "BN" },
  { code: "+674", flag: "🇳🇷", name: "Nauru", iso: "NR" },
  { code: "+675", flag: "🇵🇬", name: "Papua New Guinea", iso: "PG" },
  { code: "+676", flag: "🇹🇴", name: "Tonga", iso: "TO" },
  { code: "+677", flag: "🇸🇧", name: "Solomon Islands", iso: "SB" },
  { code: "+678", flag: "🇻🇺", name: "Vanuatu", iso: "VU" },
  { code: "+679", flag: "🇫🇯", name: "Fiji", iso: "FJ" },
  { code: "+680", flag: "🇵🇼", name: "Palau", iso: "PW" },
  { code: "+681", flag: "🇼🇸", name: "Samoa", iso: "WS" },
  { code: "+682", flag: "🇨🇰", name: "Cook Islands", iso: "CK" },
  { code: "+683", flag: "🇳🇺", name: "Niue", iso: "NU" },
  { code: "+684", flag: "🇦🇸", name: "American Samoa", iso: "AS" },
  { code: "+685", flag: "🇼🇸", name: "Samoa", iso: "WS" },
  { code: "+686", flag: "🇰🇮", name: "Kiribati", iso: "KI" },
  { code: "+687", flag: "🇳🇨", name: "New Caledonia", iso: "NC" },
  { code: "+688", flag: "🇹🇻", name: "Tuvalu", iso: "TV" },
  { code: "+689", flag: "🇵🇫", name: "French Polynesia", iso: "PF" },
  { code: "+690", flag: "🇹🇰", name: "Tokelau", iso: "TK" },
  { code: "+691", flag: "🇫🇲", name: "Micronesia", iso: "FM" },
  { code: "+692", flag: "🇲🇭", name: "Marshall Islands", iso: "MH" },
  { code: "+800", flag: "🌍", name: "International", iso: "INT" },
  { code: "+808", flag: "🌍", name: "International", iso: "INT" },
  { code: "+870", flag: "🛰️", name: "Inmarsat", iso: "INM" },
  { code: "+878", flag: "📱", name: "Universal Personal", iso: "UPT" },
  { code: "+881", flag: "🛰️", name: "Global Mobile", iso: "GMSS" },
  { code: "+882", flag: "🛰️", name: "International", iso: "INT" },
  { code: "+883", flag: "🛰️", name: "International", iso: "INT" },
  { code: "+888", flag: "🆘", name: "Disaster Relief", iso: "DRS" },
  { code: "+979", flag: "💰", name: "Premium Rate", iso: "PRE" }
]

interface UserData {
  id: string
  email: string
  name: string
  firstName?: string
  lastName?: string
  avatar_url?: string
  phone?: string
  whatsapp?: string
  birthday?: string
  company?: string
  country?: string
  phoneCountryCode?: string
  phoneNumber?: string
  whatsappCountryCode?: string
  whatsappNumber?: string
}

export default function AccountSettings() {
  const { theme, setTheme } = useTheme()
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({})
  const [showPhoneCountryDropdown, setShowPhoneCountryDropdown] = useState(false)
  const [showWhatsappCountryDropdown, setShowWhatsappCountryDropdown] = useState(false)
  const [showCountryDropdown, setShowCountryDropdown] = useState(false)

  // Validation functions
  const validateField = (field: string, value: string): string => {
    switch (field) {
      case 'firstName':
        if (!value.trim()) return 'First name is required'
        if (value.trim().length < 2) return 'First name must be at least 2 characters'
        return ''
      case 'lastName':
        if (!value.trim()) return 'Last name is required'
        if (value.trim().length < 2) return 'Last name must be at least 2 characters'
        return ''
      case 'phoneCountryCode':
        if (value && !/^\+?\d{1,3}$/.test(value)) {
          return 'Please enter a valid country code (e.g., +1, +44)'
        }
        return ''
      case 'phoneNumber':
        if (value && !/^\d{6,15}$/.test(value.replace(/\s|-/g, ''))) {
          return 'Please enter a valid phone number'
        }
        return ''
      case 'whatsappCountryCode':
        if (value && !/^\+?\d{1,3}$/.test(value)) {
          return 'Please enter a valid country code (e.g., +1, +44)'
        }
        return ''
      case 'whatsappNumber':
        if (value && !/^\d{6,15}$/.test(value.replace(/\s|-/g, ''))) {
          return 'Please enter a valid WhatsApp number'
        }
        return ''
      case 'company':
        if (value && value.length > 100) return 'Company name is too long'
        return ''
      case 'country':
        if (value && value.length > 50) return 'Country name is too long'
        return ''
      default:
        return ''
    }
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}
    
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key as keyof typeof formData])
      if (error) errors[key] = error
    })
    
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleFieldBlur = (field: string) => {
    setTouchedFields(prev => ({ ...prev, [field]: true }))
    const error = validateField(field, formData[field as keyof typeof formData])
    setValidationErrors(prev => ({ ...prev, [field]: error }))
  }

  const handleCountrySelect = (type: 'phone' | 'whatsapp' | 'country', country: typeof countries[0]) => {
    if (type === 'phone') {
      setFormData(prev => ({ ...prev, phoneCountryCode: country.code }))
      setShowPhoneCountryDropdown(false)
      handleFieldBlur('phoneCountryCode')
    } else if (type === 'whatsapp') {
      setFormData(prev => ({ ...prev, whatsappCountryCode: country.code }))
      setShowWhatsappCountryDropdown(false)
      handleFieldBlur('whatsappCountryCode')
    } else {
      setFormData(prev => ({ ...prev, country: country.name }))
      setShowCountryDropdown(false)
      handleFieldBlur('country')
    }
  }
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneCountryCode: "",
    phoneNumber: "",
    whatsappCountryCode: "",
    whatsappNumber: "",
    birthday: "",
    company: "",
    country: ""
  })
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string>("")
  const [cropDialogOpen, setCropDialogOpen] = useState(false)
  const [imageToCrop, setImageToCrop] = useState<string>("")
  const [detectedCountry, setDetectedCountry] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Function to sort countries with detected country first
  const getSortedCountries = () => {
    if (!detectedCountry) return countries
    
    return [...countries].sort((a, b) => {
      if (a.code === detectedCountry) return -1
      if (b.code === detectedCountry) return 1
      return a.name.localeCompare(b.name)
    })
  }

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await fetch('/api/account/v2')
        
        if (response.status === 401) {
          // Redirect to login if not authenticated
          window.location.href = '/login?redirect=/account'
          return
        }
        
        if (response.ok) {
          const result = await response.json()
          if (result.token) {
            setUser(result.user)
            // Detect user's system country for default country codes
            const detectedCountry = detectUserCountry()
            setDetectedCountry(detectedCountry)
            
            setFormData({
            firstName: result.user.firstName || "",
            lastName: result.user.lastName || "",
            email: result.user.email || "",
            phoneCountryCode: result.user.phoneCountryCode || detectedCountry,
            phoneNumber: result.user.phoneNumber || "",
            whatsappCountryCode: result.user.whatsappCountryCode || detectedCountry,
            whatsappNumber: result.user.whatsappNumber || "",
            birthday: result.user.birthday || "",
            company: result.user.company || "",
            country: result.user.country || ""
          })
          } else {
            console.error("Invalid token received")
          }
        } else {
          console.error("Failed to load user data")
        }
      } catch (error) {
        console.error("Error loading user:", error)
      } finally {
        setLoading(false)
      }
    }
    
    loadUser()
  }, [])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.country-dropdown')) {
        setShowPhoneCountryDropdown(false)
        setShowWhatsappCountryDropdown(false)
        setShowCountryDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Validate on change if field has been touched
    if (touchedFields[field]) {
      const error = validateField(field, value)
      setValidationErrors(prev => ({ ...prev, [field]: error }))
    }
  }

  const handleAvatarFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Avatar file change triggered - event received')
    console.log('Event target:', event.target)
    console.log('Files in event:', event.target.files)
    const file = event.target.files?.[0]
    console.log('Selected file:', file)
    if (file) {
      console.log('Processing file:', file.name, file.type, file.size)
      // Create preview URL for cropping
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        console.log('File read complete, opening crop dialog')
        setImageToCrop(result)
        setCropDialogOpen(true)
      }
      reader.onerror = (error) => {
        console.error('FileReader error:', error)
      }
      reader.readAsDataURL(file)
    } else {
      console.log('No file selected')
    }
    // Reset the file input value so the same file can be selected again
    event.target.value = ''
  }

  const handleCropComplete = (croppedFile: File) => {
    console.log('Crop completed, file received:', croppedFile.name, croppedFile.size)
    setAvatarFile(croppedFile)
    // Create preview URL for the cropped image
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      console.log('Cropped image preview created')
      setAvatarPreview(result)
    }
    reader.onerror = (error) => {
      console.error('Error reading cropped file:', error)
    }
    reader.readAsDataURL(croppedFile)
  }

  const uploadAvatar = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('/api/account/avatar', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
      console.error('Avatar upload failed:', errorData)
      throw new Error(errorData.error || 'Failed to upload avatar')
    }

    const result = await response.json()
    if (!result.avatar_url) {
      console.error('Avatar upload response missing avatar_url:', result)
      throw new Error('Avatar upload completed but no URL returned')
    }
    
    return result.avatar_url
  }

  const handleSave = async () => {
    // Validate form before saving
    if (!validateForm()) {
      // Mark all fields as touched to show validation errors
      const allFields: Record<string, boolean> = {}
      Object.keys(formData).forEach(key => {
        allFields[key] = true
      })
      setTouchedFields(allFields)
      return
    }
    
    setSaving(true)
    try {
      let avatarUrl = user?.avatar_url || ""

      // Upload avatar file if selected
      if (avatarFile) {
        try {
          setUploading(true)
          avatarUrl = await uploadAvatar(avatarFile)
          // Update user state with new avatar URL immediately after upload
          if (avatarUrl) {
            setUser(prevUser => prevUser ? {
              ...prevUser,
              avatar_url: avatarUrl
            } : null)
          }
        } catch (error) {
          console.error('Error uploading avatar:', error)
          alert('Failed to upload avatar image')
          return
        } finally {
          setUploading(false)
        }
      }

      const response = await fetch('/api/account/v2', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          avatar_url: avatarUrl,
          phone: formData.phoneCountryCode && formData.phoneNumber ? `${formData.phoneCountryCode} ${formData.phoneNumber}`.trim() : '',
          whatsapp: formData.whatsappCountryCode && formData.whatsappNumber ? `${formData.whatsappCountryCode} ${formData.whatsappNumber}`.trim() : '',
          birthday: formData.birthday,
          company: formData.company,
          country: formData.country,
          phoneCountryCode: formData.phoneCountryCode,
          phoneNumber: formData.phoneNumber,
          whatsappCountryCode: formData.whatsappCountryCode,
          whatsappNumber: formData.whatsappNumber
        }),
      })

      if (response.ok) {
        const result = await response.json()
        if (result.token) {
          alert("Profile updated successfully!")
          // Update the user data with the response
          setUser(result.user)
          // Clear file and preview after successful save
          setAvatarFile(null)
          setAvatarPreview("")
        } else {
          alert("Invalid token received")
        }
      } else {
        const error = await response.json()
        alert("Error updating profile: " + error.error)
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      alert("Error updating profile")
    } finally {
      setSaving(false)
    }
  }

  const getAvatarSource = () => {
    if (avatarPreview) return avatarPreview
    if (user?.avatar_url) return user.avatar_url
    return "/avatars/shadcn.svg"
  }

  if (loading) {
    return (
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <div className="px-4 lg:px-6">
                  <p>Loading...</p>
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  if (!user) {
    return (
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <div className="px-4 lg:px-6">
                  <p>Please log in to access account settings.</p>
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {/* Avatar Cropper Dialog */}
              <AvatarCropper
                imageSrc={imageToCrop}
                open={cropDialogOpen}
                onOpenChange={(open) => {
                  console.log('Crop dialog open state changing to:', open)
                  setCropDialogOpen(open)
                }}
                onCropComplete={handleCropComplete}
                aspect={1} // Square crop
                minWidth={200}
                minHeight={200}
              />
              


              {/* Account Settings Content */}
              <div className="px-4 lg:px-6">
                <div className="grid gap-6">
                  {/* Avatar Card */}
                  <Card className="w-[30%] float-left mr-4">
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center gap-4">
                        <div 
                          className="relative cursor-pointer"
                          onClick={(e) => {
                            console.log('Avatar wrapper clicked')
                            e.stopPropagation()
                            if (fileInputRef.current) {
                              console.log('File input ref found, clicking...')
                              fileInputRef.current.click()
                            } else {
                              console.error('File input ref not found')
                            }
                          }}
                        >
                          <Avatar 
                            className="h-20 w-20 hover:opacity-80 transition-opacity"
                          >
                            <AvatarImage src={getAvatarSource()} alt={`${formData.firstName} ${formData.lastName}`} />
                            <AvatarFallback className="text-lg">
                              {getInitials(`${formData.firstName} ${formData.lastName}`)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <UploadIcon className="h-8 w-8 text-white bg-black bg-opacity-50 rounded-full p-1.5" />
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium">
                            @{formData.firstName}{formData.lastName ? ` ${formData.lastName}` : ''}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formData.email || 'No email provided'}
                          </p>
                          <div className="flex gap-2 mt-2 justify-center">
                            {avatarPreview && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                setAvatarFile(null)
                                setAvatarPreview("")
                              }}
                              >
                                Cancel
                              </Button>
                            )}
                          </div>
                          <Input
                            ref={fileInputRef}
                            id="avatar-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarFileChange}
                            className="hidden"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Basic Information Card */}
                  <Card className="w-1/2 float-left">
                    <CardHeader>
                      <CardTitle>Basic Information</CardTitle>
                      <CardDescription>Update your personal information</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      
                      <div className="flex gap-4">
                        <Field className="flex-1">
                          <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                          <FieldContent>
                            <Input
                              id="firstName"
                              value={formData.firstName}
                              onChange={(e) => handleInputChange('firstName', e.target.value)}
                              onBlur={() => handleFieldBlur('firstName')}
                              placeholder="First Name"
                            />
                            {touchedFields.firstName && !validationErrors.firstName && (
                              <CheckCircleIcon className="h-4 w-4 text-green-500 absolute right-2 top-2" />
                            )}
                            {touchedFields.firstName && validationErrors.firstName && (
                              <AlertCircleIcon className="h-4 w-4 text-red-500 absolute right-2 top-2" />
                            )}
                            <FieldError errors={[{ message: validationErrors.firstName }]} />
                          </FieldContent>
                        </Field>

                        <Field className="flex-1">
                          <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                          <FieldContent>
                            <Input
                              id="lastName"
                              value={formData.lastName}
                              onChange={(e) => handleInputChange('lastName', e.target.value)}
                              onBlur={() => handleFieldBlur('lastName')}
                              placeholder="Last Name"
                            />
                            {touchedFields.lastName && !validationErrors.lastName && (
                              <CheckCircleIcon className="h-4 w-4 text-green-500 absolute right-2 top-2" />
                            )}
                            {touchedFields.lastName && validationErrors.lastName && (
                              <AlertCircleIcon className="h-4 w-4 text-red-500 absolute right-2 top-2" />
                            )}
                            <FieldError errors={[{ message: validationErrors.lastName }]} />
                          </FieldContent>
                        </Field>
                      </div>

                      <Field>
                        <FieldLabel htmlFor="phoneCountryCode">Phone Number</FieldLabel>
                        <FieldContent>
                          <div className="flex gap-2">
                            <div className="relative country-dropdown">
                              <button
                                type="button"
                                onClick={() => setShowPhoneCountryDropdown(!showPhoneCountryDropdown)}
                                className="bg-input/20 dark:bg-input/30 border-input focus-visible:border-ring focus-visible:ring-ring/30 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 h-7 rounded-md border px-2 py-0.5 text-sm transition-colors focus-visible:ring-2 aria-invalid:ring-2 md:text-xs/relaxed w-20 flex items-center justify-between"
                              >
                                <span className="flex items-center gap-1">
                                  {formData.phoneCountryCode ? 
                                    countries.find(c => c.code === formData.phoneCountryCode)?.flag || "🌍" : 
                                    "🌍"
                                  }
                                  <span className="text-xs">{formData.phoneCountryCode || "Code"}</span>
                                </span>
                                <ChevronDownIcon className="h-3 w-3" />
                              </button>
                              {showPhoneCountryDropdown && (
                                <div className="absolute top-full left-0 mt-1 w-48 bg-background border border-input rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                                  {getSortedCountries().map((country) => (
                                    <button
                                      key={country.code}
                                      type="button"
                                      onClick={() => handleCountrySelect('phone', country)}
                                      className={`w-full px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground flex items-center gap-2 ${
                                        country.code === detectedCountry ? 'bg-accent/50' : ''
                                      }`}
                                    >
                                      <span>{country.flag}</span>
                                      <span className="flex-1">{country.name}</span>
                                      <span className="text-muted-foreground">{country.code}</span>
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                            <Input
                              id="phoneNumber"
                              type="tel"
                              value={formData.phoneNumber}
                              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                              onBlur={() => handleFieldBlur('phoneNumber')}
                              placeholder="(555) 123-4567"
                            />
                          </div>
                          {touchedFields.phoneCountryCode && !validationErrors.phoneCountryCode && !validationErrors.phoneNumber && (
                            <CheckCircleIcon className="h-4 w-4 text-green-500 absolute right-2 top-2" />
                          )}
                          {touchedFields.phoneCountryCode && (validationErrors.phoneCountryCode || validationErrors.phoneNumber) && (
                            <AlertCircleIcon className="h-4 w-4 text-red-500 absolute right-2 top-2" />
                          )}
                          <FieldError errors={[{ message: validationErrors.phoneCountryCode }, { message: validationErrors.phoneNumber }]} />
                        </FieldContent>
                      </Field>

                      <Field>
                        <FieldLabel htmlFor="whatsappCountryCode">WhatsApp Number</FieldLabel>
                        <FieldContent>
                          <div className="flex gap-2">
                            <div className="relative country-dropdown">
                              <button
                                type="button"
                                onClick={() => setShowWhatsappCountryDropdown(!showWhatsappCountryDropdown)}
                                className="bg-input/20 dark:bg-input/30 border-input focus-visible:border-ring focus-visible:ring-ring/30 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 h-7 rounded-md border px-2 py-0.5 text-sm transition-colors focus-visible:ring-2 aria-invalid:ring-2 md:text-xs/relaxed w-20 flex items-center justify-between"
                              >
                                <span className="flex items-center gap-1">
                                  {formData.whatsappCountryCode ? 
                                    countries.find(c => c.code === formData.whatsappCountryCode)?.flag || "🌍" : 
                                    "🌍"
                                  }
                                  <span className="text-xs">{formData.whatsappCountryCode || "Code"}</span>
                                </span>
                                <ChevronDownIcon className="h-3 w-3" />
                              </button>
                              {showWhatsappCountryDropdown && (
                                <div className="absolute top-full left-0 mt-1 w-48 bg-background border border-input rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                                  {getSortedCountries().map((country) => (
                                    <button
                                      key={country.code}
                                      type="button"
                                      onClick={() => handleCountrySelect('whatsapp', country)}
                                      className={`w-full px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground flex items-center gap-2 ${
                                        country.code === detectedCountry ? 'bg-accent/50' : ''
                                      }`}
                                    >
                                      <span>{country.flag}</span>
                                      <span className="flex-1">{country.name}</span>
                                      <span className="text-muted-foreground">{country.code}</span>
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                            <Input
                              id="whatsappNumber"
                              type="tel"
                              value={formData.whatsappNumber}
                              onChange={(e) => handleInputChange('whatsappNumber', e.target.value)}
                              onBlur={() => handleFieldBlur('whatsappNumber')}
                              placeholder="(555) 123-4567"
                            />
                          </div>
                          {touchedFields.whatsappCountryCode && !validationErrors.whatsappCountryCode && !validationErrors.whatsappNumber && (
                            <CheckCircleIcon className="h-4 w-4 text-green-500 absolute right-2 top-2" />
                          )}
                          {touchedFields.whatsappCountryCode && (validationErrors.whatsappCountryCode || validationErrors.whatsappNumber) && (
                            <AlertCircleIcon className="h-4 w-4 text-red-500 absolute right-2 top-2" />
                          )}
                          <FieldError errors={[{ message: validationErrors.whatsappCountryCode }, { message: validationErrors.whatsappNumber }]} />
                        </FieldContent>
                      </Field>

                      <Field>
                        <FieldLabel htmlFor="birthday">Birthday</FieldLabel>
                        <FieldContent>
                          <Input
                            id="birthday"
                            type="date"
                            value={formData.birthday}
                            onChange={(e) => handleInputChange('birthday', e.target.value)}
                            onBlur={() => handleFieldBlur('birthday')}
                          />
                          {touchedFields.birthday && !validationErrors.birthday && (
                            <CheckCircleIcon className="h-4 w-4 text-green-500 absolute right-2 top-2" />
                          )}
                          {touchedFields.birthday && validationErrors.birthday && (
                            <AlertCircleIcon className="h-4 w-4 text-red-500 absolute right-2 top-2" />
                          )}
                          <FieldError errors={[{ message: validationErrors.birthday }]} />
                        </FieldContent>
                      </Field>

                      <div className="flex gap-4">
                        <Field className="flex-1">
                          <FieldLabel htmlFor="company">Company</FieldLabel>
                          <FieldContent>
                            <Input
                              id="company"
                              type="text"
                              value={formData.company}
                              onChange={(e) => handleInputChange('company', e.target.value)}
                              onBlur={() => handleFieldBlur('company')}
                              placeholder="Your company name"
                            />
                            {touchedFields.company && !validationErrors.company && (
                              <CheckCircleIcon className="h-4 w-4 text-green-500 absolute right-2 top-2" />
                            )}
                            {touchedFields.company && validationErrors.company && (
                              <AlertCircleIcon className="h-4 w-4 text-red-500 absolute right-2 top-2" />
                            )}
                            <FieldError errors={[{ message: validationErrors.company }]} />
                          </FieldContent>
                        </Field>

                        <Field className="flex-1">
                          <FieldLabel htmlFor="country">Country</FieldLabel>
                          <FieldContent>
                            <div className="relative country-dropdown">
                              <button
                                type="button"
                                onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                                className="bg-input/20 dark:bg-input/30 border-input focus-visible:border-ring focus-visible:ring-ring/30 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 h-7 rounded-md border px-2 py-0.5 text-sm transition-colors focus-visible:ring-2 aria-invalid:ring-2 md:text-xs/relaxed w-full flex items-center justify-between"
                              >
                                <span className="flex items-center gap-2">
                                  {formData.country ? 
                                    countries.find(c => c.name === formData.country)?.flag || "🌍" : 
                                    "🌍"
                                  }
                                  <span className="text-sm">{formData.country || "Select Country"}</span>
                                </span>
                                <ChevronDownIcon className="h-3 w-3" />
                              </button>
                              {showCountryDropdown && (
                                <div className="absolute top-full left-0 mt-1 w-full bg-background border border-input rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                                  {countries.map((country) => (
                                    <button
                                      key={country.code}
                                      type="button"
                                      onClick={() => handleCountrySelect('country', country)}
                                      className="w-full px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground flex items-center gap-2"
                                    >
                                      <span>{country.flag}</span>
                                      <span className="flex-1">{country.name}</span>
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                            {touchedFields.country && !validationErrors.country && (
                              <CheckCircleIcon className="h-4 w-4 text-green-500 absolute right-2 top-2" />
                            )}
                            {touchedFields.country && validationErrors.country && (
                              <AlertCircleIcon className="h-4 w-4 text-red-500 absolute right-2 top-2" />
                            )}
                            <FieldError errors={[{ message: validationErrors.country }]} />
                          </FieldContent>
                        </Field>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Settings Tabs - Combined Account Security, Preferences, and Notifications */}
                  <Card className="w-full">
                    <Tabs defaultValue="security" className="w-full">
                      <CardHeader>
                        <TabsList className="grid w-full grid-cols-3">
                          <TabsTrigger value="security">Account Security</TabsTrigger>
                          <TabsTrigger value="preferences">Preferences</TabsTrigger>
                          <TabsTrigger value="notifications">Notifications</TabsTrigger>
                        </TabsList>
                      </CardHeader>
                      <CardContent>
                        <TabsContent value="security" className="space-y-4">
                          <div>
                            <Label>Password</Label>
                            <div className="flex gap-2 mt-1">
                              <Input
                                type="password"
                                value="••••••••"
                                disabled
                                className="bg-gray-100 dark:bg-gray-800"
                              />
                              <Button variant="outline">Change Password</Button>
                            </div>
                          </div>
                          
                          <div>
                            <Label>Two-Factor Authentication</Label>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-muted-foreground text-xs/relaxed">
                                Add an extra layer of security to your account
                              </span>
                              <Button variant="outline" size="sm">Enable 2FA</Button>
                            </div>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="preferences" className="space-y-4">
                          <div className="space-y-2">
                            <Label>Theme</Label>
                            <div className="flex gap-2">
                              <Button 
                                variant={theme === 'light' ? 'default' : 'outline'} 
                                size="sm"
                                onClick={() => setTheme('light')}
                              >
                                Light
                              </Button>
                              <Button 
                                variant={theme === 'dark' ? 'default' : 'outline'} 
                                size="sm"
                                onClick={() => setTheme('dark')}
                              >
                                Dark
                              </Button>
                              <Button 
                                variant={theme === 'system' ? 'default' : 'outline'} 
                                size="sm"
                                onClick={() => setTheme('system')}
                              >
                                System
                              </Button>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Language</Label>
                            <select className="w-full p-2 border rounded-md">
                              <option>English</option>
                              <option>Spanish</option>
                              <option>French</option>
                            </select>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="notifications" className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Label>Email notifications</Label>
                            <input type="checkbox" className="rounded" />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label>SMS notifications</Label>
                            <input type="checkbox" className="rounded" />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label>Push notifications</Label>
                            <input type="checkbox" className="rounded" />
                          </div>
                        </TabsContent>
                      </CardContent>
                    </Tabs>
                  </Card>

                  {/* Clearfix */}
                  <div className="clear-both"></div>

                  {/* Save Button */}
                  <div className="flex justify-end">
                    <Button onClick={handleSave} disabled={saving || uploading}>
                      <SaveIcon className={`h-4 w-4 mr-2 ${saving || uploading ? 'animate-spin' : ''}`} />
                      {uploading ? 'Uploading...' : saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}