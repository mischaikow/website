cd /home/ec2-user/website

echo 'Running git pull'
git pull
dt=$(date '+%d/%m/%Y %H:%M:%S')
echo 'git pull at' $dt

docker network create mischaikow-home

echo 'Building and deploying server'
cd /home/ec2-user/website
docker buildx build --no-cache -t site/server -f Dockerfile .
docker stop mischaikow-server
docker run --rm -d -p 3000:3000 \
    --network=mischaikow-home --name mischaikow-server --init site/server

sleep 30s
server=curl http://127.0.0.1:3000/healthcheck
dt=$(date '+%d/%m/%Y %H:%M:%S')
if [ $server == 'OK']
then
    echo 'Server is operating' $dt
else
    echo 'Server is NOT up and running -- check server' $dt
fi

echo 'Building and deploying reverse proxy'
cd /home/ec2-user/website/nginx
docker buildx build --no-cache -t site/nginx -f Dockerfile .
docker stop mischaikow-nginx
docker run --rm -d -p 80:80 -p 443:443 \
    --mount 'type=volume,src=letsencrypt_keys,dst=/etc/letsencrypt' \
    --network=mischaikow-home --name mischaikow-nginx --init site/nginx

sleep 15s
dt=$(date '+%d/%m/%Y %H:%M:%S')
if [ "$( docker container inspect -f '{{.State.Status}}' mischaikow-nginx)" = "running" ];
then
    echo 'Nginx up and running' $dt
else
    echo 'Nginx is NOT up and running -- check reverse proxy' $dt
fi

dt=$(date '+%d/%m/%Y %H:%M:%S')
echo 'Script complete at' $dt
unset dt
