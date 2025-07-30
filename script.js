// Store application state
let appState = {
  isDarkMode: true,
  activeTab: "home",
  showAddTransaction: false,
  transactionType: "in",
  showBookModal: false,
  editingBook: null,
  editingTransaction: null,
  showBookActions: null,
  showDeleteConfirmation: false,
  itemToDelete: null, // e.g., { id: 1, type: 'transaction' }
  books: [],
  transactions: [],
  newTransaction: {
    amount: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    time: new Date().toTimeString().slice(0, 5),
  },
  newBook: {
    name: "",
    color: "#06B6D4",
  },
  colors: ["#06B6D4", "#8B5CF6", "#10B981", "#F59E0B", "#EF4444", "#EC4899"],
};

// --- Utility Functions ---

// Lucide-like SVG icons (simplified for embedding)
const getIcon = (name, size = 20) => {
  const icons = {
    Plus: `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus"><path d="M12 5V19"/><path d="M5 12H19"/></svg>`,
    ArrowUpCircle: `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucude-arrow-up-circle"><circle cx="12" cy="12" r="10"/><path d="m16 12-4-4-4 4"/><path d="M12 16V8"/></svg>`,
    ArrowDownCircle: `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-down-circle"><circle cx="12" cy="12" r="10"/><path d="m8 12 4 4 4-4"/><path d="M12 8v8"/></svg>`,
    Home: `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-home"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
    BookOpen: `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-open"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
    BarChart3: `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bar-chart-3"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>`,

    Settings: `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg> `,

    Moon: `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-moon"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`,
    Sun: `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="M4.93 4.93l1.41 1.41"/><path d="M17.66 17.66l1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="M4.93 19.07l1.41-1.41"/><path d="M17.66 6.34l1.41-1.41"/></svg>`,
    Edit3: `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-edit-3"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>`,
    Trash2: `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>`,
    X: `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`,
    MoreVertical: `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-more-vertical"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>`,
  };

  return icons[name] || "";
};

// Load data from localStorage
const loadFromStorage = (key, defaultValue) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
    return defaultValue;
  }
};

// Save data to localStorage
const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

// Initialize state from local storage
appState.isDarkMode = loadFromStorage("darkMode", true);
appState.books = loadFromStorage("books", [
  { id: 1, name: "Personal", color: "#06B6D4", isActive: true },
  { id: 2, name: "Business", color: "#8B5CF6", isActive: false },
  { id: 3, name: "Savings", color: "#10B981", isActive: false },
]);
appState.transactions = loadFromStorage("transactions", [
  {
    id: 1,
    bookId: 1,
    type: "in",
    amount: 2500,
    description: "Salary",
    date: "2025-06-20",
    time: "09:00",
  },
  {
    id: 2,
    bookId: 1,
    type: "out",
    amount: 150,
    description: "Groceries",
    date: "2025-06-20",
    time: "14:30",
  },
  {
    id: 3,
    bookId: 1,
    type: "out",
    amount: 50,
    description: "Coffee",
    date: "2025-06-19",
    time: "08:15",
  },
  {
    id: 4,
    bookId: 1,
    type: "in",
    amount: 100,
    description: "Freelance work",
    date: "2025-06-18",
    time: "16:45",
  },
]);

// Helper function to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

// Helper function to format date
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

