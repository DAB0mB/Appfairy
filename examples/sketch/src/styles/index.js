/* eslint-disable */

const styles = [
  {
    type: 'href',
    body: '/css/burger.css',
  },
  {
    type: 'href',
    body: '/css/cover.css',
  },
  {
    type: 'href',
    body: '/css/cow.css',
  },
  {
    type: 'href',
    body: '/css/menuOverlay.css',
  },
  {
    type: 'href',
    body: '/css/home.css',
  },
  {
    type: 'href',
    body: '/css/drink.css',
  },
  {
    type: 'href',
    body: '/css/projectpage.css',
  },
]

const loadingStyles = styles.map((style) => {
  let styleEl
  let loading

  if (style.type == 'href') {
    styleEl = document.createElement('link')

    loading = new Promise((resolve, reject) => {
      styleEl.onload = resolve
      styleEl.onerror = reject
    })

    styleEl.rel = 'stylesheet'
    styleEl.type = 'text/css'
    styleEl.href = style.body
  }
  else {
    styleEl = document.createElement('style')
    styleEl.type = 'text/css'
    styleEl.innerHTML = style.body

    loading = Promise.resolve()
  }

  document.head.appendChild(styleEl)

  return loading
})

module.exports = Promise.all(loadingStyles)

/* eslint-enable */