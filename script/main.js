$(function() {
    var dropzoneElement = document.getElementById("dropzone");
    $('.scroll-pane').jScrollPane({ wheelSpeed: 5 });

    if(dropzoneElement) {
        dropzoneElement = new Dropzone(dropzoneElement, { url: "/",  addRemoveLinks: true,});
    }

    $('#dropzone_mobile').dropzone({ url: "/" })
});

$(function() {
    var $xmpl = $('#js_trancate-box');
    $xmpl.dotdotdot({

        height: 270,
        keep: '.js_more-info',

    })

    // Get the dotdotdot API
    var api = $xmpl.data('dotdotdot');

    $xmpl.on(
        'click',
        '.js_more-info',
        function(e) {
            e.preventDefault();

            //	When truncated, restore
            if ($xmpl.hasClass('ddd-truncated')) {
                api.restore();
                $xmpl.addClass('full-story');
            }

            //	Not truncated, truncate
            else {
                $xmpl.removeClass('full-story');
                api.truncate();
                api.watch();
            }
        }
    );
})
$(document).ready(function() {

    $('.js-reset_filter').on("click", function() {
        const filterInputs = $(this).closest(".js-filter").find(".js_check");

        for (var i = 0, len = filterInputs.length; i < len; i++) {
            if ($(filterInputs[i]).hasClass('active')) {
                $(filterInputs[i]).click();
            }
        }
    })

    $("input").on("change", function() {
        if (this.parentElement.classList.contains("error")) {
            this.parentElement.classList.remove("error");
        }
    })

    $(".js_in-form").on("submit", function(e) {
        e.preventDefault();

        const formInputs = this.querySelectorAll("input");
        const formSelects =  this.querySelectorAll("select");
        const inputValid = formValidate(formInputs);
        const url = this.url;
        const data = formData(this);

        if (inputValid) {
            $.ajax({
                url: url,
                type: 'POST',
                dataType: "json",
                data: data,
            })
            .done(function() {
                console.log("success"); 
            })
            .fail(function() {
                console.log("error");
            });
            
        }
    })

    $(".js-sign-up-form").on("submit", function(e) {
        e.preventDefault();
        // this.setAttribute("novalidate", true);
        const formInputs = this.querySelectorAll("input");
        const formSelects =  this.querySelectorAll("select");
        const inputValid = formValidate(formInputs);
        const selectValid = selectValidate(formSelects);
        const url = this.url;
        const data = formData(this);

        if (inputValid && selectValid) {
            $.ajax({
                url: url,
                type: 'POST',
                dataType: "json",
                data: data,
            })
            .done(function() {
                
            })
            .fail(function() {
                console.log("error");
            })
            .always(function() {
                console.log("complete");
            });
            
        }
    })

    // $(document).on("click", function(e) {
    //     if (!($(e.target) === $(".js_currency__list") || $(e.target) === $(".js_currency"))) {
    //         $('.js_currency__list').removeClass('active');
    //     }
    // })

    $('.js_menu_active').on('click', function() {
        $(this).toggleClass('active');
        $('.js_menu__lists').toggleClass('active');
        $('.js_menu__list').removeClass('active');
        var dropMenu = $('.js_list__item_tittle').closest('.js_menu__list').find('.js_dropdown_menu');
        dropMenu.slideUp(100);
    });

    $('.js_list__item_tittle').on('click', function() {
        var dropMenu = $(this).closest('.js_menu__list').find('.js_dropdown_menu');
        $(this).closest('.js_menu__list').toggleClass('active');
        if (dropMenu.css('display') === 'none') {
            dropMenu.slideDown(500);
        } else {
            dropMenu.slideUp(500);
        }
    })

    if ($(window).width() > 1200) {
        $('.js_currency').on('mouseenter', function() {
            $('.js_currency__list').toggleClass('active');
        })
        $('.js_currency').on('mouseleave', function() {
            $(this).mouseenter();
        })
    } else  {
        $('.js_currency').on('click', function() {
            $('.js_currency__list').toggleClass('active');
        })
    }

    $(window).resize(function(event) {
        if ($(window).width() > 1200) {
            $('.js_currency').off("click");
            $('.js_currency').on('mouseenter', function() {
                $('.js_currency__list').toggleClass('active');
            })
            $('.js_currency').on('mouseleave', function() {
                $(this).mouseenter();
            })
        } else {
            $('.js_currency').off("mouseenter");
            $('.js_currency').off("mouseleave");
            $('.js_currency').on('click', function() {
                $('.js_currency__list').toggleClass('active');
            })
        }
    });
    $('.js_currency_item').on('click', function() {
        $('.js_currency_active').text($(this).text());
        $('.js_currency_item').removeClass('active')
        $(this).toggleClass('active');

    })
    $('.js_check').on('click', function() {
        var box = $(this).closest('.js_box');
        box.find('.js_check').toggleClass('active');
        if (box.find('.js_checkbox').attr('checked')) {
            box.find('.js_checkbox').removeAttr('checked');
        } else {
            box.find('.js_checkbox').attr('checked', 'checked');
        }
    })

    // Popup active actions
    $('.js_sign-in').on('click', function() {
        $('.js_login').toggleClass('active');
        $('.js_forgot').removeClass('active');
    })
    $('.js_reset-pass').on('click', function() {
        $('.js_login').removeClass('active');
        $('.js_forgot').toggleClass('active');
    })

    // Close popup blocks
    $('.js_close').on('click', function() {
        const popupInputs = this.closest('.js_popup').querySelectorAll("input");

        if (popupInputs.length !== 0) {
            for (var i = 0, len = popupInputs.length; i < len; i++) {
                popupInputs[i].parentNode.classList.remove("error");
            }
        }

        $(this).closest('.js_popup').removeClass('active');
        $('.js_password').attr('type', 'password');
    })


    $('.js_show-pass').on('click', function() {
        if ($('.js_password').attr('type') === 'text') {
            $('.js_password').attr('type', 'password');
        } else {
            $('.js_password').attr('type', 'text');
        }
    })
    $('.js_show-list').on('click', function() {
        $(this).closest('.js_box').find('.js_drop-list').toggleClass('active');
        $(this).closest('.js_box').find('.js_show-list').toggleClass('active');
        $(this).closest('.js_box').toggleClass('active');
    })
    $('.js_item').on('click', function() {
        var text = $(this).text();
        $(this).closest('.js_box').find('.js_label').text(text);
        $(this).closest('.js_box').find('.js_label').addClass('choose');;
        $(this).closest('.js_drop-list').toggleClass('active');
        $(this).closest('.js_box').find('.js_show-list').toggleClass('active');
    })
    $('.js_input').on('change', function() {
        $(this).closest('.js_input-block').removeClass('error');
    })
    $('.js_kennel_check').on('click', function() {
        $('.js_kennel').toggleClass('active');
        $('.js_kennel_check').toggleClass('active');
    })

    $('.js_subscribe').on('click', function() {
        var block = $(this).closest('.js_subscribe-block'),
            input = block.find('.js_input'),
            check = /.+@.+\..+/i;
        if (check.test(input[0].value)) {
            block.find('.js_wrapper').toggleClass('hidden');
            block.find('.js_active').toggleClass('active');
            block.find('.js_mail').text(input[0].value);
            block.addClass('success');
            input[0].value = '';
        } else {
            block.find('.js_input-block').addClass('error');
        }
    })
    $('.js_subscribe-form').submit(function(event) {
        event.preventDefault();
        $('.js_subscribe').click();
        return false
    });


    $('.js_like').on('click', function() {
        $(this).toggleClass('active');
    })
    $('.js_help').on('mouseenter', function() {
        $(this).find('.js_help-block').toggleClass('active');
    })
    $('.js_help').on('mouseleave', function() {
        $(this).find('.js_help-block').toggleClass('active');
    })
    $('.js_contact-form').on('submit', function(event) {
        event.preventDefault();
        $(this).closest('.js_contact').toggleClass('success');
    })
    $('.js_send-message').on('click', function() {
        $('.js_contact-form').submit();
    })
    $('.js_write-message').on('click', function() {
        $('.js_contact').toggleClass('active');
    })
    $('.js_form-success').on('click', function() {
        $('textarea').val('');
        $('.js_contact').toggleClass('success');
    })

    $('.js_delete').on('click', function() {
        var block = $(this).closest('.js_dog');
        block.toggleClass('delete');
        setTimeout(function() { block.remove() }, 1000);
    })

    $('.js_open').on('click', function() {
        if ($(this).hasClass('open')) {
            $('.js_open.open').removeClass('open');
        } else {
            $('.js_open.open').removeClass('open');
            $(this).toggleClass('open');
        }
    })

    $('.js_instruction-title').on('click', function() {
        $(this).closest('.js_instruction-block').find('.js_instruction').toggleClass('show');
    })

    $('.js_prev-dog').on('click', function() {
        var active = parseInt($('.js_active-element').attr('data-active'));
        $('.js_next-dog').removeClass('disabled');
        if (!$(this).hasClass('disabled')) {
            active--;
            var trsPosition = 'translateX(' + (-290 * (active - 1)) + 'px)';
            $('.js_mobile-dogs__slider').css("transform", trsPosition);
            $('.js_active-element').attr('data-active', active);
            $('.js_active-element').text(active);
            if (active === 1) {
                $(this).addClass('disabled');
            }
        }
    })
    $('.js_next-dog').on('click', function() {
        var active = parseInt($('.js_active-element').attr('data-active'));
        $('.js_prev-dog').removeClass('disabled');
        if (!$(this).hasClass('disabled')) {
            active++;
            var trsPosition = 'translateX(' + (-290 * (active - 1)) + 'px)';
            $('.js_mobile-dogs__slider').css("transform", trsPosition);
            $('.js_active-element').attr('data-active', active);
            $('.js_active-element').text(active);
            if (active === parseInt($(this).attr("data-end"))) {
                $(this).addClass('disabled');
            }
        }
    })

    $(document).on('scroll', function() {
        if ($('.js_header').offset().top >= 50) {
            $('.js_header').addClass('scroll');
        } else {
            $('.js_header').removeClass('scroll');
        }

        const mobileMessage = document.querySelector('.js_write-message_mobile');
        const mobileSaler = document.querySelector('.js_saler_mobile');

        if (mobileMessage && mobileSaler) {
            if (($(mobileMessage).offset().top + 50) >= $(mobileSaler).offset().top) {
                $(mobileMessage).addClass('hide');
            } else {
                $(mobileMessage).removeClass('hide');
            }
        }
    })

    const selects = document.querySelectorAll("select");
    
    if (selects) {
        for (var i = 0, len = selects.length; i < len; i++) {
            initSelectChoise(selects[i]);
        }
    };

    $("select").on("change", function() {
        $(this).closest('.select__container').removeClass('error');
        $(this).closest('.select__container').removeAttr('error-msg');
    })

    /******************************************
      
      Инициализация слайдера

    *******************************************/
    const slider = document.querySelector(".js-swiper");

    if (slider) {
        const paginationType = slider.getAttribute("paginationType")

        var swiper = new Swiper(slider, {
            slidesPerView: 1,
            spaceBetween: 10,
            loop: true,
            pagination: {
                el: '.js-swiper-pagination',
                type: paginationType,
            },
            navigation: {
                nextEl: '.js-swiper-button-next',
                prevEl: '.js-swiper-button-prev',
            },
        });
    }

    /*********************************************************************/

});


