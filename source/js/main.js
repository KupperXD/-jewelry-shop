(function ($) {
    'use strict';
    $(document).ready(function () {
        const EventNames = {
            burgerMenuClose: 'burger-menu-close',
        }

        // Плагин для обработки кликов по бургер меню
        const burgerButtonPlugin = () => {
            const $header = $('.js-header');

            const Selectors = {
                burgerButton: '.js-burger-menu-button',
                burgerMenu: '.js-burger-menu-wrapper',
            }

            const buttonActiveClass = 'open-burger-menu';

            const $button = $(Selectors.burgerButton);

            const closeBurgerMenu = () => {
                $button.removeClass(buttonActiveClass);
                $header.removeClass(buttonActiveClass);
                $(document).trigger(EventNames.burgerMenuClose);
            };

            $(document).on('click', Selectors.burgerButton, () => {
                $button.toggleClass(buttonActiveClass);
                $header.toggleClass(buttonActiveClass);

                if (!$header.hasClass(buttonActiveClass)) {
                    $(document).trigger(EventNames.burgerMenuClose);
                }
            });

            $(document).on('click', (evt) => {
                const $target = $(evt.target);
                const isButton = $target.closest(Selectors.burgerButton).length;
                const isBurgerMenu = $target.closest(Selectors.burgerMenu).length;

                if (isButton || isBurgerMenu) {
                    return;
                }

                closeBurgerMenu();
            });

            $(document).on('click', '.js-burger-menu-close', () => {
                closeBurgerMenu();
            });
        };

        // плагин скриптов навигации в бургер меню
        const burgerSectionPlugin = () => {
            const Selectors = {
                burgerMenuWrapper: '.js-burger-menu-wrapper',
                filterPanel: '.js-filter-panel',
                filterSection: '.js-filter-panel-section',
                buttonReturn: '.js-filter-panel-section-return',
                burgerContent: '.js-burger-content',
                openButtonWrapper: '.js-filter-panel-section-open',
            }

            const activePanelClass = 'has-open-section';

            const $header = $('.js-header');
            const $filterPanel = $header.find(Selectors.filterPanel);
            const $filterSections = $filterPanel.find(Selectors.filterSection);
            const $burgerMenuWrapper = $header.find(Selectors.burgerMenuWrapper);

            const refreshFilterSections = () => {
              $filterSections.each((index, item) => {
                  $(item).removeClass('active');
              });
              $filterPanel.removeClass(activePanelClass);
              $burgerMenuWrapper.removeClass(activePanelClass);
            };

            const openFilterSection = ($wrapper) => {
                $wrapper.addClass('active');
                $filterPanel.addClass(activePanelClass);
                $burgerMenuWrapper.addClass(activePanelClass);
            }

            $filterPanel.on('click', (evt) => {
                const $target = $(evt.target);
                const isReturn = $target.closest(Selectors.buttonReturn).length;

                if (isReturn) {
                    refreshFilterSections();
                    return;
                }

                const isOpenButton = $target.closest(Selectors.openButtonWrapper).length;
                const $holderSection = $target.closest(Selectors.filterSection);
                const hasItems = $holderSection.find(Selectors.burgerContent).length;

                if (!hasItems || !isOpenButton) {
                    return;
                }

                openFilterSection($holderSection);
            });

            $(document).on(EventNames.burgerMenuClose, () => {
               refreshFilterSections();
            });
        };

        const fixedHeaderPlugin = () => {
            const header = document.querySelector('.js-header');
            const pageWrapper = document.querySelector('.page-wrapper');

            const scrollHandler = (evt = null) => {
                let offsetY = null;

                if (!evt) {
                    offsetY = window.scrollY;
                } else {
                    offsetY = evt.target.scrollingElement.scrollTop;
                }

                if (typeof offsetY === 'object') {
                    return;
                }

                if (offsetY > 80) {
                    pageWrapper.classList.add('header-fixed');
                    header.classList.add('fixed')
                    return;
                }

                pageWrapper.classList.remove('header-fixed');
                header.classList.remove('fixed');
            };

            window.addEventListener('scroll', scrollHandler);

            scrollHandler();
        }

        const initSliderMain = () => {
            const $swipers = $('.js-slider-main');
            const windowWidth = $(window).innerWidth();
            const MAX_WIDTH = 768;

            if (windowWidth > MAX_WIDTH) {
                return;
            }

            $swipers.each((index, item) => {
                const pagination = $(item).find('.swiper-pagination').get(0);

                new Swiper(item, {
                    slidesPerView: 'auto',
                    spaceBetween: 16,
                    pagination: {
                        el: pagination,
                      clickable: true,
                    },
                })
            });

        }

        const initMaps = () => {
          if (!ymaps || typeof ymaps === 'undefined') {
              console.log('Карты не найдены');
          }
          ymaps.ready(() => {
              const myMap = new ymaps.Map('main-map', {
                  center: [55.721300069007306,37.57314149999994],
                  zoom: 17,
                  controls: ['zoomControl'],
              });

              const geoObject = new ymaps.Placemark( [55.7209,37.5726], {
                  balloonContent: `<p>8 (800) 600-29-81</p><p>Режим работы: 09:00-21:00 без выходных.<br>
                    Для согласования более позднего времени визита, 
                    пожалуйста, записывайтесь заранее.</p>`,
              }, {
                  iconLayout: 'default#imageWithContent',
                  iconImageHref: 'img/official/map_pin.png',
                  iconImageSize: [52, 51],
                  iconImageOffset: [-26, -26],
              });

              myMap.geoObjects.add(geoObject);
          });
        };

        const sweetAlertCssClass = {
            container: 'custom-popup__container',
            popup: 'custom-popup',
            htmlContainer: 'custom-popup__wrapper',
            closeButton: 'custom-popup__close',
        }

        $(document).on('click', '.js-meeting-appoint-open-popup', (evt) => {
            const popupTemplate = $('.js-meeting-appoint-popup').get(0);

            if (typeof popupTemplate === 'undefined' || !popupTemplate) {
                return;
            }

            const cloneTemplate = popupTemplate.cloneNode(true);
            const $datePickerHolder = $(cloneTemplate).find('.js-datepicker-wrapper');
            const phoneInput = $(cloneTemplate).find('.js-phone-mask').get(0);
            const datePicker = $datePickerHolder.find('.js-datepicker').get(0);

            new AirDatepicker(datePicker, {
                container: $datePickerHolder.get(0),
                minDate: new Date(),
            });

            $(cloneTemplate).find('.js-select2').each((index, item) => {
                $(item).select2({
                    width: 'style',
                    dropdownParent: $(item).parent(),
                });
            });

            IMask(phoneInput, {
                mask: '+7 (000) 000-00-00',
            });

            Swal.fire({
                backdrop: true,
                html: cloneTemplate,
                customClass: sweetAlertCssClass,
                padding: 0,
                showConfirmButton: false,
                showCloseButton: true,
            })
        });

        const init = () => {
            burgerButtonPlugin();
            burgerSectionPlugin();
            fixedHeaderPlugin();
            initSliderMain();
            initMaps();
        }

        init();
    });
})(jQuery);