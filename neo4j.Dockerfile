FROM neo4j:5.16.0-enterprise

ARG UID=1000
ARG GID=1000

RUN usermod -u $UID neo4j && \
    groupmod -g $GID neo4j