// Function to update the entire UI based on appState
const renderUI = () => {
  // Apply theme classes to body
  const body = document.body;
  body.className = `min-h-screen relative ${
    appState.isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
  }`;

  // Hide all screens initially
  document.getElementById("home-screen").classList.add("hidden");
  document.getElementById("books-screen").classList.add("hidden");
  document.getElementById("stats-screen").classList.add("hidden");
  document.getElementById("settings-screen").classList.add("hidden");

  // Show active screen
  document
    .getElementById(`${appState.activeTab}-screen`)
    .classList.remove("hidden");

  // Render content for active tab
  if (appState.activeTab === "home") {
    renderHomeScreen();
  } else if (appState.activeTab === "books") {
    renderBooksScreen();
  } else if (appState.activeTab === "stats") {
    document.getElementById("stats-icon").innerHTML = getIcon("BarChart3", 48);
    document.getElementById(
      "stats-icon"
    ).className = `inline-block w-12 h-12 mb-4 ${
      appState.isDarkMode ? "text-gray-400" : "text-gray-600"
    }`;
    document.querySelector("#stats-screen p").className = `${
      appState.isDarkMode ? "text-gray-400" : "text-gray-600"
    }`;
  } else if (appState.activeTab === "settings") {
    document.getElementById("settings-icon").innerHTML = getIcon(
      "Settings",
      48
    );
    document.getElementById(
      "settings-icon"
    ).className = `inline-block w-12 h-12 mb-4 ${
      appState.isDarkMode ? "text-gray-400" : "text-gray-600"
    }`;
    document.querySelector("#settings-screen p").className = `${
      appState.isDarkMode ? "text-gray-400" : "text-gray-600"
    }`;
  }

  renderBottomNavigation();
  renderAddTransactionModal();
  renderBookModal();
  renderDeleteConfirmationModal();

  // Save state to local storage after rendering
  saveToStorage("darkMode", appState.isDarkMode);
  saveToStorage("books", appState.books);
  saveToStorage("transactions", appState.transactions);
};

// --- Render Functions for Screens ---

