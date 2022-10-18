'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');

///////////////////////////////////////
// Modal window
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});
///////////////////////////////////////
// Smooth Scrolling Learn More Button
btnScrollTo.addEventListener('click', function () {
  section1.scrollIntoView({ behavior: 'smooth' });
});
///////////////////////////////////////
// Event Delegation: Smooth Scrolling Page Navigation

// Clean Way with Delegation: Listener on parent element
// 1. Add Listener to common parent element, then ignore the parent, focus on child
// 2. Determine what element originated event
// 3. Check for the child element, focus on the target
// 4. Retrieve href from the target
// 5. D.Q. Select and smooth scroll

document.querySelector('.nav__links').addEventListener('click', function (e) {
  // 1.
  e.preventDefault();
  // console.log(e.target); 2.
  if (e.target.classList.contains('nav__link')) {
    // 3.
    const id = e.target.getAttribute('href'); // 4.
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' }); // 5.
  }
});

// Old way forEach: too intensive, if 100 links 100 functions
// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

///////////////////////////////////////
// Tabbed Component

tabsContainer.addEventListener('click', function (e) {
  // Make sure clicking returns the button
  const clicked = e.target.closest('.operations__tab');
  // console.log(clicked);

  // Guard Clause, if container clicked instead of btn
  if (!clicked) return;
  // Remove active class
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(el => el.classList.remove('operations__content--active'));
  // Activate Tab
  clicked.classList.add('operations__tab--active');
  // Activate content
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});
///////////////////////////////////////
// Menu Fade for Links and Logo on NAV bar

// DRY, refactored to function, then changed 'this'
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (link !== el) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};
// .bind returns a new function, and sets a new 'this' keyword, .bind allows for cleaner code
// Pass 'arguments' into handler
nav.addEventListener('mouseover', handleHover.bind(0.5));

nav.addEventListener('mouseout', handleHover.bind(1));

////////////////////////////////
// Sticky Scroll NAV Bar: The Scroll Event

// Ineffiecient way, scroll generates a lot of events
// const initialCoords = section1.getBoundingClientRect();
// console.log(initialCoords);

// window.addEventListener('scroll', function () {
//   // console.log(window.scrollY);

//   if (window.scrollY > initialCoords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

// --------------------------
// Intersection Observer API: Sticky NAV bar right way
// --------------------------

const navHeight = nav.getBoundingClientRect().height;
// console.log(navHeight);

const stickNav = function (entries) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

////////////////////////////////
// Intersection Observer API: Revealing Sections Scroll
// Target in the single entry is key!

const revealSection = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});
allSections.forEach(function (section) {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden');
});

////////////////////////////////
// Intersection Observer API: Lazy Loading Images for performance, lazy load imgs before user can see them

const imgTargets = document.querySelectorAll('img[data-src]');
const loadImg = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) return;

  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;

  // Listen for load event, then remove filter
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});
imgTargets.forEach(img => imgObserver.observe(img));

