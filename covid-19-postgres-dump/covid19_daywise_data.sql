--
-- PostgreSQL database dump
--

-- Dumped from database version 11.6 (Debian 11.6-1.pgdg90+1)
-- Dumped by pg_dump version 11.7

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: covid19_daywise_data; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.covid19_daywise_data (
    id integer NOT NULL,
    country_code_iso2 character varying(2),
    province_state character varying(255),
    country_region character varying(255),
    confirmed bigint DEFAULT 0 NOT NULL,
    deaths bigint DEFAULT 0 NOT NULL,
    recovered bigint DEFAULT 0,
    last_update date,
    record_date date,
    active bigint,
    delta_confirmed bigint,
    delta_recovered bigint,
    incident_rate numeric,
    people_tested bigint,
    people_hospitalized bigint
);


ALTER TABLE public.covid19_daywise_data OWNER TO postgres;

--
-- Name: covid19_daywise_data_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.covid19_daywise_data_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.covid19_daywise_data_id_seq OWNER TO postgres;

--
-- Name: covid19_daywise_data_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.covid19_daywise_data_id_seq OWNED BY public.covid19_daywise_data.id;


--
-- Name: covid19_daywise_data id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.covid19_daywise_data ALTER COLUMN id SET DEFAULT nextval('public.covid19_daywise_data_id_seq'::regclass);


--
-- Data for Name: covid19_daywise_data; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.covid19_daywise_data (id, country_code_iso2, province_state, country_region, confirmed, deaths, recovered, last_update, record_date, active, delta_confirmed, delta_recovered, incident_rate, people_tested, people_hospitalized) FROM stdin;
\.


--
-- Name: covid19_daywise_data_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.covid19_daywise_data_id_seq', 77390261, true);


--
-- Name: covid19_daywise_data covid19_daywise_data_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.covid19_daywise_data
    ADD CONSTRAINT covid19_daywise_data_pk PRIMARY KEY (id);


--
-- Name: covid19_daywise_data_country_code_iso2_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX covid19_daywise_data_country_code_iso2_index ON public.covid19_daywise_data USING btree (country_code_iso2);


--
-- Name: covid19_daywise_data_record_date_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX covid19_daywise_data_record_date_index ON public.covid19_daywise_data USING btree (record_date);


--
-- PostgreSQL database dump complete
--

