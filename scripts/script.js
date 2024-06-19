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
        autoplay: true,
        autoplaySpeed: 1500,
        prevArrow: '<img src="../images/next-fr.png">',
        nextArrow: '<img src="../images/next-frd.png">',
        responsive: [
            {
                breakpoint: 1026,
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



    $('.close').on('click', function () {
        $('#orderFormContainer').fadeOut();
    });


    $(window).on('click', function (event) {
        if ($(event.target).is('#orderFormContainer')) {
            $('#orderFormContainer').fadeOut();
        }
    });



        let $orderForm = $('#orderForm');
        let $thankYouBlock = $('.thank-you');
        let $orderButton = $('.orderButton');


        function hideThankYouBlock() {
            $thankYouBlock.hide();
        }


        $(document).on('click', function (event) {
            if (!$(event.target).closest('.thank-you').length) {
                hideThankYouBlock();
            }
        });


        $orderForm.on('submit', function(event) {
            event.preventDefault();

            let error = formValidate(this);

            if (error === 0) {
                let formData = $(this).serialize();

                $(this).addClass('_sending');

                $.ajax({
                    type: 'POST',
                    url: 'https://testologia.ru/checkout',
                    data: formData,
                    success: function(response) {
                        $orderForm.removeClass('_sending');

                        if (response.success === 1) {
                            $orderForm.hide();
                            $thankYouBlock.css('display', 'flex');
                            $orderForm[0].reset();
                        } else if (response.success === 0) {
                            alert('Данные успешно отправлены, но возникла ошибка на сервере.');
                        } else {
                            alert('Неожиданный ответ от сервера.');
                        }
                    },
                    error: function() {
                        $orderForm.removeClass('_sending');
                        alert('Ошибка при отправке формы');
                    }
                });
            } else {
                alert('Заполните обязательные поля');
            }
        });


    $orderButton.on('click', function() {
            $thankYouBlock.hide();
            $orderForm.show();
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



    const fruitsData = [
        { name: 'Манго, Вьетнам', image: 'манго.png', price: '50 руб./кг', category: ['sale', 'new'] },
        { name: 'Маракуйя, Таиланд', image: 'маракуйя.png', price: '45 руб./кг', category: ['new'] },
        { name: 'Кокос, ЮАР', image: 'кокос.png', price: '37 руб./кг', category: ['sale'] },
        { name: 'Питахайя, Таиланд', image: 'питахайя.png', price: '61 руб./кг', category: ['rare'] },
        { name: 'Ананас, Таиланд', image: 'ананас.png', price: '48 руб./кг', category: ['new'] },
        { name: 'Папайя, Бразилия', image: 'papaya.png', price: '57 руб./кг', category: ['rare', 'new'] }
    ];


    function renderFruits(category) {
        const fruitsContainer = $('.products_items');
        fruitsContainer.empty();

        let filteredFruits = fruitsData;
        if (category && category !== 'all') {
            filteredFruits = fruitsData.filter(fruit => fruit.category.includes(category));
        }

        filteredFruits.forEach(fruit => {
            fruitsContainer.append(`
            <div class="products_item ">
                <img src="images/${fruit.image}" class="card-img wow animate__pulse" alt="${fruit.name}">
                <div class="card-body">
                    <h5 class="card-title">${fruit.name}</h5>
                    <p class="card-text">${fruit.price}</p>
                    <button class="btn orderButton">Заказать</button>
                </div>
            </div>
        `);
        });

        $orderButton.on('click', function () {
            $('#orderFormContainer').fadeIn();
        });
    }

    function changeCategory(category) {
        $('.our-fruits-nav-item').removeClass('active');
        $('#' + category).addClass('active');
        renderFruits(category.toLowerCase());
    }

    $('#all').on('click', function () {
        changeCategory('all');
    });

    $('#rare').on('click', function () {
        changeCategory('rare');
    });

    $('#sale').on('click', function () {
        changeCategory('sale');
    });

    $('#new').on('click', function () {
        changeCategory('new');
    });


    renderFruits('all');

    new WOW({
        animateClass:'animate__animated',
    }).init();
});


