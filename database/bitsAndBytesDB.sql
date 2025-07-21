-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jul 21, 2025 at 03:12 PM
-- Server version: 11.8.2-MariaDB
-- PHP Version: 8.4.10

-- BITS & BYTES Video Game Store Database Schema 
DROP DATABASE IF EXISTS bitsAndBytesDB;
CREATE DATABASE bitsAndBytesDB;
USE bitsAndBytesDB;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bitsAndBytesDB`
--

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `order_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `stat_id` int(11) DEFAULT 1,
  `order_date` timestamp NULL DEFAULT current_timestamp(),
  `shipped_date` timestamp NULL DEFAULT NULL,
  `delivered_date` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`order_id`, `user_id`, `stat_id`, `order_date`, `shipped_date`, `delivered_date`, `created_at`, `updated_at`) VALUES
(1, 3, 4, '2022-01-15 02:30:00', '2022-01-17 06:20:00', '2022-01-20 08:45:00', '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(2, 4, 4, '2022-02-08 06:15:00', '2022-02-10 01:30:00', '2022-02-13 03:20:00', '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(3, 5, 4, '2022-02-20 08:45:00', '2022-02-22 05:15:00', '2022-02-25 07:30:00', '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(4, 6, 4, '2022-03-12 03:20:00', '2022-03-14 08:40:00', '2022-03-17 02:15:00', '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(5, 7, 4, '2022-03-25 05:45:00', '2022-03-27 03:30:00', '2022-03-30 06:20:00', '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(6, 3, 4, '2022-04-10 07:20:00', '2022-04-12 04:45:00', '2022-04-15 09:30:00', '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(7, 4, 4, '2022-05-05 01:30:00', '2022-05-07 06:15:00', '2022-05-10 08:45:00', '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(8, 5, 4, '2022-05-18 09:15:00', '2022-05-20 02:30:00', '2022-05-23 05:20:00', '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(9, 6, 4, '2022-06-02 04:40:00', '2022-06-04 07:25:00', '2022-06-07 03:45:00', '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(10, 7, 4, '2022-06-20 06:30:00', '2022-06-22 08:15:00', '2022-06-25 04:30:00', '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(11, 8, 4, '2022-07-08 02:15:00', '2022-07-10 05:45:00', '2022-07-13 07:20:00', '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(12, 9, 4, '2022-07-22 08:30:00', '2022-07-24 03:20:00', '2022-07-27 06:45:00', '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(13, 10, 4, '2022-08-05 05:20:00', '2022-08-07 07:40:00', '2022-08-10 09:15:00', '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(14, 11, 4, '2022-08-18 03:45:00', '2022-08-20 06:30:00', '2022-08-23 08:20:00', '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(15, 12, 4, '2022-09-02 07:30:00', '2022-09-04 04:15:00', '2022-09-07 06:40:00', '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(16, 13, 4, '2022-09-15 04:20:00', '2022-09-17 08:45:00', '2022-09-20 03:30:00', '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(17, 14, 4, '2022-10-01 06:45:00', '2022-10-03 05:20:00', '2022-10-06 07:45:00', '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(18, 15, 4, '2022-10-18 08:15:00', '2022-10-20 03:40:00', '2022-10-23 05:25:00', '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(19, 3, 4, '2022-11-05 02:30:00', '2022-11-07 06:20:00', '2022-11-10 08:45:00', '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(20, 4, 4, '2022-11-20 05:45:00', '2022-11-22 07:30:00', '2022-11-25 04:20:00', '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(21, 5, 4, '2022-12-01 07:20:00', '2022-12-03 03:45:00', '2022-12-06 06:30:00', '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(22, 6, 4, '2022-12-10 04:15:00', '2022-12-12 08:40:00', '2022-12-15 05:25:00', '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(23, 7, 4, '2022-12-20 06:30:00', '2022-12-22 04:15:00', '2022-12-27 07:45:00', '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(24, 8, 4, '2023-01-08 03:20:00', '2023-01-10 06:45:00', '2023-01-13 08:30:00', '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(25, 9, 4, '2023-01-22 07:45:00', '2023-01-24 04:30:00', '2023-01-27 06:15:00', '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(26, 10, 4, '2023-02-05 05:30:00', '2023-02-07 07:20:00', '2023-02-10 03:45:00', '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(27, 11, 4, '2023-02-18 08:15:00', '2023-02-20 05:40:00', '2023-02-23 07:25:00', '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(28, 12, 4, '2023-03-05 04:45:00', '2023-03-07 06:30:00', '2023-03-10 08:20:00', '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(29, 13, 4, '2023-03-20 06:20:00', '2023-03-22 03:45:00', '2023-03-25 05:30:00', '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(30, 14, 4, '2023-04-02 02:30:00', '2023-04-04 07:15:00', '2023-04-07 04:45:00', '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(31, 15, 4, '2023-04-18 08:45:00', '2023-04-20 05:20:00', '2023-04-23 07:40:00', '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(32, 3, 4, '2023-05-05 03:15:00', '2023-05-07 06:40:00', '2023-05-10 08:25:00', '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(33, 4, 4, '2023-05-22 05:50:00', '2023-05-24 07:30:00', '2023-05-27 04:15:00', '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(34, 5, 4, '2023-06-08 07:30:00', '2023-06-10 04:45:00', '2023-06-13 06:20:00', '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(35, 6, 4, '2023-06-25 04:20:00', '2023-06-27 08:15:00', '2023-06-30 05:45:00', '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(36, 7, 4, '2023-07-10 06:45:00', '2023-07-12 03:30:00', '2023-07-15 07:20:00', '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(37, 8, 4, '2023-07-28 08:20:00', '2023-07-30 05:45:00', '2023-08-02 07:30:00', '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(38, 9, 4, '2023-08-12 03:40:00', '2023-08-14 06:25:00', '2023-08-17 08:15:00', '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(39, 10, 4, '2023-08-30 05:25:00', '2023-09-01 07:40:00', '2023-09-04 04:30:00', '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(40, 11, 4, '2023-09-15 07:15:00', '2023-09-17 04:40:00', '2023-09-20 06:25:00', '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(41, 12, 4, '2023-10-02 04:30:00', '2023-10-04 08:15:00', '2023-10-07 05:45:00', '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(42, 13, 4, '2023-10-20 06:40:00', '2023-10-22 03:25:00', '2023-10-25 07:30:00', '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(43, 14, 4, '2023-11-05 08:25:00', '2023-11-07 05:40:00', '2023-11-10 07:15:00', '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(44, 15, 3, '2023-11-20 03:30:00', '2023-11-22 06:45:00', NULL, '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(45, 3, 3, '2023-12-05 05:45:00', '2023-12-07 08:20:00', NULL, '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(46, 4, 2, '2023-12-18 07:20:00', NULL, NULL, '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(47, 5, 4, '2023-12-22 04:15:00', '2023-12-24 07:30:00', '2023-12-28 06:20:00', '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(48, 6, 1, '2024-01-05 06:30:00', NULL, NULL, '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(49, 7, 2, '2024-01-12 08:45:00', NULL, NULL, '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(50, 8, 1, '2024-01-18 03:20:00', NULL, NULL, '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(51, 9, 3, '2024-01-25 05:40:00', '2024-01-27 07:25:00', NULL, '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(52, 10, 1, '2024-02-02 02:15:00', NULL, NULL, '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(53, 11, 2, '2024-02-08 06:50:00', NULL, NULL, '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(54, 12, 1, '2024-02-15 08:30:00', NULL, NULL, '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(55, 13, 3, '2024-02-20 04:45:00', '2024-02-22 06:20:00', NULL, '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(56, 14, 4, '2024-02-25 07:15:00', '2024-02-27 03:40:00', '2024-03-02 05:25:00', '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(57, 15, 5, '2023-06-15 05:20:00', NULL, NULL, '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(58, 3, 5, '2023-09-08 07:45:00', NULL, NULL, '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(59, 4, 5, '2023-11-12 03:30:00', NULL, NULL, '2025-07-21 15:11:53', '2025-07-21 15:11:53');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`order_id`, `product_id`, `quantity`, `created_at`, `updated_at`) VALUES
(1, 1, 1, '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(1, 2, 1, '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(2, 28, 1, '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(2, 29, 1, '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(3, 15, 1, '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(3, 17, 1, '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(4, 30, 1, '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(4, 31, 1, '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(5, 4, 1, '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(5, 5, 1, '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(5, 6, 1, '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(6, 3, 1, '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(7, 34, 1, '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(7, 35, 1, '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(8, 32, 1, '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(8, 33, 1, '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(9, 43, 1, '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(9, 50, 1, '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(10, 40, 1, '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(10, 41, 1, '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(11, 12, 1, '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(11, 13, 1, '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(11, 26, 1, '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(12, 14, 1, '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(12, 44, 1, '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(13, 9, 1, '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(13, 21, 1, '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(13, 23, 1, '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(14, 8, 1, '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(14, 24, 1, '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(15, 19, 1, '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(15, 37, 1, '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(15, 52, 1, '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(16, 36, 1, '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(16, 49, 1, '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(17, 42, 1, '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(17, 47, 1, '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(18, 46, 1, '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(18, 48, 1, '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(19, 45, 1, '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(19, 51, 1, '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(20, 53, 1, '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(20, 54, 1, '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(21, 38, 1, '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(21, 39, 1, '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(22, 7, 1, '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(22, 18, 1, '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(23, 20, 1, '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(23, 22, 1, '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(24, 25, 1, '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(24, 27, 1, '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(25, 10, 1, '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(25, 11, 1, '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(26, 3, 1, '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(27, 15, 1, '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(28, 1, 1, '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(29, 17, 1, '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(30, 2, 1, '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(31, 4, 1, '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(32, 28, 1, '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(33, 29, 1, '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(34, 30, 1, '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(35, 31, 1, '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(36, 14, 1, '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(37, 44, 1, '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(38, 32, 1, '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(39, 33, 1, '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(40, 43, 1, '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(41, 34, 1, '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(42, 35, 1, '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(43, 40, 1, '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(44, 45, 1, '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(45, 46, 1, '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(46, 47, 1, '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(47, 48, 1, '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(48, 49, 1, '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(49, 50, 1, '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(50, 51, 1, '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(51, 52, 1, '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(52, 53, 1, '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(53, 54, 1, '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(54, 5, 1, '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(55, 12, 1, '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(56, 13, 1, '2025-07-21 15:11:53', '2025-07-21 15:11:53'),
(57, 26, 1, '2025-07-21 15:11:53', '2025-07-21 15:11:53');

-- --------------------------------------------------------

--
-- Table structure for table `platform_types`
--

CREATE TABLE `platform_types` (
  `plat_id` int(11) NOT NULL,
  `description` text NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `platform_types`
--

INSERT INTO `platform_types` (`plat_id`, `description`, `created_at`, `updated_at`) VALUES
(1, 'mobile', '2025-07-21 15:10:49', '2025-07-21 15:10:49'),
(2, 'PC', '2025-07-21 15:10:49', '2025-07-21 15:10:49'),
(3, 'console', '2025-07-21 15:10:49', '2025-07-21 15:10:49');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `product_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `plat_id` int(11) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `ptype_id` int(11) DEFAULT 1,
  `release_date` date DEFAULT NULL,
  `developer` varchar(255) DEFAULT NULL,
  `publisher` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`product_id`, `title`, `description`, `plat_id`, `price`, `ptype_id`, `release_date`, `developer`, `publisher`, `created_at`, `updated_at`) VALUES
(1, 'Cyberpunk 2077', 'An open-world, action-adventure RPG set in the dark future of Night City.', 2, 2599.00, 1, '2020-12-10', 'CD Projekt RED', 'CD Projekt', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(2, 'The Witcher 3: Wild Hunt', 'A story-driven open world RPG set in a visually stunning fantasy universe.', 2, 1699.00, 1, '2015-05-19', 'CD Projekt RED', 'CD Projekt', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(3, 'Baldurs Gate 3', 'An epic RPG based on the legendary Dungeons & Dragons tabletop RPG.', 2, 2599.00, 1, '2023-08-03', 'Larian Studios', 'Larian Studios', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(4, 'Hades', 'A rogue-like dungeon crawler from the creators of Bastion and Transistor.', 2, 765.00, 1, '2020-09-17', 'Supergiant Games', 'Supergiant Games', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(5, 'Disco Elysium', 'A groundbreaking detective RPG.', 2, 829.95, 1, '2019-10-15', 'ZA/UM', 'ZA/UM', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(6, 'Among Us', 'Multiplayer party game of teamwork and betrayal.', 2, 95.40, 1, '2018-11-16', 'Innersloth', 'Innersloth', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(7, 'The Stanley Parable', 'A narrative-driven walking simulator.', 2, 549.95, 1, '2013-10-17', 'Galactic Cafe', 'Galactic Cafe', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(8, 'Factorio', 'Factory-building automation game.', 2, 1000.00, 1, '2020-08-14', 'Wube Software', 'Wube Software', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(9, 'Subnautica', 'Underwater survival and exploration.', 2, 1375.00, 1, '2018-01-23', 'Unknown Worlds', 'Unknown Worlds', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(10, 'Dota 2', 'A complex competitive MOBA.', 2, 0.00, 1, '2013-07-09', 'Valve', 'Valve', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(11, 'Team Fortress 2', 'Fast-paced class-based shooter.', 2, 0.00, 1, '2007-10-10', 'Valve', 'Valve', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(12, 'Slay the Spire', 'Card-battler roguelike deck-builder.', 2, 780.00, 1, '2019-01-23', 'MegaCrit', 'Humble Games', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(13, 'Cuphead', 'Run-and-gun platformer with 1930s animation.', 2, 499.95, 1, '2017-09-29', 'Studio MDHR', 'Studio MDHR', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(14, 'Star Wars Jedi: Survivor', 'Third-person action-adventure in the Star Wars universe.', 2, 2999.00, 1, '2023-04-28', 'Respawn Entertainment', 'EA', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(15, 'Elden Ring', 'A fantasy action-RPG adventure set within a world created by Hidetaka Miyazaki and George R.R. Martin.', 2, 2399.00, 1, '2022-02-25', 'FromSoftware', 'Bandai Namco Entertainment', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(16, 'Valorant', 'A 5v5 character-based tactical FPS where precise gunplay meets unique agent abilities.', 2, 0.00, 1, '2020-06-02', 'Riot Games', 'Riot Games', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(17, 'Minecraft', 'A sandbox game where you can build anything you can imagine.', 2, 2283.82, 1, '2011-11-18', 'Mojang Studios', 'Microsoft Studios', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(18, 'Left 4 Dead 2', 'Co-op zombie survival shooter.', 2, 335.00, 1, '2009-11-17', 'Valve', 'Valve', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(19, 'Ori and the Blind Forest', 'Visually stunning platformer.', 2, 990.00, 1, '2015-03-11', 'Moon Studios', 'Xbox Game Studios', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(20, 'Metro Exodus', 'Post-apocalyptic shooter with story focus.', 2, 1192.00, 1, '2019-02-15', '4A Games', 'Deep Silver', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(21, 'The Forest', 'Open world survival horror game.', 2, 449.95, 1, '2018-04-30', 'Endnight Games', 'Endnight Games', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(22, 'Satisfactory', 'Factory-building sim in 3D.', 2, 770.00, 1, '2019-03-19', 'Coffee Stain Studios', 'Coffee Stain Studios', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(23, 'No Man\'s Sky', 'Space exploration survival game.', 2, 668.00, 1, '2016-08-12', 'Hello Games', 'Hello Games', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(24, 'RimWorld', 'Sci-fi colony sim driven by AI storytelling.', 2, 840.00, 1, '2018-10-17', 'Ludeon Studios', 'Ludeon Studios', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(25, 'Project Zomboid', 'Isometric zombie survival RPG.', 2, 615.00, 1, '2013-11-08', 'The Indie Stone', 'The Indie Stone', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(26, 'Hollow Knight', 'Action-adventure metroidvania.', 2, 485.00, 1, '2017-02-24', 'Team Cherry', 'Team Cherry', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(27, 'Tunic', 'Isometric adventure game starring a fox.', 2, 910.00, 1, '2022-03-16', 'Andrew Shouldice', 'Finji', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(28, 'The Legend of Zelda: Breath of the Wild', 'An open-air adventure that breaks boundaries.', 3, 2450.00, 2, '2017-03-03', 'Nintendo EPD', 'Nintendo', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(29, 'God of War', 'Kratos returns in this Norse mythology-inspired action adventure.', 3, 2490.00, 2, '2018-04-20', 'Santa Monica Studio', 'Sony Interactive Entertainment', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(30, 'Red Dead Redemption 2', 'An epic tale of life in Americas unforgiving heartland.', 3, 849.75, 2, '2018-10-26', 'Rockstar Games', 'Rockstar Games', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(31, 'Spider-Man: Miles Morales', 'Experience the rise of Miles Morales as he masters new powers.', 3, 2490.00, 2, '2020-11-12', 'Insomniac Games', 'Sony Interactive Entertainment', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(32, 'Assassin\'s Creed Valhalla', 'Viking-era open world action game.', 3, 2200.00, 2, '2020-11-10', 'Ubisoft Montreal', 'Ubisoft', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(33, 'Resident Evil Village', 'Survival horror with intense atmosphere.', 3, 1790.00, 2, '2021-05-07', 'Capcom', 'Capcom', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(34, 'FIFA 23', 'Latest edition of the football franchise.', 3, 1395.00, 2, '2022-09-30', 'EA Vancouver', 'EA Sports', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(35, 'NBA 2K24', 'Basketball sim with advanced features.', 3, 2199.00, 2, '2023-09-08', 'Visual Concepts', '2K Sports', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(36, 'Mortal Kombat 11', 'Brutal and cinematic fighting game.', 3, 1490.00, 2, '2019-04-23', 'NetherRealm Studios', 'WB Games', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(37, 'Crash Bandicoot 4', 'Modern revival of the classic platformer.', 3, 2400.00, 2, '2020-10-02', 'Toys for Bob', 'Activision', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(38, 'Tony Hawk\'s Pro Skater 1+2', 'Remake of the classic skating titles.', 3, 1944.99, 2, '2020-09-04', 'Vicarious Visions', 'Activision', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(39, 'Far Cry 6', 'Open world chaos in a fictional dictatorship.', 3, 2200.00, 2, '2021-10-07', 'Ubisoft Toronto', 'Ubisoft', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(40, 'Gran Turismo 7', 'Realistic racing simulator.', 3, 3490.00, 2, '2022-03-04', 'Polyphony Digital', 'Sony', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(41, 'Need for Speed Unbound', 'Street racing with stylized visuals.', 3, 2999.00, 2, '2022-12-02', 'Criterion Games', 'EA', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(42, 'Horizon Zero Dawn', 'Experience Aloys entire legendary quest to unravel the mysteries of a world ruled by deadly Machines.', 3, 2490.00, 2, '2017-02-28', 'Guerrilla Games', 'Sony Interactive Entertainment', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(43, 'Super Mario Odyssey', 'Join Mario on a massive, globe-trotting 3D adventure.', 3, 2895.00, 2, '2017-10-27', 'Nintendo EPD', 'Nintendo', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(44, 'Halo Infinite', 'Master Chief returns in the most expansive Master Chief story yet.', 3, 3490.00, 2, '2021-12-08', '343 Industries', 'Microsoft Studios', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(45, 'Ratchet & Clank: Rift Apart', 'Dimension-hopping action-platformer.', 3, 2990.00, 2, '2021-06-11', 'Insomniac Games', 'Sony', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(46, 'Returnal', 'Sci-fi rogue-like shooter.', 3, 2990.00, 2, '2021-04-30', 'Housemarque', 'Sony', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(47, 'Ghost of Tsushima', 'Open-world samurai action.', 3, 1950.00, 2, '2020-07-17', 'Sucker Punch Productions', 'Sony', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(48, 'Demon\'s Souls (Remake)', 'Hardcore action RPG.', 3, 3490.00, 2, '2020-11-12', 'Bluepoint Games', 'Sony', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(49, 'Bayonetta 3', 'Hack and slash action game.', 3, 2495.00, 2, '2022-10-28', 'PlatinumGames', 'Nintendo', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(50, 'Splatoon 3', 'Colorful ink-based shooter.', 3, 2350.00, 2, '2022-09-09', 'Nintendo EPD', 'Nintendo', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(51, 'Fire Emblem Engage', 'Tactical RPG with returning heroes.', 3, 2495.00, 2, '2023-01-20', 'Intelligent Systems', 'Nintendo', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(52, 'Kirby and the Forgotten Land', '3D Kirby platforming adventure.', 3, 2495.00, 2, '2022-03-25', 'HAL Laboratory', 'Nintendo', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(53, 'The Last of Us Part I', 'Remake of the iconic narrative game.', 3, 2990.00, 2, '2022-09-02', 'Naughty Dog', 'Sony', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(54, 'Metroid Dread', 'Side-scrolling sci-fi platformer.', 3, 2450.00, 2, '2021-10-08', 'MercurySteam', 'Nintendo', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(55, 'Mobile Legends: Bang Bang', 'MOBA optimized for mobile.', 1, 0.00, 1, '2016-07-11', 'Moonton', 'Moonton', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(56, 'Candy Crush Saga', 'Classic match-three puzzle game.', 1, 0.00, 1, '2012-04-12', 'King', 'King', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(57, 'Pokemon GO', 'Augmented reality monster-catching.', 1, 0.00, 1, '2016-07-06', 'Niantic', 'Niantic', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(58, 'Brawl Stars', 'Multiplayer arena battler.', 1, 0.00, 1, '2018-12-12', 'Supercell', 'Supercell', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(59, 'Roblox', 'User-generated game platform.', 1, 0.00, 1, '2006-09-01', 'Roblox Corp.', 'Roblox Corp.', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(60, 'Subway Surfers', 'Endless runner game.', 1, 0.00, 1, '2012-05-24', 'SYBO Games', 'Kiloo', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(61, 'Temple Run 2', 'Fast-paced temple running game.', 1, 0.00, 1, '2013-01-16', 'Imangi Studios', 'Imangi Studios', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(62, 'Angry Birds 2', 'Slingshot destruction puzzler.', 1, 0.00, 1, '2015-07-30', 'Rovio', 'Rovio', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(63, 'Plague Inc.', 'Simulate a global pandemic.', 1, 0.00, 1, '2012-05-26', 'Ndemic Creations', 'Ndemic Creations', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(64, 'AFK Arena', 'Idle gacha RPG game.', 1, 0.00, 1, '2019-04-09', 'Lilith Games', 'Lilith Games', '2025-07-21 15:11:47', '2025-07-21 15:11:47');

-- --------------------------------------------------------

--
-- Table structure for table `product_images`
--

CREATE TABLE `product_images` (
  `img_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `image_url` varchar(200) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `product_images`
--

INSERT INTO `product_images` (`img_id`, `product_id`, `image_url`, `created_at`, `updated_at`) VALUES
(1, 1, '/images/products/cyberpunk2077/main.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(2, 1, '/images/products/cyberpunk2077/main2.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(3, 2, '/images/products/witcher3/main.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(4, 2, '/images/products/witcher3/world.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(5, 3, '/images/products/baldursgate3/main.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(6, 3, '/images/products/baldursgate3/combat.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(7, 4, '/images/products/hades/main.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(8, 4, '/images/products/hades/gameplay.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(9, 5, '/images/products/disco_elysium/main.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(10, 5, '/images/products/disco_elysium/dialogue.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(11, 6, '/images/products/among_us/main.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(12, 6, '/images/products/among_us/emergency.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(13, 7, '/images/products/stanley_parable/main.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(14, 7, '/images/products/stanley_parable/narrator.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(15, 8, '/images/products/factorio/main.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(16, 8, '/images/products/factorio/factory.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(17, 9, '/images/products/subnautica/main.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(18, 9, '/images/products/subnautica/underwater.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(19, 10, '/images/products/dota2/main.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(20, 10, '/images/products/dota2/heroes.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(21, 11, '/images/products/tf2/main.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(22, 11, '/images/products/tf2/classes.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(23, 12, '/images/products/slay_the_spire/main.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(24, 12, '/images/products/slay_the_spire/cards.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(25, 13, '/images/products/cuphead/main.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(26, 13, '/images/products/cuphead/boss.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(27, 14, '/images/products/jedi_survivor/main.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(28, 14, '/images/products/jedi_survivor/combat.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(29, 15, '/images/products/elden_ring/main.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(30, 15, '/images/products/elden_ring/boss.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(31, 16, '/images/products/valorant/main.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(32, 16, '/images/products/valorant/gameplay.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(33, 17, '/images/products/minecraft/main.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(34, 17, '/images/products/minecraft/main2.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(35, 18, '/images/products/l4d2/main.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(36, 18, '/images/products/l4d2/zombies.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(37, 19, '/images/products/ori/main.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(38, 19, '/images/products/ori/spirit_tree.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(39, 20, '/images/products/metro_exodus/main.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(40, 20, '/images/products/metro_exodus/train.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(41, 21, '/images/products/the_forest/main.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(42, 21, '/images/products/the_forest/cannibals.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(43, 22, '/images/products/satisfactory/main.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(44, 22, '/images/products/satisfactory/automation.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(45, 23, '/images/products/nms/main.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(46, 23, '/images/products/nms/planets.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(47, 24, '/images/products/rimworld/main.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(48, 24, '/images/products/rimworld/colony.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(49, 25, '/images/products/project_zomboid/main.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(50, 25, '/images/products/project_zomboid/base.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(51, 26, '/images/products/hollow_knight/main.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(52, 26, '/images/products/hollow_knight/boss.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(53, 27, '/images/products/tunic/main.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(54, 27, '/images/products/tunic/fox.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(55, 28, '/images/products/zelda_botw/main.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(56, 28, '/images/products/zelda_botw/world.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(57, 29, '/images/products/god_of_war/main.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(58, 29, '/images/products/god_of_war/gameplay.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(59, 30, '/images/products/rdr2/main.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(60, 30, '/images/products/rdr2/world.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(61, 31, '/images/products/spiderman_miles/main.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(62, 31, '/images/products/spiderman_miles/gameplay.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(63, 32, '/images/products/ac_valhalla/main.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(64, 32, '/images/products/ac_valhalla/viking.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(65, 33, '/images/products/re_village/main.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(66, 33, '/images/products/re_village/lady_d.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(67, 34, '/images/products/fifa23/main.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(68, 34, '/images/products/fifa23/gameplay.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(69, 35, '/images/products/nba2k24/main.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(70, 35, '/images/products/nba2k24/arena.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(71, 36, '/images/products/mk11/main.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(72, 36, '/images/products/mk11/fatality.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(73, 37, '/images/products/crash4/main.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(74, 37, '/images/products/crash4/platforming.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(75, 38, '/images/products/thps1_2/main.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(76, 38, '/images/products/thps1_2/skating.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(77, 39, '/images/products/farcry6/main.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(78, 39, '/images/products/farcry6/dictator.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(79, 40, '/images/products/gt7/main.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(80, 40, '/images/products/gt7/car.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(81, 41, '/images/products/nfs_unbound/main.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(82, 41, '/images/products/nfs_unbound/street.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(83, 42, '/images/products/horizon/main.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(84, 42, '/images/products/horizon/gameplay.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(85, 43, '/images/products/mario_odyssey/main.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(86, 43, '/images/products/mario_odyssey/gameplay.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(87, 44, '/images/products/halo_infinite/main.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(88, 44, '/images/products/halo_infinite/gameplay.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(89, 45, '/images/products/ratchet_rift_apart/main.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(90, 45, '/images/products/ratchet_rift_apart/dimension.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(91, 46, '/images/products/returnal/main.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(92, 46, '/images/products/returnal/loop.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(93, 47, '/images/products/ghost_of_tsushima/main.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(94, 47, '/images/products/ghost_of_tsushima/duel.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(95, 48, '/images/products/demons_souls/main.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(96, 48, '/images/products/demons_souls/boss.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(97, 49, '/images/products/bayonetta3/main.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(98, 49, '/images/products/bayonetta3/combat.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(99, 50, '/images/products/splatoon3/main.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(100, 50, '/images/products/splatoon3/multiplayer.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(101, 51, '/images/products/fire_emblem_engage/main.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(102, 51, '/images/products/fire_emblem_engage/battle.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(103, 52, '/images/products/kirby_forgotten_land/main.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(104, 52, '/images/products/kirby_forgotten_land/world.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(105, 53, '/images/products/tlou1_remake/main.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(106, 53, '/images/products/tlou1_remake/ellie.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(107, 54, '/images/products/metroid_dread/main.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(108, 54, '/images/products/metroid_dread/samus.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(109, 55, '/images/products/mlbb/main.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(110, 55, '/images/products/mlbb/heroes.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(111, 56, '/images/products/candy_crush/main.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(112, 56, '/images/products/candy_crush/levels.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(113, 57, '/images/products/pokemon_go/main.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(114, 57, '/images/products/pokemon_go/map.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(115, 58, '/images/products/brawl_stars/main.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(116, 58, '/images/products/brawl_stars/battle.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(117, 59, '/images/products/roblox/main.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(118, 59, '/images/products/roblox/worlds.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(119, 60, '/images/products/subway_surfers/main.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(120, 60, '/images/products/subway_surfers/running.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(121, 61, '/images/products/temple_run2/main.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(122, 61, '/images/products/temple_run2/temple.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(123, 62, '/images/products/angry_birds2/main.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(124, 62, '/images/products/angry_birds2/pigs.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(125, 63, '/images/products/plague_inc/main.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(126, 63, '/images/products/plague_inc/world_map.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(127, 64, '/images/products/afk_arena/main.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(128, 64, '/images/products/afk_arena/heroes.jpg', '2025-07-21 15:11:47', '2025-07-21 15:11:47');

-- --------------------------------------------------------

--
-- Table structure for table `product_types`
--

CREATE TABLE `product_types` (
  `ptype_id` int(11) NOT NULL,
  `description` text NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `product_types`
--

INSERT INTO `product_types` (`ptype_id`, `description`, `created_at`, `updated_at`) VALUES
(1, 'digital', '2025-07-21 15:10:49', '2025-07-21 15:10:49'),
(2, 'physical', '2025-07-21 15:10:49', '2025-07-21 15:10:49');

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `review_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `rating` int(11) NOT NULL CHECK (`rating` >= 1 and `rating` <= 5),
  `review_title` varchar(255) DEFAULT NULL,
  `review_text` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`review_id`, `user_id`, `product_id`, `rating`, `review_title`, `review_text`, `created_at`, `updated_at`) VALUES
(1, 3, 1, 4, 'Great game after patches', 'Amazing storyline and graphics. Had some technical issues at launch but most have been fixed now. The world is incredibly detailed and immersive. Night City feels alive!', '2023-01-15 06:30:00', '2025-07-21 15:11:59'),
(2, 4, 1, 3, 'Mixed feelings about this one', 'The game has potential but still feels unfinished in some areas. The main story is good but side quests can be repetitive. Performance has improved though.', '2023-02-20 01:45:00', '2025-07-21 15:11:59'),
(3, 5, 1, 5, 'Absolute masterpiece!', 'This game is absolutely incredible! The attention to detail is mind-blowing and the story kept me hooked for over 100 hours. Best RPG I have played in years.', '2023-03-10 08:20:00', '2025-07-21 15:11:59'),
(4, 6, 2, 5, 'Best RPG ever made', 'This game sets the standard for all RPGs. Incredible story, amazing characters, and the DLCs are worth the price alone. Geralt is an amazing protagonist.', '2022-06-15 05:45:00', '2025-07-21 15:11:59'),
(5, 7, 2, 5, 'Perfect in every way', 'Cannot find a single flaw in this masterpiece. Every quest feels meaningful and the world is alive. The choices actually matter!', '2022-07-20 02:30:00', '2025-07-21 15:11:59'),
(6, 8, 2, 4, 'Excellent game with minor issues', 'Really enjoyed the story and combat system. Graphics still hold up well today. Only complaint is the movement can feel clunky sometimes.', '2022-08-12 07:20:00', '2025-07-21 15:11:59'),
(7, 9, 3, 5, 'D&D perfection', 'This is exactly what a D&D video game should be. The freedom of choice is incredible and the story adapts beautifully to your decisions.', '2023-08-15 06:20:00', '2025-07-21 15:11:59'),
(8, 10, 3, 4, 'Great but overwhelming', 'Amazing game but there are so many options it can be overwhelming for newcomers. The tutorial could be better.', '2023-09-02 03:30:00', '2025-07-21 15:11:59'),
(9, 11, 3, 5, 'Best co-op experience', 'Playing this with friends is absolutely incredible. The multiplayer works flawlessly and creates amazing moments.', '2023-09-20 08:45:00', '2025-07-21 15:11:59'),
(10, 12, 4, 5, 'Roguelike perfection', 'This game makes dying fun! Every run feels different and the story progression is brilliant. The art style is gorgeous.', '2022-03-12 05:20:00', '2025-07-21 15:11:59'),
(11, 13, 4, 5, 'Addictive gameplay loop', 'Just one more run... I have said this hundreds of times. The combat feels so smooth and satisfying.', '2022-04-08 09:30:00', '2025-07-21 15:11:59'),
(12, 14, 5, 5, 'Revolutionary RPG', 'This game changed what I thought RPGs could be. The writing is phenomenal and the detective work is engaging throughout.', '2022-01-20 07:30:00', '2025-07-21 15:11:59'),
(13, 15, 5, 4, 'Unique experience', 'Unlike anything I have played before. Heavy on reading but the story is worth it. Not for everyone but brilliant.', '2022-02-14 03:45:00', '2025-07-21 15:11:59'),
(14, 3, 6, 5, 'Perfect party game', 'So much fun to play with friends. Simple but addictive. Great for virtual hangouts during lockdown.', '2021-05-10 11:45:00', '2025-07-21 15:11:59'),
(15, 4, 6, 4, 'Great social game', 'Really brings people together. Can get intense during discussions. My kids love it too.', '2021-06-15 06:30:00', '2025-07-21 15:11:59'),
(16, 5, 7, 4, 'Brilliant narrative experiment', 'This game is unlike anything else. The narrator is fantastic and the choices are meaningful. Short but memorable.', '2022-11-10 06:20:00', '2025-07-21 15:11:59'),
(17, 6, 8, 5, 'Engineering masterpiece', 'This game consumed my life for weeks. The automation is so satisfying. Perfect for people who love optimization.', '2022-09-15 08:45:00', '2025-07-21 15:11:59'),
(18, 7, 9, 4, 'Beautiful underwater world', 'Amazing exploration game with great atmosphere. Can be scary at times but thats part of the charm.', '2022-05-20 03:30:00', '2025-07-21 15:11:59'),
(19, 8, 10, 4, 'MOBA excellence', 'Steep learning curve but very rewarding. The competitive scene is amazing. Great free-to-play model.', '2022-12-05 10:30:00', '2025-07-21 15:11:59'),
(20, 9, 11, 5, 'Timeless multiplayer fun', 'Still one of the best team-based shooters ever made. Each class feels unique and balanced.', '2022-04-18 05:15:00', '2025-07-21 15:11:59'),
(21, 10, 12, 5, 'Perfect card game', 'Addictive deck-building with great strategy. Every run feels different. Perfect for quick sessions.', '2022-07-25 07:40:00', '2025-07-21 15:11:59'),
(22, 11, 13, 4, 'Beautiful but brutal', 'The art style is absolutely gorgeous. Very challenging but fair. Boss fights are epic.', '2022-08-30 04:25:00', '2025-07-21 15:11:59'),
(23, 12, 14, 4, 'Great Star Wars game', 'Really enjoyed the lightsaber combat and exploration. Some technical issues but overall solid.', '2023-06-15 06:20:00', '2025-07-21 15:11:59'),
(24, 13, 15, 5, 'FromSoftware masterpiece', 'This is Dark Souls perfected. The open world design works brilliantly with the formula. Challenging but fair.', '2022-03-15 06:20:00', '2025-07-21 15:11:59'),
(25, 14, 15, 4, 'Beautiful but brutal', 'Gorgeous game with incredible boss fights. Very difficult but rewarding. Not for casual players.', '2022-04-02 03:45:00', '2025-07-21 15:11:59'),
(26, 15, 16, 5, 'Tactical shooter perfection', 'Best tactical FPS on the market. The agent abilities add great strategy. Excellent competitive game.', '2023-03-15 05:45:00', '2025-07-21 15:11:59'),
(27, 3, 17, 5, 'Creativity unleashed', 'This game lets you build anything you can imagine. Perfect for both kids and adults. Endless possibilities.', '2021-08-12 02:30:00', '2025-07-21 15:11:59'),
(28, 4, 17, 5, 'Timeless classic', 'Simple concept but endless possibilities. My kids love it and so do I. Great family game.', '2021-09-05 07:45:00', '2025-07-21 15:11:59'),
(29, 5, 18, 4, 'Great co-op zombie game', 'Perfect for playing with friends. The AI director keeps things interesting. Still holds up well.', '2022-10-12 09:30:00', '2025-07-21 15:11:59'),
(30, 6, 19, 5, 'Visually stunning platformer', 'Beautiful art and music. Emotional story with great platforming mechanics. A true work of art.', '2022-06-08 06:15:00', '2025-07-21 15:11:59'),
(31, 7, 20, 4, 'Atmospheric shooter', 'Great post-apocalyptic atmosphere. The story is engaging and the world feels lived-in.', '2022-11-22 08:45:00', '2025-07-21 15:11:59'),
(32, 8, 21, 3, 'Creepy survival game', 'Good survival mechanics but can be quite scary. Better with friends. Building system is solid.', '2022-09-18 05:20:00', '2025-07-21 15:11:59'),
(33, 9, 22, 5, 'Factory building perfection', 'If you like automation and optimization, this is perfect. The 3D aspect adds a lot to the formula.', '2022-12-30 07:50:00', '2025-07-21 15:11:59'),
(34, 10, 23, 4, 'Much improved space game', 'Has come a long way since launch. Lots of content now and exploration is fun. Great for relaxing.', '2023-02-14 03:40:00', '2025-07-21 15:11:59'),
(35, 11, 24, 5, 'Colony sim masterpiece', 'The AI storytelling creates amazing emergent narratives. Every colony tells a unique story.', '2022-08-05 10:25:00', '2025-07-21 15:11:59'),
(36, 12, 25, 4, 'Intense zombie survival', 'Very challenging but rewarding. The isometric view works well. Great with friends.', '2023-01-28 06:35:00', '2025-07-21 15:11:59'),
(37, 13, 26, 5, 'Metroidvania perfection', 'Beautiful hand-drawn art with tight controls. Challenging but fair. Incredible value for money.', '2022-05-16 08:20:00', '2025-07-21 15:11:59'),
(38, 14, 27, 4, 'Charming adventure', 'Love the art style and the mystery elements. Playing as a fox is adorable. Great puzzle design.', '2022-07-12 04:45:00', '2025-07-21 15:11:59'),
(39, 15, 28, 5, 'Revolutionary open world', 'This game changed open world design forever. The freedom to explore is incredible. Every hill hides a secret.', '2022-04-10 04:30:00', '2025-07-21 15:11:59'),
(40, 3, 28, 5, 'Nintendo magic', 'Pure Nintendo magic. The physics system creates endless possibilities. Climbing everything is so satisfying.', '2022-05-18 08:45:00', '2025-07-21 15:11:59'),
(41, 4, 29, 5, 'Perfect reboot', 'This game completely reinvented the series in the best way possible. The father-son relationship is beautifully portrayed.', '2022-06-15 07:30:00', '2025-07-21 15:11:59'),
(42, 5, 29, 5, 'Norse mythology done right', 'Amazing how they incorporated Norse mythology into the God of War universe. Kratos character development is excellent.', '2022-07-08 04:45:00', '2025-07-21 15:11:59'),
(43, 6, 30, 5, 'Most detailed game ever', 'The level of detail in this game is insane. Every NPC feels like a real person. The world is incredibly immersive.', '2022-09-20 06:15:00', '2025-07-21 15:11:59'),
(44, 7, 30, 4, 'Slow but rewarding', 'Takes time to get into but once you do, it is incredibly rewarding. The story is emotional and well-written.', '2022-10-05 08:30:00', '2025-07-21 15:11:59'),
(45, 8, 31, 4, 'Great superhero game', 'Web-swinging through New York never gets old. Combat is fluid and fun. Great use of PS5 features.', '2023-01-08 05:20:00', '2025-07-21 15:11:59'),
(46, 9, 31, 5, 'Miles is awesome', 'Love playing as Miles Morales. His powers are unique and the story is great. Perfect length for the price.', '2023-02-15 07:45:00', '2025-07-21 15:11:59'),
(47, 10, 32, 3, 'Good but repetitive', 'The Viking setting is cool but the gameplay can get repetitive. Story is decent but too long.', '2022-12-18 03:25:00', '2025-07-21 15:11:59'),
(48, 11, 33, 4, 'Great horror atmosphere', 'Really enjoyed the horror elements and boss fights. Lady Dimitrescu is an iconic villain.', '2022-08-22 09:40:00', '2025-07-21 15:11:59'),
(49, 12, 34, 2, 'Same game every year', 'FIFA 23 is just FIFA 22 with updated rosters. EA needs to innovate instead of recycling.', '2023-01-12 01:15:00', '2025-07-21 15:11:59'),
(50, 13, 35, 2, 'Microtransaction hell', 'Good basketball sim ruined by aggressive microtransactions. Pay-to-win mechanics everywhere.', '2023-02-08 09:45:00', '2025-07-21 15:11:59'),
(51, 14, 36, 4, 'Brutal fighting game', 'Great fighting mechanics and the fatalities are as brutal as ever. Good story mode too.', '2022-09-25 06:30:00', '2025-07-21 15:11:59'),
(52, 15, 37, 4, 'Classic platforming', 'Great return to form for Crash. Challenging but fair platforming. Nostalgic and fun.', '2022-11-14 08:15:00', '2025-07-21 15:11:59'),
(53, 3, 38, 5, 'Perfect remake', 'This remake captures everything great about the originals while improving the graphics and controls.', '2022-07-30 05:50:00', '2025-07-21 15:11:59'),
(54, 4, 39, 3, 'More of the same', 'Standard Far Cry formula. Fun but nothing revolutionary. The villain is well done though.', '2022-10-28 07:20:00', '2025-07-21 15:11:59'),
(55, 5, 40, 4, 'Great racing sim', 'Beautiful graphics and realistic physics. The car collection is impressive. Some online issues.', '2023-03-22 04:35:00', '2025-07-21 15:11:59'),
(56, 6, 41, 3, 'Stylish but shallow', 'Love the art style but the gameplay feels shallow compared to older NFS games.', '2023-01-05 10:10:00', '2025-07-21 15:11:59'),
(57, 7, 42, 5, 'Amazing sci-fi adventure', 'Incredible world-building and story. Fighting robot dinosaurs never gets old. Aloy is a great protagonist.', '2022-04-25 06:45:00', '2025-07-21 15:11:59'),
(58, 8, 43, 5, 'Mario at his best', 'Creative level design and the capture mechanic is brilliant. Pure Nintendo joy from start to finish.', '2022-06-18 03:30:00', '2025-07-21 15:11:59'),
(59, 9, 44, 3, 'Good but incomplete', 'The gameplay is solid but feels like it is missing content that should have been there at launch.', '2023-04-20 03:20:00', '2025-07-21 15:11:59'),
(60, 10, 44, 4, 'Classic Halo feel', 'Feels like the old Halo games which is exactly what I wanted. Multiplayer is fun when it works.', '2023-05-10 07:30:00', '2025-07-21 15:11:59'),
(61, 11, 45, 4, 'Great showcase for PS5', 'The dimension-hopping is impressive technically. Fun gameplay and great visuals.', '2022-08-15 08:25:00', '2025-07-21 15:11:59'),
(62, 12, 46, 4, 'Challenging roguelike', 'Very difficult but the gameplay loop is addictive. Great use of PS5 controller features.', '2022-09-12 05:40:00', '2025-07-21 15:11:59'),
(63, 13, 47, 5, 'Beautiful samurai epic', 'Stunning visuals and great combat. The story is engaging and the world is gorgeous.', '2022-07-05 09:55:00', '2025-07-21 15:11:59'),
(64, 14, 48, 4, 'Hardcore but rewarding', 'Very challenging but the sense of accomplishment is incredible. Beautiful remake.', '2022-11-08 06:15:00', '2025-07-21 15:11:59'),
(65, 15, 49, 4, 'Stylish action', 'Bayonetta 3 delivers the crazy action the series is known for. Over-the-top and fun.', '2023-08-05 03:30:00', '2025-07-21 15:11:59'),
(66, 3, 50, 4, 'Colorful multiplayer fun', 'Great multiplayer shooter with unique mechanics. The ink-based gameplay is still fresh.', '2022-12-20 07:45:00', '2025-07-21 15:11:59'),
(67, 4, 51, 4, 'Solid tactical RPG', 'Good strategy gameplay with interesting mechanics. Story is decent but gameplay is strong.', '2023-02-28 04:20:00', '2025-07-21 15:11:59'),
(68, 5, 52, 5, 'Kirby perfection', '3D Kirby works surprisingly well. Colorful, fun, and perfect for all ages. Nintendo nailed it.', '2023-09-12 05:15:00', '2025-07-21 15:11:59'),
(69, 6, 53, 5, 'Perfect remake', 'This remake is everything I wanted. The graphics are stunning and the gameplay improvements are welcome.', '2023-07-10 08:45:00', '2025-07-21 15:11:59'),
(70, 7, 54, 4, 'Great return for Metroid', 'Solid Metroidvania with great atmosphere. The EMMI sections are genuinely tense.', '2022-12-03 06:30:00', '2025-07-21 15:11:59'),
(71, 8, 55, 3, 'Good mobile MOBA', 'Decent MOBA for mobile but can be pay-to-win. Good for quick matches.', '2022-05-25 08:20:00', '2025-07-21 15:11:59'),
(72, 9, 56, 3, 'Addictive but predatory', 'Fun puzzle game but the monetization is aggressive. Gets very difficult without spending money.', '2022-11-20 04:30:00', '2025-07-21 15:11:59'),
(73, 10, 57, 4, 'Gets you moving', 'Great way to exercise while gaming. Love the AR features. Community events are fun.', '2021-07-15 02:30:00', '2025-07-21 15:11:59'),
(74, 11, 57, 5, 'Nostalgic and fun', 'Brings back childhood memories of Pokemon. Great social aspect too. Love the trading feature.', '2021-08-20 06:45:00', '2025-07-21 15:11:59'),
(75, 12, 58, 4, 'Fun mobile battler', 'Great for quick gaming sessions. The different game modes keep it interesting.', '2022-03-18 09:25:00', '2025-07-21 15:11:59'),
(76, 13, 59, 4, 'Creative platform', 'Amazing what the community creates. Great for kids and creative people. Endless content.', '2022-01-30 03:15:00', '2025-07-21 15:11:59'),
(77, 14, 60, 3, 'Simple endless runner', 'Good for killing time but gets repetitive. Colorful graphics and smooth gameplay.', '2021-12-15 05:40:00', '2025-07-21 15:11:59'),
(78, 15, 61, 3, 'Classic mobile game', 'Still fun after all these years. Simple but addictive gameplay. Good for short sessions.', '2022-02-22 07:55:00', '2025-07-21 15:11:59'),
(79, 3, 62, 3, 'Decent sequel', 'Improves on the original formula but the monetization can be annoying. Still fun though.', '2022-04-12 04:10:00', '2025-07-21 15:11:59'),
(80, 4, 63, 4, 'Darkly fascinating', 'Morbid but educational. The strategy elements are well done. Surprisingly deep gameplay.', '2022-06-28 08:35:00', '2025-07-21 15:11:59'),
(81, 5, 64, 3, 'Typical idle game', 'Good for casual play but very pay-to-win. Nice art style but repetitive gameplay.', '2022-08-14 06:50:00', '2025-07-21 15:11:59');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `role_id` int(11) NOT NULL,
  `description` text NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`role_id`, `description`, `created_at`, `updated_at`) VALUES
(1, 'customer', '2025-07-21 15:10:49', '2025-07-21 15:10:49'),
(2, 'admin', '2025-07-21 15:10:49', '2025-07-21 15:10:49');

-- --------------------------------------------------------

--
-- Table structure for table `status`
--

CREATE TABLE `status` (
  `stat_id` int(11) NOT NULL,
  `description` text NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `status`
--

INSERT INTO `status` (`stat_id`, `description`, `created_at`, `updated_at`) VALUES
(1, 'pending', '2025-07-21 15:10:49', '2025-07-21 15:10:49'),
(2, 'processing', '2025-07-21 15:10:49', '2025-07-21 15:10:49'),
(3, 'shipped', '2025-07-21 15:10:49', '2025-07-21 15:10:49'),
(4, 'delivered', '2025-07-21 15:10:49', '2025-07-21 15:10:49'),
(5, 'cancelled', '2025-07-21 15:10:49', '2025-07-21 15:10:49');

-- --------------------------------------------------------

--
-- Table structure for table `stock`
--

CREATE TABLE `stock` (
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `stock`
--

INSERT INTO `stock` (`product_id`, `quantity`, `created_at`, `updated_at`) VALUES
(28, 55, '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(29, 48, '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(30, 39, '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(31, 57, '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(32, 52, '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(33, 55, '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(34, 43, '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(35, 57, '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(36, 38, '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(37, 67, '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(38, 64, '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(39, 45, '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(40, 38, '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(41, 62, '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(42, 38, '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(43, 53, '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(44, 73, '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(45, 50, '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(46, 37, '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(47, 40, '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(48, 54, '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(49, 35, '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(50, 59, '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(51, 35, '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(52, 46, '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(53, 47, '2025-07-21 15:11:47', '2025-07-21 15:11:47'),
(54, 65, '2025-07-21 15:11:47', '2025-07-21 15:11:47');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `contact_number` varchar(20) DEFAULT NULL,
  `shipping_address` text DEFAULT NULL,
  `image_url` varchar(200) DEFAULT NULL,
  `role_id` int(11) NOT NULL DEFAULT 1,
  `deleted` tinyint(1) DEFAULT 0,
  `token` varchar(500) DEFAULT NULL,
  `token_expires_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `email`, `password_hash`, `first_name`, `last_name`, `contact_number`, `shipping_address`, `image_url`, `role_id`, `deleted`, `token`, `token_expires_at`, `created_at`, `updated_at`) VALUES
(1, 'admin@bitsandbytes.com', '$2a$10$B8yKnwxp0W1KIUsVWtm2KOWVnp.A/E/KpcKVF.yRbyJO5Hf.gcyvq', 'John', 'Admin', '+1234567890', '123 Admin St, Suite 100, Tech City, TC 12345', '/images/default-user.jpg', 2, 0, NULL, NULL, '2025-07-21 15:11:00', '2025-07-21 15:11:00'),
(2, 'manager@bitsandbytes.com', '$2a$10$PTw/IQ5u/BmO8CWAUNMtuOtuZLJg7LDcKolV3gb2.8b3wQ8G2zn1G', 'Sarah', 'Manager', '+1234567891', '456 Management Ave, Office 200, Business District, BD 67890', '/images/default-user.jpg', 2, 0, NULL, NULL, '2025-07-21 15:11:00', '2025-07-21 15:11:00'),
(3, 'alice.johnson@email.com', '$2b$10$rOzJqQZ8kVJ9mX2nY3pL4eK8vN7wP1qR5sT6uA9bC2dE3fG4hI5jK', 'Alice', 'Johnson', '+1555123456', '789 Gaming Lane, Apt 3, Player Town, PT 11111', '/images/default-user.jpg', 1, 0, NULL, NULL, '2025-07-21 15:11:00', '2025-07-21 15:11:00'),
(4, 'bob.smith@email.com', '$2b$10$rOzJqQZ8kVJ9mX2nY3pL4eK8vN7wP1qR5sT6uA9bC2dE3fG4hI5jK', 'Bob', 'Smith', '+1555234567', '321 Console Street, Gamer City, GC 22222', '/images/default-user.jpg', 1, 0, NULL, NULL, '2025-07-21 15:11:00', '2025-07-21 15:11:00'),
(5, 'charlie.brown@email.com', '$2b$10$rOzJqQZ8kVJ9mX2nY3pL4eK8vN7wP1qR5sT6uA9bC2dE3fG4hI5jK', 'Charlie', 'Brown', '+1555345678', '654 VR Avenue, Virtual Village, VV 33333', '/images/default-user.jpg', 1, 0, NULL, NULL, '2025-07-21 15:11:00', '2025-07-21 15:11:00'),
(6, 'diana.prince@email.com', '$2b$10$rOzJqQZ8kVJ9mX2nY3pL4eK8vN7wP1qR5sT6uA9bC2dE3fG4hI5jK', 'Diana', 'Prince', '+1555456789', '987 Wonder Way, Themyscira, TH 44444', '/images/default-user.jpg', 1, 0, NULL, NULL, '2025-07-21 15:11:00', '2025-07-21 15:11:00'),
(7, 'edward.norton@email.com', '$2b$10$rOzJqQZ8kVJ9mX2nY3pL4eK8vN7wP1qR5sT6uA9bC2dE3fG4hI5jK', 'Edward', 'Norton', '+1555567890', '159 Fight Club Rd, Project Mayhem, PM 55555', '/images/default-user.jpg', 1, 0, NULL, NULL, '2025-07-21 15:11:00', '2025-07-21 15:11:00'),
(8, 'fiona.gallagher@email.com', '$2b$10$rOzJqQZ8kVJ9mX2nY3pL4eK8vN7wP1qR5sT6uA9bC2dE3fG4hI5jK', 'Fiona', 'Gallagher', '+1555678901', NULL, '/images/default-user.jpg', 1, 0, NULL, NULL, '2025-07-21 15:11:00', '2025-07-21 15:11:00'),
(9, 'george.washington@email.com', '$2b$10$rOzJqQZ8kVJ9mX2nY3pL4eK8vN7wP1qR5sT6uA9bC2dE3fG4hI5jK', 'George', 'Washington', '+1555789012', NULL, '/images/default-user.jpg', 1, 0, NULL, NULL, '2025-07-21 15:11:00', '2025-07-21 15:11:00'),
(10, 'helen.keller@email.com', '$2b$10$rOzJqQZ8kVJ9mX2nY3pL4eK8vN7wP1qR5sT6uA9bC2dE3fG4hI5jK', 'Helen', 'Keller', '+1555890123', NULL, '/images/default-user.jpg', 1, 0, NULL, NULL, '2025-07-21 15:11:00', '2025-07-21 15:11:00'),
(11, 'ivan.drago@email.com', '$2b$10$rOzJqQZ8kVJ9mX2nY3pL4eK8vN7wP1qR5sT6uA9bC2dE3fG4hI5jK', 'Ivan', 'Drago', '+1555901234', NULL, '/images/default-user.jpg', 1, 0, NULL, NULL, '2025-07-21 15:11:00', '2025-07-21 15:11:00'),
(12, 'jane.doe@email.com', '$2b$10$rOzJqQZ8kVJ9mX2nY3pL4eK8vN7wP1qR5sT6uA9bC2dE3fG4hI5jK', 'Jane', 'Doe', '+1555012345', NULL, '/images/default-user.jpg', 1, 0, NULL, NULL, '2025-07-21 15:11:00', '2025-07-21 15:11:00'),
(13, 'kevin.hart@email.com', '$2b$10$rOzJqQZ8kVJ9mX2nY3pL4eK8vN7wP1qR5sT6uA9bC2dE3fG4hI5jK', 'Kevin', 'Hart', '+1555123450', NULL, '/images/default-user.jpg', 1, 0, NULL, NULL, '2025-07-21 15:11:00', '2025-07-21 15:11:00'),
(14, 'lisa.simpson@email.com', '$2b$10$rOzJqQZ8kVJ9mX2nY3pL4eK8vN7wP1qR5sT6uA9bC2dE3fG4hI5jK', 'Lisa', 'Simpson', '+1555234501', NULL, '/images/default-user.jpg', 1, 0, NULL, NULL, '2025-07-21 15:11:00', '2025-07-21 15:11:00'),
(15, 'mike.tyson@email.com', '$2b$10$rOzJqQZ8kVJ9mX2nY3pL4eK8vN7wP1qR5sT6uA9bC2dE3fG4hI5jK', 'Mike', 'Tyson', '+1555345012', NULL, '/images/default-user.jpg', 1, 0, NULL, NULL, '2025-07-21 15:11:00', '2025-07-21 15:11:00'),
(16, 'nancy.drew@email.com', '$2b$10$rOzJqQZ8kVJ9mX2nY3pL4eK8vN7wP1qR5sT6uA9bC2dE3fG4hI5jK', 'Nancy', 'Drew', '+1555450123', NULL, '/images/default-user.jpg', 1, 0, NULL, NULL, '2025-07-21 15:11:00', '2025-07-21 15:11:00'),
(17, 'deactivated.user@email.com', '$2b$10$rOzJqQZ8kVJ9mX2nY3pL4eK8vN7wP1qR5sT6uA9bC2dE3fG4hI5jK', 'Deactivated', 'User', '+1555501234', '999 Banned Blvd, Suspended City, SC 99999', '/images/default-user.jpg', 1, 1, NULL, NULL, '2025-07-21 15:11:00', '2025-07-21 15:11:00'),
(18, 'banned.user@email.com', '$2b$10$rOzJqQZ8kVJ9mX2nY3pL4eK8vN7wP1qR5sT6uA9bC2dE3fG4hI5jK', 'Banned', 'User', '+1555512345', '666 Restricted Road, Blocked Borough, BB 66666', '/images/default-user.jpg', 1, 1, NULL, NULL, '2025-07-21 15:11:00', '2025-07-21 15:11:00');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`order_id`),
  ADD KEY `idx_orders_user_id` (`user_id`),
  ADD KEY `idx_orders_status` (`stat_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`order_id`,`product_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `platform_types`
--
ALTER TABLE `platform_types`
  ADD PRIMARY KEY (`plat_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`product_id`),
  ADD KEY `ptype_id` (`ptype_id`),
  ADD KEY `idx_products_platform` (`plat_id`),
  ADD KEY `idx_products_price` (`price`);

--
-- Indexes for table `product_images`
--
ALTER TABLE `product_images`
  ADD PRIMARY KEY (`img_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `product_types`
--
ALTER TABLE `product_types`
  ADD PRIMARY KEY (`ptype_id`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`review_id`),
  ADD UNIQUE KEY `unique_user_product` (`user_id`,`product_id`),
  ADD KEY `idx_reviews_product_id` (`product_id`),
  ADD KEY `idx_reviews_rating` (`rating`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`role_id`);

--
-- Indexes for table `status`
--
ALTER TABLE `status`
  ADD PRIMARY KEY (`stat_id`);

--
-- Indexes for table `stock`
--
ALTER TABLE `stock`
  ADD PRIMARY KEY (`product_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_users_email` (`email`),
  ADD KEY `idx_users_role` (`role_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=60;

--
-- AUTO_INCREMENT for table `platform_types`
--
ALTER TABLE `platform_types`
  MODIFY `plat_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=65;

--
-- AUTO_INCREMENT for table `product_images`
--
ALTER TABLE `product_images`
  MODIFY `img_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=129;

--
-- AUTO_INCREMENT for table `product_types`
--
ALTER TABLE `product_types`
  MODIFY `ptype_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `review_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=82;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `role_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `status`
--
ALTER TABLE `status`
  MODIFY `stat_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`stat_id`) REFERENCES `status` (`stat_id`) ON DELETE CASCADE;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`plat_id`) REFERENCES `platform_types` (`plat_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `products_ibfk_2` FOREIGN KEY (`ptype_id`) REFERENCES `product_types` (`ptype_id`) ON DELETE CASCADE;

--
-- Constraints for table `product_images`
--
ALTER TABLE `product_images`
  ADD CONSTRAINT `product_images_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE;

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE;

--
-- Constraints for table `stock`
--
ALTER TABLE `stock`
  ADD CONSTRAINT `stock_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
