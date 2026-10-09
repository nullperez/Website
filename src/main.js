import './style.css'

const root = document.documentElement

// ----- Theme toggle (remembers choice, otherwise follows the OS) -----
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)')
const currentTheme = () => root.dataset.theme || (prefersDark.matches ? 'dark' : 'light')

document.querySelector('.theme-toggle').addEventListener('click', () => {
  const next = currentTheme() === 'dark' ? 'light' : 'dark'
  root.dataset.theme = next
  try {
    localStorage.setItem('theme', next)
  } catch {}
})

// ----- Mobile menu -----
const menuToggle = document.querySelector('.menu-toggle')
const navLinks = document.querySelector('.nav-links')

const setMenu = (open) => {
  navLinks.classList.toggle('open', open)
  menuToggle.setAttribute('aria-expanded', String(open))
  menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu')
}

menuToggle.addEventListener('click', () => setMenu(!navLinks.classList.contains('open')))
navLinks.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)))

// ----- Highlight the nav link for the section in view -----
const links = new Map([...navLinks.querySelectorAll('a[href^="#"]')].map((a) => [a.hash.slice(1), a]))

const navObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue
      links.forEach((a) => a.classList.remove('active'))
      links.get(entry.target.id)?.classList.add('active')
    }
  },
  { rootMargin: '-45% 0px -50% 0px' },
)
document.querySelectorAll('main section[id]').forEach((s) => navObserver.observe(s))

// ----- Fade sections in as they scroll into view -----
const revealObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible')
        revealObserver.unobserve(entry.target)
      }
    }
  },
  { threshold: 0.1 },
)
document.querySelectorAll('.section').forEach((s) => {
  s.classList.add('reveal')
  revealObserver.observe(s)
})

// ----- Footer year -----
document.getElementById('year').textContent = new Date().getFullYear()
