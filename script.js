const addBtn = document.getElementById("addBtn");

const typeSelect = document.getElementById("type");
const categorySelect = document.getElementById("category");
const customCategory = document.getElementById("customCategory");

let records = JSON.parse(localStorage.getItem("records")) || [];

function updateCategories() {

    if (typeSelect.value === "income") {

        categorySelect.innerHTML = `
            <option value="용돈">용돈</option>
            <option value="알바비">알바비</option>
            <option value="기타">기타</option>
        `;

    } else {

        categorySelect.innerHTML = `
            <option value="식비">식비</option>
            <option value="교통비">교통비</option>
            <option value="쇼핑">쇼핑</option>
            <option value="취미">취미</option>
            <option value="기타">기타</option>
        `;
    }

    customCategory.style.display = "none";
}

typeSelect.addEventListener("change", updateCategories);

categorySelect.addEventListener("change", () => {

    if (categorySelect.value === "기타") {
        customCategory.style.display = "block";
    } else {
        customCategory.style.display = "none";
    }
});

updateCategories();

addBtn.addEventListener("click", addRecord);

function addRecord() {

    const date = document.getElementById("date").value;
    const amount = Number(document.getElementById("amount").value);
    const type = document.getElementById("type").value;
    const memo = document.getElementById("memo").value;

    let category = categorySelect.value;

    if (category === "기타") {

        category = customCategory.value.trim();

        if (!category) {
            alert("카테고리를 입력하세요.");
            return;
        }
    }

    if (!date || amount <= 0) {
        alert("날짜와 금액을 입력하세요.");
        return;
    }

    const record = {
        id: Date.now(),
        date,
        amount,
        type,
        category,
        memo
    };

    records.push(record);

    saveData();
    render();

    document.getElementById("amount").value = "";
    document.getElementById("memo").value = "";
    customCategory.value = "";
}

function deleteRecord(id) {

    records = records.filter(record => record.id !== id);

    saveData();
    render();
}

function saveData() {
    localStorage.setItem("records", JSON.stringify(records));
}

function render() {

    const tableBody = document.getElementById("tableBody");

    tableBody.innerHTML = "";

    let totalIncome = 0;
    let totalExpense = 0;

    let categoryExpense = {};

    records.forEach(record => {

        if (record.type === "income") {

            totalIncome += record.amount;

        } else {

            totalExpense += record.amount;

            categoryExpense[record.category] =
                (categoryExpense[record.category] || 0)
                + record.amount;
        }

        const row = `
            <tr>
                <td>${record.date}</td>
                <td>${record.type === "income" ? "수입" : "지출"}</td>
                <td>${record.category}</td>
                <td>${record.memo || "-"}</td>
                <td>${record.amount.toLocaleString()}원</td>
                <td>
                    <button
                        class="delete-btn"
                        onclick="deleteRecord(${record.id})">
                        삭제
                    </button>
                </td>
            </tr>
        `;

        tableBody.innerHTML += row;
    });

    document.getElementById("totalIncome").textContent =
        totalIncome.toLocaleString() + "원";

    document.getElementById("totalExpense").textContent =
        totalExpense.toLocaleString() + "원";

    document.getElementById("balance").textContent =
        (totalIncome - totalExpense).toLocaleString() + "원";

    const categories = Object.keys(categoryExpense);

    if (categories.length === 0) {

        document.getElementById("analysis").textContent =
            "지출 데이터가 없습니다.";

    } else {

        let maxCategory = categories[0];

        categories.forEach(category => {

            if (
                categoryExpense[category] >
                categoryExpense[maxCategory]
            ) {
                maxCategory = category;
            }
        });

        document.getElementById("analysis").textContent =
            `가장 많이 지출한 카테고리는 "${maxCategory}"이며 ${categoryExpense[maxCategory].toLocaleString()}원을 사용했습니다.`;
    }
}

render();