const contactModel = require('../models/contact');

// Crear un nuevo contacto
const createContact = async (req, res) => {
  try {
    const { name, email, phone, address, company } = req.body;
    
    // Validar datos requeridos
    if (!name || !phone) {
      return res.status(400).json({ message: 'El nombre y al menos un teléfono son requeridos' });
    }

    // Asegurarse de que phone sea un array válido
    const phoneArray = Array.isArray(phone) ? phone : [phone];
    
    // Filtrar números vacíos
    const validPhones = phoneArray.filter(p => p && p.trim());
    
    if (validPhones.length === 0) {
      return res.status(400).json({ message: 'Se requiere al menos un número de teléfono válido' });
    }

    const newContact = await contactModel.createContact(
      name, 
      email || null, // Si email es undefined, usar null
      validPhones,
      address || null,
      company || null
    );

    res.status(201).json(newContact);
  } catch (error) {
    console.error('Error creating contact:', error);
    if (error.constraint === 'contacts_email_key') {
      return res.status(400).json({ message: 'El email ya está registrado' });
    }
    res.status(500).json({ message: 'Error al crear el contacto' });
  }
};


// Actualizar un contacto
const updateContact = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, address, company } = req.body;

    if (!name || !phone || phone.length === 0) {
      return res.status(400).json({ message: 'El nombre y al menos un teléfono son requeridos' });
    }

    const phoneArray = Array.isArray(phone) ? phone : [phone];
    const validPhones = phoneArray.filter(p => p && p.trim());

    if (validPhones.length === 0) {
      return res.status(400).json({ message: 'Se requiere al menos un número de teléfono válido' });
    }

    const updatedContact = await contactModel.updateContact(
      id, 
      name, 
      email || null, 
      validPhones, 
      address || null, 
      company || null
    );

    res.status(200).json(updatedContact);
  } catch (error) {
    console.error('Error updating contact:', error);
    if (error.message === 'El contacto no existe') {
      return res.status(404).json({ message: 'Contacto no encontrado' });
    }
    res.status(500).json({ message: 'Error al actualizar el contacto' });
  }
};



const getContactById = async (req, res) => {
  try {
    const contactId = req.params.id; 
    const contact = await contactModel.getContactById(contactId);

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.status(200).json(contact); // Asegúrate que este objeto no requiere más modificaciones.
  } catch (error) {
    console.error('Error fetching contact:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// Obtener todos los contactos con filtro opcional y solo aquellos que no están en la papelera
const getAllContacts = async (req, res) => {
  try {
    const { name, email, phone } = req.query;
    const filters = { name, email, phone };
    const contacts = await contactModel.getAllContacts(filters);

    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const moveToTrash = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await contactModel.moveToTrash(id); // Correct model call
    if (!contact) {
      return res.status(404).json({ message: 'Contacto no encontrado o ya está en la papelera' });
    }
    res.status(200).json(contact);
  } catch (error) {
    res.status(500).json({ message: 'Error al mover el contacto a la papelera: ' + error.message });
  }
};



const restoreFromTrash = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await contactModel.restoreFromTrash(id);
    if (!contact) {
      return res.status(404).json({ message: 'Contacto no encontrado en la papelera' });
    }
    res.status(200).json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllTrashContacts = async (req, res) => {
  try {
    const contacts = await contactModel.getAllTrashContacts();
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteContactPermanently = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await contactModel.deleteContactPermanently(id);
    if (!contact) {
      return res.status(404).json({ message: 'Contacto no encontrado o ya eliminado permanentemente' });
    }
    res.status(200).json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener contactos recientes
const getRecentContacts = async (req, res) => {
  try {
    const recentContacts = await contactModel.getRecentContacts();
    res.status(200).json(recentContacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const markFavorite = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await contactModel.markFavorite(id);
    if (!contact) {
      return res.status(404).json({ message: 'Contacto no encontrado' });
    }
    res.status(200).json(contact);
  } catch (error) {
    console.error('Error al marcar como favorito:', error);
    res.status(500).json({ message: 'Error al marcar como favorito' });
  }
};

const unmarkFavorite = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await contactModel.unmarkFavorite(id);
    if (!contact) {
      return res.status(404).json({ message: 'Contacto no encontrado' });
    }
    res.status(200).json(contact);
  } catch (error) {
    console.error('Error al desmarcar como favorito:', error);
    res.status(500).json({ message: 'Error al desmarcar como favorito' });
  }
};



module.exports = {
  createContact,
  getAllContacts,
  getContactById,
  updateContact,
  moveToTrash,
  restoreFromTrash,
  getAllTrashContacts,
  deleteContactPermanently,
  markFavorite,
  unmarkFavorite,
  getRecentContacts// Nueva función de contactos recientes
};
