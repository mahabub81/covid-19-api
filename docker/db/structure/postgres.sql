-- auto-generated definition
create table public.covid19_daywise_data
(
    id                serial           not null
        constraint covid19_daywise_data_pk
            primary key,
    country_code_iso2 varchar(2),
    province_state    varchar(255),
    country_region    varchar(255),
    confirmed         bigint default 0 not null,
    deaths            bigint default 0 not null,
    recovered         bigint default 0,
    last_update       timestamp,
    record_date       date
);


create index covid19_daywise_data_country_code_iso2_index
    on public.covid19_daywise_data (country_code_iso2);

create index covid19_daywise_data_record_date_index
    on public.covid19_daywise_data (record_date);