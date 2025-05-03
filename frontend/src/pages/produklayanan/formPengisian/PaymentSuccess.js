import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircleIcon, InformationCircleIcon, ListBulletIcon } from '@heroicons/react/24/solid';
import { jsPDF } from 'jspdf';
import { Download } from 'lucide-react';
import QRCode from 'qrcode';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import Swal from 'sweetalert2';
import loadingGif from '../../../assets/GIF/loading.gif';
import uskLogo from '../../../assets/usk.png';

const PaymentSuccess = ({ orderResult, gpuPackage, durationHours, paymentProof }) => {
    const navigate = useNavigate();
    const currentUser = JSON.parse(localStorage.getItem('user'));

    const compressImage = (dataUrl, targetWidth, quality = 0.8, grayscale = false) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = dataUrl;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const scaleFactor = targetWidth / img.width;
                canvas.width = targetWidth;
                canvas.height = img.height * scaleFactor;
                const ctx = canvas.getContext('2d');
                ctx.imageSmoothingQuality = 'high';
                if (grayscale) {
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const data = imageData.data;
                    for (let i = 0; i < data.length; i += 4) {
                        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                        data[i] = data[i + 1] = data[i + 2] = avg;
                    }
                    ctx.putImageData(imageData, 0, 0);
                } else {
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                }
                resolve(canvas.toDataURL('image/jpeg', quality));
            };
            img.onerror = reject;
        });
    };

    const generateQRCode = (text) => {
        return new Promise((resolve, reject) => {
            QRCode.toCanvas(text, {
                width: 200,
                margin: 2,
                errorCorrectionLevel: 'H',
                color: {
                    dark: '#000000',
                    light: '#ffffff'
                }
            }, (err, canvas) => {
                if (err) reject(err);
                else resolve(canvas.toDataURL('image/png'));
            });
        });
    };

    const handleDownloadInvoice = async () => {
        const swalInstance = Swal.fire({
            title: '<span style="font-size: 1rem;">Membuat Invoice...</span>',
            html: `<div style="display: flex; justify-content: center;"><img src="${loadingGif}" alt="Loading" width="360"></div>`,
            showConfirmButton: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
                // Memastikan GIF tetap animasi
                const img = Swal.getImage();
                img.src = loadingGif;
            }
        });

        try {
            // Beri waktu untuk browser render modal
            await new Promise(resolve => setTimeout(resolve, 50));

            const pdf = new jsPDF({
                unit: 'mm',
                format: 'a4',
                compress: true
            });

            const pageWidth = pdf.internal.pageSize.getWidth();
            const margin = 15;
            let y = margin;
            const logoHeight = 25;
            const logoWidth = 25;

            // Header
            pdf.addImage(uskLogo, 'PNG', margin, y, logoWidth, logoHeight);
            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(18);
            pdf.setTextColor(15, 46, 83);
            pdf.text("RENT GPU USK", margin + logoWidth + 5, y + 12);
            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'normal');
            pdf.text("JL. Syech Abdurrauf No.3, Kopelma Darussalam", margin + logoWidth + 5, y + 18);
            pdf.text("support_gpu@cs.usk.ac.id | +62 851 0142 0565", margin + logoWidth + 5, y + 23);
            pdf.setFontSize(12);
            const invoiceNumber = `INVOICE #${orderResult?.orderId}`;
            const invoiceNumberWidth = pdf.getTextWidth(invoiceNumber);
            pdf.text(invoiceNumber, pageWidth - margin - invoiceNumberWidth, y + 10, { align: 'left' });
            pdf.setFontSize(9);
            const formattedDate = format(new Date(), 'dd MMMMyyyy', { locale: id });
            const dateWidth = pdf.getTextWidth(formattedDate);
            pdf.text(formattedDate, pageWidth - margin - dateWidth, y + 16, { align: 'left' });
            y = 45;
            pdf.setDrawColor(200);
            pdf.setLineWidth(0.2);
            pdf.line(margin, y, pageWidth - margin, y);
            y += 8;

            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'bold');
            pdf.text('PELANGGAN:', margin, y);
            pdf.setFont('helvetica', 'normal');

            // Ambil data pengguna
            const customerName = currentUser?.name || '-';
            const customerEmail = currentUser?.email || '-';
            const customerPhone = currentUser?.phone || '-';

            // Format biodata
            const startX = margin + 28; // Posisi kolom nilai
            y += 8; // Adjust posisi vertikal
            pdf.setFont('helvetica', 'bold');
            pdf.text('Nama   :', margin + 2, y);
            pdf.setFont('helvetica', 'normal');
            pdf.text(customerName, startX, y);

            y += 5;
            pdf.setFont('helvetica', 'bold');
            pdf.text('Email   :', margin + 2, y);
            pdf.setFont('helvetica', 'normal');
            pdf.text(customerEmail, startX, y);

            y += 5;
            pdf.setFont('helvetica', 'bold');
            pdf.text('No. HP :', margin + 2, y);
            pdf.setFont('helvetica', 'normal');
            pdf.text(customerPhone, startX, y);

            y += 8;

            // Tabel item
            const headers = ["Deskripsi", "Durasi", "Harga"];
            const colWidths = [80, 30, 40];
            const xStarts = [margin, margin + colWidths[0], pageWidth - margin - colWidths[2]];
            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(10);
            headers.forEach((header, i) => {
                const x = xStarts[i];
                pdf.text(header, x, y, { align: i === 2 ? 'right' : 'left' });
            });
            y += 7;
            pdf.setFont('helvetica', 'normal');
            const rows = [
                [
                    gpuPackage?.name,
                    `${durationHours} Jam`,
                    `Rp${orderResult?.totalCost?.toLocaleString('id-ID')}`
                ]
            ];
            rows.forEach(row => {
                row.forEach((cell, i) => {
                    const x = xStarts[i];
                    pdf.text(cell, x, y, { align: i === 2 ? 'right' : 'left' });
                });
                y += 6;
            });

            // Total
            pdf.setFont('helvetica', 'bold');
            pdf.line(margin, y, pageWidth - margin, y);
            y += 5;
            pdf.setFontSize(12);
            pdf.text("TOTAL", margin + colWidths[0] + colWidths[1] - 10, y, { align: 'right' });
            pdf.text(`Rp${orderResult?.totalCost?.toLocaleString('id-ID')}`, pageWidth - margin, y, { align: 'right' });
            y += 15;

            // Bukti pembayaran
            if (paymentProof) {
                const compressedProof = await compressImage(paymentProof, 500, 0.7);
                const imgProps = pdf.getImageProperties(compressedProof);
                const maxImageHeight = 120;
                let imgWidth = 180;
                let imgHeight = (imgProps.height * imgWidth) / imgProps.width;
                if (imgHeight > maxImageHeight) {
                    imgHeight = maxImageHeight;
                    imgWidth = (imgHeight * imgProps.width) / imgProps.height;
                }
                pdf.setFontSize(10);
                pdf.text("Bukti Pembayaran:", margin, y);
                pdf.addImage(compressedProof, 'JPEG', margin, y + 5, imgWidth, imgHeight);
                y += imgHeight + 15;
            }

            // QR Code
            const qrData = `USKGPU-Verifikasi:\nOrder ID: ${orderResult?.orderId}\nTotal: Rp${orderResult?.totalCost?.toLocaleString('id-ID')}\nTanggal: ${formattedDate}`;
            const qrImage = await generateQRCode(qrData);
            pdf.setFontSize(10);
            pdf.text("Verifikasi Digital:", pageWidth - 65, y + 5);
            pdf.addImage(qrImage, 'PNG', pageWidth - 65, y + 10, 30, 30);

            // Footer
            pdf.setFontSize(8);
            pdf.setTextColor(100);
            pdf.setFont('helvetica', 'italic'); // Set font menjadi italic
            const footerMargin = margin + -5; // Menambahkan jarak 10mm dari margin bawah
            pdf.text(
                'Dokumen ini sah secara elektronik sesuai UU ITE Pasal 5 Ayat 1',
                pageWidth / 2,
                pdf.internal.pageSize.getHeight() - footerMargin, // Menggunakan footerMargin
                { align: 'center' },
            );


            const userName = localStorage.getItem('userName') || 'user';
            pdf.save(`invoice_${customerName}_${orderResult.orderId}.pdf`);

            swalInstance.close();
        } catch (error) {
            swalInstance.close();
            Swal.fire({
                icon: 'error',
                title: 'Gagal Membuat Invoice',
                text: 'Terjadi kesalahan saat membuat invoice. Silakan coba lagi.',
            });
        }
    };

    return (
        <div className="shadow-md rounded-md p-6 border border-gray-200 bg-green-100 text-green-800">
            <div className="flex items-center mb-4">
                <CheckCircleIcon className="w-6 h-6 mr-2 text-green-600" />
                <h3 className="font-semibold text-xl">Pesanan Berhasil!</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
                <p><span className="font-semibold">Paket:</span> {gpuPackage?.name}</p>
                <p><span className="font-semibold">Durasi:</span> {durationHours} jam</p>
                <p><span className="font-semibold">ID Pesanan:</span> {orderResult?.orderId}</p>
                <p><span className="font-semibold">Biaya:</span> Rp {orderResult?.totalCost?.toLocaleString('id-ID')}</p>
            </div>
            <div className="flex items-start mb-6">
                <InformationCircleIcon className="w-5 h-5 mr-2 text-blue-600 mt-1" />
                <p className="text-sm text-gray-800">
                    Paket Anda akan segera diproses. Token akses akan dikirimkan melalui email setelah verifikasi pembayaran berhasil.
                </p>
            </div>
            <div className="flex gap-4">
                <button
                    onClick={() => navigate('/listorders')}
                    className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md shadow-md transition"
                >
                    <ListBulletIcon className="mr-2 h-5 w-5" />
                    Daftar Pesanan
                </button>
                <button
                    onClick={handleDownloadInvoice}
                    className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md shadow-md transition"
                >
                    <Download className="mr-2 h-5 w-5" />
                    Download Invoice
                </button>
            </div>
        </div>
    );
};

export default PaymentSuccess;