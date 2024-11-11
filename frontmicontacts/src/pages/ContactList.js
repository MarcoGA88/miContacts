import React, { useEffect, useState, useCallback } from 'react';
import { getContacts, moveContactToTrash, toggleFavorite } from '../api/contactService'; // Importamos toggleFavorite
import { Star, StarOff, Edit, Trash } from 'lucide-react';
import ContactModal from '../components/ContactModal';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

function ContactList({ searchQuery }) {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const filterContacts = useCallback((query) => {
    if (!contacts) return;
    if (query) {
      const filtered = contacts.filter(contact => {
        const name = contact.name ? contact.name.toLowerCase() : '';
        const email = contact.email ? contact.email.toLowerCase() : '';
        const phone = contact.phone ? contact.phone : '';
        return name.includes(query.toLowerCase()) || email.includes(query.toLowerCase()) || phone.includes(query);
      });
      setFilteredContacts(filtered);
    } else {
      setFilteredContacts(contacts);
    }
  }, [contacts]);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const data = await getContacts();
        const sortedContacts = data.sort((a, b) => a.name.localeCompare(b.name));
        setContacts(sortedContacts);
        setFilteredContacts(sortedContacts);
      } catch (error) {
        console.error('Error fetching contacts:', error);
      }
    };
    fetchContacts();
  }, []);

  useEffect(() => {
    filterContacts(searchQuery);
  }, [searchQuery, filterContacts]);

  const handleContactClick = useCallback((contact) => {
    setSelectedContact(contact);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedContact(null);
  }, []);

  const handleEdit = useCallback((contact) => {
    navigate(`/edit/${contact.id}`);
  }, [navigate]);

  const handleDelete = useCallback((contact) => {
    Swal.fire({
      title: '¿Mover a la papelera?',
      text: `El contacto ${contact.name} será movido a la papelera.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Mover',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const updatedContact = await moveContactToTrash(contact.id);
          // Eliminar de la lista local
          setContacts(prevContacts => prevContacts.filter((c) => c.id !== contact.id));
          setFilteredContacts(prevFiltered => prevFiltered.filter((c) => c.id !== contact.id));
          Swal.fire('Movido', `${contact.name} ha sido movido a la papelera.`, 'success');
        } catch (error) {
          Swal.fire('Error', 'Hubo un problema al mover el contacto.', 'error');
        }
      }
    });
  }, []);
  
  

  const toggleFavoriteStatus = useCallback(async (contact) => {
    try {
      // Alternamos el estado de favorito
      const updatedContact = await toggleFavorite(contact.id, !contact.is_favorite);
      
      // Actualizamos el contacto en la lista de contactos
      setContacts(prevContacts => prevContacts.map(c => 
        c.id === updatedContact.id ? updatedContact : c
      ));
      
      setFilteredContacts(prevFiltered => prevFiltered.map(c => 
        c.id === updatedContact.id ? updatedContact : c
      ));
    } catch (error) {
      Swal.fire('Error', 'Hubo un problema al actualizar el estado de favorito.', 'error');
    }
  }, []);

  const generateAvatarColor = useCallback((name) => {
    if (!name) return 'bg-gray-500';
    const firstLetter = name.trim().charAt(0).toLowerCase();
    const colors = [
      'bg-red-400', 'bg-blue-400', 'bg-green-400',
      'bg-yellow-400', 'bg-purple-400', 'bg-pink-400',
      'bg-teal-400', 'bg-indigo-400'
    ];
    const colorIndex = firstLetter.charCodeAt(0) % colors.length;
    return colors[colorIndex];
  }, []);

  return (
    <div className="p-4 h-full flex flex-col">
      <h2 className="text-2xl font-semibold mb-4 flex-shrink-0">Lista de Contactos</h2>
      <div className="overflow-y-auto p-5 flex-1">
        {filteredContacts.length === 0 ? (
          <div className="py-4 text-center text-gray-500">No hay contactos disponibles</div>
        ) : (
          <table className="table-auto w-full text-sm text-gray-700">
            <thead>
              <tr className="text-left border-b border-gray-300">
                <th className="px-4 py-2"></th>
                <th className="px-4 py-2">Nombre</th>
                <th className="px-4 py-2">Correo</th>
                <th className="px-4 py-2">Teléfono</th>
                <th className="px-4 py-2">Empresa/Puesto</th>
                <th className="px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredContacts.map((contact) => (
                <tr 
                  key={contact.id} 
                  className="group hover:bg-gray-100 cursor-pointer" 
                  onClick={() => handleContactClick(contact)}
                >
                  <td className="px-4 py-2 flex items-center gap-2">
                    <div className={`${generateAvatarColor(contact.name)} w-8 h-8 rounded-full flex items-center justify-center text-white`}>
                      {contact.name ? contact.name.charAt(0).toUpperCase() : '?'}
                    </div>
                  </td>
                  <td className="px-4 py-2">{contact.name}</td>
                  <td className="px-4 py-2">{contact.email}</td>
                  <td className="px-4 py-2">{contact.phone}</td>
                  <td className="px-4 py-2">{contact.company}</td>
                  <td className="px-4 py-2 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleFavoriteStatus(contact); }}
                      className="p-2 rounded bg-gray-200 hover:bg-gray-300"
                    >
                      {contact.is_favorite ? 
                        <Star className="text-yellow-400" /> : 
                        <StarOff className="text-gray-500" />
                      }
                    </button>
                    <button
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        handleEdit(contact); 
                      }}
                      className="p-2 rounded-3xl text-blue-400 hover:text-blue-400 hover:bg-slate-200"
                    >
                      <Edit size={20}/>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        handleDelete(contact); 
                      }}
                      className="p-2 text-red-500 rounded-3xl hover:text-red-700 hover:bg-slate-200"
                    >
                      <Trash size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ContactModal
        contact={selectedContact}
        isOpen={isModalOpen}
        onClose={closeModal}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default ContactList;