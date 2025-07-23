## Subject Management API

This API provides endpoints for managing subjects within the system.

---

### 1. Add Subject(s)

*   **Endpoint:** `POST /api/admin/subjects`
*   **Description:** Adds one or more new subjects to the system. The request body should be an array of subject objects.
*   **Permissions:** Admin
*   **Request Body:** `application/json`

    ```json
    [
        {
            "subjectCode": "CS101",
            "subjectName": "Introduction to Computer Science",
            "department": "Computer Science",
            "isElective": false
        },
        {
            "subjectCode": "MA201",
            "subjectName": "Calculus I",
            "department": "Mathematics",
            "isElective": "false"
        },
        {
            "subjectCode": "PHY301E",
            "subjectName": "Quantum Physics (Elective)",
            "department": "Physics",
            "isElective": true
        }
    ]
    ```

    **Field Descriptions:**
    *   `subjectCode` (String, Required): Unique code for the subject.
    *   `subjectName` (String, Required): Name of the subject.
    *   `department` (String, Required): The department to which the subject belongs. This department must already exist in the system.
    *   `isElective` (Boolean or String "true"/"false", Required): Indicates if the subject is an elective.

*   **Success Response (200 OK):**

    ```json
    {
        "success": [
            {
                "_id": "60d5ecf7a1b2c3d4e5f6a7b8",
                "subjectCode": "CS101",
                "subjectName": "Introduction to Computer Science",
                "department": "Computer Science"
            },
            {
                "_id": "60d5ecf7a1b2c3d4e5f6a7b9",
                "subjectCode": "MA201",
                "subjectName": "Calculus I",
                "department": "Mathematics"
            }
        ],
        "errors": [
            {
                "subjectCode": "PHY301E",
                "subjectName": "Quantum Physics (Elective)",
                "department": "NonExistentDepartment",
                "error": "Department 'NonExistentDepartment' does not exist."
            },
            {
                "subjectCode": "CS101",
                "subjectName": "Intro to CS",
                "department": "Computer Science",
                "error": "Subject Code 'CS101' is already taken."
            }
        ]
    }
    ```
    *   `success`: An array of successfully added subjects, including their generated `_id`.
    *   `errors`: An array of subjects that could not be added, along with the reason for the error.

*   **Error Responses:**
    *   `400 Bad Request`: If the input is not an array, or if required fields are missing for any subject.
        ```json
        {
            "error": "Input must be an array of subject data"
        }
        ```
        ```json
        {
            "error": "Please Provide All the Required Data (subjectCode, subjectName, department, isElective)!"
        }
        ```
    *   `404 Not Found`: If a specified department does not exist (returned within the `errors` array for the specific subject).
    *   `409 Conflict`: If a subject code or subject name (within the same department) already exists (returned within the `errors` array for the specific subject).

---

### 2. Get Subjects

*   **Endpoint:** `GET /api/admin/subjects`
*   **Description:** Retrieves a list of subjects based on optional filter criteria provided as query parameters.
*   **Permissions:** Admin
*   **Query Parameters:**
    *   `department` (String, Optional): Filter subjects by department name.
    *   `subjectCode` (String, Optional): Filter subjects by subject code.
    *   `subjectName` (String, Optional): Filter subjects by subject name (case-insensitive, partial match).
    *   `isElective` (Boolean or String "true"/"false", Optional): Filter subjects based on whether they are elective or not.

    **Example Usage:**
    *   `GET /api/admin/subjects?department=Computer Science`
    *   `GET /api/admin/subjects?subjectCode=CS101`
    *   `GET /api/admin/subjects?subjectName=Intro&isElective=false`
    *   `GET /api/admin/subjects?isElective=true`

*   **Success Response (200 OK):**

    ```json
    [
        {
            "_id": "60d5ecf7a1b2c3d4e5f6a7b8",
            "subjectCode": "CS101",
            "subjectName": "Introduction to Computer Science",
            "department": "Computer Science",
            "isElective": false,
            "createdAt": "2023-01-15T10:00:00.000Z",
            "updatedAt": "2023-01-15T10:00:00.000Z"
        },
        {
            "_id": "60d5ecf7a1b2c3d4e5f6a7c0",
            "subjectCode": "CS102",
            "subjectName": "Data Structures",
            "department": "Computer Science",
            "isElective": false,
            "createdAt": "2023-01-16T11:00:00.000Z",
            "updatedAt": "2023-01-16T11:00:00.000Z"
        }
    ]
    ```
    Returns an array of subject objects matching the filter criteria. If no filters are provided, it returns all subjects.

*   **Error Responses:**
    *   No specific error responses defined for this GET request beyond standard server errors (e.g., 500 Internal Server Error if the database connection fails).

---

### 3. Update Subject

*   **Endpoint:** `PUT /api/admin/subjects`
*   **Description:** Updates the details of an existing subject.
*   **Permissions:** Admin
*   **Request Body:** `application/json`

    ```json
    {
        "id": "60d5ecf7a1b2c3d4e5f6a7b8",
        "toModify": {
            "subjectName": "Advanced Introduction to CS",
            "isElective": "false",
            "department": "Computer Engineering"
        }
    }
    ```

    **Field Descriptions:**
    *   `id` (String, Required): The MongoDB ObjectId of the subject to be updated.
    *   `toModify` (Object, Required): An object containing the fields to be updated.
        *   `subjectCode` (String, Optional): New subject code.
        *   `subjectName` (String, Optional): New subject name.
        *   `department` (String, Optional): New department. The department must exist.
        *   `isElective` (Boolean or String "true"/"false", Optional): New elective status.

*   **Success Response (200 OK):**

    ```json
    {
        "message": "Subject updated successfully",
        "modified": true // or false if no actual changes were made to the document
    }
    ```
    Or, if the subject was found but no fields were actually changed by the update operation:
    ```json
    {
        "message": "Subject updated successfully", // Or "No changes detected for the subject"
        "modified": false
    }
    ```

*   **Error Responses:**
    *   `400 Bad Request`:
        *   If `id` or `toModify` is missing.
            ```json
            {
                "error": "ID and modification data are required"
            }
            ```
        *   If the provided `id` is not a valid MongoDB ObjectId.
            ```json
            {
                "error": "Invalid subject ID format"
            }
            ```
        *   If `isElective` is provided but is not a boolean or a valid string ("true"/"false").
            ```json
            {
                "error": "isElective must be a boolean or string 'true'/'false'"
            }
            ```
    *   `404 Not Found`:
        *   If the subject with the given `id` does not exist.
            ```json
            {
                "error": "Subject not found"
            }
            ```
        *   If a new `department` is specified in `toModify` and that department does not exist.
            ```json
            {
                "error": "Department 'NewNonExistentDepartment' does not exist."
            }
            ```
    *   `409 Conflict`: If the updated `subjectCode` or `subjectName` (within the same department) conflicts with an existing subject (excluding the one being updated).
        ```json
        {
            "error": "Subject Code 'CS102' is already taken."
        }
        ```
        ```json
        {
            "error": "Subject Name 'Data Structures' in department 'Computer Science' is already taken."
        }
        ```
        ```json
        {
            "error": "Subject Code 'CS102' and Subject Name 'Data Structures' in department 'Computer Science' are already taken."
        }
        ```

---
