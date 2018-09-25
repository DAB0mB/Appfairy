/* eslint-disable */

const scripts = [
  {
    type: 'src',
    body: 'https://ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js',
  },
  {
    type: 'code',
    body: 'WebFont.load({google:{families:["Merriweather:300,300italic,400,400italic,700,700italic,900,900italic","Montserrat:100,100italic,200,200italic,300,300italic,400,400italic,500,500italic,600,600italic,700,700italic,800,800italic,900,900italic"]}});',
  },
  {
    type: 'code',
    body: '!function(o,c){var n=c.documentElement,t=" w-mod-";n.className+=t+"js",("ontouchstart"in o||o.DocumentTouch&&c instanceof DocumentTouch)&&(n.className+=t+"touch")}(window,document);',
  },
]

const loadingScripts = scripts.reduce((loaded, script) => loaded.then(() => {
  const scriptEl = document.createElement('script')
  scriptEl.type = 'text/javascript'
  let loading

  if (script.type == 'src') {
    scriptEl.src = script.body

    loading = new Promise((resolve, reject) => {
      scriptEl.onload = resolve
      scriptEl.onerror = reject
    })
  }
  else {
    scriptEl.innerHTML = script.body

    loading = Promise.resolve()
  }

  document.head.appendChild(scriptEl)

  return loading
}), Promise.resolve())

module.exports = loadingScripts

/* eslint-enable */