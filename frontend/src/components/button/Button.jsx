export default function Button({ children, type = "button" }) {
    return (
        <button
            type={type}
            className="w-full bg-purple-700 hover:bg-purple-800 text-white font-semibold py-3 rounded-xl transition duration-300 shadow-md hover:shadow-lg cursor-pointer"
        >
            {children}
        </button>
    );
}