////////////////////////////////
// Slider component
const slider = function () {
  // --------------DOM SELECTION--------------
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  const maxSlide = slides.length;
  let curSlide = 0;

  // --------------FUNCTIONS--------------

  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class= "dots__dot" data-slide="${i}"></button> `
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));
    // Can query select based on dataset attribute:
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
      //say that curSlide = 1 (read as 0, then added 1, then subtract the curSlide from the index, 0 - 1, then its -100%) -100%, 0%, 100%, 200%
    );
  };

  const nextSlide = function () {
    if (curSlide === maxSlide - 1) curSlide = 0;
    else curSlide++;
    goToSlide(curSlide);
    activateDot(curSlide);
  };
  const prevSlide = function () {
    if (curSlide === 0) curSlide = maxSlide - 1;
    else curSlide--;
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    // Set default slides position:
    goToSlide(0);
    // 0%, 100%, 200%, 300% just index * 100
    createDots();
    activateDot(0);
  };
  init();

  // --------------EVENT LISTENERS--------------

  // The main event right here
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  ////////////////////////////////
  // Slider Lecture: Dots and keyboard function

  // createDots function above

  // Listen for left or right arrows
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') nextSlide();
    e.key === 'ArrowLeft' && prevSlide();
  });
  // Listen for click on dots, dataset
  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();
/*
    //////////////////////////////////
    //////////- Lectures -//////////
//////////////////////////////////

//////////////////////////////////
// 01) Selecting, Creating, and Deleting Elements
//////////////////////////////////

// -- Selecting Elements --
console.log(document.documentElement);
console.log(document.head);
console.log(document.body);

// querySelector needs the '.'
const header = document.querySelector('.header');

const allSections = document.querySelectorAll('.section');
console.log(allSections); // Node list of sections

// getElement does not need .
document.getElementById('section--1');

const allButtons = document.getElementsByTagName('button');
console.log(allButtons); // HTML collection, constantly updates, node list does not auto update

console.log(document.getElementsByClassName('btn')); // HTML collection as well

// .insertAdjacentHTML
// -- Creating and inserting elements --
const message = document.createElement('div');
message.classList.add('cookie-message');
// message.textContent = 'We use cookies for improved functionality and analytics';
message.innerHTML =
  'We use cookies for improved functionality and analytics <button class="btn btn--close-cookie">Got it!</button>';
// Prepend adds element as first child
// Append adds element as last child
// header.prepend(message);
header.append(message); // DOM element can't be two places at once, create clone if you want
// header.append(message.cloneNode(true));

// header.before(message); // above the header
// header.after(message); // Below, still a sibling

// -- Deleting Elements --
document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    // message.remove(); new way
    message.parentElement.removeChild(message);
  });

//////////////////////////////////
// 02) Styles, Classes, Attributes
//////////////////////////////////

// Styles - Inline Styles in JS
message.style.backgroundColor = '#37383d';
message.style.width = '120%';

console.log(message.style.color); // Logs nothing, .style only can access inline code, styles stored in the class in CSS are not accessible
console.log(message.style.backgroundColor); // Returns the color we set above

// Can retrieve any style whether we wrote it JS or not
console.log(getComputedStyle(message).color);
console.log(getComputedStyle(message).height);

// Can compute new style even if not previously declared in JS or CSS
message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 25 + 'px';

// Can edit the universal standard properties set in :root which is just the document
document.documentElement.style.setProperty('--color-primary', 'lightblue');

// Attributes: HTML: src, alt, class, id, href, etc
const logo = document.querySelector('.nav__logo');

// Reading the attributes
console.log(logo.attributes);
console.log(logo.alt);
console.log(logo.className);
console.log(logo.src); // Absolute, full ref url
console.log(logo.getAttribute('src')); // URL as written

const link = document.querySelector('.nav__link--btn');
console.log(link.href); // Full URL
console.log(link.getAttribute('href')); // Just #

// Set attributes
logo.alt = 'Beautiful Minimalist logo';
logo.setAttribute('company', 'Bankist');

// Non-standard Alt tag
console.log(logo.designer); //undefined
console.log(logo.getAttribute('designer')); // Jonas

// Data Attributes: HTML data- 'text'
console.log(logo.dataset.versionNumber); // 3.0

// Classes (already went over before)
logo.classList.add('c', 'd');
logo.classList.remove('c');
logo.classList.toggle('c');
logo.classList.contains('c');

// Possible but NEVER USE!!!!
// logo.className = 'jonas'


//////////////////////////////////
// 03) Implementing Smooth Scrolling Button
//////////////////////////////////
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
btnScrollTo.addEventListener('click', function (e) {
  // Step 1: Get Coordinates of where scrolling to
  const s1Coords = section1.getBoundingClientRect();
  // console.log(s1Coords);

  // console.log(e.target.getBoundingClientRect());

  // console.log(s1Coords.y - e.target.getBoundingClientRect().y);

  // Scrolling
  // window.scrollTo(
  //   s1Coords.left + window.pageXOffset,
  //   s1Coords.top + window.pageYOffset
  // );

  // Smooth Scrolling: put in an object
  // window.scrollTo({
  //   left: s1Coords.left + window.pageXOffset,
  //   top: s1Coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  // MODERN WAY: WAY TOO EASY, only if browser support
  section1.scrollIntoView({ behavior: 'smooth' });
});

// Get coordinates of exactly where you are scrolled on page, pixels from the side or top
console.log('Current Scroll (X/Y)', window.pageXOffset, window.pageYOffset);

// Get the height / width of the actual viewport window
console.log(
  'Height/ Width viewport',
  document.documentElement.clientHeight,
  document.documentElement.clientWidth
);

//////////////////////////////////
// 04) Types of Events and Event Handlers
//////////////////////////////////
// An Event is a signal that is generated by a DOM node, a signal means that something has happened

// 1) AddEventListener
const h1 = document.querySelector('h1');
const alertH1 = function () {
  alert('addEventListener: heading');
};
h1.addEventListener('mouseenter', alertH1);
// 2) on(insert Event here) any event can be put here
// Used to be done this way, no longer used
// h1.onmouseenter = function () {
//   alert('onmouseenter: heading');
// };
// 3) Remove event listener
// If put in the initial function, only runs once:
// h1.removeEventListener('mouseenter', alertH1);
// Get it to listen for only 3 seconds
setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 3000);

// ------------------
// BUBBLING AND CAPTURING EVENT PROPAGATION - DOM TREE
// ------------------

// 1) Capturing Phase: Event listener is attached to anchor element (<a>link</a>), when click event happens it is passed down through all of the parents of <a> starting at the root document itself, down the DOM tree

// 2) Target Phase: click event finds its target and attaches there

// 3) Bubbling Phase: click event then bubbles up through all the parents of the <a>, as the event bubbles through the parent element, it is as if that event had happened in that element. This allows for unique and powerful patterns


//////////////////////////////////
// 05) Event Propagation in Practice
//////////////////////////////////
// Generate random colors to show bubbling: if child element has click event and parent elements are also listening for a click event, all elements above the target element change color as well, only up the chain so if you click on a parent, only that will change
// rgb(255,255,255)

// Generates random number inbetween min and max
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);
// console.log(randomInt(1, 255));
const randomColor = () =>
  `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;
// console.log(randomColor(0, 255));

document.querySelector('.nav__link').addEventListener('click', function (e) {
  e.preventDefault();
  this.style.backgroundColor = randomColor();
  console.log('LINK ', e.target, e.currentTarget);
  console.log(e.currentTarget === this);

  // Can stop Propagation:
  // e.stopPropagation(); not a good idea
});
document.querySelector('.nav__links').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('CONTAINER', e.target, e.currentTarget);
});
document.querySelector('.nav').addEventListener(
  'click',
  function (e) {
    this.style.backgroundColor = randomColor();
    console.log('NAV', e.target, e.currentTarget);
  }
  // true makes capturing visible, top down, never used
);

