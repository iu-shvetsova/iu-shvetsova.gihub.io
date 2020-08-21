function openMenu() {
  document
    .querySelector(".widget__header-menu")
    .classList.toggle("widget__header-menu--act");
  document.querySelector(".widget-menu").classList.toggle("widget-menu--act");
}

if (document.querySelector(".widget__header-menu")) {
  document
    .querySelector(".widget__header-menu")
    .addEventListener("click", openMenu);
}

const hintIcon = document.querySelectorAll(".buy__hint-icon");

if (hintIcon) {
  for (let i = 0; i < hintIcon.length; i++) {
    hintIcon[i].addEventListener("mouseover", (e) => {
      e.currentTarget.classList.add("buy__hint-icon--act");
    });
    hintIcon[i].addEventListener("mouseout", (e) => {
      e.currentTarget.classList.remove("buy__hint-icon--act");
    });
  }
}

const btnRoute = document.querySelectorAll(".nf-btn-route");

if (btnRoute) {
  for (let i = 0; i < btnRoute.length; i++) {
    btnRoute[i].addEventListener("click", (e) => {
      e.preventDefault();
      let btnRouteHref = e.currentTarget.getAttribute("data-link");
      window.location.href = btnRouteHref;
      console.log(btnRouteHref);
      // if (!e.currentTarget.classList.contains("nf-btn--disable")) {
      //   let btnRouteHref = e.currentTarget.getAttribute("data-link");
      //   window.location.href = btnRouteHref;
      //   console.log(btnRouteHref);
      // }
    });
  }
}

const maskPhone = (selector) => {
  try {
    let setCursorPosition = (pos, elem) => {
      elem.focus();

      if (elem.setSelectionRange) {
        elem.setSelectionRange(pos, pos);
      } else if (elem.createTextRange) {
        let range = elem.createTextRange();
        range.collapse(true);
        range.moveEnd("character", pos);
        range.moveStart("character", pos);
        range.select();
      }
    };

    function createMask(event) {
      let matrix = "+7 (___) ___ __ __",
        i = 0,
        def = matrix.replace(/\D/g, ""),
        val = this.value.replace(/\D/g, "");

      if (def.length >= val.length) {
        val = def;
      }

      this.value = matrix.replace(/./g, function (a) {
        return /[_\d]/.test(a) && i < val.length
          ? val.charAt(i++)
          : i >= val.length
          ? ""
          : a;
      });

      if (event.type === "blur") {
        if (this.value.length == 2) {
          this.value = "";
        }
      } else {
        setCursorPosition(this.value.length, this);
      }
    }

    let inputs = document.querySelectorAll(selector);
    inputs.forEach((input) => {
      input.addEventListener("input", createMask);
      input.addEventListener("focus", createMask);
      input.addEventListener("blur", createMask);
    });
  } catch (e) {}
};

const placeholder = (inputSelectior, valueUpdate) => {
  try {
    const input = document.querySelector(inputSelectior);
    const update = input.parentNode.querySelector(".updateText");
    const pattern = /^\d+(\.?)\d*$/g;
    const allowedCodes = [8, 9, 27, 35, 36, 37, 38, 39, 46, 110, 188];
    input.addEventListener("input", onInput);

    function onInput(e) {
      const value = this.value;

      if (input.value.length == 0) {
        update.innerHTML = valueUpdate;
      } else {
        if (
          !(
            value.match(pattern) ||
            allowedCodes.some((code) => code === e.keyCode)
          )
        ) {
          this.value = value.slice(0, -1);
        }

        let mantissa = input.value.split(".");

        if (mantissa[1] == undefined) {
          update.innerHTML = mantissa[0];
        } else {
          update.innerHTML =
            mantissa[0] + "." + "<span>" + mantissa[1] + "</span>";
        }

        console.log("input.value = ", input.value);

        if (input.value == "") {
          update.innerHTML = valueUpdate;
        }
      }
    }
  } catch (e) {}
};

