export interface Product {
  id: string;
  name: string;
  price: number;
  parcelamento: Array<number>;
  color: string;
  image: string;
  size: Array<string>;
  date: string;
}

class ProductManager {
  private products: Product[] = [];

  constructor() {
      // Initialize products
  }

  renderProducts() {
      const productsContainer = document.querySelector('.products');
      if (!productsContainer) return;

      this.products.forEach(product => {
          const productElement = this.createProductElement(product);
          productsContainer.appendChild(productElement);
      });
  }

  private createProductElement(product: Product): HTMLElement {
      const div = document.createElement('div');
      div.className = 'product-card';
      div.innerHTML = `
          <img src="${product.image}" alt="${product.name}">
          <h3>${product.name}</h3>
          <div class="price">R$ ${product.price.toFixed(2)}</div>
          <div class="installments">até ${product.parcelamento}x de R$ ${product.parcelamento.toFixed(2)}</div>
          <button class="buy-button">COMPRAR</button>
      `;
      return div;
  }
}