document.addEventListener('DOMContentLoaded', function () {
  let subtitleOne = document.querySelector('.hero__subtitle-1');
  let subtitleTwo = document.querySelector('.hero__subtitle-2');
  let subtitleThree = document.querySelector('.hero__subtitle-3');

  let headerLink = document.querySelectorAll('.js-scroll');
  let observeAnchor = document.querySelectorAll('.observe');
  console.log(observeAnchor);

  headerLink.forEach((link) => {
    link.addEventListener('click', (event) => {
      headerLink.forEach((link) => {
        link.classList.remove('active');
      });
      link.classList.add('active');
    });
  });

  let observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        headerLink.forEach((link) => link.classList.remove('active'));

        headerLink.forEach((link) => {
          if (entry.target.id === link.dataset.nav) {
            link.classList.add('active');
          }
        });
      }
    });
  });

  observeAnchor.forEach((item) => observer.observe(item));

  let header = document.querySelector('.header');
  if (window.pageYOffset > 5) {
    header.classList.add('fixed');
  }

  let mail = document.querySelector('.footer__mail');
  let pic = document.querySelector('.footer__pic');
  mail.addEventListener('mouseover', () => {
    pic.classList.add('active');
  });
  mail.addEventListener('mouseleave', () => {
    pic.classList.remove('active');
  });

  setTimeout(() => {
    typeText(subtitleOne, 'Payment solutions');
    setTimeout(() => {
      typeText(subtitleTwo, 'for');
      setTimeout(() => {
        typeText(subtitleThree, 'the Future');
      }, 100);
    }, 700);
  }, 500);

  function typeText(el, text) {
    el.classList.add('animated');
    let line = 0;
    let count = 0;
    let out = '';

    function typeLine() {
      let interval = setTimeout(() => {
        out += text[line][count];
        el.innerHTML = out + '|';
        count++;
        if (count >= text[line].length) {
          count = 0;
          line++;

          if (line == text.length) {
            clearTimeout(interval);
            el.innerHTML = out;
            return true;
          }
        }
        typeLine();
      }, 35);
    }
    typeLine();
  }

  isMobile = {
    Android: function () {
      return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function () {
      return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function () {
      return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function () {
      return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function () {
      return navigator.userAgent.match(/IEMobile/i);
    },
    any: function () {
      return (
        isMobile.Android() ||
        isMobile.BlackBerry() ||
        isMobile.iOS() ||
        isMobile.Opera() ||
        isMobile.Windows()
      );
    },
  };

  new WOW().init();

  // loader
  setTimeout(function () {
    document.querySelector('body').classList.remove('loaded');
  }, 400);

  $('.header__burger').click(() => {
    $('.header').toggleClass('active');
  });
  $('.header__list-link').click(() => {
    $('.header').removeClass('active');
  })(
    (function () {
      const header = document.querySelector('.header');
      window.onscroll = () => {
        if (window.pageYOffset > 20) {
          header.classList.add('fixed');
        } else {
          header.classList.remove('fixed');
        }
      };
    })(),
  );

  /* components */

  //prevent drag img and a
  const imagesAndLinks = document.querySelectorAll('img, a');
  if (imagesAndLinks) {
    imagesAndLinks.forEach(function (item, i, arr) {
      item.addEventListener('dragstart', function (e) {
        e.preventDefault();
      });
    });
  }
});

/* viewport width */
function viewport() {
  let e = window,
    a = 'inner';
  if (!('innerWidth' in window)) {
    a = 'client';
    e = document.documentElement || document.body;
  }
  return { width: e[a + 'Width'], height: e[a + 'Height'] };
}
/* viewport width */

(function () {
  const smoothScroll = function (targetEl, duration) {
    const headerElHeight = 90;
    let target = document.querySelector(targetEl);
    let targetPosition = target.getBoundingClientRect().top - headerElHeight - 30;
    let startPosition = window.pageYOffset;
    let startTime = null;

    const ease = function (t, b, c, d) {
      t /= d / 2;
      if (t < 1) return (c / 2) * t * t + b;
      t--;
      return (-c / 2) * (t * (t - 2) - 1) + b;
    };

    const animation = function (currentTime) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const run = ease(timeElapsed, startPosition, targetPosition, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    };
    requestAnimationFrame(animation);
  };

  const scrollTo = function () {
    const links = document.querySelectorAll('.js-scroll');
    links.forEach((each) => {
      each.addEventListener('click', function () {
        const currentTarget = this.getAttribute('href');
        smoothScroll(currentTarget, 1000);
        $('.body').toggleClass('active');
      });
    });
  };
  scrollTo();
})();

$(document).ready(function () {
  let slider = $('.serve__left');

  let blocked = false;
  let blockTimeout = null;
  let prevDeltaY = 0;

  function onSliderAfterChange(event, slick, currentSlide) {
    $(event.target).data('current-slide', currentSlide);
  }

  function onSliderWheel(e) {
    var deltaY = e.originalEvent.deltaY,
      $currentSlider = $(e.currentTarget),
      currentSlickIndex = $currentSlider.data('current-slide') || 0;

    if (
      // check when you scroll up
      (deltaY < 0 && currentSlickIndex == 0) ||
      // check when you scroll down
      (deltaY > 0 && currentSlickIndex == $currentSlider.data('slider-length') - 1)
    ) {
      return;
    }

    e.preventDefault();

    clearTimeout(blockTimeout);
    blockTimeout = setTimeout(function () {
      blocked = false;
    }, 30);

    if ((deltaY > 0 && deltaY > prevDeltaY) || (deltaY < 0 && deltaY < prevDeltaY) || !blocked) {
      blocked = true;
      prevDeltaY = deltaY;

      if (deltaY > 0) {
        $(this).slick('slickNext');
      } else {
        $(this).slick('slickPrev');
      }
    }
  }

  slider
    .each(function (index, element) {
      var $element = $(element);
      // set the length of children in each loop
      // but the better way for performance is to set this data attribute on the div.slider in the markup
      $element.data('slider-length', $element.children().length);
    })
    .slick({
      infinite: false,
      slidesToShow: 1,
      slidesToScroll: 1,
      vertical: true,
      speed: 300,
      dots: true,
      arrows: false,
      verticalSwiping: true,
    })
    .on('afterChange', onSliderAfterChange)
    .on('wheel', onSliderWheel);
});

var isScrolling = document.getElementById('#serve');
window.addEventListener(
  'scroll',
  function (event) {
    // Clear our timeout throughout the scroll
    window.clearTimeout(isScrolling);
  },
  false,
);