const placeholderLong = (inputSelectior, valueUpdate) => {
  try {
    const input = document.querySelector(inputSelectior);
    const update = input.parentNode.querySelector(".updateText");
    input.addEventListener("input", onInput);

    function onInput(e) {
      const value = this.value;

      if (input.value.length == 0) {
        update.innerHTML = valueUpdate;
      } else {
        update.innerHTML = "";
      }
    }
  } catch (e) {}
}; //  СДЕЛАТЬ КНОПКУ ЗЕЛЕНОЙ ПОСЛЕ ВВОДА ПРАВИЛЬНОГО ЗНАЧЕНИЯ

const userCoude = (coudeSelectior, validValue, btnSelector) => {
  try {
    const userCoude = document.querySelector(coudeSelectior);
    const btn = document.querySelector(btnSelector);
    userCoude.addEventListener("input", function (e) {
      if (userCoude.value == validValue) {
        btn.classList.remove("btn__grey");
        btn.classList.add("btn__green");

        if (userCoude.id == "bitcoinAddress") {
          document
            .querySelector(".detail .btn__pay")
            .classList.remove("btn__black");
          document
            .querySelector(".detail .btn__pay")
            .classList.add("btn__black");
        }
      } else {
        btn.classList.remove("btn__green");
        btn.classList.add("btn__grey");
      }
    });
  } catch (e) {}
}; //  ВВОД ДО ОПРЕДЕЛЕННОГО ЗНАЧЕНИЯ

const inputValidValue = (inputNumber, maxValue) => {
  const num = document.querySelectorAll(inputNumber);
  const numMax = maxValue;
  num.forEach((item) => {
    item.addEventListener("input", (e) => {
      item.value = item.value.replace(/\D/g, "");

      if (item.value > numMax) {
        item.value = numMax;
      }
    });
  });
}; //  ТОЛЬКО ЦИФРЫ

const inputValidNum = (inputNumber) => {
  const num = document.querySelectorAll(inputNumber);
  num.forEach((item) => {
    item.addEventListener("input", (e) => {
      item.value = item.value.replace(/\D/g, "");
    });
  });
};

