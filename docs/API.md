Api documentatoin started here:

#	API	Method	Auth
1	Register User	POST	❌ No
2	Login User	POST	❌ No
3	Get Current User	GET	✅ JWT

Base url: http://localhost:5000/api
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