const renderHomeScreen = () => {
  const homeScreen = document.getElementById("home-screen");
  const activeBook = appState.books.find((book) => book.isActive);
  const activeBookTransactions = appState.transactions.filter(
    (t) => t.bookId === activeBook?.id
  );

  const totalEarned = activeBookTransactions
    .filter((t) => t.type === "in")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalSpent = activeBookTransactions
    .filter((t) => t.type === "out")
    .reduce((sum, t) => sum + t.amount, 0);

  const currentBalance = totalEarned - totalSpent;

  const cardClasses = appState.isDarkMode
    ? "bg-gray-800 border-gray-700"
    : "bg-white border-gray-200";

  homeScreen.innerHTML = `
                <!-- Header -->
                <div class="flex items-center justify-between mb-6">
                    <div>
                        <h1 class="text-2xl font-bold">Cash Manager</h1>
                        <p class="text-sm ${
                          appState.isDarkMode
                            ? "text-gray-400"
                            : "text-gray-600"
                        }">
                            ${activeBook?.name} Book
                        </p>
                    </div>
                    <button id="theme-toggle" class="p-3 rounded-full ${cardClasses} border">
                        ${
                          appState.isDarkMode
                            ? getIcon("Sun", 20)
                            : getIcon("Moon", 20)
                        }
                    </button>
                </div>

                <!-- Balance Cards -->
                <div class="grid grid-cols-1 gap-4 mb-6">
                    <div class="${cardClasses} border rounded-2xl p-6">
                        <div class="text-center">
                            <p class="text-sm ${
                              appState.isDarkMode
                                ? "text-gray-400"
                                : "text-gray-600"
                            } mb-2">
                                Current Balance
                            </p>
                            <p class="text-3xl font-bold ${
                              currentBalance >= 0
                                ? "text-green-500"
                                : "text-red-500"
                            }">
                                ${formatCurrency(currentBalance)}
                            </p>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div class="${cardClasses} border rounded-xl p-4">
                            <div class="flex items-center space-x-3">
                                <div class="p-2 bg-green-500 rounded-full">
                                    ${getIcon("ArrowUpCircle", 16)}
                                </div>
                                <div>
                                    <p class="text-xs ${
                                      appState.isDarkMode
                                        ? "text-gray-400"
                                        : "text-gray-600"
                                    }">
                                        Total Earned
                                    </p>
                                    <p class="text-lg font-semibold text-green-500">
                                        ${formatCurrency(totalEarned)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div class="${cardClasses} border rounded-xl p-4">
                            <div class="flex items-center space-x-3">
                                <div class="p-2 bg-red-500 rounded-full">
                                    ${getIcon("ArrowDownCircle", 16)}
                                </div>
                                <div>
                                    <p class="text-xs ${
                                      appState.isDarkMode
                                        ? "text-gray-400"
                                        : "text-gray-600"
                                    }">
                                        Total Spent
                                    </p>
                                    <p class="text-lg font-semibold text-red-500">
                                        ${formatCurrency(totalSpent)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Quick Actions -->
                <div class="grid grid-cols-2 gap-4 mb-6">
                    <button id="cash-in-btn" class="bg-green-500 rounded-xl p-4 flex items-center justify-center space-x-2 active:scale-95 transition-transform">
                        ${getIcon("ArrowUpCircle", 20)}
                        <span class="text-white font-semibold">Cash In</span>
                    </button>

                    <button id="cash-out-btn" class="bg-red-500 rounded-xl p-4 flex items-center justify-center space-x-2 active:scale-95 transition-transform">
                        ${getIcon("ArrowDownCircle", 20)}
                        <span class="text-white font-semibold">Cash Out</span>
                    </button>
                </div>

                <!-- Recent Transactions -->
                <div>
                    <h2 class="text-lg font-semibold mb-4">Recent Transactions</h2>
                    <div class="space-y-3" id="recent-transactions-list">
                        ${activeBookTransactions
                          .slice(0, 5)
                          .map(
                            (transaction) => `
                            <div class="${cardClasses} border rounded-xl p-4">
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center space-x-3">
                                        <div class="p-2 rounded-full ${
                                          transaction.type === "in"
                                            ? "bg-green-500"
                                            : "bg-red-500"
                                        }">
                                            ${
                                              transaction.type === "in"
                                                ? getIcon("ArrowUpCircle", 16)
                                                : getIcon("ArrowDownCircle", 16)
                                            }
                                        </div>
                                        <div>
                                            <p class="font-medium">${
                                              transaction.description
                                            }</p>
                                            <p class="text-sm ${
                                              appState.isDarkMode
                                                ? "text-gray-400"
                                                : "text-gray-600"
                                            }">
                                                ${formatDate(
                                                  transaction.date
                                                )} • ${transaction.time}
                                            </p>
                                        </div>
                                    </div>
                                    <div class="flex items-center space-x-2">
                                        <span class="font-semibold ${
                                          transaction.type === "in"
                                            ? "text-green-500"
                                            : "text-red-500"
                                        }">
                                            ${
                                              transaction.type === "in"
                                                ? "+"
                                                : "-"
                                            }${formatCurrency(
                              transaction.amount
                            )}
                                        </span>
                                        <button data-transaction-id="${
                                          transaction.id
                                        }" class="edit-transaction-btn p-1 rounded ${
                              appState.isDarkMode
                                ? "hover:bg-gray-700"
                                : "hover:bg-gray-100"
                            }">
                                            ${getIcon("Edit3", 14)}
                                        </button>
                                        <button data-transaction-id="${
                                          transaction.id
                                        }" class="delete-transaction-btn p-1 rounded ${
                              appState.isDarkMode
                                ? "hover:bg-gray-700"
                                : "hover:bg-gray-100"
                            } text-red-500">
                                            ${getIcon("Trash2", 14)}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        `
                          )
                          .join("")}
                    </div>
                </div>
            `;

  // Attach event listeners
  document.getElementById("theme-toggle").onclick = () => {
    appState.isDarkMode = !appState.isDarkMode;
    renderUI();
  };
  document.getElementById("cash-in-btn").onclick = () => {
    appState.transactionType = "in";
    appState.showAddTransaction = true;
    appState.editingTransaction = null; // Clear editing state
    appState.newTransaction = {
      // Reset form for new transaction
      amount: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
      time: new Date().toTimeString().slice(0, 5),
    };
    renderUI();
  };
  document.getElementById("cash-out-btn").onclick = () => {
    appState.transactionType = "out";
    appState.showAddTransaction = true;
    appState.editingTransaction = null; // Clear editing state
    appState.newTransaction = {
      // Reset form for new transaction
      amount: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
      time: new Date().toTimeString().slice(0, 5),
    };
    renderUI();
  };

  homeScreen.querySelectorAll(".edit-transaction-btn").forEach((button) => {
    button.onclick = (event) => {
      const id = parseInt(event.currentTarget.dataset.transactionId);
      const transactionToEdit = appState.transactions.find((t) => t.id === id);
      if (transactionToEdit) {
        appState.editingTransaction = transactionToEdit;
        appState.newTransaction = {
          amount: transactionToEdit.amount.toString(),
          description: transactionToEdit.description,
          date: transactionToEdit.date,
          time: transactionToEdit.time,
        };
        appState.transactionType = transactionToEdit.type;
        appState.showAddTransaction = true;
        renderUI();
      }
    };
  });

  homeScreen.querySelectorAll(".delete-transaction-btn").forEach((button) => {
    button.onclick = (event) => {
      const id = parseInt(event.currentTarget.dataset.transactionId);
      appState.itemToDelete = { id, type: "transaction" };
      appState.showDeleteConfirmation = true;
      renderUI();
    };
  });
};

