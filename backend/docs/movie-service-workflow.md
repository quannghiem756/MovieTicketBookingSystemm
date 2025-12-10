# Movie Service Workflow

## Get All Movies

### Actors
- Frontend (Client)
- Movie Routes
- Movie Controller
- Movie Service
- MongoMovie Repository

### Workflow
1. **Frontend** sends a GET request to `/movies` endpoint with query parameters (page, limit)
2. **Movie Routes** receives the request and validates query parameters if present
3. **Movie Routes** calls the controller method `getAllMovies()`
4. **Movie Controller** validates the request parameters (page, limit values)
5. **Movie Controller** calls the service method `getAllMovies()`
6. **Movie Service** validates business logic constraints if applicable
7. **Movie Service** calls the repository method `findAll(page, limit)` to fetch movies from the database
8. **MongoMovie Repository** retrieves the movie data from the database
9. **MongoMovie Repository** returns the movie list to the **Movie Service**
10. **Movie Service** returns the movie list to the **Movie Controller**
11. **Movie Controller** returns the movie list to **Movie Routes**
12. **Movie Routes** returns the movie list to **Frontend**

### Data Flow
- Request: GET `/movies`
- Repository Query: `findAll(page, limit)`
- Response: List of movies with pagination

### Validation Points
- **Movie Routes**: Validates query parameters (page, limit) format and type
- **Movie Controller**: Validates parameter values (e.g., page >= 1, limit between 1-100)
- **Movie Service**: Validates business logic constraints before repository access

### Success Path
- All components successfully pass data between each other
- Frontend receives the complete movie list

### Error Path
- Invalid parameters result in appropriate error responses at validation points
- Repository errors result in service-level error handling

## Get Movie by ID

### Actors
- Frontend (Client)
- Movie Routes
- Movie Controller
- Movie Service
- MongoMovie Repository

### Workflow
1. **Frontend** sends a GET request to `/movies/:id` endpoint
2. **Movie Routes** receives the request and validates the movie ID format in the URL
3. **Movie Routes** calls the controller method `getMovieById()`
4. **Movie Controller** validates the movie ID parameter format
5. **Movie Controller** calls the service method `getMovieById(movieId)`
6. **Movie Service** validates the movie ID format and checks movie existence
7. **Movie Service** calls the repository method `findById(movieId)` to fetch the specific movie from the database
8. **MongoMovie Repository** retrieves the movie data from the database
9. **MongoMovie Repository** returns the movie to the **Movie Service**
10. **Movie Service** returns the movie to the **Movie Controller**
11. **Movie Controller** returns the movie to **Movie Routes**
12. **Movie Routes** returns the movie to **Frontend**

### Data Flow
- Request: GET `/movies/:id`
- Repository Query: `findById(movieId)`
- Response: Single movie object with details

### Validation Points
- **Movie Routes**: Validates movie ID format in URL path parameter
- **Movie Controller**: Validates movie ID parameter format and type
- **Movie Service**: Validates movie ID format and checks existence
- **MongoMovie Repository**: Validates data integrity constraints at database level

### Success Path
- All components successfully pass data between each other
- Frontend receives the requested movie information

### Error Path
- Invalid movie ID format results in 400 error at route level
- Movie not found results in 404 error at service level
- Repository errors result in service-level error handling

## Create Movie

### Actors
- Frontend (Client)
- Movie Routes
- Movie Controller
- Movie Service
- MongoMovie Repository

### Workflow
1. **Frontend** sends a POST request to `/movies` endpoint with movie data (title, description, duration, genre, etc.)
2. **Movie Routes** receives the request and validates the request body format and required fields
3. **Movie Routes** calls the controller method `createMovie()`
4. **Movie Controller** validates the movie data structure and required fields
5. **Movie Controller** calls the service method `createMovie(movieData)`
6. **Movie Service** validates movie data format (title length, description format, duration validity, etc.)
7. **Movie Service** checks for duplicate movie titles if required
8. **Movie Service** calls the repository method `create(movie)` to save the movie to the database
9. **MongoMovie Repository** creates the movie in the database
10. **MongoMovie Repository** returns the created movie data to the **Movie Service**
11. **Movie Service** returns the movie data to the **Movie Controller**
12. **Movie Controller** returns the movie data to **Movie Routes**
13. **Movie Routes** returns the movie data to **Frontend**

