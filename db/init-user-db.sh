#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL

	create table country_and_capitals (
		country text,
		capital text
	);

	insert into country_and_capitals(country, capital) values ('Italia', 'Roma');
	insert into country_and_capitals(country, capital) values ('France', 'Paris');
	insert into country_and_capitals(country, capital) values ('UK', 'London');
	insert into country_and_capitals(country, capital) values ('Germany', 'Berlin');

EOSQL
