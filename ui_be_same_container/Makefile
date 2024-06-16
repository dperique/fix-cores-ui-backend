# Define variables
IMAGE_NAME=docker.io/dperique/cors-ui2
TAG=latest
DOCKERFILE_PATH=./ui2/Dockerfile
APP_NAME=cors-ui2
NAMESPACE=default
KUBE_DEPLOYMENT_FILE=./deployment-ui2.yaml

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

# Deploy the application (delete and then apply)
.PHONY: deploy
deploy: delete apply

