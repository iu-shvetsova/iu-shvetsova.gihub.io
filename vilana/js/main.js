'use strict';

(function () {

  function BaseTabs(selector) {
    this.selector = selector;
    this.tabActiveClass = 'base-tabs__tab--active';
    this.container = document.querySelector(selector);

    if (this.container) {
      this.contentList = this.container.querySelectorAll('.base-tabs__content');
      this.tabsList = this.container.querySelectorAll('.base-tabs__tab');
    }
  }

  BaseTabs.prototype.init = function () {
    if (!this.container) {
      return;
    }
    if (this.tabsList && this.contentList) {
      for (var i = 0; i < this.tabsList.length; i++) {
        this.tabsList[i].addEventListener('click', this.onTabClicked.bind(this, i));
      }
      this.tabsList[0].click();
    }

    this.enableSliderMode();
  };

  BaseTabs.prototype.enableSliderMode = function () {
    var pagination = document.createElement('div');
    var swiperButtonPrev = document.createElement('button');
    var swiperButtonNext = document.createElement('button');

    pagination.classList.add('base-tabs__pagination', 'swiper-pagination');
    swiperButtonPrev.classList.add('base-tabs__slider-button', 'base-tabs__slider-button--prev', 'swiper-button-prev');
    swiperButtonNext.classList.add('base-tabs__slider-button', 'base-tabs__slider-button--next', 'swiper-button-next');

    var swiper = this.container.querySelector('.base-tabs__content-wrapper');
    swiper.classList.add('swiper-container');
    var swiperWrapper = this.container.querySelector('.base-tabs__content-list');
    swiperWrapper.classList.add('swiper-wrapper');

    swiper.appendChild(pagination);
    swiper.parentNode.appendChild(swiperButtonPrev);
    swiper.parentNode.appendChild(swiperButtonNext);

    this.contentList.forEach(function (tab) {
      tab.classList.add('swiper-slide');
    });

    this.swiper = new Swiper('.base-tabs__content-wrapper', {
      direction: 'horizontal',
      slidesPerView: 1,
      allowTouchMove: true,
      autoHeight: true,
      breakpoints: {
        768: {
          allowTouchMove: false
        }
      },
      pagination: {
        el: '.base-tabs__pagination',
        type: 'bullets',
      },
      navigation: {
        nextEl: '.base-tabs__slider-button--next',
        prevEl: '.base-tabs__slider-button--prev',
      }
    });

    var self = this;

    this.swiper.on('slideChange', function () {
      self.activateTab(this.activeIndex);
    });
  };

  BaseTabs.prototype.activateTab = function (index) {
    if (this.currentIndex !== undefined) {
      this.tabsList[this.currentIndex].classList.remove(this.tabActiveClass);
    }

    var currentTab = this.tabsList[index];

    if (currentTab) {
      currentTab.classList.add(this.tabActiveClass);
      this.currentIndex = index;
    }
  };

  BaseTabs.prototype.onTabClicked = function (index) {
    if (this.swiper) {
      this.swiper.slideTo(index);
    }
    this.activateTab(index);
  };

  var catalogInnerPageTabs = new BaseTabs('.catalog-inner-page__product-info');
  catalogInnerPageTabs.init();

})();
'use strict';

(function () {
  var createMask = window.IMask;
  var popupPricePhone = document.getElementById('price-tel');
  var orderPhone = document.getElementById('order-tel');
  var inputEmailOrPhone = document.getElementById('signin-email-phone');
  var registryPhoneInput = document.querySelector('.registry #phone');
  var profilePhoneInput = document.querySelector('.profile-info #phone');
  var profileBirthdayInput = document.querySelector('.profile-info #birthday');
  var personalSolutionPhoneInput = document.querySelector('.personal-solution__input-row #phone')

  createPhoneMask(registryPhoneInput);
  createPhoneMask(popupPricePhone);
  createPhoneMask(orderPhone);
  createPhoneMask(profilePhoneInput);
  createPhoneMask(personalSolutionPhoneInput, false);
  createDateMask(profileBirthdayInput, null, new Date());
  createEmailOrPhoneMask(inputEmailOrPhone);

  function createPhoneMask(element, isMaskVisible) {
    if (!element) {
      return;
    }
    isMaskVisible = isMaskVisible !== false;
    createMask(
      element, {
      mask: '+{7} (000) 000-00-00',
      lazy: isMaskVisible
    });
  }

  function createDateMask(element, min, max) {
    if (!element) {
      return;
    }
    createMask(
      element, {
      mask: Date,
      min: min,
      max: max
    });
  }

  function createEmailOrPhoneMask(element) {
    if (!element) {
      return;
    }
    createMask(
      element, {
      mask: [
        {
          mask: '+{7} (000) 000-00-00'
        },
        {
          mask: /^\S*@?\S*$/
        }
      ]
    });
  }

  window.checkWebpSupport();

  window.createPhoneMask = createPhoneMask;
  window.createDateMask = createDateMask;
  window.createEmailOrPhoneMask = createEmailOrPhoneMask;
})();
'use strict';

(function () {
  var MASK_NAME = /^[a-zа-яё\s]+$/i;
  var MASK_EMAIL = /.+@.+\..+/;
  var MASK_PHONE = /\+7 \(\d\d\d\) \d\d\d-\d\d-\d\d/;
  var MASK_DATE = /^(((0[1-9]|[12]\d|3[01])\.(0[13578]|1[02])\.((19|[2-9]\d)\d{2}))|((0[1-9]|[12]\d|30)\.(0[13456789]|1[012])\.((19|[2-9]\d)\d{2}))|((0[1-9]|1\d|2[0-8])\.02\.((19|[2-9]\d)\d{2}))|(29\.02\.((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))))$/;

  var passwordCount = 5;
  var inputErrorClass = 'input-row__input--error';
  var checkboxErrorClass = 'checkbox-row__label--error';
  var phoneErrorSymbol = /_/;

  var toggleEmptyFieldError = function (input) {
    if (input.value.length < 1) {
      input.classList.toggle(inputErrorClass, true);
      changeErrorMessage(input, 'Заполните это поле');
    }
  };

  var toggleInputError = function (input) {
    if (input.value.length < 1) {
      input.classList.toggle(inputErrorClass, true);
      changeErrorMessage(input, 'Заполните это поле');
    } else if (!MASK_NAME.test(input.value)) {
      input.classList.toggle(inputErrorClass, true);
      changeErrorMessage(input, 'Некорректное имя');
    }
  };

  var toggleEmailError = function (input) {
    if (input.value.length < 1) {
      input.classList.toggle(inputErrorClass, true);
      changeErrorMessage(input, 'Заполните это поле');
    } else if (!MASK_EMAIL.test(input.value)) {
      input.classList.toggle(inputErrorClass, true);
      changeErrorMessage(input, 'Некорректный email');
    }
  };

  var togglePhoneError = function (input) {
    if (phoneErrorSymbol.test(input.value)) {
      input.classList.toggle(inputErrorClass, true);
      changeErrorMessage(input, 'Некорректный номер телефона');
    }
  };

  var toggleDateError = function (input) {
    if (!MASK_DATE.test(input.value)) {
      input.classList.toggle(inputErrorClass, true);
      changeErrorMessage(input, 'Некорректный формат даты');
    }
  };

  var toggleCheckboxError = function (input, label) {
    if (!input.checked) {
      label.classList.toggle(checkboxErrorClass, true);
    }
  };

  var toggleLoginError = function (input) {
    if (!MASK_EMAIL.test(input.value) && !MASK_PHONE.test(input.value)) {
      input.classList.toggle(inputErrorClass, true);
      changeErrorMessage(input, 'Введите корректный адрес электронной почты или номер телефона');
    }
  };

  var togglePasswordError = function (passwordInput) {
    if (passwordInput.value.length < 1) {
      passwordInput.classList.toggle(inputErrorClass, true);
      changeErrorMessage(passwordInput, 'Заполните это поле');
    } else if (passwordInput.value.length < passwordCount) {
      passwordInput.classList.toggle(inputErrorClass, true);
      changeErrorMessage(passwordInput, 'Пароль слишком короткий');
    }
  };

  var toggleRepeatPasswordError = function (passwordInput, repeatPasswordInput) {
    if (repeatPasswordInput.value.length < 1) {
      repeatPasswordInput.classList.toggle(inputErrorClass, true);
      changeErrorMessage(repeatPasswordInput, 'Заполните это поле');
    } else if (!repeatPasswordInput.value || passwordInput.value !== repeatPasswordInput.value) {
      repeatPasswordInput.classList.toggle(inputErrorClass, true);
      changeErrorMessage(repeatPasswordInput, 'Пароли не совпадают');
    }
  };

  var resetError = function (event) {
    event.target.classList.toggle(inputErrorClass, false);
  };

  var changeErrorMessage = function (input, message) {
    var textBlock = input.parentNode.querySelector('.input-row__error-message');
    textBlock.textContent = message;
  };

  window.toggleEmptyFieldError = toggleEmptyFieldError;
  window.toggleInputError = toggleInputError;
  window.toggleEmailError = toggleEmailError;
  window.togglePhoneError = togglePhoneError;
  window.toggleDateError = toggleDateError;
  window.toggleCheckboxError = toggleCheckboxError;
  window.toggleLoginError = toggleLoginError;
  window.togglePasswordError = togglePasswordError;
  window.toggleRepeatPasswordError = toggleRepeatPasswordError;

  window.changeErrorMessage = changeErrorMessage;
  window.resetError = resetError;

  window.checkboxErrorClass = checkboxErrorClass;
  window.phoneErrorSymbol = phoneErrorSymbol;

  window.MASK_NAME = MASK_NAME;
  window.MASK_EMAIL = MASK_EMAIL;
  window.MASK_PHONE = MASK_PHONE;
  window.MASK_DATE = MASK_DATE;
})();
'use strict';

(function () {
  var popupThx = document.querySelector('.popup-thx');

  var closePopupThx = function () {
    var popupThxOpened = document.querySelector('.popup--show.popup-thx');

    if (popupThxOpened) {
      setTimeout(function () {
        popupThx.classList.add('popup-thx--close');
        setTimeout(function () {
          window.closePopup();
          popupThx.classList.remove('popup-thx--close');
        }, 400);
      }, 1000);
    }
  }

  window.closePopupThx = closePopupThx;
})();
'use strict';

(function () {
  var orderButton = document.querySelector('.total__button-execute');
  var technologistButton = document.querySelector('.total__button-technologist');

  var popupWarning = document.querySelector('.popup-warning');
  var popupTechnologist = document.querySelector('.popup-technologist');

  if (popupWarning) {
    var popupTechnologistButton = popupWarning.querySelector('.popup-warning__technologist');
  }

  var deleteElemButtons = document.querySelectorAll('.cards-list__delete-item');

  var inputContainers = document.querySelectorAll('.cards-list__number-input');
  var countInputs = document.querySelectorAll('.cards-list__number-input .number-input__input');
  var totalPrice = document.querySelector('.cart__total .total__total-cost');
  var itemTotalPrices = document.querySelectorAll('.cards-list__total-price');
  var itemPrices = document.querySelectorAll('.cards-list__price-item');


  var formatMoney = function (value) {
    var withoutWhiteSpaces = value.replace(/\s/, '');
    var num = parseInt(withoutWhiteSpaces, 10);

    return num.toLocaleString();
  };

  var calculateTotalCost = function () {
    var totalCost = 0;
    itemTotalPrices = document.querySelectorAll('.cards-list__total-price');

    if (itemTotalPrices) {
      for (var k = 0; k < itemTotalPrices.length; k++) {
        var localCost = itemTotalPrices[k].textContent.replace(/\s/, '');
        totalCost += parseInt(localCost, 10) || 0;
      }
    }

    if (totalPrice) {
      totalPrice.innerHTML = formatMoney(String(totalCost)) || 0;
    }
  };

  var handleButtonDeleteClick = function (event) {
    var element = event.target.closest('.cards-list__item');
    element.remove();
    calculateTotalCost();
  };

  var handleInputChange = function (event) {
    var additingCard = event.target.closest('.cards-list__item');
    var count = parseInt(event.target.value, 10) || 0;

    if (additingCard) {
      var priceItem = additingCard.querySelector('.cards-list__price-item');
      var totalPriceItem = additingCard.querySelector('.cards-list__total-price');
      var localPrice = priceItem.textContent.replace(/\s/, '');
      var price = parseInt(localPrice, 10);

      if (priceItem && totalPriceItem) {
        totalPriceItem.innerHTML = formatMoney(String(price * count)) + ' ₽';
        calculateTotalCost();
      }
    }
  };


  if (orderButton) {
    orderButton.addEventListener('click', function () {
      if (popupWarning) {
        window.openPopup(popupWarning);
      }
    });
  }

  if (technologistButton) {
    technologistButton.addEventListener('click', function () {
      if (popupTechnologist) {
        window.openPopup(popupTechnologist);
      }
    });
  }

  if (popupTechnologistButton) {
    popupTechnologistButton.addEventListener('click', function () {
      if (popupTechnologist) {
        window.openPopup(popupTechnologist);
      }
    });
  }

  if (deleteElemButtons) {
    for (var i = 0; i < deleteElemButtons.length; i++) {
      deleteElemButtons[i].addEventListener('click', handleButtonDeleteClick);
    }
  }

  if (countInputs) {
    for (var j = 0; j < countInputs.length; j++) {
      countInputs[j].addEventListener('change', handleInputChange);
    }
  }

  calculateTotalCost();

  if (itemTotalPrices) {
    for (var k = 0; k < itemTotalPrices.length; k++) {
      itemTotalPrices[k].innerHTML = formatMoney(itemTotalPrices[k].textContent) + ' ₽';
    }
  }

  for (var n = 0; n < itemPrices.length; n++) {
    itemPrices[n].innerHTML = formatMoney(itemPrices[n].textContent) + ' ₽';
  }

  setTimeout(function () {
    var cartNumberInput = null;
    if (inputContainers) {
      for (var i = 0; i < inputContainers.length; i++) {
        var cartNumberInput = new window.NumberInput(inputContainers[i], 1, Infinity, 1, 'шт.');
        cartNumberInput.init();
      }
    }
  }, 100);

})();
'use strict';

(function () {

  /** Слайдер сопутствующих товаров */
  var relatedProductsSlider = document.querySelector('.related-products__wrapper');

  if (relatedProductsSlider) {
    relatedProductsSlider.classList.add('swiper-container');
    relatedProductsSlider.querySelector('.related-products__list').classList.add('swiper-wrapper');
    relatedProductsSlider.querySelectorAll('.related-products__item').forEach(function (item) {
      item.classList.add('swiper-slide');
    });
    document.querySelector('.related-products__slider-button--prev').classList.add('swiper-button-prev');
    document.querySelector('.related-products__slider-button--next').classList.add('swiper-button-next');
    var mySwiper;

    var initSwiper = function () {
      mySwiper = new Swiper('.related-products__wrapper', {
        direction: 'horizontal',
        grabCursor: true,
        slidesPerView: 2,
        spaceBetween: 56,

        breakpoints: {
          320: {
            slidesPerView: 1,
            slidesPerColumn: 1
          },
          768: {
            slidesPerView: 1,
            slidesPerColumn: 2,
            spaceBetween: 30
          },
          1280: {
            slidesPerView: 2,
            slidesPerColumn: 1,
            spaceBetween: 45
          },
          1600: {
            slidesPerView: 2,
            spaceBetween: 56
          }
        },

        navigation: {
          nextEl: '.related-products__slider-button--next',
          prevEl: '.related-products__slider-button--prev',
        }
      });
    };

    initSwiper();

    window.onresize = function () {
      mySwiper.destroy();
      initSwiper();
    };
  }

  /** Попап запроса цены */
  var popupPrice = document.querySelector('.popup-price');
  var popupPriceButton = document.querySelector('.price-banner__button');

  if (popupPrice && popupPriceButton) {
    popupPriceButton.addEventListener('click', function () {
      window.openPopup(popupPrice);
    });
  }

  /** Тултип литров */
  var litersValue = document.querySelector('.price-calculator__liters-value');
  var litersTooltip = document.querySelector('.price-calculator__liters-tooltip');

  if (litersValue && litersTooltip) {
    var litersPopper = new Popper(litersValue, litersTooltip, {
      placement: 'right',
      modifiers: {
        offset: {
          enabled: true,
          offset: '0, 15'
        }
      }
    });

    litersValue.addEventListener('mouseenter', function () {
      litersTooltip.classList.add('tooltip--active');
    });

    litersValue.addEventListener('mouseleave', function () {
      litersTooltip.classList.remove('tooltip--active');
    });
  }

  /** Кнопка добавления в корзину */
  var cartProductButtons = document.querySelectorAll('.catalog-inner-page .product-card__button');
  var cartСalculatorButton = document.querySelector('.catalog-inner-page .price-calculator__add-to-cart');

  if (cartProductButtons && cartСalculatorButton) {
    cartProductButtons = Array.from(cartProductButtons);

    setTimeout(function () {
      cartProductButtons.forEach(function(button){
        window.switchCartButtonState(button, 'btn--green', 'product-card__button--grey');
      });

      window.switchCartButtonState(cartСalculatorButton, 'btn--green', 'price-calculator__add-to-cart--disabled');
    });
  }

})();
'use strict';

