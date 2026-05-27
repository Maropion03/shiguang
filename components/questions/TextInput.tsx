"use client";

export default function TextInput({
  value,
  onChange,
  placeholder,
  maxLength,
  optional
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  maxLength?: number;
  optional?: boolean;
}) {
  return (
    <div className="relative">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={5}
        className="w-full bg-transparent border-b border-ink/20 focus:border-ink/60 outline-none resize-none py-3 text-ink font-serif text-base md:text-lg leading-loose placeholder:text-ink-wash/70 transition-colors"
      />
      <div className="flex items-center justify-between mt-3 text-xs text-ink-wash">
        <span>{optional ? "可留空" : "请简单写几句"}</span>
        {maxLength && (
          <span>
            {value.length} / {maxLength}
          </span>
        )}
      </div>
    </div>
  );
}
