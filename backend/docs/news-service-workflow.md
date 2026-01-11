# News Service Workflow

## Get All News (Admin/Internal)

### Actors
- Frontend (Admin UI)
- News Routes
- News Controller
- News Service
- MongoNews Repository

### Workflow
1. **Frontend (Admin UI)** sends a GET request to `/news` endpoint with query parameters (page, limit)
2. **News Routes** receives the request, authenticates the user, and authorizes as admin
3. **News Routes** calls the controller method `getAll()`
4. **News Controller** parses the query parameters (page, limit)
5. **News Controller** calls the service method `getAllNews(page, limit)`
6. **News Service** calculates the `skip` value for pagination
7. **News Service** calls the repository method `count({})` to get total news count
8. **News Service** calls the repository method `findAllWithPagination(skip, limit)` to fetch news
9. **MongoNews Repository** retrieves news items from the database using `NewsModel`
10. **MongoNews Repository** returns the news list to the **News Service**
11. **News Service** returns the news list and pagination metadata to the **News Controller**
12. **News Controller** returns the news data to **News Routes**
13. **News Routes** returns the news data to **Frontend (Admin UI)**

### Data Flow
- Request: GET `/news`
- Repository Query: `count({})`, `findAllWithPagination(skip, limit)`
- Response: Object containing `news` (list), `totalNews`, `currentPage`, and `totalPages`

### Validation Points
- **News Routes**: Handled by `authenticate` and `authorizeAdmin` middleware
- **News Controller**: Parses integer values for page and limit

### Success Path
- Admin successfully retrieves all news items for management.

### Error Path
- Authentication/Authorization failure returns 401/403
- Database errors result in 500 responses

## Get Published News (Public)

### Actors
- Frontend (User UI) / Mobile App
- News Routes
- News Controller
- News Service
- MongoNews Repository

### Workflow
1. **Frontend/Mobile** sends a GET request to `/news/published` endpoint with optional parameters (page, limit, category)
2. **News Routes** validates query parameters (page, limit, category)
3. **News Routes** calls the controller method `getPublishedNews()`
4. **News Controller** parses the query parameters
5. **News Controller** calls the service method `getPublishedNews(page, limit, category)`
6. **News Service** defines the filter `{ published: true }` and adds category if provided
7. **News Service** calls the repository method `count(filter)`
8. **News Service** calls the repository method `findPublishedWithPagination(skip, limit, category)`
9. **MongoNews Repository** retrieves published news from the database, sorted by `publishDate` descending
10. **MongoNews Repository** returns the news list to the **News Service**
11. **News Service** returns the news data and pagination metadata to the **News Controller**
12. **News Controller** returns the news data to **News Routes**
13. **News Routes** returns the news data to **Frontend/Mobile**

### Data Flow
- Request: GET `/news/published?page=1&limit=10&category=General`
- Repository Query: `count({ published: true, category })`, `findPublishedWithPagination(...)`
- Response: Object containing `news` (list), `totalNews`, `currentPage`, and `totalPages`

### Validation Points
- **News Routes**: Validates `page` (min 1), `limit` (1-100), and `category` (string)
- **News Controller**: Parses integer values

### Success Path
- Users can view the latest published news items.

### Error Path
- Invalid query parameters return 400
- Database errors result in 500 responses

## Get News by ID

### Actors
- Frontend / Mobile App
- News Routes
- News Controller
- News Service
- MongoNews Repository

### Workflow
1. **Frontend/Mobile** sends a GET request to `/news/:id` endpoint
2. **News Routes** validates the ID format (MongoID)
3. **News Routes** calls the controller method `getById()`
4. **News Controller** calls the service method `getNewsById(id)`
5. **News Service** calls the repository method `findById(id)`
6. **MongoNews Repository** retrieves the specific news item from the database
7. **MongoNews Repository** returns the news item to the **News Service**
8. **News Service** returns the news item to the **News Controller**
9. **News Controller** checks if the news exists; if not, returns 404
10. **News Controller** returns the news data to **News Routes**
11. **News Routes** returns the news data to **Frontend/Mobile**

### Data Flow
- Request: GET `/news/:id`
- Repository Query: `findById(id)`
- Response: Single news object

### Validation Points
- **News Routes**: Validates `id` is a valid MongoID

### Success Path
- User or Admin successfully retrieves detailed information about a specific news item.

### Error Path
- Invalid ID format returns 400
- News not found returns 404
- Database errors result in 500 responses

## Create News (Admin)

### Actors
- Frontend (Admin UI)
- News Routes
- News Controller
- News Service
- MongoNews Repository

### Workflow
1. **Frontend (Admin UI)** sends a POST request to `/news` with news data
2. **News Routes** authenticates and authorizes the admin
3. **News Routes** validates the request body (title, content, etc.)
4. **News Routes** calls the controller method `create()`
5. **News Controller** checks if `published` is true; if so, ensures `publishDate` is set
6. **News Controller** calls the service method `createNews(newsData)`
7. **News Service** calls the repository method `create(newsData)`
8. **MongoNews Repository** creates a new `NewsModel` instance and saves it to the database
9. **MongoNews Repository** returns the created news item to the **News Service**
10. **News Service** returns the created news item to the **News Controller**
11. **News Controller** returns the news data with status 201 to **News Routes**
12. **News Routes** returns the news data to **Frontend (Admin UI)**