(function () {
  var characterCount = 18;
  var lettersCount = 1;
  var inputErrorClass = 'input-row__input--error';

  var quoteButton = document.querySelector('.rectangle-details__button--quote');
  var signinButton = document.querySelector('.rectangle-details__button--signin');
  var resetPassButton = document.querySelector('.popup-signin__reset-pass');

  var popupPrice = document.querySelector('.popup-price');
  var popupPriceName = document.getElementById('price-name');
  var popupPriceEmail = document.getElementById('price-email');
  var popupPricePhone = document.getElementById('price-tel');
  var popupPriceCheckbox = document.getElementById('price-personal-data');
  var popupPriceCheckboxLabel = null;

  if (popupPrice) {
    popupPriceCheckboxLabel = popupPrice.querySelector('.checkbox-row__label');
  }

  var popupSignin = document.querySelector('.popup-signin');
  var popupSiginLogin = document.getElementById('signin-email-phone');
  var popupSigninPass = document.getElementById('signin-pass');

  var popupResetPass = document.querySelector('.popup-reset-pass');
  var popupResetPassEmail = document.getElementById('reset-pass-email');

  var popupThx = document.querySelector('.popup-thx');


  if (quoteButton) {
    quoteButton.addEventListener('click', function () {
      if (popupPrice) {
        window.openPopup(popupPrice);
      }
    });
  }

  if (popupPrice) {
    popupPrice.addEventListener('input', function (event) {
      if (event.target.type === 'checkbox') {
        event.target.nextElementSibling.classList.toggle(window.checkboxErrorClass, false);
      } else {
        window.resetError(event);
      }
    });

    window.createPhoneMask(popupPricePhone, false);

    popupPrice.addEventListener('submit', function (event) {
      window.toggleInputError(popupPriceName);
      window.toggleEmailError(popupPriceEmail);
      window.togglePhoneError(popupPricePhone);
      window.toggleCheckboxError(popupPriceCheckbox, popupPriceCheckboxLabel);

      if (
        !popupPriceName.value
        || !window.MASK_NAME.test(popupPriceName.value)
        || !window.MASK_EMAIL.test(popupPriceEmail.value)
        || popupPricePhone.value.length < 1
        || window.phoneErrorSymbol.test(popupPricePhone.value)
        || !popupPriceCheckbox.checked
      ) {
        event.preventDefault();
        return;
      }

      window.openPopup(popupThx);
      window.closePopupThx(popupThx);
    });
  }


  if (signinButton) {
    signinButton.addEventListener('click', function () {
      if (popupSignin) {
        window.openPopup(popupSignin);
      }
    });
  }

  if (popupSignin) {
    popupSignin.addEventListener('input', window.resetError);

    window.createEmailOrPhoneMask(popupSiginLogin);

    popupSignin.addEventListener('submit', function (event) {
      window.toggleLoginError(popupSiginLogin);
      window.toggleInputError(popupSigninPass);

      if (
        !popupSigninPass.value
        || (!window.MASK_EMAIL.test(popupSiginLogin.value) && !window.MASK_PHONE.test(popupSiginLogin.value))
      ) {
        event.preventDefault();
        return;
      }

      window.closePopup();
    });

    if (resetPassButton) {
      resetPassButton.addEventListener('click', function () {
        if (popupResetPass) {
          window.openPopup(popupResetPass);
        }
      });
    }
  }

  if (popupResetPass) {
    popupResetPass.addEventListener('input', window.resetError);

    popupResetPass.addEventListener('submit', function (event) {
      window.toggleEmailError(popupResetPassEmail);

      if (!window.MASK_EMAIL.test(popupResetPassEmail.value)) {
        event.preventDefault();
        return;
      }

      window.closePopup();
    });
  }

})();
'use strict';

(function () {
  var cartButtons = document.querySelectorAll('.catalog .product-card__button');

  setTimeout(function () {
    if (cartButtons) {
      for (var i = 0; i < cartButtons.length; i++) {
        window.switchCartButtonState(cartButtons[i], 'btn--green', 'product-card__button--grey');
      }
    }
  }, 100);
})();
'use strict';

(function () {
  var choosePaintForm = document.querySelector('.choose-paint__form');

  if (choosePaintForm) {


    var objectChoiceList = choosePaintForm.querySelector('.choose-paint__list');
    var objectChoiceItems = objectChoiceList.querySelectorAll('.choose-paint__item');
    var schemaItems = choosePaintForm.querySelectorAll('.choose-paint__scheme-item');
    var squareInput = choosePaintForm.querySelector('.choose-paint__square-wrapper').getElementsByTagName('input')[0];
    var squarePattern = /^\d+(?:[.,]\d+)?$/;
    var E_CODE = 69;
    var MINUS_CODE = 189;
    var removeActiveStyle = function () {
      for (var i = 0; i < objectChoiceItems.length; i++) {
        objectChoiceItems[i].classList.remove('choose-paint__item--checked');
      }
    };

    var checkRadiobutton = function (el) {
      var radio = el.getElementsByTagName('input')[0];
      radio.checked = true;
    };

    var objectChangeHandler = function (element) {
      removeActiveStyle();
      element.classList.add('choose-paint__item--checked');
      checkRadiobutton(element);
    };

    objectChoiceItems.forEach(function (item) {
      item.addEventListener('click', function () {
        objectChangeHandler(item);
      });
    });

    schemaItems.forEach(function (item) {
      item.addEventListener('click', function () {
        checkRadiobutton(item);
      });
    });

    squareInput.addEventListener("keydown", function(event) {
      if ((event.which === E_CODE) || (event.which === MINUS_CODE)) {
        event.preventDefault();
      }
    });

    var validate = function () {
      var result = true;
      var objectItemsChecked = choosePaintForm.querySelectorAll('input[name=paint-choice]:checked');
      var schemaItemsChecked = choosePaintForm.querySelectorAll('input[name=scheme-choice]:checked');
      if (objectItemsChecked.length === 0) {
        result = false;
      }

      if (schemaItemsChecked.length === 0) {
        result = false;
      }

      if (squareInput.value.length === 0) {
        result = false;
      }

      if (!squareInput.value.match(squarePattern)) {
        result = false;
      }
      return result;
    };


    choosePaintForm.addEventListener('submit', function (evt) {
      if (validate()) {
        evt.preventDefault();
        window.location.href = "vilana-recommend.html";
      } else {
        evt.preventDefault();
      }

    });
  }

})();
'use strict';

(function () {
  var SMALL_DESKTOP = 1600;
  var POPUP_TRIANGLE_SHIFT = 26;

  var activeId = null;
  var activePopup = null;

  var chooseColorButtons = document.querySelectorAll('.color-change__button');

  var iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);


  var destroyPopup = function () {
    if (activePopup) {
      activePopup.removeEventListener('click', handleColorClick);
      var button = activePopup.parentNode.querySelector('.color-change__button--active');
      if (button) {
        button.classList.toggle('color-change__button--active', false);
      }
      activePopup.remove();
      activePopup = null;
      activeId = null;
      if (window.innerWidth < SMALL_DESKTOP) {
        window.unlockBody();
      }
    }
  };

  var chooseColor = function (colorBlock, dataSet) {
    var colorCircle = colorBlock.querySelector('.color-change__preview');
    var colorCode = colorBlock.querySelector('.color-change__color-code');

    if (colorCircle) {
      colorCircle.style = 'background-color: ' + dataSet.color;
    }

    if (colorCode) {
      colorCode.innerHTML = dataSet.name;
    }
  };

  var handleColorClick = function (event) {
    if (event.target.className === 'popup-color__button') {

      var chooseColorButton = document.querySelector('.color-change__button[data-id="' + activeId + '"]');
      if (!chooseColorButton) {
        return;
      }

      var colorBlock = chooseColorButton.closest('.color-change');

      if (colorBlock) {
        chooseColor(colorBlock, event.target.dataset);
        destroyPopup();
      }
    }

    if (event.target.className === 'popup-color__close') {
      destroyPopup();
    }
  };

  var getCoords = function (elem) {
    var box = elem.getBoundingClientRect();

    return {
      top: box.top + pageYOffset,
      bottom: box.bottom + pageYOffset,
      left: box.left + pageXOffset
    };
  };

  var createPopup = function (cardData) {
    var colorKeys = Object.keys(cardData.color);

    var popup = document.createElement('section');
    popup.classList.add('popup-color');
    var wrapper = document.createElement('div');
    wrapper.classList.add('popup-color__wrapper');
    var title = document.createElement('h2');
    title.innerHTML = 'Выберите цветовую схему';
    var list = document.createElement('ul');
    list.classList.add('same-list', 'popup-color__list');
    var buttonClose = document.createElement('button');
    buttonClose.setAttribute('type', 'button');
    buttonClose.classList.add('popup-color__close');
    buttonClose.innerHTML = 'Закрыть';

    popup.appendChild(wrapper);
    wrapper.appendChild(title);
    wrapper.appendChild(list);
    wrapper.appendChild(buttonClose);

    for (var i = 0; i < colorKeys.length; i++) {
      var item = document.createElement('li');
      item.classList.add('popup-color__item');
      var button = document.createElement('button');
      button.setAttribute('type', 'button');
      button.classList.add('popup-color__button');
      var colorCode = document.createElement('p');
      var colorName = colorKeys[i];
      var hexColor = cardData.color[colorName];
      colorCode.innerHTML = colorName;
      button.style = 'background-color: ' + hexColor;

      button.dataset.color = hexColor;
      button.dataset.name = colorName;

      item.appendChild(button);
      item.appendChild(colorCode);
      list.appendChild(item);
    }

    popup.addEventListener('click', handleColorClick);

    return popup;
  };


  if (chooseColorButtons) {
    for (var i = 0; i < chooseColorButtons.length; i++) {
      chooseColorButtons[i].addEventListener('click', function (event) {
        destroyPopup();
        activeId = event.target.dataset.id;

        if (window.paintList && window.paintList[activeId]) {
          var coordsElem = getCoords(event.target);
          var shift = coordsElem.bottom + POPUP_TRIANGLE_SHIFT;

          activePopup = createPopup(window.paintList[activeId]);

          if (window.innerWidth >= SMALL_DESKTOP) {
            activePopup.style = 'top: ' + shift + 'px';
          }

          document.body.appendChild(activePopup);
          event.target.classList.toggle('color-change__button--active', true);

          if (window.innerWidth < SMALL_DESKTOP) {
            window.lockBody();
          }

          var list = activePopup.querySelector('.popup-color__list')

          if (list) {
            var kekek = 'height: ' + list.offsetHeight + 'px; width:' + list.offsetWidth + 'px;';
            list.style = kekek;

            if (list.scrollHeight > list.clientHeight) {
              list.classList.add('popup-color__list--long');
            }

            window.SimpleScrollbar.initEl(list);

            list.style = kekek + 'display: inline-block';
          }
        }
      });
    }
  }

  document.body.addEventListener('click', function (event) {
    if (!event.target.closest('.popup-color') && !event.target.classList.contains('color-change__button')) {
      destroyPopup();
    }
  });

  window.addEventListener('resize', function () {
    if (!iOS) {
      destroyPopup();
    }
  });
})();
'use strict';

(function () {
  var contactsBlock = document.querySelectorAll('.contacts__item');
  var windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

  if (contactsBlock) {
    contactsBlock.forEach(function (item) {
      var contactsOpenButton = item.querySelector('.contacts__item-open');
      var contactsWrapper = item.querySelector('.contacts__item-wrapper');
      var contactsNameBlock = item.querySelector('.contacts__item-name');

      if (windowWidth < 1280) {
        contactsWrapper.classList.add('contacts__item-wrapper--closed');
      }

      contactsNameBlock.addEventListener('click', function (evt) {
        evt.preventDefault();
        window.toggleClass(contactsWrapper, 'contacts__item-wrapper--opened');
        window.toggleClass(contactsWrapper, 'contacts__item-wrapper--closed');
        window.toggleClass(contactsOpenButton, 'contacts__item-open--closed');
      });
    })
  }
})();
'use strict';

(function () {
  var slider = document.querySelector('.custom-slider');

  if (slider) {
    var TRANSITION_DELAY = 1100;

    var nextBtn = slider.querySelector('.custom-slider__button--next');
    var prevBtn = slider.querySelector('.custom-slider__button--prev');
    var slides = slider.querySelectorAll('.custom-slider__item');
    var dots = slider.querySelectorAll('.custom-slider__pagination-item');
    var number = slider.querySelector('.corrosion__paints-number');

    var currentSlideIndex = 0;
    var prevSlideIndex, nextSlideIndex;
    var slidesAmount = slides.length;

    var setPrevIndex = function () {
      if (currentSlideIndex === 0) {
        prevSlideIndex = slidesAmount - 1;
      } else {
        prevSlideIndex = currentSlideIndex - 1;
      }
    }

    var setNextIndex = function () {
      if (currentSlideIndex === slidesAmount - 1) {
        nextSlideIndex = 0;
      } else {
        nextSlideIndex = currentSlideIndex + 1;
      }
    }

    var update = function() {
      if (number) {
        var numberText = String(currentSlideIndex + 1);

        if (numberText.length < 2) {
          numberText = '0' + numberText;
        }

        number.textContent = numberText;
      }
    }

    nextBtn.addEventListener('click', function() {
      if (currentSlideIndex === slidesAmount - 1) {
        currentSlideIndex = 0;
      } else {
        currentSlideIndex++;
      }
      setPrevIndex();
      setNextIndex();


      // меняем классы
      slides[prevSlideIndex].classList.add('custom-slider__item--clockwise-hide');
      slides[prevSlideIndex].classList.remove('custom-slider__item--current');

      slides[currentSlideIndex].classList.add('custom-slider__item--clockwise-show');
      slides[currentSlideIndex].classList.add('custom-slider__item--current');

      // запомним для setTimeout
      var innerPrevSlideIndex = prevSlideIndex;
      var innerCurrentSlideIndex = currentSlideIndex;

      setTimeout(function() {
        slides[innerPrevSlideIndex].classList.remove('custom-slider__item--clockwise-hide');
        slides[innerCurrentSlideIndex].classList.remove('custom-slider__item--clockwise-show');
      }, TRANSITION_DELAY);

      dots[prevSlideIndex].classList.remove('custom-slider__pagination-item--current');
      dots[currentSlideIndex].classList.add('custom-slider__pagination-item--current');

      update();
    });

    prevBtn.addEventListener('click', function() {
      if (currentSlideIndex === 0) {
        currentSlideIndex = slidesAmount - 1;
      } else {
        currentSlideIndex--;
      }
      setPrevIndex();
      setNextIndex();

      slides[nextSlideIndex].classList.add('custom-slider__item--anti-clockwise-hide');
      slides[nextSlideIndex].classList.remove('custom-slider__item--current');

      slides[currentSlideIndex].classList.add('custom-slider__item--anti-clockwise-show');
      slides[currentSlideIndex].classList.add('custom-slider__item--current');

      // запомним для setTimeout
      var innerNextSlideIndex = nextSlideIndex;
      var innerCurrentSlideIndex = currentSlideIndex;

      setTimeout(function() {
        slides[innerNextSlideIndex].classList.remove('custom-slider__item--anti-clockwise-hide');
        slides[innerCurrentSlideIndex].classList.remove('custom-slider__item--anti-clockwise-show');
      }, TRANSITION_DELAY);


      dots[nextSlideIndex].classList.remove('custom-slider__pagination-item--current');
      dots[currentSlideIndex].classList.add('custom-slider__pagination-item--current');

      update();
    });
  }
})();
'use strict';

