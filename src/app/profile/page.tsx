"use client";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/header";
import Loading from "@/components/loading";
import Image from "next/image";
import { useDB } from "@/hooks/useDB";
import { useState, useEffect } from "react";

interface Producto {
    id: string;
    tienda: string;
    creacion: Date;
    categoria: string;
    nombre: string;
    marca: string;
    unidad: string;
    precio: number;
}

export default function ProfilePage() {
    const { loading, user } = useAuth();
    const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/9131/9131529.png";

    const [productos, setProductos] = useState<Producto[]>([]);
    const [isSynchronizing, setIsSynchronizing] = useState(false);

    const getProductsLocalStorage = () => {
        const productosGuardados = JSON.parse(localStorage.getItem("products") || "[]");
        setProductos(productosGuardados);
    }

    const setProductsLocalStorage = () => {
        localStorage.setItem('products', JSON.stringify(productos));
    }

    // Inicializar productos del local storage
    useEffect(() => {
        getProductsLocalStorage()
    }, []);

    const handleSynchronizeData = async () => {
        setIsSynchronizing(true);
        try {
            const [products, result] = await useDB(user?.uid || '', productos);

            if (result) {
                setProductos(products as Producto[]);
                console.log(products, productos);
                setProductsLocalStorage();
            }
        } catch (error) {
            console.error("Error al sincronizar:", error);
        } finally {
            setIsSynchronizing(false);
        }
    }

    if (loading) {
        return <Loading />;
    }

    if (!user) {
        return null;
    }

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
                <Header />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                Mi Perfil
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Administra tu información personal
                            </p>
                        </div>
                    </div>

                    {/* Tarjeta de información del usuario */}
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
                        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 h-32"></div>
                        
                        <div className="px-6 pb-6">
                            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-16">
                                {/* Avatar */}
                                <div className="relative">
                                    <div className="w-32 h-32 rounded-2xl border-4 border-white shadow-xl overflow-hidden bg-white">
                                        <Image
                                            src={user?.photoURL || defaultAvatar}
                                            alt="Avatar"
                                            width={128}
                                            height={128}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white"></div>
                                </div>

                                {/* Información del usuario */}
                                <div className="flex-1 text-center sm:text-left sm:mb-4">
                                    <h2 className="text-4xl font-bold text-gray-800">
                                        {user?.displayName?.split(" ")[0] || "Invitado"}
                                    </h2>
                                    <p className="text-gray-600 flex items-center justify-center sm:justify-start gap-2 mt-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        {user?.email || "Sin sesión"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Estadísticas */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center">
                                    <svg className="w-7 h-7 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Total Productos</p>
                                    <p className="text-2xl font-bold text-gray-800">{productos.length}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sincronización */}
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">Sincronización de Datos</h2>
                                <p className="text-sm text-gray-600">Mantén tus datos actualizados en la nube</p>
                            </div>
                        </div>

                        <button
                            onClick={handleSynchronizeData}
                            disabled={isSynchronizing}
                            className={`cursor-pointer w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold transition-all duration-200 ${
                                isSynchronizing
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-lg hover:-translate-y-0.5'
                            }`}
                        >
                            {isSynchronizing ? (
                                <>
                                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Sincronizando...
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Sincronizar Datos
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}