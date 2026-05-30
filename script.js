let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

function addTransaction() {
  const desc = document.getElementById("desc").value;
  const amount = +document.getElementById("amount").value;
  const type = document.getElementById("type").value;

  if (!desc || !amount) return alert("Fill all fields");

  transactions.push({
    id: Date.now(),
    desc,
    amount,
    type
  });

  save();
  render();

  document.getElementById("desc").value = "";
  document.getElementById("amount").value = "";
}

function deleteTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  save();
  render();
}

function save() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

function resetData() {
  if (confirm("Clear all data?")) {
    transactions = [];
    save();
    render();
  }
}

function render() {
  const list = document.getElementById("list");
  const search = document.getElementById("search").value.toLowerCase();
  const filter = document.getElementById("filterType").value;

  list.innerHTML = "";

  let income = 0;
  let expense = 0;

  transactions
    .filter(t =>
      (filter === "all" || t.type === filter) &&
      t.desc.toLowerCase().includes(search)
    )
    .forEach(t => {
      if (t.type === "income") income += t.amount;
      else expense += t.amount;

      const div = document.createElement("div");
      div.className = `transaction ${t.type}`;

      div.innerHTML = `
        <span>${t.desc} - ₹${t.amount}</span>
        <button class="delete" onclick="deleteTransaction(${t.id})">X</button>
      `;

      list.appendChild(div);
    });

  document.getElementById("income").innerText = income;
  document.getElementById("expense").innerText = expense;
  document.getElementById("balance").innerText = income - expense;

  renderChart(income, expense);
}

function renderChart(income, expense) {
  const container = document.getElementById("chartContainer");

  const total = income + expense;

  if (total === 0) {
    container.innerHTML = "<h3>No data for chart</h3>";
    return;
  }

  const incomePercent = ((income / total) * 100).toFixed(1);
  const expensePercent = ((expense / total) * 100).toFixed(1);

  container.innerHTML = `
    <h3>Income vs Expense</h3>
    <p>Income: ₹${income} (${incomePercent}%)</p>
    <p>Expense: ₹${expense} (${expensePercent}%)</p>
  `;
}

function exportPDF() {
  const element = document.getElementById("report");

  html2pdf().set({
    margin: 0.5,
    filename: "Finance_Report.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "letter", orientation: "portrait" }
  }).from(element).save();
}

render();