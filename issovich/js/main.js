'use strict';

(function () {
  var screen = document.querySelector('.screen-lock');
  if (!screen) {
    return;
  }

  var submitBtn = screen.querySelector('.screen-lock__btn');
  var input = screen.querySelector('.screen-lock__input');

  var emptyFieldError = screen.querySelector('.screen-lock__error--empty-field');
  var wrongCodeError = screen.querySelector('.screen-lock__error--wrong-code');

  submitBtn.addEventListener('click', function(evt) {
    evt.preventDefault();

    // console.log(input.value)

    emptyFieldError.classList.remove('screen-lock__error--visible');
    wrongCodeError.classList.remove('screen-lock__error--visible');

    if (input.value === '') {
      emptyFieldError.classList.add('screen-lock__error--visible');
    } else if (input.value != 50) {
      wrongCodeError.classList.add('screen-lock__error--visible');
    } else {
      var form = screen.querySelector('.screen-lock__form');
      form.submit();
    }
  });
})();
'use strict';

(function () {
  var TABLET_WIDTH = 767;
  var inviteSection = document.querySelector('.screen-reg');

  if (inviteSection && (window.matchMedia("(max-width: " + TABLET_WIDTH + "px)").matches || window.navigator.userAgent.indexOf("Edge") > -1)) {
    // console.log('nya');
    var inviteButton = document.querySelector('.screen__main-button');
    var asideButton = document.querySelector('.aside-button');

    inviteButton.addEventListener('click', function (evt) {
      evt.preventDefault();
      inviteSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    });

    asideButton.addEventListener('click', function (evt) {
      evt.preventDefault();
      inviteSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    });
  }
})();
"use strict";

