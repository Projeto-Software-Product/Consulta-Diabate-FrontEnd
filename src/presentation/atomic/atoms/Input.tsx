// src/presentation/atomic/atoms/Input.tsx
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  fullWidth?: boolean;
}

export default function Input({ fullWidth, className, ...props }: InputProps) {
  return (
    <input
      className={`input ${fullWidth ? "input-full-width" : ""} ${
        className || ""
      }`}
      {...props}
    />
  );
}
