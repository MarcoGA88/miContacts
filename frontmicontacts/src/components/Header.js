import React, { useState } from 'react';

function Header({ onSearch }) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    onSearch(event.target.value); // Llama a la función onSearch con el valor del campo
  };

  return (
    <header className="bg-slate-100 text-black p-4 flex justify-between items-center">
      {/* Barra de búsqueda */}
      <input
        type="text"
        className="mt-2 p-2 rounded-2xl w-full max-w-lg border border-slate-300 ml-80 "
        placeholder="Buscar contacto..."
        value={searchQuery}
        onChange={handleSearchChange}
      />

      {/* Título alineado a la derecha */}
      <h1 className="text-xl mr-5 ml-10">miContacts</h1>
    </header>
  );
}

export default Header;

