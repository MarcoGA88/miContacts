const db = require('../config/db');

// Crear un nuevo contacto
const createContact = async (name, email, phone, address, company) => {
  const query = `
    INSERT INTO contacts (name, email, phone, address, company)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;
  
  const phoneJson = JSON.stringify(phone);
  console.log('phoneJson:', phoneJson); // Verifica la salida de JSON.stringify()
 
  const values = [name, email, phoneJson, address, company];
  
  try {
    const result = await db.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Error in createContact:', error);
    throw error;
  }
};


// Obtener todos los contactos con filtros opcionales (por nombre, correo, teléfono) y que no estén en la papelera
const getAllContacts = async (filters = {}) => {
  const { name, email, phone } = filters;
  
  let query = 'SELECT * FROM contacts WHERE isintrash = false';  // Filtrar por isintrash = false
  const values = [];
  
  if (name) {
    query += ` AND name ILIKE $${values.length + 1}`;
    values.push(`%${name}%`);
  }
  
  if (email) {
    query += ` AND email ILIKE $${values.length + 1}`;
    values.push(`%${email}%`);
  }

  if (phone) {
    query += ` AND phone ILIKE $${values.length + 1}`;
    values.push(`%${phone}%`);
  }

  const result = await db.query(query, values);
  return result.rows;
};


// Actualizar un contacto

const updateContact = async (id, name, email, phone, address, company) => {
  const query = `
    UPDATE contacts
    SET name = $1, email = $2, phone = $3, address = $4, company = $5
    WHERE id = $6
    RETURNING *;
  `;

  const phoneJson = JSON.stringify(phone);  // Serializar teléfono como JSON
  console.log('phoneJson:', phoneJson);

  const values = [name, email, phoneJson, address, company, id];

  try {
    const result = await db.query(query, values);
    if (result.rows.length === 0) {
      throw new Error('El contacto no existe');
    }
    return result.rows[0];
  } catch (error) {
    console.error('Error in updateContact:', error);
    throw error;
  }
};



const getContactById = async (id) => {
  const query = 'SELECT * FROM contacts WHERE id = $1';
  const values = [id];

  const result = await db.query(query, values);

  if (result.rows.length > 0) {
    return result.rows[0]; // JSONB ya es un objeto, no hay que parsearlo
  } else {
    return null; // Si no existe contacto
  }
};

const moveToTrash = async (id) => {
  try {
    const query = `
      UPDATE contacts 
      SET isintrash = true, updated_at = NOW()
      WHERE id = $1 AND isintrash = false
      RETURNING *
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];  // Retorna el contacto movido
  } catch (error) {
    throw new Error('Error al mover el contacto a la papelera: ' + error.message);
  }
};


const restoreFromTrash = async (id) => {
  const query = `
    UPDATE contacts 
    SET isintrash = false, 
        updated_at = NOW() 
    WHERE id = $1 AND isintrash = true 
    RETURNING *
  `;
  const result = await db.query(query, [id]);
  return result.rows[0];
};

const getAllTrashContacts = async () => {
  const query = 'SELECT * FROM contacts WHERE isintrash = true ORDER BY updated_at DESC';
  const result = await db.query(query);
  return result.rows;
};

const deleteContactPermanently = async (id) => {
  const query = `
    DELETE FROM contacts 
    WHERE id = $1 AND isintrash = true 
    RETURNING *
  `;
  const result = await db.query(query, [id]);
  return result.rows[0];
};

// Obtener contactos recientes (última semana)
const getRecentContacts = async () => {
  const query = `
    SELECT * FROM contacts
    WHERE created_at >= NOW() - INTERVAL '7 days'
    ORDER BY created_at DESC;
  `;
  const result = await db.query(query);
  return result.rows;
};


module.exports = {
  createContact,
  getAllContacts,
  getContactById,
  updateContact,
  moveToTrash,
  restoreFromTrash,
  deleteContactPermanently,
  getRecentContacts, // Nueva función exportada
  getAllTrashContacts,
};
