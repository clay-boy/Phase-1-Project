document.addEventListener('DOMContentLoaded', function () {
    const get_API = 'https://backend-project-steel-chi.vercel.app/species';

    const speciesSelect = document.getElementById('species-select');
    const chickenInfo = document.getElementById('chicken-info');
    const orderForm = document.getElementById('order-form');
    const orderSummary = document.getElementById('order-summary');
    const chickenCards = document.getElementById('chicken-cards');
    let chickensData;

    //fetch the chicken data from api
    fetch(get_API)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            chickensData = data; //assign the fetched data to chikens 
            populateSpeciesDropdown(data);
            displayChickenCards(data);
            setupEventListeners(); // Setup event listeners

        })
        .catch(error => {
            console.error('Error fetching chickens data:', error);
        });

    function populateSpeciesDropdown(chickens) {
        chickens.forEach(chicken => {
            let option = document.createElement('option');
            option.value = chicken.name;
            option.textContent = chicken.name;
            speciesSelect.appendChild(option);
        });
    }

    function displayChickenInfo(chicken) {
        if (chicken) {
            chickenInfo.innerHTML = `
                <div class="bg-white rounded-md shadow-md p-4">
                    <h2 class="text-lg font-bold mb-2">${chicken.name}</h2>
                    <img src="${chicken.image_big}" alt="${chicken.name}" class="mb-2 rounded-md">
                    <p><strong>Description:</strong> ${chicken.description}</p>
                    <p><strong>Price:</strong> KES ${chicken.price}</p>
                    <p><strong>Price (Small):</strong> KES ${chicken.price_small}</p>
                    <p><strong>Price (Big):</strong> KES ${chicken.price_big}</p>
                </div>
            `;
        }
    }

    function placeOrder(quantity, date) {
        let selectedChicken = speciesSelect.value;
        let chicken = chickensData.find(chicken => chicken.name === selectedChicken);
        if (chicken) {
            let total = calculateTotal(chicken, quantity);
            orderSummary.innerHTML = `
                <div class="bg-white rounded-md shadow-md p-4">
                    <h3 class="text-lg font-bold mb-2">Order Summary</h3>
                    <p><strong>Chicken:</strong> ${chicken.name}</p>
                    <p><strong>Quantity:</strong> ${quantity}</p>
                    <p><strong>Pick-up Date:</strong> ${date}</p>
                    <p><strong>Total Price:</strong> KES ${total}</p>
                </div>
            `;
        }
    }

    function calculateTotal(chicken, quantity) {
        return quantity * chicken.price;
    }

    function displayChickenCards(chickens) {
        chickenCards.innerHTML = ''; // Clear previous cards
        chickens.forEach(chicken => {
            let card = document.createElement('div');
            card.classList.add('card');
            card.innerHTML = `
                <h2 class="text-lg font-bold mb-2">${chicken.name}</h2>
                <img src="${chicken.image_small}" alt="${chicken.name}" class="mb-2 rounded-md">
                <p><strong>Description:</strong> ${chicken.description}</p>
                <p><strong>Price:</strong> KES ${chicken.price}</p>
                <button class="show-details" data-chicken='${JSON.stringify(chicken)}'>Show Details</button>
            `;
            chickenCards.appendChild(card);
        });

        // Add event listeners to buttons after cards are created
        chickenCards.querySelectorAll('.show-details').forEach(button => {
            button.addEventListener('click', function () {
                const chicken = JSON.parse(this.getAttribute('data-chicken'));
                displayChickenInfo(chicken);
            });
        });
    }

    function setupEventListeners() {
        // Event listener for species selection change
        speciesSelect.addEventListener('change', function () {
            let selectedChicken = chickensData.find(chicken => chicken.name === this.value);
            displayChickenInfo(selectedChicken);
        });

        // Event listener for order form submission
        orderForm.addEventListener('submit', function (event) {
            event.preventDefault();
            let quantity = parseInt(document.getElementById('quantity').value);
            let date = document.getElementById('date').value;
            placeOrder(quantity, date);
        });
    }
});