let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

const incomeCategories = ["Salary", "Freelance", "Investment", "Gift", "Other"];
const expenseCategories = ["Food", "Rent", "Transportation", "Shopping", "Entertainment", "Bills", "Other"];

function populateCategories() {
  const type = document.getElementById("type").value;
  const categorySelect = document.getElementById("category");
  const categories = type === "income" ? incomeCategories : expenseCategories;

  categorySelect.innerHTML = "";
  categories.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categorySelect.appendChild(option);
  });
}

function updateBalance() {
  let totalIncome = 0;
  let totalExpenses = 0;
  const list = document.getElementById("transaction-list");
  list.innerHTML = "";

  transactions.forEach((t) => {
    const amount = parseFloat(t.amount);
    const cls = t.type === "income" ? "badge-income" : "badge-expense";
    list.innerHTML += `<tr>
      <td><span class="badge ${cls}">${t.type}</span></td>
      <td>$${amount.toFixed(2)}</td>
      <td>${t.category}</td>
      <td>${t.date}</td>
    </tr>`;
    if (t.type === "income") totalIncome += amount;
    else totalExpenses += amount;
  });

  const balance = totalIncome - totalExpenses;
  document.getElementById("total-income").innerText = `$${totalIncome.toFixed(2)}`;
  document.getElementById("total-expenses").innerText = `$${totalExpenses.toFixed(2)}`;
  document.getElementById("balance").innerText = `$${balance.toFixed(2)}`;
  document.getElementById("warning").style.display = balance < 0 ? "block" : "none";
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Update categories when type changes
document.getElementById("type").addEventListener("change", populateCategories);

document.getElementById("budget-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const type = document.getElementById("type").value;
  const amount = document.getElementById("amount").value.trim();
  const category = document.getElementById("category").value;
  const date = document.getElementById("date").value;
  if (!amount || isNaN(amount) || parseFloat(amount) <= 0) { alert("Please enter a valid amount."); return; }
  transactions.push({ type, amount: parseFloat(amount), category, date });
  updateBalance();
  this.reset();
  populateCategories(); // reset categories back to income defaults
});

document.getElementById("clear-transactions").addEventListener("click", function () {
  if (confirm("Clear all transactions?")) { transactions = []; localStorage.removeItem("transactions"); updateBalance(); }
});

document.getElementById("export-csv").addEventListener("click", function () {
  let csv = "Type,Amount,Category,Date\n";
  transactions.forEach((t) => { csv += `${t.type},${t.amount},${t.category},${t.date}\n`; });
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "budget_report.csv"; a.click();
  URL.revokeObjectURL(url);
});

// Initialize
populateCategories();
updateBalance();