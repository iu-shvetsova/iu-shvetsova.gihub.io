'use strict';

const openButton = document.querySelector('.main-header__button');
const popup = document.querySelector('.popup');
const closeButton = popup.querySelector('.popup__close-button');
const checkbox = popup.querySelector('.feedback__checkbox');
const submitButton = popup.querySelector('.feedback__button');

const onSubmitButtonClick = () => {
    popup.classList.remove('popup--opened');
    document.removeEventListener(onCloseButtonClick);
    document.removeEventListener(onSubmitButtonClick);
};

const onCloseButtonClick = () => {
    popup.classList.remove('popup--opened');
    document.removeEventListener(onCloseButtonClick);
    document.removeEventListener(onSubmitButtonClick);
};

openButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    popup.classList.add('popup--opened');
    closeButton.addEventListener('click', onCloseButtonClick);
    closeButton.addEventListener('click', onSubmitButtonClick);
});

checkbox.addEventListener('change', () => {
    if (checkbox.checked) {
        submitButton.disabled = false;
    } else {
        submitButton.disabled = true;
    }
});

submitButton.disabled = true;
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtYWluLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxuY29uc3Qgb3BlbkJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tYWluLWhlYWRlcl9fYnV0dG9uJyk7XG5jb25zdCBwb3B1cCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wb3B1cCcpO1xuY29uc3QgY2xvc2VCdXR0b24gPSBwb3B1cC5xdWVyeVNlbGVjdG9yKCcucG9wdXBfX2Nsb3NlLWJ1dHRvbicpO1xuY29uc3QgY2hlY2tib3ggPSBwb3B1cC5xdWVyeVNlbGVjdG9yKCcuZmVlZGJhY2tfX2NoZWNrYm94Jyk7XG5jb25zdCBzdWJtaXRCdXR0b24gPSBwb3B1cC5xdWVyeVNlbGVjdG9yKCcuZmVlZGJhY2tfX2J1dHRvbicpO1xuXG5jb25zdCBvblN1Ym1pdEJ1dHRvbkNsaWNrID0gKCkgPT4ge1xuICAgIHBvcHVwLmNsYXNzTGlzdC5yZW1vdmUoJ3BvcHVwLS1vcGVuZWQnKTtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKG9uQ2xvc2VCdXR0b25DbGljayk7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihvblN1Ym1pdEJ1dHRvbkNsaWNrKTtcbn07XG5cbmNvbnN0IG9uQ2xvc2VCdXR0b25DbGljayA9ICgpID0+IHtcbiAgICBwb3B1cC5jbGFzc0xpc3QucmVtb3ZlKCdwb3B1cC0tb3BlbmVkJyk7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihvbkNsb3NlQnV0dG9uQ2xpY2spO1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIob25TdWJtaXRCdXR0b25DbGljayk7XG59O1xuXG5vcGVuQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2dCkgPT4ge1xuICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHBvcHVwLmNsYXNzTGlzdC5hZGQoJ3BvcHVwLS1vcGVuZWQnKTtcbiAgICBjbG9zZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9uQ2xvc2VCdXR0b25DbGljayk7XG4gICAgY2xvc2VCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvblN1Ym1pdEJ1dHRvbkNsaWNrKTtcbn0pO1xuXG5jaGVja2JveC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoKSA9PiB7XG4gICAgaWYgKGNoZWNrYm94LmNoZWNrZWQpIHtcbiAgICAgICAgc3VibWl0QnV0dG9uLmRpc2FibGVkID0gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgc3VibWl0QnV0dG9uLmRpc2FibGVkID0gdHJ1ZTtcbiAgICB9XG59KTtcblxuc3VibWl0QnV0dG9uLmRpc2FibGVkID0gdHJ1ZTsiXSwiZmlsZSI6Im1haW4uanMifQ==
