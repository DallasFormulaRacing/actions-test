# CI/CD Pipeline — Car Sensor Project

Full GitOps CI/CD pipeline using **GitHub Actions → DockerHub → ArgoCD → K8s** with **Tailscale** for secure access.

---

## How the pipeline works

```
git push → CI builds Docker image (tagged with git SHA)
         → pushes to aymanhaq/car-sensor-api:<sha>
         → CD patches deployment.yaml with new tag
         → ArgoCD detects the git change
         → K8s rolls out new pods automatically
```

---

## GitHub Secrets required

Add these in **Settings → Secrets and variables → Actions**:

| Secret | Value |
|---|---|
| `DOCKERHUB_USERNAME` | `aymanhaq` |
| `DOCKERHUB_TOKEN` | Ayman's DockerHub access token |
| `GH_PAT` | GitHub Personal Access Token (repo scope) — needed so the CD workflow can push the updated `deployment.yaml` |

---

## Files added / changed

```
.github/
  workflows/
    ci.yml              ← Runs tests, builds Docker image, pushes with SHA tag
    cd.yml              ← Updates deployment.yaml; ArgoCD picks it up

Dockerfile              ← Fixed (was pointing at wrong path)

deployments/
  deployment.yaml       ← Upgraded: resource limits, health probes, secret refs
  svc.yaml              ← Tailscale annotation to expose on tailnet
  car-sensor-secrets.yaml  ← Template: apply manually, DO NOT commit with real values

argocd/
  application.yaml      ← Links your GitHub repo to the cluster (apply once)
  setup.sh              ← Step-by-step cluster setup commands
```

---

## One-time setup checklist

- [ ] Add GitHub Secrets (`DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN`, `GH_PAT`)
- [ ] Fill in `deployments/car-sensor-secrets.yaml` with base64-encoded values and `kubectl apply` it
- [ ] Install Tailscale K8s operator (see `argocd/setup.sh`)
- [ ] Install ArgoCD (see `argocd/setup.sh`)
- [ ] Update `repoURL` in `argocd/application.yaml` with your actual GitHub repo URL
- [ ] `kubectl apply -f argocd/application.yaml -n argocd`

After that — **just push to main** and everything rolls out automatically.

---

## Image tagging strategy

Every push produces two tags:
- `aymanhaq/car-sensor-api:<7-char-git-sha>` — immutable, what ArgoCD actually deploys
- `aymanhaq/car-sensor-api:latest` — always points to the most recent build

The SHA tag in `deployment.yaml` is what ArgoCD watches. The CD workflow updates it automatically on every successful CI run.

---

## Scaling

The deployment runs **3 replicas** by default with:
- CPU: 100m request / 500m limit per pod
- Memory: 128Mi request / 512Mi limit per pod
- Liveness + readiness probes on `GET /sensors`

To scale: `kubectl scale deployment car-sensor-api --replicas=5`
