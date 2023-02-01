import { classNames, select, settings } from './settings.js';
import Product from './components/Product.js';
import Cart from './components/Cart.js';
import Booking from './components/Booking.js';

const app = {
  initPages: function(){
    const thisApp = this;

    thisApp.pages = document.querySelector(select.containerOf.pages).children;
    thisApp.navLinks = document.querySelectorAll(select.nav.links);

    const idFromHash = window.location.hash.replace('#/', ''); // slash jest potrzebny, bo domyślnie działa przeglądarka tak, że przenosi nas po kliknięciu na górę klikniętego elementu, czyli order lub booking. PreventDefault nie anuluje tego działania. Trzeba dodać np. '#/'

    let pageMatchingHash = thisApp.pages[0].id;

    for (let page of thisApp.pages){
      if(page.id == idFromHash){
        pageMatchingHash = page.id;
        break;
      }
    }

    thisApp.activatePage(pageMatchingHash);

    for (let link of thisApp.navLinks){
      link.addEventListener('click', function(event){
        event.preventDefault();
        const clickedElement = this;

        // get page id from href attribute
        const id = clickedElement.getAttribute('href').replace('#', '');

        // run thisApp.activatePage with that id
        thisApp.activatePage(id);

        // change URL hash
        window.location.hash = '#/' + id;
      });
    }
  },

  activatePage: function(pageId){
    const thisApp = this;

    for(let page of thisApp.pages) {
      page.classList.toggle(classNames.pages.active, page.id == pageId);
    }
    for(let link of thisApp.navLinks) {
      link.classList.toggle(
        classNames.nav.active, 
        link.getAttribute('href') == '#' + pageId
      );
    }
  },

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

  initBooking: function(){
    const thisApp = this;

    thisApp.bookingElem = document.querySelector(select.containerOf.booking);
    thisApp.booking = new Booking(thisApp.bookingElem);
  },

  init: function(){
    const thisApp = this;
    thisApp.initPages();
    thisApp.initData();
    //thisApp.initMenu();
    thisApp.initCart();
    thisApp.initBooking();
  },
};

app.init();

