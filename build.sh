VERSION="1.1.0"

sudo docker build --no-cache -t r.deso.tech/3tier/frontend:$VERSION .
sudo docker push r.deso.tech/3tier/frontend:$VERSION

sudo docker build --no-cache -t r.deso.tech/3tier/backend:$VERSION .
sudo docker push r.deso.tech/3tier/backend:$VERSION

sudo docker build --no-cache -t r.deso.tech/3tier/db:$VERSION .
sudo docker push r.deso.tech/3tier/db:$VERSION