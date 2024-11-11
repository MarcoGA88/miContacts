const express = require('express');
const router = express.Router();
const contactsController = require('../controllers/contactController');

// Rutas existentes
router.post('/contacts', contactsController.createContact);
router.get('/contacts', contactsController.getAllContacts);
router.get('/contacts/:id', contactsController.getContactById);
router.put('/contacts/:id', contactsController.updateContact);

// Nuevas rutas para la papelera
router.put('/contacts/:id/trash', contactsController.moveToTrash);
router.post('/contacts/:id/restore', contactsController.restoreFromTrash);
router.get('/contacts/trash/all', contactsController.getAllTrashContacts);
router.delete('/contacts/:id', contactsController.deleteContactPermanently);

// Otras rutas
router.get('/contacts/recent/all', contactsController.getRecentContacts);

// Ruta para marcar un contacto como favorito
router.put('/contacts/:id/favorite/mark', contactsController.markFavorite);

// Ruta para desmarcar un contacto como favorito
router.put('/contacts/:id/favorite/unmark', contactsController.unmarkFavorite);



module.exports = router; // Asegúrate de exportar las rutas
