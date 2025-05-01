-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Waktu pembuatan: 01 Bulan Mei 2025 pada 11.59
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `gpu_rental`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `access_log`
--

CREATE TABLE `access_log` (
  `id` int(11) NOT NULL,
  `ip` varchar(45) NOT NULL,
  `user_agent` text DEFAULT NULL,
  `endpoint` varchar(255) DEFAULT NULL,
  `accessed_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `access_log`
--

INSERT INTO `access_log` (`id`, `ip`, `user_agent`, `endpoint`, `accessed_at`) VALUES
(1, '::1', 'PostmanRuntime/7.43.3', '/api/admin/stats', '2025-04-25 21:34:40'),
(2, '::1', 'PostmanRuntime/7.43.3', '/api/admin/stats', '2025-04-25 21:34:44'),
(3, '::1', 'PostmanRuntime/7.43.3', '/api/admin/stats', '2025-04-25 21:35:13'),
(4, '::1', 'PostmanRuntime/7.43.3', '/api/admin/stats', '2025-04-25 21:35:18'),
(5, '::1', 'PostmanRuntime/7.43.3', '/api/admin/stats', '2025-04-25 21:49:34'),
(6, '::1', 'PostmanRuntime/7.43.3', '/api/admin/stats', '2025-04-25 23:12:11'),
(7, '::1', 'PostmanRuntime/7.43.3', '/api/admin/stats', '2025-04-27 15:11:53'),
(8, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 18:06:13'),
(9, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 18:06:13'),
(10, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 18:07:17'),
(11, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 18:07:17'),
(12, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 18:07:20'),
(13, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 18:07:20'),
(14, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 18:08:01'),
(15, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 18:08:01'),
(16, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 18:08:04'),
(17, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 18:08:04'),
(18, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 18:08:53'),
(19, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 18:08:53'),
(20, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 18:11:09'),
(21, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 18:11:09'),
(22, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 18:11:22'),
(23, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 18:11:22'),
(24, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 18:11:24'),
(25, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 18:11:24'),
(26, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 18:11:56'),
(27, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 18:11:56'),
(28, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 18:12:04'),
(29, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 18:12:04'),
(30, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 18:12:06'),
(31, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 18:12:06'),
(32, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 18:12:15'),
(33, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 18:12:15'),
(34, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 18:16:19'),
(35, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 18:16:20'),
(36, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 19:00:07'),
(37, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 19:00:07'),
(38, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 19:39:43'),
(39, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 19:39:43'),
(40, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 19:39:49'),
(41, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 19:39:49'),
(42, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 19:39:53'),
(43, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 19:39:53'),
(44, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 19:39:54'),
(45, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 19:39:54'),
(46, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 19:40:20'),
(47, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 19:40:20'),
(48, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 19:48:22'),
(49, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 19:48:22'),
(50, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 19:48:24'),
(51, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 19:48:24'),
(52, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 19:48:26'),
(53, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 19:48:26'),
(54, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 19:48:27'),
(55, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 19:48:27'),
(56, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 19:48:29'),
(57, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 19:48:29'),
(58, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 19:48:30'),
(59, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 19:48:30'),
(60, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 19:48:32'),
(61, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 19:48:32'),
(62, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 19:48:34'),
(63, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 19:48:34'),
(64, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 19:49:42'),
(65, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 19:49:42'),
(66, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 19:49:48'),
(67, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 19:49:49'),
(68, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 19:49:56'),
(69, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 19:49:56'),
(70, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 19:49:57'),
(71, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 19:49:57'),
(72, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 19:50:05'),
(73, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 19:50:05'),
(74, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 19:50:14'),
(75, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 19:50:14'),
(76, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 19:50:16'),
(77, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 19:50:16'),
(78, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 19:50:17'),
(79, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 19:50:18'),
(80, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 19:50:19'),
(81, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 19:50:19'),
(82, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 19:50:21'),
(83, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 19:50:21'),
(84, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 19:50:22'),
(85, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 19:50:22'),
(86, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 19:50:24'),
(87, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 19:50:24'),
(88, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 19:50:46'),
(89, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 19:50:46'),
(90, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 19:51:25'),
(91, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 19:51:25'),
(92, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 19:51:28'),
(93, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 19:51:28'),
(94, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 19:51:31'),
(95, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 19:51:31'),
(96, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 19:51:34'),
(97, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 19:51:34'),
(98, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 19:51:40'),
(99, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 19:51:40'),
(100, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 19:51:45'),
(101, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 19:51:45'),
(102, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 19:51:47'),
(103, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 19:51:47'),
(104, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 19:55:15'),
(105, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 19:55:15'),
(106, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 19:55:17'),
(107, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 19:55:17'),
(108, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 19:55:19'),
(109, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 19:55:19'),
(110, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 19:55:20'),
(111, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 19:55:20'),
(112, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 19:55:21'),
(113, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 19:55:22'),
(114, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 19:55:23'),
(115, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 19:55:23'),
(116, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 19:55:24'),
(117, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 19:55:24'),
(118, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 19:55:26'),
(119, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 19:55:26'),
(120, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 19:56:10'),
(121, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 19:56:11'),
(122, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 20:16:29'),
(123, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 20:16:29'),
(124, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 20:16:31'),
(125, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 20:16:31'),
(126, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 20:38:55'),
(127, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 20:38:55'),
(128, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 20:39:05'),
(129, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 20:39:05'),
(130, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 20:39:15'),
(131, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 20:39:15'),
(132, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 20:39:21'),
(133, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 20:39:21'),
(134, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 21:23:02'),
(135, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 21:23:02'),
(136, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 21:23:04'),
(137, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 21:23:04'),
(138, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 21:32:27'),
(139, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 21:32:27'),
(140, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 21:36:44'),
(141, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 21:36:44'),
(142, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 21:39:31'),
(143, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 21:39:31'),
(144, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 22:15:56'),
(145, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 22:15:56'),
(146, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 22:16:23'),
(147, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 22:16:23'),
(148, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 22:16:41'),
(149, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 22:16:41'),
(150, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 22:18:18'),
(151, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 22:18:18'),
(152, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 22:19:20'),
(153, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 22:19:20'),
(154, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 22:19:24'),
(155, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 22:19:24'),
(156, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 22:20:05'),
(157, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 22:20:05'),
(158, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 22:28:11'),
(159, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 22:28:11'),
(160, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 22:44:38'),
(161, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 22:44:38'),
(162, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 22:59:32'),
(163, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 22:59:32'),
(164, '::1', 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Mobile Safari/537.36', '/api/admin/stats', '2025-04-27 23:07:02'),
(165, '::1', 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Mobile Safari/537.36', '/api/admin/stats', '2025-04-27 23:07:02'),
(166, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-27 23:11:01'),
(167, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 09:37:13'),
(168, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 09:37:13'),
(169, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 09:39:35'),
(170, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 09:41:15'),
(171, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 09:41:16'),
(172, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 09:41:20'),
(173, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 09:41:20'),
(174, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 09:43:41'),
(175, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 09:43:41'),
(176, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 09:57:44'),
(177, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 09:57:44'),
(178, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 09:58:30'),
(179, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 09:58:30'),
(180, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 10:01:11'),
(181, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 10:01:11'),
(182, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 10:23:17'),
(183, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 10:23:17'),
(184, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 10:23:25'),
(185, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 10:23:25'),
(186, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 10:24:06'),
(187, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 10:24:06'),
(188, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 10:25:01'),
(189, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 10:25:01'),
(190, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 10:36:23'),
(191, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 10:36:23'),
(192, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 10:37:37'),
(193, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 10:37:37'),
(194, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 11:13:22'),
(195, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 11:13:22'),
(196, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 11:13:27'),
(197, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 11:13:27'),
(198, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 11:14:45'),
(199, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 11:14:45'),
(200, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 11:15:05'),
(201, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 11:15:05'),
(202, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 11:17:21'),
(203, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 11:17:21'),
(204, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 11:17:53'),
(205, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 11:17:53'),
(206, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 11:19:40'),
(207, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 11:19:40'),
(208, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 11:19:44'),
(209, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 11:19:44'),
(210, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 11:20:33'),
(211, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 11:20:33'),
(212, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 11:20:40'),
(213, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 11:20:40'),
(214, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 11:21:02'),
(215, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 11:21:02'),
(216, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 11:22:16'),
(217, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 11:22:16'),
(218, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 11:22:24'),
(219, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 11:22:25'),
(220, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 11:22:28'),
(221, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 11:22:28'),
(222, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 11:40:55'),
(223, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 11:40:55'),
(224, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 11:41:00'),
(225, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 11:41:00'),
(226, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 11:50:04'),
(227, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 11:50:04'),
(228, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 11:51:55'),
(229, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 11:51:55'),
(230, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 11:53:05'),
(231, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 11:53:05'),
(232, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 11:53:18'),
(233, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 11:53:18'),
(234, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 11:53:38'),
(235, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 11:53:38'),
(236, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 11:55:41'),
(237, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 11:55:41'),
(238, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 11:55:44'),
(239, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 11:55:44'),
(240, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 11:58:45'),
(241, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 11:58:45'),
(242, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 11:59:56'),
(243, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 11:59:56'),
(244, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 12:01:05'),
(245, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 12:01:05'),
(246, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 12:01:25'),
(247, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 12:01:25'),
(248, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 12:01:57'),
(249, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 12:01:57'),
(250, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 12:03:02'),
(251, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 12:03:02'),
(252, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 12:08:11'),
(253, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 12:08:11'),
(254, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 12:08:12'),
(255, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 12:08:12'),
(256, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 12:12:29'),
(257, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 12:12:29'),
(258, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 12:12:43'),
(259, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 12:12:43'),
(260, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 12:33:43'),
(261, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 12:33:43'),
(262, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 12:34:17'),
(263, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 12:34:17'),
(264, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 12:37:48'),
(265, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 12:37:49'),
(266, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 12:45:10'),
(267, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 12:45:10'),
(268, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 12:46:03'),
(269, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 12:46:03'),
(270, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 12:46:16'),
(271, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 12:46:16'),
(272, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 12:46:26'),
(273, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 12:46:26'),
(274, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 12:46:36'),
(275, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 12:46:36'),
(276, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 12:46:40'),
(277, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 12:46:40'),
(278, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 12:46:45'),
(279, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 12:46:45'),
(280, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 12:46:50'),
(281, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 12:46:50'),
(282, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 12:48:38'),
(283, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 12:48:39'),
(284, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 12:50:28'),
(285, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 12:50:28'),
(286, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 12:52:15'),
(287, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 12:52:15'),
(288, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 12:56:59'),
(289, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 12:56:59'),
(290, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 12:57:26'),
(291, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 12:57:26'),
(292, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 12:57:32'),
(293, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 12:57:32'),
(294, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 12:57:36'),
(295, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 12:57:36'),
(296, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 12:59:09'),
(297, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 12:59:09'),
(298, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 13:00:00'),
(299, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 13:00:00'),
(300, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 13:02:39'),
(301, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 13:02:39'),
(302, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 13:04:01'),
(303, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 13:04:01'),
(304, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 13:04:58'),
(305, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 13:04:58'),
(306, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 13:05:05'),
(307, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 13:05:05'),
(308, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 13:07:11'),
(309, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 13:07:11'),
(310, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 13:07:23'),
(311, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 13:07:23'),
(312, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 13:09:59'),
(313, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 13:09:59'),
(314, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 13:13:23'),
(315, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 13:13:23');
INSERT INTO `access_log` (`id`, `ip`, `user_agent`, `endpoint`, `accessed_at`) VALUES
(316, '::1', 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Mobile Safari/537.36', '/api/admin/stats', '2025-04-28 13:14:32'),
(317, '::1', 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Mobile Safari/537.36', '/api/admin/stats', '2025-04-28 13:14:32'),
(318, '::1', 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Mobile Safari/537.36', '/api/admin/stats', '2025-04-28 13:16:25'),
(319, '::1', 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Mobile Safari/537.36', '/api/admin/stats', '2025-04-28 13:16:26'),
(320, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 13:17:49'),
(321, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 13:17:49'),
(322, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 13:20:22'),
(323, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 13:20:22'),
(324, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 13:20:34'),
(325, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 13:20:34'),
(326, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 13:25:27'),
(327, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 13:25:27'),
(328, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 13:38:32'),
(329, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 13:38:33'),
(330, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 15:32:37'),
(331, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 15:32:37'),
(332, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 15:52:40'),
(333, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 15:52:40'),
(334, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 15:55:59'),
(335, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 15:55:59'),
(336, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 15:56:17'),
(337, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 15:56:17'),
(338, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 15:56:20'),
(339, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 15:56:20'),
(340, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 15:56:24'),
(341, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 15:56:24'),
(342, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 15:56:25'),
(343, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 15:56:25'),
(344, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 15:56:33'),
(345, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 15:56:33'),
(346, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 15:56:38'),
(347, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 15:56:38'),
(348, '::1', 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Mobile Safari/537.36', '/api/admin/stats', '2025-04-28 16:28:58'),
(349, '::1', 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Mobile Safari/537.36', '/api/admin/stats', '2025-04-28 16:28:59'),
(350, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 16:30:15'),
(351, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 16:30:15'),
(352, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 16:30:20'),
(353, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 16:30:20'),
(354, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 16:32:16'),
(355, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 16:32:16'),
(356, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 16:35:52'),
(357, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 16:35:52'),
(358, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 16:35:56'),
(359, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 16:35:56'),
(360, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 16:36:07'),
(361, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 16:36:07'),
(362, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 16:36:13'),
(363, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 16:36:13'),
(364, '::1', 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Mobile Safari/537.36', '/api/admin/stats', '2025-04-28 16:40:49'),
(365, '::1', 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Mobile Safari/537.36', '/api/admin/stats', '2025-04-28 16:40:49'),
(366, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 17:54:27'),
(367, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 17:54:27'),
(368, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 18:19:25'),
(369, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 18:19:26'),
(370, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 18:20:47'),
(371, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 18:20:47'),
(372, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 18:41:40'),
(373, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 18:41:40'),
(374, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 18:41:54'),
(375, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 18:41:54'),
(376, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 18:49:10'),
(377, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 18:49:10'),
(378, '::1', 'PostmanRuntime/7.43.3', '/api/admin/stats', '2025-04-28 18:53:35'),
(379, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 19:11:42'),
(380, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 19:11:42'),
(381, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 19:14:30'),
(382, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 19:14:30'),
(383, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 19:16:45'),
(384, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 19:16:45'),
(385, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 19:18:58'),
(386, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 19:18:58'),
(387, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 19:20:05'),
(388, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 19:20:06'),
(389, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 19:20:23'),
(390, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 19:20:23'),
(391, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 19:21:10'),
(392, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 19:21:10'),
(393, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 19:21:27'),
(394, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 19:21:27'),
(395, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 19:21:54'),
(396, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 19:21:54'),
(397, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 19:27:51'),
(398, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 19:27:51'),
(399, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 19:28:51'),
(400, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 19:28:51'),
(401, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 19:30:12'),
(402, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 19:30:12'),
(403, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 19:30:20'),
(404, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 19:30:20'),
(405, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 19:30:24'),
(406, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 19:30:25'),
(407, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 19:30:36'),
(408, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 19:30:36'),
(409, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 19:30:38'),
(410, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 19:30:38'),
(411, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 19:32:18'),
(412, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 19:32:18'),
(413, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 19:34:27'),
(414, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 19:34:27'),
(415, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 19:44:18'),
(416, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 19:44:19'),
(417, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 19:44:29'),
(418, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 19:44:29'),
(419, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 19:44:55'),
(420, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 19:44:55'),
(421, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 19:44:58'),
(422, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 19:44:59'),
(423, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 19:46:34'),
(424, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 19:46:35'),
(425, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 19:46:40'),
(426, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 19:46:40'),
(427, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 19:48:01'),
(428, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 19:48:01'),
(429, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 19:50:39'),
(430, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 19:50:39'),
(431, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 19:50:41'),
(432, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 19:50:41'),
(433, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 19:51:15'),
(434, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 19:51:16'),
(435, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 19:51:18'),
(436, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 19:51:18'),
(437, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 19:52:17'),
(438, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 19:52:19'),
(439, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 19:52:19'),
(440, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 19:52:29'),
(441, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 19:52:29'),
(442, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 19:52:32'),
(443, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 19:52:32'),
(444, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 19:53:25'),
(445, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 19:53:26'),
(446, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 19:53:28'),
(447, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 19:53:28'),
(448, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 19:53:53'),
(449, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 19:53:53'),
(450, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 19:54:37'),
(451, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 19:54:38'),
(452, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 19:54:40'),
(453, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 19:54:40'),
(454, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 19:55:21'),
(455, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 19:55:22'),
(456, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 19:55:23'),
(457, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 19:55:23'),
(458, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 19:59:17'),
(459, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 19:59:18'),
(460, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 19:59:44'),
(461, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 19:59:44'),
(462, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 20:06:15'),
(463, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 20:06:15'),
(464, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 20:08:50'),
(465, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 20:08:50'),
(466, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 20:15:50'),
(467, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 20:15:50'),
(468, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 20:20:23'),
(469, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 20:20:23'),
(470, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 20:20:35'),
(471, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 20:20:35'),
(472, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 20:21:42'),
(473, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 20:21:42'),
(474, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 20:21:57'),
(475, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 20:21:57'),
(476, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 20:23:24'),
(477, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 20:23:25'),
(478, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 20:23:31'),
(479, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 20:23:31'),
(480, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 20:24:34'),
(481, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 20:24:34'),
(482, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 20:24:37'),
(483, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 20:24:37'),
(484, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 20:24:44'),
(485, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 20:24:44'),
(486, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 20:25:12'),
(487, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 20:25:12'),
(488, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 20:25:46'),
(489, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 20:25:46'),
(490, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 20:25:49'),
(491, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 20:25:49'),
(492, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 20:25:51'),
(493, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 20:25:51'),
(494, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 21:17:38'),
(495, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 21:17:38'),
(496, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 21:17:56'),
(497, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 21:17:56'),
(498, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 21:27:52'),
(499, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 21:27:52'),
(500, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 21:28:43'),
(501, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 21:28:43'),
(502, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 22:51:55'),
(503, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 22:51:55'),
(504, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 22:51:57'),
(505, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 22:51:57'),
(506, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 23:05:51'),
(507, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 23:13:29'),
(508, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 23:13:29'),
(509, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 23:18:36'),
(510, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 23:18:36'),
(511, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 23:31:09'),
(512, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 23:31:09'),
(513, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 23:32:22'),
(514, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 23:32:22'),
(515, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 23:32:58'),
(516, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 23:32:58'),
(517, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 23:34:40'),
(518, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 23:34:40'),
(519, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 23:50:16'),
(520, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-28 23:50:16'),
(521, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-29 00:02:06'),
(522, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-29 00:02:06'),
(523, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-29 06:29:42'),
(524, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-29 06:29:42'),
(525, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-29 06:32:16'),
(526, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-29 06:32:16'),
(527, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-29 07:02:59'),
(528, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-29 07:02:59'),
(529, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-29 07:03:43'),
(530, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-29 07:03:43'),
(531, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-29 07:04:00'),
(532, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-29 07:04:00'),
(533, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-29 07:04:11'),
(534, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-29 07:04:11'),
(535, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-29 15:57:30'),
(536, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-29 15:57:30'),
(537, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-29 15:59:14'),
(538, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-29 15:59:14'),
(539, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-29 16:06:04'),
(540, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-29 16:06:04'),
(541, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-29 21:22:15'),
(542, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-29 21:22:15'),
(543, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-30 10:53:03'),
(544, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-30 10:53:03'),
(545, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-30 16:08:03'),
(546, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-30 16:08:03'),
(547, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-30 16:08:15'),
(548, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-30 16:08:15'),
(549, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-30 16:08:48'),
(550, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-04-30 16:08:48'),
(551, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-05-01 07:30:25'),
(552, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-05-01 07:30:25'),
(553, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-05-01 07:30:43'),
(554, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-05-01 07:30:43'),
(555, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-05-01 13:28:05'),
(556, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-05-01 13:28:06'),
(557, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-05-01 16:47:36'),
(558, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-05-01 16:47:36'),
(559, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-05-01 16:48:12'),
(560, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-05-01 16:48:13'),
(561, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-05-01 16:48:26'),
(562, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-05-01 16:48:26'),
(563, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-05-01 16:48:28'),
(564, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-05-01 16:48:28'),
(565, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-05-01 16:48:35'),
(566, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-05-01 16:48:35'),
(567, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-05-01 16:49:07'),
(568, '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '/api/admin/stats', '2025-05-01 16:49:07');

-- --------------------------------------------------------

--
-- Struktur dari tabel `gpu_packages`
--

CREATE TABLE `gpu_packages` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `price_per_hour` int(12) DEFAULT NULL,
  `vcpu` varchar(50) DEFAULT NULL,
  `ram` varchar(50) DEFAULT NULL,
  `min_period_days` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `gpu_packages`
--

INSERT INTO `gpu_packages` (`id`, `name`, `price_per_hour`, `vcpu`, `ram`, `min_period_days`, `created_at`, `updated_at`) VALUES
(3, 'GPU Premium', 1000, '8', '32GB', 5, '2025-04-27 14:25:25', '2025-04-27 14:25:25'),
(4, 'NVIDIA A100', 1500000, '7 UVc', '64', 1, '2025-04-27 14:25:25', '2025-04-27 14:25:25'),
(5, 'NVIDIA A100 - Basic', 3, '4 vCPU', '16 GB', 1, '2025-04-27 14:25:25', '2025-04-27 14:25:25'),
(6, 'NVIDIA A100 - Basic', 3, '4 vCPU', '16 GB', 1, '2025-04-27 14:25:25', '2025-04-27 14:25:25'),
(7, 'GPU Fortex', 10000000, '12', '12', 12, '2025-04-27 14:25:25', '2025-04-27 14:25:25'),
(12, 'GPU Garet', 2100000, '039123', '92103', 5, '2025-04-27 14:25:25', '2025-04-27 14:25:25'),
(13, 'GPU Yarin', 12321321, 'cpu', '8', 2, '2025-04-27 14:25:25', '2025-04-27 14:25:25'),
(16, 'GPU  Gaptek ', 100000, '2', '2', 2, '2025-04-27 14:25:25', '2025-04-27 14:25:25'),
(17, 'GPU  Gaptek ', 100000, '2', '2', 2, '2025-04-27 14:25:25', '2025-04-27 14:25:25'),
(33, 'Server NVIDIA-Fortex', 10000, '211VPC', '123', 2, '2025-04-28 16:17:33', '2025-04-29 00:03:28');

-- --------------------------------------------------------

--
-- Struktur dari tabel `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `message` text NOT NULL,
  `status` enum('unread','read') DEFAULT 'unread',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `message`, `status`, `created_at`) VALUES
