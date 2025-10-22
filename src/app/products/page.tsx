"use client";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "@/components/header";
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

    // Estados para filtros
    const [searchText, setSearchText] = useState("");
    const [selectedMarcas, setSelectedMarcas] = useState<string[]>([]);
    const [selectedTiendas, setSelectedTiendas] = useState<string[]>([]);
    const [marcaInput, setMarcaInput] = useState("");
    const [tiendaInput, setTiendaInput] = useState("");
    const [showFilters, setShowFilters] = useState(false);


    // Estados para dropdowns tipo Google
    const [showMarcaDropdown, setShowMarcaDropdown] = useState(false);
    const [showTiendaDropdown, setShowTiendaDropdown] = useState(false);
    const marcaInputRef = useRef<HTMLInputElement>(null);
    const tiendaInputRef = useRef<HTMLInputElement>(null);
    const marcaDropdownRef = useRef<HTMLDivElement>(null);
    const tiendaDropdownRef = useRef<HTMLDivElement>(null);

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

    // Cerrar dropdowns al hacer click fuera
    useEffect(() => {


        const handleClickOutside = (event: MouseEvent) => {
            if (marcaDropdownRef.current && !marcaDropdownRef.current.contains(event.target as Node) &&
                !marcaInputRef.current?.contains(event.target as Node)) {
                setShowMarcaDropdown(false);
            }
            if (tiendaDropdownRef.current && !tiendaDropdownRef.current.contains(event.target as Node) &&
                !tiendaInputRef.current?.contains(event.target as Node)) {
                setShowTiendaDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Obtener marcas únicas
    const marcasUnicas = Array.from(new Set(productos.map(p => p.marca))).sort();

    // Obtener tiendas únicas
    const tiendasUnicas = Array.from(new Set(productos.map(p => p.tienda))).sort();

    // Filtrar marcas según el input
    const marcasFiltradas = marcasUnicas.filter(marca =>
        marca.toLowerCase().includes(marcaInput.toLowerCase()) &&
        !selectedMarcas.includes(marca)
    );

    // Filtrar tiendas según el input
    const tiendasFiltradas = tiendasUnicas.filter(tienda =>
        tienda.toLowerCase().includes(tiendaInput.toLowerCase()) &&
        !selectedTiendas.includes(tienda)
    );

    // Filtrar productos
    const productosFiltrados = productos.filter(p => {
        const matchText = searchText === "" ||
            p.nombre.toLowerCase().includes(searchText.toLowerCase());

        const matchMarca = selectedMarcas.length === 0 ||
            selectedMarcas.includes(p.marca);

        const matchTienda = selectedTiendas.length === 0 ||
            selectedTiendas.includes(p.tienda);

        return matchText && matchMarca && matchTienda;
    });

    // Agregar marca al filtro
    const agregarMarca = (marca: string) => {
        if (marca && !selectedMarcas.includes(marca)) {
            setSelectedMarcas([...selectedMarcas, marca]);
            setMarcaInput("");
            setShowMarcaDropdown(false);
        }
    };

    // Agregar tienda al filtro
    const agregarTienda = (tienda: string) => {
        if (tienda && !selectedTiendas.includes(tienda)) {
            setSelectedTiendas([...selectedTiendas, tienda]);
            setTiendaInput("");
            setShowTiendaDropdown(false);
        }
    };

    // Eliminar marca del filtro
    const eliminarMarca = (marca: string) => {
        setSelectedMarcas(selectedMarcas.filter(m => m !== marca));
    };

    // Eliminar tienda del filtro
    const eliminarTienda = (tienda: string) => {
        setSelectedTiendas(selectedTiendas.filter(t => t !== tienda));
    };

    // Limpiar todos los filtros
    const limpiarFiltros = () => {
        setSearchText("");
        setSelectedMarcas([]);
        setSelectedTiendas([]);
        setMarcaInput("");
        setTiendaInput("");
    };

    // Eliminar producto
    const deleteProduct = () => {
        const productosActualizados = productos.filter((p) => p.id !== productSelected);
        setProductos(productosActualizados);
        localStorage.setItem('products', JSON.stringify(productosActualizados));
        setShowDeleteModal(false);
    };

    const handleDelete = (id: number) => {
        setProductSelected(id);
        setShowDeleteModal(true);
    };

    // Redirigir a formulario
    const goToCreate = () => {
        router.push("/products/create");
    };

    const handleEdit = (id: number) => {
        router.push("/products/update?product=" + id);
    };

    // Callback cuando se crea un producto
    const handleProductCreated = (nuevoProducto: Producto) => {
        setProductos([...productos, nuevoProducto]);
    };

    if (loading) {
        return <Loading />;
    }

    const hayFiltrosActivos = searchText !== "" || selectedMarcas.length > 0 || selectedTiendas.length > 0;

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
                                {productosFiltrados.length} de {productos.length} {productos.length === 1 ? "producto" : "productos"}
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

                    {/* Filtros Colapsables */}
                    <div className="bg-white rounded-2xl shadow-lg mb-6">
                        {/* Header del filtro - siempre visible */}
                        <div
                            onClick={() => setShowFilters(!showFilters)}
                            className="cursor-pointer flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-800">Filtros de Búsqueda</h2>
                                    <p className="text-xs text-gray-500">
                                        {hayFiltrosActivos ? `${(searchText ? 1 : 0) + selectedMarcas.length + selectedTiendas.length} filtro(s) activo(s)` : 'Click para filtrar productos'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                {hayFiltrosActivos && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            limpiarFiltros();
                                        }}
                                        className="cursor-pointer text-sm text-red-600 hover:text-red-700 font-semibold px-3 py-1.5 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        Limpiar
                                    </button>
                                )}
                                <svg
                                    className={`w-6 h-6 text-gray-400 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>

                        {/* Contenido del filtro - colapsable */}
                        {showFilters && (
                            <div className="border-t border-gray-100 p-6 pt-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* Búsqueda por texto */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Buscar por nombre
                                        </label>
                                        <div className="relative">
                                            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                            <input
                                                type="text"
                                                value={searchText}
                                                onChange={(e) => setSearchText(e.target.value)}
                                                placeholder="Nombre del producto..."
                                                className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                                            />
                                        </div>
                                    </div>

                                    {/* Filtro por Marca */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Filtrar por marca
                                        </label>
                                        <div className="relative">
                                            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                            </svg>
                                            <input
                                                ref={marcaInputRef}
                                                type="text"
                                                value={marcaInput}
                                                onChange={(e) => setMarcaInput(e.target.value)}
                                                onFocus={() => setShowMarcaDropdown(true)}
                                                placeholder="Escribe una marca..."
                                                className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                                            />
                                            {showMarcaDropdown && marcasFiltradas.length > 0 && (
                                                <div
                                                    ref={marcaDropdownRef}
                                                    className="absolute z-20 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto"
                                                >
                                                    {marcasFiltradas.map((marca) => (
                                                        <div
                                                            key={marca}
                                                            onClick={() => agregarMarca(marca)}
                                                            className="cursor-pointer px-4 py-2.5 hover:bg-indigo-50 transition-colors flex items-center gap-2 border-b border-gray-100 last:border-b-0"
                                                        >
                                                            <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                                            </svg>
                                                            <span className="text-gray-700">{marca}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        {selectedMarcas.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {selectedMarcas.map(marca => (
                                                    <span
                                                        key={marca}
                                                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold"
                                                    >
                                                        {marca}
                                                        <button
                                                            onClick={() => eliminarMarca(marca)}
                                                            className="cursor-pointer hover:bg-indigo-200 rounded-full p-0.5 transition-colors"
                                                        >
                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Filtro por Tienda */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Filtrar por tienda
                                        </label>
                                        <div className="relative">
                                            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                            </svg>
                                            <input
                                                ref={tiendaInputRef}
                                                type="text"
                                                value={tiendaInput}
                                                onChange={(e) => setTiendaInput(e.target.value)}
                                                onFocus={() => setShowTiendaDropdown(true)}
                                                placeholder="Escribe una tienda..."
                                                className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                                            />
                                            {showTiendaDropdown && tiendasFiltradas.length > 0 && (
                                                <div
                                                    ref={tiendaDropdownRef}
                                                    className="absolute z-20 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto"
                                                >
                                                    {tiendasFiltradas.map((tienda) => (
                                                        <div
                                                            key={tienda}
                                                            onClick={() => agregarTienda(tienda)}
                                                            className="cursor-pointer px-4 py-2.5 hover:bg-purple-50 transition-colors flex items-center gap-2 border-b border-gray-100 last:border-b-0"
                                                        >
                                                            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                            </svg>
                                                            <span className="text-gray-700">{tienda}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        {selectedTiendas.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {selectedTiendas.map(tienda => (
                                                    <span
                                                        key={tienda}
                                                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-semibold"
                                                    >
                                                        {tienda}
                                                        <button
                                                            onClick={() => eliminarTienda(tienda)}
                                                            className="cursor-pointer hover:bg-purple-200 rounded-full p-0.5 transition-colors"
                                                        >
                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Lista de productos */}
                    {productosFiltrados.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                            <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                            {hayFiltrosActivos ? (
                                <>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">No se encontraron productos</h3>
                                    <p className="text-gray-500 mb-6">Intenta ajustar los filtros de búsqueda</p>
                                    <button
                                        onClick={limpiarFiltros}
                                        className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
                                    >
                                        Limpiar filtros
                                    </button>
                                </>
                            ) : (
                                <>
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
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-4">
                            {productosFiltrados.map((p) => (
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

                                                    <div className="flex-1 min-w-0 flex flex-col justify-end h-12">
                                                        <h3
                                                            title="Titulo"
                                                            className="capitalize font-bold text-gray-800 truncate leading-normal text-2xl"
                                                        >
                                                            {p.nombre}
                                                        </h3>
                                                    </div>
                                                </div>
                                                <div className="flex flex-wrap gap-2 mt-3">
                                                    <span title="Marca" className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold">
                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            {/* Icono de Tarjeta de Identificación / Registro */}
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                                        </svg>
                                                        {p.marca}
                                                    </span>
                                                    <span title="Tienda" className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold">
                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                        </svg>
                                                        {p.tienda}
                                                    </span>
                                                    <span title="Categoria" className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-semibold">
                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                                        </svg>
                                                        {p.categoria}
                                                    </span>
                                                    <span title="Unidad" className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-semibold">
                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                                                        </svg>
                                                        {p.unidad}
                                                    </span>
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
                                                <div className="flex gap-2 flex-col">
                                                    <button
                                                        title="Editar"
                                                        onClick={() => handleEdit(p.id)}
                                                        className="cursor-pointer p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        title="Eliminar"
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