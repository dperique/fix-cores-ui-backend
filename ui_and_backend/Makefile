# Define variables
IMAGE_NAME=docker.io/dperique/cors-ui2
TAG=latest
DOCKERFILE_PATH=./ui2/Dockerfile
APP_NAME=cors-ui2
NAMESPACE=default
KUBE_DEPLOYMENT_FILE=./deployment-ui2.yaml
KUBE_SERVICE_FILE=./service-ui2.yaml
KUBE_INGRESS_FILE=./ingress-ui2.yaml

# Default target
.PHONY: all
all: build tag push deploy

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
