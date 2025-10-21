"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import ConfirmModal from "./confirm";

export default function Header() {
  const { user } = useAuth();
  const router = useRouter();
  const [openProfile, setOpenProfile] = useState(false);
  const [openProducts, setOpenProducts] = useState(false);
  const [openSales, setOpenSales] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  const profileRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);
  const salesRef = useRef<HTMLDivElement>(null);

  const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/9131/9131529.png";

  const handleLogout = async () => {
    setOpenProfile(false);
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    setShowLogoutModal(false);
    await signOut(auth);
    router.push("/login");
  };

  const handleMenuAction = (action: string, type: 'products' | 'sales') => {
    if (type === 'products') setOpenProducts(false);
    if (type === 'sales') setOpenSales(false);

    switch (action) {
      case "productos":
        router.push("/products");
        break;
      case "crear-producto":
        router.push("/products?method=create");
        break;
      case "comparar-productos":
        router.push("/products/compare");
        break;
      case "resumen-meses":
        router.push("/products/summary");
        break;
      case "ventas":
        router.push("/sales");
        break;
      case "nueva-venta":
        router.push("/sales?method=create");
        break;
      case "historial-ventas":
        router.push("/sales/history");
        break;
      case "reportes":
        router.push("/sales/reports");
        break;
      default:
        console.log(`Acción seleccionada: ${action}`);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setOpenProfile(false);
      }
      if (productsRef.current && !productsRef.current.contains(e.target as Node)) {
        setOpenProducts(false);
      }
      if (salesRef.current && !salesRef.current.contains(e.target as Node)) {
        setOpenSales(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Clone Marke List
              </h1>
            </button>

            {/* Navigation Menu */}
            <div className="flex items-center gap-2">
              {/* Products Menu */}
              <div className="relative" ref={productsRef}>
                <button
                  onClick={() => {
                    setOpenProducts(!openProducts);
                    setOpenSales(false);
                    setOpenProfile(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-indigo-50 rounded-lg transition-all duration-200 font-medium"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <span>Productos</span>
                  <svg className={`w-4 h-4 transition-transform ${openProducts ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {openProducts && (
                  <div className="absolute left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 animate-fade-in overflow-hidden">
                    <div className="py-2">
                      <button
                        onClick={() => handleMenuAction("productos", 'products')}
                        className="w-full text-left px-4 py-2.5 text-gray-700 hover:bg-indigo-50 transition-colors flex items-center gap-3"
                      >
                        <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                        </div>
                        <span className="font-medium">Ver Productos</span>
                      </button>

                      <button
                        onClick={() => handleMenuAction("crear-producto", 'products')}
                        className="w-full text-left px-4 py-2.5 text-gray-700 hover:bg-indigo-50 transition-colors flex items-center gap-3"
                      >
                        <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </div>
                        <span className="font-medium">Crear Producto</span>
                      </button>

                      <button
                        onClick={() => handleMenuAction("resumen-meses", 'products')}
                        className="w-full text-left px-4 py-2.5 text-gray-700 hover:bg-indigo-50 transition-colors flex items-center gap-3"
                      >
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <span className="font-medium">Resumen Meses</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Sales Menu */}
              <div className="relative" ref={salesRef}>
                <button
                  onClick={() => {
                    setOpenSales(!openSales);
                    setOpenProducts(false);
                    setOpenProfile(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-emerald-50 rounded-lg transition-all duration-200 font-medium"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Ventas</span>
                  <svg className={`w-4 h-4 transition-transform ${openSales ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {openSales && (
                  <div className="absolute left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 animate-fade-in overflow-hidden">
                    <div className="py-2">
                      <button
                        onClick={() => handleMenuAction("ventas", 'sales')}
                        className="w-full text-left px-4 py-2.5 text-gray-700 hover:bg-emerald-50 transition-colors flex items-center gap-3"
                      >
                        <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                        <span className="font-medium">Ver Ventas</span>
                      </button>

                      <button
                        onClick={() => handleMenuAction("nueva-venta", 'sales')}
                        className="w-full text-left px-4 py-2.5 text-gray-700 hover:bg-emerald-50 transition-colors flex items-center gap-3"
                      >
                        <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </div>
                        <span className="font-medium">Nueva Venta</span>
                      </button>

                      <button
                        onClick={() => handleMenuAction("historial-ventas", 'sales')}
                        className="w-full text-left px-4 py-2.5 text-gray-700 hover:bg-emerald-50 transition-colors flex items-center gap-3"
                      >
                        <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <span className="font-medium">Historial</span>
                      </button>

                      <button
                        onClick={() => handleMenuAction("reportes", 'sales')}
                        className="w-full text-left px-4 py-2.5 text-gray-700 hover:bg-emerald-50 transition-colors flex items-center gap-3"
                      >
                        <div className="w-8 h-8 bg-lime-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <span className="font-medium">Reportes</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* User Profile Menu */}
              <div className="relative ml-2" ref={profileRef}>
                <button
                  onClick={() => {
                    setOpenProfile(!openProfile);
                    setOpenProducts(false);
                    setOpenSales(false);
                  }}
                  className="flex items-center gap-3 hover:bg-gray-100 rounded-xl px-3 py-2 transition-all duration-200"
                >
                  <div className="hidden sm:flex flex-col items-end">
                    <span className="text-sm font-semibold text-gray-800">
                      {user?.displayName?.split(" ")[0] || "Invitado"}
                    </span>
                    <span className="text-xs text-gray-500">
                      {user?.email || "Sin sesión"}
                    </span>
                  </div>
                  <div className="relative">
                    <Image
                      src={user?.photoURL || defaultAvatar}
                      alt="Avatar"
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full border-2 border-indigo-200 object-cover"
                    />
                    {user && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                </button>

                {openProfile && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 animate-fade-in overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="font-semibold text-gray-800">{user?.displayName || "Invitado"}</p>
                      <p className="text-sm text-gray-500 mt-0.5">{user?.email || "Sin sesión iniciada"}</p>
                    </div>

                    {!user ? (
                      <div className="p-4">
                        <button
                          onClick={() => router.push("/login")}
                          className="cursor-pointer w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg font-semibold transition"
                        >
                          Iniciar sesión
                        </button>
                      </div>
                    ) : (
                      <div className="py-2">
                        <button
                          onClick={() => router.push("/profile")}
                          className="w-full text-left px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3"
                        >
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <span className="font-medium">Mi Perfil</span>
                        </button>

                        <button
                          onClick={() => router.push("/settings")}
                          className="w-full text-left px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3"
                        >
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </div>
                          <span className="font-medium">Configuración</span>
                        </button>

                        <div className="border-t border-gray-100 mt-2">
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3"
                          >
                            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                              </svg>
                            </div>
                            <span className="font-medium">Cerrar sesión</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <ConfirmModal
          title="Cerrar sesión"
          description="Si cierras sesión, tendrás que volver a iniciar sesión para acceder a tu cuenta."
          success="Cerrar sesión"
          success_function={confirmLogout}
          cancel="Cancelar"
          cancel_function={() => setShowLogoutModal(false)}
        />
      )}
    </>
  );
}