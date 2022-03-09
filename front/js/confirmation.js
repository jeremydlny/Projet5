document.addEventListener("DOMContentLoaded", function (event) {

    async function main() {

        //Récupération URL
        const url = new URL(window.location.href);

        let orderId = url.searchParams.get("id");

        document.getElementById('orderId').innerText = orderId;

        localStorage.clear();

    }

    main();
})  