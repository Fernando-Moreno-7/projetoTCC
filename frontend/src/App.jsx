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
import CadastrarUsuario from "./pages/CadastrarUsuario/CadastrarUsuario";

import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

export default function App() {

    return (

        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={<Login />}
                />

                <Route
                    path="/cadastrar-usuario"
                    element={<CadastrarUsuario />}
                />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/treinos"
                    element={
                        <ProtectedRoute>
                            <Treinos />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/cadastrar-treino"
                    element={
                        <ProtectedRoute>
                            <CadastrarTreino />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/alunos"
                    element={
                        <ProtectedRoute>
                            <Alunos />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/cadastrar-aluno"
                    element={
                        <ProtectedRoute>
                            <CadastrarAluno />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/agenda"
                    element={
                        <ProtectedRoute>
                            <Agenda />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/cadastrar-agenda"
                    element={
                        <ProtectedRoute>
                            <CadastrarAgenda />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/avaliacoes"
                    element={
                        <ProtectedRoute>
                            <Avaliacoes />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/cadastrar-avaliacao"
                    element={
                        <ProtectedRoute>
                            <CadastrarAvaliacao />
                        </ProtectedRoute>
                    }
                />

            </Routes>

        </BrowserRouter>

    );

}