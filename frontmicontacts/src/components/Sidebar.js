import React from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, Phone, Star, Trash, Cog, CircleUser } from 'lucide-react';

function Sidebar() {
  return (
    <aside className="w-64 bg-slate-100 text-black p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-2 font-bold text-xl">
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
          <CircleUser className="text-white text-xl" />
        </div>
        <span>Contactos</span>
      </div>

      {/* Main Navigation */}
      <nav className="space-y-4">
        <Link
          to="/create"
          className="flex items-center py-3 px-4 rounded-2xl hover:bg-blue-200 transition-colors"
        >
          <UserPlus className="mr-3" />
          Crear Contacto
        </Link>
        <Link
          to="/"
          className="flex items-center py-3 px-4 rounded-2xl hover:bg-blue-200 transition-colors"
        >
          <Phone className="mr-3" />
          Contactos
        </Link>

        <Link
          to="/favorites"
          className="flex items-center py-3 px-4 rounded-2xl hover:bg-blue-200 transition-colors"
        >
          <Star className="mr-3" />
          Favoritos
        </Link>
      </nav>

      {/* Settings Section */}
      <div className="space-y-2 text-black">
        <div className="flex items-center space-x-2 font-bold">
          <Cog className="mr-2" />
          <span>Corregir y gestionar</span>
        </div>
        <nav>
          <Link
            to="/trash"
            className="flex items-center py-3 px-4 rounded-2xl hover:bg-blue-200 transition-colors"
          >
            <Trash className="mr-3" />
            Papelera
          </Link>
        </nav>
      </div>
    </aside>
  );
}

export default Sidebar;
