
// NAVIGATION MENU
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("show");
});

document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("show");
    });
});

// TYPING ANIMATION
const words = ["Full Stack Developer", "Web Developer", "Creative Coder"];
let wordIndex = 0;
let charIndex = 0;
let deleting = false;

function typeEffect() {
    const typing = document.getElementById("typing");
    const currentWord = words[wordIndex];

    typing.textContent = currentWord.substring(0, charIndex);

    if (!deleting && charIndex < currentWord.length) {
        charIndex++;
        setTimeout(typeEffect, 100);
    } else if (deleting && charIndex > 0) {
        charIndex--;
        setTimeout(typeEffect, 50);
    } else {
        deleting = !deleting;

        if (!deleting) {
            wordIndex = (wordIndex + 1) % words.length;
        }

        setTimeout(typeEffect, 700);
    }
}

typeEffect();

// PROJECT MODAL
const modal = document.getElementById("projectModal");

function openProject(project) {
    modal.classList.add("active");
    document.body.style.overflow = "hidden";

    document.querySelectorAll(".mini-app").forEach(app => {
        app.classList.remove("active");
    });

    document.getElementById(project + "App").classList.add("active");
}

function closeProject() {
    modal.classList.remove("active");
    document.body.style.overflow = "";
}

modal.addEventListener("click", event => {
    if (event.target === modal) {
        closeProject();
    }
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeProject();
});

// ====================================
// PROJECT 1: EXPENSE TRACKER
// ====================================

let expenses = JSON.parse(localStorage.getItem("akshamExpenses") || "[]");

function saveExpenses() {
    localStorage.setItem("akshamExpenses", JSON.stringify(expenses));
}

function displayExpenses() {
    const expenseList = document.getElementById("expenseList");
    const totalElement = document.getElementById("totalExpense");

    expenseList.innerHTML = "";

    const total = expenses.reduce(
        (sum, expense) => sum + expense.amount, 0
    );

    totalElement.textContent = "₹" + total.toFixed(2);

    expenses.forEach((expense, index) => {
        const li = document.createElement("li");

        const name = document.createElement("span");
        name.textContent = expense.name + " - ₹" + expense.amount.toFixed(2);

        const deleteBtn = document.createElement("button");
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.setAttribute("aria-label", "Delete expense");
        deleteBtn.addEventListener("click", () => {
            deleteExpense(index);
        });

        li.append(name, deleteBtn);
        expenseList.appendChild(li);
    });
}

function addExpense() {
    const nameInput = document.getElementById("expenseName");
    const amountInput = document.getElementById("expenseAmount");

    const name = nameInput.value.trim();
    const amount = Number(amountInput.value);

    if (!name || !Number.isFinite(amount) || amount <= 0) {
        alert("Please enter a valid expense name and amount.");
        return;
    }

    expenses.push({ name, amount });

    saveExpenses();
    displayExpenses();

    nameInput.value = "";
    amountInput.value = "";
}

function deleteExpense(index) {
    expenses.splice(index, 1);
    saveExpenses();
    displayExpenses();
}

displayExpenses();

// ====================================
// PROJECT 2: SMART CALCULATOR
// ====================================

let calcExpression = "";

function updateCalculator() {
    document.getElementById("calcDisplay").value =
        calcExpression || "0";
}

function appendCalc(value) {
    if (calcExpression.length >= 50) return;

    calcExpression += value;
    updateCalculator();
}

function clearCalc() {
    calcExpression = "";
    updateCalculator();
}

function deleteCalc() {
    calcExpression = calcExpression.slice(0, -1);
    updateCalculator();
}