(1, 30, 'Token aktif Anda adalah: abcd1234', 'read', '2025-04-29 14:31:36'),
(2, 30, 'Token aktif Anda adalah: abcd12jljflafdauo2134', 'unread', '2025-04-29 14:37:08'),
(3, 30, 'Token aktif Anda adalah: abcd12jljflafdauo2134', 'unread', '2025-04-29 14:41:36'),
(4, 30, 'Token aktif Anda adalah: abcd12', 'unread', '2025-04-30 00:17:27'),
(5, 30, 'Token aktif Anda adalah: abcd12213213', 'unread', '2025-04-30 00:46:45'),
(6, 30, 'Token aktif Anda adalah: abcd12213213', 'unread', '2025-04-30 00:56:51'),
(7, 30, 'Token aktif Anda adalah: abcd12213213', 'unread', '2025-04-30 01:53:47'),
(8, 30, 'Token aktif Anda adalah: abcd12213213', 'unread', '2025-04-30 01:55:53'),
(9, 30, 'Token aktif Anda adalah: abcd12213213', 'read', '2025-04-30 01:56:32'),
(10, 30, 'Token aktif Anda adalah: abcd12213213', 'read', '2025-04-30 01:56:52'),
(11, 30, 'Token aktif Anda adalah: abcd12213213', 'read', '2025-04-30 01:57:06'),
(12, 30, 'Token aktif Anda adalah: abcd12213213', 'read', '2025-04-30 01:59:03'),
(13, 30, 'Token aktif Anda adalah: abcd12213213', 'read', '2025-04-30 02:00:57'),
(14, 33, 'Token aktif Anda adalah: iojoijoji241321', 'read', '2025-04-30 03:53:16'),
(15, 30, 'Token aktif Anda adalah: abcd12213213', 'read', '2025-04-30 09:09:28');

