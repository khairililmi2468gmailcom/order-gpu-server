import React from 'react';
import { Link } from 'react-router-dom';

const AdminSidebar = () => {
  return (
    <aside className="w-64 bg-gray-900 text-white h-screen p-4">
      <nav>
        <ul className="space-y-4">
          <li>
            <Link to="/admin" className="hover:underline">
              Dashboard
            </Link>
          </li>
          {/* Tambah menu lain kalau perlu */}
        </ul>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