const renderBooksScreen = () => {
  const booksScreen = document.getElementById("books-screen");
  const cardClasses = appState.isDarkMode
    ? "bg-gray-800 border-gray-700"
    : "bg-white border-gray-200";

  booksScreen.innerHTML = `
                <div class="flex items-center justify-between mb-6">
                    <h1 class="text-2xl font-bold">Books</h1>
                    <button id="add-book-btn" class="bg-blue-500 p-3 rounded-full active:scale-95 transition-transform">
                        ${getIcon("Plus", 20)}
                    </button>
                </div>

                <div class="space-y-4" id="books-list">
                    ${appState.books
                      .map(
                        (book) => `
                        <div class="${cardClasses} border rounded-xl p-4">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center space-x-3">
                                    <div class="w-4 h-4 rounded-full" style="background-color: ${
                                      book.color
                                    }"></div>
                                    <div>
                                        <p class="font-semibold">${
                                          book.name
                                        }</p>
                                        ${
                                          book.isActive
                                            ? '<p class="text-sm text-blue-500">Active Book</p>'
                                            : ""
                                        }
                                    </div>
                                </div>
                                <div class="flex items-center space-x-2">
                                    ${
                                      !book.isActive
                                        ? `<button data-book-id="${book.id}" class="switch-book-btn px-3 py-1 bg-blue-500 text-white text-sm rounded-lg active:scale-95 transition-transform">
                                        Switch
                                    </button>`
                                        : ""
                                    }
                                    <button data-book-id="${
                                      book.id
                                    }" class="more-actions-book-btn p-2 rounded ${
                          appState.isDarkMode
                            ? "hover:bg-gray-700"
                            : "hover:bg-gray-100"
                        }">
                                        ${getIcon("MoreVertical", 16)}
                                    </button>
                                </div>
                            </div>
                            
                            ${
                              appState.showBookActions === book.id
                                ? `
                                <div class="mt-3 pt-3 border-t ${
                                  appState.isDarkMode
                                    ? "border-gray-600"
                                    : "border-gray-200"
                                } flex space-x-2">
                                    <button data-book-id="${
                                      book.id
                                    }" class="edit-book-btn flex items-center space-x-1 px-3 py-1 bg-gray-500 text-white text-sm rounded-lg active:scale-95 transition-transform">
                                        ${getIcon("Edit3", 12)}
                                        <span>Edit</span>
                                    </button>
                                    ${
                                      appState.books.length > 1
                                        ? `
                                        <button data-book-id="${
                                          book.id
                                        }" class="delete-book-btn flex items-center space-x-1 px-3 py-1 bg-red-500 text-white text-sm rounded-lg active:scale-95 transition-transform">
                                            ${getIcon("Trash2", 12)}
                                            <span>Delete</span>
                                        </button>
                                    `
                                        : ""
                                    }
                                </div>
                            `
                                : ""
                            }
                        </div>
                    `
                      )
                      .join("")}
                </div>
            `;

  // Attach event listeners
  document.getElementById("add-book-btn").onclick = () => {
    appState.showBookModal = true;
    appState.editingBook = null; // Clear editing state
    appState.newBook = { name: "", color: "#06B6D4" }; // Reset form
    renderUI();
  };

  booksScreen.querySelectorAll(".switch-book-btn").forEach((button) => {
    button.onclick = (event) => {
      const id = parseInt(event.currentTarget.dataset.bookId);
      appState.books = appState.books.map((b) => ({
        ...b,
        isActive: b.id === id,
      }));
      renderUI();
    };
  });

  booksScreen.querySelectorAll(".more-actions-book-btn").forEach((button) => {
    button.onclick = (event) => {
      const id = parseInt(event.currentTarget.dataset.bookId);
      appState.showBookActions = appState.showBookActions === id ? null : id;
      renderUI();
    };
  });

  booksScreen.querySelectorAll(".edit-book-btn").forEach((button) => {
    button.onclick = (event) => {
      const id = parseInt(event.currentTarget.dataset.bookId);
      const bookToEdit = appState.books.find((b) => b.id === id);
      if (bookToEdit) {
        appState.editingBook = bookToEdit;
        appState.newBook = { name: bookToEdit.name, color: bookToEdit.color };
        appState.showBookModal = true;
        appState.showBookActions = null; // Close actions dropdown
        renderUI();
      }
    };
  });

  booksScreen.querySelectorAll(".delete-book-btn").forEach((button) => {
    button.onclick = (event) => {
      const id = parseInt(event.currentTarget.dataset.bookId);
      if (appState.books.length <= 1) return; // Keep at least one book

      appState.itemToDelete = { id, type: "book" };
      appState.showDeleteConfirmation = true;
      renderUI();
    };
  });
};

