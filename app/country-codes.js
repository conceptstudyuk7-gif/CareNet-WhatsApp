export const COUNTRY_CODES = [
  { code: "93", name: "Afghanistan" },
  { code: "355", name: "Albania" },
  { code: "213", name: "Algeria" },
  { code: "376", name: "Andorra" },
  { code: "244", name: "Angola" },
  { code: "54", name: "Argentina" },
  { code: "374", name: "Armenia" },
  { code: "61", name: "Australia" },
  { code: "43", name: "Austria" },
  { code: "994", name: "Azerbaijan" },
  { code: "973", name: "Bahrain" },
  { code: "880", name: "Bangladesh" },
  { code: "375", name: "Belarus" },
  { code: "32", name: "Belgium" },
  { code: "501", name: "Belize" },
  { code: "229", name: "Benin" },
  { code: "975", name: "Bhutan" },
  { code: "591", name: "Bolivia" },
  { code: "387", name: "Bosnia and Herzegovina" },
  { code: "267", name: "Botswana" },
  { code: "55", name: "Brazil" },
  { code: "673", name: "Brunei" },
  { code: "359", name: "Bulgaria" },
  { code: "855", name: "Cambodia" },
  { code: "237", name: "Cameroon" },
  { code: "1", name: "Canada" },
  { code: "56", name: "Chile" },
  { code: "86", name: "China" },
  { code: "57", name: "Colombia" },
  { code: "506", name: "Costa Rica" },
  { code: "385", name: "Croatia" },
  { code: "357", name: "Cyprus" },
  { code: "420", name: "Czech Republic" },
  { code: "45", name: "Denmark" },
  { code: "593", name: "Ecuador" },
  { code: "20", name: "Egypt" },
  { code: "503", name: "El Salvador" },
  { code: "372", name: "Estonia" },
  { code: "251", name: "Ethiopia" },
  { code: "358", name: "Finland" },
  { code: "33", name: "France" },
  { code: "995", name: "Georgia" },
  { code: "49", name: "Germany" },
  { code: "233", name: "Ghana" },
  { code: "30", name: "Greece" },
  { code: "502", name: "Guatemala" },
  { code: "852", name: "Hong Kong" },
  { code: "36", name: "Hungary" },
  { code: "354", name: "Iceland" },
  { code: "91", name: "India" },
  { code: "62", name: "Indonesia" },
  { code: "98", name: "Iran" },
  { code: "964", name: "Iraq" },
  { code: "353", name: "Ireland" },
  { code: "972", name: "Israel" },
  { code: "39", name: "Italy" },
  { code: "81", name: "Japan" },
  { code: "962", name: "Jordan" },
  { code: "7", name: "Kazakhstan" },
  { code: "254", name: "Kenya" },
  { code: "965", name: "Kuwait" },
  { code: "996", name: "Kyrgyzstan" },
  { code: "856", name: "Laos" },
  { code: "371", name: "Latvia" },
  { code: "961", name: "Lebanon" },
  { code: "370", name: "Lithuania" },
  { code: "352", name: "Luxembourg" },
  { code: "853", name: "Macau" },
  { code: "60", name: "Malaysia" },
  { code: "960", name: "Maldives" },
  { code: "356", name: "Malta" },
  { code: "52", name: "Mexico" },
  { code: "373", name: "Moldova" },
  { code: "377", name: "Monaco" },
  { code: "976", name: "Mongolia" },
  { code: "382", name: "Montenegro" },
  { code: "212", name: "Morocco" },
  { code: "977", name: "Nepal" },
  { code: "31", name: "Netherlands" },
  { code: "64", name: "New Zealand" },
  { code: "234", name: "Nigeria" },
  { code: "47", name: "Norway" },
  { code: "968", name: "Oman" },
  { code: "92", name: "Pakistan" },
  { code: "507", name: "Panama" },
  { code: "595", name: "Paraguay" },
  { code: "51", name: "Peru" },
  { code: "63", name: "Philippines" },
  { code: "48", name: "Poland" },
  { code: "351", name: "Portugal" },
  { code: "974", name: "Qatar" },
  { code: "40", name: "Romania" },
  { code: "7", name: "Russia" },
  { code: "966", name: "Saudi Arabia" },
  { code: "381", name: "Serbia" },
  { code: "65", name: "Singapore" },
  { code: "421", name: "Slovakia" },
  { code: "386", name: "Slovenia" },
  { code: "27", name: "South Africa" },
  { code: "82", name: "South Korea" },
  { code: "34", name: "Spain" },
  { code: "94", name: "Sri Lanka" },
  { code: "46", name: "Sweden" },
  { code: "41", name: "Switzerland" },
  { code: "886", name: "Taiwan" },
  { code: "992", name: "Tajikistan" },
  { code: "66", name: "Thailand" },
  { code: "216", name: "Tunisia" },
  { code: "90", name: "Turkey" },
  { code: "993", name: "Turkmenistan" },
  { code: "256", name: "Uganda" },
  { code: "380", name: "Ukraine" },
  { code: "971", name: "United Arab Emirates" },
  { code: "44", name: "United Kingdom" },
  { code: "1", name: "United States" },
  { code: "598", name: "Uruguay" },
  { code: "998", name: "Uzbekistan" },
  { code: "58", name: "Venezuela" },
  { code: "84", name: "Vietnam" },
  { code: "967", name: "Yemen" },
  { code: "260", name: "Zambia" },
  { code: "263", name: "Zimbabwe" },
];

