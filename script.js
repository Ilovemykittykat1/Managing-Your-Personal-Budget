// Load transactions from local storage
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

function updateBalance() {
    let totalIncome = 0;
    let totalExpenses = 0;
    let transactionList = document.getElementById("transaction-list");
    transactionList.innerHTML = ""; // Clear previous entries

    transactions.forEach(t => {
        let amount = parseFloat(t.amount); // ✅ Ensure it's a number

        let row = `<tr>
            <td>${t.type}</td>
            <td>$${amount.toFixed(2)}</td>
            <td>${t.category}</td>
            <td>${t.date}</td>
        </tr>`;
        transactionList.innerHTML += row;

        if (t.type === "income") {
            totalIncome += amount; // ✅ Correctly add income
        } else {
            totalExpenses += amount; // ✅ Correctly subtract expenses
        }
    });

    let balance = totalIncome - totalExpenses;

    // Update UI with new values
    document.getElementById("total-income").innerText = `$${totalIncome.toFixed(2)}`;
    document.getElementById("total-expenses").innerText = `$${totalExpenses.toFixed(2)}`;
    document.getElementById("balance").innerText = `$${balance.toFixed(2)}`;

    document.getElementById("warning").style.display = balance < 0 ? "block" : "none";

    // Save transactions to localStorage
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Handle form submission
document.getElementById("budget-form").addEventListener("submit", function(event) {
    event.preventDefault();

    let type = document.getElementById("type").value;
    let amount = document.getElementById("amount").value.trim();
    let category = document.getElementById("category").value;
    let date = document.getElementById("date").value;

    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
        alert("Please enter a valid amount.");
        return;
    }

    transactions.push({ type, amount: parseFloat(amount), category, date });

    updateBalance();
    document.getElementById("budget-form").reset();
});

// Clear all transactions
document.getElementById("clear-transactions").addEventListener("click", function() {
    if (confirm("Are you sure you want to clear all transactions?")) {
        transactions = [];
        localStorage.removeItem("transactions");
        updateBalance();
    }
});

// Export CSV
document.getElementById("export-csv").addEventListener("click", function() {
    let csvContent = "Type,Amount,Category,Date\n";
    transactions.forEach(t => {
        csvContent += `${t.type},${t.amount},${t.category},${t.date}\n`;
    });

    let blob = new Blob([csvContent], { type: "text/csv" });
    let url = URL.createObjectURL(blob);
    let a = document.createElement("a");
    a.href = url;
    a.download = "budget_report.csv";
    a.click();
});

// ✅ Initialize display
updateBalance();
