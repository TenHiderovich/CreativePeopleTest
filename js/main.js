

// carousel
function carousel(slider, settings) {

    let carousels = document.querySelectorAll(slider);

    let defaultSettings = {
        transition: 500,
        buttonPrev: '.carousel__prev',
        buttonNext: '.carousel__next'
    }

    let settings = settings || defaultSettings;

    carousels.forEach(element => {
        let carouselTrack = element.querySelector('.carousel__track');
        let carouselItems = element.querySelectorAll('.carousel__item');
        let carouselPrev = element.querySelector(settings.buttonPrev);
        let carouselNext = element.querySelector(settings.buttonNext);
        let carouselTrackWidth = 0;
        let slideWidth = 0;
        let disabled = false;
        // let currentSlide = 0;

        carouselTrack.style.transition = 'left ' + defaultSettings.transition / 1000 + 's ease'

        carouselItems.forEach(element => {
            carouselTrackWidth += Number(getComputedStyle(element).width.slice(0, -2));
            slideWidth = Number(getComputedStyle(element).width.slice(0, -2));
        });

        // carouselItems[currentSlide].classList.add('carousel__item_current');

        carouselTrack.style.width = carouselTrackWidth + 'px';

        // function nextSlide() {
        //     goToSlide(currentSlide + 1);
        // }

        // function previousSlide() {
        //     goToSlide(currentSlide - 1);
        // }

        // function goToSlide(n) {
        //     carouselItems.forEach(element => {
        //         element.classList.remove('carousel__item_current')
        //     });
        //     currentSlide = (n + carouselItems.length) % carouselItems.length;
        //     carouselItems[currentSlide].classList.add('carousel__item_current');
        // }

        function shiftSlideLeft() {
            if (disabled) return;
            disabled = true;

            if (carouselTrack.offsetLeft < 0) {
                // previousSlide()
                carouselTrack.style.left = Number(getComputedStyle(carouselTrack).left.slice(0, -2)) + slideWidth + 'px';
            }
            setTimeout(() => {
                disabled = false;
            }, defaultSettings.transition)

        }

        function shiftSlideRight() {

            let offsetRightTrack = carouselTrack.offsetLeft + carouselTrackWidth;
            let offseyRightParentTrack = carouselTrack.parentNode.offsetLeft + slideWidth;

            if (disabled) return;
            disabled = true;

            if (offsetRightTrack > offseyRightParentTrack) {
                // nextSlide()
                carouselTrack.style.left = Number(getComputedStyle(carouselTrack).left.slice(0, -2)) - slideWidth + 'px';
            }
            setTimeout(() => {
                disabled = false;
            }, defaultSettings.transition)
        }

        carouselPrev.addEventListener('click', shiftSlideLeft)
        carouselNext.addEventListener('click', shiftSlideRight)

    });

}

carousel('.carousel')



