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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtYWluLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIiQoZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgZHJvcHpvbmVFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkcm9wem9uZVwiKTtcclxuICAgICQoJy5zY3JvbGwtcGFuZScpLmpTY3JvbGxQYW5lKHsgd2hlZWxTcGVlZDogNSB9KTtcclxuXHJcbiAgICBpZihkcm9wem9uZUVsZW1lbnQpIHtcclxuICAgICAgICBkcm9wem9uZUVsZW1lbnQgPSBuZXcgRHJvcHpvbmUoZHJvcHpvbmVFbGVtZW50LCB7IHVybDogXCIvXCIsICBhZGRSZW1vdmVMaW5rczogdHJ1ZSx9KTtcclxuICAgIH1cclxuXHJcbiAgICAkKCcjZHJvcHpvbmVfbW9iaWxlJykuZHJvcHpvbmUoeyB1cmw6IFwiL1wiIH0pXHJcbn0pO1xyXG5cclxuJChmdW5jdGlvbigpIHtcclxuICAgIHZhciAkeG1wbCA9ICQoJyNqc190cmFuY2F0ZS1ib3gnKTtcclxuICAgICR4bXBsLmRvdGRvdGRvdCh7XHJcblxyXG4gICAgICAgIGhlaWdodDogMjcwLFxyXG4gICAgICAgIGtlZXA6ICcuanNfbW9yZS1pbmZvJyxcclxuXHJcbiAgICB9KVxyXG5cclxuICAgIC8vIEdldCB0aGUgZG90ZG90ZG90IEFQSVxyXG4gICAgdmFyIGFwaSA9ICR4bXBsLmRhdGEoJ2RvdGRvdGRvdCcpO1xyXG5cclxuICAgICR4bXBsLm9uKFxyXG4gICAgICAgICdjbGljaycsXHJcbiAgICAgICAgJy5qc19tb3JlLWluZm8nLFxyXG4gICAgICAgIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAgICAgLy9cdFdoZW4gdHJ1bmNhdGVkLCByZXN0b3JlXHJcbiAgICAgICAgICAgIGlmICgkeG1wbC5oYXNDbGFzcygnZGRkLXRydW5jYXRlZCcpKSB7XHJcbiAgICAgICAgICAgICAgICBhcGkucmVzdG9yZSgpO1xyXG4gICAgICAgICAgICAgICAgJHhtcGwuYWRkQ2xhc3MoJ2Z1bGwtc3RvcnknKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy9cdE5vdCB0cnVuY2F0ZWQsIHRydW5jYXRlXHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgJHhtcGwucmVtb3ZlQ2xhc3MoJ2Z1bGwtc3RvcnknKTtcclxuICAgICAgICAgICAgICAgIGFwaS50cnVuY2F0ZSgpO1xyXG4gICAgICAgICAgICAgICAgYXBpLndhdGNoKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICApO1xyXG59KVxyXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHtcclxuXHJcbiAgICAkKCcuanMtcmVzZXRfZmlsdGVyJykub24oXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBjb25zdCBmaWx0ZXJJbnB1dHMgPSAkKHRoaXMpLmNsb3Nlc3QoXCIuanMtZmlsdGVyXCIpLmZpbmQoXCIuanNfY2hlY2tcIik7XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBmaWx0ZXJJbnB1dHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKCQoZmlsdGVySW5wdXRzW2ldKS5oYXNDbGFzcygnYWN0aXZlJykpIHtcclxuICAgICAgICAgICAgICAgICQoZmlsdGVySW5wdXRzW2ldKS5jbGljaygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuXHJcbiAgICAkKFwiaW5wdXRcIikub24oXCJjaGFuZ2VcIiwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucGFyZW50RWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoXCJlcnJvclwiKSkge1xyXG4gICAgICAgICAgICB0aGlzLnBhcmVudEVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShcImVycm9yXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH0pXHJcblxyXG4gICAgJChcIi5qc19pbi1mb3JtXCIpLm9uKFwic3VibWl0XCIsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGZvcm1JbnB1dHMgPSB0aGlzLnF1ZXJ5U2VsZWN0b3JBbGwoXCJpbnB1dFwiKTtcclxuICAgICAgICBjb25zdCBmb3JtU2VsZWN0cyA9ICB0aGlzLnF1ZXJ5U2VsZWN0b3JBbGwoXCJzZWxlY3RcIik7XHJcbiAgICAgICAgY29uc3QgaW5wdXRWYWxpZCA9IGZvcm1WYWxpZGF0ZShmb3JtSW5wdXRzKTtcclxuICAgICAgICBjb25zdCB1cmwgPSB0aGlzLnVybDtcclxuICAgICAgICBjb25zdCBkYXRhID0gZm9ybURhdGEodGhpcyk7XHJcblxyXG4gICAgICAgIGlmIChpbnB1dFZhbGlkKSB7XHJcbiAgICAgICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICB1cmw6IHVybCxcclxuICAgICAgICAgICAgICAgIHR5cGU6ICdQT1NUJyxcclxuICAgICAgICAgICAgICAgIGRhdGFUeXBlOiBcImpzb25cIixcclxuICAgICAgICAgICAgICAgIGRhdGE6IGRhdGEsXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5kb25lKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzdWNjZXNzXCIpOyBcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmZhaWwoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImVycm9yXCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuXHJcbiAgICAkKFwiLmpzLXNpZ24tdXAtZm9ybVwiKS5vbihcInN1Ym1pdFwiLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIC8vIHRoaXMuc2V0QXR0cmlidXRlKFwibm92YWxpZGF0ZVwiLCB0cnVlKTtcclxuICAgICAgICBjb25zdCBmb3JtSW5wdXRzID0gdGhpcy5xdWVyeVNlbGVjdG9yQWxsKFwiaW5wdXRcIik7XHJcbiAgICAgICAgY29uc3QgZm9ybVNlbGVjdHMgPSAgdGhpcy5xdWVyeVNlbGVjdG9yQWxsKFwic2VsZWN0XCIpO1xyXG4gICAgICAgIGNvbnN0IGlucHV0VmFsaWQgPSBmb3JtVmFsaWRhdGUoZm9ybUlucHV0cyk7XHJcbiAgICAgICAgY29uc3Qgc2VsZWN0VmFsaWQgPSBzZWxlY3RWYWxpZGF0ZShmb3JtU2VsZWN0cyk7XHJcbiAgICAgICAgY29uc3QgdXJsID0gdGhpcy51cmw7XHJcbiAgICAgICAgY29uc3QgZGF0YSA9IGZvcm1EYXRhKHRoaXMpO1xyXG5cclxuICAgICAgICBpZiAoaW5wdXRWYWxpZCAmJiBzZWxlY3RWYWxpZCkge1xyXG4gICAgICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgdXJsOiB1cmwsXHJcbiAgICAgICAgICAgICAgICB0eXBlOiAnUE9TVCcsXHJcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogXCJqc29uXCIsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiBkYXRhLFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuZG9uZShmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuZmFpbChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZXJyb3JcIik7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5hbHdheXMoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImNvbXBsZXRlXCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuXHJcbiAgICAvLyAkKGRvY3VtZW50KS5vbihcImNsaWNrXCIsIGZ1bmN0aW9uKGUpIHtcclxuICAgIC8vICAgICBpZiAoISgkKGUudGFyZ2V0KSA9PT0gJChcIi5qc19jdXJyZW5jeV9fbGlzdFwiKSB8fCAkKGUudGFyZ2V0KSA9PT0gJChcIi5qc19jdXJyZW5jeVwiKSkpIHtcclxuICAgIC8vICAgICAgICAgJCgnLmpzX2N1cnJlbmN5X19saXN0JykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgLy8gICAgIH1cclxuICAgIC8vIH0pXHJcblxyXG4gICAgJCgnLmpzX21lbnVfYWN0aXZlJykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgJCh0aGlzKS50b2dnbGVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgJCgnLmpzX21lbnVfX2xpc3RzJykudG9nZ2xlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICQoJy5qc19tZW51X19saXN0JykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgIHZhciBkcm9wTWVudSA9ICQoJy5qc19saXN0X19pdGVtX3RpdHRsZScpLmNsb3Nlc3QoJy5qc19tZW51X19saXN0JykuZmluZCgnLmpzX2Ryb3Bkb3duX21lbnUnKTtcclxuICAgICAgICBkcm9wTWVudS5zbGlkZVVwKDEwMCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkKCcuanNfbGlzdF9faXRlbV90aXR0bGUnKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgZHJvcE1lbnUgPSAkKHRoaXMpLmNsb3Nlc3QoJy5qc19tZW51X19saXN0JykuZmluZCgnLmpzX2Ryb3Bkb3duX21lbnUnKTtcclxuICAgICAgICAkKHRoaXMpLmNsb3Nlc3QoJy5qc19tZW51X19saXN0JykudG9nZ2xlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgIGlmIChkcm9wTWVudS5jc3MoJ2Rpc3BsYXknKSA9PT0gJ25vbmUnKSB7XHJcbiAgICAgICAgICAgIGRyb3BNZW51LnNsaWRlRG93big1MDApO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGRyb3BNZW51LnNsaWRlVXAoNTAwKTtcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG5cclxuICAgIGlmICgkKHdpbmRvdykud2lkdGgoKSA+IDEyMDApIHtcclxuICAgICAgICAkKCcuanNfY3VycmVuY3knKS5vbignbW91c2VlbnRlcicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAkKCcuanNfY3VycmVuY3lfX2xpc3QnKS50b2dnbGVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAkKCcuanNfY3VycmVuY3knKS5vbignbW91c2VsZWF2ZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAkKHRoaXMpLm1vdXNlZW50ZXIoKTtcclxuICAgICAgICB9KVxyXG4gICAgfSBlbHNlICB7XHJcbiAgICAgICAgJCgnLmpzX2N1cnJlbmN5Jykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICQoJy5qc19jdXJyZW5jeV9fbGlzdCcpLnRvZ2dsZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgICQod2luZG93KS5yZXNpemUoZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgICBpZiAoJCh3aW5kb3cpLndpZHRoKCkgPiAxMjAwKSB7XHJcbiAgICAgICAgICAgICQoJy5qc19jdXJyZW5jeScpLm9mZihcImNsaWNrXCIpO1xyXG4gICAgICAgICAgICAkKCcuanNfY3VycmVuY3knKS5vbignbW91c2VlbnRlcicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgJCgnLmpzX2N1cnJlbmN5X19saXN0JykudG9nZ2xlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAkKCcuanNfY3VycmVuY3knKS5vbignbW91c2VsZWF2ZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5tb3VzZWVudGVyKCk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgJCgnLmpzX2N1cnJlbmN5Jykub2ZmKFwibW91c2VlbnRlclwiKTtcclxuICAgICAgICAgICAgJCgnLmpzX2N1cnJlbmN5Jykub2ZmKFwibW91c2VsZWF2ZVwiKTtcclxuICAgICAgICAgICAgJCgnLmpzX2N1cnJlbmN5Jykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAkKCcuanNfY3VycmVuY3lfX2xpc3QnKS50b2dnbGVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICAkKCcuanNfY3VycmVuY3lfaXRlbScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICQoJy5qc19jdXJyZW5jeV9hY3RpdmUnKS50ZXh0KCQodGhpcykudGV4dCgpKTtcclxuICAgICAgICAkKCcuanNfY3VycmVuY3lfaXRlbScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKVxyXG4gICAgICAgICQodGhpcykudG9nZ2xlQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cclxuICAgIH0pXHJcbiAgICAkKCcuanNfY2hlY2snKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgYm94ID0gJCh0aGlzKS5jbG9zZXN0KCcuanNfYm94Jyk7XHJcbiAgICAgICAgYm94LmZpbmQoJy5qc19jaGVjaycpLnRvZ2dsZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICBpZiAoYm94LmZpbmQoJy5qc19jaGVja2JveCcpLmF0dHIoJ2NoZWNrZWQnKSkge1xyXG4gICAgICAgICAgICBib3guZmluZCgnLmpzX2NoZWNrYm94JykucmVtb3ZlQXR0cignY2hlY2tlZCcpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGJveC5maW5kKCcuanNfY2hlY2tib3gnKS5hdHRyKCdjaGVja2VkJywgJ2NoZWNrZWQnKTtcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG5cclxuICAgIC8vIFBvcHVwIGFjdGl2ZSBhY3Rpb25zXHJcbiAgICAkKCcuanNfc2lnbi1pbicpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICQoJy5qc19sb2dpbicpLnRvZ2dsZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAkKCcuanNfZm9yZ290JykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgfSlcclxuICAgICQoJy5qc19yZXNldC1wYXNzJykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgJCgnLmpzX2xvZ2luJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICQoJy5qc19mb3Jnb3QnKS50b2dnbGVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICB9KVxyXG5cclxuICAgIC8vIENsb3NlIHBvcHVwIGJsb2Nrc1xyXG4gICAgJCgnLmpzX2Nsb3NlJykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY29uc3QgcG9wdXBJbnB1dHMgPSB0aGlzLmNsb3Nlc3QoJy5qc19wb3B1cCcpLnF1ZXJ5U2VsZWN0b3JBbGwoXCJpbnB1dFwiKTtcclxuXHJcbiAgICAgICAgaWYgKHBvcHVwSW5wdXRzLmxlbmd0aCAhPT0gMCkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gcG9wdXBJbnB1dHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHBvcHVwSW5wdXRzW2ldLnBhcmVudE5vZGUuY2xhc3NMaXN0LnJlbW92ZShcImVycm9yXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkKHRoaXMpLmNsb3Nlc3QoJy5qc19wb3B1cCcpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAkKCcuanNfcGFzc3dvcmQnKS5hdHRyKCd0eXBlJywgJ3Bhc3N3b3JkJyk7XHJcbiAgICB9KVxyXG5cclxuXHJcbiAgICAkKCcuanNfc2hvdy1wYXNzJykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKCQoJy5qc19wYXNzd29yZCcpLmF0dHIoJ3R5cGUnKSA9PT0gJ3RleHQnKSB7XHJcbiAgICAgICAgICAgICQoJy5qc19wYXNzd29yZCcpLmF0dHIoJ3R5cGUnLCAncGFzc3dvcmQnKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAkKCcuanNfcGFzc3dvcmQnKS5hdHRyKCd0eXBlJywgJ3RleHQnKTtcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG4gICAgJCgnLmpzX3Nob3ctbGlzdCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICQodGhpcykuY2xvc2VzdCgnLmpzX2JveCcpLmZpbmQoJy5qc19kcm9wLWxpc3QnKS50b2dnbGVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgJCh0aGlzKS5jbG9zZXN0KCcuanNfYm94JykuZmluZCgnLmpzX3Nob3ctbGlzdCcpLnRvZ2dsZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAkKHRoaXMpLmNsb3Nlc3QoJy5qc19ib3gnKS50b2dnbGVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICB9KVxyXG4gICAgJCgnLmpzX2l0ZW0nKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgdGV4dCA9ICQodGhpcykudGV4dCgpO1xyXG4gICAgICAgICQodGhpcykuY2xvc2VzdCgnLmpzX2JveCcpLmZpbmQoJy5qc19sYWJlbCcpLnRleHQodGV4dCk7XHJcbiAgICAgICAgJCh0aGlzKS5jbG9zZXN0KCcuanNfYm94JykuZmluZCgnLmpzX2xhYmVsJykuYWRkQ2xhc3MoJ2Nob29zZScpOztcclxuICAgICAgICAkKHRoaXMpLmNsb3Nlc3QoJy5qc19kcm9wLWxpc3QnKS50b2dnbGVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgJCh0aGlzKS5jbG9zZXN0KCcuanNfYm94JykuZmluZCgnLmpzX3Nob3ctbGlzdCcpLnRvZ2dsZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgIH0pXHJcbiAgICAkKCcuanNfaW5wdXQnKS5vbignY2hhbmdlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgJCh0aGlzKS5jbG9zZXN0KCcuanNfaW5wdXQtYmxvY2snKS5yZW1vdmVDbGFzcygnZXJyb3InKTtcclxuICAgIH0pXHJcbiAgICAkKCcuanNfa2VubmVsX2NoZWNrJykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgJCgnLmpzX2tlbm5lbCcpLnRvZ2dsZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAkKCcuanNfa2VubmVsX2NoZWNrJykudG9nZ2xlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgfSlcclxuXHJcbiAgICAkKCcuanNfc3Vic2NyaWJlJykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIGJsb2NrID0gJCh0aGlzKS5jbG9zZXN0KCcuanNfc3Vic2NyaWJlLWJsb2NrJyksXHJcbiAgICAgICAgICAgIGlucHV0ID0gYmxvY2suZmluZCgnLmpzX2lucHV0JyksXHJcbiAgICAgICAgICAgIGNoZWNrID0gLy4rQC4rXFwuLisvaTtcclxuICAgICAgICBpZiAoY2hlY2sudGVzdChpbnB1dFswXS52YWx1ZSkpIHtcclxuICAgICAgICAgICAgYmxvY2suZmluZCgnLmpzX3dyYXBwZXInKS50b2dnbGVDbGFzcygnaGlkZGVuJyk7XHJcbiAgICAgICAgICAgIGJsb2NrLmZpbmQoJy5qc19hY3RpdmUnKS50b2dnbGVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgIGJsb2NrLmZpbmQoJy5qc19tYWlsJykudGV4dChpbnB1dFswXS52YWx1ZSk7XHJcbiAgICAgICAgICAgIGJsb2NrLmFkZENsYXNzKCdzdWNjZXNzJyk7XHJcbiAgICAgICAgICAgIGlucHV0WzBdLnZhbHVlID0gJyc7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgYmxvY2suZmluZCgnLmpzX2lucHV0LWJsb2NrJykuYWRkQ2xhc3MoJ2Vycm9yJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuICAgICQoJy5qc19zdWJzY3JpYmUtZm9ybScpLnN1Ym1pdChmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgJCgnLmpzX3N1YnNjcmliZScpLmNsaWNrKCk7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICB9KTtcclxuXHJcblxyXG4gICAgJCgnLmpzX2xpa2UnKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAkKHRoaXMpLnRvZ2dsZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgIH0pXHJcbiAgICAkKCcuanNfaGVscCcpLm9uKCdtb3VzZWVudGVyJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgJCh0aGlzKS5maW5kKCcuanNfaGVscC1ibG9jaycpLnRvZ2dsZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgIH0pXHJcbiAgICAkKCcuanNfaGVscCcpLm9uKCdtb3VzZWxlYXZlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgJCh0aGlzKS5maW5kKCcuanNfaGVscC1ibG9jaycpLnRvZ2dsZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgIH0pXHJcbiAgICAkKCcuanNfY29udGFjdC1mb3JtJykub24oJ3N1Ym1pdCcsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAkKHRoaXMpLmNsb3Nlc3QoJy5qc19jb250YWN0JykudG9nZ2xlQ2xhc3MoJ3N1Y2Nlc3MnKTtcclxuICAgIH0pXHJcbiAgICAkKCcuanNfc2VuZC1tZXNzYWdlJykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgJCgnLmpzX2NvbnRhY3QtZm9ybScpLnN1Ym1pdCgpO1xyXG4gICAgfSlcclxuICAgICQoJy5qc193cml0ZS1tZXNzYWdlJykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgJCgnLmpzX2NvbnRhY3QnKS50b2dnbGVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICB9KVxyXG4gICAgJCgnLmpzX2Zvcm0tc3VjY2VzcycpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICQoJ3RleHRhcmVhJykudmFsKCcnKTtcclxuICAgICAgICAkKCcuanNfY29udGFjdCcpLnRvZ2dsZUNsYXNzKCdzdWNjZXNzJyk7XHJcbiAgICB9KVxyXG5cclxuICAgICQoJy5qc19kZWxldGUnKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgYmxvY2sgPSAkKHRoaXMpLmNsb3Nlc3QoJy5qc19kb2cnKTtcclxuICAgICAgICBibG9jay50b2dnbGVDbGFzcygnZGVsZXRlJyk7XHJcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHsgYmxvY2sucmVtb3ZlKCkgfSwgMTAwMCk7XHJcbiAgICB9KVxyXG5cclxuICAgICQoJy5qc19vcGVuJykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKCQodGhpcykuaGFzQ2xhc3MoJ29wZW4nKSkge1xyXG4gICAgICAgICAgICAkKCcuanNfb3Blbi5vcGVuJykucmVtb3ZlQ2xhc3MoJ29wZW4nKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAkKCcuanNfb3Blbi5vcGVuJykucmVtb3ZlQ2xhc3MoJ29wZW4nKTtcclxuICAgICAgICAgICAgJCh0aGlzKS50b2dnbGVDbGFzcygnb3BlbicpO1xyXG4gICAgICAgIH1cclxuICAgIH0pXHJcblxyXG4gICAgJCgnLmpzX2luc3RydWN0aW9uLXRpdGxlJykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgJCh0aGlzKS5jbG9zZXN0KCcuanNfaW5zdHJ1Y3Rpb24tYmxvY2snKS5maW5kKCcuanNfaW5zdHJ1Y3Rpb24nKS50b2dnbGVDbGFzcygnc2hvdycpO1xyXG4gICAgfSlcclxuXHJcbiAgICAkKCcuanNfcHJldi1kb2cnKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgYWN0aXZlID0gcGFyc2VJbnQoJCgnLmpzX2FjdGl2ZS1lbGVtZW50JykuYXR0cignZGF0YS1hY3RpdmUnKSk7XHJcbiAgICAgICAgJCgnLmpzX25leHQtZG9nJykucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJyk7XHJcbiAgICAgICAgaWYgKCEkKHRoaXMpLmhhc0NsYXNzKCdkaXNhYmxlZCcpKSB7XHJcbiAgICAgICAgICAgIGFjdGl2ZS0tO1xyXG4gICAgICAgICAgICB2YXIgdHJzUG9zaXRpb24gPSAndHJhbnNsYXRlWCgnICsgKC0yOTAgKiAoYWN0aXZlIC0gMSkpICsgJ3B4KSc7XHJcbiAgICAgICAgICAgICQoJy5qc19tb2JpbGUtZG9nc19fc2xpZGVyJykuY3NzKFwidHJhbnNmb3JtXCIsIHRyc1Bvc2l0aW9uKTtcclxuICAgICAgICAgICAgJCgnLmpzX2FjdGl2ZS1lbGVtZW50JykuYXR0cignZGF0YS1hY3RpdmUnLCBhY3RpdmUpO1xyXG4gICAgICAgICAgICAkKCcuanNfYWN0aXZlLWVsZW1lbnQnKS50ZXh0KGFjdGl2ZSk7XHJcbiAgICAgICAgICAgIGlmIChhY3RpdmUgPT09IDEpIHtcclxuICAgICAgICAgICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ2Rpc2FibGVkJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9KVxyXG4gICAgJCgnLmpzX25leHQtZG9nJykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIGFjdGl2ZSA9IHBhcnNlSW50KCQoJy5qc19hY3RpdmUtZWxlbWVudCcpLmF0dHIoJ2RhdGEtYWN0aXZlJykpO1xyXG4gICAgICAgICQoJy5qc19wcmV2LWRvZycpLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpO1xyXG4gICAgICAgIGlmICghJCh0aGlzKS5oYXNDbGFzcygnZGlzYWJsZWQnKSkge1xyXG4gICAgICAgICAgICBhY3RpdmUrKztcclxuICAgICAgICAgICAgdmFyIHRyc1Bvc2l0aW9uID0gJ3RyYW5zbGF0ZVgoJyArICgtMjkwICogKGFjdGl2ZSAtIDEpKSArICdweCknO1xyXG4gICAgICAgICAgICAkKCcuanNfbW9iaWxlLWRvZ3NfX3NsaWRlcicpLmNzcyhcInRyYW5zZm9ybVwiLCB0cnNQb3NpdGlvbik7XHJcbiAgICAgICAgICAgICQoJy5qc19hY3RpdmUtZWxlbWVudCcpLmF0dHIoJ2RhdGEtYWN0aXZlJywgYWN0aXZlKTtcclxuICAgICAgICAgICAgJCgnLmpzX2FjdGl2ZS1lbGVtZW50JykudGV4dChhY3RpdmUpO1xyXG4gICAgICAgICAgICBpZiAoYWN0aXZlID09PSBwYXJzZUludCgkKHRoaXMpLmF0dHIoXCJkYXRhLWVuZFwiKSkpIHtcclxuICAgICAgICAgICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ2Rpc2FibGVkJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9KVxyXG5cclxuICAgICQoZG9jdW1lbnQpLm9uKCdzY3JvbGwnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBpZiAoJCgnLmpzX2hlYWRlcicpLm9mZnNldCgpLnRvcCA+PSA1MCkge1xyXG4gICAgICAgICAgICAkKCcuanNfaGVhZGVyJykuYWRkQ2xhc3MoJ3Njcm9sbCcpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICQoJy5qc19oZWFkZXInKS5yZW1vdmVDbGFzcygnc2Nyb2xsJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBtb2JpbGVNZXNzYWdlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmpzX3dyaXRlLW1lc3NhZ2VfbW9iaWxlJyk7XHJcbiAgICAgICAgY29uc3QgbW9iaWxlU2FsZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuanNfc2FsZXJfbW9iaWxlJyk7XHJcblxyXG4gICAgICAgIGlmIChtb2JpbGVNZXNzYWdlICYmIG1vYmlsZVNhbGVyKSB7XHJcbiAgICAgICAgICAgIGlmICgoJChtb2JpbGVNZXNzYWdlKS5vZmZzZXQoKS50b3AgKyA1MCkgPj0gJChtb2JpbGVTYWxlcikub2Zmc2V0KCkudG9wKSB7XHJcbiAgICAgICAgICAgICAgICAkKG1vYmlsZU1lc3NhZ2UpLmFkZENsYXNzKCdoaWRlJyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAkKG1vYmlsZU1lc3NhZ2UpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9KVxyXG5cclxuICAgIGNvbnN0IHNlbGVjdHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwic2VsZWN0XCIpO1xyXG4gICAgXHJcbiAgICBpZiAoc2VsZWN0cykge1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBzZWxlY3RzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIGluaXRTZWxlY3RDaG9pc2Uoc2VsZWN0c1tpXSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAkKFwic2VsZWN0XCIpLm9uKFwiY2hhbmdlXCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICQodGhpcykuY2xvc2VzdCgnLnNlbGVjdF9fY29udGFpbmVyJykucmVtb3ZlQ2xhc3MoJ2Vycm9yJyk7XHJcbiAgICAgICAgJCh0aGlzKS5jbG9zZXN0KCcuc2VsZWN0X19jb250YWluZXInKS5yZW1vdmVBdHRyKCdlcnJvci1tc2cnKTtcclxuICAgIH0pXHJcblxyXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4gICAgICBcclxuICAgICAg0JjQvdC40YbQuNCw0LvQuNC30LDRhtC40Y8g0YHQu9Cw0LnQtNC10YDQsFxyXG5cclxuICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcbiAgICBjb25zdCBzbGlkZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmpzLXN3aXBlclwiKTtcclxuXHJcbiAgICBpZiAoc2xpZGVyKSB7XHJcbiAgICAgICAgY29uc3QgcGFnaW5hdGlvblR5cGUgPSBzbGlkZXIuZ2V0QXR0cmlidXRlKFwicGFnaW5hdGlvblR5cGVcIilcclxuXHJcbiAgICAgICAgdmFyIHN3aXBlciA9IG5ldyBTd2lwZXIoc2xpZGVyLCB7XHJcbiAgICAgICAgICAgIHNsaWRlc1BlclZpZXc6IDEsXHJcbiAgICAgICAgICAgIHNwYWNlQmV0d2VlbjogMTAsXHJcbiAgICAgICAgICAgIGxvb3A6IHRydWUsXHJcbiAgICAgICAgICAgIHBhZ2luYXRpb246IHtcclxuICAgICAgICAgICAgICAgIGVsOiAnLmpzLXN3aXBlci1wYWdpbmF0aW9uJyxcclxuICAgICAgICAgICAgICAgIHR5cGU6IHBhZ2luYXRpb25UeXBlLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBuYXZpZ2F0aW9uOiB7XHJcbiAgICAgICAgICAgICAgICBuZXh0RWw6ICcuanMtc3dpcGVyLWJ1dHRvbi1uZXh0JyxcclxuICAgICAgICAgICAgICAgIHByZXZFbDogJy5qcy1zd2lwZXItYnV0dG9uLXByZXYnLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcblxyXG59KTtcclxuXHJcblxyXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgINCS0LDQu9C40LTQsNGG0LjRjyDQv9C+0LvQtdC5INGE0L7RgNC8XHJcblxyXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG5cclxuZnVuY3Rpb24gZm9ybVZhbGlkYXRlKGlucHV0cykge1xyXG4gICAgdmFyIGlzVmFsaWQgPSB0cnVlO1xyXG4gICAgY29uc3QgY2hlY2sgPSAvLitALitcXC4uKy9pO1xyXG4gICAgZm9yICh2YXIgaT0wLCBsZW4gPSBpbnB1dHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgICBpZiAoaW5wdXRzW2ldLnJlcXVpcmVkKSB7XHJcbiAgICAgICAgICAgIGlmIChpbnB1dHNbaV0udHlwZSA9PT0gXCJ0ZXh0XCIgJiYgaW5wdXRzW2ldLnZhbHVlID09PSBcIlwiKSB7XHJcbiAgICAgICAgICAgICAgICBpc1ZhbGlkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBpbnB1dHNbaV0ucGFyZW50RWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiZXJyb3JcIik7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaW5wdXRzW2ldLnR5cGUgPT09IFwicGFzc3dvcmRcIiAmJiBpbnB1dHNbaV0udmFsdWUgPT09IFwiXCIgfHwgaW5wdXRzW2ldLnZhbHVlLmxlbmd0aCA8IHBhcnNlSW50KGlucHV0c1tpXS5nZXRBdHRyaWJ1dGUoXCJtaW5MZW5ndGhcIikpKSB7XHJcbiAgICAgICAgICAgICAgICBpc1ZhbGlkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBpbnB1dHNbaV0ucGFyZW50RWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiZXJyb3JcIik7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoKGlucHV0c1tpXS50eXBlID09PSBcImVtYWlsXCIgJiYgIWNoZWNrLnRlc3QoaW5wdXRzW2ldLnZhbHVlKSkpIHtcclxuICAgICAgICAgICAgICAgIGlzVmFsaWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIGlucHV0c1tpXS5wYXJlbnRFbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJlcnJvclwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gaXNWYWxpZDtcclxufTtcclxuXHJcbmZ1bmN0aW9uIHNlbGVjdFZhbGlkYXRlKHNlbGVjdHMpIHtcclxuICAgIHZhciBpc1ZhbGlkID0gdHJ1ZTtcclxuXHJcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gc2VsZWN0cy5sZW5ndGg7IGkgPCAgbGVuOyBpKyspIHtcclxuICAgICAgICBpZiAoKHNlbGVjdHNbaV0udmFsdWUgPT09IDAgfHwgc2VsZWN0c1tpXS52YWx1ZSA9PT0gXCJcIikgJiYgc2VsZWN0c1tpXS5yZXF1aXJlZCkge1xyXG4gICAgICAgICAgICBpc1ZhbGlkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICQoc2VsZWN0c1tpXSkuY2xvc2VzdCgnLnNlbGVjdF9fY29udGFpbmVyJykuYWRkQ2xhc3MoJ2Vycm9yJyk7XHJcbiAgICAgICAgICAgICQoc2VsZWN0c1tpXSkuY2xvc2VzdCgnLnNlbGVjdF9fY29udGFpbmVyJykuYXR0cignZXJyb3ItbXNnJywgc2VsZWN0c1tpXS5nZXRBdHRyaWJ1dGUoXCJlcnJvci1tc2dcIikpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gaXNWYWxpZDtcclxufVxyXG5cclxuXHJcbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuXHJcblxyXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuICAgIFxyXG4gICAg0KHQsdC+0YAg0L/QvtC70LXQuSDRhNC+0YDQvNGLINCyIGpzb24g0L7QsdGK0LXQutGCINC00LvRjyDQvtGC0L/RgNCw0LLQutC4INC90LAg0YHQtdGA0LLQtdGAXHJcblxyXG5cclxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG5mdW5jdGlvbiBmb3JtRGF0YShmb3JtKSB7XHJcbiAgICBjb25zdCBpbnB1dHMgPSBmb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoXCJpbnB1dFwiKTtcclxuICAgIGNvbnN0IHNlbGVjdHMgPSBmb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoXCJzZWxlY3RcIik7XHJcbiAgICB2YXIgZGF0YSA9IHt9O1xyXG5cclxuICAgIGZvciAodmFyIGk9MCwgbGVuID0gaW5wdXRzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgZGF0YVtpbnB1dHNbaV0ubmFtZV0gPSBpbnB1dHNbaV0udmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHNlbGVjdHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgICBkYXRhW3NlbGVjdHNbaV0ubmFtZV0gPSBzZWxlY3RzW2ldLnZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBkYXRhO1xyXG59O1xyXG5cclxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG5cclxuXHJcbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5cclxuICAgINCY0L3QuNGG0LjQsNC70LjQt9Cw0YbQuNGPINC/0LvQsNCz0LjQvdCwINGB0YLQuNC70LjQt9Cw0YbQuNC4INGB0LXQu9C10LrRgtC+0LJcclxuXHJcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG5cclxuZnVuY3Rpb24gaW5pdFNlbGVjdENob2lzZShzZWxlY3RFbGVtZW50KSB7XHJcbiAgICBjb25zdCBzZWxlY3RCYXNlQ2xhc3MgPSBcInNlbGVjdFwiOyBcclxuXHJcbiAgICBjb25zdCBzZWxlY3RDaG9pY2VzID0gbmV3IENob2ljZXMoc2VsZWN0RWxlbWVudCwge1xyXG4gICAgICAgIHNlYXJjaEVuYWJsZWQ6IGZhbHNlLFxyXG4gICAgICAgIHNob3VsZFNvcnQ6IGZhbHNlLFxyXG4gICAgICAgIGNsYXNzTmFtZXM6IHtcclxuICAgICAgICAgICAgY29udGFpbmVyT3V0ZXI6IHNlbGVjdEJhc2VDbGFzcyArIFwiX19jb250YWluZXJcIixcclxuICAgICAgICAgICAgY29udGFpbmVySW5uZXI6IHNlbGVjdEJhc2VDbGFzcyArIFwiX19pbm5lclwiLFxyXG4gICAgICAgICAgICBsaXN0OiBzZWxlY3RCYXNlQ2xhc3MgKyBcIl9fbGlzdFwiLFxyXG4gICAgICAgICAgICBsaXN0U2luZ2xlOiBzZWxlY3RCYXNlQ2xhc3MgKyBcIl9fbGFiZWxcIixcclxuICAgICAgICAgICAgbGlzdERyb3Bkb3duOiBzZWxlY3RCYXNlQ2xhc3MgKyBcIl9fZHJvcGRvd25cIixcclxuICAgICAgICAgICAgaXRlbTogc2VsZWN0QmFzZUNsYXNzICsgXCJfX2l0ZW1cIixcclxuICAgICAgICAgICAgaXRlbVNlbGVjdGFibGU6IHNlbGVjdEJhc2VDbGFzcyArIFwiX19pdGVtX3NlbGVjdGFibGVcIixcclxuICAgICAgICAgICAgaXRlbUNob2ljZTogc2VsZWN0QmFzZUNsYXNzICsgXCJfX2Ryb3Bkb3duLWl0ZW1cIixcclxuICAgICAgICAgICAgc2VsZWN0ZWRTdGF0ZTogc2VsZWN0QmFzZUNsYXNzICsgXCJfX2Ryb3Bkb3duLWl0ZW1fc2VsZWN0ZWRcIlxyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59Il0sImZpbGUiOiJtYWluLmpzIn0=
