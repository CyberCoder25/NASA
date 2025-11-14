document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initNewsletterForm();
  initContactForm();
  initLazyLoading();
});

function initNavigation() {
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  if (!navToggle || !navMenu) return;

  navToggle.addEventListener('click', () => {
    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', !isExpanded);
    navMenu.classList.toggle('active');
    
    if (!isExpanded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  });

  navMenu.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 900) {
        navToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) {
      navToggle.setAttribute('aria-expanded', 'false');
      navMenu.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 900) {
      if (!navToggle.contains(e.target) && !navMenu.contains(e.target) && navMenu.classList.contains('active')) {
        navToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
      }
    }
  });
}

function initNewsletterForm() {
  const form = document.getElementById('newsletterForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const emailInput = form.querySelector('input[type="email"]');
    const submitButton = form.querySelector('button[type="submit"]');

    if (!emailInput.validity.valid) {
      emailInput.reportValidity();
      return;
    }

    const originalButtonText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Joining...';

    await new Promise(resolve => setTimeout(resolve, 1000));

    const successMessage = document.createElement('div');
    successMessage.className = 'form-success';
    successMessage.textContent = 'Thank you! Check your inbox for confirmation.';
    successMessage.style.cssText = `
      background: #10b981;
      color: white;
      padding: 1rem;
      border-radius: 8px;
      margin-top: 1rem;
      text-align: center;
      animation: fadeIn 0.3s ease;
    `;

    form.appendChild(successMessage);
    emailInput.value = '';
    submitButton.disabled = false;
    submitButton.textContent = originalButtonText;

    setTimeout(() => {
      successMessage.style.animation = 'fadeOut 0.3s ease';
      setTimeout(() => successMessage.remove(), 300);
    }, 5000);
  });
}

function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;

    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';

    await new Promise(resolve => setTimeout(resolve, 1500));

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    console.log('Form submitted:', data);

    const successMessage = document.createElement('div');
    successMessage.className = 'form-success';
    successMessage.innerHTML = `
      <strong>Success!</strong> Your message has been sent. We'll get back to you soon.
    `;
    successMessage.style.cssText = `
      background: #10b981;
      color: white;
      padding: 1.25rem;
      border-radius: 8px;
      margin-top: 1.5rem;
      text-align: center;
      animation: fadeIn 0.3s ease;
    `;

    form.appendChild(successMessage);
    form.reset();
    submitButton.disabled = false;
    submitButton.textContent = originalButtonText;

    setTimeout(() => {
      successMessage.style.animation = 'fadeOut 0.3s ease';
      setTimeout(() => successMessage.remove(), 300);
    }, 6000);
  });
}

function initLazyLoading() {
  const images = document.querySelectorAll('img[loading="lazy"]');

  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          observer.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  }
}

const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeOut {
    from {
      opacity: 1;
      transform: translateY(0);
    }
    to {
      opacity: 0;
      transform: translateY(-10px);
    }
  }
`;
document.head.appendChild(style);