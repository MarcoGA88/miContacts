import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getRecentContacts } from '../api/contactService'; // Asegúrate de importar correctamente la función

const RecentContacts = () => {
  const [recentContacts, setRecentContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentContacts = async () => {
      try {
        const contacts = await getRecentContacts(); // Llama a la función getRecentContacts del archivo de la API
        setRecentContacts(contacts);
      } catch (error) {
        console.error('Error fetching recent contacts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentContacts();
  }, []);

  if (loading) {
    return <p>Loading recent contacts...</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Recent Contacts</h2>
      <ul>
        {recentContacts.map((contact) => (
          <li key={contact.id} className="mb-2">
            <Link to={`/details/${contact.id}`} className="text-blue-500 hover:underline">
              {contact.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentContacts;
