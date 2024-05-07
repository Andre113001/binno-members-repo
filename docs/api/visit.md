# Visit API

Documentation for Visit API.

- [GET endpoints](#get-endpoints)
    - [/api/visit/count/all](#apivisitcountall)
    - [/api/visit/count/daily](#apivisitcountdaily)
- [POST endpoints](#post-endpoints)
    - [/api/visit/count/add](#apivisitcountadd)

<br>

## GET endpoints

### /api/visit/count/all
Retrieves the count of all visits.

**Response:**

200 OK
```
[Count Integer]
```

500 Internal Server Error
```json
{
    "message": "Internal Server Error",
    "error": "[Error object]"
}
```

<br>

### /api/visit/count/daily
Retrieves the count of daily visits.

200 OK
```
[Count Integer]
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

### /api/visit/count/add
Increments the visitor count for the current date in the database.
If there is no existing record for the current date, it creates one with a count of 1.

**Response:**

200 OK
```json
{
    "message": "Visitor count incremented successfully"
}
```

500 Internal Server Error
```json
{
    "message": "Internal Server Error",
    "error": "[Error object]"
}
```