// --- Render Functions for Modals ---

const renderAddTransactionModal = () => {
  const modal = document.getElementById("add-transaction-modal");
  const modalContent = document.getElementById("add-transaction-modal-content");
  const cardClasses = appState.isDarkMode
    ? "bg-gray-800 border-gray-700"
    : "bg-white border-gray-200";
  const inputClasses = appState.isDarkMode
    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500";

  if (appState.showAddTransaction) {
    modal.classList.remove("hidden");
    modalContent.className = `${cardClasses} w-full rounded-t-3xl p-6 space-y-4`;
    modalContent.innerHTML = `
                    <div class="flex items-center justify-between">
                        <h2 class="text-xl font-bold">
                            ${
                              appState.editingTransaction
                                ? "Edit Transaction"
                                : `${
                                    appState.transactionType === "in"
                                      ? "Cash In"
                                      : "Cash Out"
                                  }`
                            }
                        </h2>
                        <button id="close-transaction-modal" class="p-2 rounded-full ${
                          appState.isDarkMode
                            ? "hover:bg-gray-700"
                            : "hover:bg-gray-100"
                        }">
                            ${getIcon("X", 20)}
                        </button>
                    </div>

                    ${
                      !appState.editingTransaction
                        ? `
                        <div class="flex rounded-xl bg-gray-200 dark:bg-gray-700 p-1">
                            <button id="modal-cash-in-btn" class="flex-1 py-2 px-4 rounded-lg transition-colors ${
                              appState.transactionType === "in"
                                ? "bg-green-500 text-white"
                                : appState.isDarkMode
                                ? "text-gray-300"
                                : "text-gray-700"
                            }">
                                Cash In
                            </button>
                            <button id="modal-cash-out-btn" class="flex-1 py-2 px-4 rounded-lg transition-colors ${
                              appState.transactionType === "out"
                                ? "bg-red-500 text-white"
                                : appState.isDarkMode
                                ? "text-gray-300"
                                : "text-gray-700"
                            }">
                                Cash Out
                            </button>
                        </div>
                    `
                        : ""
                    }

                    <div>
                        <label class="block text-sm font-medium mb-2">Amount</label>
                        <input
                            type="number"
                            placeholder="0.00"
                            id="new-transaction-amount"
                            value="${appState.newTransaction.amount}"
                            class="w-full p-3 rounded-xl border ${inputClasses}"
                        />
                    </div>

                    <div>
                        <label class="block text-sm font-medium mb-2">Description</label>
                        <input
                            type="text"
                            placeholder="What was this for?"
                            id="new-transaction-description"
                            value="${appState.newTransaction.description}"
                            class="w-full p-3 rounded-xl border ${inputClasses}"
                        />
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium mb-2">Date</label>
                            <input
                                type="date"
                                id="new-transaction-date"
                                value="${appState.newTransaction.date}"
                                class="w-full p-3 rounded-xl border ${inputClasses}"
                            />
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">Time</label>
                            <input
                                type="time"
                                id="new-transaction-time"
                                value="${appState.newTransaction.time}"
                                class="w-full p-3 rounded-xl border ${inputClasses}"
                            />
                        </div>
                    </div>

                    <button id="submit-transaction-btn" class="w-full py-3 rounded-xl font-semibold text-white active:scale-95 transition-transform ${
                      appState.transactionType === "in"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }">
                        ${
                          appState.editingTransaction
                            ? "Update Transaction"
                            : `Add ${
                                appState.transactionType === "in"
                                  ? "Cash In"
                                  : "Cash Out"
                              }`
                        }
                    </button>
                `;

    // Attach event listeners for modal elements
    document.getElementById("close-transaction-modal").onclick = () => {
      appState.showAddTransaction = false;
      appState.editingTransaction = null;
      appState.newTransaction = {
        amount: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
        time: new Date().toTimeString().slice(0, 5),
      };
      renderUI();
    };

    if (!appState.editingTransaction) {
      document.getElementById("modal-cash-in-btn").onclick = () => {
        appState.transactionType = "in";
        renderAddTransactionModal(); // Re-render modal to update button styles
      };
      document.getElementById("modal-cash-out-btn").onclick = () => {
        appState.transactionType = "out";
        renderAddTransactionModal(); // Re-render modal to update button styles
      };
    }

    document.getElementById("new-transaction-amount").oninput = (e) => {
      appState.newTransaction.amount = e.target.value;
    };
    document.getElementById("new-transaction-description").oninput = (e) => {
      appState.newTransaction.description = e.target.value;
    };
    document.getElementById("new-transaction-date").onchange = (e) => {
      appState.newTransaction.date = e.target.value;
    };
    document.getElementById("new-transaction-time").onchange = (e) => {
      appState.newTransaction.time = e.target.value;
    };

    document.getElementById("submit-transaction-btn").onclick = () => {
      if (
        !appState.newTransaction.amount ||
        !appState.newTransaction.description
      )
        return;

      if (appState.editingTransaction) {
        appState.transactions = appState.transactions.map((t) =>
          t.id === appState.editingTransaction.id
            ? {
                ...t,
                type: appState.transactionType,
                amount: parseFloat(appState.newTransaction.amount),
                description: appState.newTransaction.description,
                date: appState.newTransaction.date,
                time: appState.newTransaction.time,
              }
            : t
        );
        appState.editingTransaction = null;
      } else {
        const transaction = {
          id: Date.now(),
          bookId: appState.books.find((book) => book.isActive).id,
          type: appState.transactionType,
          amount: parseFloat(appState.newTransaction.amount),
          description: appState.newTransaction.description,
          date: appState.newTransaction.date,
          time: appState.newTransaction.time,
        };
        appState.transactions = [transaction, ...appState.transactions];
      }

      appState.newTransaction = {
        amount: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
        time: new Date().toTimeString().slice(0, 5),
      };
      appState.showAddTransaction = false;
      renderUI();
    };
  } else {
    modal.classList.add("hidden");
  }
};

