FROM postgres:13-alpine
ENV POSTGRES_USER deso_user
ENV POSTGRES_PASSWORD deso_user
ENV POSTGRES_DB deso_db
COPY init_sql_scripts/init.sql /docker-entrypoint-initdb.d/init.sql

