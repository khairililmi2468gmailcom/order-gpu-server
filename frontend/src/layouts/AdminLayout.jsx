import React from 'react';
import AdminHeader from '../components/admin/AdminHeader'; // Kamu buat file ini
import AdminSidebar from '../components/admin/AdminSidebar'; // Kamu buat file ini

const AdminLayout = ({ children }) => {
  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1">
        <AdminHeader />
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
