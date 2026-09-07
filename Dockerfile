FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG VITE_API_BASE_URL=https://665de6d7e88051d60408c32d.mockapi.io
ARG VITE_BASE=/
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_BASE=$VITE_BASE

RUN npm run build

FROM nginx:1.27-alpine AS runtime

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
