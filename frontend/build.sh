git pull
VERSION="1.1.0"
kubectl delete deploy -n frontend-namespace frontend-deployment --grace-period 0 --force
sudo docker build --no-cache -t r.deso.tech/3tier/frontend:$VERSION .
sudo docker push r.deso.tech/3tier/frontend:$VERSION
kubectl apply -f ../kubernetes/manifest.yaml
sleep 5
kubectl logs -n frontend-namespace -l app=frontend -f