-- --------------------------------------------------------

--
-- Struktur dari tabel `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `gpu_package_id` int(11) NOT NULL,
  `duration_days` int(11) NOT NULL,
  `total_cost` bigint(20) NOT NULL,
  `status` enum('pending_payment','pending_approval','approved','rejected','active','completed') DEFAULT 'pending_payment',
  `token` varchar(100) DEFAULT NULL,
  `start_date` datetime DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `gpu_token` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 0,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `gpu_package_id`, `duration_days`, `total_cost`, `status`, `token`, `start_date`, `end_date`, `created_at`, `gpu_token`, `is_active`, `updated_at`) VALUES
(6, 28, 6, 3, 180, 'rejected', NULL, NULL, NULL, '2025-04-25 14:54:28', '278a5490-041d-4887-bee1-f2c652a5993f', 1, NULL),
(7, 28, 5, 15, 900, 'pending_payment', NULL, NULL, NULL, '2025-04-25 16:29:21', NULL, 1, NULL),
(8, 28, 5, 15, 900, 'approved', 'dauifdaoiufoidafdaf', NULL, NULL, '2025-04-25 16:30:21', '2ad0a709-d8ae-4dd2-8982-74be2da16ac8', 0, '2025-04-28 16:13:34'),
(9, 28, 5, 15, 900, 'approved', '12830821fjdoaufdo', NULL, NULL, '2025-03-27 10:14:52', 'e506a542-7a47-4981-bee0-5277fc705750', 0, '2025-04-28 15:37:02'),
(10, 28, 6, 10, 600, 'pending_approval', NULL, NULL, NULL, '2025-04-28 03:24:02', NULL, 0, '2025-04-28 15:23:32'),
(11, 28, 6, 10, 600, 'rejected', NULL, NULL, NULL, '2025-04-28 04:13:01', NULL, 1, NULL),
(12, 28, 6, 10, 600, 'approved', 'jivzjvcoizjvioxvz', NULL, NULL, '2025-01-28 05:45:43', '34aef567-3683-46a8-ac08-40510df30c2a', 0, '2025-04-28 15:51:14'),
(13, 33, 7, 10, 2400000000, 'approved', NULL, NULL, NULL, '2025-04-28 11:34:08', 'e0eb68c3-2a30-45aa-9b0e-73d2dab23942', 1, '2025-04-29 23:40:00'),
(15, 33, 12, 10, 504000000, 'pending_payment', NULL, NULL, NULL, '2025-04-28 15:38:02', NULL, 1, NULL),
(16, 33, 12, 10, 504000000, 'approved', 'fdafdoafodafda', NULL, NULL, '2025-04-28 15:40:56', NULL, 0, '2025-04-29 07:39:30'),
(17, 33, 12, 10, 504000000, 'pending_payment', NULL, NULL, NULL, '2025-04-29 01:43:56', NULL, 1, NULL),
(18, 33, 3, 10, 240000, 'approved', 'ijljiljl', NULL, NULL, '2025-04-29 01:59:49', '03e25b4e-d8c2-4a16-80f2-cf71caf58a36', 1, '2025-04-29 09:06:35'),
(19, 33, 12, 8, 403200000, 'pending_payment', NULL, NULL, NULL, '2025-04-29 02:27:52', NULL, 1, NULL),
(20, 33, 13, 2, 591423408, 'approved', NULL, NULL, NULL, '2025-04-29 02:30:17', '769d79c3-7dbd-4fb7-b731-e3ed2c7378c9', 1, '2025-04-29 23:49:52'),
(35, 33, 3, 5, 120000, 'approved', 'iojoijoji241321', NULL, NULL, '2025-04-29 06:58:43', '9ff3c352-617b-44f1-b652-9bb9f7591d35', 1, '2025-04-30 01:53:41'),
(38, 33, 3, 5, 120000, 'pending_approval', NULL, NULL, NULL, '2025-04-29 07:19:34', NULL, 0, '2025-04-29 07:19:56'),
(39, 33, 3, 5, 120000, 'pending_approval', NULL, NULL, NULL, '2025-04-29 08:57:03', NULL, 0, '2025-04-29 08:57:11'),
(40, 30, 7, 12, 2880000000, 'approved', 'abcd12213213', NULL, NULL, '2025-04-29 14:21:35', '9afc0d81-28d9-4bb1-9ddb-9e2fe1244aa4', 1, '2025-04-30 00:56:44'),
(41, 33, 3, 5, 120000, 'pending_approval', NULL, NULL, NULL, '2025-04-30 02:31:56', NULL, 0, '2025-04-30 02:32:04'),
(42, 30, 3, 5, 120000, 'pending_payment', NULL, NULL, NULL, '2025-04-30 11:48:27', NULL, 0, NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `password_resets`
--

CREATE TABLE `password_resets` (
  `id` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `token` varchar(255) NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `password_resets`
--

INSERT INTO `password_resets` (`id`, `email`, `token`, `expires_at`, `created_at`) VALUES
(1, 'tryusnita8105@gmail.com', 'faca6d481319d9d31be45b389049ebaef42abfe22d197711e6de6e0320125249', '2025-04-29 21:14:47', '2025-04-29 13:14:47'),
(2, 'tryusnita8105@gmail.com', 'f8047766ac2a04f65e96ac8b5f278942e9f2270fd131b9e1e7e3f4776f0737e2', '2025-04-29 21:16:35', '2025-04-29 13:16:35'),
(3, 'tryusnita8105@gmail.com', '7813b8542c3e3d6089998025f60bbfd9ce8051994d525ac2c260e56274255f65', '2025-04-29 21:18:30', '2025-04-29 13:18:30'),
(4, 'tryusnita8105@gmail.com', 'f99415bcc1e742efd3b01b3a13885f6c985b1eb67adb267f8c333c70fafcacfe', '2025-04-29 21:21:57', '2025-04-29 13:21:57'),
(8, 'akhtarfaiza23@gmail.com', '4b93f9e987ec5e4b90ac6636f55e2d5677af5cc48f250c82ca5dea7864c6cc21', '2025-04-30 11:04:07', '2025-04-30 03:04:07'),
(9, 'akhtarfaiza23@gmail.com', 'a8b2ef64887cc75d3ecc5d018a4bf0362ccc095f32d7c1ffb54dcdfb289cad0e', '2025-04-30 11:07:56', '2025-04-30 03:07:56');

-- --------------------------------------------------------

--
-- Struktur dari tabel `payments`
--

CREATE TABLE `payments` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `proof_url` varchar(255) NOT NULL,
  `status` enum('pending','verified','rejected') DEFAULT 'pending',
  `verified_by` int(11) DEFAULT NULL,
  `verified_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `payments`
