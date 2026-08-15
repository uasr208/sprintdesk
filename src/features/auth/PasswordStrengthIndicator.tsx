import React from "react";

interface PasswordStrengthProps {
  password: string;
}

export const PasswordStrengthIndicator: React.FC<PasswordStrengthProps> = ({
  password,
}) => {
  const getStrength = (pass: string) => {
    let score = 0;
    if (!pass) return { score: 0, label: "", color: "bg-slate-700" };
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    switch (score) {
      case 1:
        return { score: 1, label: "Weak", color: "bg-red-500" };
      case 2:
        return { score: 2, label: "Fair", color: "bg-amber-500" };
      case 3:
        return { score: 3, label: "Good", color: "bg-blue-500" };
      case 4:
        return { score: 4, label: "Strong", color: "bg-emerald-500" };
      default:
        return { score: 0, label: "Very Weak", color: "bg-red-500" };
    }
  };

  const strength = getStrength(password);

  if (!password) return null;

  return (
    <div className="mt-2 space-y-1">
      <div className="flex justify-between items-center text-xs">
        <span className="text-slate-400">Password Strength:</span>
        <span className="font-semibold text-slate-200">{strength.label}</span>
      </div>
      <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden flex gap-1">
        {[1, 2, 3, 4].map((step) => (
          <div
            key={step}
            className={`h-full flex-1 transition-all duration-300 ${
              step <= strength.score ? strength.color : "bg-slate-700"
            }`}
          />
        ))}
      </div>
    </div>
  );
};
