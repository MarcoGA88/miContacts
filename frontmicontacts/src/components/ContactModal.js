import React from 'react';
import { Edit, Trash, Mail, Phone, Briefcase, User } from 'lucide-react'; // Importamos los íconos de Lucide
import { useNavigate } from 'react-router-dom'; // Importar useNavigate para redirigir

// Componente Modal para mostrar los detalles del contacto
function ContactModal({ contact, isOpen, onClose, onEdit, onDelete }) {
  const navigate = useNavigate(); // Obtener la función de navegación

  if (!isOpen) return null;

  // Función para generar el color de fondo del avatar en base al nombre
  const generateAvatarColor = (name) => {
    if (!name) return 'bg-gray-500'; // Devolver un color de fondo por defecto si el nombre es inválido

    const firstLetter = name.trim().charAt(0).toLowerCase(); // Tomamos la primera letra en minúsculas
    const colors = ['bg-red-400', 'bg-blue-400', 'bg-green-400', 'bg-yellow-400', 'bg-purple-400', 'bg-pink-400', 'bg-teal-400', 'bg-indigo-400'];

    const colorIndex = firstLetter.charCodeAt(0) % colors.length; // Aseguramos un índice válido
    return colors[colorIndex];
  };

  // Función para redirigir a la página de edición
  const handleEditClick = () => {
    navigate(`/edit/${contact.id}`); // Redirigir al formulario de edición con el ID del contacto
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full sm:max-w-md mx-4">
        <h3 className="text-2xl font-semibold mb-4 text-center">Detalles del Contacto</h3>

        {/* Mostrar el avatar */}
        <div className="flex justify-center mb-4">
          <div className={`${generateAvatarColor(contact.name)} w-16 h-16 rounded-full flex items-center justify-center text-white`}>
            {contact.name ? contact.name.charAt(0).toUpperCase() : '?'}
          </div>
        </div>

        {/* Información del contacto */}
        <div className="space-y-2 mb-4 text-center">
          <p className="text-gray-700 flex items-center justify-center">
            <User className="mr-2" />
            {contact.name ? contact.name : <span className="text-blue-500 cursor-pointer" onClick={() => handleEditClick()}>Agregar Nombre</span>}
          </p>
          <p className="text-gray-700 flex items-center justify-center">
            <Mail className="mr-2" />
            {contact.email ? contact.email : <span className="text-blue-500 cursor-pointer" onClick={() => handleEditClick()}>Agregar Correo</span>}
          </p>
          <p className="text-gray-700 flex items-center justify-center">
            <Phone className="mr-2" />
            {contact.phone ? contact.phone : <span className="text-blue-500 cursor-pointer" onClick={() => handleEditClick()}>Agregar Teléfono</span>}
          </p>
          <p className="text-gray-700 flex items-center justify-center">
            <Briefcase className="mr-2" />
            {contact.company ? contact.company : <span className="text-blue-500 cursor-pointer" onClick={() => handleEditClick()}>Agregar Empresa/Puesto</span>}
          </p>
        </div>

        {/* Opciones de acción - Botones centrados con ancho fijo */}
        <div className="space-y-4 mt-6 text-center">
          <button
            onClick={handleEditClick} // Redirige a la página de edición cuando se hace clic
            className="flex items-center justify-center bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 transition duration-200 w-60 mx-auto"
          >
            <Edit className="mr-2" /> Editar
          </button>
          <button
            onClick={() => onDelete(contact)}
            className="flex items-center justify-center bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transition duration-200 w-60 mx-auto"
          >
            <Trash className="mr-2" /> Eliminar
          </button>
        </div>

        {/* Botón de cierre */}
        <div className="mt-4 text-center">
          <button
            onClick={onClose}
            className="w-60 p-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition duration-200 mx-auto"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ContactModal;
