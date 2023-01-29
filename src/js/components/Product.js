import { select, classNames, templates } from '../settings.js';
import utils from '../utils.js';
import AmountWidget from './AmountWidget.js';

class Product {
  constructor(id, data){
    const thisProduct = this;

    thisProduct.id = id;
    thisProduct.data = data;

    thisProduct.renderInMenu();
    thisProduct.getElements();
    thisProduct.initAccordion();
    thisProduct.initOrderForm();
    thisProduct.initAmountWidget();
    thisProduct.processOrder();
  }

  getElements(){
    const thisProduct = this;

    thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
    thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
    thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
    thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
    thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
    thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
    // tutaj tworzymy właściwości dla AmountWidget, ponieważ to instancje klasy Product będą korzystały z tego widżeta, a nie sam widżet
    thisProduct.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);
    thisProduct.orderAccordionTrigger = document.querySelector(select.cart.formSubmit);
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
      const activeProduct = document.querySelector(select.all.menuProductsActive);
      if (activeProduct && activeProduct != thisProduct.element) {
        activeProduct.classList.remove(classNames.menuProduct.wrapperActive);
      } 
      thisProduct.element.classList.toggle(classNames.menuProduct.wrapperActive);
    });
    
    //  dodatkowa funkcja - zwijanie akordeonu po wciśnięciu ORDER
    thisProduct.orderAccordionTrigger.addEventListener('click', function(){
      const activeProduct = document.querySelector(select.all.menuProductsActive);
      if (activeProduct && activeProduct != thisProduct.orderAccordionTrigger) {
        activeProduct.classList.remove(classNames.menuProduct.wrapperActive);
      }
      thisProduct.orderAccordionTrigger.classList.toggle(classNames.menuProduct.wrapperActive);
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
    thisProduct.cartButton.addEventListener('click', function(){
    //event.preventDefault();
      thisProduct.processOrder();
      thisProduct.addToCart();
    });
  }

  processOrder(){
    const thisProduct = this;

    const formData = utils.serializeFormToObject(thisProduct.form);

    let price = thisProduct.data.price;

    for (let paramId in thisProduct.data.params){
      const param = thisProduct.data.params[paramId];
      for (let optionId in param.options){
        const option = param.options[optionId]; 
        const optionSelected = formData[paramId] && formData[paramId].includes(optionId);

        if (optionSelected) {
          if (!option.default) {
            price += option.price;
          }
        } else if (option.default) {
          price -= option.price;
        }

        const optionImage = thisProduct.imageWrapper.querySelector('.' + paramId + '-' + optionId);

        if (optionImage) {
          if (optionSelected) {
            optionImage.classList.add('active');
          } else {
            optionImage.classList.remove('active');
          }
        }
      }
    }
    thisProduct.priceSingle = price;
    price *= thisProduct.amountWidget.value;
    thisProduct.priceElem.innerHTML = price;
  }

  initAmountWidget(){
    const thisProduct = this;

    thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);
    
    thisProduct.amountWidgetElem.addEventListener('updated', function(){
      thisProduct.processOrder();
    });
  }

  addToCart(){
    const thisProduct = this;

    //app.cart.add(thisProduct);  //wywołujemy instancję klasy Cart (stworzoną w app.initCart) i odwołujemy się do jej metody, czyli add
    //app.cart.add(thisProduct.prepareCartProduct());

    const event = new CustomEvent('add-to-cart', {
      bubbles: true,
      detail: {
        product: thisProduct.prepareCartProduct(),
      },
    });

    thisProduct.element.dispatchEvent(event);
  }

  prepareCartProduct(){
    const thisProduct = this;
    const productSummary = {
    
      id: thisProduct.id,
      name: thisProduct.data.name,
      amount: thisProduct.amountWidget.value,
      priceSingle: thisProduct.priceSingle,
      price: thisProduct.priceSingle * thisProduct.amountWidget.value,
      params: thisProduct.prepareCartProductParams(),
    };

    return productSummary;
  }

  prepareCartProductParams(){
    const thisProduct = this;
    const formData = utils.serializeFormToObject(thisProduct.form);
    const params = {};
    // for every category (param)...
    for(let paramId in thisProduct.data.params) {
      const param = thisProduct.data.params[paramId];
      // create category param in params const eg. params = { ingredients: { name: 'Ingredients', options: {}}}
      params[paramId] = {
        label: param.label,
        options: {},
      };
      // for every option in this category
      for(let optionId in param.options) {
        const option = param.options[optionId];
        const optionSelected = formData[paramId] && formData[paramId].includes(optionId);
        if(optionSelected) { 
          params[paramId].options[optionId] = option.label;
        } 
      }
    }
    return params;

  } 
}

export default Product;