--

INSERT INTO `payments` (`id`, `order_id`, `proof_url`, `status`, `verified_by`, `verified_at`) VALUES
(1, 6, 'https://example.com/bukti/bukti1.png', 'rejected', 27, '2025-04-27 17:28:29'),
(2, 8, 'uploads/proofs/4c478c97-4d8a-4e9e-98eb-b07b66add770.jpg', 'verified', 27, '2025-04-27 18:59:52'),
(3, 9, 'uploads/proofs/bb2893ef-cc09-43e1-84d2-74f40955023d.jpg', 'verified', 27, '2025-04-27 17:34:17'),
(4, 10, 'uploads/proofs/de6e6acd-08f4-47e3-bd24-264dbe791138.png', 'rejected', 27, '2025-04-28 11:12:41'),
(5, 11, 'uploads/proofs/64f2da2f-b420-49bf-b709-50702ee01087.png', 'rejected', 27, '2025-04-28 11:17:25'),
(6, 12, 'uploads/proofs/5aea7ff0-b93a-4b2b-83a3-bc0779981c6f.jpeg', 'verified', 27, '2025-04-28 22:24:21'),
(7, 16, 'uploads/proofs/5a0e1249-8ce9-4830-ad34-96f95ee06182.jpeg', 'verified', 27, '2025-04-28 22:45:51'),
(8, 18, 'uploads/proofs/75f2bb63-230a-45db-9f46-659f4b3f52b7.png', 'verified', 27, '2025-04-29 15:57:47'),
(10, 35, 'uploads/proofs/f707915c-0560-4ccd-8fb0-4d805776dcfd.png', 'verified', 27, '2025-04-30 06:32:21'),
(11, 38, 'uploads/proofs/c43fc96f-f9a6-43c9-adaf-4d0fbe3d40b8.png', 'pending', NULL, NULL),
(12, 39, 'uploads/proofs/e5c15da8-fa7c-4d34-a729-ec31d6e589f6.png', 'pending', NULL, NULL),
(13, 20, 'uploads/proofs/f2b071de-7f90-4bbd-aa2e-70ea00b82046.png', 'verified', 27, '2025-04-30 06:49:52'),
(14, 13, 'uploads/proofs/a89d700f-6ceb-464e-9c09-27f3c0981d93.png', 'verified', 27, '2025-04-30 06:39:59'),
(16, 40, 'uploads/proofs/fe14dee2-7962-4a2f-842f-5fcf04e1a195.jpeg', 'verified', 27, '2025-04-29 21:22:58'),
(18, 41, 'uploads/proofs/2d9c5a11-dc7d-416e-8670-069b08005063.png', 'pending', NULL, NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `role` enum('user','admin') DEFAULT 'user',
  `phone` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `phone`, `created_at`) VALUES
