import { useState, useRef } from "react";

export function useDatalist() {
    const [input, setInput] = useState("");
    const [showFilters, setShowFilters] = useState(false);

    // Estados para dropdowns tipo Google
    const [showDropdown, setShowDropdown] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    return { input, setInput, showFilters, setShowFilters, showDropdown, setShowDropdown, inputRef, dropdownRef };
}
