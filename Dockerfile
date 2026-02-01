FROM node:alpine AS builder
RUN apk add --no-cache bash
WORKDIR /app
COPY . .
RUN bash scripts/build.sh

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html/
RUN chmod -R 755 /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
