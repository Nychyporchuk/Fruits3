$(document).ready(function () {

    $('#burger').click(function () {
        $('#menu').addClass('open');
    });

    $('#menu').find('*').click(function () {
        $('#menu').removeClass('open');
    });

    $('.autoplay').slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        vertical: true,
        // autoplay: true,
        // autoplaySpeed: 1500,
        prevArrow: '<img src="../images/next-fr.png">',
        nextArrow: '<img src="../images/next-frd.png">',
        responsive: [
            {
                breakpoint: 1025,
                settings: {
                    vertical: false
                }
            }
        ]

    });

    $('.slider').slick({
        slidesToShow: 2,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 991,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    });
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function () {
            navLinks.forEach(link => link.classList.remove('active'));
            this.classList.add('active');
        });

        link.addEventListener('mouseleave', function () {
            this.classList.remove('active');
        });

        link.addEventListener('click', function () {
            navLinks.forEach(link => link.classList.remove('active'));
            this.classList.add('active');
        });
    });

    const deadline = new Date(2024, 5, 30);

    let timerId = null;

    function declensionNum(num, words) {
        const index = (num % 100 > 4 && num % 100 < 20) ? 2 : [2, 0, 1, 1, 1, 2][(num % 10 < 5) ? num % 10 : 5];

        return words[index];
    }


    function countdownTimer() {
        const diff = deadline - new Date();
        if (diff <= 0) {
            clearInterval(timerId);
        }

        const hours = diff > 0 ? Math.floor(diff / 1000 / 60 / 60) % 24 : 0;
        const minutes = diff > 0 ? Math.floor(diff / 1000 / 60) % 60 : 0;
        const seconds = diff > 0 ? Math.floor(diff / 1000) % 60 : 0;

        $('.timer__hours').text(hours < 10 ? '0' + hours : hours).attr('data-title', declensionNum(hours, ['час', 'часа', 'часов']));
        $('.timer__minutes').text(minutes < 10 ? '0' + minutes : minutes).attr('data-title', declensionNum(minutes, ['минута', 'минуты', 'минут']));
        $('.timer__seconds').text(seconds < 10 ? '0' + seconds : seconds).attr('data-title', declensionNum(seconds, ['секунда', 'секунды', 'секунд']));


    }


    countdownTimer();

    timerId = setInterval(countdownTimer, 1000);


    $('.orderButton').on('click', function () {
        $('#orderFormContainer').fadeIn();
    });


    $('.close').on('click', function () {
        $('#orderFormContainer').fadeOut();
    });


    $(window).on('click', function (event) {
        if ($(event.target).is('#orderFormContainer')) {
            $('#orderFormContainer').fadeOut();
        }
    });


    $('#orderForm').on('submit', function (event) {
        event.preventDefault();

        let error = formValidate(this);

        if (error === 0) {
            let formData = $(this).serialize();

            $.ajax({
                type: 'POST',
                url: 'https://testologia.ru/checkout',
                data: formData,
                success: function (response) {
                    if (response.success === 1) {
                        alert('Ваш заказ успешно принят, дождитесь звонка оператора.');
                        $('#orderFormContainer').fadeOut();
                        $('#orderForm')[0].reset();
                    } else {
                        alert('Ошибка: неверные данные');
                    }
                },
                error: function () {
                    alert('Ошибка при отправке формы');
                }
            });
        } else {
            alert('Заполните обязательные поля');
        }
    });

    function formValidate(form) {
        let error = 0;
        let formReq = form.querySelectorAll('._req');

        for (let index = 0; index < formReq.length; index++) {
            const input = formReq[index];
            formRemoveError(input);

            if (input.classList.contains('_email')) {
                if (emailTest(input)) {
                    formAddError(input);
                    error++;
                }
            } else if (input.getAttribute("type") === "checkbox" && input.checked === false) {
                formAddError(input);
                error++;
            } else {
                if (input.value === '') {
                    formAddError(input);
                    error++;
                }
            }
        }
        return error;
    }

    function formAddError(input) {
        input.parentElement.classList.add('_error');
        input.classList.add('_error');
    }

    function formRemoveError(input) {
        input.parentElement.classList.remove('_error');
        input.classList.remove('_error');
    }


    function emailTest(input) {
        return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
    }


});


