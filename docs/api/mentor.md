# Mentor API

Documentation for Mentorship API

> WARNING: the json response attributes for 200 OK status code might be wrong due to the old database schema used. - AL

- [GET endpoints](#get-endpoints)
    - [/api/mentor/list](#apimentorlist)
    - [/api/mentor/list/all](#apimentorlistall)
    - [/api/mentor/list/enabler/:enablerId](#apimentorlistenablerenablerid)
    - [/api/mentor/request/list/sender/:senderId](#apimentorrequestlistsendersenderid)
    - [/api/mentor/request/list/receiver/:receiverId](#apimentorrequestlistreceiverreceiverid)
    - [/api/mentor/request/:requestId/file](#apimentorrequestrequestidfile)
- [POST endpoints](#post-endpoints)
    - [/api/mentor/partnership/end](#apimentorpartnershipend)
    - [/api/mentor/partnership/end/cancel](#apimentorpartnershipendcancel)
    - [/api/mentor/request/accept](#apimentorrequestaccept)
    - [/api/mentor/request/create](#apimentorrequestcreate)
    - [/api/mentor/request/cancel](#apimentorrequestcancel)
    - [/api/mentor/request/reject](#apimentorrequestreject)

<br>

## GET endpoints

### /api/mentor/list
Lists available mentors who are not associated with any enabler.

**Response:**

200 OK
```json
[
    {
        "member_id": "string",
        "name": "string",
        "profile_pic": "string"
    }
]
```

500 Internal Server Error
```json
{
    "message": "Internal Server Error",
    "error": "[Error object]"
}
```

<br>

### /api/mentor/list/all
Retrieves a list of all mentors.

**Response:**

200 OK
```json
[
    {
        "biography": "string",
        "cover_pic": "string",
        "member_id": "string",
        "name": "string",
        "profile_pic": "string",
        "tagline": "string"
    }
]
```

500 Internal Server Error
```json
{
    "message": "Internal Server Error",
    "error": "[Error object]"
}
```

<br>

### /api/mentor/list/enabler/:enablerId
Lists mentors associated with a specific enabler.

**Request:**

Parameter/s:
* **enablerId** - The ID of the enabler.

**Response:**

200 OK
```json
[
    {
        "archive": 0,
        "date_created": "datetime",
        "enabler_id": "string",
        "mentor_id": "string",
        "mentor_name": "string",
        "mentor_profile_pic": "string",
        "request_id": "string"
    }
]
```

404 Not Found
```json
{ "message": "Enabler not found" }
```

500 Internal Server Error
```json
{
    "message": "Internal Server Error",
    "error": "[Error object]"
}
```

<br>

### /api/mentor/request/list/sender/:senderId
Lists mentorship requests sent by a specific sender.

**Request:**

Parameter/s:
* **senderId** - The ID of the sender, can be the ID of the mentor or the enabler.

**Response:**

200 OK
```json
[
    {
        "date_created": "datetime",
        "docs_path": "string",
        "enabler_id": "string",
        "mentor_id": "string",
        "message": "string",
        "receiver_name": "string",
        "receiver_profile_pic": "string",
        "request_id": "string",
        "sender_id": "string",
        "status": "Pending"
    }
]
```

404 Not Found
```json
{ "message": "Sender not found" }
```

500 Internal Server Error
```json
{
    "message": "Internal Server Error",
    "error": "[Error object]"
}
```

<br>

### /api/mentor/request/list/receiver/:receiverId
Lists mentorship requests received by a specific receiver (mentor or enabler).

**Request:**

Parameter/s:
* **receiverId** - The ID of the receiver, can be the ID of a mentor or enabler.

**Response:**

200 OK
```json
[
    {
        "date_created": "datetime",
        "docs_path": "string",
        "enabler_id": "string",
        "mentor_id": "string",
        "message": "string",
        "request_id": "string",
        "sender_id": "string",
        "sender_name": "string",
        "sender_profile_pic": "string",
    }
]
```

404 Not Found
```json
{ "message": "Receiver not found" }
```

500 Internal Server Error
```json
{
    "message": "Internal Server Error",
    "error": "[Error object]"
}
```

<br>

### /api/mentor/request/:requestId/file
Retrieves the attached file associated with a mentorship request.

**Request:**

Parameter/s:
* **requestId** - The ID of the mentorship request.

**Response**

200 OK
```
Request file blob
```

404 Not Found
```json
{ "message": "Mentorship request not found" }
```
```json
{ "message": "File not found" }
```

500 Internal Server Error
```json
{
    "message": "Internal Server Error",
    "error": "[Error object]"
}
```

<br>

## POST endpoints

### /api/mentor/partnership/end
Ends a mentor-enabler partnership.

**Request:**

Body:
* **mentorId**
* **enablerId**
* **requestor** - The role of the party requesting to end the partnership (either "enabler"
or "mentor").

Content-Type: application/json
```json
{
    "mentorId": "string",
    "enablerId": "string",
    "requestor": "string"
}
```

**Response:**

200 OK
```json
{ "message": "End partnership request created successfully" }
```
```json
{ "message": "Partnership for both party ended successfully" }
```

400 Bad Request
```json
{ "message": "Wrong value for requestor, should be enabler or mentor" }
```

404 Not Found
```json
{ "message": "Partnership not found" }
```

500 Internal Server Error
```json
{
    "message": "Internal Server Error",
    "error": "[Error object]"
}
```

<br>

### /api/mentor/partnership/end/cancel
Cancels a request to end a mentor-enabler partnership.

**Request:**

Body:
* **mentorId**
* **enablerId**
* **requestor** - The role of the party requesting to end the partnership (either "enabler"
or "mentor").

Content-Type: application/json
```json
{
    "mentorId": "string",
    "enablerId": "string",
    "requestor": "string"
}
```

**Response:**

200 OK
```json
{ "message": "End partnership request cancelled successfully" }
```

400 Bad Request
```json
{ "message": "Wrong value for requestor, should be enabler or mentor" }
```

404 Not Found
```json
{ "message": "Partnership not found" }
```

500 Internal Server Error
```json
{
    "message": "Internal Server Error",
    "error": "[Error object]"
}
```

<br>

### /api/mentor/request/accept
Accepts a mentorship request, updates its status to "Accepted", delete mentor instances in
the mentorship request list, and creates a mentor-enabler relationship.

**Request:**

Content-Type: application/json
```json
{
    "requestId": "string",
    "mentorId": "string",
    "enablerId": "string"
}
```

**Response:**

200 OK
```json
{ "message": "Mentorship Request accepted" }
```

404 Not Found
```json
{ "message": "Mentorship request not found" }
```

500 Internal Server Error
```json
{
    "message": "Internal Server Error",
    "error": "[Error object]"
}
```

<br>

### /api/mentor/request/create
Creates a mentorship request.

**Request:**

* **file** - The file attached or uploaded (optional).
* **body** - The JSON request.

Content-Type: application/json
```json
{
    "enablerId": "string",
    "mentorId": "string",
    "senderId": "string",
    "message": "string"
}
```

**Response:**

200 OK
```json
{ "message": "Mentorship request created successfully" }
```

400 Bad Request
```json
{ "message": "senderId should be equal to enablerId or mentorId" }
```

403 Forbidden
```json
{ "message": "Mentorship request already exist from <sender name>" }
```

404 Not Found
```json
{ "message": "Mentor not found" }
```
```json
{ "message": "Enabler not found" }
```
```json
{ "message": "Sender not found" }
```

500 Internal Server Error
```json
{
    "message": "Internal Server Error",
    "error": "[Error object]"
}
```

<br>

### /api/mentor/request/cancel
Cancels a mentorship request.

**Request:**

Content-Type: application/json
```json
{
    "requestId": "string",
    "enablerId": "string",
    "mentorId": "string"
}
```

**Response:**

200 OK
```json
{ "message": "Mentorship request cancelled successfully"}
```

404 Not Found
```json
{ "message": "Mentor not found" }
```
```json
{ "message": "Enabler not found" }
```
```json
{ "message": "Mentorship request not found" }
```

500 Internal Server Error
```json
{
    "message": "Internal Server Error",
    "error": "[Error object]"
}
```

<br>

### /api/mentor/request/reject
Rejects a mentorship request.

**Request:**

Content-Type: application/json
```json
{
    "enablerId": "string",
    "mentorId": "string"
}
```

**Response:**

200 OK
```json
{ "message": "Mentorship request declined" }
```

403 Forbidden
```json
{ "message": "Mentorship request was already accepted" }
```

404 Not Found
```json
{ "message": "Mentorship request not found" }
```

500 Internal Server Error
```json
{
    "message": "Internal Server Error",
    "error": "[Error object]"
}
```
