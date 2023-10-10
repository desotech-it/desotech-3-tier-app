FROM r.deso.tech/dockerhub/library/postgres:15.3-alpine


COPY ./docker-entrypoint-initdb.d/init.sh /docker-entrypoint-initdb.d
COPY test_dump.sql /dump.sql

ENV POSTGRES_USER deso_user
ENV POSTGRES_PASSWORD deso_pass
ENV POSTGRES_DB deso_db

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["postgres"]
