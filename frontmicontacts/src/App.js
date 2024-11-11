import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ContactList from './pages/ContactList';
import ContactDetails from './pages/ContactDetails';
import CreateContact from './pages/CreateContact';
import EditContact from './pages/EditContact';
import Trash from './pages/Pepelera';
import RecentContacts from './pages/RecentContacts'; // Nueva página
import { useState } from 'react';  // Importar useState para manejar la búsqueda

function App() {
  const [searchQuery, setSearchQuery] = useState(''); // Estado para el término de búsqueda

  // Función para manejar el cambio en la búsqueda
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <Router>
      <div className="flex h-screen bg-slate-100">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header onSearch={handleSearch} /> {/* Pasar la función de búsqueda a Header */}
          {/* Nuevo contenedor para habilitar scroll solo en el contenido de la lista */}
          <div className="flex-1 overflow-y-auto p-4 rounded-3xl bg-white mr-4 mb-4">
            <Routes>
              <Route path="/" element={<ContactList searchQuery={searchQuery} />} />
              <Route path="/contacts/:id" element={<ContactDetails />} />
              <Route path="/create" element={<CreateContact />} />
              <Route path="/edit/:id" element={<EditContact />} />
              <Route path="/recent" element={<RecentContacts />} />
              <Route path="/trash" element={<Trash />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;




