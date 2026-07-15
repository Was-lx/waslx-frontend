// Windows TimeZoneInfo IDs (matching the backend's timeZoneId), with a readable
// label. Kept short and MENA-first; the current tenant value is always shown even
// when it isn't in this list (see the page's timezoneOptions()).
export interface TimezoneOption {
  id: string;
  label: string;
}

export const TIMEZONE_OPTIONS: readonly TimezoneOption[] = [
  { id: 'Egypt Standard Time', label: '(UTC+02:00) Egypt Standard Time — Cairo' },
  { id: 'Arab Standard Time', label: '(UTC+03:00) Arab Standard Time — Riyadh, Kuwait' },
  { id: 'Arabian Standard Time', label: '(UTC+04:00) Arabian Standard Time — Dubai' },
  { id: 'E. Africa Standard Time', label: '(UTC+03:00) E. Africa Standard Time — Nairobi' },
  { id: 'Turkey Standard Time', label: '(UTC+03:00) Turkey Standard Time — Istanbul' },
  { id: 'GTB Standard Time', label: '(UTC+02:00) GTB Standard Time — Athens, Beirut' },
  { id: 'W. Europe Standard Time', label: '(UTC+01:00) W. Europe Standard Time — Berlin, Paris' },
  { id: 'GMT Standard Time', label: '(UTC+00:00) GMT Standard Time — London, Dublin' },
  { id: 'UTC', label: '(UTC+00:00) Coordinated Universal Time' },
  { id: 'India Standard Time', label: '(UTC+05:30) India Standard Time — Mumbai' },
  { id: 'Eastern Standard Time', label: '(UTC-05:00) Eastern Standard Time — New York' },
  { id: 'Pacific Standard Time', label: '(UTC-08:00) Pacific Standard Time — Los Angeles' },
];
