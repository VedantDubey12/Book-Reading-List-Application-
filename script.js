const STORAGE_KEY = "readingList.books";
let books = loadBooks();
let currentFilter = "all";

const $ = (id) => document.getElementById(id);

function loadBooks() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch (e) {
    return [];
  }
}

function saveBooks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  } catch (e) { /* storage unavailable: the list still works until refresh */ }
}

function render() {
  const list = $("bookList");
  list.textContent = "";

  const shown = books.filter((b) =>
    currentFilter === "all" ? true : currentFilter === "read" ? b.read : !b.read
  );

  shown.forEach((book) => {
    const li = document.createElement("li");
    li.className = "book" + (book.read ? " read" : "");

    const info = document.createElement("div");
    info.className = "info";
    const title = document.createElement("strong");
    title.textContent = book.title;
    const author = document.createElement("small");
    author.textContent = "by " + book.author;
    info.append(title, author);

    const actions = document.createElement("div");
    actions.className = "actions";
    const toggle = document.createElement("button");
    toggle.textContent = book.read ? "Unread" : "Read";
    toggle.addEventListener("click", () => toggleRead(book.id));
    const remove = document.createElement("button");
    remove.textContent = "Remove";
    remove.addEventListener("click", () => removeBook(book.id));
    actions.append(toggle, remove);

    li.append(info, actions);
    list.appendChild(li);
  });

  const readCount = books.filter((b) => b.read).length;
  $("summary").textContent =
    `${books.length} total, ${readCount} read, ${books.length - readCount} left`;
  $("empty").hidden = shown.length !== 0;
}

function addBook(title, author) {
  books.push({ id: Date.now(), title: title, author: author, read: false });
  saveBooks();
  render();
}

function toggleRead(id) {
  const book = books.find((b) => b.id === id);
  if (book) book.read = !book.read;
  saveBooks();
  render();
}

function removeBook(id) {
  books = books.filter((b) => b.id !== id);
  saveBooks();
  render();
}

$("bookForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const title = $("title").value.trim();
  const author = $("author").value.trim();
  if (!title || !author) return;
  addBook(title, author);
  e.target.reset();
});

document.querySelectorAll(".filter").forEach((btn) => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter;
    document.querySelectorAll(".filter").forEach((b) => b.classList.toggle("active", b === btn));
    render();
  });
});

render();
