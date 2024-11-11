import React from 'react';
import { Mail, Phone, User } from 'lucide-react'; // Importamos los iconos de Lucide

function ContactCard({ contact }) {
  return (
    <div className="w-full sm:w-80 md:w-96 lg:w-1/4 xl:w-1/5 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out p-6 mb-4">
      <div className="flex items-center space-x-4 mb-4">
        <User className="w-12 h-12 text-blue-500" /> {/* Icono de usuario */}
        <h3 className="text-xl font-semibold text-gray-800">{contact.name}</h3>
      </div>
      <div className="space-y-2">
        <div className="flex items-center text-gray-600">
          <Mail className="w-5 h-5 mr-2 text-gray-500" /> {/* Icono de correo */}
          <span className="truncate">{contact.email}</span> {/* Asegura que el texto no se desborde */}
        </div>
        <div className="flex items-center text-gray-600">
          <Phone className="w-5 h-5 mr-2 text-gray-500" /> {/* Icono de teléfono */}
          <span>{contact.phone}</span>
        </div>
      </div>
    </div>
  );
}

export default ContactCard;