/******************************************************************************************
            
        Валидация полей форм

*******************************************************************************************/

function formValidate(inputs) {
    var isValid = true;
    const check = /.+@.+\..+/i;
    for (var i=0, len = inputs.length; i < len; i++) {
        if (inputs[i].required) {
            if (inputs[i].type === "text" && inputs[i].value === "") {
                isValid = false;
                inputs[i].parentElement.classList.add("error");
            } else if (inputs[i].type === "password" && inputs[i].value === "" || inputs[i].value.length < parseInt(inputs[i].getAttribute("minLength"))) {
                isValid = false;
                inputs[i].parentElement.classList.add("error");
            } else if ((inputs[i].type === "email" && !check.test(inputs[i].value))) {
                isValid = false;
                inputs[i].parentElement.classList.add("error");
            }
        }
    }

    return isValid;
};

function selectValidate(selects) {
    var isValid = true;

    for (var i = 0, len = selects.length; i <  len; i++) {
        if ((selects[i].value === 0 || selects[i].value === "") && selects[i].required) {
            isValid = false;
            $(selects[i]).closest('.select__container').addClass('error');
            $(selects[i]).closest('.select__container').attr('error-msg', selects[i].getAttribute("error-msg"));
        }
    }

    return isValid;
}


/***********************************************************************************/


