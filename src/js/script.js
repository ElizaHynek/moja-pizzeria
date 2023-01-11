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

  const classNames = {
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
  }; 

  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
  };


  class Product {
    constructor(id, data){
      const thisProduct = this;

      thisProduct.id = id;
      thisProduct.data = data;

      console.log(data);

      thisProduct.renderInMenu();
      thisProduct.getElements();
      thisProduct.initAccordion();
      thisProduct.initOrderForm();
      thisProduct.processOrder();
    }

    getElements(){
      const thisProduct = this;

      thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
      thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
      thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
      thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
      thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
    }

    renderInMenu(){
      const thisProduct = this;

      const generatedHTML = templates.menuProduct(thisProduct.data);  // wywołujemy metodę templates.menuProduct i przekazujemy jej dane naszego pojedynczego produktu

      thisProduct.element = utils.createDOMFromHTML(generatedHTML);  //funkcja createDOM... zmienia kod htlm na element DOM, czyli obiekt, na którym można dalej działać i wrzućić go na stronę; zapisanie elemetu DOM jako właściwość naszej instancji (thisProduct) powoduje, że bbędzie dostępny i w innych metodach tej instancji

      const menuContainer = document.querySelector(select.containerOf.menu);
      menuContainer.appendChild(thisProduct.element);
    }
    
    initAccordion(){
      const thisProduct = this;
      
      thisProduct.accordionTrigger.addEventListener('click', function(event){
        event.preventDefault();
        const activeProduct = document.querySelector(classNames.menuProduct.wrapperActive);
        if (activeProduct && activeProduct != thisProduct.element) {
          activeProduct.classList.remove(classNames.menuProduct.wrapperActive);
        } 
        thisProduct.element.classList.toggle(classNames.menuProduct.wrapperActive);
      });
    }

    initOrderForm(){
      const thisProduct = this;

      thisProduct.form.addEventListener('submit', function(event){
        event.preventDefault();
        thisProduct.processOrder();
      });
      for (let input of thisProduct.formInputs) {
        input.addEventListener('change', function(){
          thisProduct.processOrder();
        });
      }
      thisProduct.cartButton.addEventListener('click', function(event){
        event.preventDefault();
        thisProduct.processOrder();
      });
    }

    processOrder(){
      const thisProduct = this;

      const formData = utils.serializeFormToObject(thisProduct.form);
      console.log('formData', formData);

      let price = thisProduct.data.price;

      for (let paramId in thisProduct.data.params){
        const param = thisProduct.data.params[paramId];
        for (let optionId in param.options){
          const option = param.options[optionId];

          if (formData[paramId] && formData[paramId].includes(optionId)) {
            if (!option.default) {
              price += option.price;
            }
          } else if (option.default) {
            price -= option.price;
            console.log('option.price', option.price);
          }
        } 
      }

      thisProduct.priceElem.innerHTML = price;
      console.log(price);
    }
  }

  
  const app = {
    initMenu: function(){
      const thisApp = this;

      for (let productData in thisApp.data.products){
        new Product(productData, thisApp.data.products[productData]);
      }
    },
    initData: function(){
      const thisApp = this;
      thisApp.data = dataSource; // obiektowi thisApp, czyli app nadajemy właściwośc data, która będzie referencją do naszych danych zapisanych jako dataSource (też obiekt z referencją do danych)
    },
    init: function(){
      const thisApp = this;
      thisApp.initData();
      thisApp.initMenu();
    },
  };

  app.init();
}
