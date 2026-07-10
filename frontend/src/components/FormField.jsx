export function Field({ label, hint, error, children }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-leaf-900">{label}</span>
      <div className="mt-1">{children}</div>
      {hint && !error && <p className="mt-1 text-xs text-leaf-800/60">{hint}</p>}
      {error && <p className="mt-1 text-xs font-medium text-red-600">{error}</p>}
    </label>
  );
}

export function Input(props) {
  return (
    <input
      {...props}
      className={`w-full rounded-xl border border-leaf-200 bg-white px-4 py-2.5 text-sm text-leaf-900 shadow-sm placeholder:text-leaf-800/40 focus:border-leaf-500 focus:outline-none focus:ring-2 focus:ring-leaf-500/30 ${props.className || ''}`}
    />
  );
}

export function Select({ children, ...props }) {
  return (
    <select
      {...props}
      className="w-full rounded-xl border border-leaf-200 bg-white px-4 py-2.5 text-sm text-leaf-900 shadow-sm focus:border-leaf-500 focus:outline-none focus:ring-2 focus:ring-leaf-500/30"
    >
      {children}
    </select>
  );
}
