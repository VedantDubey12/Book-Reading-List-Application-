# Book Reading List Application

A reading list app built with HTML, CSS and JavaScript.

## Live application

**Deployed link: ADD YOUR VERCEL LINK HERE after deploying**

## Features

- Add a book with a title and author
- Mark a book as read or unread (read books are crossed out)
- Remove a book
- Filter by All, To Read and Read
- Live summary of how many books are total, read and left
- Books are saved in the browser (`localStorage`), so they are still there after a refresh
- Responsive layout for mobile and desktop

## How it works

Books are stored as objects (`id`, `title`, `author`, `read`) in an array in `script.js`. `render()` rebuilds the list from the array for the selected filter. Each add, toggle or remove changes the array, saves it with `saveBooks()` and calls `render()` again.

## Run locally

Open `index.html` in a browser. No install needed.

## Deploy

Push this repo to GitHub, import it on vercel.com and deploy with the default settings (no build command needed).

## Technologies

HTML, CSS, JavaScript, Vercel