### Data Flow
- Request: POST `/news` with body `{ title, content, published, category, ... }`
- Repository Operation: `save()` on `NewsModel`
- Response: Created news object with ID

### Validation Points
- **News Routes**: Validates `title` and `content` are not empty; `published` is boolean; dates are ISO8601; `tags` is array
- **News Controller**: Sets default `publishDate` if news is created as published

### Success Path
- Admin successfully creates a new news article, which may be immediately published or saved as a draft.

### Error Path
- Authentication/Authorization failure returns 401/403
- Validation failure returns 400
- Database errors result in 400 or 500 responses

## Update News (Admin)

### Actors
- Frontend (Admin UI)
- News Routes
- News Controller
- News Service
- MongoNews Repository

### Workflow
1. **Frontend (Admin UI)** sends a PUT request to `/news/:id` with update data
2. **News Routes** authenticates and authorizes the admin
3. **News Routes** validates the ID and request body
4. **News Routes** calls the controller method `update()`
5. **News Controller** checks if `published` is newly set to true; if so, sets `publishDate` if not already set
6. **News Controller** calls the service method `updateNews(id, newsData)`
7. **News Service** calls the repository method `update(id, newsData)`
8. **MongoNews Repository** updates the news item in the database using `findByIdAndUpdate()`
9. **MongoNews Repository** returns the updated news item to the **News Service**
10. **News Service** returns the updated news item to the **News Controller**
11. **News Controller** checks if news exists; if not, returns 404
12. **News Controller** returns the updated news data to **News Routes**
13. **News Routes** returns the updated news data to **Frontend (Admin UI)**

### Data Flow
- Request: PUT `/news/:id` with update data
- Repository Operation: `findByIdAndUpdate()` on `NewsModel`
- Response: Updated news object

### Validation Points
- **News Routes**: Validates `id` is MongoID; `title` and `content` are not empty if provided
- **News Controller**: Handles conditional `publishDate` assignment

### Success Path
- Admin successfully updates an existing news article.

### Error Path
- Authentication/Authorization failure returns 401/403
- Validation failure returns 400
- News not found returns 404
- Database errors result in 400 or 500 responses

## Delete News (Admin)

### Actors
- Frontend (Admin UI)
- News Routes
- News Controller
- News Service
- MongoNews Repository

### Workflow
1. **Frontend (Admin UI)** sends a DELETE request to `/news/:id`
2. **News Routes** authenticates and authorizes the admin
3. **News Routes** validates the ID format
4. **News Routes** calls the controller method `delete()`
5. **News Controller** calls the service method `deleteNews(id)`
6. **News Controller** calls the repository method `delete(id)`
7. **MongoNews Repository** deletes the news item using `findByIdAndDelete()`
8. **MongoNews Repository** returns the deletion result to the **News Service**
9. **News Service** returns the result to the **News Controller**
10. **News Controller** checks if deletion was successful; if not, returns 404
11. **News Controller** returns a success message to **News Routes**
12. **News Routes** returns the success message to **Frontend (Admin UI)**

### Data Flow
- Request: DELETE `/news/:id`
- Repository Operation: `findByIdAndDelete()` on `NewsModel`
- Response: JSON with success message `{ "message": "News deleted successfully" }`

### Validation Points
- **News Routes**: Validates `id` is a valid MongoID

### Success Path
- Admin successfully deletes a news article.

### Error Path
- Authentication/Authorization failure returns 401/403
- Invalid ID format returns 400
- News not found returns 404
- Database errors result in 500 responses

## Upload News Image (Admin)

### Actors
- Frontend (Admin UI - Quill Editor)
- News Routes
- Upload Middleware

### Workflow
1. **Frontend (Quill Editor)** sends a POST request to `/news/upload-image` with an image file in form-data
2. **News Routes** authenticates and authorizes the admin
3. **Upload Middleware** (multer) processes the file, saves it to the `uploads/` directory, and adds `file` to the request object
4. **News Routes** inline handler checks if `req.file` exists
5. **News Routes** returns the URL of the uploaded image `{ "url": "/uploads/filename" }` to the Frontend

### Data Flow
- Request: POST `/news/upload-image` with multipart/form-data `image`
- Storage Operation: Save file to `backend/uploads/`
- Response: JSON with image URL `{ "url": "/uploads/image-123.jpg" }`

### Validation Points
- **News Routes**: Checks for presence of `req.file`

### Success Path
- Admin successfully uploads an image while editing news content, which can then be embedded in the HTML content.

### Error Path
- Authentication/Authorization failure returns 401/403
- Missing file returns 400 `{ "error": "No image file provided" }`
