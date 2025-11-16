/**
 * Country, Currency, and Timezone Constants
 */

export const COUNTRIES = [
  { value: 'Australia', label: 'Australia', flag: '🇦🇺' },
  { value: 'United States', label: 'United States', flag: '🇺🇸' },
  { value: 'United Kingdom', label: 'United Kingdom', flag: '🇬🇧' },
  { value: 'Canada', label: 'Canada', flag: '🇨🇦' },
  { value: 'Singapore', label: 'Singapore', flag: '🇸🇬' },
  { value: 'Malaysia', label: 'Malaysia', flag: '🇲🇾' },
  { value: 'Indonesia', label: 'Indonesia', flag: '🇮🇩' },
  { value: 'Thailand', label: 'Thailand', flag: '🇹🇭' },
  { value: 'Philippines', label: 'Philippines', flag: '🇵🇭' },
  { value: 'Vietnam', label: 'Vietnam', flag: '🇻🇳' },
  { value: 'Japan', label: 'Japan', flag: '🇯🇵' },
  { value: 'South Korea', label: 'South Korea', flag: '🇰🇷' },
  { value: 'China', label: 'China', flag: '🇨🇳' },
  { value: 'India', label: 'India', flag: '🇮🇳' },
  { value: 'New Zealand', label: 'New Zealand', flag: '🇳🇿' },
];

export const CURRENCIES = [
  { value: 'AUD', label: 'Australian Dollar (AUD)', symbol: 'A$' },
  { value: 'USD', label: 'US Dollar (USD)', symbol: '$' },
  { value: 'GBP', label: 'British Pound (GBP)', symbol: '£' },
  { value: 'EUR', label: 'Euro (EUR)', symbol: '€' },
  { value: 'CAD', label: 'Canadian Dollar (CAD)', symbol: 'C$' },
  { value: 'SGD', label: 'Singapore Dollar (SGD)', symbol: 'S$' },
  { value: 'MYR', label: 'Malaysian Ringgit (MYR)', symbol: 'RM' },
  { value: 'IDR', label: 'Indonesian Rupiah (IDR)', symbol: 'Rp' },
  { value: 'THB', label: 'Thai Baht (THB)', symbol: '฿' },
  { value: 'PHP', label: 'Philippine Peso (PHP)', symbol: '₱' },
  { value: 'VND', label: 'Vietnamese Dong (VND)', symbol: '₫' },
  { value: 'JPY', label: 'Japanese Yen (JPY)', symbol: '¥' },
  { value: 'KRW', label: 'South Korean Won (KRW)', symbol: '₩' },
  { value: 'CNY', label: 'Chinese Yuan (CNY)', symbol: '¥' },
  { value: 'INR', label: 'Indian Rupee (INR)', symbol: '₹' },
  { value: 'NZD', label: 'New Zealand Dollar (NZD)', symbol: 'NZ$' },
];

export const TIMEZONES = [
  // Australia
  { value: 'Australia/Sydney', label: 'Sydney (GMT+11)', region: 'Australia' },
  { value: 'Australia/Melbourne', label: 'Melbourne (GMT+11)', region: 'Australia' },
  { value: 'Australia/Brisbane', label: 'Brisbane (GMT+10)', region: 'Australia' },
  { value: 'Australia/Perth', label: 'Perth (GMT+8)', region: 'Australia' },
  { value: 'Australia/Adelaide', label: 'Adelaide (GMT+10:30)', region: 'Australia' },
  { value: 'Australia/Darwin', label: 'Darwin (GMT+9:30)', region: 'Australia' },
  { value: 'Australia/Hobart', label: 'Hobart (GMT+11)', region: 'Australia' },
  
  // Americas
  { value: 'America/New_York', label: 'New York (GMT-5)', region: 'Americas' },
  { value: 'America/Chicago', label: 'Chicago (GMT-6)', region: 'Americas' },
  { value: 'America/Denver', label: 'Denver (GMT-7)', region: 'Americas' },
  { value: 'America/Los_Angeles', label: 'Los Angeles (GMT-8)', region: 'Americas' },
  { value: 'America/Toronto', label: 'Toronto (GMT-5)', region: 'Americas' },
  { value: 'America/Vancouver', label: 'Vancouver (GMT-8)', region: 'Americas' },
  
  // Europe
  { value: 'Europe/London', label: 'London (GMT+0)', region: 'Europe' },
  { value: 'Europe/Paris', label: 'Paris (GMT+1)', region: 'Europe' },
  { value: 'Europe/Berlin', label: 'Berlin (GMT+1)', region: 'Europe' },
  { value: 'Europe/Rome', label: 'Rome (GMT+1)', region: 'Europe' },
  { value: 'Europe/Madrid', label: 'Madrid (GMT+1)', region: 'Europe' },
  
  // Asia
  { value: 'Asia/Singapore', label: 'Singapore (GMT+8)', region: 'Asia' },
  { value: 'Asia/Kuala_Lumpur', label: 'Kuala Lumpur (GMT+8)', region: 'Asia' },
  { value: 'Asia/Jakarta', label: 'Jakarta (GMT+7)', region: 'Asia' },
  { value: 'Asia/Bangkok', label: 'Bangkok (GMT+7)', region: 'Asia' },
  { value: 'Asia/Manila', label: 'Manila (GMT+8)', region: 'Asia' },
  { value: 'Asia/Ho_Chi_Minh', label: 'Ho Chi Minh (GMT+7)', region: 'Asia' },
  { value: 'Asia/Tokyo', label: 'Tokyo (GMT+9)', region: 'Asia' },
  { value: 'Asia/Seoul', label: 'Seoul (GMT+9)', region: 'Asia' },
  { value: 'Asia/Shanghai', label: 'Shanghai (GMT+8)', region: 'Asia' },
  { value: 'Asia/Hong_Kong', label: 'Hong Kong (GMT+8)', region: 'Asia' },
  { value: 'Asia/Kolkata', label: 'Kolkata (GMT+5:30)', region: 'Asia' },
  { value: 'Asia/Dubai', label: 'Dubai (GMT+4)', region: 'Asia' },
  
  // Pacific
  { value: 'Pacific/Auckland', label: 'Auckland (GMT+13)', region: 'Pacific' },
  { value: 'Pacific/Fiji', label: 'Fiji (GMT+12)', region: 'Pacific' },
];

// Group timezones by region for better UX
export const TIMEZONE_GROUPS = TIMEZONES.reduce((acc, tz) => {
  if (!acc[tz.region]) {
    acc[tz.region] = [];
  }
  acc[tz.region].push(tz);
  return acc;
}, {} as Record<string, typeof TIMEZONES>);
