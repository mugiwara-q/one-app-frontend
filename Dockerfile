#########################################################
# FRONTEND
#########################################################

# STAGE 1 : BUILD
FROM node:alpine AS build
WORKDIR /app/front
COPY . .
RUN npm install
RUN npm run build

#STAGE 2 : PROD
# Use Nginx as the production server
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf

# /!\ vite gives dist folder ; copy React app to Nginx's web server directory
COPY --from=build /app/front/dist /usr/share/nginx/html

# We need to make sure not to run the container as a NON ROOT user for better security
WORKDIR /app/front
RUN chown -R nginx:nginx /app/front && chmod -R 755 /app/front && \
        chown -R nginx:nginx /var/cache/nginx && \
        chown -R nginx:nginx /var/log/nginx && \
        chown -R nginx:nginx /etc/nginx/conf.d
RUN touch /var/run/nginx.pid && \
        chown -R nginx:nginx /var/run/nginx.pid
USER nginx

# Expose port for the Nginx server
EXPOSE 80

# Start Nginx when the container runs
CMD ["nginx", "-g", "daemon off;"]