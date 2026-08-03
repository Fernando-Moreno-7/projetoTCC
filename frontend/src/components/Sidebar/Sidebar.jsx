import { useNavigate } from "react-router-dom";

import {
    LayoutDashboard,
    Dumbbell,
    CalendarDays,
    ClipboardCheck,
    Users,
    LogOut
} from "lucide-react";

export default function Sidebar() {

    const navigate = useNavigate();

    return (

        <aside className="w-64 h-screen bg-purple-800 text-white flex flex-col">

            <div className="p-6 border-b border-purple-700">

                <h1 className="text-3xl font-bold">

                    EvolutionFit

                </h1>

            </div>

            <nav className="flex-1 p-5">

                <ul className="space-y-4">

                    <li
                        onClick={() => navigate("/dashboard")}
                        className="flex items-center gap-3 cursor-pointer hover:text-purple-300 transition"
                    >

                        <LayoutDashboard size={20} />

                        Dashboard

                    </li>

                    <li
                        onClick={() => navigate("/alunos")}
                        className="flex items-center gap-3 cursor-pointer hover:text-purple-300 transition"
                    >

                        <Users size={20} />

                        Alunos

                    </li>

                    <li
                        onClick={() => navigate("/treinos")}
                        className="flex items-center gap-3 cursor-pointer hover:text-purple-300 transition"
                    >

                        <Dumbbell size={20} />

                        Treinos

                    </li>

                    <li
                        onClick={() => navigate("/agenda")}
                        className="flex items-center gap-3 cursor-pointer hover:text-purple-300 transition"
                    >

                        <CalendarDays size={20} />

                        Agenda

                    </li>

                    <li
                        className="flex items-center gap-3 cursor-pointer hover:text-purple-300 transition"
                    >

                        <ClipboardCheck size={20} />

                        Avaliações

                    </li>

                </ul>

            </nav>

            <div className="p-5 border-t border-purple-700">

                <button
                    onClick={() => navigate("/")}
                    className="flex items-center gap-3 hover:text-red-300 transition cursor-pointer"
                >

                    <LogOut size={20} />

                    Sair

                </button>

            </div>

        </aside>

    );

}