const renderBookModal = () => {
  const modal = document.getElementById("book-modal");
  const modalContent = document.getElementById("book-modal-content");
  const cardClasses = appState.isDarkMode
    ? "bg-gray-800 border-gray-700"
    : "bg-white border-gray-200";
  const inputClasses = appState.isDarkMode
    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500";

  if (appState.showBookModal) {
    modal.classList.remove("hidden");
    modalContent.className = `${cardClasses} w-full rounded-t-3xl p-6 space-y-4`;
    modalContent.innerHTML = `
                    <div class="flex items-center justify-between">
                        <h2 class="text-xl font-bold">
                            ${appState.editingBook ? "Edit Book" : "New Book"}
                        </h2>
                        <button id="close-book-modal" class="p-2 rounded-full ${
                          appState.isDarkMode
                            ? "hover:bg-gray-700"
                            : "hover:bg-gray-100"
                        }">
                            ${getIcon("X", 20)}
                        </button>
                    </div>

                    <div>
                        <label class="block text-sm font-medium mb-2">Book Name</label>
                        <input
                            type="text"
                            placeholder="Enter book name"
                            id="new-book-name"
                            value="${appState.newBook.name}"
                            class="w-full p-3 rounded-xl border ${inputClasses}"
                        />
                    </div>

                    <div>
                        <label class="block text-sm font-medium mb-2">Color</label>
                        <div class="flex space-x-3">
                            ${appState.colors
                              .map(
                                (color) => `
                                <button
                                    data-color="${color}"
                                    class="color-picker-btn w-10 h-10 rounded-full border-4 ${
                                      appState.newBook.color === color
                                        ? "border-white"
                                        : "border-transparent"
                                    }"
                                    style="background-color: ${color}"
                                ></button>
                            `
                              )
                              .join("")}
                        </div>
                    </div>

                    <button id="submit-book-btn" class="w-full py-3 bg-blue-500 text-white rounded-xl font-semibold active:scale-95 transition-transform">
                        ${appState.editingBook ? "Update Book" : "Create Book"}
                    </button>
                `;

    // Attach event listeners for modal elements
    document.getElementById("close-book-modal").onclick = () => {
      appState.showBookModal = false;
      appState.editingBook = null;
      appState.newBook = { name: "", color: "#06B6D4" };
      renderUI();
    };

    document.getElementById("new-book-name").oninput = (e) => {
      appState.newBook.name = e.target.value;
    };

    modalContent.querySelectorAll(".color-picker-btn").forEach((button) => {
      button.onclick = (e) => {
        appState.newBook.color = e.currentTarget.dataset.color;
        renderBookModal(); // Re-render modal to show selected color
      };
    });

    document.getElementById("submit-book-btn").onclick = () => {
      if (!appState.newBook.name) return;

      if (appState.editingBook) {
        appState.books = appState.books.map((b) =>
          b.id === appState.editingBook.id
            ? {
                ...b,
                name: appState.newBook.name,
                color: appState.newBook.color,
              }
            : b
        );
        appState.editingBook = null;
      } else {
        const book = {
          id: Date.now(),
          name: appState.newBook.name,
          color: appState.newBook.color,
          isActive: false,
        };
        // If it's the first book, make it active
        if (appState.books.length === 0) {
          book.isActive = true;
        }
        appState.books = [...appState.books, book];
      }

      appState.newBook = { name: "", color: "#06B6D4" };
      appState.showBookModal = false;
      renderUI();
    };
  } else {
    modal.classList.add("hidden");
  }
};

