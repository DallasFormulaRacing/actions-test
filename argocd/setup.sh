# ArgoCD + Tailscale K8s Operator Setup
# Run these once on the cluster (after you're on the tailnet)

# ── 1. Install ArgoCD ────────────────────────────────────────────────────────
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Wait for ArgoCD to be ready
kubectl wait --for=condition=available --timeout=120s deployment/argocd-server -n argocd

# Get the initial admin password
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d; echo

# ── 2. Expose ArgoCD UI via Tailscale ────────────────────────────────────────
# Patch the argocd-server service with a Tailscale annotation
kubectl patch svc argocd-server -n argocd -p '{"metadata":{"annotations":{"tailscale.com/expose":"true","tailscale.com/hostname":"argocd"}}}'
# ArgoCD UI will be at: https://argocd.<tailnet>.ts.net

# ── 3. Install the Tailscale K8s Operator ────────────────────────────────────
# (if not already installed — needed for the tailscale.com/expose annotations to work)
helm repo add tailscale https://pkgs.tailscale.com/helmcharts
helm repo update
helm upgrade \
  --install \
  tailscale-operator \
  tailscale/tailscale-operator \
  --namespace=tailscale \
  --create-namespace \
  --set-string oauth.clientId="<TS_OAUTH_CLIENT_ID>" \
  --set-string oauth.clientSecret="<TS_OAUTH_CLIENT_SECRET>" \
  --wait

# ── 4. Apply the K8s Secret (do this before ArgoCD syncs) ───────────────────
# Fill in deployments/car-sensor-secrets.yaml first, then:
kubectl apply -f deployments/car-sensor-secrets.yaml

# ── 5. Register the GitHub repo with ArgoCD (if private) ────────────────────
argocd repo add https://github.com/<YOUR_ORG>/<YOUR_REPO>.git \
  --username <github-user> \
  --password <github-pat>

# ── 6. Apply the ArgoCD Application manifest ────────────────────────────────
kubectl apply -f argocd/application.yaml -n argocd

# ArgoCD will now watch 'deployments/' in your repo.
# Every time CI pushes a new image and CD updates deployment.yaml,
# ArgoCD will auto-sync and roll out the new pods. Done!