(function () {

  var container = document.querySelector('.personal-solution__file-upload');
  var CONTAINER_ACTIVE_CLASS = 'personal-solution__file-upload--active';

  if (container) {
    var input = container.querySelector('input');
    var filesList = document.querySelector('.personal-solution__files-list');
    var fileTemplate = document.querySelector('#personalSolutionFile').content.children[0];

    input.addEventListener('change', function () {
      handleFilesSelect(this.files);
    })

    container.addEventListener('dragover', function (e) {
      e.preventDefault();
      e.stopPropagation();
      container.classList.add(CONTAINER_ACTIVE_CLASS);
    });

    container.addEventListener('dragleave', function (e) {
      e.preventDefault();
      e.stopPropagation();
      container.classList.remove(CONTAINER_ACTIVE_CLASS);
    });

    container.addEventListener('drop', function (e) {
      e.preventDefault();
      e.stopPropagation();
      handleFilesSelect(e.dataTransfer.files);
      container.classList.remove(CONTAINER_ACTIVE_CLASS);
    });
  }

  function handleFilesSelect(files) {
    var filesArr = Array.from(files);

    filesArr.forEach(function (file) {
      var fileEl = fileTemplate.cloneNode(true);
      var fileName = fileEl.querySelector('.personal-solution__file-name');
      var fileClose = fileEl.querySelector('.personal-solution__file-close');

      fileClose.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        fileEl.remove();
      })

      fileName.textContent = file.name;
      filesList.appendChild(fileEl);
    })
  }
})();
'use strict';

(function () {
  var header = document.querySelector('.page-header');

  if (header) {
    var TABLET_WIDTH = 767;
    var MEDIUM_TABLET_WIDTH = 900;
    var DESKTOP_WIDTH = 1279;
    var ESC_KEYCODE = 27;

    var body = document.querySelector('body');
    var contactsLink = header.querySelector('.page-header__contacts');
    var phoneNumber = contactsLink.innerText;
    var contactsPopup = header.querySelector('.page-header__contacts-popup');
    var contactsOpeners = header.querySelectorAll('.opener');
    var navToggle = header.querySelector('.page-header__toggle');
    var mainNav = header.querySelector('.page-header__main-nav');
    var innerNav = header.querySelector('.page-header__main-nav--bordered');
    var searchOpenBtn = header.querySelector('.page-header__search');
    var searchCloseBtn = header.querySelector('.page-header__search-close');
    var search = header.querySelector('.page-header__search-wrapper');

    var searchPopup = document.querySelector('.popup-search');
    var searchPopupCloseBtn = document.querySelector('.search-header__form-close');

    var buttonCallTechnologist = header.querySelector('.page-header__nav-link--call');
    var popupTechnologist = document.querySelector('.popup-technologist');

    /*var onWindowClickFromSearch = function (evt) {
      if (!evt.target.matches('.page-header__search-wrapper, .page-header__search-wrapper *')) {
        search.classList.remove('page-header__search-wrapper--visible');

        document.removeEventListener('click', onWindowClickFromSearch);
      }
    };*/

    var onWindowClickFromSearch = function (evt) {
      if (!evt.target.matches('.popup-search')) {
        searchPopup.classList.add('popup-search--closed');

        document.removeEventListener('click', onWindowClickFromSearch);
      }
    };

    var onWindowPressEsc = function (evt) {
      if (evt.keyCode === ESC_KEYCODE)  {
        searchPopup.classList.add('popup-search--closed');
        window.unlockBody();
      }
      document.removeEventListener('keydown', onWindowPressEsc);
    };

    var onWindowClickFromContacts = function (evt) {
      if (!evt.target.matches('.contacts-popup, .contacts-popup *')) {
        contactsPopup.classList.remove('page-header__contacts-popup--opened');
        contactsOpeners.forEach(function (opener) {
          opener.classList.remove('opener--opened');
        });

        document.removeEventListener('click', onWindowClickFromContacts);
      }
    };

    if (searchPopup) {
      searchOpenBtn.addEventListener('click', function (evt) {
        evt.preventDefault();
        evt.stopPropagation();

        if (innerNav) {
          innerNav.classList.remove('page-header__main-nav--opened');
        }
        contactsPopup.classList.remove('page-header__contacts-popup--opened');
        searchPopup.classList.remove('popup-search--closed');
        window.addEventListener('keydown', onWindowPressEsc);
        window.lockBody();
      });

      searchPopupCloseBtn.addEventListener('click', function (evt) {
        searchPopup.classList.add('popup-search--closed');
        window.unlockBody();
      });
    }

    if (buttonCallTechnologist && popupTechnologist) {
      buttonCallTechnologist.addEventListener('click', function () {
        window.openPopup(popupTechnologist);
      });
    }


   /* searchOpenBtn.addEventListener('click', function (evt) {
      evt.preventDefault();
      evt.stopPropagation();

      if (innerNav) {
        innerNav.classList.remove('page-header__main-nav--opened');
      }
      contactsPopup.classList.remove('page-header__contacts-popup--opened');
      search.classList.add('page-header__search-wrapper--visible');
      window.addEventListener('click', onWindowClickFromSearch);
    });

    searchCloseBtn.addEventListener('click', function () {
      search.classList.remove('page-header__search-wrapper--visible');
    })*/

    navToggle.addEventListener('click', function () {
      if (header.classList.contains('page-header--opened')) {
        body.style.overflow = 'visible';
        header.classList.remove('page-header--opened');
        navToggle.classList.remove('page-header__toggle--opened');
        mainNav.style.display = 'none';
        if (innerNav && window.matchMedia('(max-width: ' + TABLET_WIDTH + 'px)').matches) {
          header.querySelector('.page-header__nav-list--left').style.display = 'none';
          header.querySelector('.page-header__nav-wrapper').classList.remove('page-header__nav-wrapper--opened');
          header.querySelector('.opener').classList.remove('opener--opened');
        }
        header.style = style;

        if (contactsPopup.classList.contains('page-header__contacts-popup--opened')) {
          contactsLink.innerText = phoneNumber;
          contactsPopup.classList.remove('page-header__contacts-popup--opened');
          contactsOpeners.forEach(function (opener) {
            opener.classList.remove('opener--opened');
          });
        }
      } else {
        body.style.overflow = 'hidden';
        header.classList.add('page-header--opened');
        navToggle.classList.add('page-header__toggle--opened');
        mainNav.style.display = 'block';
        if (innerNav && window.matchMedia('(max-width: ' + TABLET_WIDTH + 'px)').matches) {
          header.querySelector('.page-header__nav-list--left').style.display = 'block';
        }
      }
    });

    if (innerNav) {
      var style = header.style;
      var catalogBtn = innerNav.querySelector('#shop-catalog');
      var catalog = header.querySelector('.page-header__nav-wrapper');

      if (window.matchMedia('(max-width: ' + MEDIUM_TABLET_WIDTH + 'px)').matches) {
        catalogBtn.addEventListener('click', function (evt) {
          evt.preventDefault();

          if (catalog.classList.contains('page-header__nav-wrapper--opened')) {
            catalog.classList.remove('page-header__nav-wrapper--opened');
            header.style = style;
          } else {
            catalog.classList.add('page-header__nav-wrapper--opened');
            header.style.background = '#124ba6';
          }
        });
      } else {
        var onWindowClickFromCatalog = function (evt) {
          if (!evt.target.matches('.page-header__nav-list--inner, .page-header__nav-list--inner *')) {
            innerNav.classList.remove('page-header__main-nav--opened');
            contactsOpeners.forEach(function (opener) {
              opener.classList.remove('opener--opened');
            });

            document.removeEventListener('click', onWindowClickFromCatalog);
          }
        };

        catalogBtn.addEventListener('click', function (evt) {
          evt.preventDefault();
          evt.stopPropagation();

          contactsPopup.classList.remove('page-header__contacts-popup--opened');
          innerNav.classList.toggle('page-header__main-nav--opened');

          window.addEventListener('click', onWindowClickFromCatalog);
        });
      }
    }

    if (window.matchMedia('(max-width: ' + TABLET_WIDTH + 'px)').matches) {
      contactsLink.addEventListener('click', function (evt) {
        evt.preventDefault();
        if (contactsPopup.classList.contains('page-header__contacts-popup--opened')) {
          contactsLink.innerText = phoneNumber;
          contactsPopup.classList.remove('page-header__contacts-popup--opened');
          mainNav.style.display = 'block';
          if (innerNav) {
            header.querySelector('.page-header__nav-list--left').style.display = 'block';
          }
        } else {
          contactsLink.innerText = 'Свернуть';
          mainNav.style.display = 'none';
          contactsPopup.classList.add('page-header__contacts-popup--opened');
          if (innerNav) {
            header.querySelector('.page-header__nav-list--left').style.display = 'none';
          }
        }
      });
    } else {
      contactsLink.addEventListener('click', function (evt) {
        evt.preventDefault();
        evt.stopPropagation();

        if (innerNav) {
          innerNav.classList.remove('page-header__main-nav--opened');
        }
        contactsPopup.classList.toggle('page-header__contacts-popup--opened');

        window.addEventListener('click', onWindowClickFromContacts);
      });
    }
  }
})();
'use strict';

(function () {
  var SURFACE_SIZE = 1280;

  var sliderWrapper = document.querySelector('.news-inner__table-wrapper');
  var newsInnerSection = document.querySelector('.news-inner__table-section');

  var toggleBlur = function (tableSlider) {
    sliderWrapper.classList.toggle('news-inner__table-wrapper--right-blur', !tableSlider.isEnd);
    sliderWrapper.classList.toggle('news-inner__table-wrapper--left-blur', !tableSlider.isBeginning);
  }

  if (window.innerWidth < SURFACE_SIZE && sliderWrapper) {
    newsInnerSection.classList.remove('site-container');
    sliderWrapper.querySelector('.news-table').classList.add('swiper-slide');

    var tableSlider = new Swiper ('.news-inner__table-wrapper', {
      init: false,
      direction: 'horizontal',
      slidesPerView: 0.7384,
      slidesOffsetAfter: 60,
      breakpoints: {
        320: {
          slidesPerView: 0.4849,
          slidesOffsetAfter: 24
        },
        768: {
          slidesPerView: 0.7384,
          slidesOffsetAfter: 60
        }
      },

      navigation: {
        nextEl: '.news-inner__slider-button--next',
        prevEl: '.news-inner__slider-button--prev'
      },
    });

    tableSlider.on('init', function () {
      toggleBlur(tableSlider);
    });

    tableSlider.init();

    tableSlider.on('transitionEnd', function () {
      toggleBlur(tableSlider);
    });
  };
})();
'use strict';

