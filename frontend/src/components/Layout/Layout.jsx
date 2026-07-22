import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";

export default function Layout({ children }) {

    return (

        <div className="flex min-h-screen bg-gray-100">

            <Sidebar />

            <div className="flex-1">

                <Navbar />

                <main className="p-8">

                    {children}

                </main>

            </div>

        </div>

    );

}