// Safe mathematical parser: no eval()
function calculate() {
    if (!calcExpression) return;

    try {
        const tokens = calcExpression.match(
            /(?:\d+\.?\d*|\.\d+)|[()+\-*/]/g
        );

        if (!tokens || tokens.join("") !== calcExpression) {
            throw new Error("Invalid expression");
        }

        let position = 0;

        function expression() {
            let result = term();

            while (tokens[position] === "+" ||
                   tokens[position] === "-") {
                const operator = tokens[position++];

                const right = term();

                result = operator === "+"
                    ? result + right
                    : result - right;
            }

            return result;
        }

        function term() {
            let result = factor();

            while (tokens[position] === "*" ||
                   tokens[position] === "/") {
                const operator = tokens[position++];

                const right = factor();

                if (operator === "/" && right === 0) {
                    throw new Error("Cannot divide by zero");
                }

                result = operator === "*"
                    ? result * right
                    : result / right;
            }

            return result;
        }

        function factor() {
            if (tokens[position] === "+") {
                position++;
                return factor();
            }

            if (tokens[position] === "-") {
                position++;
                return -factor();
            }

            if (tokens[position] === "(") {
                position++;

                const result = expression();

                if (tokens[position] !== ")") {
                    throw new Error("Missing closing bracket");
                }

                position++;
                return result;
            }

            const value = tokens[position++];

            if (!value || !/^(?:\d+\.?\d*|\.\d+)$/.test(value)) {
                throw new Error("Invalid number");
            }

            return Number(value);
        }

        const result = expression();

        if (position !== tokens.length || !Number.isFinite(result)) {
            throw new Error("Invalid calculation");
        }

        calcExpression = String(
            Number(result.toPrecision(12))
        );

        updateCalculator();

    } catch (error) {
        document.getElementById("calcDisplay").value = "Error";
        calcExpression = "";
    }
}

// ====================================
// PROJECT 3: TO-DO LIST
// ====================================

let todos = JSON.parse(localStorage.getItem("akshamTodos") || "[]");

function saveTodos() {
    localStorage.setItem("akshamTodos", JSON.stringify(todos));
}

function displayTodos() {
    const todoList = document.getElementById("todoList");
    todoList.innerHTML = "";

    todos.forEach((todo, index) => {
        const li = document.createElement("li");

        const label = document.createElement("label");
        label.style.display = "flex";
        label.style.alignItems = "center";
        label.style.gap = "9px";
        label.style.flex = "1";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = todo.completed;
        checkbox.style.width = "auto";

        checkbox.addEventListener("change", () => {
            todos[index].completed = checkbox.checked;
            saveTodos();
            displayTodos();
        });

        const text = document.createElement("span");
        text.textContent = todo.text;

        if (todo.completed) {
            text.style.textDecoration = "line-through";
            text.style.opacity = "0.5";
        }

        label.append(checkbox, text);

        const deleteBtn = document.createElement("button");
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.setAttribute("aria-label", "Delete task");

        deleteBtn.addEventListener("click", () => {
            todos.splice(index, 1);
            saveTodos();
            displayTodos();
        });

        li.append(label, deleteBtn);
        todoList.appendChild(li);
    });
}

function addTodo() {
    const input = document.getElementById("todoInput");
    const task = input.value.trim();

    if (!task) {
        alert("Please enter a task!");
        return;
    }

    todos.push({
        text: task,
        completed: false
    });

    saveTodos();
    displayTodos();

    input.value = "";
}

document.getElementById("todoInput").addEventListener("keydown", event => {
    if (event.key === "Enter") addTodo();
});

displayTodos();

// ====================================
// CONTACT FORM
// ====================================

document.getElementById("contactForm").addEventListener("submit", event => {
    event.preventDefault();

    const name = document.getElementById("contactName").value.trim();
    const email = document.getElementById("contactEmail").value.trim();
    const message = document.getElementById("contactMessage").value.trim();
    const status = document.getElementById("formStatus");

    if (!name || !email || !message) {
        status.textContent = "Please complete all fields.";
        return;
    }

    const subject = encodeURIComponent("Portfolio Contact - " + name);
    const body = encodeURIComponent(
        "Name: " + name +
        "\nEmail: " + email +
        "\n\nMessage:\n" + message
    );

    status.textContent = "Opening your email application...";

    window.location.href =
        "mailto:aksham@example.com?subject=" + subject +
        "&body=" + body;
});

// ====================================
// SCROLL REVEAL ANIMATION
// ====================================

const revealElements = document.querySelectorAll(
    ".section-heading, .about-content, .skill-card, .project-card, .contact-container"
);

revealElements.forEach(element => {
    element.classList.add("reveal");
});

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.12
});

revealElements.forEach(element => observer.observe(element));

// FOOTER YEAR
document.getElementById("year").textContent =
    new Date().getFullYear();