### Data Flow
- Request: POST `/movies` with movie data
- Repository Operation: `create(movie)`
- Response: Created movie object with details

### Validation Points
- **Movie Routes**: Validates request body format, content type, and presence of required fields
- **Movie Controller**: Validates data structure and field types
- **Movie Service**: Validates movie data format (title, duration, release date, etc.) and checks for duplicates
- **MongoMovie Repository**: Validates data integrity constraints at database level

### Success Path
- All components successfully pass data between each other
- Movie is successfully created in the database
- Frontend receives the complete movie information

### Error Path
- Invalid request format results in 400 error at route level
- Invalid movie data format results in 400 error at service level
- Duplicate movie title results in 409 error at service level
- Database constraint violations result in 409/500 errors

## Update Movie

### Actors
- Frontend (Client)
- Movie Routes
- Movie Controller
- Movie Service
- MongoMovie Repository

### Workflow
1. **Frontend** sends a PUT/PATCH request to `/movies/:id` endpoint with movie update data
2. **Movie Routes** receives the request and validates the movie ID format and request body
3. **Movie Routes** calls the controller method `updateMovie()`
4. **Movie Controller** validates the movie ID parameter and update data structure
5. **Movie Controller** calls the service method `updateMovie(movieId, updateData)`
6. **Movie Service** validates the movie ID format, update data, and checks movie existence
7. **Movie Service** calls the repository method `updateById(movieId, updateData)` to update the movie in the database
8. **MongoMovie Repository** updates the movie in the database
9. **MongoMovie Repository** returns the updated movie data to the **Movie Service**
10. **Movie Service** returns the updated movie data to the **Movie Controller**
11. **Movie Controller** returns the updated movie data to **Movie Routes**
12. **Movie Routes** returns the updated movie data to **Frontend**

### Data Flow
- Request: PUT/PATCH `/movies/:id` with movie update data
- Repository Operation: `updateById(movieId, updateData)`
- Response: Updated movie object with details

### Validation Points
- **Movie Routes**: Validates movie ID format, request body format, and content type
- **Movie Controller**: Validates movie ID parameter and update data structure
- **Movie Service**: Validates movie ID format, update data format, and checks existence
- **MongoMovie Repository**: Validates data integrity constraints at database level

### Success Path
- All components successfully pass data between each other
- Movie is successfully updated in the database
- Frontend receives the updated movie information

### Error Path
- Invalid movie ID or request format results in 400 error at route level
- Movie not found results in 404 error at service level
- Invalid update data results in 400 error at service level
- Database constraint violations result in 409/500 errors

## Delete Movie

### Actors
- Frontend (Client)
- Movie Routes
- Movie Controller
- Movie Service
- MongoMovie Repository

### Workflow
1. **Frontend** sends a DELETE request to `/movies/:id` endpoint
2. **Movie Routes** receives the request and validates the movie ID format in the URL
3. **Movie Routes** calls the controller method `deleteMovie()`
4. **Movie Controller** validates the movie ID parameter format
5. **Movie Controller** calls the service method `deleteMovie(movieId)`
6. **Movie Service** validates the movie ID format and checks movie existence
7. **Movie Service** calls the repository method `deleteById(movieId)` to delete the movie from the database
8. **MongoMovie Repository** deletes the movie from the database
9. **MongoMovie Repository** returns the deletion result to the **Movie Service**
10. **Movie Service** returns the result to the **Movie Controller**
11. **Movie Controller** returns the result to **Movie Routes**
12. **Movie Routes** returns the result to **Frontend**

### Data Flow
- Request: DELETE `/movies/:id`
- Repository Operation: `deleteById(movieId)`
- Response: Deletion confirmation result

### Validation Points
- **Movie Routes**: Validates movie ID format in URL path parameter
- **Movie Controller**: Validates movie ID parameter format and type
- **Movie Service**: Validates movie ID format and checks existence
- **MongoMovie Repository**: Validates data integrity constraints at database level

### Success Path
- All components successfully pass data between each other
- Movie is successfully deleted from the database
- Frontend receives deletion confirmation

### Error Path
- Invalid movie ID format results in 400 error at route level
- Movie not found results in 404 error at service level
- Database constraint violations result in 409/500 errors