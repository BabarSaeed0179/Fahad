const studioEmail = 'babarsardar385@gmail.com';
const loader = document.querySelector('.page-loader');
window.addEventListener('load', () => {
  setTimeout(() => loader.classList.add('hide'), 400);
});
setTimeout(() => loader.classList.add('hide'), 2500);
const header = document.querySelector('.site-header');
const progressBar = document.querySelector('.scroll-progress');

function updateScroll() {
  const pageLength = document.documentElement.scrollHeight - window.innerHeight;
  const percent = pageLength > 0 ? (window.scrollY / pageLength) * 100 : 0;

  progressBar.style.width = `${percent}%`;
  header.classList.toggle('scrolled', window.scrollY > 10);
}

window.addEventListener('scroll', updateScroll);
updateScroll();
const heroArtwork = document.querySelector('.hero-art');
const prefersLessMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasPrecisePointer = window.matchMedia('(pointer: fine)').matches;

if (heroArtwork && hasPrecisePointer && !prefersLessMotion) {
  heroArtwork.addEventListener('pointermove', (event) => {
    const bounds = heroArtwork.getBoundingClientRect();
    const moveX = (event.clientX - bounds.left) / bounds.width - 0.5;
    const moveY = (event.clientY - bounds.top) / bounds.height - 0.5;

    heroArtwork.style.setProperty('--pointer-x', `${moveX * 18}px`);
    heroArtwork.style.setProperty('--pointer-y', `${moveY * 18}px`);
  });

  heroArtwork.addEventListener('pointerleave', () => {
    heroArtwork.style.setProperty('--pointer-x', '0px');
    heroArtwork.style.setProperty('--pointer-y', '0px');
  });
}
const revealItems = document.querySelectorAll(
  '.section-heading, .service-card, .project-card, .work-intro, .work-close, .about-copy, .about-stamp, .reason-grid article, .process-grid article, .contact-copy, .contact-form'
);

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach((item) => {
    item.classList.add('reveal');
    const siblings = [...item.parentElement.children];
    item.style.setProperty('--reveal-delay', `${Math.min(siblings.indexOf(item), 5) * 70}ms`);
    observer.observe(item);
  });
} else {
  revealItems.forEach((item) => item.classList.add('visible'));
}
if (hasPrecisePointer && !prefersLessMotion) {
  document.querySelectorAll('.case-study').forEach((project) => {
    project.addEventListener('pointermove', (event) => {
      const bounds = project.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;

      project.style.setProperty('--parallax-x', `${x * 12}px`);
      project.style.setProperty('--parallax-y', `${y * 12}px`);
    });

    project.addEventListener('pointerleave', () => {
      project.style.setProperty('--parallax-x', '0px');
      project.style.setProperty('--parallax-y', '0px');
    });
  });
}
const statNumbers = document.querySelectorAll('[data-count]');
if ('IntersectionObserver' in window && !prefersLessMotion) {
  const numberObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const number = entry.target;
      const target = Number(number.dataset.count);
      const start = performance.now();
      const duration = 900;

      function countUp(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        number.textContent = String(Math.round(target * eased)).padStart(2, '0');
        if (progress < 1) requestAnimationFrame(countUp);
      }

      requestAnimationFrame(countUp);
      observer.unobserve(number);
    });
  }, { threshold: 0.6 });

  statNumbers.forEach((number) => numberObserver.observe(number));
} else {
  statNumbers.forEach((number) => {
    number.textContent = String(number.dataset.count).padStart(2, '0');
  });
}
const processSection = document.querySelector('.process');
if ('IntersectionObserver' in window && processSection && !prefersLessMotion) {
  const processObserver = new IntersectionObserver((entries, observer) => {
    if (entries[0].isIntersecting) {
      processSection.classList.add('in-view');
      observer.disconnect();
    }
  }, { threshold: 0.3 });
  processObserver.observe(processSection);
} else {
  processSection?.classList.add('in-view');
}
const cursorGlow = document.querySelector('.cursor-glow');
if (cursorGlow && hasPrecisePointer && !prefersLessMotion) {
  window.addEventListener('pointermove', (event) => {
    cursorGlow.style.left = `${event.clientX}px`;
    cursorGlow.style.top = `${event.clientY}px`;
    document.body.classList.add('pointer-active');
  }, { passive: true });
  document.addEventListener('pointerleave', () => {
    document.body.classList.remove('pointer-active');
  });
}
const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('.main-nav');

function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open menu');
  menu.classList.remove('open');
}

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Open menu' : 'Close menu');
  menu.classList.toggle('open', !isOpen);
});

menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menu.classList.contains('open')) closeMenu();
});
const form = document.querySelector('#contact-form');
const message = document.querySelector('#form-message');
const customSelects = [...form.querySelectorAll('.custom-select')];

function closeCustomSelect(select, returnFocus = false) {
  const trigger = select.querySelector('.custom-select-trigger');
  const menu = document.getElementById(trigger.getAttribute('aria-controls'));
  const returnMarker = menu?._returnMarker;
  if (returnMarker?.parentNode) {
    returnMarker.parentNode.insertBefore(menu, returnMarker);
    returnMarker.remove();
    delete menu._returnMarker;
  }
  menu.hidden = true;
  menu.classList.remove('open-above');
  trigger.setAttribute('aria-expanded', 'false');
  if (returnFocus) trigger.focus();
}

