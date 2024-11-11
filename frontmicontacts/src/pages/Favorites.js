import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toggleFavorite, getFavoriteContacts } from '../api/contactService';  // Importar la función para obtener y marcar/desmarcar favoritos
import Swal from 'sweetalert2'; // Importar SweetAlert

function Favorites() {
  const [favoriteContacts, setFavoriteContacts] = useState([]);

  // Obtener los contactos favoritos al cargar la página
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const data = await getFavoriteContacts(); // Obtener los favoritos del backend
        setFavoriteContacts(data);
      } catch (error) {
        console.error('Error al obtener los contactos favoritos:', error);
      }
    };
    fetchFavorites();
  }, []); // El arreglo vacío asegura que solo se ejecute una vez cuando el componente se monte

  // Función para desmarcar un contacto como favorito
  const handleToggleFavorite = async (id, isFavorite) => {
    try {
      await toggleFavorite(id, isFavorite);  // No es necesario guardar el resultado en una variable
      setFavoriteContacts(favoriteContacts.filter(contact => contact.id !== id)); // Eliminar el contacto desmarcado
      Swal.fire({
        title: 'Éxito!',
        text: `El contacto ha sido ${isFavorite ? 'desmarcado' : 'marcado'} como favorito.`,
        icon: 'success',
        confirmButtonText: 'Aceptar',
      });
    } catch (error) {
      console.error('Error al actualizar el contacto:', error);
      Swal.fire({
        title: 'Error!',
        text: 'No se pudo actualizar el contacto.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
      });
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Contactos Favoritos</h1>
      {favoriteContacts.length === 0 ? (
        <p>No tienes contactos favoritos aún.</p>
      ) : (
        <ul>
          {favoriteContacts.map(contact => (
            <li key={contact.id} className="mb-3 p-3 border-b flex justify-between items-center">
              <Link to={`/contacts/${contact.id}`} className="text-blue-500">
                {contact.name} - {contact.phone}
              </Link>
              <button
                onClick={() => handleToggleFavorite(contact.id, contact.is_favorite)}
                className="ml-4 text-red-500 hover:text-red-700"
              >
                {contact.is_favorite ? 'Desmarcar como favorito' : 'Marcar como favorito'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Favorites;
