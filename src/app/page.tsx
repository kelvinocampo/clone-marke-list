"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useEffect } from "react";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // 🚦 Redirigir al login solo cuando el usuario sea null y no esté cargando
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // 🔹 Función de logout
  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  // Mientras carga, mostrar un loader básico
  if (loading) {
    return <p className="text-center mt-10">Cargando...</p>;
  }

  // Si no hay usuario (ya redirigiendo), no mostrar nada
  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* 🔹 HEADER */}
      <header className="flex items-center justify-between bg-white shadow px-6 py-4 sticky top-0">
        <div className="flex items-center gap-3">
          <img
            src={user.photoURL || "/default-avatar.png"}
            alt="Avatar"
            className="w-10 h-10 rounded-full border"
          />
          <div>
            <p className="font-semibold text-gray-800">
              {user.displayName || "Usuario"}
            </p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
        >
          Cerrar sesión
        </button>
      </header>

      {/* 🔹 CONTENIDO PRINCIPAL */}
      <main className="flex-1 flex flex-col items-center justify-center text-center p-10">
        <h1 className="text-4xl font-bold mb-6">
          🚀 Bienvenido, {user.displayName?.split(" ")[0] || "Aprendiz"} 👋
        </h1>

        <div className="bg-white rounded-2xl shadow-md p-10 w-full max-w-3xl border">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Aquí empieza tu aplicación
          </h2>
          <p className="text-gray-500">
            Puedes comenzar a desarrollar tus componentes, tablas o dashboard dentro de este contenedor.
          </p>
        </div>
      </main>
    </div>
  );
}