(25, 'Admin', 'admin@example.com', 'hashed_password_here', 'admin', NULL, '2025-04-25 14:54:28'),
(26, 'User A', 'usera@example.com', 'hashed_password_here', 'user', NULL, '2025-04-25 14:54:28'),
(27, 'Test User21', 'admin2@test.com', '$2b$10$JznyWlXZNVGQrKH0rqnIyOxzG4BIPGwpgvPEvHca54GNnEC5y9US2', 'admin', '081234567891', '2025-04-25 16:02:25'),
(28, 'Test User', 'newuser2@test.com', '$2b$10$sle3H2cuEa4Gmh1enhcIB.cdunn3WVWXcfIBUdnlMUTBOighAIE.C', 'user', '08123456789', '2025-04-25 16:15:48'),
(29, 'admin_qc_bm@14112019.kita', 'user3328@gmail.com', '$2b$10$5qWM6mBwkpAk4mx8vvyixeg/M9nuziQevyCOenrJNuyWuejVtgw32', 'user', '218308213121301', '2025-04-26 13:09:10'),
(30, 'Rizki Maulana', 'akhtarfaiza23@gmail.com', '$2b$10$QoZ6j8IABKJeAZpZajenyu9pB4yzqtaTcNEzJjieoW43W5eNtbea6', 'user', '08123456789', '2025-04-26 14:06:35'),
(31, 'Nama Baru 2', 'tryusnita8105@gmail.com', '$2b$10$RXmtxlbLC58X7gKrpilHPeiWMx.PZjMvsvm9VjUbfjytmwyAcCtUG', 'user', '081234567890', '2024-04-24 14:15:11'),
(32, 'faul', 'faul@gmail.com', '$2b$10$YAi8j1mH4ToqjXWn/kPy7.Q.vzv5JlgK/Fr0JWj9N7m3Rsr.pm0CO', 'user', '218308210382103', '2025-04-26 14:20:41'),
(33, 'User Panjang Saja', 'userpanjang@test.com', '$2b$10$Jg7yqenNL1I7BIa.PEJjzuhsf8fyc1rJO9cGkVkCgjF0UlmRf9AOK', 'user', '321038021830', '2025-04-28 11:33:21'),
(34, 'usertest1', 'usertest1@gmail.com', '$2b$10$wA1NCisOcrqM8O.3Oze2g.BLuOFWQtrGic5lChN81MYxE8ktD1bbW', 'user', '083201830213212', '2025-04-28 23:33:14');

