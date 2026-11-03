import 'pretendard/dist/web/static/pretendard-dynamic-subset.css'
import './style.css'

const header = document.getElementById('siteHeader')
const navToggle = document.getElementById('navToggle')
const navMenu = document.getElementById('navMenu')
const navLinks = document.querySelectorAll('.nav-link')

// 스크롤 시 헤더 그림자
const onScroll = () => {
  header.classList.toggle('scrolled', window.scrollY > 20)
}
window.addEventListener('scroll', onScroll, { passive: true })
onScroll()

// 모바일 메뉴 열기/닫기
const setMenu = (open) => {
  navMenu.classList.toggle('open', open)
  navToggle.classList.toggle('open', open)
  navToggle.setAttribute('aria-expanded', String(open))
  navToggle.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기')
}
navToggle.addEventListener('click', () => setMenu(!navMenu.classList.contains('open')))
navLinks.forEach((link) => link.addEventListener('click', () => setMenu(false)))

// 스크롤에 따라 콘텐츠 나타나기
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target
        el.classList.add('visible')
        revealObserver.unobserve(el)
        // 등장 후에는 지연을 없애 마우스 반응이 바로 나타나도록
        setTimeout(() => (el.style.transitionDelay = '0s'), 1300)
      }
    })
  },
  { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
)
document.querySelectorAll('.reveal').forEach((el) => {
  // 같은 줄에 있는 카드가 순차적으로 나타나도록 지연
  const siblings = el.parentElement.querySelectorAll(':scope > .reveal')
  const index = Array.prototype.indexOf.call(siblings, el)
  el.style.transitionDelay = `${Math.min(index, 4) * 0.1}s`
  revealObserver.observe(el)
})

// 현재 보고 있는 섹션의 메뉴 강조
// philosophy 영역은 Home 메뉴에 포함
const sectionToNav = { home: 'home', philosophy: 'home', career: 'career', classes: 'classes', interests: 'interests' }
const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return
      const target = sectionToNav[entry.target.id]
      navLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${target}`)
      })
    })
  },
  { rootMargin: '-45% 0px -50% 0px' }
)
Object.keys(sectionToNav).forEach((id) => {
  const section = document.getElementById(id)
  if (section) navObserver.observe(section)
})

// 첫 화면 배경 장식이 마우스를 살짝 따라 움직이는 효과 (PC 전용)
const decos = document.querySelectorAll('.deco')
const canHover = window.matchMedia('(hover: hover)').matches
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
if (canHover && !reduceMotion) {
  window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2
    const y = (e.clientY / window.innerHeight - 0.5) * 2
    decos.forEach((deco, i) => {
      const depth = (i + 1) * 6
      deco.style.translate = `${x * depth}px ${y * depth}px`
    })
  })
}

document.getElementById('year').textContent = new Date().getFullYear()