document.addEventListener("DOMContentLoaded", () => {
  try {
    const next_1 = document.querySelector(".buy .btn__send");
    const next_2 = document.querySelector(".join .btn__send");
    const next_3 = document.querySelector(".verify .btn__send");
    const next_4 = document.querySelector(".detail .btn__send");
    const next_5 = document.querySelector(".card .btn__send");
    const next_6 = document.querySelector(".processing .btn__send");
    const next_7 = document.querySelector(".proceed .btn__send");
    const next_8 = document.querySelector(".information .btn__send");

    const start = () => {
      document.querySelector(".widget__wrapper0").style.display = "none";
      document.querySelector(".widget__wrapper1").style.display = "flex";
    };

    setTimeout(start, 5000);
    next_1.addEventListener("click", function () {
      if (
        document.getElementById("buyInp").value !== "" &&
        document.getElementById("buyInpBTC").value !== ""
      ) {
        document.querySelector(".widget__wrapper1").style.display = "none";
        document.querySelector(".widget__wrapper2").style.display = "flex";
      } else {
        if (document.getElementById("buyInp").value === "") {
          document.getElementById("buyInp").parentNode.style.border =
            "1px solid red";
        }

        if (document.getElementById("buyInpBTC").value === "") {
          document.getElementById("buyInpBTC").parentNode.style.border =
            "1px solid red";
        }
      }
    });
    next_2.addEventListener("click", function () {
      if (document.getElementById("userEmail").value !== "") {
        if (document.getElementById("userEmail").checkValidity()) {
          document.querySelector(".widget__wrapper2").style.display = "none";
          document.querySelector(".widget__wrapper3").style.display = "flex";
        } else {
          document.getElementById("userEmail").style.borderBottom =
            "1px solid red";
        }
      } else {
        document.getElementById("userEmail").style.borderBottom =
          "1px solid red";
      }
    });
    next_3.addEventListener("click", function () {
      if (next_3.classList.contains("btn__green")) {
        document.querySelector(".widget__wrapper3").style.display = "none";
        document.querySelector(".widget__wrapper4").style.display = "flex";
      } else {
      }
    });
    next_4.addEventListener("click", function () {
      if (
        next_4.classList.contains("btn__green") &&
        document.getElementById("detailInp").value !== "" &&
        document.getElementById("buyInpBNT").value !== ""
      ) {
        document.querySelector(".widget__wrapper4").style.display = "none";
        document.querySelector(".widget__wrapper5").style.display = "block";
      } else {
        if (document.getElementById("detailInp").value === "") {
          document.getElementById("detailInp").parentNode.style.border =
            "1px solid red";
        }

        if (document.getElementById("buyInpBNT").value === "") {
          document.getElementById("buyInpBNT").parentNode.style.border =
            "1px solid red";
        }
      }
    });
    next_5.addEventListener("click", function () {
      if (
        document.getElementById("cardNumber").value !== "" &&
        document.getElementById("cardNumber").value.length == 19 &&
        document.getElementById("cardHolder").value !== "" &&
        document.getElementById("expiresMM").value !== "" &&
        document.getElementById("expiresYY").value !== "" &&
        document.getElementById("cardCVC").value !== ""
      ) {
        document.querySelector(".widget__wrapper5").style.display = "none";
        document.querySelector(".widget__wrapper6").style.display = "block";
        processingSixScreen();
      } else {
        if (
          document.getElementById("cardNumber").value === "" ||
          document.getElementById("cardNumber").value.length != 19
        ) {
          document.getElementById("cardNumber").parentNode.style.border =
            "1px solid red";
        } else {
          document.getElementById("cardNumber").parentNode.style.border =
            "1px solid rgba(25, 48, 64, 0.1)";
        }

        if (document.getElementById("cardHolder").value === "") {
          document.getElementById("cardHolder").parentNode.style.border =
            "1px solid red";
        } else {
          document.getElementById("cardHolder").parentNode.style.border =
            "1px solid rgba(25, 48, 64, 0.1)";
        }

        if (document.getElementById("expiresMM").value === "") {
          document.getElementById("expiresMM").parentNode.style.border =
            "1px solid red";
        } else {
          document.getElementById("expiresMM").parentNode.style.border =
            "1px solid rgba(25, 48, 64, 0.1)";
        }

        if (document.getElementById("expiresYY").value === "") {
          document.getElementById("expiresYY").parentNode.style.border =
            "1px solid red";
        } else {
          document.getElementById("expiresYY").parentNode.style.border =
            "1px solid rgba(25, 48, 64, 0.1)";
        }

        if (document.getElementById("cardCVC").value === "") {
          document.getElementById("cardCVC").parentNode.style.border =
            "1px solid red";
        } else {
          document.getElementById("cardCVC").parentNode.style.border =
            "1px solid rgba(25, 48, 64, 0.1)";
        }
      }
    });
    next_6.addEventListener("click", function () {
      if (next_6.classList.contains("btn__blue")) {
        document.querySelector(".widget__wrapper6").style.display = "none";
        document.querySelector(".widget__wrapper7").style.display = "block";
      } else {
      }
    });
    next_7.addEventListener("click", function () {
      document.querySelector(".widget__wrapper7").style.display = "none";
      document.querySelector(".widget__wrapper8").style.display = "block";
    });
    next_8.addEventListener("click", function () {
      if (
        document.getElementById("userPhone").value !== "" &&
        document.getElementById("userPhone").value.length == 18
      ) {
        document.querySelector(".widget__wrapper8").style.display = "none";
        document.querySelector(".widget__wrapper9").style.display = "block";
        timerEnd();
      }
    });
  } catch (e) {}

  placeholder("#buyInp", "300.<span>7213</span>");
  placeholder("#buyInpBTC", "0.<span>0055</span>");
  placeholder("#detailInp", "0.<span>0267213</span>");
  placeholder("#buyInpBNT", "20.<span>7955</span>");
  placeholderLong("#cardNumber", "Card&nbsp;<span>number</span>");
  placeholderLong("#cardHolder", "Card&nbsp;<span>holder</span>");
  placeholder("#cardCVC", "CVC&nbsp;<span>CVV</span>");
  userCoude("#userCoude", "123456", ".verify .btn__send");
  userCoude("#bitcoinAddress", "123456", ".detail .btn__send");
  inputValidValue("#expiresMM", "12");
  inputValidNum("#expiresYY");

  try {
    document
      .querySelector("#userCoude")
      .addEventListener("input", function (event) {
        if (!(event.keyCode == 8) && !(event.keyCode == 46)) {
          this.value = this.value.replace(/[A-Za-zА-Яа-яЁё]/, "");
        }
      });
  } catch (e) {}

  try {
    maskPhone("#userPhone");
  } catch (e) {}

  try {
    document
      .querySelector("#cardNumber")
      .addEventListener("input", function (event) {
        if (!(event.keyCode == 8) && !(event.keyCode == 46)) {
          this.value = this.value.replace(/[A-Za-zА-Яа-яЁё]/, "");
        }
      });
  } catch (e) {}

  try {
    document
      .querySelector("#cardNumber")
      .addEventListener("keyup", function () {
        var foo = this.value.split(" ").join("");

        if (foo.length > 0) {
          foo = foo.match(new RegExp(".{1,4}", "g")).join(" ");
        }

        this.value = foo;
      });
  } catch (e) {}
});

