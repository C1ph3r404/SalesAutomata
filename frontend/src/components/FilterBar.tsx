export interface FilterField {
  name: string;
  label: string;
  type?: "text" | "number" | "date" | "select";
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
}

interface FilterBarProps {
  fields: FilterField[];
  values: Record<string, string>;
  onChange: (name: string, value: string) => void;
  onSubmit: () => void;
  onReset: () => void;
}

export function FilterBar({
  fields,
  values,
  onChange,
  onSubmit,
  onReset,
}: FilterBarProps) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      {fields.map((field) => (
        <label key={field.name}>
          {field.label}{" "}
          {field.type === "select" ? (
            <select
              name={field.name}
              value={values[field.name] ?? ""}
              onChange={(event) => onChange(field.name, event.target.value)}
            >
              <option value="">All</option>
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={field.type ?? "text"}
              name={field.name}
              placeholder={field.placeholder}
              value={values[field.name] ?? ""}
              onChange={(event) => onChange(field.name, event.target.value)}
            />
          )}
        </label>
      ))}
      <button type="submit">Apply filters</button>
      <button type="button" onClick={onReset}>
        Reset
      </button>
    </form>
  );
}