(function () {

  var tabsWrapper = document.querySelector('.tabs');
  var contactsWrapper = document.querySelector('.main-contacts');
  var topFeaturesWrapper = document.querySelector('.main-features__top-list');
  var bottomFeaturesWrapper = document.querySelector('.main-features__slider-wrapper');
  var isLargeScreen = window.innerWidth > 1440;

  if (topFeaturesWrapper) {
    var scaleAnimation = anime({
      targets: '.indicator__icon',
      keyframes: [
        { scale: 0.5, translateX: 140, translateY: -100 }
      ],
      easing: 'linear',
      duration: 1000,
      delay: 1000,
      autoplay: false
    })

    var rhombusAnimation = anime({
      targets: '.indicator__icon--rhombus path',
      d: [
        { value: 'M9,594.5C-32.7,398.5,60.2,61.7,493.6,7.6C869-39.4,1230.4,137,1368,409.3c213.8,423.1-142.2,809.8-508.1,621.6 C545.7,869.3,77.7,916.9,9,594.5z' },
        { value: 'M535.4,1074.7C375.5,913,234.4,771.9,0,540.5C156.3,372.6,297.4,243.5,534.2,5.2 c147.5,145.3,252.6,253.3,535.3,534.2C930.9,681.8,768.8,843.9,535.4,1074.7z' },
      ],
      easing: 'linear',
      duration: 2000,
      autoplay: false
    });

    var triangleAnimation = anime({
      targets: '.indicator__icon--triangle path',
      d: [
        { value: 'M9,594.5C-32.7,398.5,60.2,61.7,493.6,7.6C869-39.4,1230.4,137,1368,409.3c213.8,423.1-142.2,809.8-508.1,621.6 C545.7,869.3,77.7,916.9,9,594.5z' },
        { value: 'M14.4,1064.5C15.2,871,18.2,399.6,20.6,8.9C330.7,318.9,351.7,339.9,555.9,541 c186.1,189.1,420.3,420.3,523.6,526.7C761.7,1066,360.5,1063.1,14.4,1064.5z' },
      ],
      easing: 'linear',
      duration: 2000,
      autoplay: false
    });

    var circleAnimation = anime({
      targets: '.indicator__icon--circle path',
      d: [
        { value: 'M9,594.5C-32.7,398.5,60.2,61.7,493.6,7.6C869-39.4,1230.4,137,1368,409.3c213.8,423.1-142.2,809.8-508.1,621.6 C545.7,869.3,77.7,916.9,9,594.5z' },
        { value: 'M14.7,595.6C-10.5,470,78,50.5,494.5,15.4C871.1,0,1017.8,248.8,1061.7,452.3c57.3,466-364.1,635.3-586.8,610 C315.4,1049.6,71.9,927.7,14.7,595.6z' },
      ],
      easing: 'linear',
      duration: 2000,
      autoplay: false,
    });

    $('.main-features__top-list').on('inview', function (evt, isInView) {
      if (isInView) {
        rhombusAnimation.restart();
        triangleAnimation.restart();
        circleAnimation.restart();
        scaleAnimation.restart();
        $('.main-features__top-list').off('inview');
      }
    });
  }

  if (tabsWrapper) {
    var DESKTOP_WIDTH = 1279;
    var TABLET_WIDTH = 767;

    var topFeaturesWrapper = document.querySelector('#features-wrapper .corrosion__slider');
    var complexWrapper = document.querySelector('.complex__slider-wrapper');

    var tabs = tabsWrapper.querySelectorAll('.tabs__button');

    var corrosionSection = document.querySelector('.corrosion');
    var woodSection = document.querySelector('#wood-wrapper');
    var complexSection = document.querySelector('.complex');

    var resetAllTabs = function () {
      tabs.forEach(function (tab) {
        tab.parentElement.classList.remove('tabs__item--current');
      });
    };

    var loadCorrosionSection = function () {
      if (window.matchMedia('(max-width: ' + DESKTOP_WIDTH + 'px)').matches) {
        topFeaturesWrapper.classList.add('swiper-container');
        topFeaturesWrapper.classList.add('s1');
        topFeaturesWrapper.querySelector('.corrosion__features-list').classList.add('swiper-wrapper');
        topFeaturesWrapper.querySelectorAll('.corrosion__features-item').forEach(function (item) {
          item.classList.add('swiper-slide');
        });
        topFeaturesWrapper.querySelector('.slider-button--prev').classList.add('swiper-button-prev');
        topFeaturesWrapper.querySelector('.slider-button--next').classList.add('swiper-button-next');

        var corrosionSwiper = new Swiper('.s1', {
          direction: 'horizontal',
          loop: true,
          grabCursor: true,
          slidesPerView: 1,
          spaceBetween: 10,

          breakpoints: {
            600: {
              slidesPerView: 2,
              spaceBetween: 10
            }
          },

          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },
        });
      }
    }

    var loadWoodSection = function () {
      var openPopupBtn = woodSection.querySelector('.wood-wrapper__modal-button');
      var popupRequest = woodSection.querySelector('.popup-request');

      openPopupBtn.addEventListener('click', function () {
        window.openPopup(popupRequest);
      });

      document.addEventListener('lazybeforeunveil', function (e) {
        if (e.target.classList.contains('wood__house-image')) {
          var image = document.querySelectorAll('.wood__house-image')[0];
          var container = document.querySelector('.twentytwenty-container');
          container.style.height = image.height + 'px';
          $('.twentytwenty-container').twentytwenty({ default_offset_pct: (isLargeScreen ? 0.72 : 0.5) });
        }
      });

      var spriteTarget = woodSection.querySelector("#sprite");
      var prevSide = 0;
      var currentSide;

      if (window.matchMedia('(max-width: ' + TABLET_WIDTH + 'px)').matches) {
        var woodSliderWrapper = woodSection.querySelector('.cube__slider-wrapper');
        woodSliderWrapper.classList.add('swiper-container');
        woodSliderWrapper.classList.add('s3');
        woodSliderWrapper.querySelector('.cube__list').classList.add('swiper-wrapper');
        woodSliderWrapper.querySelectorAll('.cube__item').forEach(function (slide) {
          slide.classList.add('swiper-slide');
        });
        woodSliderWrapper.querySelector('.slider-button--prev').classList.add('swiper-button-prev');
        woodSliderWrapper.querySelector('.slider-button--next').classList.add('swiper-button-next');
        woodSliderWrapper.querySelector('.cube__slider-pagination').classList.add('swiper-pagination');

        var cubeAnimationMobile = new Motio(spriteTarget, {
          fps: 30,
          vertical: true,
          frames: 65,
          width: 350,
          height: 350
        });

        var setSide = function (nextSide) {
          switch (nextSide) {
            case 0:
              cubeAnimationMobile.play();
              cubeAnimationMobile.to(48, function () {
                cubeAnimationMobile.pause();
              });
              break;
            case 1:
              cubeAnimationMobile.play();
              cubeAnimationMobile.to(24, function () {
                cubeAnimationMobile.pause();
              });
              break;
            case 2:
              cubeAnimationMobile.play();
              cubeAnimationMobile.to(0, function () {
                cubeAnimationMobile.pause();
              });
              break;
          }
        };

        cubeAnimationMobile.to(48, true); // начальное положение

        var woodSwiper = new Swiper('.s3', {
          direction: 'horizontal',
          loop: true,
          slidesPerView: 1,

          pagination: {
            el: '.swiper-pagination',
          },

          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },
        });

        woodSwiper.navigation.nextEl.addEventListener('click', function () {
          currentSide = woodSwiper.realIndex;
          setSide(currentSide);
        });
        woodSwiper.navigation.prevEl.addEventListener('click', function () {
          currentSide = woodSwiper.realIndex;
          setSide(currentSide);
        });
      } else {
        var pluses = document.querySelectorAll('.cube__item');
        var cubeAnimation = new Motio(spriteTarget, {
          fps: 25,
          vertical: true,
          frames: 65,
          width: 800,
          height: 800
        });
        var setSide = function (prevSide, nextSide) {
          if (prevSide === nextSide) {
            return;
          }

          cubeAnimation.play();

          switch (nextSide) {
            case 0:
              cubeAnimation.to(48, function () {
                cubeAnimation.pause();
              });
              break;
            case 1:
              cubeAnimation.to(24, function () {
                cubeAnimation.pause();
              });
              break;
            case 2:
              cubeAnimation.to(0, function () {
                cubeAnimation.pause();
              });
              break;
          }
        };

        var hideAllItems = function () {
          pluses.forEach(function (plus) {
            plus.classList.remove('cube__item--active');
          })
        }

        cubeAnimation.to(48, true); // начальное положение

        pluses.forEach(function (plus) {
          plus.addEventListener('mouseover', function () {
            hideAllItems();
            plus.classList.add('cube__item--active');
            if (plus.classList.contains('cube__item--first')) {
              currentSide = 0;
            } else if (plus.classList.contains('cube__item--second')) {
              currentSide = 1;
            } else if (plus.classList.contains('cube__item--third')) {
              currentSide = 2;
            }

            setSide(prevSide, currentSide);
            prevSide = currentSide;
          });
        });
      }
    }

    var setInitialView = function () {
      corrosionSection.style.display = 'none';
      complexSection.style.display = 'none';
      woodSection.style.display = 'block';

      tabs.forEach(function (tab) {
        tab.addEventListener('click', function (evt) {
          evt.preventDefault();

          resetAllTabs();
          tab.parentElement.classList.add('tabs__item--current');

          switch (tab.parentElement.getAttribute('data-section')) {
            case 'corrosion':
              corrosionSection.style.display = 'block';
              complexSection.style.display = 'none';
              woodSection.style.display = 'none';
              break;
            case 'wood':
              corrosionSection.style.display = 'none';
              complexSection.style.display = 'none';
              woodSection.style.display = 'block';
              break;
            case 'complex':
              corrosionSection.style.display = 'none';
              complexSection.style.display = 'block';
              woodSection.style.display = 'none';
              window.examplesSlider.update();
              break;
          }
        });
      });
    };

    loadCorrosionSection();
    loadWoodSection();
    setInitialView();
  }



  if (bottomFeaturesWrapper) {

    if (window.matchMedia('(max-width: ' + DESKTOP_WIDTH + 'px)').matches) {
      bottomFeaturesWrapper.classList.add('swiper-container');
      bottomFeaturesWrapper.classList.add('s4');
      bottomFeaturesWrapper.querySelector('.main-features__bottom-list').classList.add('swiper-wrapper');
      bottomFeaturesWrapper.querySelectorAll('.main-features__item').forEach(function (item) {
        item.classList.add('swiper-slide');
      });
      bottomFeaturesWrapper.querySelector('.slider-button--prev').classList.add('swiper-button-prev');
      bottomFeaturesWrapper.querySelector('.slider-button--next').classList.add('swiper-button-next');
      bottomFeaturesWrapper.querySelector('.slider-pagination').classList.add('swiper-pagination');

      var featuresSwiper = new Swiper('.s4', {
        direction: 'horizontal',
        loop: true,
        slidesPerView: 1,
        effect: 'fade',

        pagination: {
          el: '.swiper-pagination',
          type: 'fraction',
        },

        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },

        on: {
          slideChange: function () {
            detailsToggles.forEach(function(toggle){
              if(toggle.classList.contains('main-features__details-toggle--active')){
                toggle.click();
              }
            });
          }
        }
      });
    }

    var detailsToggles = Array.from(document.querySelectorAll('.main-features__details-toggle'));

    detailsToggles.forEach(function (toggle) {
      toggle.addEventListener('click', function () {
        this.classList.toggle('main-features__details-toggle--active');

        var panel = this.nextElementSibling;
        if (panel.style.maxHeight) {
          panel.style.maxHeight = '';
        } else {
          panel.style.maxHeight = panel.scrollHeight + "px";
        }
        featuresSwiper.update();
      })
    });
  }

  if (contactsWrapper) {
    var coords = {
      'primorsky': [59.983468, 30.283556],
      'leninsky': [59.852081, 30.238487],
      'office': [59.947087, 30.333735],
      'store': [59.916388, 26.388515]
    }

    var contactsTabs = contactsWrapper.querySelectorAll('.main-contacts__button');
    var map, pin;

    var setPin = function (coords) {
      pin = new window.ymaps.Placemark(coords, {
        hintContent: ''
      }, {
        iconLayout: 'default#image',
        iconImageHref: 'images/static/point-large.svg',
        iconImageSize: [84, 119],
        iconImageOffset: [-55, -110]
      });
    }

    var initMap = function () {
      map = new window.ymaps.Map('main-map', {
        center: coords['primorsky'],
        zoom: 17,
        controls: []
      });

      setPin(coords['primorsky']);
      map.geoObjects.add(pin);
    }

    var updateMap = function (coords) {
      map.setCenter(coords);
      map.container.fitToViewport();
      map.geoObjects.remove(pin);

      setPin(coords);
      map.geoObjects.add(pin);
    }

    var closeAllTabs = function () {
      contactsTabs.forEach(function (tab) {
        tab.parentElement.classList.remove('main-contacts__item--current');
      });
    }

    var initContacts = function () {
      document.addEventListener('DOMContentLoaded', function () {
        window.ymaps.ready(initMap);
      });

      contactsTabs.forEach(function (tab) {
        tab.addEventListener('click', function (evt) {
          evt.preventDefault();

          closeAllTabs();
          tab.parentElement.classList.add('main-contacts__item--current');
          updateMap(coords[tab.parentElement.getAttribute('data-place')]);
        });
      });
    }

    initContacts();
  }
})();
'use strict';

(function () {
  var sliderWrapper = document.querySelector('.examples-slider');

  if (sliderWrapper) {
    sliderWrapper.classList.add('swiper-container');
    sliderWrapper.querySelector('.examples-slider__list').classList.add('swiper-wrapper');
    sliderWrapper.querySelectorAll('.examples-slider__item').forEach(function (item) {
      item.classList.add('swiper-slide');
    });
    sliderWrapper.querySelector('.slider-button--prev').classList.add('swiper-button-prev');
    sliderWrapper.querySelector('.slider-button--next').classList.add('swiper-button-next');
    sliderWrapper.querySelector('.slider-pagination').classList.add('swiper-pagination');

    var examplesSlider = new Swiper ('.examples-slider', {
      direction: 'horizontal',
      loop: true,
      slidesPerView: 1,
      effect: 'fade',

      pagination: {
        el: '.swiper-pagination',
        type: 'fraction',
      },

      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    });

    window.examplesSlider = examplesSlider;
  };
})();
'use strict';

