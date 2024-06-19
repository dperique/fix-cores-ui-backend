# Fixing CORS for UI and Backend

This repository demonstrates how to fix CORS (Cross-Origin Resource Sharing) issues in a Node.js application where both the UI and backend are served from the same container.

TL;DR: see [this commit](https://github.com/dperique/fix-cores-ui-backend/commit/ba8318b73c7828f5849d00c62074cc2be803cbff) and see these changes:

```
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 7007;

// Configure CORS options
const corsOptions = {
    origin: '*', // Allow all origins (adjust this in a production environment)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
```

Essentially, you need to allow the domain for specific methods.  In this case, I allow all using the asterisk.  But you
could just allow a single one like this `origin: 'http://www.dennis.com'`.

## Directory Structure

```
├── Makefile
├── deployment-ui2.yaml
├── ingress-ui2.yaml
├── package-lock.json
├── service-ui2.yaml
└── ui2
├── Dockerfile
├── package-lock.json
├── package.json
├── public
│   └── index.html
└── ui.js
├── other_examples
│   ├── cores_backend.go
│   └── cores_backend.py
```

## Prerequisites

- Docker (or Podman)
- Node.js
- Kind (Kubernetes in Docker)
- kubectl

## Steps to Reproduce

### 1. Create the Kind Cluster

1. **Install Kind:**

   ```sh
   curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.11.1/kind-$(uname)-amd64
   chmod +x ./kind
   sudo mv ./kind /usr/local/bin/kind
   ```

2. **Create a Kind Cluster config:**

Create a kind cluster with a configuration that forwards ports:

kind-config.yaml:

   ```yaml
   kind: Cluster
   apiVersion: kind.x-k8s.io/v1alpha4
   nodes:
     - role: control-plane
       extraPortMappings:
         - containerPort: 80
           hostPort: 80
         - containerPort: 443
           hostPort: 443
   ```

3.  **Create the cluster:**

```bash
kind create cluster --config kind-config.yaml
```

### 2. **Set Up the Project**

Clone the Repository:

```bash
git clone https://github.com/dperique/fixing-cors-ui-backend.git
cd fixing-cors-ui-backend
```

Install Dependencies:

```bash
npm install
```


### 3. **Build, Tag, and Push the Docker Image**

Build the Docker Image:

```bash
podman build -t cors-ui2:latest .
```

Tag the Docker Image:

```bash
podman tag cors-ui2:latest docker.io/YOUR_DOCKER_USERNAME/cors-ui2:latest
```

Push the Docker Image:

```bash
podman push docker.io/YOUR_DOCKER_USERNAME/cors-ui2:latest
```

### 4. **Deploy the Application to Kubernetes**

Apply the Kubernetes Deployment:

```bash
kubectl apply -f ../deployment-ui2.yaml
kubectl apply -f ../service-ui2.yaml
kubectl apply -f ../ingress-ui2.yaml
```

Install the NGINX Ingress Controller:

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml
```

Label the Node for Ingress:

```bash
kubectl label node kind-control-plane ingress-ready=true
```

### 5. **Access the Application**

Add the Host Entry:

Ensure your /etc/hosts file on your local machine has the following entry:

```bash
sudo nano /etc/hosts
```

Add the following line:

```bash
192.168.1.52 www.dennis.com
```

Save and close the file.

Port Forward for Local Testing:

```bash
kubectl port-forward <pod-name> 7007:7007 &
```

Replace <pod-name> with the actual name of the pod running your cors-ui2 container.

Access the Application:

Open your browser and navigate to http://www.dennis.com. Click the "Get Users" button to verify the CORS setup.

### 6. **Automate with Makefile**

You can use the provided Makefile to automate the process.

Makefile:

```Makefile
# Define variables
IMAGE_NAME=docker.io/YOUR_DOCKER_USERNAME/cors-ui2
TAG=latest
DOCKERFILE_PATH=./ui2/Dockerfile
APP_NAME=cors-ui2
NAMESPACE=default
KUBE_DEPLOYMENT_FILE=./deployment-ui2.yaml
KUBE_SERVICE_FILE=./service-ui2.yaml
KUBE_INGRESS_FILE=./ingress-ui2.yaml

# Default target
.PHONY: all
all: build tag push deploy port-forward

# Build the Docker image
.PHONY: build
build:
	podman build -t $(APP_NAME) -f $(DOCKERFILE_PATH) ./ui2

# Tag the Docker image
.PHONY: tag
tag:
	podman tag $(APP_NAME):$(TAG) $(IMAGE_NAME):$(TAG)

# Push the Docker image to Docker Hub
.PHONY: push
push:
	podman push $(IMAGE_NAME):$(TAG)

# Delete the Kubernetes deployment
.PHONY: delete
delete:
	kubectl delete -f $(KUBE_DEPLOYMENT_FILE) --ignore-not-found=true

# Apply the Kubernetes deployment
.PHONY: apply
apply:
	kubectl apply -f $(KUBE_DEPLOYMENT_FILE)
	kubectl apply -f $(KUBE_SERVICE_FILE)
	kubectl apply -f $(KUBE_INGRESS_FILE)

# Deploy the application (delete and then apply)
.PHONY: deploy
deploy: delete apply

# Port-forward to access the application locally
.PHONY: port-forward
port-forward:
	# Get the pod name and run port-forward in the background
	POD_NAME=$$(kubectl get pods -l app=cors-simple-app -o jsonpath="{.items[0].metadata.name}") && \
	echo "Port-forwarding to pod: $$POD_NAME" && \
	kubectl port-forward $$POD_NAME 7007:7007 &

# Stop port-forward process
.PHONY: stop-port-forward
stop-port-forward:
	# Find and kill the port-forward process
	PF_PID=$$(ps aux | grep 'kubectl port-forward' | grep -v grep | awk '{print $$2}') && \
	if [ -n "$$PF_PID" ]; then \
	  echo "Stopping port-forward process: $$PF_PID"; \
	  kill $$PF_PID; \
	else \
	  echo "No port-forward process found"; \
	fi
```

Replace YOUR_DOCKER_USERNAME with your actual Docker Hub username in the Makefile and the instructions.

Additional Information

Stopping Port-Forward Process

To stop the port-forward process, use the provided stop-port-forward target:

```bash
make stop-port-forward
```

### 7. **Troubleshooting**

Ensure all dependencies are installed.
Verify that the kind cluster is running and the nodes are labeled correctly.
Check the logs for any errors using kubectl logs <pod-name>.
If you encounter any issues, feel free to open an issue on this repository.

### Other examples

There are two other examples in the [other_examples](./other_examples/) subdir for to and python.