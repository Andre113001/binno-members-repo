-- MariaDB dump 10.19  Distrib 10.4.27-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: bicorse_db
-- ------------------------------------------------------
-- Server version	10.4.27-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admin_i`
--

DROP TABLE IF EXISTS `admin_i`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `admin_i` (
  `admin_id` varchar(40) NOT NULL,
  `admin_dateadded` datetime DEFAULT NULL,
  `admin_accesskey` varchar(45) DEFAULT NULL,
  `admin_pass` varchar(45) DEFAULT NULL,
  `admin_flag` tinyint(4) DEFAULT NULL,
  `admin_lastaccessed` datetime DEFAULT NULL,
  PRIMARY KEY (`admin_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin_i`
--

LOCK TABLES `admin_i` WRITE;
/*!40000 ALTER TABLE `admin_i` DISABLE KEYS */;
/*!40000 ALTER TABLE `admin_i` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `application_i`
--

DROP TABLE IF EXISTS `application_i`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `application_i` (
  `app_id` varchar(6) NOT NULL,
  `app_institution` varchar(100) NOT NULL,
  `app_email` varchar(150) NOT NULL,
  `app_address` varchar(150) NOT NULL,
  `app_type` varchar(50) NOT NULL,
  `app_class` varchar(100) DEFAULT NULL,
  `app_flag` tinyint(4) NOT NULL DEFAULT 1,
  `app_dateadded` datetime DEFAULT NULL,
  `app_token` varchar(250) DEFAULT NULL,
  `app_token_valid` datetime DEFAULT NULL,
  PRIMARY KEY (`app_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `application_i`
--