(function () {
  var mapBoxContainer = document.querySelector('#map-container');

  if (mapBoxContainer) {
    mapboxgl.accessToken = 'pk.eyJ1Ijoia3Nlbmlhb3Jsb3ZhIiwiYSI6ImNqbGM1bnk0cjBsanYzdms0OWF1OXNkaHMifQ.YqvIjWbMB1zjQszWzf2mOw#2.18/51.12/87.9';

    var map = new mapboxgl.Map({
      container: 'map-container',
      style: { "version": 8, "name": "Mapbox Basic Template", "metadata": { "mapbox:origin": "basic-template", "mapbox:autocomposite": true, "mapbox:type": "template", "mapbox:sdk-support": { "js": "0.54.0", "android": "7.4.0", "ios": "4.11.0" }, "mapbox:groups": {} }, "center": [73.74919907361982, 53.73996792162444], "zoom": 3.097991081574958, "bearing": 0, "pitch": 0, "sources": { "composite": { "url": "mapbox://mapbox.mapbox-streets-v8", "type": "vector" } }, "sprite": "mapbox://sprites/kseniaorlova/ck3xoymds0f7b1cp9jx6e1x0y/629bpdwpqxu5j66f3aoku8h84", "glyphs": "mapbox://fonts/kseniaorlova/{fontstack}/{range}.pbf", "layers": [{ "id": "background", "type": "background", "layout": {}, "paint": { "background-color": "#124ba6" } }, { "minzoom": 5, "layout": {}, "filter": ["==", ["get", "class"], "national_park"], "type": "fill", "source": "composite", "id": "national_park", "paint": { "fill-color": "hsla(78, 51%, 73%, 0)", "fill-opacity": ["interpolate", ["linear"], ["zoom"], 0, 0, 5, 0], "fill-antialias": false }, "source-layer": "landuse_overlay" }, { "minzoom": 5, "layout": {}, "filter": ["match", ["get", "class"], ["airport", "hospital", "park", "pitch", "school"], true, false], "type": "fill", "source": "composite", "id": "landuse", "paint": { "fill-color": ["match", ["get", "class"], ["airport"], "hsl(345, 6%, 87%)", ["hospital"], "hsl(0, 56%, 89%)", ["park", "pitch"], "hsl(78, 51%, 74%)", ["school"], "#ead6c8", "hsla(0, 0%, 0%, 0)"], "fill-opacity": ["interpolate", ["linear"], ["zoom"], 0, 0, 5, 0] }, "source-layer": "landuse" }, { "minzoom": 8, "layout": { "line-join": "round", "line-cap": "round" }, "filter": ["all", ["==", ["geometry-type"], "LineString"], ["match", ["get", "class"], ["canal", "river"], true, false]], "type": "line", "source": "composite", "id": "waterway", "paint": { "line-color": "#08295a", "line-width": ["interpolate", ["exponential", 1.3], ["zoom"], 8.5, 0.1, 20, 8], "line-opacity": ["interpolate", ["linear"], ["zoom"], 8, 0, 8.5, 1] }, "source-layer": "waterway" }, { "id": "water", "type": "fill", "source": "composite", "source-layer": "water", "layout": {}, "paint": { "fill-color": "#08295a" } }, { "minzoom": 10, "layout": {}, "filter": ["all", ["==", ["geometry-type"], "Polygon"], ["match", ["get", "type"], ["helipad", "runway", "taxiway"], true, false]], "type": "fill", "source": "composite", "id": "aeroway-polygon", "paint": { "fill-color": "hsl(0, 0%, 77%)", "fill-opacity": 0 }, "source-layer": "aeroway" }, { "minzoom": 9, "layout": {}, "filter": ["all", ["==", ["geometry-type"], "LineString"], ["match", ["get", "type"], ["runway", "taxiway"], true, false]], "type": "line", "source": "composite", "id": "aeroway-line", "paint": { "line-width": ["interpolate", ["exponential", 1.5], ["zoom"], 10, 0.5, 18, 20], "line-color": "hsl(0, 0%, 77%)", "line-opacity": 0 }, "source-layer": "aeroway" }, { "minzoom": 15, "layout": {}, "filter": ["all", ["!=", ["get", "type"], "building:part"], ["==", ["get", "underground"], "false"]], "type": "fill", "source": "composite", "id": "building", "paint": { "fill-color": "hsl(38, 35%, 78%)", "fill-opacity": ["interpolate", ["linear"], ["zoom"], 13.5, 0, 14, 0] }, "source-layer": "building" }, { "minzoom": 14, "layout": { "line-join": "round", "line-cap": "round" }, "filter": ["all", ["==", ["geometry-type"], "LineString"], ["!=", ["get", "type"], "platform"], ["match", ["get", "class"], ["path", "pedestrian"], true, false]], "type": "line", "source": "composite", "id": "pedestrian-path", "paint": { "line-width": ["interpolate", ["exponential", 1.5], ["zoom"], 14, ["match", ["get", "class"], "pedestrian", 1, 0.75], 20, ["match", ["get", "class"], "pedestrian", 8, 5]], "line-color": ["match", ["get", "type"], ["crossing", "sidewalk"], "hsl(38, 35%, 80%)", "hsl(38, 28%, 70%)"], "line-opacity": 0 }, "source-layer": "road" }, { "minzoom": 13, "layout": { "line-join": "round" }, "filter": ["all", ["==", ["geometry-type"], "LineString"], ["!=", ["get", "type"], "service:parking_aisle"], ["==", ["get", "structure"], "tunnel"], ["match", ["get", "class"], ["motorway", "motorway_link", "trunk", "trunk_link", "primary", "primary_link", "secondary", "secondary_link", "tertiary", "tertiary_link", "street", "street_limited", "service", "track"], true, false]], "type": "line", "source": "composite", "id": "tunnel", "paint": { "line-width": ["interpolate", ["exponential", 1.5], ["zoom"], 5, ["match", ["get", "class"], ["motorway", "trunk", "primary"], 0.5, "tertiary", 0.01, 0], 12, ["match", ["get", "class"], ["motorway", "trunk", "primary"], 3, ["secondary", "tertiary"], 2, ["motorway_link", "trunk_link", "street", "street_limited"], 0.5, 0], 18, ["match", ["get", "class"], ["motorway", "trunk", "primary"], 30, ["secondary", "tertiary"], 24, ["motorway_link", "trunk_link", "street", "street_limited"], 12, 10]], "line-color": ["match", ["get", "class"], ["primary_link", "secondary_link", "tertiary_link", "street", "street_limited", "service", "track"], "hsl(38, 100%, 98%)", "hsl(0, 0%, 100%)"], "line-dasharray": [0.2, 0.2] }, "source-layer": "road" }, { "minzoom": 5, "layout": { "line-join": "round", "line-cap": "round" }, "filter": ["all", ["==", ["geometry-type"], "LineString"], ["!=", ["get", "type"], "service:parking_aisle"], ["match", ["get", "structure"], ["bridge", "tunnel"], false, true], ["match", ["get", "class"], ["motorway", "motorway_link", "trunk", "trunk_link", "primary", "primary_link", "secondary", "secondary_link", "tertiary", "tertiary_link", "street", "street_limited", "service", "track"], true, false]], "type": "line", "source": "composite", "id": "road", "paint": { "line-width": ["interpolate", ["exponential", 1.5], ["zoom"], 5, ["match", ["get", "class"], ["motorway", "trunk", "primary"], 0.5, "tertiary", 0.01, 0], 12, ["match", ["get", "class"], ["motorway", "trunk", "primary"], 3, ["secondary", "tertiary"], 2, ["motorway_link", "trunk_link", "street", "street_limited"], 0.5, 0], 18, ["match", ["get", "class"], ["motorway", "trunk", "primary"], 30, ["secondary", "tertiary"], 24, ["motorway_link", "trunk_link", "street", "street_limited"], 12, 10]], "line-color": ["match", ["get", "class"], ["street", "street_limited", "service", "track", "secondary_link", "tertiary_link", "primary_link", "trunk_link"], "hsl(38, 80%, 95%)", "hsl(0, 0%, 100%)"], "line-opacity": 0 }, "source-layer": "road" }, { "minzoom": 13, "layout": { "line-join": "round" }, "filter": ["all", ["==", ["geometry-type"], "LineString"], ["!=", ["get", "type"], "service:parking_aisle"], ["==", ["get", "structure"], "bridge"], ["match", ["get", "class"], ["motorway", "motorway_link", "trunk", "trunk_link", "primary", "primary_link", "secondary", "secondary_link", "tertiary", "tertiary_link", "street", "street_limited", "service", "track"], true, false]], "type": "line", "source": "composite", "id": "bridge-case", "paint": { "line-width": ["interpolate", ["exponential", 1.5], ["zoom"], 10, 1, 16, 2], "line-color": "hsl(38, 48%, 86%)", "line-gap-width": ["interpolate", ["exponential", 1.5], ["zoom"], 5, ["match", ["get", "class"], ["motorway", "trunk", "primary"], 0.5, "tertiary", 0.01, 0], 12, ["match", ["get", "class"], ["motorway", "trunk", "primary"], 3, ["secondary", "tertiary"], 2, ["motorway_link", "trunk_link", "street", "street_limited"], 0.5, 0], 18, ["match", ["get", "class"], ["motorway", "trunk", "primary"], 30, ["secondary", "tertiary"], 24, ["motorway_link", "trunk_link", "street", "street_limited"], 12, 10]], "line-opacity": 0 }, "source-layer": "road" }, { "minzoom": 13, "layout": { "line-join": "round", "line-cap": "round" }, "filter": ["all", ["==", ["geometry-type"], "LineString"], ["!=", ["get", "type"], "service:parking_aisle"], ["==", ["get", "structure"], "bridge"], ["match", ["get", "class"], ["motorway", "motorway_link", "trunk", "trunk_link", "primary", "primary_link", "secondary", "secondary_link", "tertiary", "tertiary_link", "service", "street", "street_limited", "track"], true, false]], "type": "line", "source": "composite", "id": "bridge", "paint": { "line-width": ["interpolate", ["exponential", 1.5], ["zoom"], 5, ["match", ["get", "class"], ["motorway", "trunk", "primary"], 0.5, "tertiary", 0.01, 0], 12, ["match", ["get", "class"], ["motorway", "trunk", "primary"], 3, ["secondary", "tertiary"], 2, ["motorway_link", "trunk_link", "street", "street_limited"], 0.5, 0], 18, ["match", ["get", "class"], ["motorway", "trunk", "primary"], 30, ["secondary", "tertiary"], 24, ["motorway_link", "trunk_link", "street", "street_limited"], 12, 10]], "line-color": ["match", ["get", "class"], ["primary_link", "secondary_link", "tertiary_link", "street", "street_limited", "service", "track"], "hsl(38, 100%, 98%)", "hsl(0, 0%, 100%)"], "line-opacity": 0 }, "source-layer": "road" }, { "minzoom": 2, "layout": { "line-join": "round", "line-cap": "round" }, "filter": ["all", ["==", ["get", "admin_level"], 1], ["==", ["get", "disputed"], "false"], ["==", ["get", "maritime"], "false"], ["match", ["get", "worldview"], ["US", "all"], true, false]], "type": "line", "source": "composite", "id": "admin-state-province", "paint": { "line-dasharray": ["step", ["zoom"], ["literal", [2, 0]], 7, ["literal", [2, 2, 6, 2]]], "line-width": ["interpolate", ["linear"], ["zoom"], 7, 0.75, 12, 1.5], "line-opacity": ["interpolate", ["linear"], ["zoom"], 0, 0, 2, 0], "line-color": ["step", ["zoom"], "hsl(0, 0%, 80%)", 4, "hsl(0, 0%, 65%)"] }, "source-layer": "admin" }, { "minzoom": 1, "layout": { "line-join": "round", "line-cap": "round" }, "filter": ["all", ["==", ["get", "admin_level"], 0], ["==", ["get", "disputed"], "false"], ["==", ["get", "maritime"], "false"], ["match", ["get", "worldview"], ["US", "all"], true, false]], "type": "line", "source": "composite", "id": "admin-country", "paint": { "line-color": "#08295a", "line-width": ["interpolate", ["linear"], ["zoom"], 3, 0.5, 10, 2] }, "source-layer": "admin" }, { "minzoom": 1, "layout": { "line-join": "round" }, "filter": ["all", ["==", ["get", "admin_level"], 0], ["==", ["get", "disputed"], "true"], ["==", ["get", "maritime"], "false"], ["match", ["get", "worldview"], ["US", "all"], true, false]], "type": "line", "source": "composite", "id": "admin-country-disputed", "paint": { "line-color": "#08295a", "line-width": ["interpolate", ["linear"], ["zoom"], 3, 0.5, 10, 2], "line-dasharray": [1.5, 1.5] }, "source-layer": "admin" }, { "minzoom": 12, "layout": { "text-field": ["coalesce", ["get", "name_en"], ["get", "name"]], "text-size": ["interpolate", ["linear"], ["zoom"], 9, ["match", ["get", "class"], ["motorway", "trunk", "primary", "secondary", "tertiary"], 10, 9], 20, ["match", ["get", "class"], ["motorway", "trunk", "primary", "secondary", "tertiary"], 15, 14]], "text-max-angle": 30, "text-font": ["Roboto Regular", "Arial Unicode MS Regular"], "symbol-placement": "line", "text-padding": 1, "text-rotation-alignment": "map", "text-pitch-alignment": "viewport" }, "filter": ["match", ["get", "class"], ["motorway", "trunk", "primary", "secondary", "tertiary", "street", "street_limited", "pedestrian"], true, false], "type": "symbol", "source": "composite", "id": "road-label", "paint": { "text-color": "hsl(0, 0%, 0%)", "text-halo-color": "hsla(0, 0%, 100%, 0.95)", "text-halo-width": 1, "text-opacity": 0 }, "source-layer": "road" }, { "minzoom": 6, "layout": { "text-line-height": 1.1, "text-size": ["interpolate", ["linear"], ["zoom"], 10, 11, 18, 13], "icon-image": ["concat", ["get", "maki"], "-11"], "text-max-angle": 38, "text-font": ["Roboto Regular", "Arial Unicode MS Regular"], "text-offset": [0, 0.75], "text-anchor": "top", "text-field": ["coalesce", ["get", "name_en"], ["get", "name"]], "text-max-width": 8 }, "filter": ["<=", ["get", "filterrank"], 3], "type": "symbol", "source": "composite", "id": "poi-label", "paint": { "text-color": "hsl(38, 19%, 29%)", "text-halo-color": "hsla(0, 0%, 100%, 0.75)", "text-halo-width": 1, "text-halo-blur": 0.5, "text-opacity": 0 }, "source-layer": "poi_label" }, { "minzoom": 8, "layout": { "text-line-height": 1.1, "text-size": ["interpolate", ["linear"], ["zoom"], 10, 12, 18, 18], "icon-image": ["step", ["zoom"], ["concat", ["get", "maki"], "-11"], 13, ["concat", ["get", "maki"], "-15"]], "text-font": ["Roboto Regular", "Arial Unicode MS Regular"], "text-offset": [0, 0.75], "text-anchor": "top", "text-field": ["step", ["zoom"], ["get", "ref"], 14, ["coalesce", ["get", "name_en"], ["get", "name"]]], "text-max-width": 9 }, "type": "symbol", "source": "composite", "id": "airport-label", "paint": { "text-color": "hsl(38, 19%, 29%)", "text-halo-color": "hsla(0, 0%, 100%, 0.95)", "text-halo-width": 1, "text-opacity": 0 }, "source-layer": "airport_label" }, { "minzoom": 11, "layout": { "text-field": ["coalesce", ["get", "name_en"], ["get", "name"]], "text-transform": "uppercase", "text-letter-spacing": 0.15, "text-max-width": 8, "text-font": ["Roboto Regular", "Arial Unicode MS Regular"], "text-padding": 3, "text-size": ["interpolate", ["linear"], ["zoom"], 12, 11, 16, 16] }, "maxzoom": 15, "filter": ["all", ["<=", ["get", "filterrank"], 3], ["match", ["get", "type"], ["suburb", "quarter", "neighbourhood"], true, false]], "type": "symbol", "source": "composite", "id": "place-neighborhood-suburb-label", "paint": { "text-halo-color": "hsla(0, 0%, 100%, 0.95)", "text-color": "hsl(38, 0%, 100%)", "text-opacity": 0 }, "source-layer": "place_label" }, { "minzoom": 6, "layout": { "text-size": ["interpolate", ["linear"], ["zoom"], 5, ["match", ["get", "type"], "town", 9.5, 8], 16, ["match", ["get", "type"], "town", 20, 16]], "text-font": ["step", ["zoom"], ["literal", ["Roboto Regular", "Arial Unicode MS Regular"]], 12, ["match", ["get", "type"], "town", ["literal", ["Roboto Medium", "Arial Unicode MS Regular"]], ["literal", ["Roboto Regular", "Arial Unicode MS Regular"]]]], "text-max-width": 0, "text-field": ["coalesce", ["get", "name_en"], ["get", "name"]], "text-line-height": 0 }, "maxzoom": 14, "filter": ["all", ["match", ["get", "type"], ["town", "village", "hamlet"], true, false], ["<=", ["get", "filterrank"], 3]], "type": "symbol", "source": "composite", "id": "place-town-village-hamlet-label", "paint": { "text-color": "hsl(0, 0%, 100%)", "text-halo-color": "hsla(0, 0%, 100%, 0.95)", "text-opacity": 0 }, "source-layer": "place_label" }, { "minzoom": 3, "layout": { "text-size": ["interpolate", ["linear"], ["zoom"], 3, ["step", ["get", "symbolrank"], 12, 9, 11, 12, 10, 14, 6.5], 14, ["step", ["get", "symbolrank"], 27, 9, 23, 10, 21, 12, 20]], "text-font": ["step", ["zoom"], ["literal", ["Roboto Medium", "Arial Unicode MS Regular"]], 10, ["step", ["get", "symbolrank"], ["literal", ["Roboto Bold", "Arial Unicode MS Bold"]], 5, ["literal", ["Roboto Medium", "Arial Unicode MS Regular"]]]], "text-max-width": ["interpolate", ["linear"], ["zoom"], 0, 0, 22, 0], "text-field": ["coalesce", ["get", "name_en"], ["get", "name"]], "text-line-height": 0 }, "maxzoom": 14, "filter": ["all", ["<=", ["get", "filterrank"], 3], ["==", ["get", "type"], "city"]], "type": "symbol", "source": "composite", "id": "place-city-label", "paint": { "text-color": ["interpolate", ["linear"], ["zoom"], 5, "hsl(0, 0%, 100%)", 6, "hsl(0, 0%, 100%)"], "text-halo-color": "hsla(0, 0%, 100%, 0.95)", "text-opacity": 0 }, "source-layer": "place_label" }, { "minzoom": 4, "layout": { "text-size": ["interpolate", ["linear"], ["zoom"], 4, 9.5, 9, 18], "text-transform": "uppercase", "text-font": ["Roboto Black", "Arial Unicode MS Bold"], "text-padding": 1, "text-field": ["step", ["zoom"], ["get", "abbr"], 5, ["coalesce", ["get", "name_en"], ["get", "name"]]], "text-letter-spacing": 0.2, "text-max-width": 6 }, "maxzoom": 8, "filter": ["==", ["get", "type"], "state"], "type": "symbol", "source": "composite", "id": "state-label", "paint": { "text-color": "hsl(38, 0%, 100%)", "text-halo-width": 1, "text-halo-color": "hsla(0, 0%, 100%, 0.95)", "text-opacity": 0 }, "source-layer": "place_label" }, { "minzoom": 3, "layout": { "text-field": ["coalesce", ["get", "name_en"], ["get", "name"]], "text-max-width": ["interpolate", ["linear"], ["zoom"], 0, 5, 3, 2], "text-font": ["step", ["zoom"], ["literal", ["Roboto Medium", "Arial Unicode MS Regular"]], 4, ["literal", ["Roboto Bold", "Arial Unicode MS Bold"]]], "text-size": ["interpolate", ["linear"], ["zoom"], 1, ["step", ["get", "symbolrank"], 12, 3, 10, 5, 9], 9, ["step", ["get", "symbolrank"], 35, 3, 27, 5, 22]], "text-line-height": 0 }, "maxzoom": 8, "filter": ["==", ["get", "type"], "country"], "type": "symbol", "source": "composite", "id": "country-label", "paint": { "text-halo-color": "hsla(0, 0%, 100%, 0.95)", "text-color": "hsl(0, 0%, 100%)" }, "source-layer": "place_label" }], "created": "2019-12-09T00:22:18.853Z", "id": "ck3xoymds0f7b1cp9jx6e1x0y", "modified": "2019-12-10T08:41:50.678Z", "owner": "kseniaorlova", "visibility": "public", "draft": false },
      center: [73.74919907361982, 58.03996792162444], // starting position [lng, lat]
      zoom: 2.7,
      scrollZoom: false
    })

    if (window.innerWidth < 1280) {
      map.setCenter([42.46577012499999, 59.47539133091544]);
      map.dragPan.disable();
    }

    var points = [
      {
        city: 'Санкт-Петербург',
        coordinates: [30.315868, 59.939095],
        isLarge: true
      },
      {
        city: 'Пермь',
        coordinates: [56.246723, 58.014965],
        isLarge: false
      },
      {
        city: 'Москва',
        coordinates: [37.6174943, 55.7504461],
        isLarge: true
      },
      {
        city: 'Красноярск',
        coordinates: [92.8725147, 56.0090968],
        isLarge: true
      },
      {
        city: 'Сахалин',
        coordinates: [143.02650461, 50.15947595],
        isLarge: false
      }
    ];

    var markers = [];
    var activeMarkerIndex = null;

    points.forEach(function (point, index) {
      var pinEl = document.createElement('div');
      var pinLabel = document.createElement('span');
      var pinIcon = document.createElement('div');

      pinIcon.classList = 'map-pin__icon'
      pinLabel.classList = 'map-pin__label';
      pinEl.className = 'map-pin';
      pinLabel.textContent = point.city;

      pinEl.appendChild(pinIcon);
      pinEl.appendChild(pinLabel);

      if (!point.isLarge) {
        pinEl.classList.add('map-pin--small');
      }

      /** Пин Санкт-Петербург */
      if (index === 0) {
        pinEl.classList.add('map-pin--distributor');
      }

      markers.push(pinEl);

      pinIcon.addEventListener('click', function () {
        if (activeMarkerIndex !== null) {
          markers[activeMarkerIndex].classList.toggle('map-pin--active');
        }
        activeMarkerIndex = index;
        pinEl.classList.toggle('map-pin--active');
        getRoute(points[activeMarkerIndex].coordinates);
      });

      new mapboxgl.Marker(pinEl)
        .setLngLat(point.coordinates)
        .addTo(map);
    });

    var getRoute = function (end) {
      var start = points[0].coordinates;
      var url = 'https://api.mapbox.com/directions/v5/mapbox/driving-traffic/' + start[0] + ',' + start[1] + ';' + end[0] + ',' + end[1] + '?steps=false&geometries=geojson&access_token=' + mapboxgl.accessToken;

      var req = new XMLHttpRequest();
      req.responseType = 'json';
      req.open('GET', url, true);
      req.onload = function () {
        var data = req.response.routes[0];
        var routes = data.geometry.coordinates;
        routes = routes.filter(function (route, index) {
          return index % 2 === 0 || index === routes.length - 1;
        });

        var geojson = {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: []
          }
        };

        if (map.getSource('route')) {
          map.getSource('route').setData(geojson);
        } else {
          map.addLayer({
            id: 'route',
            type: 'line',
            source: {
              type: 'geojson',
              data: {
                type: 'Feature',
                properties: {},
                geometry: {
                  type: 'LineString',
                  coordinates: []
                }
              }
            },
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': '#ffffff',
              'line-width': 1,
              'line-dasharray': [2, 2]
            }
          });
        }

        var i = 0;
        var timer = window.setInterval(function () {
          if (i < routes.length) {
            geojson.geometry.coordinates.push(routes[i]);
            map.getSource('route').setData(geojson);
            i++;
          } else {
            window.clearInterval(timer);
          }
        }, 100);

      };
      req.send();
    }

    getRoute(points[0].coordinates);
    markers[1].firstChild.click();
  };
})();
'use strict';

