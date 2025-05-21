import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';

const PackageForm = forwardRef((props, ref) => {
    const { initialPackage, onSubmit } = props;

    const [name, setName] = useState('');
    const [pricePerHour, setPricePerHour] = useState('');
    const [vcpu, setVcpu] = useState('');
    const [ram, setRam] = useState('');
    const [ssd, setSsd] = useState('');
    const [memoryGpu, setMemoryGpu] = useState('');
    const [description, setDescription] = useState('');
    const [minPeriodHours, setMinPeriodHours] = useState(''); // Perbaikan: setminPeriodHours -> setMinPeriodHours
    const [stockAvailable, setStockAvailable] = useState(''); // Tambahkan state untuk stok

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (initialPackage) {
            setName(initialPackage.name || '');
            setPricePerHour(String(initialPackage.price_per_hour || ''));
            setVcpu(initialPackage.vcpu || '');
            setRam(initialPackage.ram || '');
            setSsd(initialPackage.ssd || '');
            setMemoryGpu(initialPackage.memory_gpu || '');
            setDescription(initialPackage.description || '');
            setMinPeriodHours(String(initialPackage.min_period_hours || ''));
            setStockAvailable(String(initialPackage.stock_available || '0')); // Inisialisasi stok
        } else {
            setName('');
            setPricePerHour('');
            setVcpu('');
            setRam('');
            setSsd('');
            setMemoryGpu('');
            setDescription('');
            setMinPeriodHours('');
            setStockAvailable('0'); // Default ke 0 jika tidak ada initialPackage
        }
    }, [initialPackage]);

    const validateForm = () => {
        const newErrors = {};
        let isValid = true;

        if (!name.trim()) {
            newErrors.name = 'Nama Paket harus diisi.';
            isValid = false;
        } else if (name.length > 100) {
            newErrors.name = 'Nama Paket maksimal 100 karakter.';
            isValid = false;
        }

        if (!pricePerHour) {
            newErrors.pricePerHour = 'Harga per Jam harus diisi.';
            isValid = false;
        } else if (typeof pricePerHour !== 'string') {
            newErrors.pricePerHour = 'Format harga tidak valid.';
            isValid = false;
        } else {
            const rawPrice = pricePerHour.replace(/\./g, '');
            const numericPrice = parseInt(rawPrice, 10);
            if (isNaN(numericPrice) || numericPrice < 0) {
                newErrors.pricePerHour = 'Harga harus berupa angka positif.';
                isValid = false;
            } else if (numericPrice > 99999999) {
                newErrors.pricePerHour = 'Harga maksimal Rp99.999.999';
                isValid = false;
            }
        }

        if (vcpu.length > 50) {
            newErrors.vcpu = 'vCPU maksimal 50 karakter.';
            isValid = false;
        }

        if (ram.length > 50) {
            newErrors.ram = 'RAM maksimal 50 karakter.';
            isValid = false;
        }

        if (ssd.length > 50) {
            newErrors.ssd = 'SSD maksimal 50 karakter.';
            isValid = false;
        }

        if (memoryGpu.length > 50) {
            newErrors.memoryGpu = 'Memory GPU maksimal 50 karakter.';
            isValid = false;
        }

        if (!minPeriodHours) {
            newErrors.minPeriodHours = 'Minimal Periode harus diisi.';
            isValid = false;
        } else if (isNaN(Number(minPeriodHours)) || Number(minPeriodHours) < 0) {
            newErrors.minPeriodHours = 'Minimal Periode harus berupa angka positif.';
            isValid = false;
        }
        
        // --- Validasi untuk Stok Tersedia ---
        if (!stockAvailable) {
            newErrors.stockAvailable = 'Stok Tersedia harus diisi.';
            isValid = false;
        } else if (isNaN(Number(stockAvailable)) || Number(stockAvailable) < 0) {
            newErrors.stockAvailable = 'Stok Tersedia harus berupa angka non-negatif.';
            isValid = false;
        }
        // --- Akhir Validasi Stok Tersedia ---

        setErrors(newErrors);
        return isValid;
    };

    const handleSave = () => {
        if (validateForm()) {
            const formDataToSend = {
                name,
                price_per_hour: pricePerHour.replace(/\./g, ''),
                vcpu,
                ram,
                ssd,
                memory_gpu: memoryGpu,
                description,
                min_period_hours: Number(minPeriodHours),
                stock_available: Number(stockAvailable), // Sertakan stok tersedia
            };
            console.log('Data yang dikirim dari PackageForm:', formDataToSend);
            onSubmit(formDataToSend);
        }
    };

    useImperativeHandle(ref, () => ({
        validateForm: () => {
            const isValid = validateForm();
            if (isValid) {
                return {
                    name,
                    price_per_hour: pricePerHour.replace(/\./g, ''),
                    vcpu,
                    ram,
                    ssd,
                    memory_gpu: memoryGpu,
                    description,
                    min_period_hours: Number(minPeriodHours),
                    stock_available: Number(stockAvailable), // Sertakan stok tersedia
                };
            }
            return false;
        },
        resetForm: () => {
            setName('');
            setPricePerHour('');
            setVcpu('');
            setRam('');
            setSsd('');
            setMemoryGpu('');
            setDescription('');
            setMinPeriodHours('');
            setStockAvailable('0'); // Reset stok
            setErrors({});
        },
    }));

    return (
        <div className="bg-white rounded px-8 pt-6 pb-8 mb-4 text-left">
            {[
                { label: 'Nama Paket', id: 'name', value: name, setter: setName, errorKey: 'name', placeholder: 'Nama Paket' },
                { label: 'Harga per Jam (Rp)', id: 'pricePerHour', value: pricePerHour, setter: (val) => {
                    const raw = val.replace(/\D/g, '').slice(0, 8);
                    const formatted = new Intl.NumberFormat('id-ID').format(raw);
                    setPricePerHour(formatted);
                }, errorKey: 'pricePerHour', placeholder: 'Contoh: 100.000' },
                { label: 'vCPU', id: 'vcpu', value: vcpu, setter: setVcpu, errorKey: 'vcpu', placeholder: 'vCPU' },
                { label: 'RAM', id: 'ram', value: ram, setter: setRam, errorKey: 'ram', placeholder: 'RAM' },
                { label: 'SSD', id: 'ssd', value: ssd, setter: setSsd, errorKey: 'ssd', placeholder: 'SSD' },
                { label: 'Memory GPU', id: 'memoryGpu', value: memoryGpu, setter: setMemoryGpu, errorKey: 'memoryGpu', placeholder: 'GPU Memory' },
                { label: 'Minimal Periode (Jam)', id: 'minPeriodHours', value: minPeriodHours, setter: setMinPeriodHours, errorKey: 'minPeriodHours', type: 'number', placeholder: 'Minimal jam sewa' },
                { label: 'Stok Tersedia', id: 'stockAvailable', value: stockAvailable, setter: setStockAvailable, errorKey: 'stockAvailable', type: 'number', placeholder: 'Jumlah unit GPU yang tersedia' } // Tambahkan field stok
            ].map(({ label, id, value, setter, errorKey, placeholder, type = 'text' }) => (
                <div className="mb-4" key={id}>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={id}>
                        {label}
                    </label>
                    <input
                        id={id}
                        type={type}
                        placeholder={placeholder}
                        value={value}
                        onChange={(e) => {
                            setter(e.target.value);
                            setErrors(prev => ({ ...prev, [errorKey]: '' }));
                        }}
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors[errorKey] ? 'border-red-500' : ''}`}
                    />
                    {errors[errorKey] && <p className="text-red-500 text-xs italic">{errors[errorKey]}</p>}
                </div>
            ))}
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                    Deskripsi
                </label>
                <textarea
                    id="description"
                    placeholder="Deskripsi paket (opsional)"
                    value={description}
                    onChange={(e) => {
                        setDescription(e.target.value);
                        setErrors(prev => ({ ...prev, description: '' }));
                    }}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    rows="4"
                />
            </div>
        </div>
    );
});

PackageForm.displayName = 'PackageForm';

export default PackageForm;