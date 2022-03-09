document.addEventListener("DOMContentLoaded", function (event) {


    //-------------------fonction principale-------------------//
    //--------------------------------------------------------//
    async function main() {

        // On Récupére l'Url.
        const url = new URL(window.location.href);
        // productId = à Id récupérer en paramètre de notre Url
        let productId = url.searchParams.get("id");

        // On Appel notre fonction qui va nous retourné notre produit de l'API
        let product = await GetProduct(productId);

        DisplayProduct(product);

        Btnclick(product);
    }

    main();

    //-------------------Fonction d'intérrogation de notre api avec product-------------------//
    //-----------------------------------------------------------------------------------------//
    async function GetProduct(productId) {
        return fetch("http://localhost:3000/api/products/" + productId)
            .then(function (response) {
                if (response.ok) {
                    return response.json();
                }
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    //-------------------Fonction d'affichage du produit-------------------//
    //---------------------------------------------------------------------//
    function DisplayProduct(product) {

        const parentTitle = document.getElementsByTagName("title")[0];
        const parentImg = document.getElementsByClassName("item__img");
        const parentName = document.getElementById("title");
        const parentPrice = document.getElementById("price");
        const parentDescription = document.getElementById("description");


        // Création de notre balise image avec les attributs.
        const productImg = document.createElement("img");
        productImg.setAttribute("src", product.imageUrl);
        productImg.setAttribute("alt", product.altTxt);
        // On push notre balise img à la fin de parent
        parentImg[0].appendChild(productImg);

        // On change les différentes valeurs à la volée.
        parentTitle.innerHTML = product.name;
        parentName.innerText = product.name;
        parentPrice.innerText = product.price;
        parentDescription.innerText = product.description;

        // Création des choix couleurs.
        let parentColor = document.getElementById("colors");
        let options = product.colors;

        options.forEach(function (element) {
            parentColor.appendChild(new Option(element, element))
        });
    }

    //-------------------Fonction BoutonAddPanier et save LocalStorage-------------------//
    //----------------------------------------------------------------------------------//

    //-------------------Initialisation Class Produit-------------------//
    //---------------------------------------------------------------------//
    class ProductClass {
        constructor(id, name, color, qty) {
            this.id = id;
            this.name = name;
            this.color = color;
            this.qty = qty;
        }
    }


    async function Btnclick(product) {

        // Initialisation des variables.
        let colorChoosen = "";
        let qtyCalculer = "";
        let qtySelectionner = "";
        let BtnPanier = document.getElementById("addToCart");


        let colorSelection = document.getElementById("colors");
        colorSelection.addEventListener("change", function (e) {
            colorChoosen = e.target.value;

        })

        let qtySelection = document.getElementById("quantity");
        qtySelection.addEventListener("change", function (e) {
            qtySelectionner = e.target.value;

        })

        //ecoute au click sur le bouton panier
        BtnPanier.addEventListener("click", function (e) {

            let ProductLocalstorage = [];
            let oldQty = 0;

            for (let i = 0; i < localStorage.length; i++) {

                ProductLocalstorage[i] = JSON.parse(localStorage.getItem(localStorage.key(i)));

                if (product._id === ProductLocalstorage[i].id && ProductLocalstorage[i].color === colorChoosen) {
                    oldQty = ProductLocalstorage[i].qty;
                }
            }

            qtyCalculer = parseInt(oldQty) + parseInt(qtySelectionner);

            let productChoosen = new ProductClass(
                product._id,
                product.name,
                colorChoosen,
                qtyCalculer,
            );

            if (colorChoosen != "" && qtySelectionner >= 1 && qtySelectionner <= 100) {

                localStorage.setItem(
                    product.name + " " + colorChoosen,
                    JSON.stringify(productChoosen)
                );

            } else {
                alert("Erreur");
            }


        });

    }



});