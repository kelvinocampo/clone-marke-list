"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { signInWithPopup, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useEffect } from "react";

export default function LoginPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  // 🚦 Redirigir solo cuando el usuario esté logueado y no esté cargando
  useEffect(() => {
    if (!loading && user) {
      router.push("/"); // o la ruta principal que prefieras
    }
  }, [user, loading, router]);

  // 🔹 Login con Firebase
  const handleLogin = async (providerName: "google" | "github") => {
    const provider =
      providerName === "google"
        ? new GoogleAuthProvider()
        : new GithubAuthProvider();

    try {
      await signInWithPopup(auth, provider);
      router.push("/"); // redirige al home o dashboard
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-80 text-center">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Iniciar Sesión</h1>

        <button
          onClick={() => handleLogin("google")}
          className="w-full mb-4 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-semibold transition-all"
        >
          🔥 Iniciar con Google
        </button>

        {/* <button
          onClick={() => handleLogin("github")}
          className="w-full bg-gray-800 hover:bg-gray-900 text-white py-2 rounded-lg font-semibold transition-all"
        >
          🐱 Iniciar con GitHub
        </button> */}
      </div>
    </div>
  );
}
