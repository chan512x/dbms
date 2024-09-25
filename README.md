
# Songs Database


This application is a comprehensive software system designed to manage and organize vast music collections. It features secure user authentication, detailed song catalog management, search and filtering, playlist CRUD, and integrated audio playback. This application is accessible via responsive web design. Technologically it leverages React for the frontend, Flask for the backend, and MariaDB for the database. This enables efficient song management, discovery, and an enhanced listening experience.




## Screenshots

![Login](https://github.com/360smchandan/dbms/assets/15228512/ff28d4ed-61a6-4d57-a8e3-141bcacc1686)
![Home](https://github.com/360smchandan/dbms/assets/15228512/338be554-a797-4751-b722-0a0a28b3947d)
![Playlist](https://github.com/360smchandan/dbms/assets/15228512/75d74ad9-19e5-4493-9a6f-c0610abc573f)
![Search](https://github.com/360smchandan/dbms/assets/15228512/1367ec5e-e988-4431-a999-33c999fcddbd)


## Setup

#### Database
      -   We've used MariaDB for this application, to download the latest version visit(https://mariadb.org/download/) or any other equivalent SQL database should work.
      -   Import the already created db(dummy.sql) using HeidiSQL(GUI for MariaDB)
      -   Or if you want to create the database from scratch, follow these steps
            - Create a spotify app here(https://developer.spotify.com/documentation/web-api) and paste the client-id and client-secret in client-id.txt and client-secret.txt
            - Run auth.py once this fills out our spotify access token which we use to insert metadata into our database.
            - Modify the artists.txt as you wish depending on whose info you need in your database.
            - Run serv.py also modify the connector config to your db's config
            - Now our metadata is inserted, now to make those songs playable we insert the yt links of those songs and embed them into our app.
            - Run yt.js
            - Now our database setup is complete.

      
#### Backend
        Modify the connector config in backend/app/__init__.py
        
## Run Locally

Clone the project

```bash
  git clone https://github.com/360smchandan/dbms.git
```

Go to the project directory

```bash
  cd my-project
```

Install dependencies and complete the setup

```bash
  npm install
```

Start the server

```bash
  npm run start
```

Congrats you have successfully setup the app!!!!
## Authors

- [@360chandansm](https://www.github.com/360smchandan)

