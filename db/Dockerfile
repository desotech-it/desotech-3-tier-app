# FROM r.deso.tech/dockerhub/library/postgres:15.3-alpine
# ENV POSTGRES_USER deso_user
# ENV POSTGRES_PASSWORD deso_pass
# ENV POSTGRES_DB deso_db
# COPY docker-entrypoint-initdb.d /docker-entrypoint-initdb.d



# dump build stage
FROM r.deso.tech/dockerhub/library/postgres:15.3-alpine as dumper

COPY /docker-entrypoint-initdb.d/init-user-db.sh /docker-entrypoint-initdb.d/

RUN ["sed", "-i", "s/exec \"$@\"/echo \"skipping...\"/", "/usr/local/bin/docker-entrypoint.sh"]

ENV POSTGRES_USER deso_user
ENV POSTGRES_PASSWORD deso_pass
ENV PGDATA=/data

RUN ["/usr/local/bin/docker-entrypoint.sh", "postgres"]

# final build stage
FROM r.deso.tech/dockerhub/library/postgres:15.3-alpine
COPY --from=dumper /data $PGDATA