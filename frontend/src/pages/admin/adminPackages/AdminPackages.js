import React, { useState, useEffect, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import PackageList from '../../../components/admin/packagesServer/PackageList';
import PackageForm from '../../../components/admin/packagesServer/PackageForm';
import SearchBar from '../../../components/admin/packagesServer/SearchBar';
import Pagination from '../../../components/admin/packagesServer/Pagination';
import Swal from 'sweetalert2';
import { PlusCircleIcon, RocketLaunchIcon, ArrowsUpDownIcon, ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';
import axios from 'axios';


function AdminPackages() {
    const token = localStorage.getItem('token');
    const [packages, setPackages] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [packagesPerPage, setPackagesPerPage] = useState(5); // Initialize as a number
    const [loading, setLoading] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const availablePageSizes = [5, 10, 25, 50, 100, 500, 1000];
    const [sortBy, setSortBy] = useState('updated_at');
    const [sortOrder, setSortOrder] = useState('desc');

    const sortOptions = [
        { value: 'updated_at', label: 'Terakhir Diupdate' },
        { value: 'created_at', label: 'Tanggal Pembuatan' },
        { value: 'name', label: 'Nama Paket' }
    ];
    // Use useCallback for fetchPackages to prevent unnecessary re-renders
    const fetchPackages = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/gpu-packages`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const newData = response.data;
            if (Array.isArray(newData)) {
                setPackages(() => newData); // Use a function to update state
            } else {
                console.error("Error: Data fetched is not an array", response);
                Swal.fire(
                    'Error',
                    `Failed to fetch packages: Invalid data format. Expected an array, but received ${typeof responseData}. Please check the API response.`,
                    'error'
                );
                setPackages([]); // Reset packages to prevent errors
            }
        } catch (error) {
            console.error("Gagal mengambil paket:", error);
            Swal.fire('Error!', 'Gagal mengambil data paket.', 'error');
            setPackages([]);
        } finally {
            setLoading(false);
        }
    }, [token]);

    // Fetch packages on component mount and when refreshKey changes
    useEffect(() => {
        fetchPackages();
    }, [fetchPackages, refreshKey]);

    const handleRefresh = () => {
        setRefreshKey(prevKey => prevKey + 1);
    };

    const filteredPackages = packages.filter(pkg => {
        const nameMatch = pkg.name?.toLowerCase().includes(searchQuery.toLowerCase());
        const vcpuMatch = pkg.vcpu?.toLowerCase().includes(searchQuery.toLowerCase());
        const ramMatch = pkg.ram?.toLowerCase().includes(searchQuery.toLowerCase());

        return nameMatch || vcpuMatch || ramMatch;
    }).sort((a, b) => {
        let valueA, valueB;

        if (sortBy === 'name') {
            valueA = a.name?.toLowerCase();
            valueB = b.name?.toLowerCase();
        } else {
            valueA = new Date(a[sortBy]);
            valueB = new Date(b[sortBy]);
        }

        if (sortOrder === 'asc') {
            return valueA > valueB ? 1 : -1;
        }
        return valueA < valueB ? 1 : -1;
    });

    const indexOfLastPackage = currentPage * packagesPerPage;
    const indexOfFirstPackage = indexOfLastPackage - packagesPerPage;
    const currentPackages = filteredPackages.slice(indexOfFirstPackage, indexOfLastPackage);
    const totalPages = Math.ceil(filteredPackages.length / packagesPerPage);

    const showFormModal = (initialPackage = null) => {
        let formInstance;

        Swal.fire({
            title: initialPackage ? 'Edit Paket' : 'Tambah Paket Baru',
            html: '<div id="swal-form"></div>',
            showConfirmButton: true,
            confirmButtonText: 'Simpan',
            showCancelButton: true,
            cancelButtonText: 'Batal',
            preConfirm: () => {
                if (formInstance) {
                    return formInstance.validateForm();
                }
                return false;
            },
            didOpen: () => {
                Swal.enableButtons();
                const formContainer = document.getElementById('swal-form');
                if (formContainer) {
                    formContainer.innerHTML = '';
                    const root = createRoot(formContainer);
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
                formData.price_per_hour = formData.price_per_hour.replace(/\./g, '');
            }
            const method = id ? 'PUT' : 'POST';
            const url = id ? `${process.env.REACT_APP_API_URL}/api/admin/gpu-packages/${id}` : `${process.env.REACT_APP_API_URL}/api/admin/gpu-packages`;

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
            await fetchPackages(); // Refetch packages to update the list
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
            cancelButtonText: 'Batal',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/gpu-packages/${id}`, {
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
                    await fetchPackages(); // Refetch packages after deletion
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
        setPackagesPerPage(parseInt(event.target.value, 10));
        setCurrentPage(1);
    };

    if (loading) {
        return (
            <div className="p-8 flex justify-center items-center">
                <RocketLaunchIcon className="animate-spin h-8 w-8 text-gray-700" />
                <span className="ml-2 text-gray-700">Sedang memuat data paket server...</span>
            </div>
        );
    }


    return (
        <div className="p-4 md:p-6 lg:p-8">
            <h1 className="text-2xl font-semibold mb-4 text-gray-900">Manajemen Paket Server</h1>
            <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <button
                    onClick={handleCreate}
                    className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-green-500 hover:bg-green-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 transition-colors"
                >
                    <PlusCircleIcon className="mr-2 h-4 w-4" />
                    Tambah Paket
                </button>
                <SearchBar onSearch={handleSearch} />
            </div>
            <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <label htmlFor="pageSize" className="text-sm font-medium text-gray-700">
                    Tampilkan per halaman:
                </label>
                <select
                    id="pageSize"
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md py-2 px-3 max-w-sm"
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
            <div className="flex items-center gap-2">
                <label htmlFor="sortBy" className="text-sm font-medium text-gray-700">
                    Urutkan berdasarkan:
                </label>
                <select
                    id="sortBy"
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md py-2 px-3"
                    value={sortBy}
                    onChange={(e) => {
                        setSortBy(e.target.value);
                        setCurrentPage(1);
                    }}
                >
                    {sortOptions.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>

                <button
                    onClick={() => {
                        setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
                        setCurrentPage(1);
                    }}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors flex items-center gap-1"
                    title={`Urutkan ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
                >
                    <ArrowsUpDownIcon className="h-4 w-4 mr-1" />
                    {sortOrder === 'asc' ? (
                        <span>Asc</span>
                    ) : (
                        <span>Desc</span>
                    )}
                </button>
            </div>

            <PackageList
                packages={currentPackages}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onRefresh={handleRefresh}
                loading={loading}
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
