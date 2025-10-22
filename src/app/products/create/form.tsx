"use client";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "@/components/header";
import { twMerge } from 'tailwind-merge'

interface Producto {
    id?: number;
    tienda: string;
    categoria: string;
    nombre: string;
    marca: string;
    unidad: string;
    precio: number;
}

interface CreateProductProps {
    onProductCreated?: (producto: Producto & { id: number }) => void;
}

const classNames = {
    input: 'text-black w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all',
    select: 'appearance-none bg-white text-gray-500',
    option: ''
}

export default function CreateProduct({ onProductCreated }: CreateProductProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const productUpdating = searchParams.get("product");

    const [form, setForm] = useState({
        tienda: "",
        categoria: "",
        nombre: "",
        marca: "",
        unidad: "",
        precio: "",
    });

    useState(() => {
        if (productUpdating) {
            const productosGuardados = JSON.parse(localStorage.getItem("products") || "[]");
            const productoAEditar = productosGuardados.find((p: Producto) => p.id === Number(productUpdating));
            if (productoAEditar) {
                setForm({
                    tienda: productoAEditar.tienda,
                    categoria: productoAEditar.categoria,
                    nombre: productoAEditar.nombre,
                    marca: productoAEditar.marca,
                    unidad: productoAEditar.unidad,
                    precio: productoAEditar.precio.toString(),
                });
            }
        }
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };


    const handleAction = (e: React.FormEvent) => {
        e.preventDefault();

        if (productUpdating) {
            handleUpdate();
        } else {
            handleCreate();
        }
    };

    const handleUpdate = () => {
        const productosGuardados = JSON.parse(localStorage.getItem("products") || "[]");
        const productosActualizados = productosGuardados.map((p: Producto) => {
            if (p.id === Number(productUpdating)) {
                return {
                    ...p,
                    tienda: form.tienda,
                    categoria: form.categoria,
                    nombre: form.nombre,
                    marca: form.marca,
                    unidad: form.unidad,
                    precio: Number(form.precio),
                };
            }
            return p;
        });
        localStorage.setItem("products", JSON.stringify(productosActualizados));
        router.push("/products");
    }

    const handleCreate = () => {
        const nuevoProducto = {
            id: Date.now(),
            tienda: form.tienda,
            categoria: form.categoria,
            nombre: form.nombre,
            marca: form.marca,
            unidad: form.unidad,
            precio: Number(form.precio),
        };

        // Guardar en localStorage
        const productosGuardados = JSON.parse(localStorage.getItem("products") || "[]");
        const productosActualizados = [...productosGuardados, nuevoProducto];
        localStorage.setItem("products", JSON.stringify(productosActualizados));

        // Callback opcional
        if (onProductCreated) {
            onProductCreated(nuevoProducto);
        }

        // Limpiar formulario
        setForm({
            tienda: "",
            categoria: "",
            nombre: "",
            marca: "",
            unidad: "",
            precio: "",
        });

        // Redirigir
        router.push("/products");
    };

    const handleCancel = () => {
        router.push("/products");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col">
            <Header />

            <div className="flex-1 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
                    {/* Header del formulario */}
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                {productUpdating ?
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg> :
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                }
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">{productUpdating ? 'Editar' : 'Crear'} Producto</h2>
                                <p className="text-indigo-100 text-sm">{productUpdating ? 'Edita la infomacion de tu producto' : 'Completa la información del nuevo producto'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Formulario */}
                    <form onSubmit={handleAction} className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Tienda */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">
                                    Tienda
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        name="tienda"
                                        placeholder="Ej: Tienda dona concha"
                                        value={form.tienda}
                                        onChange={handleChange}
                                        required
                                        className={classNames.input}
                                    />
                                </div>
                            </div>

                            {/* Categoría */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">
                                    Categoría
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        name="categoria"
                                        placeholder="Ej: Tubérculos"
                                        value={form.categoria}
                                        onChange={handleChange}
                                        className={classNames.input}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Nombre Producto */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">
                                    Nombre del Producto
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        name="nombre"
                                        placeholder="Ej: Papa pastusa"
                                        value={form.nombre}
                                        onChange={handleChange}
                                        className={classNames.input}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Marca */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">
                                    Marca
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        name="marca"
                                        placeholder="Ej: Mister Potato"
                                        value={form.marca}
                                        onChange={handleChange}
                                        className={classNames.input}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Unidad de medida */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">
                                    Unidad de Medida
                                </label>
                                <div className="relative">
                                    {/* Ícono a la izquierda */}
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg
                                            className="w-5 h-5 text-gray-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                                            />
                                        </svg>
                                    </div>

                                    <select
                                        name="unidad"
                                        value={form.unidad}
                                        onChange={handleChange}
                                        required
                                        className={twMerge(classNames.input, classNames.select)}
                                    >
                                        <option disabled value="">
                                            Selecciona una unidad
                                        </option>
                                        <option value="kg">Kilogramo (kg)</option>
                                        <option value="lb">Libra (lb)</option>
                                        <option value="unidad">Unidad</option>
                                    </select>

                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <svg
                                            className="w-5 h-5 text-gray-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 9l-7 7-7-7"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Precio */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">
                                    Precio
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-gray-500 font-semibold">$</span>
                                    </div>
                                    <input
                                        type="number"
                                        name="precio"
                                        placeholder="1000"
                                        value={form.precio}
                                        onChange={handleChange}
                                        required
                                        min="0"
                                        max="1000000000"
                                        className={classNames.input}
                                        step="0.01"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Botones */}
                        <div className="flex gap-4 mt-8">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="cursor-pointer flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="cursor-pointer flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
                            >
                                {productUpdating ? 'Editar' : 'Crear'} Producto
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}