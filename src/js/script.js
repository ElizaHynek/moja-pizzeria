/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

  const select = {
    templateOf: {
      menuProduct: '#template-menu-product',
    },
    containerOf: {
      menu: '#product-list',
      cart: '#cart',
    },
    all: {
      menuProducts: '#product-list > .product',
      menuProductsActive: '#product-list > .product.active',
      formInputs: 'input, select',
    },
    menuProduct: {
      clickable: '.product__header',
      form: '.product__order',
      priceElem: '.product__total-price .price',
      imageWrapper: '.product__images',
      amountWidget: '.widget-amount',
      cartButton: '[href="#add-to-cart"]',
    },
    widgets: {
      amount: {
        input: 'input[name="amount"]',
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
  };

  /*const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
  };

  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    }
  }; */

  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
  };


  class Product {
    constructor(id, data){
      const thisProduct = this;

      thisProduct.id = id;
      thisProduct.data = data;

      thisProduct.renderInMenu();

      console.log('new Product', thisProduct);
    }

    renderInMenu(){
      const thisProduct = this;

      const generatedHTML = templates.menuProduct(thisProduct.data);  // wywołujemy metodę templates.menuProduct i przekazujemy jej dane naszego pojedynczego produktu

      thisProduct.element = utils.createDOMFromHTML(generatedHTML);  //funkcja createDOM... zmienia kod htlm na element DOM, czyli obiekt, na którym można dalej działać i wrzućić go na stronę; zapisanie elemetu DOM jako właściwość naszej instancji (thisProduct) powoduje, że bbędzie dostępny i w innych metodach tej instancji

      const menuContainer = document.querySelector(select.containerOf.menu);
      menuContainer.appendChild(thisProduct.element);
    }
  }

  
  const app = {
    initMenu: function(){
      const thisApp = this;
      console.log('thisApp.data', dataSource);
      for (let productData in thisApp.data.products){
        new Product(productData, thisApp.data.products[productData]);
      }
    },
    initData: function(){
      const thisApp = this;
      thisApp.data = dataSource; // obiektowi thisApp, czyli app nadajemy właściwośc data, która będzie referencją do naszych danych zapisanych jako dataSource (też obiekt z referencją do danych)
      console.log('dataSource', dataSource);
    },
    init: function(){
      const thisApp = this;
      thisApp.initData();
      thisApp.initMenu();
    },
  };

  app.init();
}
