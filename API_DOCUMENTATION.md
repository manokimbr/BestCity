# Notes API Documentation

## Base URL

```
http://localhost:<PORT>/api/notes
```


---

## API Endpoints


### 1. Create a Note

**POST** `/api/notes`

Create a new note with title and content.

**Request Body:**
```json
{
  "title": "string (required)",
  "content": "string (required)"
}
```

**Success Response:**
- **Code:** 201 Created
- **Content:**
```json
{
  "success": true,
  "message": "Note created successfully",
  "data": {
    "id": 1,
    "title": "Note Title",
    "content": "Note content",
    "createdAt": "2026-01-29T10:02:13.124Z",
    "updatedAt": "2026-01-29T10:02:13.124Z"
  }
}
```

**Error Response:**
- **Code:** 400 Bad Request
- **Content:**
```json
{
  "errors": [
    {
      "msg": "Title is required",
      "param": "title"
    }
  ]
}
```

**Example:**
```bash
curl -X POST http://localhost:5025/api/notes \
  -H "Content-Type: application/json" \
  -d '{"title": "My First Note", "content": "This is the content"}'
```

---

### 2. Get All Notes

**GET** `/api/notes`

Retrieve all notes from the system.

**Success Response:**
- **Code:** 200 OK
- **Content:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": 1,
      "title": "First Note",
      "content": "Content here",
      "createdAt": "2026-01-29T10:02:13.124Z",
      "updatedAt": "2026-01-29T10:02:13.124Z"
    },
    {
      "id": 2,
      "title": "Second Note",
      "content": "More content",
      "createdAt": "2026-01-29T10:02:16.516Z",
      "updatedAt": "2026-01-29T10:02:16.516Z"
    }
  ]
}
```

**Example:**
```bash
curl http://localhost:5025/api/notes
```

---

### 3. Get Note by ID

**GET** `/api/notes/:id`

Retrieve a specific note by its ID.

**URL Parameters:**
- `id` (integer) - The ID of the note

**Success Response:**
- **Code:** 200 OK
- **Content:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Note Title",
    "content": "Note content",
    "createdAt": "2026-01-29T10:02:13.124Z",
    "updatedAt": "2026-01-29T10:02:13.124Z"
  }
}
```

**Error Response:**
- **Code:** 404 Not Found
- **Content:**
```json
{
  "success": false,
  "message": "Note with ID 999 not found"
}
```

**Example:**
```bash
curl http://localhost:5025/api/notes/1
```

---

### 4. Update Note

**PUT** `/api/notes/:id`

Update an existing note. You can update title, content, or both.

**URL Parameters:**
- `id` (integer) - The ID of the note to update

**Request Body:**
```json
{
  "title": "string (optional)",
  "content": "string (optional)"
}
```

**Success Response:**
- **Code:** 200 OK
- **Content:**
```json
{
  "success": true,
  "message": "Note updated successfully",
  "data": {
    "id": 1,
    "title": "Updated Title",
    "content": "Updated content",
    "createdAt": "2026-01-29T10:02:13.124Z",
    "updatedAt": "2026-01-29T10:05:30.456Z"
  }
}
```

**Error Response:**
- **Code:** 404 Not Found
- **Content:**
```json
{
  "success": false,
  "message": "Note with ID 999 not found"
}
```

**Example:**
```bash
curl -X PUT http://localhost:5025/api/notes/1 \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated Title", "content": "Updated content"}'
```

---

### 5. Delete Note

**DELETE** `/api/notes/:id`

Delete a note by its ID.

**URL Parameters:**
- `id` (integer) - The ID of the note to delete

**Success Response:**
- **Code:** 200 OK
- **Content:**
```json
{
  "success": true,
  "message": "Note deleted successfully",
  "data": {
    "id": 1,
    "title": "Deleted Note",
    "content": "This note was deleted",
    "createdAt": "2026-01-29T10:02:13.124Z",
    "updatedAt": "2026-01-29T10:02:13.124Z"
  }
}
```

**Error Response:**
- **Code:** 404 Not Found
- **Content:**
```json
{
  "success": false,
  "message": "Note with ID 999 not found"
}
```

**Example:**
```bash
curl -X DELETE http://localhost:5025/api/notes/1
```

---

## Data Model

### Note Object

| Field | Type | Description |
|-------|------|-------------|
| `id` | Integer | Auto-incrementing unique identifier |
| `title` | String | Title of the note (required) |
| `content` | String | Content/body of the note (required) |
| `createdAt` | ISO 8601 DateTime | Timestamp when note was created |
| `updatedAt` | ISO 8601 DateTime | Timestamp when note was last updated |

---

## Response Format

All responses follow this structure:


### Success Response
```json
{
  "success": true,
  "message": "Optional success message",
  "data": { /* response data */ },
  "count": 0  // Only for GET all notes
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [  // Validation errors
    {
      "msg": "Error message",
      "param": "field_name"
    }
  ]
}
```

---

## Status Codes

| Code | Meaning | When Used |
|------|---------|-----------|
| 200 | OK | Successful GET, PUT, DELETE |
| 201 | Created | Successful POST (note created) |
| 400 | Bad Request | Validation failed |
| 404 | Not Found | Note ID doesn't exist |
| 500 | Internal Server Error | Unexpected server error |

---

## Frontend Demo

Access the interactive frontend demo at:

```
http://localhost:3000/notes
```

The demo provides:
- Form to create notes
- List view of all notes
- Edit functionality (click pencil icon)
- Delete functionality (click trash icon)
- Real-time notifications

---

## Testing with curl

### Full CRUD Flow Example

```bash
# 1. Create a note
curl -X POST http://localhost:5025/api/notes \
  -H "Content-Type: application/json" \
  -d '{"title": "Test Note", "content": "Testing the API"}'

# 2. Get all notes
curl http://localhost:5025/api/notes

# 3. Get specific note (assuming ID 1)
curl http://localhost:5025/api/notes/1

# 4. Update the note
curl -X PUT http://localhost:5025/api/notes/1 \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated Note", "content": "Updated content"}'

# 5. Delete the note
curl -X DELETE http://localhost:5025/api/notes/1

# 6. Verify deletion
curl http://localhost:5025/api/notes
```

---

## Notes

- **Data Storage**: Uses in-memory storage (array). All data is lost when server restarts.
- **Auto-Incrementing IDs**: IDs start at 1 and increment for each new note.
- **Timestamps**: Automatically managed. `updatedAt` changes on PUT requests.
- **Validation**: Both `title` and `content` are required when creating notes.
- **CORS**: Not configured. Use proxy in development or configure CORS for production.

---

## Quick Reference

| Operation | Method | Endpoint | Body Required |
|-----------|--------|----------|---------------|
| Create | POST | `/api/notes` | Yes (title, content) |
| Read All | GET | `/api/notes` | No |
| Read One | GET | `/api/notes/:id` | No |
| Update | PUT | `/api/notes/:id` | Yes (title and/or content) |
| Delete | DELETE | `/api/notes/:id` | No |
