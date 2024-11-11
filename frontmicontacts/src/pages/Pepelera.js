import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  getTrashedContacts,
  restoreFromTrash,
  deleteContactPermanently,
} from "../api/contactService";
import { ArrowBack, Trash2, RefreshCcw } from "lucide-react"; // Importamos los iconos

const Papelera = () => {
  const [deletedContacts, setDeletedContacts] = useState([]);

  useEffect(() => {
    const fetchDeletedContacts = async () => {
      try {
        const data = await getTrashedContacts(); // Obtener contactos en la papelera
        setDeletedContacts(data);
      } catch (error) {
        console.error("Error al obtener contactos de la papelera:", error);
      }
    };

    fetchDeletedContacts();
  }, []);

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

  const handleRestoreContact = (contact) => {
    Swal.fire({
      title: "¿Restaurar contacto?",
      text: `Se restaurará a ${contact.name}.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Restaurar",
      cancelButtonText: "Cancelar",
      customClass: {
        title: 'text-lg', // Aumentamos el tamaño del título
        content: 'text-sm', // Hacemos el texto más pequeño
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await restoreFromTrash(contact.id); // Restaurar contacto
          setDeletedContacts(deletedContacts.filter((c) => c.id !== contact.id));

          Swal.fire(
            "Restaurado",
            `${contact.name} ha sido restaurado.`,
            "success"
          );
        } catch (error) {
          Swal.fire(
            "Error",
            "Hubo un problema al restaurar el contacto.",
            "error"
          );
        }
      }
    });
  };

  const handleDeletePermanently = (contact) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: `¡Esta acción eliminará permanentemente a ${contact.name}!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar permanentemente",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
      customClass: {
        title: 'text-lg', // Aumentamos el tamaño del título
        content: 'text-sm', // Hacemos el texto más pequeño
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteContactPermanently(contact.id); // Eliminar contacto permanentemente
          setDeletedContacts(deletedContacts.filter((c) => c.id !== contact.id));

          Swal.fire(
            "Eliminado",
            `${contact.name} ha sido eliminado permanentemente.`,
            "success"
          );
        } catch (error) {
          Swal.fire(
            "Error",
            "Hubo un problema al eliminar el contacto permanentemente.",
            "error"
          );
        }
      }
    });
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Papelera</h2>

      {deletedContacts.length === 0 ? (
        <div className="text-center text-gray-500">
          No hay contactos en la papelera
        </div>
      ) : (
        <table className="table-auto w-full text-sm text-gray-700">
          <thead>
            <tr className="text-left border-b border-gray-300">
              <th className="px-4 py-2">Avatar</th> {/* Nueva columna para el avatar */}
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Correo</th>
              <th className="px-4 py-2">Teléfono</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {deletedContacts.map((contact) => (
              <tr key={contact.id}>
                <td className="px-4 py-2 flex items-center gap-2">
                  <div className={`${generateAvatarColor(contact.name)} w-8 h-8 rounded-full flex items-center justify-center text-white`}>
                    {contact.name ? contact.name.charAt(0).toUpperCase() : '?'}
                  </div>
                </td>
                <td className="px-4 py-2">{contact.name}</td>
                <td className="px-4 py-2">{contact.email}</td>
                <td className="px-4 py-2">{contact.phone}</td>
                <td className="px-4 py-2 flex space-x-2">
                  <button
                    onClick={() => handleRestoreContact(contact)}
                    className="p-2 rounded bg-blue-400 text-white hover:bg-blue-500"
                  >
                    <RefreshCcw className="w-5 h-5" /> {/* Icono de restaurar */}
                  </button>
                  <button
                    onClick={() => handleDeletePermanently(contact)}
                    className="p-2 rounded bg-red-400 text-white hover:bg-red-500"
                  >
                    <Trash2 className="w-5 h-5" /> {/* Icono de eliminar permanentemente */}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Papelera;
