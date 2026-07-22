export default function Input({

    label,

    type,

    placeholder,

    icon

}) {

    return (

        <div>

            <label className="block text-gray-700 font-medium mb-2">

                {label}

            </label>

            <div className="relative">

                <span className="absolute left-4 top-4 text-gray-400">

                    {icon}

                </span>

                <input

                    type={type}

                    placeholder={placeholder}

                    className="w-full rounded-xl border border-gray-300 py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-600"

                />

            </div>

        </div>

    );

}