export default function Card({

    titulo,

    valor,

    icone,

    cor = "bg-purple-600"

}) {

    return (

        <div className="bg-white rounded-2xl shadow-md p-6 flex justify-between items-center hover:shadow-xl transition">

            <div>

                <p className="text-gray-500 text-sm">

                    {titulo}

                </p>

                <h2 className="text-3xl font-bold mt-2">

                    {valor}

                </h2>

            </div>

            <div className={`${cor} w-14 h-14 rounded-xl flex items-center justify-center text-white`}>

                {icone}

            </div>

        </div>

    );

}