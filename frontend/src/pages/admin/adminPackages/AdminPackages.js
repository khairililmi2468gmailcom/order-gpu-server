import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client'; // Import createRoot
import useApi from '../../../hooks/useApi';
import PackageList from '../../../components/admin/packagesServer/PackageList';
import PackageForm from '../../../components/admin/packagesServer/PackageForm';
import SearchBar from '../../../components/admin/packagesServer/SearchBar';
import Pagination from '../../../components/admin/packagesServer/Pagination';
import Swal from 'sweetalert2';

function AdminPackages() {
    const token = localStorage.getItem('token');
    const [packages, setPackages] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    const [editingPackage, setEditingPackage] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [packagesPerPage, setPackagesPerPage] = useState(5);
    const [availablePageSizes] = useState([5, 10, 25, 50, 100, 500, 1000]);

    const { data: fetchedPackages, loading, error, setData: setFetchedPackages } = useApi(
        'http://localhost:4000/api/admin/gpu-packages',
        token
    );

    useEffect(() => {
        if (fetchedPackages) {
            // Urutkan paket berdasarkan updated_at dari yang terbaru
            const sortedPackages = [...fetchedPackages].sort((a, b) => {
                return new Date(b.updated_at) - new Date(a.updated_at); // Mengurutkan dari yang terbaru
            });
            setPackages(sortedPackages);
            setCurrentPage(1);
        }
    }, [fetchedPackages]); 
    
    
    const filteredPackages = packages.filter(pkg =>
        pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.vcpu?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.ram?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const indexOfLastPackage = currentPage * packagesPerPage;
    const indexOfFirstPackage = indexOfLastPackage - packagesPerPage;
    const currentPackages = filteredPackages.slice(indexOfFirstPackage, indexOfLastPackage);
    const totalPages = Math.ceil(filteredPackages.length / packagesPerPage);

    const handleCancelForm = () => {
        setIsCreating(false);
        setEditingPackage(null);
    };

    const showFormModal = (initialPackage = null) => {
        let formInstance; // Declare formInstance outside the then() block

        Swal.fire({
            title: initialPackage ? 'Edit Paket' : 'Tambah Paket Baru',
            html: '<div id="swal-form"></div>',
            showConfirmButton: true,
            confirmButtonText: 'Simpan',
            showCancelButton: true,
            cancelButtonText: 'Batal',
            preConfirm: () => {
                if (formInstance) { // Use formInstance here
                    return formInstance.validateForm(); // Call validateForm
                }
                return false;
            },
            didOpen: () => {
                Swal.enableButtons();
                const formContainer = document.getElementById('swal-form');
                if (formContainer) {
                    formContainer.innerHTML = '';
                    const root = createRoot(formContainer);
                    // Render PackageForm and pass a ref
                    root.render(
                        <PackageForm
                            ref={(el) => {
                                formInstance = el;
                            }}
                            initialPackage={initialPackage}
                            onSubmit={() => {
                                Swal.clickConfirm();
                            }}
                            onCancel={() => Swal.close()}
                        />
                    );
                }
            },
        }).then((result) => {
            if (result.isConfirmed && result.value) {
                handleSavePackage(result.value, initialPackage?.id);
            }
        });
    };

    const handleCreate = () => {
        Swal.fire({
            title: 'Konfirmasi',
            text: 'Apakah anda ingin menambahkan paket server baru?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya, tambahkan',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.isConfirmed) {
                showFormModal(null);
            }
        });
    };

    const handleEdit = (packageData) => {
        Swal.fire({
            title: 'Konfirmasi',
            text: `Apakah anda yakin ingin memperbarui paket "${packageData.name}"?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya, perbarui',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.isConfirmed) {
                showFormModal(packageData);
            }
        });
    };

    const handleSavePackage = async (formData, id = null) => {
        try {
            if (formData.price_per_hour) {
                formData.price_per_hour = formData.price_per_hour.replace(/\./g, '');  // Hapus titik
            }
            const method = id ? 'PUT' : 'POST';
            const url = id
                ? `http://localhost:4000/api/admin/gpu-packages/${id}`
                : 'http://localhost:4000/api/admin/gpu-packages';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const responseData = await response.json();
            Swal.fire('Berhasil!', `Paket server berhasil ${id ? 'diperbarui' : 'ditambahkan'}`, 'success');
            setFetchedPackages(prev => {
                if (id) {
                    return prev.map(pkg => pkg.id === id ? { ...pkg, ...formData } : pkg);
                } else {
                    return [...prev, { ...formData, id: responseData.id }];
                }
            });

        } catch (error) {
            console.error("Gagal menyimpan paket:", error);
            Swal.fire('Error!', error.message, 'error');
        }
    };

    const handleDelete = async (id) => {
        Swal.fire({
            title: 'Apakah anda yakin?',
            text: "Anda tidak akan dapat mengembalikan ini!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`http://localhost:4000/api/admin/gpu-packages/${id}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                    }

                    Swal.fire(
                        'Dihapus!',
                        'Paket server berhasil dihapus.',
                        'success'
                    );
                    setFetchedPackages(prev => prev.filter(pkg => pkg.id !== id));
                } catch (error) {
                    console.error("Gagal menghapus paket:", error);
                    Swal.fire('Error!', error.message, 'error');
                }
            }
        });
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
        setCurrentPage(1);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handlePageSizeChange = (event) => {
        setPackagesPerPage(parseInt(event.target.value));
        setCurrentPage(1);
    };

    if (loading) return <p className="p-8">Sedang memuat data paket server...</p>;
    if (error) return <p className="p-8 text-red-500">Error: {error}</p>;

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-4">Manajemen Paket Server</h1>
            <div className="mb-4 flex justify-between items-center">
                <button onClick={handleCreate} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    Tambah Paket Baru
                </button>
                <SearchBar onSearch={handleSearch} />
            </div>
            <div className="mb-4 flex items-center justify-start">
                <label htmlFor="pageSize" className="mr-2 text-gray-700 text-sm font-semibold">
                    Tampilkan per halaman:
                </label>
                <select
                    id="pageSize"
                    className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={packagesPerPage}
                    onChange={handlePageSizeChange}
                >
                    {availablePageSizes.map(size => (
                        <option key={size} value={size}>
                            {size}
                        </option>
                    ))}
                </select>
            </div>
            <PackageList
                packages={currentPackages}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
            {filteredPackages.length > 0 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            )}
        </div>
    );
}

export default AdminPackages;
