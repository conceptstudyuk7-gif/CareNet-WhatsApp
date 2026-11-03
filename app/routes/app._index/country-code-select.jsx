import { useMemo } from "react";
import {
  formatCountryLabel,
  orderCountriesWithSelectedFirst,
} from "../../country-codes.js";
import styles from "./styles.module.css";

export function CountryCodeSelect({
  id,
  name,
  value,
  options,
  onChange,
  required = false,
}) {
  const selectedCode = String(value || "").replace(/\D/g, "");

  const countryOptions = useMemo(
    () => orderCountriesWithSelectedFirst(selectedCode, options),
    [options, selectedCode],
  );

  const handleSelectChange = (event) => {
    onChange?.(event.target.value.replace(/\D/g, ""));
  };

  return (
    <div className={styles.countrySelect}>
      <label className={styles.countryFieldLabel} htmlFor={`${id}-select`}>
        Country code
      </label>

      <div className={styles.countryNativeWrap}>
        <select
          id={`${id}-select`}
          name={name}
          className={styles.countryNativeDropdown}
          value={selectedCode}
          required={required}
          onChange={handleSelectChange}
        >
          {countryOptions.map((country) => (
            <option
              key={`${country.code}-${country.name}`}
              value={country.code}
            >
              {formatCountryLabel(country)}
            </option>
          ))}
        </select>
        <span className={styles.countryNativeChevron} aria-hidden="true">
          ▼
        </span>
      </div>
    </div>
  );
}
