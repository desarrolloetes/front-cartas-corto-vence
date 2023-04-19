ARG VERSION_NODE=16

FROM harbor.sb.cl/images/nodejs-alpine:${VERSION_NODE}

# Autor
MAINTAINER Mauricio Villagran Mora

# Se define como variable de ambiente directorio de trabajo
ENV appDir /var/www/app

# Se define como variable de ambiente que corra como productivo
ENV NODE_ENV=production

# Se define como variable de ambiente que el pool de hilos de libuv sea 50
ENV UV_THREADPOOL_SIZE=50

#Se especifica directorio de trabajo
WORKDIR ${appDir}

# Se crea el directorio antes definido
RUN mkdir -p $appDir

# Se empaqueta el código fuente
ADD . $appDir

RUN npm install -g npm@9.6.4

RUN npm config set registry "https://nexus-oss.sb.cl/repository/npmjs/"

# Se instalan dependencias especificadas en package.json
RUN rm -rf node_modules package-lock.json build\ && \
    npm cache clean --force && \
    npm install -D eslint-config-react-app --legacy-peer-deps --verbose && \ 
    npm run build

# Se define puerto a exponer
EXPOSE 3000

# Crear usuario
RUN adduser -D dockeruser

#Creamos archivo con serive account
RUN echo $SERVICE_ACCOUNT >> /var/www/app/sa.json

# Asignar permisos
RUN chown -R dockeruser /var/www/app

# Se define el usuario a ejecutar
USER dockeruser

# Se inicia aplicacion
ENTRYPOINT ["npm"]
CMD ["start"]