export function formatCountryLabel(country) {
  return `+${country.code} ${country.name}`;
}

export function getCountryOptions(selectedCode) {
  const normalizedCode = String(selectedCode || "").replace(/\D/g, "");
  const hasSelected = COUNTRY_CODES.some(
    (country) => country.code === normalizedCode,
  );

  if (!normalizedCode || hasSelected) {
    return COUNTRY_CODES;
  }

  return [
    { code: normalizedCode, name: "Selected country" },
    ...COUNTRY_CODES,
  ];
}

export function getUniqueCountryCodesDescending() {
  return [...new Set(COUNTRY_CODES.map((country) => country.code))].sort(
    (left, right) => right.length - left.length,
  );
}

export function findCountryByCode(code, countries = COUNTRY_CODES) {
  const normalizedCode = String(code || "").replace(/\D/g, "");
  return countries.find((country) => country.code === normalizedCode) || null;
}

export function orderCountriesWithSelectedFirst(selectedCode, countries) {
  const selected = findCountryByCode(selectedCode, countries);
  if (!selected) {
    return countries;
  }

  const rest = countries.filter((country) => country.code !== selected.code);
  return [selected, ...rest];
}

export function splitStoredPhoneNumber(
  fullPhone,
  storedCountryCode,
  storedLocalPhoneNumber,
) {
  const code = String(storedCountryCode || "").replace(/\D/g, "");
  const local = String(storedLocalPhoneNumber || "").replace(/\D/g, "");

  if (code && local) {
    return { countryCode: code, localPhoneNumber: local };
  }

  const full = String(fullPhone || "").replace(/\D/g, "");
  if (!full) {
    return { countryCode: code || "91", localPhoneNumber: "" };
  }

  if (code && full.startsWith(code) && full.length > code.length) {
    return { countryCode: code, localPhoneNumber: full.slice(code.length) };
  }

  for (const countryCode of getUniqueCountryCodesDescending()) {
    if (full.startsWith(countryCode) && full.length > countryCode.length) {
      return {
        countryCode,
        localPhoneNumber: full.slice(countryCode.length),
      };
    }
  }

  if (full.length === 10) {
    return { countryCode: "91", localPhoneNumber: full };
  }

  return { countryCode: code || "91", localPhoneNumber: full };
}

export function filterCountryOptions(query, countries) {
  const normalizedQuery = String(query || "")
    .trim()
    .toLowerCase()
    .replace(/^\+/, "");

  if (!normalizedQuery) {
    return countries;
  }

  const aliases = {
    uae: "united arab emirates",
    uk: "united kingdom",
    usa: "united states",
    us: "united states",
  };

  const expandedQuery = aliases[normalizedQuery] || normalizedQuery;

  return countries.filter((country) => {
    const label = formatCountryLabel(country).toLowerCase();
    const name = country.name.toLowerCase();
    const code = country.code;

    return (
      label.includes(expandedQuery) ||
      name.includes(expandedQuery) ||
      code.includes(normalizedQuery) ||
      code.startsWith(normalizedQuery) ||
      name.split(/\s+/).some((word) => word.startsWith(expandedQuery))
    );
  });
}
