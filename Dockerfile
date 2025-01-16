# Step 1: Build Stage
FROM node:18 AS build
WORKDIR /app

# Package.json과 Lock 파일 복사
COPY package*.json ./
RUN npm install

# 소스 코드 복사 및 빌드
COPY . ./
RUN npm run build

# Step 2: Serve Stage
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Nginx 기본 파일 삭제
RUN rm -rf ./*

# Build 파일 복사
COPY --from=build /app/build .

# 컨테이너가 사용하는 포트
EXPOSE 80

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]
