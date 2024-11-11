import React, { useState } from 'react';
import { createContact } from '../api/contactService';
import { PlusCircle, Trash2, Mail, MapPin } from 'lucide-react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import Swal from 'sweetalert2';

function CreateContact() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: [''],
    email: '',
    address: '',
  });

  const [showEmailInput, setShowEmailInput] = useState(false);
  const [showAddressInput, setShowAddressInput] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const updatedPhones = [...formData.phone];
      updatedPhones[index] = value;
      setFormData({ ...formData, phone: updatedPhones });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleAddPhone = () => {
    setFormData({ ...formData, phone: [...formData.phone, ''] });
  };

  const handleRemovePhone = (index) => {
    const updatedPhones = formData.phone.filter((_, i) => i !== index);
    setFormData({ ...formData, phone: updatedPhones });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) {
      newErrors.name = 'El nombre es obligatorio';
    }
    if (formData.phone.length === 0 || formData.phone.some(phone => !phone)) {
      newErrors.phone = 'El teléfono es obligatorio';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar antes de enviar
    if (!validateForm()) {
      return;
    }
    try {
      // Filtrar teléfonos vacíos antes de enviar y asegurarse de que siempre sea un array
      const validPhones = formData.phone.filter(p => p && p.trim());
      
      // Verificar si el array de teléfonos no está vacío
      if (validPhones.length === 0) {
        throw new Error('Se requiere al menos un número de teléfono válido');
      }
  
      const dataToSend = {
        ...formData,
        phone: validPhones  // Asegurarse de que `phone` sea un array
      };
  
      await createContact(dataToSend);  // Llamar a la función para crear el contacto

      // Mostrar una alerta con SweetAlert2 (más pequeña y compacta)
      Swal.fire({
        icon: 'success',
        title: 'Contacto Guardado',
        text: 'El contacto fue creado exitosamente.',
        showConfirmButton: false,
        timer: 2000,
        position: 'top-end',  // Coloca la alerta en la esquina superior derecha
        toast: true,  // Estilo de alerta tipo "toast"
        background: '#28a745',  // Fondo verde para éxito
        color: '#fff',  // Color de texto blanco
        iconColor: '#fff',  // Color del icono blanco
      });
      
      // Limpiar el formulario después de guardar
      setFormData({
        name: '',
        company: '',
        phone: [''],
        email: '',
        address: '',
      });
      
      setShowEmailInput(false);
      setShowAddressInput(false);
      
    } catch (error) {
      console.error('Error al crear el contacto:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Hubo un error al crear el contacto',
        showConfirmButton: true,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-2xl mx-auto bg-white rounded-lg ">
      <h2 className="text-2xl font-bold text-center mb-6">Crear Contacto</h2>

      {/* Nombre */}
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre</label>
        <input
          id="name"
          type="text"
          name="name"
          value={formData.name}
          onChange={(e) => handleChange(e)}
          required
          className={`mt-2 p-3 border rounded-xl w-full focus:outline-none border-black focus:ring-2 focus:ring-blue-400 ${errors.name ? 'border-red-500' : ''}`}
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
      </div>

      {/* Teléfonos */}
      <div className="mb-6">
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Teléfono</label>
        {formData.phone.map((phone, index) => (
          <div key={index} className="flex items-center space-x-2 mb-3">
            <PhoneInput
              international
              defaultCountry="US"
              value={phone}
              onChange={(value) => handleChange({ target: { name: 'phone', value } }, index)}
              className={`p-3 border rounded-xl w-full focus:outline-none focus:ring-2 border-black focus:ring-blue-400 ${errors.phone ? 'border-red-500' : ''}`}
              placeholder={`Teléfono ${index + 1}`}
            />
            {formData.phone.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemovePhone(index)}
                className="text-red-500"
              >
                <Trash2 size={20} />
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddPhone}
          className="flex items-center space-x-2 text-blue-500 hover:text-blue-600"
        >
          <PlusCircle size={20} />
          <span>Agregar otro número</span>
        </button>
        {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
      </div>

      {/* Empresa o Puesto */}
      <div className="mb-4">
        <label htmlFor="company" className="block text-sm font-medium text-gray-700">Empresa/Puesto</label>
        <input
          id="company"
          type="text"
          name="company"
          value={formData.company}
          onChange={(e) => handleChange(e)}
          className="mt-2 p-3 border rounded-xl w-full border-black focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Mostrar campos adicionales si están activados */}
      {showEmailInput && (
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={(e) => handleChange(e)}
            className="mt-2 p-3 border rounded-xl w-full border-black focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      )}

      {showAddressInput && (
        <div className="mb-4">
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">Dirección</label>
          <input
            id="address"
            type="text"
            name="address"
            value={formData.address}
            onChange={(e) => handleChange(e)}
            className="mt-2 p-3 border rounded-xl w-full border-black focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      )}

      {/* Botones para agregar información adicional */}
<div className="mb-6 flex justify-center">
  <div className="flex flex-col space-y-2 items-center">
    <button
      type="button"
      onClick={() => setShowEmailInput(!showEmailInput)}
      className={`w-52 px-4 py-2 rounded-full flex items-center justify-center space-x-2 text-white ${showEmailInput ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}`}
    >
      <Mail size={16} />
      <span className="text-sm">{showEmailInput ? 'Cancelar Correo' : 'Agregar Correo'}</span>
    </button>

    <button
      type="button"
      onClick={() => setShowAddressInput(!showAddressInput)}
      className={`w-52 px-4 py-2 rounded-full flex items-center justify-center space-x-2 text-white ${showAddressInput ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}`}
    >
      <MapPin size={16} />
      <span className="text-sm">{showAddressInput ? 'Cancelar Dirección' : 'Agregar Dirección'}</span>
    </button>
  </div>
</div>


      {/* Botón de envío */}
      <div className="flex justify-center">
        <button
          type="submit"
          className=" w-96 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl w-full"
        >
          Crear Contacto
        </button>
      </div>
    </form>
  );
}

export default CreateContact;
