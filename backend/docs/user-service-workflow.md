# User Service Workflow

## User Registration

### Actors
- Frontend (Client)
- User Routes
- User Controller
- User Service
- User Repository

### Workflow
1. **Frontend** sends a POST request to `/users/register` endpoint with user data (email, password, name)
2. **User Routes** receives the request and validates the request body format and required fields
3. **User Routes** calls the controller method `createUser()`
4. **User Controller** validates the user data structure and required fields format
5. **User Controller** calls the service method `createUser(userData)`
6. **User Service** validates user data format (email format, password strength, etc.)
7. **User Service** checks for duplicate email/user existence
8. **User Service** hashes the password before storage
9. **User Service** calls the repository method `create(user)` to save the user to the database
10. **User Repository** creates the user in the database
11. **User Repository** returns the created user data to the **User Service**
12. **User Service** returns the user data to the **User Controller** (excluding sensitive information)
13. **User Controller** returns the user data to **User Routes**
14. **User Routes** returns the user data to **Frontend**

### Data Flow
- Request: POST `/users/register` with user registration data
- Repository Operation: `create(user)`
- Response: Created user object with details (excluding sensitive information like password)

### Validation Points
- **User Routes**: Validates request body format, content type, and presence of required fields
- **User Controller**: Validates data structure and field types
- **User Service**: Validates data format (email pattern, password strength), checks for duplicates
- **User Repository**: Validates data integrity constraints at database level

### Success Path
- All components successfully pass data between each other
- User is successfully created in the database
- Frontend receives the complete user information

### Error Path
- Invalid request format results in 400 error at route level
- Invalid data format (email, password) results in 400 error at service level
- Duplicate email results in 409 error at service level
- Database constraint violations result in 409/500 errors

## User Login

### Actors
- Frontend (Client)
- User Routes
- User Controller
- User Service
- User Repository

### Workflow
1. **Frontend** sends a POST request to `/users/login` endpoint with login credentials (email, password)
2. **User Routes** receives the request and validates the request body format and required fields
3. **User Routes** calls the controller method `loginUser()`
4. **User Controller** validates the login credentials structure and required fields format
5. **User Controller** calls the service method `loginUser(credentials)`
6. **User Service** validates the email format and password presence
7. **User Service** calls the repository method `findByEmail(email)` to retrieve user from the database
8. **User Repository** retrieves the user data from the database
9. **User Repository** returns the user data to the **User Service**
10. **User Service** compares the provided password with the hashed password
11. **User Service** generates a JWT token if credentials are valid
12. **User Service** returns user data and token to the **User Controller**
13. **User Controller** returns the response to **User Routes**
14. **User Routes** returns the response to **Frontend**

### Data Flow
- Request: POST `/users/login` with email and password
- Repository Query: `findByEmail(email)`
- Response: User object with JWT token

### Validation Points
- **User Routes**: Validates request body format and presence of required login fields
- **User Controller**: Validates credentials structure and field types
- **User Service**: Validates email format, password presence, and credentials validity
- **User Repository**: Validates data integrity constraints at database level

### Success Path
- All components successfully pass data between each other
- User credentials are valid
- Frontend receives user information with JWT token

### Error Path
- Invalid request format results in 400 error at route level
- Invalid credentials result in 401 error at service level
- Database constraint violations result in 409/500 errors

## Get User Profile

### Actors
- Frontend (Client)
- User Routes
- User Controller
- User Service
- User Repository

### Workflow
1. **Frontend** sends a GET request to `/users/profile` endpoint with authentication token
2. **User Routes** receives the request and validates the authentication token format
3. **User Routes** authenticates the user using the provided token
4. **User Routes** calls the controller method `getUserProfile()`
5. **User Controller** validates the authenticated user context
6. **User Controller** calls the service method `getUserProfile(userId)`
7. **User Service** validates the user ID and access permissions
8. **User Service** calls the repository method `findById(userId)` to retrieve user from the database
9. **User Repository** retrieves the user data from the database
10. **User Repository** returns the user data to the **User Service**
11. **User Service** returns the user profile (excluding sensitive information) to the **User Controller**
12. **User Controller** returns the user profile to **User Routes**
13. **User Routes** returns the user profile to **Frontend**

### Data Flow
- Request: GET `/users/profile` with authentication token
- Repository Query: `findById(userId)`
- Response: User profile information (excluding sensitive data)

### Validation Points
- **User Routes**: Validates authentication token format and validity
- **User Controller**: Validates authenticated user context
- **User Service**: Validates user ID format and access permissions
- **User Repository**: Validates data integrity constraints at database level

### Success Path
- All components successfully pass data between each other
- User is authenticated and authorized
- Frontend receives user profile information

### Error Path
- Invalid token format results in 401 error at route level
- Unauthorized access results in 403 error at service level
- Database constraint violations result in 409/500 errors