const renderDeleteConfirmationModal = () => {
  const modal = document.getElementById("delete-confirmation-modal");
  const modalContent = document.getElementById(
    "delete-confirmation-modal-content"
  );
  const cardClasses = appState.isDarkMode
    ? "bg-gray-800 border-gray-700"
    : "bg-white border-gray-200";

  if (appState.showDeleteConfirmation && appState.itemToDelete) {
    modal.classList.remove("hidden");
    modalContent.className = `${cardClasses} w-full max-w-sm rounded-2xl p-6 space-y-4 mx-4`;

    modalContent.innerHTML = `
                    <h3 class="text-lg font-bold text-center">Are you sure?</h3>
                    <p class="text-sm text-center ${
                      appState.isDarkMode ? "text-gray-400" : "text-gray-600"
                    }">
                        You are about to delete this ${
                          appState.itemToDelete.type
                        }. This action cannot be undone.
                    </p>
                    <div class="flex justify-center space-x-4 pt-4">
                        <button id="cancel-delete-btn" class="px-6 py-2 rounded-lg ${
                          appState.isDarkMode ? "bg-gray-700" : "bg-gray-200"
                        } font-semibold active:scale-95 transition-transform">
                            No
                        </button>
                        <button id="confirm-delete-btn" class="px-6 py-2 rounded-lg bg-red-500 text-white font-semibold active:scale-95 transition-transform">
                            Yes, Delete
                        </button>
                    </div>
                `;

    // Attach listeners
    document.getElementById("cancel-delete-btn").onclick = () => {
      appState.showDeleteConfirmation = false;
      appState.itemToDelete = null;
      renderUI();
    };

    document.getElementById("confirm-delete-btn").onclick = () => {
      const { id, type } = appState.itemToDelete;
      if (type === "transaction") {
        appState.transactions = appState.transactions.filter(
          (t) => t.id !== id
        );
      } else if (type === "book") {
        const bookToDelete = appState.books.find((b) => b.id === id);
        if (bookToDelete?.isActive && appState.books.length > 1) {
          const otherBook = appState.books.find((b) => b.id !== id);
          appState.books = appState.books
            .filter((b) => b.id !== id)
            .map((b, index) => ({ ...b, isActive: index === 0 }));
        } else {
          appState.books = appState.books.filter((b) => b.id !== id);
        }
        appState.transactions = appState.transactions.filter(
          (t) => t.bookId !== id
        );
        appState.showBookActions = null;
      }

      // Reset state and re-render
      appState.showDeleteConfirmation = false;
      appState.itemToDelete = null;
      renderUI();
    };
  } else {
    modal.classList.add("hidden");
  }
};

