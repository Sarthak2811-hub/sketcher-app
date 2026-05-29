import { type JSX, type InputHTMLAttributes } from "react";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>): JSX.Element {
  return (
    <input
      className={`p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white text-black ${className || ""}`}
      {...props}
    />
  );
}
