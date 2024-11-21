# A file uploader

This project is building using a React frontend. The backend uses Express, NodeJS and PostgreSQL which is managed using Prisma ORM. Files are uploaded and served from Cloudinary for download.

## The Odin Project: Lesson File Uploader

This project is build according to the idea of this [Odin project](https://www.theodinproject.com/lessons/nodejs-file-uploader).

## No live website but a video

In order to not pay for hosting a video is provided on YouTube which demonstrates the app functionality for those that don't wont to clone and run the project on their pc.

Access the [File-uploader video](https://youtu.be/1v0z-bs4d8k)

## Run locally

*In order to run project locally NodeJS, Git and a running local PostgreSQL database + table needs to be installed/setup on your system.*

In case you need help setting up PostgreSQL on your system refer to the lessons on PostgreSQL at [the Odin Project](https://www.theodinproject.com/paths/full-stack-javascript/courses/nodejs)

Follow these steps on Mac/Linux/WSL to run project locally:

1. Open a terminal and go to a directory you want the repository to be in
2. Select Code in the Github project page and copy the SSH URL
3. git clone *SSH URL*
4. 'cd' into the repository you just cloned
5. 'cd' into file-uploader-backend & run 'npm install'
6. Replace the DATABASE_URL with your local database url (remember to put it in your local .env file)
7. Run 'npx prisma migrate dev --name init' in your current terminal
8. Run 'npm run dev' in file-uploader-backend directory
9. Open another terminal
10. 'cd' into file-uploader-frontend & run 'npm install'
11. Run 'npm run dev' in file-uploader-frontend
12. Open the link that is shown in the terminal in your browser
