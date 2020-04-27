DROP TABLE IF EXISTS `covid19`.`covid19_daywise_data`;

CREATE TABLE  `covid19`.`covid19_daywise_data` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `country_code_iso2` varchar(2) DEFAULT NULL,
  `province_state` varchar(255) DEFAULT NULL,
  `country_region` varchar(255) DEFAULT NULL,
  `confirmed` bigint(20) DEFAULT NULL,
  `deaths` bigint(20) DEFAULT NULL,
  `last_update` timestamp NULL DEFAULT NULL,
  `recovered` bigint(20) DEFAULT NULL,
  `record_date` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `covid19_daywise_data_country_code_iso2_index` (`country_code_iso2`),
  KEY `covid19_daywise_data_record_date_index` (`record_date`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


