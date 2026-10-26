const STORAGE_KEY = "readingList.books";
const MAX_TITLE_WORDS = 60;
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

// ---- helpers ----
function cleanTitle(text) {
  return text.trim().replace(/\s+/g, " ");
}

function countWords(text) {
  const cleaned = cleanTitle(text);
  return cleaned ? cleaned.split(" ").length : 0;
}

// Two titles count as the same book if they match ignoring case and extra spaces
function isDuplicate(title) {
  const key = cleanTitle(title).toLowerCase();
  return books.some((b) => cleanTitle(b.title).toLowerCase() === key);
}

function formatDate(iso) {
  if (!iso) return "";
  const date = new Date(iso);
  if (isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

function showError(message) {
  const box = $("formError");
  box.textContent = message;
  box.hidden = !message;
}

function updateWordCount() {
  const words = countWords($("title").value);
  const hint = $("wordCount");
  hint.textContent = `${words} / ${MAX_TITLE_WORDS} words`;
  hint.classList.toggle("over", words > MAX_TITLE_WORDS);
}

// ---- display ----
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

    const added = formatDate(book.dateAdded);
    if (added) {
      const date = document.createElement("small");
      date.className = "date";
      date.textContent = "Added " + added;
      info.appendChild(date);
    }

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

// ---- actions ----
function addBook(title, author) {
  books.push({
    id: Date.now(),
    title: title,
    author: author,
    read: false,
    dateAdded: new Date().toISOString()
  });
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

$("title").addEventListener("input", () => {
  updateWordCount();
  showError("");
});

$("bookForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const title = cleanTitle($("title").value);
  const author = cleanTitle($("author").value);
  if (!title || !author) return;

  if (countWords(title) > MAX_TITLE_WORDS) {
    showError(`The book name is too long. Please use ${MAX_TITLE_WORDS} words or fewer.`);
    return;
  }
  if (isDuplicate(title)) {
    showError("This book is already in your list. Please use a different name.");
    return;
  }

  addBook(title, author);
  showError("");
  e.target.reset();
  updateWordCount();
});

document.querySelectorAll(".filter").forEach((btn) => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter;
    document.querySelectorAll(".filter").forEach((b) => b.classList.toggle("active", b === btn));
    render();
  });
});

updateWordCount();
render();
