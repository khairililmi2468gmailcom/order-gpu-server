
import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';

const PackageForm = forwardRef((props, ref) => {
    const { initialPackage, onSubmit, onCancel } = props;
    const [name, setName] = useState('');
    const [pricePerHour, setPricePerHour] = useState('');
    const [vcpu, setVcpu] = useState('');
    const [ram, setRam] = useState('');
    const [minPeriodDays, setMinPeriodDays] = useState('');

    const [nameError, setNameError] = useState('');
    const [pricePerHourError, setPricePerHourError] = useState('');
    const [vcpuError, setVcpuError] = useState('');
    const [ramError, setRamError] = useState('');
    const [minPeriodDaysError, setMinPeriodDaysError] = useState('');


    useEffect(() => {
        if (initialPackage) {
            setName(initialPackage.name || '');
            setPricePerHour(initialPackage.price_per_hour || '');
            setVcpu(initialPackage.vcpu || '');
            setRam(initialPackage.ram || '');
            setMinPeriodDays(initialPackage.min_period_days || '');
        } else {
            setName('');
            setPricePerHour('');
            setVcpu('');
            setRam('');
            setMinPeriodDays('');
        }
    }, [initialPackage]);

    const validateForm = () => {
        let isValid = true;
        let nameErrorMsg = '';
        let pricePerHourErrorMsg = '';
        let vcpuErrorMsg = '';
        let ramErrorMsg = '';
        let minPeriodDaysErrorMsg = '';

        if (!name.trim()) {
            nameErrorMsg = 'Nama Paket harus diisi.';
            isValid = false;
        } else if (name.length > 100) {
            nameErrorMsg = 'Nama Paket maksimal 100 karakter.';
            isValid = false;
        }
        setNameError(nameErrorMsg);

        if (!pricePerHour) {
            pricePerHourErrorMsg = 'Harga per Jam harus diisi.';
            isValid = false;
        } else if (isNaN(Number(pricePerHour)) || Number(pricePerHour) < 0) {
            pricePerHourErrorMsg = 'Harga per Jam harus berupa angka positif.';
            isValid = false;
        }
        setPricePerHourError(pricePerHourErrorMsg);

        if (vcpu && vcpu.length > 50) {
            vcpuErrorMsg = 'vCPU maksimal 50 karakter.';
            isValid = false;
        }
        setVcpuError(vcpuErrorMsg);

        if (ram && ram.length > 50) {
            ramErrorMsg = 'RAM maksimal 50 karakter.';
            isValid = false;
        }
        setRamError(ramErrorMsg);

        if(!minPeriodDays){
            minPeriodDaysErrorMsg ='Minimal Periode tidak boleh kosong'
            isValid = false;
        } else if (minPeriodDays && (isNaN(Number(minPeriodDays)) || Number(minPeriodDays) < 0)) {
            minPeriodDaysErrorMsg = 'Minimal Periode harus berupa angka positif.';
            isValid = false;
        }
        setMinPeriodDaysError(minPeriodDaysErrorMsg);

        setNameError(nameErrorMsg);
        setPricePerHourError(pricePerHourErrorMsg);
        setVcpuError(vcpuErrorMsg);
        setRamError(ramErrorMsg);
        setMinPeriodDaysError(minPeriodDaysErrorMsg);
        return isValid;
    };

    const handleSave = () => {
        if (validateForm()) {
            onSubmit({
                name,
                price_per_hour: pricePerHour,
                vcpu,
                ram,
                min_period_days: minPeriodDays,
            });
        }
    };

    useImperativeHandle(ref, () => ({
        validateForm: () => {
            const isValid = validateForm();
            if (isValid) {
                return {
                    name,
                    price_per_hour: pricePerHour,
                    vcpu,
                    ram,
                    min_period_days: minPeriodDays
                };
            }
            return false;
        },
    }));


    return (
        <div className="bg-white rounded px-8 pt-6 pb-8 mb-4 text-left">
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                    Nama Paket
                </label>
                <input
                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${nameError ? 'border-red-500' : ''}`}
                    id="name"
                    type="text"
                    placeholder="Nama Paket"
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value);
                        setNameError(''); // Clear error on input change
                    }}
                    required
                />
                {nameError && <p className="text-red-500 text-xs italic">{nameError}</p>}
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price_per_hour">
                    Harga per Jam (Rp)
                </label>
                <input
                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${pricePerHourError ? 'border-red-500' : ''}`}
                    id="price_per_hour"
                    type="text"
                    placeholder="Contoh: 100.000"
                    value={pricePerHour}
                    onChange={(e) => {
                        const rawValue = e.target.value.replace(/\D/g, ''); // Hapus semua selain angka
                        const formattedValue = new Intl.NumberFormat('id-ID').format(rawValue);
                        setPricePerHour(formattedValue);
                        setPricePerHourError('');
                    }}
                    required
                />
                {pricePerHourError && <p className="text-red-500 text-xs italic">{pricePerHourError}</p>}
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="vcpu">
                    vCPU
                </label>
                <input
                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${vcpuError ? 'border-red-500' : ''}`}
                    id="vcpu"
                    type="text"
                    placeholder="vCPU"
                    value={vcpu}
                    onChange={(e) => {
                        setVcpu(e.target.value);
                        setVcpuError('');
                    }}
                />
                {vcpuError && <p className="text-red-500 text-xs italic">{vcpuError}</p>}
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2 " htmlFor="ram">
                    RAM
                </label>
                <input
                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${ramError ? 'border-red-500' : ''}`}
                    id="ram"
                    type="text"
                    placeholder="RAM"
                    value={ram}
                    onChange={(e) => {
                        setRam(e.target.value);
                        setRamError('');
                    }}
                />
                {ramError && <p className="text-red-500 text-xs italic">{ramError}</p>}
            </div>
            <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="min_period_days">
                    Minimal Periode (Hari)
                </label>
                <input
                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${minPeriodDaysError ? 'border-red-500' : ''}`}
                    id="min_period_days"
                    type="number"
                    placeholder="Minimal Periode (Hari)"
                    value={minPeriodDays}
                    onChange={(e) => {
                        setMinPeriodDays(e.target.value);
                        setMinPeriodDaysError('');
                    }}
                    required
                />
                {minPeriodDaysError && <p className="text-red-500 text-xs italic">{minPeriodDaysError}</p>}
            </div>
        </div>
    );
});

PackageForm.displayName = 'PackageForm'; // Add this line

export default PackageForm;