/***********************************************************************************
    
    Сбор полей формы в json объект для отправки на сервер


************************************************************************************/
function formData(form) {
    const inputs = form.querySelectorAll("input");
    const selects = form.querySelectorAll("select");
    var data = {};

    for (var i=0, len = inputs.length; i < len; i++) {
        data[inputs[i].name] = inputs[i].value;
    }

    for (var i = 0, len = selects.length; i < len; i++) {
        data[selects[i].name] = selects[i].value;
    }

    return data;
};

/**************************************************************************************/


/**************************************************************************************

    Инициализация плагина стилизации селектов

**************************************************************************************/

function initSelectChoise(selectElement) {
    const selectBaseClass = "select"; 

    const selectChoices = new Choices(selectElement, {
        searchEnabled: false,
        shouldSort: false,
        classNames: {
            containerOuter: selectBaseClass + "__container",
            containerInner: selectBaseClass + "__inner",
            list: selectBaseClass + "__list",
            listSingle: selectBaseClass + "__label",
            listDropdown: selectBaseClass + "__dropdown",
            item: selectBaseClass + "__item",
            itemSelectable: selectBaseClass + "__item_selectable",
            itemChoice: selectBaseClass + "__dropdown-item",
            selectedState: selectBaseClass + "__dropdown-item_selected"
        }
    });
}