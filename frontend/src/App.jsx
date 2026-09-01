import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";

import Treinos from "./pages/Treinos/Treinos";
import CadastrarTreino from "./pages/CadastrarTreino/CadastrarTreino";
import EditarTreino from "./pages/EditarTreino/EditarTreino";

import Alunos from "./pages/Alunos/Alunos";
import CadastrarAluno from "./pages/CadastrarAluno/CadastrarAluno";
import EditarAluno from "./pages/EditarAluno/EditarAluno";

import Exercicios from "./pages/Exercicios/Exercicios";
import CadastrarExercicio from "./pages/CadastrarExercicio/CadastrarExercicio";
import EditarExercicio from "./pages/EditarExercicio/EditarExercicio";

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

                {/* ROTAS PÚBLICAS */}

                <Route
                    path="/"
                    element={<Login />}
                />

                <Route
                    path="/cadastrar-usuario"
                    element={<CadastrarUsuario />}
                />


                {/* DASHBOARD */}

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />


                {/* ALUNOS */}

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
                    path="/editar-aluno/:id"
                    element={
                        <ProtectedRoute>
                            <EditarAluno />
                        </ProtectedRoute>
                    }
                />


                {/* TREINOS */}

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
                    path="/editar-treino/:id"
                    element={
                        <ProtectedRoute>
                            <EditarTreino />
                        </ProtectedRoute>
                    }
                />


                {/* EXERCÍCIOS */}

                <Route
                    path="/exercicios"
                    element={
                        <ProtectedRoute>
                            <Exercicios />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/cadastrar-exercicio"
                    element={
                        <ProtectedRoute>
                            <CadastrarExercicio />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/editar-exercicio/:id"
                    element={
                        <ProtectedRoute>
                            <EditarExercicio />
                        </ProtectedRoute>
                    }
                />


                {/* AGENDA */}

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


                {/* AVALIAÇÕES */}

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