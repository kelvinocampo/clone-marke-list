import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    type DocumentData,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Producto {
    id?: string;
    tienda: string;
    creacion: Date;
    categoria: string;
    nombre: string;
    marca: string;
    unidad: string;
    precio: number;
}

export async function useDB(
    userId: string,
    productData: Producto[] | null = null
): Promise<[DocumentData[] | null, boolean]> {
    try {
        if (!userId) throw new Error("userId no puede estar vacío.");

        const userProductsRef = collection(db, "productos", userId, 'items');

        // Si vienen productos, insertarlos
        if (productData && productData.length > 0) {
            const deleteProducts = await deleteUserProducts(userId)
            if (!deleteProducts) throw new Error("Error al reestablecer la coleccion.");
            const array = Array.isArray(productData)
                ? productData
                : [productData];

            await Promise.all(array.map(async (prod) => addDoc(userProductsRef, prod)));
        }

        // Leer todos los productos del usuario
        const snap = await getDocs(userProductsRef);
        const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

        return [docs, true];

    } catch (e) {
        console.error("Error en Firestore:", e);
        return [null, false];
    }
}

export async function deleteUserProducts(userId: string) {
    try {
        const itemsRef = collection(db, "productos", userId, "items");
        const snapshot = await getDocs(itemsRef);

        if (snapshot.empty) {
            return true;
        }

        // Eliminar todos los docs en paralelo
        const deletions = snapshot.docs.map((docSnap) => deleteDoc(docSnap.ref));
        await Promise.all(deletions);

        return true;

    } catch (e) {
        console.error("Error eliminando productos del usuario:", e);
        return false;
    }
}

