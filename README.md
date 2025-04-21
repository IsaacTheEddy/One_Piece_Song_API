# Welcome to the ONE PIECE Openings and Endings API

This API is for the real fans of one piece. The API is designed to return a JSON representation of One Pieces Openings and Endings.

## Database Setup

To clone this repo enter the following into your Terminal

` `

Check the Song_List.csv and make sure it's Populated. After setup the MySQL database with the following file.

```
./sql/setup.sql
```

This is how the file should look.

```sql
CREATE DATABASE IF NOT EXISTS One_Piece_Songs;
USE One_Piece_Songs;

CREATE TABLE IF NOT EXISTS songs(
    song_id INT PRIMARY KEY AUTO_INCREMENT,
    song_name TEXT,
    artist TEXT,
    youtube_link TEXT
);

CREATE TABLE IF NOT EXISTS openings(
    op_id SERIAL PRIMARY KEY,
    song_id INT,
    arcs TEXT,
    FOREIGN KEY(song_id) REFERENCES songs(song_id)
);

CREATE TABLE IF NOT EXISTS endings(
    ep_id INT PRIMARY KEY,
    song_id INT,
    arcs TEXT,
    FOREIGN KEY(song_id) REFERENCES songs(song_id)
);

```

Now run the `opening_storage.js` file:

```js
node opening_storage.js
```

## API

With the database setup run your dev server

```
npm run dev
```

Or what you set you start to.

Now open Postman or your API testing client of choice

## Authorization

Password Authinication is still early development there for, only openings requrire you set up an account.

When setting up a password I can assure you that your password is encrypted upon save so I nor others will know your password.

To setup your password follow these steps:

### First

For your conveince keep track of your .

Set your request to `POST` and go to route `"/users"` and in the body enter your email and password(Must be 8 characters minimum):

```json
{
  "email": "test@gmail.com",
  "password": "test"
}
```

You'll recieve a id and your email back:

```json
{
  "id": "6805a1d5034dae9a9005ce8e",
  "email": "test@gmail.com"
}
```

### Second

Enter your email and password in this nifty base64 converter in the following format email:password for a token:

```json
{
  "email": "testing@gmail.com",
  "password": "testpass"
}
```

With the base64 string you recieve go to your API client and add to Headers:
example:

```
Key: Authorization, Field: Basic (Base64)
```

you will recieve a Token, Keep this token its very important.

```js
"token": "6e2a9c88-4c78-499c-8214-f0da51a866ae"
```

Now remove the Authorization header and Add the following to your Headers

```json
Key: X-Token, Field: token recieved(exmp: "token": "6e2a9c88-4c78-499c-8214-f0da51a866ae").
```

### Third

With your headers set you should check if your added to the database by connecting to this route:

```
'/users/me'
```

you'll recieve results in json:

```json
{
  "id": "6805ad4dc55cefe3c8046f0a",
  "email": "testing@gmail.com"
}
```

If you recieve data then your all set to test the openings API!!!

## Request Types

This API is currently in early development. Features are limited

```js
'/openings' or
'/openings/:id'
```

openings returns the whole openings table and openings id returns a single object
