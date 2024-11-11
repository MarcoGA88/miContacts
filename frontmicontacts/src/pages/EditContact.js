import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getContactById, updateContact } from '../api/contactService';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css'; // Importar los estilos necesarios para PhoneInput
import { Trash } from 'lucide-react';  // Importar el icono Trash de lucide-react
import Swal from 'sweetalert2';

function EditContact() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contact, setContact] = useState({
    name: '',
    email: '',
    phone: [''], // Inicializar como array con un teléfono vacío
    company: '',
    address: '' // Agregar el campo de dirección
  });
  const [error, setError] = useState('');

  // Función para generar el color del avatar basado en el nombre
  const generateAvatarColor = (name) => {
    if (!name) return 'bg-gray-500';
    const firstLetter = name.trim().charAt(0).toLowerCase();
    const colors = ['bg-red-400', 'bg-blue-400', 'bg-green-400', 'bg-yellow-400', 'bg-purple-400', 'bg-pink-400', 'bg-teal-400', 'bg-indigo-400'];
    const colorIndex = firstLetter.charCodeAt(0) % colors.length;
    return colors[colorIndex];
  };

  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : '';
  };

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const data = await getContactById(id);

        // Normalizar phone como un array en el frontend
        const phoneArray = Array.isArray(data.phone)
          ? data.phone
          : [data.phone].filter(Boolean);

        setContact({
          ...data,
          phone: phoneArray.length > 0 ? phoneArray : ['']
        });
      } catch (error) {
        console.error('Error fetching contact data:', error);
        setError('Error al cargar el contacto');
      }
    };

    fetchContact();
  }, [id]);

  // Función para agregar un nuevo campo de teléfono
  const addPhoneField = () => {
    setContact({
      ...contact,
      phone: [...contact.phone, '']
    });
  };

  // Función para remover un campo de teléfono
  const removePhoneField = (index) => {
    const newPhones = contact.phone.filter((_, i) => i !== index);
    setContact({
      ...contact,
      phone: newPhones.length > 0 ? newPhones : [''] // Mantener al menos un campo
    });
  };

  // Función para actualizar un número de teléfono específico
  const handlePhoneChange = (index, value) => {
    const newPhones = [...contact.phone];
    newPhones[index] = value;
    setContact({
      ...contact,
      phone: newPhones
    });
  };

  const handleSave = async () => {
    try {
      // Validar que haya al menos un teléfono no vacío
      const validPhones = contact.phone.filter(phone => phone.trim());
      if (validPhones.length === 0) {
        setError('Se requiere al menos un número de teléfono válido');
        return;
      }
  
      // Validar nombre
      if (!contact.name.trim()) {
        setError('El nombre es requerido');
        return;
      }
  
      const contactToUpdate = {
        ...contact,
        phone: validPhones // Enviar solo los teléfonos válidos
      };
  
      await updateContact(id, contactToUpdate);
      Swal.fire({
        title: 'Éxito',
        text: 'El contacto ha sido actualizado correctamente',
        icon: 'success',
        confirmButtonText: 'OK'
      });
  
      // Redirigir a la lista de contactos después de un exitoso guardado
      navigate('/'); // Esto redirige a la página principal (ContactList)
  
    } catch (error) {
      console.error('Error updating contact:', error);
      setError(error.response?.data?.message || 'Error al actualizar el contacto');
      Swal.fire({
        title: 'Error',
        text: error.response?.data?.message || 'Hubo un error al actualizar el contacto',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };
  

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-center">Editar Contacto</h2>

      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="flex flex-col items-center mb-6">
        <div
          className={`${generateAvatarColor(contact.name)} w-24 h-24 rounded-full flex items-center justify-center text-white font-semibold`}
        >
          {getInitial(contact.name)}
        </div>
        <div className="text-xl font-semibold mt-4">{contact.name}</div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-gray-700">Nombre:</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={contact.name}
            onChange={(e) => setContact({ ...contact, name: e.target.value })}
            placeholder="Nombre completo"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700">Correo:</label>
          <input
            type="email"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={contact.email || ''}
            onChange={(e) => setContact({ ...contact, email: e.target.value })}
            placeholder="Correo electrónico"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Teléfonos:</label>
          {contact.phone.map((phone, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <PhoneInput
                className="flex-1 p-2 border border-gray-300 rounded-md"
                value={phone}
                onChange={(value) => handlePhoneChange(index, value)}
                placeholder="Número de teléfono"
                international
                defaultCountry="US"
              />
              {contact.phone.length > 1 && (
                <button
                  type="button"
                  onClick={() => removePhoneField(index)}
                  className="p-2 text-red-500 hover:text-red-700"
                >
                  <Trash size={20} />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addPhoneField}
            className="mt-2 text-blue-500 hover:text-blue-700"
          >
            + Agregar otro teléfono
          </button>
        </div>

        <div>
          <label className="block text-gray-700">Empresa/Puesto:</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={contact.company || ''}
            onChange={(e) => setContact({ ...contact, company: e.target.value })}
            placeholder="Empresa o puesto"
          />
        </div>

        {/* Agregar campo de Dirección */}
        <div>
          <label className="block text-gray-700">Dirección:</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={contact.address || ''}
            onChange={(e) => setContact({ ...contact, address: e.target.value })}
            placeholder="Dirección del contacto"
          />
        </div>

        <button
          onClick={handleSave}
          className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Guardar cambios
        </button>
      </div>
    </div>
  );
}

export default EditContact;