// --- Render Bottom Navigation ---

const renderBottomNavigation = () => {
  const nav = document.getElementById("bottom-navigation");
  const navItems = [
    { id: "home", icon: "Home", label: "Home" },
    { id: "books", icon: "BookOpen", label: "Books" },
    { id: "stats", icon: "BarChart3", label: "Stats" },
    { id: "settings", icon: "Settings", label: "Settings" },
  ];

  nav.className = `fixed bottom-0 left-0 right-0 ${
    appState.isDarkMode
      ? "bg-gray-800 border-gray-700"
      : "bg-white border-gray-200"
  } border-t px-4 py-2`;
  nav.querySelector(".flex").innerHTML = navItems
    .map(
      ({ id, icon, label }) => `
                <button
                    data-tab-id="${id}"
                    class="nav-button flex flex-col items-center py-2 px-3 rounded-xl transition-colors ${
                      appState.activeTab === id
                        ? "text-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : appState.isDarkMode
                        ? "text-gray-400"
                        : "text-gray-600"
                    }"
                >
                    ${getIcon(icon, 20)}
                    <span class="text-xs mt-1">${label}</span>
                </button>
            `
    )
    .join("");

  // Attach event listeners for navigation buttons
  nav.querySelectorAll(".nav-button").forEach((button) => {
    button.onclick = (event) => {
      appState.activeTab = event.currentTarget.dataset.tabId;
      renderUI();
    };
  });
};

// Initial render when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Ensure at least one book is active on load
  const activeBookExists = appState.books.some((book) => book.isActive);
  if (!activeBookExists && appState.books.length > 0) {
    appState.books[0].isActive = true;
  } else if (appState.books.length === 0) {
    // If no books exist, add a default one
    appState.books.push({
      id: Date.now(),
      name: "Personal",
      color: "#06B6D4",
      isActive: true,
    });
  }
  renderUI();
});