-- --------------------------------------------------------

--
-- Struktur dari tabel `visitors`
--

CREATE TABLE `visitors` (
  `id` int(11) NOT NULL,
  `visit_date` date NOT NULL,
  `visit_count` int(10) UNSIGNED DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `visitors`
--

INSERT INTO `visitors` (`id`, `visit_date`, `visit_count`, `created_at`, `updated_at`) VALUES
(1, '2025-04-30', 75, '2025-04-30 08:50:56', '2025-04-30 23:42:46'),
(77, '2025-05-01', 18, '2025-05-01 00:30:01', '2025-05-01 09:50:46');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `access_log`
--
ALTER TABLE `access_log`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `gpu_packages`
--
ALTER TABLE `gpu_packages`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indeks untuk tabel `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `gpu_package_id` (`gpu_package_id`);

--
-- Indeks untuk tabel `password_resets`
--
ALTER TABLE `password_resets`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `verified_by` (`verified_by`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `email_2` (`email`);

--
-- Indeks untuk tabel `visitors`
--
ALTER TABLE `visitors`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_visit_date` (`visit_date`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `access_log`
--
ALTER TABLE `access_log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=569;

--
-- AUTO_INCREMENT untuk tabel `gpu_packages`
--
ALTER TABLE `gpu_packages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT untuk tabel `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT untuk tabel `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT untuk tabel `password_resets`
--
ALTER TABLE `password_resets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT untuk tabel `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT untuk tabel `visitors`
--
ALTER TABLE `visitors`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=95;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Ketidakleluasaan untuk tabel `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`gpu_package_id`) REFERENCES `gpu_packages` (`id`);

--
-- Ketidakleluasaan untuk tabel `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  ADD CONSTRAINT `payments_ibfk_2` FOREIGN KEY (`verified_by`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
