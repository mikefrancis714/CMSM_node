-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Feb 01, 2024 at 01:11 PM
-- Server version: 8.0.27
-- PHP Version: 7.4.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cmsm`
--
CREATE DATABASE IF NOT EXISTS `cmsm` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE `cmsm`;

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
CREATE TABLE IF NOT EXISTS `customers` (
  `CustomerID` int NOT NULL AUTO_INCREMENT,
  `FirstName` varchar(50) DEFAULT NULL,
  `LastName` varchar(50) DEFAULT NULL,
  `Email` varchar(50) DEFAULT NULL,
  `Phones` varchar(10) DEFAULT NULL,
  `Address` text,
  `Password` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`CustomerID`),
  UNIQUE KEY `Email` (`Email`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`CustomerID`, `FirstName`, `LastName`, `Email`, `Phones`, `Address`, `Password`) VALUES
(2, 'Judy', 'William', 'judywilliwam@gmail.com', '0712121212', 'Buguruni', 'jw2001'),
(1, 'Idris', 'Mrema', 'idrismrema4@gmail.com', '0711111111', 'Temeke', 'im2001'),
(3, 'Albert', 'Mtoi', 'albert.mtoi@gmail.com', '0722222222', 'Kigamboni', 'am2001'),
(5, NULL, NULL, 'testrun@thisisatest.com', NULL, 'testinginputs', '123'),
(6, 'qwerty', 'qwerty', 'test2@run.com', '1234567890', 'test2', '123');

-- --------------------------------------------------------

--
-- Table structure for table `inventory`
--

DROP TABLE IF EXISTS `inventory`;
CREATE TABLE IF NOT EXISTS `inventory` (
  `ItemID` int NOT NULL AUTO_INCREMENT,
  `ItemName` varchar(100) DEFAULT NULL,
  `Quantity` int DEFAULT NULL,
  PRIMARY KEY (`ItemID`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `inventory`
--

INSERT INTO `inventory` (`ItemID`, `ItemName`, `Quantity`) VALUES
(5, 'Blower', 40),
(4, 'Screwdrivers', 20),
(6, 'LCDs', 45),
(1, 'Flash Drive', 13),
(2, 'SATA Cable', 10),
(3, 'Magnets', 5);

-- --------------------------------------------------------

--
-- Table structure for table `servicerequests`
--

DROP TABLE IF EXISTS `servicerequests`;
CREATE TABLE IF NOT EXISTS `servicerequests` (
  `RequestID` int NOT NULL AUTO_INCREMENT,
  `CustomerID` int DEFAULT NULL,
  `TechnicianID` int DEFAULT NULL,
  `RequestDate` date DEFAULT NULL,
  `Description` text,
  `Status` enum('New','In Progress','Completed') DEFAULT NULL,
  `ItemID` int DEFAULT NULL,
  PRIMARY KEY (`RequestID`),
  KEY `CustomerID` (`CustomerID`),
  KEY `TechnicianID` (`TechnicianID`),
  KEY `ItemID` (`ItemID`)
) ENGINE=MyISAM AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `servicerequests`
--

INSERT INTO `servicerequests` (`RequestID`, `CustomerID`, `TechnicianID`, `RequestDate`, `Description`, `Status`, `ItemID`) VALUES
(1, 2, 1, '0000-00-00', 'OS Installation', 'Completed', 1),
(2, 3, 1, '0000-00-00', 'RAM Upgrade', 'In Progress', 4),
(3, 3, 2, '0000-00-00', 'Disk Cleaning', 'New', 5),
(4, 6, NULL, NULL, 'its a test case', NULL, NULL),
(5, 6, NULL, NULL, 'test case 2', 'New', NULL),
(6, 6, NULL, NULL, '123`', 'New', NULL),
(7, NULL, 3, '2024-01-15', 'qwerty', 'New', NULL),
(8, 6, 2, '2024-01-30', 'knjeciuwci', 'New', NULL),
(9, 6, 3, '2024-01-30', 'uciwcu', 'New', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `technicians`
--

DROP TABLE IF EXISTS `technicians`;
CREATE TABLE IF NOT EXISTS `technicians` (
  `TechnicianID` int NOT NULL AUTO_INCREMENT,
  `FirstName` varchar(50) DEFAULT NULL,
  `LastName` varchar(50) DEFAULT NULL,
  `Email` varchar(50) DEFAULT NULL,
  `Phone` varchar(20) DEFAULT NULL,
  `Password` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`TechnicianID`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `technicians`
--

INSERT INTO `technicians` (`TechnicianID`, `FirstName`, `LastName`, `Email`, `Phone`, `Password`) VALUES
(3, 'Joyce', 'Ndaki', 'joyce.ndaki@techmaintener.com', '853557898', 'jn@tm2001'),
(2, 'Richard', 'Simone', 'richard.simone@techmaintener.com', '844332211', 'rs@tm2001'),
(1, 'Sabrina', 'Msuya', 'smsuya@techmaintener.com', '811223344', 'sm@tm2001');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
