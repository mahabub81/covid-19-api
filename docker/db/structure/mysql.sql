

DROP TABLE IF EXISTS `covid19`.`covid19_daywise_data`;
CREATE TABLE  `covid19`.`covid19_daywise_data` (
(
    id                  int auto_increment
        primary key,
    country_code_iso2   varchar(2)     null,
    country_region      varchar(255)   null,
    province_state      varchar(255)   null,
    confirmed           bigint         null,
    deaths              bigint         null,
    active              bigint         null,
    recovered           bigint         null,
    delta_confirmed     bigint         null,
    delta_recovered     bigint         null,
    incident_rate       decimal(10, 2) null,
    people_tested       bigint         null,
    people_hospitalized bigint         null,
    last_update         date           null,
    record_date         date           null
);

create index covid19_daywise_data_country_code_iso2_index
    on `covid19`.`covid19_daywise_data` (country_code_iso2);

create index covid19_daywise_data_record_date_index
    on `covid19`.`covid19_daywise_data` (record_date);