function openCustomSelect(select, openAtEnd = false) {
  customSelects.forEach((otherSelect) => {
    if (otherSelect !== select) closeCustomSelect(otherSelect);
  });

  const trigger = select.querySelector('.custom-select-trigger');
  const menu = select.querySelector('.custom-select-menu');
  const options = [...menu.querySelectorAll('[role="option"]')];
  const selectedIndex = options.findIndex((option) => option.getAttribute('aria-selected') === 'true');
  const optionIndex = selectedIndex >= 0 ? selectedIndex : (openAtEnd ? options.length - 1 : 0);

  if (!menu._returnMarker) {
    menu._returnMarker = document.createComment('dropdown menu return point');
    menu.parentNode.insertBefore(menu._returnMarker, menu);
    document.body.append(menu);
  }
  menu.hidden = false;
  trigger.setAttribute('aria-expanded', 'true');
  const bounds = trigger.getBoundingClientRect();
  const desiredHeight = Math.min(menu.scrollHeight, window.innerHeight * 0.36, 230);
  const roomBelow = window.innerHeight - bounds.bottom;
  const roomAbove = bounds.top;
  const openAbove = roomBelow < desiredHeight + 12 && roomAbove > roomBelow;
  const room = openAbove ? roomAbove : roomBelow;
  const menuHeight = Math.max(80, Math.min(230, window.innerHeight * 0.36, room - 12));
  const menuWidth = Math.min(bounds.width, window.innerWidth - 24);
  const menuLeft = Math.min(Math.max(12, bounds.left), window.innerWidth - menuWidth - 12);
  const menuTop = openAbove
    ? Math.max(8, bounds.top - menuHeight - 6)
    : Math.min(bounds.bottom + 6, window.innerHeight - menuHeight - 8);

  menu.classList.toggle('open-above', openAbove);
  menu.style.top = `${menuTop}px`;
  menu.style.left = `${menuLeft}px`;
  menu.style.width = `${menuWidth}px`;
  menu.style.maxHeight = `${menuHeight}px`;

  options[optionIndex].focus();
  options[optionIndex].scrollIntoView({ block: 'nearest' });
}

function selectCustomOption(select, option) {
  const trigger = select.querySelector('.custom-select-trigger');
  const valueDisplay = trigger.querySelector('[data-selected-value]');
  const hiddenInput = select.querySelector('input[type="hidden"]');
  const menu = document.getElementById(trigger.getAttribute('aria-controls'));
  const options = [...menu.querySelectorAll('[role="option"]')];

  hiddenInput.value = option.dataset.value;
  hiddenInput.removeAttribute('aria-invalid');
  trigger.removeAttribute('aria-invalid');
  valueDisplay.textContent = option.dataset.value;
  options.forEach((item) => item.setAttribute('aria-selected', String(item === option)));
  closeCustomSelect(select, true);
}

customSelects.forEach((select) => {
  const trigger = select.querySelector('.custom-select-trigger');
  const options = [...select.querySelectorAll('[role="option"]')];

  trigger.addEventListener('click', () => {
    if (trigger.getAttribute('aria-expanded') === 'true') closeCustomSelect(select);
    else openCustomSelect(select);
  });

  trigger.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openCustomSelect(select);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      openCustomSelect(select, true);
    }
  });

  options.forEach((option, index) => {
    option.addEventListener('click', () => selectCustomOption(select, option));
    option.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        const direction = event.key === 'ArrowDown' ? 1 : -1;
        options[(index + direction + options.length) % options.length].focus();
      } else if (event.key === 'Home') {
        event.preventDefault();
        options[0].focus();
      } else if (event.key === 'End') {
        event.preventDefault();
        options[options.length - 1].focus();
      } else if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        selectCustomOption(select, option);
      } else if (event.key === 'Escape') {
        event.preventDefault();
        closeCustomSelect(select, true);
      } else if (event.key === 'Tab') {
        closeCustomSelect(select);
      }
    });
  });
});

document.addEventListener('click', (event) => {
  customSelects.forEach((select) => {
    const trigger = select.querySelector('.custom-select-trigger');
    const menu = document.getElementById(trigger.getAttribute('aria-controls'));
    if (!select.contains(event.target) && !menu.contains(event.target)) closeCustomSelect(select);
  });
});

window.addEventListener('resize', () => {
  customSelects.forEach((select) => closeCustomSelect(select));
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  message.classList.remove('form-error', 'form-success');

  const fields = [...form.querySelectorAll('input:not([type="hidden"]), textarea')];
  const invalidField = fields.find((field) => !field.checkValidity());
  const emptySelect = customSelects.find((select) => !select.querySelector('input[type="hidden"]').value);

  fields.forEach((field) => {
    field.setAttribute('aria-invalid', String(!field.checkValidity()));
  });

  customSelects.forEach((select) => {
    const isEmpty = !select.querySelector('input[type="hidden"]').value;
    select.querySelector('.custom-select-trigger').setAttribute('aria-invalid', String(isEmpty));
  });

  if (invalidField || emptySelect) {
    message.textContent = 'Please complete each field with a valid answer.';
    message.classList.add('form-error');
    if (invalidField) invalidField.focus();
    else emptySelect.querySelector('.custom-select-trigger').focus();
    return;
  }

  const data = new FormData(form);
  const subject = `Project enquiry: ${data.get('service')}`;
  const body = `Name: ${data.get('name')}\nEmail: ${data.get('email')}\nService: ${data.get('service')}\nBudget: ${data.get('budget')}\n\nProject details:\n${data.get('details')}`;
  const emailLink = `mailto:${studioEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  message.textContent = 'Your mail app should open with the project details filled in.';
  message.classList.add('form-success');
  window.location.href = emailLink;
});
form.querySelectorAll('input:not([type="hidden"]), textarea').forEach((field) => {
  field.addEventListener('input', () => field.removeAttribute('aria-invalid'));
  field.addEventListener('change', () => field.removeAttribute('aria-invalid'));
});
document.querySelector('#year').textContent = new Date().getFullYear();
