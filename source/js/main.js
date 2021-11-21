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
              const mainMap = document.querySelector('#main-map');

              if (typeof mainMap === 'undefined' || !mainMap) {
                  return;
              }

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

        const downloadFile = ($container) => {
            const defaultLabelText = 'Загрузить фото или файл';
            const activeClass = 'has-file';
            const $text = $container.find('.js-download-file-text');

            $container.on('change', 'input[type="file"]', (evt) => {
               const target = evt.target;

                console.log(target.files);

               if (typeof target.files[0] === 'undefined') {
                   $container.removeClass(activeClass);
                   $text.text(defaultLabelText);
                   return;
               }

               $text.text(target.files[0].name);
               $container.addClass(activeClass);
            });

            $container.on('click', '.js-delete-file', () => {
                $container.find('input[type="file"]').val();
                $container.removeClass(activeClass);
                $text.text(defaultLabelText);
            });
        }

        const initTelephoneMask = ($field) => {
            const field = $field.get(0);

            if (typeof field === 'undefined') {
                return;
            }
            IMask(field, {
                mask: '+7 (000) 000-00-00',
            });
        }

        const initAccordion = ($container) => {
            const OPENED_CLASS = 'opened';
            const $wrapper = $container.find('.js-accordion-wrapper');
            const defaultMinHeight = $container.css('minHeight');

            $container.on('click', '.js-accordion-open', () => {
                const maxHeight = $wrapper.outerHeight();

                if ($container.hasClass(OPENED_CLASS)) {
                    $container.removeClass(OPENED_CLASS);
                    $container.css('minHeight', defaultMinHeight);
                    return;
                }

                $container.addClass(OPENED_CLASS);
                $container.css('minHeight', maxHeight);
            });
        }


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

        // Открыть поап успешной отправки формы оценки
        $(document).on('click', '.js-grade-online-open-popup', (evt) => {
            evt.preventDefault();
            const popupTemplate = $('.js-popup-applications-sends').get(0);

            if (typeof popupTemplate === 'undefined' || !popupTemplate) {
                return;
            }

            const cloneTemplate = popupTemplate.cloneNode(true);

            Swal.fire({
                backdrop: true,
                html: cloneTemplate,
                customClass: sweetAlertCssClass,
                padding: 0,
                showConfirmButton: false,
                showCloseButton: true,
            })
        });

        // открыть поап фильтров на мобилке
        $(document).on('click', '.js-catalog-open-popup-filters', () => {
            const popupTemplate = $('.js-catalog-filter-popup').get(0);
            const parent = popupTemplate.parentNode;

            if (typeof popupTemplate === 'undefined' || !popupTemplate) {
                return;
            }

            Swal.fire({
                backdrop: true,
                html: popupTemplate,
                customClass: sweetAlertCssClass,
                padding: 0,
                showConfirmButton: false,
                showCloseButton: true,
                didOpen(popup) {
                    $(popupTemplate).addClass('active-popup');
                },
                didClose() {
                    popupTemplate.classList.remove('active-popup');
                    parent.appendChild(popupTemplate);
                },
            })
        });

        $(document).on('click', '.js-open-application-popup', (evt) => {
            evt.preventDefault();
            const popupTemplate = $('.js-application-popup').get(0);

            if (typeof popupTemplate === 'undefined' || !popupTemplate) {
                return;
            }

            const cloneTemplate = popupTemplate.cloneNode(true);
            const phoneInput = $(cloneTemplate).find('.js-phone-mask').get(0);

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

        $(document).on('click', '.js-open-popup-more-photo', (evt) => {
            evt.preventDefault();
            const popupTemplate = $('.js-popup-more-photo').get(0);
            const parent = popupTemplate.parentNode;

            if (typeof popupTemplate === 'undefined' || !popupTemplate) {
                return;
            }

            const phoneInput = $(popupTemplate).find('.js-phone-mask').get(0);

            IMask(phoneInput, {
                mask: '+7 (000) 000-00-00',
            });

            Swal.fire({
                backdrop: true,
                html: popupTemplate,
                customClass: sweetAlertCssClass,
                padding: 0,
                showConfirmButton: false,
                showCloseButton: true,
                didClose: () => {
                    parent.appendChild(popupTemplate);
                },
            });
        });

        const scollToElement = (element) => {
            if (!element) {
                return;
            }

            const offsetTop = element.getBoundingClientRect().top + window.scrollY;

            window.scrollTo({
               top: offsetTop - 100,
                behavior: 'smooth',
            });

        }

        $(document).on('click', '.js-scroll-to-contact-block', (evt) => {
            const $contactSection = $('.js-contact-section');

            if (!$contactSection.length) {
                return true;
            }

            evt.preventDefault();
            scollToElement($contactSection.get(0));
        });

        const initProductPageSliders = ($holder) => {
            const thumbsHolder = $holder.find('.js-thumbs-product-page .swiper-container').get(0);
            const mainSlider = $holder.find('.js-slider-product-page .swiper-container').get(0);
            const $videos = $holder.find('video');

            if (!thumbsHolder || !mainSlider) {
                console.log('Не нашли слайдеров');
                return;
            }

            const thumbsInstance = new Swiper(thumbsHolder, {
                slidesPerView: 'auto',
                direction: 'horizontal',
                spaceBetween: 10,
                breakpoints: {
                  768: {
                      direction: 'vertical',
                  },
                },
            });

            const mainSliderInstance = new Swiper(mainSlider, {
                slidesPerView: 1,
                spaceBetween: 40,
                thumbs: {
                  swiper: thumbsInstance,
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
            });

            mainSliderInstance.on('slideChange', () => {
               if (!$videos.length) {
                   return;
               }

               $videos.each((index, item) => {
                  if (typeof item.pause !== 'function') {
                      return;
                  }
                  item.pause();
               });
            });
        };

        const init = () => {
            burgerButtonPlugin();
            burgerSectionPlugin();
            fixedHeaderPlugin();
            initSliderMain();
            initMaps();

            $('.js-download-file').each((index, item) => {
                downloadFile($(item));
            });

            $('.js-init-phone-mask').each((index, item) => {
               initTelephoneMask($(item));
            });

            $('.js-accordion').each((index, item) => {
               initAccordion($(item));
            });

            $('.js-slider-with-thumb-holder').each((index, item) => {
               initProductPageSliders($(item));
            });
        }

        init();
    });
})(jQuery);