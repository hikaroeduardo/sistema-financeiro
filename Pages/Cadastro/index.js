const requestRegister = async (email, name) => {
    try {
        const data = {
            email: email,
            name: name
        };

        const response = await fetch("https://mp-wallet-app-api.herokuapp.com/users", {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();
        return result;

    } catch (error) {
        console.log({error});
    }
};

const register = async () => {
    const name = document.getElementById('name');
    const nameValue = name.value;

    const email = document.getElementById('email');
    const emailValue = email.value;

    if(nameValue.length < 3) {
        alert("Nome deve contar mais de 3 caracteres.");
        return;
    };

    if(emailValue.length < 5 || !emailValue.includes('@')) {
        alert("E-mail inválido");
        return;
    };

    const result = await requestRegister(emailValue, nameValue);

    if(result.error) {
        alert("Usuário ja cadastrado, insira um usuário novo.");

        return;
    }

    alert("Usuário cadastrado com sucesso.");

    window.open("../Login/index.html", "_self");
};

window.onload = () => {
    const formRegister = document.getElementById('form-register');
    formRegister.addEventListener('submit', (e) => {
        e.preventDefault();

        register();
    });
};