(function() {
  var TABLET_WIDTH = 768;
  if (window.matchMedia("(min-width: " + TABLET_WIDTH + "px)").matches) {
    var element = document.querySelector(".main-container");
    if (!element) {
      return;
    }


    // if (window.navigator.userAgent.indexOf("Edge") > -1) {
    if (window.navigator.userAgent.indexOf("Edge") > -1) {
      function onScreenEnter(index) {
        changeActiveProgressItem(index);
        setTimeout(function() {
          removeAllAnimations();
          animate(index);
        }, 900);
      }

      inView.offset(100);

      inView('.screen--1')
        .on('enter', function() {
          onScreenEnter(0);
        });

      inView('.screen--2')
        .on('enter', function() {
          onScreenEnter(1);
        });

      inView('.screen--3')
        .on('enter', function() {
          onScreenEnter(2);
        });

      inView('.screen--4')
        .on('enter', function() {
          onScreenEnter(3);
        });

      inView('.screen--5')
        .on('enter', function() {
          onScreenEnter(4);
        });

      inView('.screen--6')
        .on('enter', function() {
          onScreenEnter(5);
        });

      inView('.screen--7')
        .on('enter', function() {
          onScreenEnter(6);
        });
    } else {
      var swiperContainer = document.querySelector('.main-container');
      var swiperWrapper = swiperContainer.querySelector('.main-wrapper');
      var swiperSlides = swiperWrapper.querySelectorAll('.screen');

      swiperContainer.classList.add('swiper-container');
      swiperWrapper.classList.add('swiper-wrapper');
      for (var i = 0; i < swiperSlides.length; i++) {
        swiperSlides[i].classList.add('swiper-slide');
      }

      var mySwiper = new Swiper('.swiper-container', {
        direction: 'vertical',
        slidesPerView: 1,
        speed: 1000,
        mousewheel: true,
        autoplay: false,
        // allowTouchMove: false,
        keyboard: {
          enabled: true,
          onlyInViewport: false,
        },
        on: {
          slideChange: function() {
            changeActiveProgressItem(mySwiper.activeIndex);
            setTimeout(function() {
              removeAllAnimations();
              animate(mySwiper.activeIndex);
            }, 900);
          }
        }
      })

      window.addEventListener("load", function() {
        asideButton.addEventListener('click', function(evt) {
          evt.preventDefault();
          mySwiper.slideTo(swiperSlides.length - 1, 2400, true);
        });

        mainButton.addEventListener('click', function(evt) {
          evt.preventDefault();
          mySwiper.slideTo(swiperSlides.length - 1, 2400, true);
        });
      });
    }

    var progressWrapper = document.querySelector(".progress");
    var progressItems = progressWrapper.querySelectorAll(".progress__item");
    var progressLength = progressItems.length;

    var asideButton = document.querySelector(".aside-button");
    var mainButton = document.querySelector(".screen__main-button");

    var screenHeight = element.scrollHeight / (progressLength + 1);

    function changeActiveProgressItem(index) {
      for (var i = 0; i < progressItems.length; i++) {
        progressItems[i].classList.remove("progress__item--active");
      }

      if (index === progressLength) {
        asideButton.classList.remove("aside-button--visible");
        progressWrapper.classList.add("progress--hidden");
      } else {
        if (index === progressLength - 1) {
          progressWrapper.classList.remove("progress--hidden");
        }
        asideButton.classList.add("aside-button--visible");
        progressItems[index].classList.add("progress__item--active");
      }
    }

    function hideProgress() {
      progressWrapper.classList.add("progress--hidden");
    }

    function animateSecondScreen() {
      var secondScreen = document.querySelector(".screen--2");
      if (secondScreen) {
        var plane = secondScreen.querySelector(".item--plane");
        var car = secondScreen.querySelector(".item--car");
        var phrase = secondScreen.querySelector(".item__phrase");

        plane.classList.add("animated");
        car.classList.add("animated");
        phrase.classList.add("animated");
      }
    }

    function animateThirdScreen() {
      var thirdScreen = document.querySelector(".screen--3");
      if (thirdScreen) {
        var hunter = thirdScreen.querySelector(".item--hunter");
        var animals = thirdScreen.querySelector(".item--animals");
        var boar = thirdScreen.querySelector(".item--boar");
        var fox = thirdScreen.querySelector(".item--fox");
        var deer = thirdScreen.querySelector(".item--deer");
        var phrase = thirdScreen.querySelector(".item__phrase");

        hunter.classList.add("animated");
        animals.classList.add("animated");
        boar.classList.add("animated");
        fox.classList.add("animated");
        deer.classList.add("animated");
        phrase.classList.add("animated");
      }
    }

    function animateFourthScreen() {
      var fourthScreen = document.querySelector(".screen--4");
      if (fourthScreen) {
        var fisherman = fourthScreen.querySelector(".item--fisherman");
        var boar = fourthScreen.querySelector(".item--water-boar");
        var fox = fourthScreen.querySelector(".item--water-fox");
        var fish = fourthScreen.querySelector(".item--fish");
        var phrases = fourthScreen.querySelectorAll(".item__phrase");

        fisherman.classList.add("animated");
        boar.classList.add("animated");
        fox.classList.add("animated");
        fish.classList.add("animated");
        for (var i = 0; i < phrases.length; i++) {
          phrases[i].classList.add("animated");
        }
      }
    }

    function animateFifthScreen() {
      var fifthScreen = document.querySelector(".screen--5");

      if (fifthScreen) {
        var auto = fifthScreen.querySelector(".item--football-fan-1");
        var phrases = fifthScreen.querySelectorAll(".item__phrase");
        var footballer_1 = fifthScreen.querySelector(".item--footballer-1-1");
        var footballer_2 = fifthScreen.querySelector(".item--footballer-1-2");

        auto.classList.add("animated");
        footballer_1.classList.add("animated");
        footballer_2.classList.add("animated");
        for (var i = 0; i < phrases.length; i++) {
          phrases[i].classList.add("animated");
        }
      }
    }

    function animateSixthScreen() {
      var sixthScreen = document.querySelector(".screen--6");

      if (sixthScreen) {
        var auto = sixthScreen.querySelector(".item--football-fan-2");
        var footballer_1 = sixthScreen.querySelector(".item--footballer-2-1");
        var footballer_2 = sixthScreen.querySelector(".item--footballer-2-2");
        var phrase = sixthScreen.querySelector(".item__phrase--6");
        var software = sixthScreen.querySelector(".item--software");

        auto.classList.add("animated");
        footballer_1.classList.add("animated");
        footballer_2.classList.add("animated");
        phrase.classList.add("animated");
        software.classList.add("animated");
      }
    }

    function animateSeventhScreen() {
      var seventhScreen = document.querySelector(".screen--7");
      if (seventhScreen) {
        var phrases = seventhScreen.querySelectorAll(".item__phrase");
        for (var i = 0; i < phrases.length; i++) {
          phrases[i].classList.add("animated");
        }
      }
    }

    function animate(index) {
      switch (index) {
        case 0:
          return;
        case 1:
          animateSecondScreen();
          break;
        case 2:
          animateThirdScreen();
          break;
        case 3:
          animateFourthScreen();
          break;
        case 4:
          animateFifthScreen();
          break;
        case 5:
          animateSixthScreen();
          break;
        case 6:
          animateSeventhScreen();
          break;
        default:
          return;
      }

      return;
    }

    function removeAllAnimations() {
      var animations = document.querySelectorAll(".animated");
      for (var i = 0; i < animations.length; i++) {
        animations[i].classList.remove("animated");
      }
    }
  }
})();