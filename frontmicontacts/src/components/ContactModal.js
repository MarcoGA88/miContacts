import React from 'react';
import { Edit, Mail, Phone, Briefcase, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


// Componente Modal para mostrar los detalles del contacto
function ContactModal({ contact, isOpen, onClose, onDelete }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const generateAvatarColor = (name) => {
    if (!name) return 'bg-gray-500';
    const firstLetter = name.trim().charAt(0).toLowerCase();
    const colors = [
      'bg-red-400', 'bg-blue-400', 'bg-green-400',
      'bg-yellow-400', 'bg-purple-400', 'bg-pink-400',
      'bg-teal-400', 'bg-indigo-400'
    ];
    const colorIndex = firstLetter.charCodeAt(0) % colors.length;
    return colors[colorIndex];
  };

  const handleEditClick = () => {
    navigate(`/edit/${contact.id}`);
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full sm:max-w-md mx-4">
        <h3 className="text-2xl font-semibold mb-4 text-center">Detalles del Contacto</h3>

        <div className="flex justify-center mb-4">
          <div className={`${generateAvatarColor(contact.name)} w-16 h-16 rounded-full flex items-center justify-center text-white`}>
            {contact.name ? contact.name.charAt(0).toUpperCase() : '?'}
          </div>
        </div>

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

        <div className="space-y-4 mt-6 text-center">
          <button
            onClick={handleEditClick}
            className="flex items-center justify-center bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 transition duration-200 w-60 mx-auto"
          >
            <Edit className="mr-2" /> Editar
          </button>

        </div>

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
