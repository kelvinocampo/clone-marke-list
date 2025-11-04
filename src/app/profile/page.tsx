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
        const [products, result] = await useDB(user?.uid || '', productos)

        if (result) {
            setProductos(products as Producto[]);
            console.log(products,productos);
            
            setProductsLocalStorage()
        }

    }

    if (loading) {
        return <Loading />;
    }

    if (!user) {
        return null
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
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 text-black">
                        <div>

                            <p>Informacion de usuario</p>
                            <p>{user?.displayName?.split(" ")[0] || "Invitado"}</p>
                            <p>{user?.email || "Sin sesión"}</p>
                            <Image
                                src={user?.photoURL || defaultAvatar}
                                alt="Avatar"
                                width={40}
                                height={40}
                                className="w-10 h-10 rounded-full border-2 border-indigo-200 object-cover"
                            />
                            <button
                                onClick={handleSynchronizeData}
                            >Sincronizar</button>
                        </div>

                    </div>
                </div>
            </div >
        </>
    );
}