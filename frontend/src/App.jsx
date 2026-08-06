import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import Treinos from "./pages/Treinos/Treinos";
import CadastrarTreino from "./pages/CadastrarTreino/CadastrarTreino";
import Alunos from "./pages/Alunos/Alunos";
import CadastrarAluno from "./pages/CadastrarAluno/CadastrarAluno";
import Agenda from "./pages/Agenda/Agenda";
import CadastrarAgenda from "./pages/CadastrarAgenda/CadastrarAgenda";
import Avaliacoes from "./pages/Avaliacoes/Avaliacoes";
import CadastrarAvaliacao from "./pages/CadastrarAvaliacao/CadastrarAvaliacao";

export default function App() {

    return (

        <BrowserRouter>

            <Routes>

                <Route path="/" element={<Login />} />

                <Route path="/dashboard" element={<Dashboard />} />

                <Route path="/treinos" element={<Treinos />} />

                <Route path="/cadastrar-treino" element={<CadastrarTreino />} />

                <Route path="/alunos" element={<Alunos />} />

                <Route path="/cadastrar-aluno" element={<CadastrarAluno />} />

                <Route path="/agenda" element={<Agenda />} />

                <Route path="/cadastrar-agenda" element={<CadastrarAgenda />} />

                <Route path="/avaliacoes" element={<Avaliacoes />} />

                <Route path="/cadastrar-avaliacao" element={<CadastrarAvaliacao />} />
     
   


            </Routes>

        </BrowserRouter>

    );

}