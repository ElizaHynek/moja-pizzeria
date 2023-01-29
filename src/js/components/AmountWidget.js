import { select, settings } from '../settings.js';

class AmountWidget {
  constructor(element) { //element będzie referencją do całego diva z inputem i buttonami i konstruktor oczekuje na ten element
    const thisWidget = this;

    thisWidget.getElements(element);
    thisWidget.setValue(thisWidget.input.value || settings.amountWidget.defaultValue); 
    thisWidget.initActions();
  }

  getElements(element){
    const thisWidget = this;

    thisWidget.element = element;
    thisWidget.input = thisWidget.element.querySelector(select.widgets.amount.input);
    thisWidget.linkDecrease = thisWidget.element.querySelector(select.widgets.amount.linkDecrease);
    thisWidget.linkIncrease = thisWidget.element.querySelector(select.widgets.amount.linkIncrease);

  }

  setValue(value){
    const thisWidget = this;
    const newValue = parseInt(value);

    if (thisWidget.value !== newValue && !isNaN(newValue)) {
      const minValue = settings.amountWidget.defaultMin;
      const maxValue = settings.amountWidget.defaultMax;
      if (newValue <= maxValue) {
        if (newValue >= minValue) {
          thisWidget.value = newValue;
        }
      } 
    }

    thisWidget.input.value = thisWidget.value;
    thisWidget.announce();
  }

  announce(){
    const thisWidget = this;

    const event = new Event('updated', {
      bubbles: true
    });
    thisWidget.element.dispatchEvent(event);
  }

  initActions(){
    const thisWidget = this;

    thisWidget.input.addEventListener('change', function(){
      thisWidget.setValue(thisWidget.input.value);
    });
    thisWidget.linkDecrease.addEventListener('click', function(event){
      event.preventDefault();
      thisWidget.setValue(thisWidget.value - 1);
    });
    thisWidget.linkIncrease.addEventListener('click', function(event){
      event.preventDefault();
      thisWidget.setValue(thisWidget.value + 1);
    });
  }
}

export default AmountWidget;