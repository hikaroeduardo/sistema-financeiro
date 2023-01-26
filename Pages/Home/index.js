const userLogout = () => {
    localStorage.clear();

    window.open('../../index.html', '_self');
};

const deleteItem = async (id) => {
    const email = localStorage.getItem("@SistemaFinanceiro: userEmail");

    try {
        await fetch(`https://mp-wallet-app-api.herokuapp.com/finances/${id}`, {
            method: "DELETE",
            headers: {
                email: email,
            }
        });

        renderFinancesData();

    } catch(error) {
        alert("Erro ao deletar item!");
    };
};

const renderFinancesList = (result) => {
    const table = document.getElementById('table');

    table.innerHTML = "";

    result.map((item) => {
        const div = document.createElement('div');
        div.className = "table-data";

        const pTitle = document.createElement('p');
        pTitle.innerText = item.title;

        const pCategory = document.createElement('p');
        pCategory.innerText = item.name;

        const pData = document.createElement('p');
        pData.innerText = new Date(item.date).toLocaleDateString();

        const pValue = document.createElement('p');
        pValue.innerText = new Intl.NumberFormat("pt-BR", {style: "currency", currency: "BRL",}).format(item.value);

        const pDelete = document.createElement('p');
        pDelete.innerText = "Deletar";
        pDelete.style.cursor = "pointer";
        pDelete.onclick = () => {
            deleteItem(item.id)
        };

        // Add div
        div.appendChild(pTitle);
        div.appendChild(pCategory);
        div.appendChild(pData);
        div.appendChild(pValue);
        div.appendChild(pDelete);

        // Add div table
        table.appendChild(div);
    });
};

const renderFinancesData = async () => {
    const email = localStorage.getItem("@SistemaFinanceiro: userEmail");
    const dateInputValue = document.getElementById('input-month').value;
  
    const date = `${dateInputValue}-15`;

    const response = await fetch(`https://mp-wallet-app-api.herokuapp.com/finances?date=${date}`, {
        method: "GET",
        headers: {
            email: email
        }
    });

    const result = await response.json();

    renderFinancesList(result);

    const revenues = result.filter((item) => {return Number(item.value) > 0}).reduce((acc, item) => 
    acc + Number(item.value), 0);

    const expenses = result.filter((item) => {return Number(item.value) < 0}).reduce((acc, item) => acc + Number(item.value), 0);

    const balanceTotal = revenues + expenses;


    // Add Revenues Text
    const revenueText = document.getElementById('revenues');
    revenueText.innerText = new Intl.NumberFormat("pt-BR", {style: "currency", currency: "BRL",}).format(revenues);

    // Add Expenses Text
    const expenseText = document.getElementById('expenses');
    expenseText.style.color = "red";
    expenseText.innerText = new Intl.NumberFormat("pt-BR", {style: "currency", currency: "BRL",}).format(expenses);

    // Add Balace Text
    const balanceText = document.getElementById('balance');

    balanceText.innerText = new Intl.NumberFormat("pt-BR", {style: "currency", currency: "BRL",}).format(balanceTotal);

    if (balanceTotal < 0) {
        balanceText.style.color = "red";
        return
    } else {
        balanceText.style.color = "green";
        return
    };
};

const renderUserData = (email, name) => {
    const emailText = document.getElementById('emailText');
    emailText.innerText = email;

    const initialLetterName = document.getElementById('initial-letter-name');
    initialLetterName.innerText= name.charAt(0).toUpperCase();

    const logout = document.getElementById('logout');
    logout.innerText = "sair";
    logout.addEventListener('click', () => {
        userLogout();
    })
};

const initialDate = () => {
    const dateInputMonth = document.getElementById('input-month');
    const nowDateYear = new Date().toISOString().split("-")[0];
    const nowDateMonth = new Date().toISOString().split("-")[1];
    dateInputMonth.value = `${nowDateYear}-${nowDateMonth}`;

    dateInputMonth.onchange = () => {
        renderFinancesData();
    };
};

const loadCategories = async () => {
    const select = document.getElementById('category');

    const categories = await fetch('https://mp-wallet-app-api.herokuapp.com/categories');

    const categoriesResult = await categories.json();

    categoriesResult.map((item) => {
        const option = document.createElement('option');
        option.innerText = item.name;
        option.id = `category_${item.id}`;
        option.value = item.id;

        select.appendChild(option);
    });
};

const openModal = () => {
    const modal = document.getElementById('modal');
    modal.style.display = "flex";
};

const closeModal = () => {
    const modal = document.getElementById('modal');
    modal.style.display = "none";
};

const createNewFinance = async (target) => {
    try {
        const email = localStorage.getItem("@SistemaFinanceiro: userEmail");

        const title = target[0].value;
        const value = Number(target[1].value);
        const date = target[2].value;
        const category = Number(target[3].value);

        const dataPost = {
            title: title,
            value: value,
            date: date,
            category_id: category
        }

        const response = await fetch("https://mp-wallet-app-api.herokuapp.com/finances", {
            method: "POST",
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                "Content-Type": "application/json",
                email: email
            },
            body: JSON.stringify(dataPost)
        });

        closeModal();

        renderFinancesData();

        target[0].value = "";
        target[1].value = "";
        target[2].value = "";
        target[3].value = 1;

    } catch(error) {
        alert("Erro ao adicionar novo item!");
    };
};

window.onload = () => {
    const email = localStorage.getItem("@SistemaFinanceiro: userEmail");
    const name = localStorage.getItem("@SistemaFinanceiro: userName");

    const form = document.getElementById('form-add-new-item');
    const input = document.querySelectorAll('input');

    initialDate();

    renderUserData(email, name);

    renderFinancesData();

    loadCategories();

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        createNewFinance(e.target);
    });
};