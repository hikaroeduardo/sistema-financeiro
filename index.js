const validateUser = async (email) => {
    try {
        // Fazer requisição da API
        const response = await fetch(`https://mp-wallet-app-api.herokuapp.com/users?email=${email}`);

        // Transformar resposta em JSON
        const user = await response.json();

        return user;

    } catch(error) {
        console.log({error})
    };
};

window.onload = () => {
    const formAccess = document.getElementById("form-access");
    formAccess.addEventListener("submit", async (e) => {
        e.preventDefault();

        const inputEmail = document.getElementById('email');
        const inputEmailValue = inputEmail.value;

        const result = await validateUser(inputEmailValue);

        console.log(result);

        if(result.error) {
            alert("Usuário não existe! Por favor, faça seu cadastro e tente novamente.");

            return;
        };

        localStorage.setItem("@SistemaFinanceiro: userEmail", result.email);
        localStorage.setItem("@SistemaFinanceiro: userName", result.name);
        localStorage.setItem("@SistemaFinanceiro: userId", result.id);

        window.open('Pages/Home/index.html', "_self");
    });
};