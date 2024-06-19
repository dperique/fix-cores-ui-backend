package main

// Demostrate CORS middleware in Go

import (
	"encoding/json"
	"net/http"
)

func main() {
	allowedOrigin := "*"
	http.HandleFunc("/", corsMiddleware(allowedOrigin, func(w http.ResponseWriter, r *http.Request) {
		helloString := "Hello, world!"
		json.NewEncoder(w).Encode(helloString)
	}))

	http.HandleFunc("/api/users", corsMiddleware(allowedOrigin, getUsers))

	http.ListenAndServe(":8080", nil)
}

func corsMiddleware(origin string, next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", origin)
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == "OPTIONS" {

			// Process the Preflight request
			w.WriteHeader(http.StatusOK)
			return
		}

		// Call the next handler
		next(w, r)
	}
}

func getUsers(w http.ResponseWriter, r *http.Request) {
	if r.Method != "GET" {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	users := []string{"User1", "User2", "User3"}
	json.NewEncoder(w).Encode(users)
}