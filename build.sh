VERSION="1.1.0"

sudo docker build --no-cache -t r.deso.tech/3tier/frontend:$VERSION frontend/.
sudo docker push r.deso.tech/3tier/frontend:$VERSION

sudo docker build --no-cache -t r.deso.tech/3tier/backend:$VERSION backend/.
sudo docker push r.deso.tech/3tier/backend:$VERSION

sudo docker build --no-cache -t r.deso.tech/3tier/db:$VERSION db/.
sudo docker push r.deso.tech/3tier/db:$VERSION