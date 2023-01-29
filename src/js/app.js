import { select, settings } from './settings.js';
import Product from './components/Product.js';
import Cart from './components/Cart.js';

const app = {
  initMenu: function(){
    const thisApp = this;

    for (let productData in thisApp.data.products){
      new Product(thisApp.data.products[productData].id, thisApp.data.products[productData]);
    }
  },
  initData: function(){
    const thisApp = this;
    //thisApp.data = dataSource; // obiektowi thisApp, czyli app nadajemy właściwośc data, która będzie referencją do naszych danych zapisanych jako dataSource (też obiekt z referencją do danych)
    thisApp.data = {};
    const url = settings.db.url + '/' + settings.db.products;


    fetch(url)  //łączy za pomocą domyślnej metody GET z podanym adresem endpointa (wysyła request)
      .then(function(rawResponse){  //konwertuje dane do obiektu JS
        return rawResponse.json();
      })
      .then(function(parsedResponse){  //pokazuje skonwertowane dane
        thisApp.data.products = parsedResponse;
        thisApp.initMenu();
      });
    
  },
  initCart: function(){
    const thisApp = this;
  
    const cartElem = document.querySelector(select.containerOf.cart);
    thisApp.cart = new Cart(cartElem);  //instancja klasy Cart, którą możemy wywołać thisApp.cart poza tą klasą

    thisApp.productList = document.querySelector(select.containerOf.menu);

    thisApp.productList.addEventListener('add-to-cart', function(event){
      app.cart.add(event.detail.product);
    });
  },
  init: function(){
    const thisApp = this;
    thisApp.initData();
    //thisApp.initMenu();
    thisApp.initCart();
  },
};

app.init();

