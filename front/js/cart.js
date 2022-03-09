document.addEventListener("DOMContentLoaded", function (event) {


    //-------------------fonction principale-------------------//
    //--------------------------------------------------------//
    async function main() {

        let ApiArray = [];

        // Stockage des informations de notre localstorage.
        let localStorageArray = getLocalStorageProduct();

        for (let i = 0; i < localStorageArray.length; i++) {
            ApiArray.push(await GetApi(localStorageArray[i]));
        }

        let AllProducts = ConcatArray(localStorageArray, ApiArray);

        DisplayProduct(AllProducts);

        DisplayTotalPrice(AllProducts);

        Listen(AllProducts);

        // Fonction Verification Regex
        Validation();
    }

    main();


    function getLocalStorageProduct() {

        let getLocalStorage = [];
        for (let i = 0; i < localStorage.length; i++) {
            getLocalStorage[i] = JSON.parse(localStorage.getItem(localStorage.key(i)));

        }
        return getLocalStorage;

    }

    function GetApi(localStorageArray) {

        return fetch("http://localhost:3000/api/products/" + localStorageArray.id)
            .then(function (response) {
                if (response.ok) {
                    return response.json();
                }

            })
            .catch(function (error) {
                console.log(error);
            })

    }

    function ConcatArray(localStorageArray, ApiArray) {

        let AllProducts = [];

        for (let i = 0; i < localStorageArray.length; i++) {
            let ObjectProduct = {
                altTxt: ApiArray[i].altTxt,
                colors: localStorageArray[i].color,
                description: ApiArray[i].description,
                imageUrl: ApiArray[i].imageUrl,
                name: ApiArray[i].name,
                price: ApiArray[i].price,
                _id: localStorageArray[i].id,
                qty: localStorageArray[i].qty
            }

            AllProducts.push(ObjectProduct);

        }
        return AllProducts;
    }

    function DisplayProduct(products) {

        for (product of products) {

            // On stock notre balise Html.
            const domCreation = document.getElementById("cart__items");
            // On push nos nouvels informations dans notre Html.
            domCreation.insertAdjacentHTML(
                "beforeend",
                `<article class="cart__item" data-id="${product._id}">
                    <div class="cart__item__img">
                        <img src="${product.imageUrl}" alt="${product.altTxt}">
                    </div>
                    <div class="cart__item__content">
                        <div class="cart__item__content__titlePrice">
                            <h2>${product.name} ${product.colors}</h2>
                            <p>${product.price} €</p>
                        </div>
                        <div class="cart__item__content__settings">
                            <div class="cart__item__content__settings__quantity">
                            <p>Qté : </p>
                            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.qty}">
                        </div>
                        <div class="cart__item__content__settings__delete">
                            <p class="deleteItem">Supprimer</p>
                        </div>
                    </div>
                </article>`
            );
        }
    }

    function DisplayTotalPrice(AllProducts) {
        // de base 2 variable a 0
        let totalPrice = 0;
        let totalQty = 0;

        for (product of AllProducts) {
            totalPrice += parseInt(product.qty * product.price);
            totalQty += parseInt(product.qty);
        }

        const DtotalQty = document.getElementById("totalQuantity");
        const DtotalPrice = document.getElementById("totalPrice");

        DtotalQty.innerText = totalQty;
        DtotalPrice.innerText = totalPrice;
    }

    //-------------------Fonction principal d'écoute-------------------//
    //----------------------------------------------------------------//
    function Listen(AllProducts) {
        // Fonction si changement dans notre input quantity.
        ecoutequantity(AllProducts);
        // Fonction si on veux supprimer un éléments de la liste.
        ecoutedeleteProduct(AllProducts);
    }

    function ecoutequantity(AllProducts) {
        let qtyinput = document.querySelectorAll(".itemQuantity");

        qtyinput.forEach(function (input) {
            input.addEventListener("input", function (inputevent) {

                let inputQty = inputevent.target.value;

                if (inputQty >= 1 && inputQty <= 100) {
                    const productName = input
                        .closest("div.cart__item__content")
                        .querySelector("div.cart__item__content__titlePrice > h2").innerText;

                    let localstorageKey = JSON.parse(localStorage.getItem(productName));
                    localstorageKey.qty = inputQty;
                    localStorage.setItem(productName, JSON.stringify(localstorageKey));

                    const result = AllProducts.find(AllProduct => AllProduct.name === localstorageKey.name && AllProduct.colors === localstorageKey.color);

                    result.qty = inputQty;

                    DisplayTotalPrice(AllProducts);

                } else {
                    alert("Choisis une bonne quantité trou de balle.")
                }
            })
        })

    }


    function ecoutedeleteProduct(AllProducts) {
        let deleteLink = document.querySelectorAll(".deleteItem");

        deleteLink.forEach(function (input) {
            input.addEventListener("click", function () {
                const productName = input
                    .closest("div.cart__item__content")
                    .querySelector("div.cart__item__content__titlePrice > h2").innerText;

                let localstorageKey = JSON.parse(localStorage.getItem(productName));

                localStorage.removeItem(productName);

                input.closest("div.cart__item__content").parentNode.remove();

                const result = AllProducts.find(AllProduct => AllProduct.name === localstorageKey.name && AllProduct.colors === localstorageKey.color);

                AllProducts = AllProducts.filter(product => product !== result);

                ecoutequantity(AllProducts);

                DisplayTotalPrice(AllProducts);
            })
        })

    }

    //-------------------Validation formulaire-------------------//
    //----------------------------------------------------------------//
    function ValidationForm(form) {

        // Initialisation de nos variables de test.
        const stringRegex = /^[a-zA-Z-]+$/;
        const emailRegex = /^\w+([.-]?\w+)@\w+([.-]?\w+).(.\w{2,3})+$/;
        const addressRegex = /^[a-zA-Z0-9\s,.'-]{3,}$/;
        let control = true;


        // Si une des valeurs dans nos inputs de notre Form on affiche un méssage d'érreur.
        if (!form.firstName.value.match(stringRegex)) {
            document.getElementById("firstNameErrorMsg").innerText = "Mauvais prénom";
            control = false;
            // Sinon on affiche rien
        } else {
            document.getElementById("firstNameErrorMsg").innerText = "";
        }

        if (!form.lastName.value.match(stringRegex)) {
            document.getElementById("lastNameErrorMsg").innerText = "Mauvais nom";
            control = false;
            // Sinon on affiche rien
        } else {
            document.getElementById("lastNameErrorMsg").innerText = "";
        }

        if (!form.address.value.match(addressRegex)) {
            document.getElementById("addressErrorMsg").innerText = "Mauvaise adresse";
            control = false;
            // Sinon on affiche rien
        } else {
            document.getElementById("addressErrorMsg").innerText = "";
        }

        if (!form.city.value.match(stringRegex)) {
            document.getElementById("cityErrorMsg").innerText = "Mauvaise ville";
            control = false;
            // Sinon on affiche rien
        } else {
            document.getElementById("cityErrorMsg").innerText = "";
        }

        if (!form.email.value.match(emailRegex)) {
            document.getElementById("emailErrorMsg").innerText = "Mauvais email";
            control = false;
            // Sinon on affiche rien
        } else {
            document.getElementById("emailErrorMsg").innerText = "";
        }

        if (control) {
            return true;
        } else {
            return false;
        }

    }

    function Validation() {

        let orderButton = document.getElementById("order");

        orderButton.addEventListener("click", function (event) {
            let form = document.querySelector(".cart__order__form");
            event.preventDefault();

            if (localStorage.length !== 0) {
                if (ValidationForm(form)) {

                    // On créer un object avec nos valeurs du formulaire.
                    let formInfo = {
                        firstName: form.firstName.value,
                        lastName: form.lastName.value,
                        address: form.address.value,
                        city: form.city.value,
                        email: form.email.value,
                    };

                    // Initialisation de notre array à vide. 
                    let product = [];

                    // Boucle for pour récupérer nos éléments du localstorage.
                    for (let i = 0; i < localStorage.length; i++) {
                        product[i] = JSON.parse(localStorage.getItem(localStorage.key(i))).id;
                    }

                    // On créer un object avec notre formulaire validé + nos product du localstorage.
                    const order = {
                        contact: formInfo,
                        products: product,
                    };

                    // Méthode Appel Ajax en POST en inculant notre commande(order). 
                    const options = {
                        method: "POST",
                        body: JSON.stringify(order),
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                        },
                    };
                    fetch("http://localhost:3000/api/products/order/", options)
                        .then((response) => response.json())
                        .then(function (data) {
                            window.location.href = "confirmation.html?id=" + data.orderId;
                        })
                        .catch(function (error) {
                            alert("Error fetch order" + error.message);
                        })


                } else {
                    event.preventDefault();
                    alert("Le formulaire est mal remplis.")
                }
            } else {
                event.preventDefault();
                alert("Votre panier est vide.");
            }
        })
    }

});