//////////////////////////////////
// 06) Event Delegation
//////////////////////////////////
// Implementing smooth scrolling for NAV bar, look in above code
// Steps 1-5 to Delegate event listeners

//////////////////////////////////
// 07) Traversing the DOM Tree
//////////////////////////////////

const h1 = document.querySelector('h1');

// Going down: selecting children: querySelector will go down as far as possible to find any children, but will only return highlight class that's child of h1, if highlight existed elsewhere it isn't considered
console.log(h1.querySelectorAll('.highlight'));

console.log(h1.childNodes); // All nodes, text, etc.

console.log(h1.children); // All HTML elements, only for direct children, doesnt go all the way down

// Select first/last child
h1.firstElementChild.style.color = 'white';
h1.lastElementChild.style.color = 'yellow';

// Going up: selecting parents:
console.log(h1.parentNode); // Direct Parent
console.log(h1.parentElement); // Ususally same as node

// Closest is opposite of qSelect: will search as far up to find the parent
// Accepts a string class name, essentially this returns the closest parent with class 'header'
// IMPORTANT WILL USE ALL THE TIME
h1.closest('.header').style.background = 'var(--gradient-secondary)';

h1.closest('h1').style.background = 'var(--gradient-primary)'; // Just selects itself

// Going sideways: selecting siblings, can only select direct siblings, previous or next

// Elements
console.log(h1.previousElementSibling); // null
console.log(h1.nextElementSibling); // h4
// Nodes
console.log(h1.previousSibling);
console.log(h1.nextSibling);

// Get all siblings trick, not just previous or next
console.log(h1.parentElement.children);
// Messing around showcase, if element is not h1
[...h1.parentElement.children].forEach(function (el) {
  if (el !== h1) el.style.transform = 'scale(.75)';
});

//////////////////////////////////
// 08) Building Component With Tabs
//////////////////////////////////
*/
////////////////////////////////
// 09) Intersection Observer API: Intro
//////////////////////////////////

// const obsCallback = function (entries, observer) {
//   entries.forEach(entry => {
//     console.log(entry);
//   });
// };

// const obsOptions = {
//   root: null,
//   threshold: [0, 0.2],
// };

// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);

////////////////////////////////
// 10) DOM Tree Events and Lifecycle
//////////////////////////////////
// We'll take a look at events that occur during the page's lifecycle, from entering the page to leaving

// 1. DOMContentLoaded: event is fired as soon as the document is parsed - HTML downloaded and converted to DOM tree. Also, all scripts must be downloaded and executed before this event can happen.
// Script tag to link JS to HTML put at the end of HTML doc, this ensures JS is only loaded once all DOM loaded

document.addEventListener('DOMContentLoaded', function (e) {
  console.log(e);
});

// 2. Load: event is fired by the window once the HTML and all images and external resources like CSS have loaded. Event happens when complete page rendered

window.addEventListener('load', function (e) {
  console.log(e);
});

// 3. BeforeUnload on the window, asks "Do you want to leave?" when reloaded or closed window

// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault(); // For other browsers
//   console.log(e);
//   e.returnValue = '';
// });
