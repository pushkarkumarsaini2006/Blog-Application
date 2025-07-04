import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const Input = ({ value, onChange, label, placeholder, type, id, name, autoComplete }) => {
  const [showPassword, setShowPassword] = useState(false);

  const inputId = id || name || label?.toLowerCase().replace(/\s+/g, '-') || undefined;

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  return  <div>
      <label className="text-[13px] text-slate-800" htmlFor={inputId}>{label}</label>

      <div className="input-box">
        <input
          id={inputId}
          name={name || inputId}
          type={
            type == "password" ? (showPassword ? "text" : "password") : type
          }
          placeholder={placeholder}
          className="w-full bg-transparent outline-none"
          value={value}
          onChange={(e) => onChange(e)}
          autoComplete={autoComplete || (type === "password" ? "current-password" : undefined)}
        />

        {type === "password" && (
          <>
            {showPassword ? (
              <FaRegEye
                size={22}
                className="text-primary cursor-pointer"
                onClick={() => toggleShowPassword()}
              />
            ) : (
              <FaRegEyeSlash
                size={22}
                className="text-slate-400 cursor-pointer"
                onClick={() => toggleShowPassword()}
              />
            )}
          </>
        )}
      </div>
    </div>
};

export default Input;