// Pop-up
function popUp() {

    let dataPopUp = document.querySelectorAll('.pop-up__link');

    // Ловик клик на ссылку
    for (let i = 0; i < dataPopUp.length; i++) {
        let element = dataPopUp[i];

        element.addEventListener('click', popUpOpen)
    }

    // Создаем прозрачное затемнение
    function createDarkShade() {

        let darkShade = document.createElement('div');
        let body = document.querySelector('body');

        let bodyClientWidth = body.clientWidth;

        body.style.overflow = 'hidden';

        let bodyOffsetWidth = body.offsetWidth;
        let scrollWidth = bodyOffsetWidth - bodyClientWidth;

        body.style.marginRight = scrollWidth + 'px';

        darkShade.classList.add('dark-shade');

        document.body.appendChild(darkShade)

    }

    // Создаем popup
    function createPopUp(href, dataPopup) {
        let darkShade = document.querySelector('.dark-shade');

        darkShade.innerHTML = `
        <div class="pop-up__wrapper">
            <div class="pop-up">
                <div class="close pop-up__close">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="28" height="28" viewBox="0 0 28 28">
                        <defs>
                            <path id="1ek9a" d="M1060 211c7.732 0 14 6.268 14 14s-6.268 14-14 14-14-6.268-14-14 6.268-14 14-14zm6.124 9.499l-.278-1.298-1.298-.278-4.49 4.396-4.49-4.396-1.39.278-.185 1.298 4.397 4.49-4.49 4.489.278 1.298 1.39.278 4.398-4.49 4.582 4.49 1.298-.278.278-1.298-4.49-4.49z" />
                        </defs>
                        <g opacity=".5" transform="translate(-1046 -211)">
                            <use fill="#fff" xlink:href="#1ek9a" />
                        </g>
                    </svg>
                </div>
            </div>
        </div>`

        switch (dataPopup) {
            case 'image':
                let image = document.createElement("img");
                image.setAttribute('srcset', href);
                image.classList.add('show');

                document.querySelector('.pop-up').appendChild(image);
                break;
            case 'iframe':
                let iframe = document.createElement("iframe");
                iframe.src = href + '?autoplay=1';
                iframe.setAttribute('allowfullscreen', '');
                iframe.setAttribute('frameborder', '0');
                iframe.setAttribute('allow', 'accelerometer; encrypted-media; gyroscope; picture-in-picture');

                document.querySelector('.pop-up').classList.add('pop-up_iframe')
                document.querySelector('.pop-up').appendChild(iframe);
                break;
            default:
                break;
        }

        setTimeout(() => {
            let popUp = document.querySelector('.pop-up');

            popUp.classList.add('pop-up_is-active');
        }, 10)
    }

    // Открываем popup
    function popUpOpen(e) {
        e.preventDefault();
        let href = this.getAttribute('href');
        let dataPopup = this.getAttribute('data-popup');

        createDarkShade(href, dataPopup)

        setTimeout(() => {
            let darkShade = document.querySelector('.dark-shade');

            darkShade.classList.add('dark-shade_is-active');

            darkShade.addEventListener('click', popUpClose)
        }, 0)

        setTimeout(() => {
            createPopUp(href, dataPopup)

            let close = document.querySelector('.pop-up__close');

            close.addEventListener('click', popUpClose)
        }, 500)


    }

    // Закрываем popup
    function popUpClose() {
        let darkShade = document.querySelector('.dark-shade');
        let popUp = document.querySelector('.pop-up');
        let body = document.querySelector('body');

        popUp.classList.remove('pop-up_is-active');

        setTimeout(() => {
            if (!Element.prototype.remove) {
                Element.prototype.remove = function remove() {
                    if (this.parentNode) {
                        this.parentNode.removeChild(this);
                    }
                };
            }

            darkShade.classList.remove('dark-shade_is-active');
            darkShade.remove();

            body.style.overflowY = 'scroll';

            body.style.marginRight = '0';
        }, 500)
    }


}

popUp()


// Lazy load
function lazy() {

    let images = document.querySelectorAll('img[data-srcset]');

    images.forEach(img => {
        img.setAttribute('srcset', img.getAttribute('data-srcset'));
        img.onload = function () {
            img.removeAttribute('data-srcset');
            
            img.classList.add('show');
        };
    });
}

lazy()


// Filter
function filter() {

    let filterLinkList = document.querySelectorAll('.filter__link');

    filterLinkList.forEach(element => {
        element.addEventListener('click', onChangeFilter)
    });


    function onChangeFilter(e) {
        e.preventDefault();

        let tilesItem = document.querySelectorAll('.tiles__item');

        tilesItem.forEach(element => {
            element.classList.remove('tiles__item_disabled');
            activeFilterItem(this);

            let valueFilterOn = this.getAttribute('data-filter');
            let arrayFilteredValues = element.getAttribute('data-filter').split(',');

            if (arrayFilteredValues.indexOf(valueFilterOn) === -1) {
                element.classList.add('tiles__item_disabled')
            }

            if (valueFilterOn === 'all') {
                element.classList.remove('tiles__item_disabled')
            }

        });
    }

    function activeFilterItem(that) {
        let filterLinks = document.querySelectorAll('.filter__link');

        filterLinks.forEach(element => {
            element.classList.remove('filter__link_is-active');

            that.classList.add('filter__link_is-active');
        });
    }

}

filter()