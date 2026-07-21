export default function Input({
    label,
    type,
    placeholder
}) {
    return (
        <div>
            <label className="block text-gray-700 font-medium mb-2">
                {label}
            </label>

            <input
                type={type}
                placeholder={placeholder}
                className="w-full rounded-xl border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
        </div>
    );
}