const processingSixScreen = () => {
  try {
    var display = document.querySelector(".proces");
    var timeLeft = parseInt(display.innerHTML);
    var timer = setInterval(function () {
      if (--timeLeft >= 0) {
        display.innerHTML = timeLeft;
      } else {
        document
          .querySelector(".processing .btn__send")
          .classList.remove("btn__grey");
        document
          .querySelector(".processing .btn__send")
          .classList.add("btn__blue");
        document.querySelector(".processing .btn__send").innerHTML =
          "Verify identity";
        document.querySelector(".loading").style.display = "none";
        document.querySelector(".loading__okay").style.display = "flex";
        document.querySelector(".processing__title").style.display = "flex";
        document.querySelector(".processingResult").style.display = "flex";
        document.querySelector(
          ".processing__item:last-child"
        ).style.marginBottom = "20px";
        clearInterval(timer);
      }
    }, 1000);
  } catch (e) {}
};

const timerEnd = () => {
  try {
    var sendTime = document.querySelector(".send_time");
    var timeDisplay = parseInt(sendTime.innerHTML);
    var timer2 = setInterval(function () {
      if (--timeDisplay >= 0) {
        sendTime.innerHTML = timeDisplay;
      } else {
        document
          .querySelector(".send .btn__send")
          .classList.remove("btn__grey");
        document.querySelector(".send .btn__send").classList.add("btn__green");
        clearInterval(timer2);
      }
    }, 1000);
  } catch (e) {}
};

const cardNumber = document.getElementById("cardNumber");
const cardHolder = document.getElementById("cardHolder");
const expiresMM = document.getElementById("expiresMM");
const expiresYY = document.getElementById("expiresYY");
const cardCVC = document.getElementById("cardCVC");
cardNumber.addEventListener("input", validFiveScreen);
cardHolder.addEventListener("input", validFiveScreen);
expiresMM.addEventListener("input", validFiveScreen);
expiresYY.addEventListener("input", validFiveScreen);
cardCVC.addEventListener("input", validFiveScreen);

function validFiveScreen() {
  if (
    cardNumber.value !== "" &&
    document.getElementById("cardNumber").value.length == 19 &&
    document.getElementById("cardHolder").value !== "" &&
    document.getElementById("expiresMM").value !== "" &&
    document.getElementById("expiresYY").value !== "" &&
    document.getElementById("cardCVC").value !== ""
  ) {
    document.querySelector(".card .btn__send").classList.remove("btn__grey");
    document.querySelector(".card .btn__send").classList.add("btn__green");
  } else {
    document.querySelector(".card .btn__send").classList.add("btn__grey");
    document.querySelector(".card .btn__send").classList.remove("btn__green");
  }
}
