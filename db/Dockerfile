FROM r.deso.tech/dockerhub/library/postgres:15.3-alpine
ENV POSTGRES_USER deso_user
ENV POSTGRES_PASSWORD deso_pass
ENV POSTGRES_DB deso_db
COPY init-user-db.sh /docker-entrypoint-initdb.d/init-user-db.sh