(function () {
  var vilanaMap;

  var mainCoords = [59.983468064100904, 30.2835555];
  var defaultZoom = 15;

  var partners = [
    {
      name: 'Офис партнера',
      coords: [59.983906405423596, 30.28480587233421]
    },

    {
      name: 'Офис партнера',
      coords: [59.98354620614924, 30.280026175869686]
    }
  ];

  var shops = [
    {
      name: 'Магазин на Приморском',
      coords: [59.983468, 30.423556]
    },

    {
      name: 'Магазин на Ленинском',
      coords: [59.852081, 30.238487]
    },

    {
      name: 'Склад',
      coords: [59.916388, 30.388515]
    },
  ];

  var contactsBlock = document.querySelector('.contacts');
  var contactsActiveClass = 'contacts__active-element';
  var windowCurrentWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  var reloadPage = function (elem, array) {
    if(!elem.classList.contains(contactsActiveClass)) {
      elem.classList.add(contactsActiveClass)
    }
    array.forEach(function (item) {
      item.classList.remove(contactsActiveClass)
    });
  };

  function initMap() {
    if (document.getElementById('map')) {
      vilanaMap = new window.ymaps.Map('map', {
        center: mainCoords,
        zoom: defaultZoom,
        controls: []
      });

      var vilanaMainPlacemark = new window.ymaps.Placemark(mainCoords, {
        hintContent: 'Главный офис компании Вилана'
      }, {
        iconLayout: 'default#image',
        iconImageHref: 'images/static/point-large.svg',
        iconImageSize: [84, 119],
        iconImageOffset: [-55, -110]
      });

      vilanaMainPlacemark.events.add('click', function () {
        vilanaMap.setCenter(mainCoords);
      });

      if (contactsBlock) {
        var officeBlock = contactsBlock.querySelector('.contacts__office');
        var officeBlockName = contactsBlock.querySelector('.contacts__office').getElementsByTagName('h2')[0];
        var shopBlocks = contactsBlock.querySelectorAll('.contacts__item');
        var shopBlocksName = contactsBlock.querySelectorAll('.contacts__item-name');
        var maxDesktopWidth = 1279;


        officeBlockName.addEventListener('click', function (ev) {
          vilanaMap.setCenter(mainCoords);

          if (windowCurrentWidth > maxDesktopWidth) {
            reloadPage(officeBlock, shopBlocks);
            /*shopBlocks.forEach(function (item) {
              item.classList.remove(contactsActiveClass)
            });
            if (!officeBlock.classList.contains(contactsActiveClass)) {
              officeBlock.classList.add(contactsActiveClass)
            }*/
          }
        });

        shopBlocksName.forEach(function (item, i) {
          item.addEventListener('click', function (evt) {
            vilanaMap.setCenter(shops[i].coords);
            if (windowCurrentWidth > maxDesktopWidth) {
              shopBlocks.forEach(function (value) {
                value.classList.remove(contactsActiveClass)
              });
              officeBlock.classList.remove(contactsActiveClass);
              var shopBlock = item.parentNode;
              if (!shopBlock.classList.contains(contactsActiveClass)) {
                shopBlock.classList.add(contactsActiveClass)
              }
            }
          })
        });

        window.addEventListener('resize', function (ev) {
            reloadPage(officeBlock, shopBlocks);
            vilanaMap.setCenter(mainCoords);
        })
      }

      var moveToCenter = function (array, j) {
        vilanaMap.setCenter(array[j].coords);
      };

      shops.forEach(function (item, i) {
        var mark = new window.ymaps.Placemark(shops[i].coords, {
          hintContent: shops[i].name
        }, {
          iconLayout: 'default#image',
          iconImageHref: 'images/static/point-large.svg',
          iconImageSize: [84, 119],
          iconImageOffset: [-55, -110]
        });
        vilanaMap.geoObjects.add(mark);

        mark.events.add('click', function () {
          moveToCenter(shops, i);
        });
      });

      partners.forEach(function (item, i) {
        var mark = new window.ymaps.Placemark(partners[i].coords, {
          hintContent: partners[i].name
        }, {
          iconLayout: 'default#image',
          iconImageHref: 'images/static/point-small.svg',
          iconImageSize: [42, 60],
          iconImageOffset: [-55, -110]
        });
        vilanaMap.geoObjects.add(mark);

        mark.events.add('click', function () {
          moveToCenter(partners, i);
        });
      });

      vilanaMap.geoObjects.add(vilanaMainPlacemark);
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    window.ymaps.ready(initMap);
  });
})();
'use strict';

(function () {

  function NumberInput(container, min, max, step, label) {
    var currentValue = null;

    this.min = min;
    this.max = max;
    this.step = step;
    this.label = label;
    this.container = container;

    if (this.container) {
      this.inputField = this.container.querySelector('.number-input__input');
      this.incrementButton = this.container.querySelector('.number-input__button--inc');
      this.decrementButton = this.container.querySelector('.number-input__button--dec');

      if (this.inputField) {
        currentValue = parseInt(this.inputField.value, 10);
      }
    }

    this.currentValue = currentValue || this.min;

    if (this.inputField) {
      this.mask = window.IMask(
        this.inputField, {
        mask: 'num {' + label + '}',
        lazy: false,
        blocks: {
          num: {
            mask: Number,
            min: min,
            max: max
          }
        }
      }
      )
    }
  }

  NumberInput.prototype.init = function () {
    if (!this.container) {
      return;
    }

    this.setValue(this.currentValue);

    this.incrementButton.addEventListener('click', this.incrementValue.bind(this));
    this.decrementButton.addEventListener('click', this.decrementValue.bind(this));

    this.inputField.addEventListener('input', this.inputChanged.bind(this))
  };

  NumberInput.prototype.onChange = function () {
    if (this.inputField) {
      this.inputField.dispatchEvent(new Event('change'));
    }
  };

  NumberInput.prototype.setButtonsAccessibility = function () {
    var isValidIncrement = this.isValidIncrement();
    var isValidDecrement = this.isValidDecrement();
    this.incrementButton.disabled = !isValidIncrement || '';
    this.decrementButton.disabled = !isValidDecrement || '';
  };

  NumberInput.prototype.setValue = function (value) {
    this.inputField.value = value + ' ' + this.label;
    this.currentValue = value;
    this.mask.updateValue(value);
    this.setButtonsAccessibility();
    this.onChange();
  };

  NumberInput.prototype.isValidIncrement = function () {
    if (this.currentValue === '') {
      return false;
    }
    return this.currentValue + this.step <= this.max;
  };

  NumberInput.prototype.isValidDecrement = function () {
    if (this.currentValue === '') {
      return false;
    }
    return this.currentValue - this.step >= this.min;
  };

  NumberInput.prototype.incrementValue = function () {
    if (this.isValidIncrement()) {
      this.currentValue += this.step;
      this.setValue(this.currentValue);
    }
  };

  NumberInput.prototype.decrementValue = function () {
    if (this.isValidDecrement()) {
      this.currentValue -= this.step;
      this.setValue(this.currentValue);
    }
  };

  NumberInput.prototype.inputChanged = function () {
    this.setValue(parseInt(this.inputField.value) || '');
  };

  window.NumberInput = NumberInput;


  var squareContainer = document.querySelector('.price-calculator__square-wrapper');
  if (squareContainer) {
    var squareInputNumber = new NumberInput(squareContainer, 1, Infinity, 1, 'м²');
    squareInputNumber.init();
  }

  var quantityContainer = document.querySelector('.price-calculator__base-settings-wrapper');
  if (quantityContainer) {
    var quantityInputNumber = new NumberInput(quantityContainer, 1, Infinity, 1, 'шт.');
    quantityInputNumber.init();
  }

})();
'use strict';

(function () {
  var openers = document.querySelectorAll('.opener');

  if (openers) {
    openers.forEach(function (opener) {
      opener.addEventListener('click', function (evt) {
        evt.preventDefault();
        opener.classList.toggle('opener--opened');     
      });
    });
  }
})();
'use strict';

(function () {
  var signinButton = document.querySelector('.authorisation__button');
  var popupSignin = document.querySelector('.popup-signin');
  var orderForm = document.querySelector('.order-form__form');
  var orderName = document.getElementById('order-name');
  var orderEmail = document.getElementById('order-email');
  var orderPhone = document.getElementById('order-tel');
  var orderCheckbox = document.getElementById('order-personal-data');
  var orderCheckboxLabel = null;
  var hrefOrderPlaced = 'order-placed.html';

  if (orderForm) {
    orderCheckboxLabel = orderForm.querySelector('.checkbox-row__label');
  }


  if (signinButton) {
    signinButton.addEventListener('click', function () {
      if (popupSignin) {
        window.openPopup(popupSignin);
      }
    });
  }

  if (orderForm) {
    orderForm.addEventListener('input', function (event) {
      if (event.target.type === 'checkbox') {
        event.target.nextElementSibling.classList.toggle(window.checkboxErrorClass, false);
      } else {
        window.resetError(event);
      }
    });

    window.createPhoneMask(orderPhone, false);

    orderForm.addEventListener('submit', function (event) {
      window.toggleInputError(orderName);
      window.toggleEmailError(orderEmail);
      window.togglePhoneError(orderPhone);
      window.toggleCheckboxError(orderCheckbox, orderCheckboxLabel);

      if (
        !orderName.value
        || !window.MASK_NAME.test(orderName.value)
        || !window.MASK_EMAIL.test(orderEmail.value)
        || orderPhone.value.length < 1
        || window.phoneErrorSymbol.test(orderPhone.value)
        || !orderCheckbox.checked
      ) {
        event.preventDefault();
        return;
      }

      window.location = hrefOrderPlaced;
    });
  }
})();
'use strict';

(function () {
  var ESC_CODE = 27;

  var scrollY;
  var activePopup;
  var body = document.querySelector('body');
  var popupsClose = document.querySelectorAll('.popup__close');

  var lockBody = function () {
    scrollY = window.scrollY;
    body.style.top = '-' + scrollY + 'px';
    body.style.position = 'fixed';
    body.style.width = '100%';
  };

  var unlockBody = function () {
    body.style.top = '';
    body.style.position = '';
    body.style.width = '';
    window.scrollTo(0, parseInt(scrollY || '0', 10));
  };

  var closePopup = function (popup) {
    popup.classList.remove('popup--show');
    popup.classList.remove('overlay--show');
    unlockBody();
    activePopup = null;
  };

  var openPopup = function (popup) {
    closeActivePopup();
    popup.classList.add('popup--show');
    popup.classList.add('overlay--show');
    lockBody();
    activePopup = popup;
  };

  var closeActivePopup = function (event) {
    if (event) {
      event.preventDefault();
    }
    if (activePopup) {
      closePopup(activePopup);
    }
  };

  if (popupsClose) {
    for (var i = 0; i < popupsClose.length; i++) {
      popupsClose[i].addEventListener('click', closeActivePopup);
    }
  }

  window.addEventListener('keydown', function (event) {
    if (event.keyCode === ESC_CODE) {
      closeActivePopup(event);
    }
  });

  body.addEventListener('click', function (event) {
    if (event.target.classList.contains('overlay')) {
      closeActivePopup(event);
    }
  });

  window.openPopup = openPopup;
  window.closePopup = closeActivePopup;
  window.lockBody = lockBody;
  window.unlockBody = unlockBody;
})();
'use strict';

(function () {
  /** Переключение режима редактирования полей */
  var profileInfoContainer = document.querySelector('.profile-info');

  if (profileInfoContainer) {
    var editButtons = Array.from(profileInfoContainer.querySelectorAll('.profile-info__edit-btn'));
    var inputGroups = Array.from(profileInfoContainer.querySelectorAll('.profile-info__form-group'));
    var VIEW_MODE_CLASS = 'profile-info__form-group--view-mode';

    editButtons.forEach(function (button, index) {
      button.addEventListener('click', onEditButtonClicked.bind(null, index));
    });
    var profileForm = document.querySelector('.profile-info__form');

    var profileEmail = profileForm.querySelector('#email');
    var profileName = profileForm.querySelector('#name');
    var profileLastname = profileForm.querySelector('#lastname');
    var profilePhone = profileForm.querySelector('#phone');
    var profileBirthday = profileForm.querySelector('#birthday');

    var profilePassword = profileForm.querySelector('#password');
    var profileRepeatPassword = profileForm.querySelector('#repeat-password');

    profileForm.addEventListener('input', function (event) {
        window.resetError(event);
    });


    profileForm.addEventListener('submit', function (event) {
      event.preventDefault();
      window.toggleEmailError(profileEmail);
      window.toggleInputError(profileName);
      window.toggleInputError(profileLastname);
      window.togglePhoneError(profilePhone);
      window.toggleDateError(profileBirthday);
      window.togglePasswordError(profilePassword);
      window.toggleRepeatPasswordError(profilePassword, profileRepeatPassword);
    })
  }

  function onEditButtonClicked(index) {
    inputGroups[index].classList.toggle(VIEW_MODE_CLASS);
  }
})();
'use strict';

