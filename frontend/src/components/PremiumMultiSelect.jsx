import React, { useState, useMemo } from "react";
import { ChevronDown, Search, X } from "lucide-react";

function PremiumMultiSelect({
  label,
  options,
  value = [],
  onChange,
  placeholder = "Select...",
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredOptions = useMemo(() => {
    return options.filter((opt) =>
      String(opt).toLowerCase().includes(search.toLowerCase()),
    );
  }, [options, search]);

  const toggleValue = (val) => {
    if (value.includes(val)) {
      onChange(value.filter((v) => v !== val));
    } else {
      onChange([...value, val]);
    }
  };

  const removeChip = (val, e) => {
    e.stopPropagation();
    onChange(value.filter((v) => v !== val));
  };

  return (
    <div className="relative w-full">
      <label className="block text-sm font-semibold mb-1">{label}</label>

      {/* trigger */}
      <div
        onClick={() => setOpen((o) => !o)}
        className="min-h-[44px] w-full border rounded-xl px-3 py-2 bg-white flex flex-wrap gap-2 items-center cursor-pointer hover:border-sky-400 transition"
      >
        {value.length === 0 && (
          <span className="text-gray-400 text-sm">{placeholder}</span>
        )}

        {value.map((v) => (
          <span
            key={v}
            className="bg-sky-100 text-sky-700 px-2 py-1 rounded-lg text-xs flex items-center gap-1"
          >
            {v}
            <X
              size={14}
              className="cursor-pointer"
              onClick={(e) => removeChip(v, e)}
            />
          </span>
        ))}

        <ChevronDown size={16} className="ml-auto text-gray-400" />
      </div>

      {/* dropdown */}
      {open && (
        <div className="absolute z-50 mt-2 w-full bg-white border rounded-xl shadow-xl">
          {/* search */}
          <div className="flex items-center gap-2 p-2 border-b">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full outline-none text-sm"
            />
          </div>

          {/* options */}
          <div className="max-h-56 overflow-y-auto">
            {filteredOptions.length === 0 && (
              <div className="p-3 text-sm text-gray-400 text-center">
                No options
              </div>
            )}

            {filteredOptions.map((opt) => (
              <label
                key={opt}
                className="flex items-center gap-2 px-3 py-2 hover:bg-sky-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={value.includes(opt)}
                  onChange={() => toggleValue(opt)}
                />
                <span className="text-sm">{opt}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default PremiumMultiSelect;
