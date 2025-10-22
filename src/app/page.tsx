"use client";

import { useState, useEffect } from "react"; // Necesitamos useState y useEffect
import { useRouter } from "next/navigation"; // Para la navegación
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/header";
import Loading from "@/components/loading";

// Define la interfaz de Producto (asumiendo que es similar a tu otro componente)
interface Producto {
  id: number;
  tienda: string;
  categoria: string;
  nombre: string;
  marca: string;
  unidad: string;
  precio: number;
}

export default function Home() {
  const { loading } = useAuth();
  const router = useRouter();
  const [productCount, setProductCount] = useState(0);

  // 1. Obtener la cantidad de productos del localStorage
  useEffect(() => {
    try {
      // Intenta obtener los productos del localStorage
      const products = JSON.parse(localStorage.getItem("products") || "[]") as Producto[];
      setProductCount(products.length);
    } catch (error) {
      console.error("Error al leer productos de localStorage:", error);
      setProductCount(0);
    }
  }, []);

  // 2. Función para navegar
  const handleGoToProducts = () => {
    router.push("/products");
  };

  if (loading) {
    return (
      <Loading />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* HEADER */}
      <Header />

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col items-center p-4 sm:p-6 lg:p-10 pt-16">

        {/* WIDGET DE CANTIDAD DE PRODUCTOS */}
        <div
          onClick={handleGoToProducts}
          className="cursor-pointer w-full max-w-sm p-6 bg-white rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 border-b-4 border-indigo-500"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold text-gray-500">
                Productos Registrados
              </p>
              <h2 className="text-5xl font-extrabold text-indigo-700 mt-1">
                {productCount}
              </h2>
            </div>
            {/* Ícono de Caja o Listado */}
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 shadow-inner">
              <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10m0 0h16M4 17h16m-6 0v-4m0 0H4m16 0V7m0 0H4m16 0v4m0 0h-4m-4 0h-4m0-4h4" />
              </svg>
            </div>
          </div>
          <div className="mt-4 text-sm text-indigo-500 font-medium flex items-center justify-between">
            Ver el inventario completo
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-lg border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-600">
            © 2025 Clone Marke List.
          </p>
        </div>
      </footer>
    </div>
  );
}