(function () {
  var MOBILE_SIZE = 768;

  var openButtons = document.querySelectorAll('.order-data__open');
  var closeButtons = document.querySelectorAll('.order-data__close');
  var cancelButtons = document.querySelectorAll('.order-data__cancel');
  var tabs = document.querySelectorAll('.order-data__wrapper-order-data');
  var firstDropDownList = document.querySelector('.order-data__ordered-product');
  var firstDropDownOrderData = document.querySelector('.order-data__wrapper-row');
  var popupCancellationQuestion = document.querySelector('.popup-cancellation-question');
  var popupCancellationConfirmation = document.querySelector('.popup-cancellation-confirmation');
  if (popupCancellationQuestion) {
    var buttonSave = popupCancellationQuestion.querySelector('.popup-cancellation-question__save');
    var buttonCancel = popupCancellationQuestion.querySelector('.popup-cancellation-question__cancel');
  }

  var openBlock = function (nameBlock, addClass) {
    nameBlock.style.maxHeight = nameBlock.scrollHeight + 'px';
    nameBlock.classList.add(addClass);
  }

  var closeBlock = function (nameBlock, removeClass) {
    nameBlock.style.maxHeight = null;
    nameBlock.classList.remove(removeClass);
  }
  
  var openButtonClickHandler = function (event) {
    var item = event.target.closest('.order-data__item');

    if (item) {
      var dropDownList = item.querySelector('.order-data__ordered-product');
      var closeButton = item.querySelector('.order-data__close');
      var openButton = item.querySelector('.order-data__open');

      if (dropDownList && closeButton && openButton) {
        if (window.innerWidth < MOBILE_SIZE) {
          return;
        } else {
          if (dropDownList.style.maxHeight) {
            closeBlock(dropDownList, 'ordered-product--open');
          } else {
            openBlock(dropDownList, 'ordered-product--open');
          }
          closeButton.classList.toggle('order-data__close--visible');
          openButton.classList.toggle('order-data__open--hidden');
        }
      }
    }
  }

  var tabClickHandler = function (event) {
    var item = event.target.closest('.order-data__item');

    if (item) {
      var dropDownList = item.querySelector('.order-data__ordered-product');
      var closeButton = item.querySelector('.order-data__close');
      var openButton = item.querySelector('.order-data__open');
      var dropDownOrderData = item.querySelector('.order-data__wrapper-row');
      if (dropDownOrderData && dropDownList && closeButton && openButton) {
        if (dropDownList.style.maxHeight && dropDownOrderData.style.maxHeight) {
          closeBlock(dropDownOrderData, 'order-data__wrapper-row--open');
          closeBlock(dropDownList, 'ordered-product--open');
          closeBlock(closeButton, 'order-data__close--visible');
        } else {
          openBlock(dropDownOrderData, 'order-data__wrapper-row--open');
          openBlock(dropDownList, 'ordered-product--open');
          openBlock(closeButton, 'order-data__close--visible');
        }
        openButton.classList.toggle('order-data__open--hidden');
      }
    }
  }

  for (var i = 0; i < openButtons.length; i++) {
    openButtons[i].addEventListener('click', openButtonClickHandler);
    closeButtons[i].addEventListener('click', openButtonClickHandler);
  }

  if (tabs && window.innerWidth < MOBILE_SIZE) {
    for (var j = 0; j < openButtons.length; j++) {
      openButtons[j].addEventListener('click', tabClickHandler);
      tabs[j].addEventListener('click', tabClickHandler);
      closeButtons[j].addEventListener('click', tabClickHandler);
    }
  }

  if (window.innerWidth < MOBILE_SIZE && firstDropDownOrderData) {
    openBlock(firstDropDownOrderData, 'order-data__wrapper-row--open');
  }

  if (firstDropDownList) {
    openBlock(firstDropDownList, 'ordered-product--open');
  }

  if (openButtons.length) {
    openButtons[0].classList.add('order-data__open--hidden');
  }

  if (closeButtons.length) {
    if (window.innerWidth < MOBILE_SIZE) {
      openBlock(closeButtons[0], 'order-data__close--visible');
    } else {
      closeButtons[0].classList.add('order-data__close--visible');
    }
  }

  if (cancelButtons) {
    for (var i = 0; i < cancelButtons.length; i++) {
      cancelButtons[i].addEventListener('click', function () {
        if (popupCancellationQuestion) {
          window.openPopup(popupCancellationQuestion);
        }
      })
    }
  }
  
  if (buttonSave) {
    buttonSave.addEventListener('click', function () {
      window.closePopup();
    })
  }

  if (buttonCancel) {
    buttonCancel.addEventListener('click', function () {
      window.openPopup(popupCancellationConfirmation);
    })
  }

})();
'use strict';

(function () {
  var registryForm = document.querySelector('.registry__form');

  if (registryForm) {
    var registryName = registryForm.querySelector('#name');
    var registryLastname = registryForm.querySelector('#lastname');
    var registryEmail = registryForm.querySelector('#email');
    var registryPhone = registryForm.querySelector('#phone');
    var registryAgreement = registryForm.querySelector('#registry-agreement');
    var registryAgreementLabel;
    var registryPassword = registryForm.querySelector('#password');
    var registryRepeatPassword = registryForm.querySelector('#repeat-password');

    if (registryAgreement) {
      registryAgreementLabel = registryAgreement.nextElementSibling;
    }

    registryForm.addEventListener('input', function (event) {
      if (event.target.type === 'checkbox') {
        event.target.nextElementSibling.classList.toggle(window.checkboxErrorClass, false);
      } else {
        window.resetError(event);
      }
    });

    window.createPhoneMask(registryPhone, false);

    registryForm.addEventListener('submit', function (event) {
      event.preventDefault();
      window.toggleEmailError(registryEmail);
      window.toggleInputError(registryName);
      window.toggleInputError(registryLastname);
      window.togglePhoneError(registryPhone);
      window.togglePasswordError(registryPassword);
      window.toggleRepeatPasswordError(registryPassword, registryRepeatPassword);
      window.toggleCheckboxError(registryAgreement, registryAgreementLabel);
    })
  }
})();
'use strict';

(function () {
  var menuList = document.querySelector('.profile-menu__list');
  var menuToggle = document.querySelector('.profile-menu__toggle');
  var ACTIVE_MENU_CLASS = 'profile-menu__list--active';
  var ACTIVE_TOGGLE_CLASS = 'profile-menu__toggle--active';

  if (menuList && menuToggle) {
    menuToggle.addEventListener('click', function () {
      menuList.classList.toggle(ACTIVE_MENU_CLASS);
      menuToggle.classList.toggle(ACTIVE_TOGGLE_CLASS);

      if (menuList.classList.contains(ACTIVE_MENU_CLASS)) {
        document.addEventListener('click', onOutsideMenuClicked);
      } else {
        document.removeEventListener('click', onOutsideMenuClicked);
      }
    });
  }

  function onOutsideMenuClicked(e) {
    if (!e.target.closest('.profile-menu__list-wrapper')) {
      menuList.classList.remove(ACTIVE_MENU_CLASS);
    }
  }
})();
'use strict';

(function () {
  var schemeBlock = document.querySelectorAll('.scheme__item');
  var PROP_NAME = 'transform';
  var PROP_VALUE = 'translateX(-';
  var UNIT = 'px)';
  var ROW_WIDTH = 1200;
  var tabletWidth = 768;

  var classes = {
    transpRight: 'scheme__item-wrapper--transparence-right',
    transpLeft: 'scheme__item-wrapper--transparence-left',
    arrowHide: 'scheme__arrow--hidden'
  };

  var windowWidth;
  var innerWidth;
  var windowPadding;
  var stepNumber;
  var step;

  var initialPoint;
  var finalPoint;
  var touchMove = false;

  var counts = [];


  var fillArray = function () {
    for (var i = 0; i < schemeBlock.length; i++) {
      counts.push(0);
    }
  };

  fillArray();

  var toggleClass = function (block, classN) {
    block.classList.toggle(classN);
  };

  var changeTransformProperty = function (collection, distance, n, i) {
    collection.forEach(function (row) {
      row.style.setProperty(PROP_NAME, PROP_VALUE + (n[i] * distance).toString() + UNIT);
    });
  };

  var init = function () {
    windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

    if (windowWidth >= tabletWidth) {
      windowPadding = 30;
      innerWidth = windowWidth - 2 * windowPadding;
      step = (ROW_WIDTH - innerWidth);
      stepNumber = 1;
    }

    if (windowWidth < tabletWidth) {
      windowPadding = 12;
      innerWidth = windowWidth - 2 * windowPadding;
      stepNumber = Math.ceil(ROW_WIDTH / innerWidth);
      step = (ROW_WIDTH - innerWidth) / stepNumber;
    }
  };

  var changeColumnsPosition = function (elem, distance) {
    elem.style.setProperty(PROP_NAME, PROP_VALUE + distance + UNIT);
  };

  var moveRow = function (collection, distance, num, i, isLeft) {
    if (isLeft) {
      if (num[i] > 0) {
        num[i]--;
        changeTransformProperty(collection, distance, num, i);
      }
    } else {
      if (num[i] < stepNumber) {
        num[i]++;
        changeTransformProperty(collection, distance, num, i);
      }
    }
  };

  var toggleElements = function (element, arrowLeft, arrowRight, num, i, isLeft) {
    if (isLeft) {
      if (num[i] === (stepNumber - 1)) {
        element.classList.add(classes.transpRight);
        arrowRight.classList.remove(classes.arrowHide);
      }
      if (num[i] === 0) {
        element.classList.remove(classes.transpLeft);
        arrowLeft.classList.add(classes.arrowHide);
      }
    } else {
      if (num[i] === stepNumber) {
        element.classList.remove(classes.transpRight);
        arrowRight.classList.add(classes.arrowHide);
      }

      if (num[i] === 1) {
        element.classList.add(classes.transpLeft);
        arrowLeft.classList.remove(classes.arrowHide);
      }
    }

  };

  init();

  if (schemeBlock) {

    var schemeAddButtons = document.querySelectorAll('.scheme__footer-right .btn');
    setTimeout(function () {
      if (schemeAddButtons) {
        for (var i = 0; i < schemeAddButtons.length; i++) {
          window.switchCartButtonState(schemeAddButtons[i], 'btn--green', 'scheme__in-cart-btn');
        }
      }
    }, 100);

    schemeBlock.forEach(function (item, i) {

      var schemeCardContent = item.querySelector('.scheme__content');
      var schemeOpenButton = item.querySelector('.scheme__open');
      var schemeColumns = item.querySelector('.scheme__columns');
      var schemeWrapper = item.querySelector('.scheme__item-wrapper');

      schemeOpenButton.addEventListener('click', function (evt) {
        evt.preventDefault();
        toggleClass(schemeWrapper, 'scheme__item-wrapper--opened');
        toggleClass(schemeWrapper, 'scheme__item-wrapper--closed');
        toggleClass(schemeOpenButton, 'scheme__open--switched');
      });

      /*var showMoreButton = document.querySelector('.scheme__show-button');
      showMoreButton.addEventListener('click', function () {

        schemeWrapper.classList.remove('scheme__item-wrapper--opened');
        schemeWrapper.classList.remove('scheme__item-wrapper--closed');
        schemeWrapper.classList.add('scheme__content--closed');
      });*/

      var schemeArrowLeft = schemeWrapper.querySelector('.scheme__arrow--left');
      var schemeArrowRight = schemeWrapper.querySelector('.scheme__arrow--right');
      var schemeRow = schemeCardContent.querySelectorAll('.scheme__row');

      schemeArrowRight.addEventListener('click', function () {
        moveRow(schemeRow, step, counts, i, false);
        toggleElements(schemeWrapper, schemeArrowLeft, schemeArrowRight, counts, i, false);
        changeColumnsPosition(schemeColumns, step);
      });
      schemeArrowLeft.addEventListener('click', function () {
        moveRow(schemeRow, step, counts, i, true);
        toggleElements(schemeWrapper, schemeArrowLeft, schemeArrowRight, counts, i, true);
        changeColumnsPosition(schemeColumns, '0');
      });

      schemeWrapper.addEventListener('touchstart', function (event) {
        initialPoint = event.changedTouches[0];
      }, false);
      schemeWrapper.addEventListener('touchmove', function (event) {
        touchMove = true;
      }, false);
      schemeWrapper.addEventListener('touchend', function (event) {
        if (touchMove) {
          finalPoint = event.changedTouches[0];
          var xAbs = Math.abs(initialPoint.pageX - finalPoint.pageX);
          var yAbs = Math.abs(initialPoint.pageY - finalPoint.pageY);
          if (xAbs > 10 || yAbs < 10) {
            if (finalPoint.pageX < initialPoint.pageX) {
              moveRow(schemeRow, step, counts, i, false);
              toggleElements(schemeWrapper, schemeArrowLeft, schemeArrowRight, counts, i, false);
              changeColumnsPosition(schemeColumns, step);
            } else {
              moveRow(schemeRow, step, counts, i, true);
              toggleElements(schemeWrapper, schemeArrowLeft, schemeArrowRight, counts, i, true);
              changeColumnsPosition(schemeColumns, '0');
            }
          }
        }
        touchMove = false;
      }, false);
    });
    window.addEventListener('resize', init);
  }

  window.toggleClass = toggleClass;

})();
'use strict';

(function () {
  var multiSelects = document.querySelectorAll('.select');
  var checkboxesMultiSelect = document.querySelectorAll('.select__checkbox');
  var titlesMultiSelect = document.querySelectorAll('.select__title');
  var checkboxesSingleSelect = document.querySelectorAll('.single-select__checkbox-invisible');
  var titlesSingleSelect = document.querySelectorAll('.single-select__value');
  var singleOptionList = document.querySelectorAll('.single-select__variants-list');


  var countSelectedCheckbox = function (select) {
    var checkboxList = select.querySelector('.select__list');
    var selectTitle = select.querySelector('.select__title');

    if (checkboxList) {
      checkboxList.addEventListener('change', function (event) {
        var count = parseInt(selectTitle.getAttribute('data-count') || 0, 10);

        count += event.target.checked ? 1 : -1;

        selectTitle.setAttribute('data-count', count ? count : '');
      });
    }
  };

  for (var i = 0; i < multiSelects.length; i++) {
    countSelectedCheckbox(multiSelects[i]);
  }

  var toggleSelectState = function (select, checkboxClass, labelClass, checkboxList, lablesList) {
    var checkbox = null;
    var selectTitle = null;

    if (select) {
      checkbox = select.querySelector('.' + checkboxClass);
      selectTitle = select.querySelector('.' + labelClass);
      if (selectTitle) {
        selectTitle.style = 'z-index: 2';
      }
    }

    for (var j = 0; j < checkboxList.length; j++) {
      if (checkboxList[j] !== checkbox) {
        checkboxList[j].checked = false;
        lablesList[j].style = 'z-index: 0';
      }
    }
  };

  document.addEventListener('click', function (event) {
    var multiSelect = event.target.closest('.select');
    var singleSelect = event.target.closest('.single-select');

    toggleSelectState(
        multiSelect,
        'select__checkbox',
        'select__title',
        checkboxesMultiSelect,
        titlesMultiSelect
    );
    toggleSelectState(
        singleSelect,
        'single-select__checkbox-invisible',
        'single-select__value',
        checkboxesSingleSelect,
        titlesSingleSelect
    );
  });

  for (var k = 0; k < singleOptionList.length; k++) {
    singleOptionList[k].addEventListener('change', function (event) {
      if (event.target.checked) {
        var volumeSelect = event.target.closest('.single-select');

        if (volumeSelect) {
          var volumeSelectTitle = volumeSelect.querySelector('.single-select__value');
          var volumeSelectInput = volumeSelect.querySelector('.single-select__checkbox-invisible');

          if (volumeSelectTitle) {
            volumeSelectTitle.innerHTML = event.target.value + ' л';
            volumeSelectTitle.style = 'z-index: 0';
          }

          if (volumeSelectInput) {
            volumeSelectInput.checked = false;
          }
        }
      }
    });
  }
})();
'use strict';

