VERSION="1.1.0"
sudo docker build --no-cache -t r.deso.tech/3tier/db:$VERSION .
sudo docker push r.deso.tech/3tier/db:$VERSION
kubectl delete pod -l app=db -n db-namespace
sleep 10
kubectl logs -n db-namespace -l app=db -f
