# Welcome to the ONE PIECE Openings and Endings API

This API is for the real fans of one piece. The API is designed to return a JSON representation of One Pieces Openings and Endings.

This Database Implements the following tools:

- Winston Logger for logging interactions in the API
- MySQL for data storage
- Express.js for API routing
- Node.js for Backend scripting and data parsing
- MongoDB for Users storage and authenication
- Redis for Token storage for user authenication

## Database Setup

To clone this repo enter the following into your Terminal

```bash
git clone https://github.com/IsaacTheEddy/One_Piece_Song_API.git
```

Check the Song_List.csv and make sure it's Populated. After setup the MySQL database with the following file.

```bash
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

```bash
node opening_storage.js
```

## API

With the database setup run your dev server

```bash
npm run dev
```

Or what you set you start to.

Now open Postman or your API testing client of choice

## Authorization

Password Authinication is still early development there for, only openings requrire you set up an account.

When setting up a password I can assure you that your password is encrypted upon save so I nor others will know your password.

To setup your password follow these steps:

### First

For your conveince keep track of your credentials .

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
Enter your email and password in this nifty base64 converter in the following format 
```
email:password
``` for a token:

```json
{
  "email": "testing@gmail.com",
  "password": "testpass"
}
```

With the base64 string you recieve go to your API client and add to the Headers and then connect to the 
```
/connect
``` route:
example:

```
Key: Authorization, Field: Basic (Base64)
```

you will recieve a Token, Keep this token its very important.

```js
"token": "6e2a9c88-4c78-499c-8214-f0da51a866ae"
```

Now disable the Authorization header and Add the following to your Headers

```
Key: X-Token, Field: token recieved (exmp: 6e2a9c88-4c78-499c-8214-f0da51a866ae).
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

If you recieve data then your all set to explore the API!!! Just remember to keep your X-Token in your Header

## Request Types

This API is currently in early development. Features are limited


With the X-Token you were given after following the steps in Authorization, openings returns the whole openings table and openings id returns a single object

```js
'/openings' or
'/openings/:id'
```



```json
[
  {
    "song_id": 1,
    "song_name": "We Are",
    "artist": "Hiroshi Kitadani",
    "arcs": "['East Blue']",
    "youtube_link": "https://www.youtube.com/watch?v=1CV5vYtD6mA&t=111s"
  },
  {
    "song_id": 2,
    "song_name": "Believe",
    "artist": "older5",
    "arcs": "['East Blue', 'Alabasta']",
    "youtube_link": "https://www.youtube.com/watch?v=1CV5vYtD6mA&t=111s"
  },
  {
    "song_id": 3,
    "song_name": "Hikari e",
    "artist": "The Babystars",
    "arcs": "['Skypeia']",
    "youtube_link": "https://www.youtube.com/watch?v=1CV5vYtD6mA&t=222s"
  },
  {
    "song_id": 4,
    "song_name": "Bon Voyage!",
    "artist": "Bon-Bon Blanco",
    "arcs": "['Skypeia']",
    "youtube_link": "https://www.youtube.com/watch?v=1CV5vYtD6mA&t=333s"
  },
  {
    "song_id": 5,
    "song_name": "Kokoro no Chizu",
    "artist": "BOYSTYLE",
    "arcs": "['Water 7']",
    "youtube_link": "https://www.youtube.com/watch?v=1CV5vYtD6mA&t=444s"
  },
```
With the X-Token you were given after following the steps in Authorization, songs returns the strictly songs and songs id returns a single object

```js
'/songs' or
'/songs/:id'
```


```js
   {
        "song_id": 1,
        "song_name": "We Are",
        "artist": "Hiroshi Kitadani",
        "youtube_link": "https://www.youtube.com/watch?v=1CV5vYtD6mA&t=111s"
    },
    {
        "song_id": 2,
        "song_name": "Believe",
        "artist": "older5",
        "youtube_link": "https://www.youtube.com/watch?v=1CV5vYtD6mA&t=111s"
    },
    {
        "song_id": 3,
        "song_name": "Hikari e",
        "artist": "The Babystars",
        "youtube_link": "https://www.youtube.com/watch?v=1CV5vYtD6mA&t=222s"
    },...
```