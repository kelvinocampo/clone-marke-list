"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "@/components/header";
import CreateProduct from "./form";
import Loading from "@/components/loading";
import ConfirmModal from "@/components/confirm";

interface Producto {
    id: number;
    tienda: string;
    categoria: string;
    nombre: string;
    marca: string;
    unidad: string;
    precio: number;
}

export default function ProductsPage() {
    const { loading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const method = searchParams.get("method");

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [productSelected, setProductSelected] = useState<number>(0);
    const [productos, setProductos] = useState<Producto[]>([]);

    // Inicializar productos del local storage
    useEffect(() => {
        const productosGuardados = JSON.parse(localStorage.getItem("products") || "[]");
        setProductos(productosGuardados);
    }, []);

    // Actualizar LocalStorage cuando cambian los productos
    useEffect(() => {
        if (productos.length > 0) {
            localStorage.setItem('products', JSON.stringify(productos));
        }
    }, [productos]);

    // Eliminar producto
    const deleteProduct = () => {
        const productosActualizados = productos.filter((p) => p.id !== productSelected);
        setProductos(productosActualizados);
        localStorage.setItem('products', JSON.stringify(productosActualizados));
        setShowDeleteModal(false);
    };

    const handleDelete = (id: number) => {
        const productosActualizados = productos.filter((p) => p.id !== id);
        setProductSelected(id);
        setShowDeleteModal(true);
        localStorage.setItem('products', JSON.stringify(productosActualizados));
    };

    // Redirigir a formulario
    const goToCreate = () => {
        router.push("?method=create");
    };

    const handleEdit = (id: number) => {
        router.push("?method=update&product=" + id);
    };

    // Callback cuando se crea un producto
    const handleProductCreated = (nuevoProducto: Producto) => {
        setProductos([...productos, nuevoProducto]);
    };

    if (loading) {
        return (
            <Loading />
        );
    }

    // Vista del formulario
    if (method === "create") {
        return <CreateProduct onProductCreated={handleProductCreated} />;
    }

    if (method === "update") {
        return <CreateProduct onProductCreated={handleProductCreated} />;
    }

    // Vista de productos
    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
                <Header />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                Gestión de Productos
                            </h1>
                            <p className="text-gray-600 mt-1">
                                {productos.length} {productos.length === 1 ? "producto registrado" : "productos registrados"}
                            </p>
                        </div>
                        <button
                            onClick={goToCreate}
                            className="cursor-pointer flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Crear Producto
                        </button>
                    </div>

                    {/* Lista de productos */}
                    {productos.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                            <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">No hay productos registrados</h3>
                            <p className="text-gray-500 mb-6">Comienza creando tu primer producto</p>
                            <button
                                onClick={goToCreate}
                                className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Crear Primer Producto
                            </button>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {productos.map((p) => (
                                <div
                                    key={p.id}
                                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-200 overflow-hidden"
                                >
                                    <div className="p-6">
                                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                            {/* Info del producto */}
                                            <div className="flex-1">
                                                <div className="flex items-start gap-4">
                                                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                                        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                        </svg>
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="text-lg font-bold text-gray-800">{p.nombre}</h3>
                                                        <p className="text-sm text-gray-500 mt-1">Marca: {p.marca}</p>
                                                        <div className="flex flex-wrap gap-2 mt-3">
                                                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold">
                                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                                </svg>
                                                                {p.tienda}
                                                            </span>
                                                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-semibold">
                                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                                                </svg>
                                                                {p.categoria}
                                                            </span>
                                                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-semibold">
                                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                                                                </svg>
                                                                {p.unidad}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Precio y acciones */}
                                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                                <div className="text-right">
                                                    <p className="text-sm text-gray-500">Precio</p>
                                                    <p className="text-2xl font-bold text-indigo-600">
                                                        ${p.precio.toLocaleString()}
                                                    </p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleEdit(p.id)}
                                                        className="cursor-pointer p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(p.id)}
                                                        className="cursor-pointer p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            {showDeleteModal && (
                <ConfirmModal title="Eliminar Producto"
                    description="Estas seguro de que deseas eliminar este producto? Esta acción no se puede deshacer."
                    success="Eliminar Producto" success_function={deleteProduct}
                    cancel="Cancelar" cancel_function={() => setShowDeleteModal(false)}
                />
            )}
        </>
    );
}