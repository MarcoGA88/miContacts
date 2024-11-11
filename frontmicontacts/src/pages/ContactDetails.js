import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { getContactById } from '../api/contactService'; 

const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await axios.get('/contacts'); // Llama al endpoint de obtener todos los contactos
        setContacts(response.data);
      } catch (error) {
        console.error('Error fetching contacts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  const toggleFavorite = async (id, isFavorite) => {
    try {
      const response = await axios.put(`/contacts/${id}/favorite`, { is_favorite: !isFavorite });
      setContacts((prevContacts) =>
        prevContacts.map((contact) =>
          contact.id === id ? { ...contact, is_favorite: response.data.is_favorite } : contact
        )
      );
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  if (loading) {
    return <p>Loading contacts...</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Contact List</h2>
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id} className="mb-2 flex justify-between items-center">
            <Link to={`/contacts/${contact.id}`} className="text-blue-500 hover:underline">
              {contact.name}
            </Link>
            <button
              className={`text-sm ${contact.is_favorite ? 'text-yellow-500' : 'text-gray-500'}`}
              onClick={() => toggleFavorite(contact.id, contact.is_favorite)}
            >
              {contact.is_favorite ? '★' : '☆'} {/* Iconos de estrella para favoritos */}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContactList;
