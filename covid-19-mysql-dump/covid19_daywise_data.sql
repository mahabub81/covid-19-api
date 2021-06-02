-- MySQL dump 10.13  Distrib 8.0.18, for Linux (x86_64)
--
-- Host: 127.0.0.1    Database: covid19
-- ------------------------------------------------------
-- Server version	5.7.30

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `covid19_daywise_data`
--

DROP TABLE IF EXISTS `covid19_daywise_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `covid19_daywise_data` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `country_code_iso2` varchar(2) DEFAULT NULL,
  `country_region` varchar(255) DEFAULT NULL,
  `province_state` varchar(255) DEFAULT NULL,
  `confirmed` bigint(20) DEFAULT NULL,
  `deaths` bigint(20) DEFAULT NULL,
  `active` bigint(20) DEFAULT NULL,
  `recovered` bigint(20) DEFAULT NULL,
  `delta_confirmed` bigint(20) DEFAULT NULL,
  `delta_recovered` bigint(20) DEFAULT NULL,
  `incident_rate` decimal(10,2) DEFAULT NULL,
  `people_tested` bigint(20) DEFAULT NULL,
  `people_hospitalized` bigint(20) DEFAULT NULL,
  `last_update` date DEFAULT NULL,
  `record_date` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `covid19_daywise_data_country_code_iso2_index` (`country_code_iso2`),
  KEY `covid19_daywise_data_record_date_index` (`record_date`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `covid19_daywise_data`
--

LOCK TABLES `covid19_daywise_data` WRITE;
/*!40000 ALTER TABLE `covid19_daywise_data` DISABLE KEYS */;
/*!40000 ALTER TABLE `covid19_daywise_data` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-06-02 15:10:01
