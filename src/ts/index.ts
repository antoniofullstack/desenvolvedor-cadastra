import { Product } from "./Product";

const serverUrl = "http://localhost:5000";

interface Product {
    id: number;
    name: string;
    price: number;
    image: string;
    installments: number;
    color: string;
}

// Product data
const products: Product[] = [
    {
        id: 1,
        name: 'CAMISETA MESCLA',
        price: 28.00,
        image: 'img/img_2.png',
        installments: 3,
        color: 'cinza'
    },
    {
        id: 2,
        name: 'SAIA EM COURO',
        price: 398.00,
        image: 'img/img_3.png',
        installments: 10,
        color: 'branco'
    },
    {
        id: 3,
        name: 'CARDIGAN TIGRE',
        price: 398.00,
        image: 'img/img_4.png',
        installments: 10,
        color: 'laranja'
    },
    {
        id: 4,
        name: 'CARDIGAN OFF WHITE',
        price: 99.90,
        image: 'img/img_5.png',
        installments: 3,
        color: 'branco'
    },
    {
        id: 5,
        name: 'BODY LEOPARDO',
        price: 129.90,
        image: 'img/img_6.png',
        installments: 3,
        color: 'amarelo'
    },
    {
        id: 6,
        name: 'CASACO PELOS',
        price: 398.00,
        image: 'img/img_7.png',
        installments: 10,
        color: 'azul'
    },
    {
        id: 7,
        name: 'CROPPED STRIPES',
        price: 120.00,
        image: 'img/img_8.png',
        installments: 3,
        color: 'amarelo'
    },
    {
        id: 8,
        name: 'CAMISA TRANSPARENTE',
        price: 398.00,
        image: 'img/img_9.png',
        installments: 10,
        color: 'branco'
    },
    {
        id: 9,
        name: 'CARDIGAN TIGRE',
        price: 398.00,
        image: 'img/img_10.png',
        installments: 10,
        color: 'laranja'
    }
];

// DOM Elements
const productsGrid = document.querySelector('.products__grid') as HTMLElement;
const loadMoreBtn = document.querySelector('.products__load-more') as HTMLButtonElement;
const sortSelect = document.querySelector('.products__sort') as HTMLSelectElement;
const filterCheckboxes = document.querySelectorAll('.filters__item input[type="checkbox"]');
const sizeButtons = document.querySelectorAll('.size-btn');

// State
let currentProducts: Product[] = [...products];
let currentPage = 1;
const productsPerPage = 6;

// Utility functions
const formatPrice = (price: number): string => {
    return price.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
};

const calculateInstallment = (price: number, installments: number): string => {
    const installmentValue = price / installments;
    return formatPrice(installmentValue);
};

// Product card template
const createProductCard = (product: Product): HTMLElement => {
    const card = document.createElement('article');
    card.className = 'product-card';
    
    card.innerHTML = `
        <div class="product-card__image">
            <img src="${product.image}" alt="${product.name}" loading="lazy">
        </div>
        <h3 class="product-card__title">${product.name}</h3>
        <div class="product-card__price">
            <span class="product-card__current-price">${formatPrice(product.price)}</span>
            <span class="product-card__installments">até ${product.installments}x de ${calculateInstallment(product.price, product.installments)}</span>
        </div>
        <button class="product-card__buy-btn">COMPRAR</button>
    `;
    
    return card;
};

// Render products
const renderProducts = (): void => {
    if (!productsGrid) {
        console.error('Products grid element not found');
        return;
    }

    // Clear existing products if it's the first page
    if (currentPage === 1) {
        productsGrid.innerHTML = '';
    }
    
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const productsToShow = currentProducts.slice(startIndex, endIndex);
    
    productsToShow.forEach(product => {
        productsGrid.appendChild(createProductCard(product));
    });
    
    // Show/hide load more button
    if (loadMoreBtn) {
        loadMoreBtn.style.display = endIndex >= currentProducts.length ? 'none' : 'block';
    }
};

// Event Handlers
if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
        currentPage++;
        renderProducts();
    });
}

if (sortSelect) {
    sortSelect.addEventListener('change', (e: Event) => {
        const target = e.target as HTMLSelectElement;
        const sortBy = target.value;
        
        switch(sortBy) {
            case 'menor-preco':
                currentProducts.sort((a, b) => a.price - b.price);
                break;
            case 'maior-preco':
                currentProducts.sort((a, b) => b.price - a.price);
                break;
            // Add more sorting options as needed
        }
        
        currentPage = 1;
        renderProducts();
    });
}

// Filter handlers
const applyFilters = (): void => {
    const checkedColors = Array.from(document.querySelectorAll<HTMLInputElement>('.filters__item input[name="cor"]:checked'))
        .map(input => input.value);
    
    let filteredProducts = [...products];
    
    if (checkedColors.length > 0) {
        filteredProducts = filteredProducts.filter(product => 
            checkedColors.includes(product.color)
        );
    }
    
    currentProducts = filteredProducts;
    currentPage = 1;
    renderProducts();
};

filterCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', applyFilters);
});

sizeButtons.forEach(button => {
    button.addEventListener('click', () => {
        sizeButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        applyFilters();
    });
});

function main() {
    console.log(serverUrl);
    renderProducts();
}

document.addEventListener("DOMContentLoaded", main);
