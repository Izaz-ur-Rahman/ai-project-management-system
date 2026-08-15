Api documentatoin started here:

#	API	Method	Auth
1	Register User	POST	❌ No
2	Login User	POST	❌ No
3	Get Current User	GET	✅ JWT

Base url: http://localhost:5000/api

-------------------register new user  api ----------------------
1.Register User (no auth) 
API Name
Register User
Endpoint
POST /api/auth/register
http://localhost:5000/api/auth/register

Purpose:	
		Creates a new user account.
Parameters: 
Parameter	Type	Required	Description
name	String	Yes	User's full name
email	String	Yes	User's email address
password	String	Yes	User's password

Sample request; 
{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Password123"
}

Sample response: 
{
    "success": true,
    "message": "User registered successfully",
    "data": {
        "user": {
            "id": "689c123456789abcdef12345",
            "name": "Test User",
            "email": "test@example.com",
            "role": "member"
        },
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
}
-------------------login api ----------------------
2. Login User (no auth)
API Name
User Login
Endpoint
POST /api/auth/login
Full URL
http://localhost:5000/api/auth/login
Purpose
Authenticates an existing user and generates a JWT access token.
Parameters
Request Body
Parameter	Type	Required	Description
email	String	Yes	Registered email
password	String	Yes	User's password

Sample request; 
{
    "email": "test@example.com",
    "password": "Password123"
}
 Sample response: 
{
    "success": true,
    "message": "Login successful",
    "data": {
        "user": {
            "id": "689c123456789abcdef12345",
            "name": "Test User",
            "email": "test@example.com",
            "role": "member"
        },
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
}
-------------------get current user api ----------------------
3. Get Current User (auth needed)
API Name
Get Current Authenticated User
Endpoint
GET /api/auth/me
Full URL
http://localhost:5000/api/auth/me
Purpose
Returns information about the currently authenticated user.

Parameters
There are no URL parameters.
There are no query parameters.
There is no request body.
The JWT is sent through the HTTP header.
Sample respnse; 
{
    "success": true,
    "message": "Current user retrieved successfully",
    "data": {
        "user": {
            "id": "689c123456789abcdef12345",
            "name": "Test User",
            "email": "test@example.com",
            "role": "member",
            "avatar": null,
            "createdAt": "2026-08-12T08:30:00.000Z",
            "updatedAt": "2026-08-12T08:30:00.000Z"
        }
    }
}


========================Project module api here==============
-------------------add project api ----------------------
1.Create Project (CMS) (auth required) 
Purpose
Returns a paginated list of contact inquiries for the CMS dashboard. Supports searching and pagination so administrators can quickly locate customer inquiries.

End Point: 
Property	Value
URL	http://localhost:5000/api/projects
Method	POST
Authentication	Admin
Content-Type	application/json
Purpose	
Creates a new project for the currently authenticated user.
The authenticated user automatically becomes the project owner.
The client does not need to send owner.


Parameter: 
Parameter	Type	Required	Description
name	String	Yes	Project name
description	String	No	Project description
status	String	No	Project status
priority	String	No	Project priority
startDate	Date	No	Project start date
dueDate	Date	No	Project deadline
Allowed status values
planning
in-progress
completed
on-hold
Allowed priority values
low
medium
high
critical

Request Body:
{
    "name": "E-Commerce Platform",
    "description": "Development of a complete online shopping platform",
    "status": "in-progress",
    "priority": "high",
    "startDate": "2026-08-15",
    "dueDate": "2026-11-30"
}

Sample response: 
{
    "success": true,
    "message": "Project created successfully",
    "data": {
        "project": {
            "_id": "68a123456789abcdef123456",
            "name": "E-Commerce Platform",
            "description": "Development of a complete online shopping platform",
            "owner": "689c123456789abcdef12345",
            "members": [],
            "status": "in-progress",
            "priority": "high",
            "startDate": "2026-08-15T00:00:00.000Z",
            "dueDate": "2026-11-30T00:00:00.000Z",
            "isDeleted": false,
            "deletedAt": null,
            "createdAt": "2026-08-15T07:30:00.000Z",
            "updatedAt": "2026-08-15T07:30:00.000Z"
        }
    }
}
-------------------all projects list api ----------------------
2.Get My Projects list (CMS) (auth required) 
Purpose
Returns all active projects where the authenticated user is either:
The project owner 
A project member 
Deleted projects are excluded.

End Point: 
Property	Value
URL	http://localhost:5000/api/projects
Method	GET
Authentication	Admin
Content-Type	application/json

Sample response: 
{
    "success": true,
    "message": "Projects retrieved successfully",
    "data": {
        "projects": [
            {
                "_id": "68a123456789abcdef123456",
                "name": "E-Commerce Platform",
                "description": "Development of a complete online shopping platform",
                "owner": {
                    "_id": "689c123456789abcdef12345",
                    "name": "Izaz Ur Rahman",
                    "email": "izaz@example.com"
                },
                "members": [
                    {
                        "_id": "689c987654321abcdef12345",
                        "name": "Ahmed Khan",
                        "email": "ahmed@example.com"
                    }
                ],
                "status": "in-progress",
                "priority": "high",
                "startDate": "2026-08-15T00:00:00.000Z",
                "dueDate": "2026-11-30T00:00:00.000Z",
                "isDeleted": false,
                "deletedAt": null,
                "createdAt": "2026-08-15T07:30:00.000Z",
                "updatedAt": "2026-08-15T07:30:00.000Z"
            }
        ],
        "count": 1
    }
}
-------------------get project by id api ----------------------
3.Get Project By ID(CMS) (auth required) 
Purpose
Returns details of a specific project.
The authenticated user must either:
Own the project 
Be a member of the project 
Deleted projects cannot be retrieved.

End Point: 
Property	Value
URL	http://localhost:5000/api/projects/{id}
Method	GET
Authentication	Admin
Content-Type	application/json

Parameter	Type	Required	Description
id	MongoDB ObjectId	Yes	Unique project ID

Sample response: 
   {
  "success": true,
  "message": "Projects retrieved successfully",
  "data": {
    "projects": [
      {
        "_id": "6a8038936c3423071670074e",
        "name": "Delete Test Project2",
        "description": "This project is only for testing deletion",
        "owner": {
          "_id": "6a7ca3d9bdfe8b6564455bf3",
          "name": "admin",
          "email": "admin@gmail.com"
        },
        "members": [],
        "status": "planning",
        "priority": "low",
        "startDate": null,
        "dueDate": null,
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2026-08-15T09:59:47.491Z",
        "updatedAt": "2026-08-15T09:59:47.491Z",
        "__v": 0
      },
      {
        "_id": "6a7f84ccdffca4336ce472f7",
        "name": "Delete Test Project",
        "description": "This project is only for testing deletion",
        "owner": {
          "_id": "6a7ca3d9bdfe8b6564455bf3",
          "name": "admin",
          "email": "admin@gmail.com"
        },
        "members": [],
        "status": "planning",
        "priority": "low",
        "startDate": null,
        "dueDate": null,
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2026-08-14T21:12:45.000Z",
        "updatedAt": "2026-08-14T21:12:45.000Z",
        "__v": 0
      }
    ],
    "count": 2
  }
}
-------------------update api ----------------------
Update Project
API Name
Update Project
HTTP Method
PUT
URL
/api/projects/:id
Full URL
http://localhost:5000/api/projects/:id
Purpose
Updates an existing project.
Only the project owner is authorized to update the project.
Parameter	Type	Required	Description
id	MongoDB ObjectId	Yes	Project ID
 
Parameter: 
Parameter	Type	Required	Description
name	String	No	Updated project name
description	String	No	Updated description
status	String	No	Updated project status
priority	String	No	Updated priority
startDate	Date	No	Updated start date
dueDate	Date	No	Updated deadline

Smaple response; 
{
  "success": true,
  "message": "Project updated successfully",
  "data": {
    "project": {
      "_id": "6a8038936c3423071670074e",
      "name": "AI Project Management System testing updated",
      "description": "MERN project management platform with Gemini AI",
      "owner": {
        "_id": "6a7ca3d9bdfe8b6564455bf3",
        "name": "admin",
        "email": "admin@gmail.com"
      },
      "members": [],
      "status": "in-progress",
      "priority": "high",
      "startDate": "2026-08-15T00:00:00.000Z",
      "dueDate": "2026-10-30T00:00:00.000Z",
      "isDeleted": false,
      "deletedAt": null,
      "createdAt": "2026-08-15T09:59:47.491Z",
      "updatedAt": "2026-08-15T10:22:19.367Z",
      "__v": 0
    }
  }
}
-------------------delete api ----------------------
Delete Project
API Name
Delete Project
HTTP Method
DELETE
URL
/api/projects/:id
Full URL
http://localhost:5000/api/projects/:id
Purpose
Soft-deletes a project.
The project is not physically removed from MongoDB.
Instead:
isDeleted = true
deletedAt = current timestamp
Only the project owner can perform this operation.

URL Parameters
Parameter	Type	Required	Description
id	MongoDB ObjectId	Yes	Project ID

Response: 
{
    "success": true,
    "message": "Project deleted successfully"
}