LOCK TABLES `application_i` WRITE;
/*!40000 ALTER TABLE `application_i` DISABLE KEYS */;
INSERT INTO `application_i` VALUES ('1095f7','BeeCALL','beecall@email.com','Naga City, Naga','Enabler','TBI',1,'2023-12-24 02:09:13','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMDk1ZjciLCJ1c2VyRW1haWwiOiJiZWVjYWxsQGVtYWlsLmNvbSIsImlhdCI6MTcwMzM1NDk1MywiZXhwIjoxNzAzNjE0MTUzfQ.-n7r0K7IoyuL87Kp5WCstGG0BofTAiESgcMwyHTnSFE','2023-12-27 02:09:13'),('9139a5','BiNNO','marcusandre.genorga@gmail.com','Legazpi City, Albay','Company','NULL',1,'2023-12-24 02:07:05','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI5MTM5YTUiLCJ1c2VyRW1haWwiOiJtYXJjdXNhbmRyZS5nZW5vcmdhQGdtYWlsLmNvbSIsImlhdCI6MTcwMzM1NDgyNSwiZXhwIjoxNzAzNjE0MDI1fQ.CGDduS4rL02inIIc7Ye4mPzbL5bEmPmcxwcWua4FfUw','2023-12-27 02:07:05'),('9a52c2','Leapod','seantrent@gmail.com','Legazpi City, Albay','Company','NULL',1,'2023-12-24 02:08:25','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI5YTUyYzIiLCJ1c2VyRW1haWwiOiJzZWFudHJlbnRAZ21haWwuY29tIiwiaWF0IjoxNzAzMzU0OTA1LCJleHAiOjE3MDM2MTQxMDV9.hs63RNW9JsJjIL3e58ARis_pNTo9CwWj13KVr3PAf6w','2023-12-27 02:08:25');
/*!40000 ALTER TABLE `application_i` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blog_i`
--

DROP TABLE IF EXISTS `blog_i`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `blog_i` (
  `blog_id` varchar(40) NOT NULL,
  `blog_author` varchar(40) NOT NULL,
  `blog_dateadded` datetime NOT NULL,
  `blog_title` varchar(80) NOT NULL,
  `blog_content` text NOT NULL,
  `blog_flag` tinyint(4) NOT NULL DEFAULT 1,
  `blog_lastmodified` datetime DEFAULT NULL,
  PRIMARY KEY (`blog_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blog_i`
--

LOCK TABLES `blog_i` WRITE;
/*!40000 ALTER TABLE `blog_i` DISABLE KEYS */;
INSERT INTO `blog_i` VALUES ('1','8','2023-11-15 00:00:00','Heading','New Update',1,'2023-11-15 02:27:22'),('14','1','2023-11-15 22:35:25','Number 14 #2','Updated Number 14 #2',1,'2023-11-15 22:36:26'),('2','8','2023-11-15 01:27:27','No!','Bruh',1,'2023-11-15 02:20:05'),('3','8','2023-11-15 01:28:19','No!','This is a new Content',1,NULL),('4','8','2023-11-15 01:28:33','Number 4 #2','Updated Number 4 #2',1,'2023-11-16 01:31:31'),('5','8','2023-11-15 01:29:43','No!','This is a new Content',1,NULL),('6','8','2023-11-15 01:30:53','No!','This is a new Content',1,NULL),('d510b14f-3ba5-4c21-a72b-c5e98a62f83e','8','2023-11-21 05:19:59','Look New ID! (Updated)','Hhahahhaha (Updated)',1,'2023-11-21 05:20:19');
/*!40000 ALTER TABLE `blog_i` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `email_i`
--

DROP TABLE IF EXISTS `email_i`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `email_i` (
  `email_id` varchar(40) NOT NULL,
  `email_datecreated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `email_address` text DEFAULT NULL,
  `email_user_type` varchar(45) DEFAULT NULL,
  `email_subscribe` tinyint(4) DEFAULT 1,
  `email_flag` tinyint(4) NOT NULL DEFAULT 1,
  PRIMARY KEY (`email_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `email_i`
--

LOCK TABLES `email_i` WRITE;
/*!40000 ALTER TABLE `email_i` DISABLE KEYS */;
INSERT INTO `email_i` VALUES ('1','2023-12-22 17:05:57','1130marcusa@gmail.com','member',1,1);
/*!40000 ALTER TABLE `email_i` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event_i`
--

DROP TABLE IF EXISTS `event_i`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `event_i` (
  `event_id` varchar(40) NOT NULL,
  `event_author` varchar(40) DEFAULT NULL,
  `event_datecreated` datetime DEFAULT NULL,
  `event_date` varchar(12) DEFAULT NULL,
  `event_title` varchar(255) DEFAULT NULL,
  `event_description` text DEFAULT NULL,
  `event_img` varchar(50) DEFAULT NULL,
  `event_flag` tinyint(4) NOT NULL DEFAULT 1,
  `event_datemodified` datetime DEFAULT NULL,
  PRIMARY KEY (`event_id`),
  KEY `event_i_author_index` (`event_author`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event_i`
--

LOCK TABLES `event_i` WRITE;
/*!40000 ALTER TABLE `event_i` DISABLE KEYS */;
INSERT INTO `event_i` VALUES ('1','8','2023-11-18 21:09:00','2023-19-2023','My Second title','My second Description','NULL',1,'2023-11-19 08:09:55'),('9137bb63-a40a-4d0f-9376-dbff1f3e32d2','8','2023-11-21 05:24:28','2023-19-2023','BiNNO Release (Updated New ID)','Bruhhh (Updated New ID)','../public/img/img.png',1,'2023-11-21 05:25:09');
/*!40000 ALTER TABLE `event_i` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `member_contact`
--

DROP TABLE IF EXISTS `member_contact`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `member_contact` (
  `contact_id` varchar(40) NOT NULL,
  `contact_datecreated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `contact_email` varchar(40) NOT NULL,
  `contact_number` varchar(9) DEFAULT NULL,
  `contact_facebook` text DEFAULT NULL,
  `contact_flag` tinyint(4) NOT NULL DEFAULT 1,
  PRIMARY KEY (`contact_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `member_contact`
--

LOCK TABLES `member_contact` WRITE;
/*!40000 ALTER TABLE `member_contact` DISABLE KEYS */;
INSERT INTO `member_contact` VALUES ('1','2023-11-10 01:31:00','1',NULL,'marcusandregenorga',1);
/*!40000 ALTER TABLE `member_contact` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `member_i`
--

DROP TABLE IF EXISTS `member_i`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `member_i` (
  `member_id` varchar(40) NOT NULL,
  `member_type` int(11) DEFAULT NULL,
  `member_datecreated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `member_accesskey` text DEFAULT NULL,
  `member_password` text DEFAULT NULL,
  `member_contact_id` varchar(40) DEFAULT NULL,
  `member_access` text DEFAULT NULL,
  `member_setting` varchar(40) DEFAULT NULL,
  `member_resetpassword_token` text DEFAULT NULL,
  `member_resetpassword_token_valid` datetime DEFAULT NULL,
  `member_twoauth` text DEFAULT NULL,
  `member_twoauth_valid` datetime DEFAULT NULL,
  `member_flag` tinyint(4) NOT NULL DEFAULT 0,
  PRIMARY KEY (`member_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `member_i`
--

LOCK TABLES `member_i` WRITE;
/*!40000 ALTER TABLE `member_i` DISABLE KEYS */;
INSERT INTO `member_i` VALUES ('8',1,'2024-01-03 08:14:55','da5511d2baa83c2e753852f1f2fba11003ed0c46c96820c7589b243a8ddb787a','$2b$10$BH1gZh6idSUK2SohUgh0I.315HmuqKQrHfjzUlsWdh9Z2Yx5f6suS','1','fa4451c0b261397d600d3cb7bc5ad247f0113a3efb5804b0fd9550e968134b4a','1','b1712066d924d0a99737c45c8e823fb053f0324f8a961c7f34bfed8d85047a11','2023-12-30 05:01:04',NULL,NULL,1);
/*!40000 ALTER TABLE `member_i` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `member_settings`
--

DROP TABLE IF EXISTS `member_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `member_settings` (
  `setting_id` int(11) NOT NULL AUTO_INCREMENT,
  `setting_bio` varchar(255) NOT NULL,
  `setting_color` varchar(50) DEFAULT NULL,
  `setting_profilepic` text NOT NULL,
  `setting_coverpic` text DEFAULT NULL,
  `user_type_flag` tinyint(4) NOT NULL DEFAULT 1,
  `setting_datemodified` datetime DEFAULT NULL,
  `setting_datecreated` datetime DEFAULT NULL,
  `setting_institution` varchar(150) DEFAULT NULL,
  `setting_status` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`setting_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `member_settings`
--

LOCK TABLES `member_settings` WRITE;
/*!40000 ALTER TABLE `member_settings` DISABLE KEYS */;
INSERT INTO `member_settings` VALUES (1,'NULL','#aeaeae','NULL','NULL',1,'2023-11-16 04:48:53','2023-11-15 00:00:00','BiNNO',1);
/*!40000 ALTER TABLE `member_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `member_type`
--

DROP TABLE IF EXISTS `member_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `member_type` (
  `user_type_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_type` varchar(50) DEFAULT NULL,
  `user_type_flag` tinyint(4) NOT NULL DEFAULT 1,
  PRIMARY KEY (`user_type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `member_type`
--

LOCK TABLES `member_type` WRITE;
/*!40000 ALTER TABLE `member_type` DISABLE KEYS */;
INSERT INTO `member_type` VALUES (0,'Admin',1),(1,'Startup Company',1),(2,'Startup Enabler',1),(3,'Newsletter Subscriber',1);
/*!40000 ALTER TABLE `member_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notification_i`
--

DROP TABLE IF EXISTS `notification_i`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notification_i` (
  `notif_id` varchar(40) NOT NULL,
  `notif_date` datetime NOT NULL,
  `notif_text` varchar(255) NOT NULL,
  `notif_reciepient` int(11) NOT NULL,
  `notif_flag` tinyint(4) NOT NULL DEFAULT 1,
  PRIMARY KEY (`notif_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notification_i`
--

LOCK TABLES `notification_i` WRITE;
/*!40000 ALTER TABLE `notification_i` DISABLE KEYS */;
/*!40000 ALTER TABLE `notification_i` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notification_type`
--

DROP TABLE IF EXISTS `notification_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notification_type` (
  `notif_type_id` varchar(40) NOT NULL,
  PRIMARY KEY (`notif_type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notification_type`
--

LOCK TABLES `notification_type` WRITE;
/*!40000 ALTER TABLE `notification_type` DISABLE KEYS */;
/*!40000 ALTER TABLE `notification_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `post_category`
--

DROP TABLE IF EXISTS `post_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `post_category` (
  `category_id` int(11) NOT NULL AUTO_INCREMENT,
  `category_dateadded` datetime NOT NULL,
  `category_name` varchar(20) DEFAULT NULL,
  `category_flag` tinyint(4) NOT NULL DEFAULT 1,
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post_category`
--

LOCK TABLES `post_category` WRITE;
/*!40000 ALTER TABLE `post_category` DISABLE KEYS */;
INSERT INTO `post_category` VALUES (1,'2024-01-01 00:00:00','Milestone',1),(2,'2024-01-01 00:00:00','Promotion',1);
/*!40000 ALTER TABLE `post_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `post_i`
--

DROP TABLE IF EXISTS `post_i`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `post_i` (
  `post_id` varchar(40) NOT NULL,
  `post_dateadded` datetime NOT NULL,
  `post_author` varchar(40) NOT NULL,
  `post_category` varchar(50) DEFAULT NULL,
  `post_heading` varchar(100) DEFAULT NULL,
  `post_bodytext` text DEFAULT NULL,
  `post_flag` tinyint(4) DEFAULT NULL,
  `post_datemodified` datetime DEFAULT NULL,
  PRIMARY KEY (`post_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post_i`
--

LOCK TABLES `post_i` WRITE;
/*!40000 ALTER TABLE `post_i` DISABLE KEYS */;
INSERT INTO `post_i` VALUES ('1','2023-11-19 22:16:48','8','1st Milestone (Updated)','My first Post (Updated)','This is the content of the my first post',NULL,'2023-11-19 22:21:48');
/*!40000 ALTER TABLE `post_i` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `program_i`
--

DROP TABLE IF EXISTS `program_i`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `program_i` (
  `program_id` varchar(40) NOT NULL,
  `program_dateadded` datetime NOT NULL,
  `program_author` int(11) NOT NULL,
  `program_heading` varchar(255) DEFAULT NULL,
  `program_description` text DEFAULT NULL,
  `program_datemodified` datetime DEFAULT NULL,
  `post_type_flag` tinyint(4) NOT NULL DEFAULT 1,
  PRIMARY KEY (`program_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `program_i`
--

LOCK TABLES `program_i` WRITE;
/*!40000 ALTER TABLE `program_i` DISABLE KEYS */;
INSERT INTO `program_i` VALUES ('2','2023-11-20 14:56:19',8,'My first program (Updated)','Lol (Updated)','2023-11-20 14:57:18',1),('4f456a3a-bd0d-4496-9728-1757993b5909','2023-12-29 23:17:34',8,'How to be a better son to a gay father','a description from marcus','2023-12-29 23:19:02',1);
/*!40000 ALTER TABLE `program_i` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `program_pages`
--

DROP TABLE IF EXISTS `program_pages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `program_pages` (
  `program_pages_id` int(11) NOT NULL AUTO_INCREMENT,
  `program_id` int(11) DEFAULT NULL,
  `program_pages_dateadded` datetime DEFAULT NULL,
  `program_pages_title` varchar(255) DEFAULT NULL,
  `program_pages_path` varchar(50) DEFAULT NULL,
  `program_pages_flag` tinyint(4) NOT NULL DEFAULT 1,
  `program_pages_datemodified` datetime DEFAULT NULL,
  PRIMARY KEY (`program_pages_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `program_pages`
--

LOCK TABLES `program_pages` WRITE;
/*!40000 ALTER TABLE `program_pages` DISABLE KEYS */;
INSERT INTO `program_pages` VALUES (3,2,'2023-11-20 15:04:42','My first page (Updated)','../public/dsds.json',1,'2023-11-20 15:05:19'),(4,2,'2023-11-20 15:05:52','My second page (Updated)','../public/dsds2.json',1,NULL);
/*!40000 ALTER TABLE `program_pages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `schedule_i`
--

DROP TABLE IF EXISTS `schedule_i`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `schedule_i` (
  `sched_id` varchar(40) NOT NULL,
  `sched_dateadded` datetime DEFAULT NULL,
  `sched_zoomlink` text DEFAULT NULL,
  `sched_date` date NOT NULL,
  `sched_appid` text NOT NULL,
  `sched_timestart` time DEFAULT NULL,
  `sched_timedue` time DEFAULT NULL,
  `sched_datemodified` datetime DEFAULT NULL,
  `sched_flag` tinyint(4) NOT NULL DEFAULT 1,
  PRIMARY KEY (`sched_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `schedule_i`
--

LOCK TABLES `schedule_i` WRITE;
/*!40000 ALTER TABLE `schedule_i` DISABLE KEYS */;
INSERT INTO `schedule_i` VALUES ('2feed99c-e45b-45d8-9622-42fea96bc195','2023-12-30 00:20:57','https://zoom.cum','2023-01-27','1095f7','12:00:00','13:00:00','2024-01-23 00:00:00',1),('7c3c00a0-cdc6-40e5-aee9-520fe025ae2f','2024-01-02 03:28:50','https://zoom.com/ads-sds','2024-01-10','9139a5','15:00:00','16:00:00',NULL,1),('asfasfasfasaf','2024-01-02 04:15:00','','2024-01-10','9a52c2','19:45:00','20:00:00',NULL,1);
/*!40000 ALTER TABLE `schedule_i` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `test`
--

DROP TABLE IF EXISTS `test`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `test` (
  `test_id` int(11) NOT NULL,
  `test_txt` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`test_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `test`
--

LOCK TABLES `test` WRITE;
/*!40000 ALTER TABLE `test` DISABLE KEYS */;
INSERT INTO `test` VALUES (1,'1.json');
/*!40000 ALTER TABLE `test` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-01-03 23:21:18
