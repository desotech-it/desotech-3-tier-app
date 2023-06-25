git pull
VERSION="1.1.0"
kubectl delete deploy -n backend-namespace backend-deployment --grace-period 0 --force
sudo docker build --no-cache -t r.deso.tech/3tier/backend:$VERSION .
sudo docker push r.deso.tech/3tier/backend:$VERSION
kubectl apply -f ../kubernetes/manifest.yaml
sleep 5
kubectl logs -n backend-namespace -l app=backend -f
