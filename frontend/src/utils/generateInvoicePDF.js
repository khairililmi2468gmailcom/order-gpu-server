import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import uskLogo from '../assets/usk.png';
import Swal from 'sweetalert2';
import loadingGif from '../assets/GIF/loading.gif';
import { DownloadIcon } from 'lucide-react';

// Fungsi kompresi gambar
const compressImage = async (url, targetWidth, quality = 0.8) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const img = await createImageBitmap(blob);

    const canvas = document.createElement('canvas');
    const scaleFactor = targetWidth / img.width;
    canvas.width = targetWidth;
    canvas.height = img.height * scaleFactor;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', quality);
};

export const generateOrderPDF = async (order, userName) => {
    // Inisialisasi SweetAlert di sini
    const swalInstance = Swal.fire({
        title: '<span style="font-size: 1rem;">Membuat Invoice...</span>',
        html: `<div style="display: flex; justify-content: center;"><img src="${loadingGif}" alt="Loading" width="360"></div>`,
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
            const img = Swal.getImage();
            if (img) {
                img.src = loadingGif;
            }
        }
    });

    // Beri waktu untuk browser merender loading
    try {
        await new Promise(resolve => setTimeout(resolve, 50));
        const doc = new jsPDF({
            unit: 'mm',
            format: 'a4',
            compress: true,
        });

        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 15;
        let y = margin;

        // Header
        const logoHeight = 25;
        const logoWidth = 25;

        // Tambahkan logo
        doc.addImage(uskLogo, 'PNG', margin, y, logoWidth, logoHeight);

        // Teks header
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(18);
        doc.setTextColor(15, 46, 83);
        doc.text('RENT GPU USK', margin + logoWidth + 5, y + 12);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text('JL. Syech Abdurrauf No.3, Kopelma Darussalam', margin + logoWidth + 5, y + 18);
        doc.text('support_gpu@cs.usk.ac.id | +62 851 0142 0565', margin + logoWidth + 5, y + 23);

        // Info invoice
        doc.setFontSize(12);
        const invoiceNumber = `INVOICE #${order.id}`;
        const invoiceNumberWidth = doc.getTextWidth(invoiceNumber);
        doc.text(invoiceNumber, pageWidth - margin - invoiceNumberWidth, y + 10);

        doc.setFontSize(9);
        // Perbaikan: 'dd MMMMstringProp' diganti menjadi 'dd MMMM yyyy'
        const formattedDate = format(new Date(order.created_at), 'dd MMMM yyyy', { locale: id });
        const dateWidth = doc.getTextWidth(formattedDate);
        doc.text(formattedDate, pageWidth - margin - dateWidth, y + 16);

        // Divider
        y = 45;
        doc.setDrawColor(200);
        doc.setLineWidth(0.2);
        doc.line(margin, y, pageWidth - margin, y);
        y += 8;

        // Info pelanggan (dalam fungsi generateOrderPDF)
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('PELANGGAN:', margin, y);
        doc.setFont('helvetica', 'normal');

        // Ambil data pengguna
        const customerName = userName?.name || order.user?.name || '-';
        const customerEmail = userName?.email || order.user?.email || '-';
        const customerPhone = userName?.phone || order.user?.phone || '-';

        // Format biodata
        const startX = margin + 28; // Posisi kolom nilai
        y += 8; // Adjust posisi vertikal

        doc.setFont('helvetica', 'bold');
        doc.text('Nama   :', margin + 2, y);
        doc.setFont('helvetica', 'normal');
        doc.text(customerName, startX, y);

        y += 5;
        doc.setFont('helvetica', 'bold');
        doc.text('Email   :', margin + 2, y);
        doc.setFont('helvetica', 'normal');
        doc.text(customerEmail, startX, y);

        y += 5;
        doc.setFont('helvetica', 'bold');
        doc.text('No. HP :', margin + 2, y);
        doc.setFont('helvetica', 'normal');
        doc.text(customerPhone, startX, y);

        y += 8; // Spasi setelah section pelanggan
        // Item pesanan
        const headers = ['Deskripsi', 'Durasi', 'Harga'];
        const colWidths = [80, 30, 40];
        const xStarts = [margin, margin + colWidths[0], pageWidth - margin - colWidths[2]];

        // Header tabel
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        headers.forEach((header, i) => {
            doc.text(header, xStarts[i], y, { align: i === 2 ? 'right' : 'left' });
        });
        y += 7;

        // Baris tabel
        doc.setFont('helvetica', 'normal');
        const rows = [
            [
                order.package_name,
                `${order.duration_hours} Jam`,
                `Rp${order.total_cost.toLocaleString('id-ID')}`,
            ],
        ];

        rows.forEach((row) => {
            row.forEach((cell, i) => {
                doc.text(cell, xStarts[i], y, { align: i === 2 ? 'right' : 'left' });
            });
            y += 6;
        });

        // Total
        doc.setFont('helvetica', 'bold');
        doc.line(margin, y, pageWidth - margin, y);
        y += 4;
        doc.setFontSize(12);
        doc.text('TOTAL', margin + colWidths[0] + colWidths[1] - 10, y, { align: 'right' });
        doc.text(`Rp${order.total_cost.toLocaleString('id-ID')}`, pageWidth - margin, y, { align: 'right' });
        y += 15;

        // Bukti pembayaran
        if (order.proof_url) {
            try {
                const proofUrl = `${process.env.REACT_APP_API_URL}/${order.proof_url}`;
                const compressedProof = await compressImage(proofUrl, 500);
                const imgProps = doc.getImageProperties(compressedProof);

                const maxImageHeight = 120;
                let imgWidth = 180;
                let imgHeight = (imgProps.height * imgWidth) / imgProps.width;

                if (imgHeight > maxImageHeight) {
                    imgHeight = maxImageHeight;
                    imgWidth = (imgHeight * imgProps.width) / imgProps.height;
                }

                doc.setFontSize(10);
                doc.text('Bukti Pembayaran:', margin, y);
                doc.addImage(compressedProof, 'JPEG', margin, y + 5, imgWidth, imgHeight);
                y += imgHeight + 10;
            } catch (error) {
                console.error('Gagal memuat bukti pembayaran:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Gagal memuat bukti pembayaran.',
                });
            }
        }

        // Kode QR
        const qrData = `USKGPU-Verifikasi:
ID: ${order.id}
Total: Rp${order.total_cost.toLocaleString('id-ID')}
Tanggal: ${formattedDate}`;

        const qrImage = await QRCode.toDataURL(qrData);
        doc.setFontSize(10);
        doc.text('Verifikasi Digital:', pageWidth - 65, y + 5);
        doc.addImage(qrImage, 'PNG', pageWidth - 65, y + 10, 30, 30);

        // Footer
        doc.setFontSize(8);
        doc.setTextColor(100);
        doc.setFont('helvetica', 'italic'); // Set font menjadi italic
        const footerMargin = margin + -5; // Menambahkan jarak 10mm dari margin bawah
        doc.text(
            'Dokumen ini sah secara elektronik sesuai UU ITE Pasal 5 Ayat 1',
            pageWidth / 2,
            doc.internal.pageSize.getHeight() - footerMargin, // Menggunakan footerMargin
            { align: 'center' },
        );

        const blob = doc.output('blob');
        const url = URL.createObjectURL(blob);

        // Simpan file
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice_${customerName}_${order.id}.pdf`;
        document.body.appendChild(a);
        a.click();

        // Bersihkan
        URL.revokeObjectURL(url);
        document.body.removeChild(a);

        Swal.close(); // Tutup setelah download selesai

    } catch (error) {
        console.error('Gagal membuat invoice:', error);
        Swal.fire({
            icon: 'error',
            title: 'Gagal Membuat Invoice',
            text: 'Terjadi kesalahan saat membuat invoice. Mohon coba lagi.',
        });
    }
};

const InvoiceButton = ({ order, userName }) => {
    const handleClick = () => {
        generateOrderPDF(order, userName);
    };

    return (
        <button
            onClick={handleClick}
            className="text-purple-500 hover:text-purple-700 focus:outline-none flex items-center"
        >
            <DownloadIcon className="h-5 w-5 inline-block mr-1" /> Unduh PDF
        </button>
    );
};

export default InvoiceButton;
