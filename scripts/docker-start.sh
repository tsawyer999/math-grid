docker stop math-grid-app
docker rm -f math-grid-app
docker build --no-cache -t math-grid ..
docker run -d -p 8080:80 --name math-grid-app math-grid