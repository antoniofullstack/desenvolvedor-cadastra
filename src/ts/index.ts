import { Product } from "./Product";

const serverUrl = "http://localhost:5000";

interface Product {
    id: number;
    name: string;
    price: number;
    image: string;
    installments: number;
    color: string;
    size: string[];
}

// Product data
const products: Product[] = [
    {
        id: 1,
        name: 'CAMISETA MESCLA',
        price: 28.00,
        image: 'img/img_2.png',
        installments: 3,
        color: 'cinza',
        size: ['P', 'M', 'G']
    },
    {
        id: 2,
        name: 'SAIA EM COURO',
        price: 398.00,
        image: 'img/img_3.png',
        installments: 10,
        color: 'branco',
        size: ['P', 'M']
    },
    {
        id: 3,
        name: 'CARDIGAN TIGRE',
        price: 398.00,
        image: 'img/img_4.png',
        installments: 10,
        color: 'laranja',
        size: ['M', 'G', 'GG']
    },
    {
        id: 4,
        name: 'CARDIGAN OFF WHITE',
        price: 99.90,
        image: 'img/img_5.png',
        installments: 3,
        color: 'branco',
        size: ['P', 'M', 'G']
    },
    {
        id: 5,
        name: 'BODY LEOPARDO',
        price: 129.90,
        image: 'img/img_6.png',
        installments: 3,
        color: 'amarelo',
        size: ['P', 'M']
    },
    {
        id: 6,
        name: 'CASACO PELOS',
        price: 398.00,
        image: 'img/img_7.png',
        installments: 10,
        color: 'azul',
        size: ['M', 'G', 'GG']
    },
    {
        id: 7,
        name: 'CROPPED STRIPES',
        price: 120.00,
        image: 'img/img_8.png',
        installments: 3,
        color: 'amarelo',
        size: ['P', 'M']
    },
    {
        id: 8,
        name: 'CAMISA TRANSPARENTE',
        price: 398.00,
        image: 'img/img_9.png',
        installments: 10,
        color: 'branco',
        size: ['P', 'M', 'G']
    },
    {
        id: 9,
        name: 'CARDIGAN TIGRE',
        price: 398.00,
        image: 'img/img_10.png',
        installments: 10,
        color: 'laranja',
        size: ['M', 'G']
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
    
    const activeSize = Array.from(document.querySelectorAll<HTMLElement>('.size-btn.active'))
        .map(button => button.textContent?.trim())
        .filter((size): size is string => size !== undefined);
    
    const checkedPrices = Array.from(document.querySelectorAll<HTMLInputElement>('.filters__item input[name="preco"]:checked'))
        .map(input => input.value);
    
    let filteredProducts = [...products];
    
    // Filter by color
    if (checkedColors.length > 0) {
        filteredProducts = filteredProducts.filter(product => 
            checkedColors.includes(product.color)
        );
    }
    
    // Filter by size
    if (activeSize.length > 0) {
        filteredProducts = filteredProducts.filter(product => 
            product.size.some(size => activeSize.includes(size))
        );
    }
    
    // Filter by price
    if (checkedPrices.length > 0) {
        filteredProducts = filteredProducts.filter(product => {
            return checkedPrices.some(range => {
                const [min, max] = range.split('-').map(Number);
                if (range === '500+') {
                    return product.price >= 500;
                } else {
                    return product.price >= min && product.price <= (max || Infinity);
                }
            });
        });
    }
    
    currentProducts = filteredProducts;
    currentPage = 1;
    renderProducts();
};

filterCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', applyFilters);
});

sizeButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Se o botão clicado já está ativo, desativa ele
        if (button.classList.contains('active')) {
            button.classList.remove('active');
        } else {
            // Se não está ativo, remove active de todos e ativa este
            sizeButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        }
        
        applyFilters();
    });
});

const priceCheckboxes = document.querySelectorAll('.filters__item input[name="preco"]');
priceCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', applyFilters);
});

// Show/Hide extra colors
const showMoreColorsBtn = document.querySelector('.show-more-colors');
const extraColors = document.querySelectorAll('.color-extra');
let colorsExpanded = false;

if (showMoreColorsBtn) {
    showMoreColorsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        colorsExpanded = !colorsExpanded;
        
        extraColors.forEach(color => {
            if (colorsExpanded) {
                color.classList.remove('hidden');
                color.classList.add('show');
                (showMoreColorsBtn as HTMLElement).textContent = 'Ver menos cores';
            } else {
                color.classList.add('hidden');
                color.classList.remove('show');
                (showMoreColorsBtn as HTMLElement).textContent = 'Ver todas as cores';
            }
        });
    });
}

function main() {
    console.log('Initializing product grid...');
    renderProducts();
}

document.addEventListener("DOMContentLoaded", main);
