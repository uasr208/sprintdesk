# 🔌 SprintDesk — API Documentation

SprintDesk integrates with JSONPlaceholder and custom simulated endpoints to manage user sessions, task board operations, and real-time notification streams.

---

## 🔑 Authentication Endpoints (Simulated REST)

### 1. User Login

- **Endpoint:** `POST /auth/login`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "username": "demo@sprintdesk.com",
    "password": "Password123!",
    "rememberMe": true
  }
  Response (200 OK):
  ```

JSON
{
"accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
"refreshToken": "ref_8f9a2b3c4d5e...",
"user": {
"id": "usr_01",
"name": "Demo User",
"email": "demo@sprintdesk.com"
}
} 2. Silent Token Refresh
Endpoint: POST /auth/refresh

Headers: Content-Type: application/json

Request Body:

JSON
{
"refreshToken": "ref_8f9a2b3c4d5e..."
}
Response (200 OK):

JSON
{
"accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
}
📋 Board & Task Endpoints
Fetch Initial Tasks
Endpoint: GET https://jsonplaceholder.typicode.com/todos?_limit=30

Headers: Authorization: Bearer <accessToken>

Response (200 OK):

JSON
[
{
"userId": 1,
"id": 1,
"title": "delectus aut autem",
"completed": false
}
]
🔔 Real-Time Notification Polling
Poll Notification Stream
Endpoint: GET https://jsonplaceholder.typicode.com/posts?_limit=5

Polling Interval: 15 seconds (automatically paused when document visibilityState is hidden).

Response (200 OK):

JSON
[
{
"userId": 1,
"id": 101,
"title": "New Sprint Task Assigned",
"body": "You were assigned to task SD-104 by SprintMaster"
}
]
🛡️ Header Interceptor Rules
All outgoing requests sent through the Axios client instance automatically inject the Authorization header if an access token is present in memory:

HTTP
Authorization: Bearer <accessToken>