(function () {
  var switchCartButtonState = function (button, removeClass, addedClass) {
    button.addEventListener('click', function (event) {
      event.target.classList.remove(removeClass);
      event.target.classList.add(addedClass);
      event.target.innerHTML = 'В корзине';

      var tooltip = document.querySelector('.cart-tooltip');

      if(tooltip){
        tooltip.classList.add('cart-tooltip--active');

        setTimeout(function(){
          tooltip.classList.remove('cart-tooltip--active');
        }, 2000)
      }
    });
  };

  window.switchCartButtonState = switchCartButtonState;
})();
'use strict';

(function () {
  var callButton = document.querySelector('.choose-color__call-button');
  var popupTech = document.querySelector('.popup-technologist');
  var popupThx = document.querySelector('.popup-thx');
  var popupTechForm = document.querySelector('.popup-technologist__form');
  var popupTechName = document.getElementById('tech-name');
  var popupTechPhone = document.getElementById('tech-tel');
  var popupTechEmail = document.getElementById('tech-email');
  var popupTechAdress = document.getElementById('tech-adress');
  var popupTechDate = document.getElementById('tech-date');
  var popupTechCheckbox = document.getElementById('tech-personal-data');
  var popupTechCheckboxLabel = null;

  /*var toggleDateError = function (input) {
    if (!MASK_DATE.test(input.value)) {
      input.classList.toggle(window.inputErrorClass, true);
      changeErrorMessage(input, 'Некорректный формат даты');
    }
  };*/

  if (popupTech) {
    popupTechCheckboxLabel = popupTech.querySelector('.checkbox-row__label');
  }

  if (callButton) {
    callButton.addEventListener('click', function () {
      if (popupTech) {
        window.openPopup(popupTech);
      }
    });
  }

  if (popupTech) {
    popupTech.addEventListener('input', function (event) {
      if (event.target.type === 'checkbox') {
        event.target.nextElementSibling.classList.toggle(window.checkboxErrorClass, false);
      } else {
        window.resetError(event);
      }
    });

    window.createPhoneMask(popupTechPhone, false);
    /*window.createDateMask(popupTechDate, 1, 2);*/

    popupTechForm.addEventListener('submit', function (event) {
      window.toggleInputError(popupTechName);
      window.togglePhoneError(popupTechPhone);
      window.toggleEmailError(popupTechEmail);
      window.toggleEmptyFieldError(popupTechAdress);
      window.toggleDateError(popupTechDate);
      window.toggleCheckboxError(popupTechCheckbox, popupTechCheckboxLabel);

      if (
        !popupTechName.value
        || !window.MASK_NAME.test(popupTechName.value)
        || !window.MASK_EMAIL.test(popupTechEmail.value)
        || popupTechPhone.value.length < 1
        || window.phoneErrorSymbol.test(popupTechPhone.value)
        || popupTechAdress.value.length < 1
        || !window.MASK_DATE.test(popupTechDate.value)
        || !popupTechCheckbox.checked
      ) {
        event.preventDefault();
        return;
      }

      if (popupThx) {
        window.openPopup(popupThx);
        window.closePopupThx(popupThx);
      } else {
        window.closePopup();
      }
    });
  }
})();
'use strict';

(function () {
  var vacanciesBlock = document.querySelectorAll('.vacancies__item');
  var vacanciesFormBlock = document.querySelector('.vacancies__form');
  var fileEnding = /\.(pdf|txt|doc?x)$/i;
  var blockErrorClass = 'vacancies__input-row--upload-error';
  var selectErrorClass = 'vacancies__input-row--select-error';
  var phoneCharacterSymbol = /_/;

  /*var togglePhoneError = function (input) {
    if (phoneCharacterSymbol.test(input.value)) {
      input.classList.toggle(inputErrorClass, true);
      input.setCustomValidity('Введите валидный телефон');
    }
  };*/

  var toggleUploadError = function (upload, uploadBlock) {
    if (upload.value.length < 1) {
      uploadBlock.classList.toggle(blockErrorClass, true);
      window.changeErrorMessage(upload, 'Загрузите файл');
    }
  };

  var toggleSelectError = function (select, selectBlock) {
    if (select.value === '0') {
      selectBlock.classList.toggle(selectErrorClass, true);
      window.changeErrorMessage(select, 'Выберите вакансию');
    }
  };

  if (vacanciesBlock) {
    vacanciesBlock.forEach(function (item, i) {
      var vacancyOpenButton = item.querySelector('.vacancies__open-button');
      var vacancyWrapper = item.querySelector('.vacancies__item-wrapper');
      var vacancyNameBlock = item.querySelector('.vacancies__item-name');

      vacancyNameBlock.addEventListener('click', function (evt) {
        evt.preventDefault();
        window.toggleClass(vacancyWrapper, 'vacancies__item-wrapper--opened');
        window.toggleClass(vacancyWrapper, 'vacancies__item-wrapper--closed');
        window.toggleClass(vacancyOpenButton, 'vacancies__open-button--closed');
      });
    })
  }

  if (vacanciesFormBlock) {
    vacanciesFormBlock.addEventListener('input', function (event) {
      window.resetError(event)
    });

    var vacanciesNameField = document.getElementById('vac-name');
    var vacanciesMailField = document.getElementById('vac-email');
    var vacanciesPhoneField = document.getElementById('vac-tel');

    var vacanciesUploadBlock = document.querySelector('.vacancies__input-row--upload');
    var vacanciesUploadField = document.getElementById('vac-upload');
    var vacanciesUploadLabel = document.getElementById('vac-upload-label');

    var vacanciesSelectBlock = document.querySelector('.vacancies__input-row--select');
    var vacanciesSelectField = document.getElementById('vac-select');


    window.createPhoneMask(vacanciesPhoneField, false);

    vacanciesUploadField.addEventListener('change', function (evt) {
      evt.preventDefault();
      vacanciesUploadBlock.classList.remove(blockErrorClass);
      var file = vacanciesUploadField.files[0];
      var fileName = file.name.toLowerCase();

      if (fileEnding.test(fileName)) {
        vacanciesUploadLabel.textContent = fileName;
      } else {
        vacanciesUploadBlock.classList.toggle(blockErrorClass, true);
        window.changeErrorMessage(vacanciesUploadField, 'Неверный формат файла!');
      }
    });

    vacanciesSelectField.addEventListener('change', function (evt) {
      evt.preventDefault();
      vacanciesSelectBlock.classList.remove(selectErrorClass);
    });

    vacanciesFormBlock.addEventListener('submit', function (event) {
      window.toggleInputError(vacanciesNameField);
      window.toggleEmailError(vacanciesMailField);
      window.togglePhoneError(vacanciesPhoneField);
      toggleUploadError(vacanciesUploadField, vacanciesUploadBlock);
      toggleSelectError(vacanciesSelectField, vacanciesSelectBlock);


      if (
        !vacanciesNameField.value
        || !window.MASK_NAME.test(vacanciesNameField.value)
        || vacanciesSelectField.value === '0'
        || !window.MASK_EMAIL.test(vacanciesMailField.value)
        || vacanciesPhoneField.value.length < 1
        || window.phoneErrorSymbol.test(vacanciesPhoneField.value)
        || vacanciesUploadField.value.length < 1

      ) {
        event.preventDefault();
        return;
      }

      event.preventDefault();
    });
  }


})();
'use strict';

(function () {

  var searchInput = document.getElementById('search');
  var searchPlaceholder = document.querySelector('.search-header__form-placeholder');
  var searchHideBlock = document.querySelector('.search-header__form-hide');
  var searchBackgroundValue = 'url(\'images/static/search-gray.svg\')';
  var searchPlaceholderValue = 'Что будем искать?';

  if (searchInput) {
    searchPlaceholder.addEventListener('click', function (evt) {
      searchInput.focus();
    });
    searchHideBlock.addEventListener('click', function (evt) {
      searchInput.focus();
    });
    searchInput.addEventListener('input', function (ev) {
      searchInput.style.setProperty('background-image', 'none');
      searchPlaceholder.textContent = '';
      if (searchInput.value.length === 0) {
        searchInput.style.setProperty('background-image', searchBackgroundValue);
        searchPlaceholder.textContent = searchPlaceholderValue;
      }
    })
  }
})();
'use strict';

(function () {
  var container = document.querySelector('.docs');

  if (container) {

    /** Меню табы */
    var menuTitles = Array.from(container.querySelectorAll('.docs__menu-title'));
    var menuGroups = Array.from(container.querySelectorAll('.docs__group'));
    var menuActiveClass = 'docs__menu-title--active';
    var menuActiveGroupClass = 'docs__group--active';
    var menuActiveIndex = 0;

    menuTitles.forEach(function (button, index) {
      return button.addEventListener('click', function () {
        menuTitles[menuActiveIndex].classList.remove(menuActiveClass);
        menuGroups[menuActiveIndex].classList.remove(menuActiveGroupClass);

        menuActiveIndex = index;

        menuTitles[menuActiveIndex].classList.add(menuActiveClass);
        menuGroups[menuActiveIndex].classList.add(menuActiveGroupClass);
      });
    })

    /** Меню слайдер */
    var menuWrapper = container.querySelector('.docs__menu-wrapper');
    var menuList = container.querySelector('.docs__menu');
    var menuItems = Array.from(menuList.querySelectorAll('.docs__menu-item'));

    menuWrapper.classList.add('swiper-container');
    menuList.classList.add('swiper-wrapper');
    menuItems.forEach(function (menuItem) {
      menuItem.classList.add('swiper-slide');
    })

    var menuSwiper = new Swiper('.swiper-container', {
      slidesPerView: 'auto',
      allowTouchMove: false,
      breakpoints: {
        320: {
          allowTouchMove: true
        },
        768: {
          allowTouchMove: false
        }
      }
    });

    /** Аккордион */
    var accordionToggles = Array.from(container.querySelectorAll('.docs__accordion-toggle'));
    var accordionContents = Array.from(container.querySelectorAll('.docs__accordion-content'));
    var accordionToggleActiveClass = 'docs__accordion-toggle--active';
    var currentAccordionIndex = null;

    accordionToggles.forEach(function (toggle, index) {
      toggle.addEventListener('click', function () {

        if (currentAccordionIndex !== null && currentAccordionIndex !== index) {
          accordionContents[currentAccordionIndex].style.maxHeight = '';
          accordionToggles[currentAccordionIndex].classList.remove(accordionToggleActiveClass);
        }

        var content = accordionContents[index];
        accordionToggles[index].classList.toggle(accordionToggleActiveClass);

        if (content.style.maxHeight) {
          content.style.maxHeight = '';
          currentAccordionIndex = null;
        } else {
          content.style.maxHeight = content.scrollHeight + 'px';
          currentAccordionIndex = index;
        }
      });
    })

    window.onresize = function () {
      if (currentAccordionIndex === null) {
        return;
      }
      accordionToggles[currentAccordionIndex].click();
    }
  }
})();
'use strict';

(function () {
  var popupPaid = document.querySelector('.popup-paid');


  if (popupPaid) {
    window.openPopup(popupPaid);
  }
})();
'use strict';

(function () {

  var popupRequest = document.querySelector('.popup-request');
  var popupRequestName = document.getElementById('request-name');
  var popupRequestEmail = document.getElementById('request-email');
  var popupRequestPhone = document.getElementById('request-tel');
  var popupRequestCheckbox = document.getElementById('request-personal-data');
  var popupRequestCheckboxLabel = null;

  var popupThx = document.querySelector('.popup-thx');

  if (popupRequest) {
    popupRequestCheckboxLabel = popupRequest.querySelector('.checkbox-row__label');

    popupRequest.addEventListener('input', function (event) {
      if (event.target.type === 'checkbox') {
        event.target.nextElementSibling.classList.toggle(window.checkboxErrorClass, false);
      } else {
        window.resetError(event);
      }
    });

    window.createPhoneMask(popupRequestPhone, false);

    popupRequest.addEventListener('submit', function (event) {
      window.toggleInputError(popupRequestName);
      window.toggleEmailError(popupRequestEmail);
      window.togglePhoneError(popupRequestPhone);
      window.toggleCheckboxError(popupRequestCheckbox, popupRequestCheckboxLabel);

      if (
        !popupRequestName.value
        || !window.MASK_NAME.test(popupRequestName.value)
        || !window.MASK_EMAIL.test(popupRequestEmail.value)
        || popupRequestPhone.value.length < 1
        || window.phoneErrorSymbol.test(popupRequestPhone.value)
        || !popupRequestCheckbox.checked
      ) {
        event.preventDefault();
        return;
      }

      event.preventDefault();
      window.openPopup(popupThx);
      window.closePopupThx(popupThx);
    });
  }
})();
'use strict';

(function () {
  var popupPromo = document.querySelector('.popup-promocode');


  if (popupPromo) {
    window.openPopup(popupPromo);

    var popupPromoForm = document.querySelector('.popup-promocode__form');
    var popupPromoInput = document.getElementById('promocode-field');

    popupPromoForm.addEventListener('input', function (event) {
      window.resetError(event)
    });

    popupPromoForm.addEventListener('submit', function (event) {
      window.toggleInputError(popupPromoInput);

      if ( popupPromoInput.value.length < 1) {
        event.preventDefault();
        return;
      }

      event.preventDefault();
      popupPromo.classList.remove('popup--show');
      popupPromo.classList.remove('overlay--show');
      unlockBody();
    });
  }
})();
'use strict';

(function () {
  var personalSolutionForm = document.querySelector('.personal-solution__form');

  if (personalSolutionForm) {
    var personalSolutionName = personalSolutionForm.querySelector('#name');
    var personalSolutionPhone = personalSolutionForm.querySelector('#phone');
    var personalSolutionEmail = personalSolutionForm.querySelector('#email');
    var personalSolutionButton = personalSolutionForm.querySelector('.personal-solution__form-button');

    personalSolutionForm.addEventListener('input', function (event) {
        window.resetError(event);
    });

    personalSolutionForm.addEventListener('submit', function (event) {
      event.preventDefault();
      window.toggleInputError(personalSolutionName);
      window.toggleEmailError(personalSolutionEmail);
      window.togglePhoneError(personalSolutionPhone);

      if (
        !personalSolutionName.value
        || !window.MASK_NAME.test(personalSolutionName.value)
        || !window.MASK_EMAIL.test(personalSolutionEmail.value)
        || personalSolutionPhone.value.length < 1
        || window.phoneErrorSymbol.test(personalSolutionPhone.value)
      ) {
        event.preventDefault();
        return;
      }
      event.preventDefault();
      personalSolutionButton.textContent = 'Успешно отправлено';
      personalSolutionButton.classList.remove('btn--green');
      personalSolutionButton.classList.add('btn--dark-blue');
      personalSolutionButton.disabled = true;
    })
  }
})();