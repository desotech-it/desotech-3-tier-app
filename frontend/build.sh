git pull
VERSION="1.1.0"
sudo docker build --no-cache -t r.deso.tech/3tier/frontend:$VERSION .
sudo docker push r.deso.tech/3tier/frontend:$VERSION
kubectl delete pod -l app=frontend -n frontend-namespace
sleep 5
kubectl logs -n frontend-namespace -l app=frontend -f
