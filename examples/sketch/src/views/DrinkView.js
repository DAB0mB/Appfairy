/* eslint-disable */

const React = require('react')
const ReactDOM = require('react-dom')
const { createScope, transformProxies, map } = require('./helpers')

const scripts = [
  Promise.resolve("anima_isHidden=function(n){return n instanceof HTMLElement&&(\"none\"==getComputedStyle(n).display||!(!n.parentNode||!anima_isHidden(n.parentNode)))},anima_loadAsyncSrcForTag=function(n){for(var e=document.getElementsByTagName(n),a=[],i=0;i<e.length;i++){var t=(o=e[i]).getAttribute(\"src\");if(!(null!=t&&0<t.length&&\"data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==\"!=t))null!=(r=o.getAttribute(\"anima-src\"))&&0!=r.length&&(anima_isHidden(o)||a.push(o))}a.sort(function(n,e){return anima_getTop(n)-anima_getTop(e)});for(i=0;i<a.length;i++){var o,r=(o=a[i]).getAttribute(\"anima-src\");o.setAttribute(\"src\",r)}},anima_pauseHiddenVideos=function(n){for(var e=document.getElementsByTagName(\"video\"),a=0;a<e.length;a++){var i=e[a],t=!!(0<i.currentTime&&!i.paused&&!i.ended&&2<i.readyState),o=anima_isHidden(i);t||o||\"autoplay\"!=i.getAttribute(\"autoplay\")?t&&o&&i.pause():i.play()}},anima_loadAsyncSrc=function(n){anima_loadAsyncSrcForTag(\"img\"),anima_loadAsyncSrcForTag(\"iframe\"),anima_loadAsyncSrcForTag(\"video\"),anima_pauseHiddenVideos()};var anima_getTop=function(n){for(var e=0;e+=n.offsetTop||0,n=n.offsetParent;);return e};anima_loadAsyncSrc(),anima_old_onResize=window.onresize,anima_new_onResize=void 0,anima_updateOnResize=function(){null!=anima_new_onResize&&window.onresize==anima_new_onResize||(anima_new_onResize=function(n){null!=anima_old_onResize&&anima_old_onResize(n),anima_loadAsyncSrc()},window.onresize=anima_new_onResize,setTimeout(function(){anima_updateOnResize()},3e3))},anima_updateOnResize(),setTimeout(function(){anima_loadAsyncSrc()},200);"),
]

let Controller

class DrinkView extends React.Component {
  static get Controller() {
    if (Controller) return Controller

    try {
      Controller = require('../controllers/DrinkController')
      Controller = Controller.default || Controller

      return Controller
    }
    catch (e) {
      if (e.code == 'MODULE_NOT_FOUND') {
        Controller = DrinkView

        return Controller
      }

      throw e
    }
  }

  componentDidMount() {
    scripts.concat(Promise.resolve()).reduce((loaded, loading) => {
      return loaded.then((script) => {
        new Function(`
          with (this) {
            eval(arguments[0])
          }
        `).call(window, script)

        return loading
      })
    })
  }

  render() {
    const proxies = Controller !== DrinkView ? transformProxies(this.props.children) : {

    }

    return (
      <span>
        <style dangerouslySetInnerHTML={{ __html: `
          @import url(/css/drink.css);
        ` }} />
        <span className="af-view">
          <div style={{margin: 0, background: 'rgba(21, 21, 21, 1.0)'}}>
            <input id="anPageName" name="page" type="hidden" defaultValue="drink" />
            <div className="af-class-drink">
              <div style={{width: 750, height: '100%', position: 'relative', margin: 'auto'}}>
                <div className="af-class-content">
                  <div className="af-class-titre">
                    <img anima-src="./img/drinksubtitle.png" className="af-class-subtitle" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" />
                    <img anima-src="./img/drinktitle.png" className="af-class-title" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" />
                  </div>
                  <img anima-src="./img/drinklorem ipsum dolor si.png" className="af-class-lorem-ipsum-dolor-si" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" />
                </div>
                <img anima-src="./img/burgericonclose.svg" className="af-class-icon-close" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" />
                <div className="af-class-x-mlid1219">
                  <img anima-src="./img/drinkxmlid1253.png" className="af-class-x-mlid1253" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" />
                  <div className="af-class-x-mlid1163">
                    <img anima-src="./img/drinkxmlid1213.png" className="af-class-x-mlid1213" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" />
                    <div className="af-class-x-mlid1202">
                      <div className="af-class-x-mlid1208">
                        <img anima-src="./img/drinkxmlid1212.png" className="af-class-x-mlid1212" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" />
                        <img anima-src="./img/drinkxmlid1211.png" className="af-class-x-mlid1211" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" />
                        <img anima-src="./img/drinkxmlid1210.png" className="af-class-x-mlid1210" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" />
                        <img anima-src="./img/drinkxmlid1209.png" className="af-class-x-mlid1209" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" />
                      </div>
                      <div className="af-class-x-mlid1203">
                        <img anima-src="./img/drinkxmlid1207.png" className="af-class-x-mlid1207" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" />
                        <img anima-src="./img/drinkxmlid1206.png" className="af-class-x-mlid1206" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" />
                        <img anima-src="./img/drinkxmlid1205.png" className="af-class-x-mlid1205" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" />
                        <img anima-src="./img/drinkxmlid1204.png" className="af-class-x-mlid1204" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" />
                      </div>
                    </div>
                    <div className="af-class-x-mlid1190">
                      <div className="af-class-x-mlid1201">
                      </div>
                      <img anima-src="./img/drinkxmlid1200.png" className="af-class-x-mlid1200" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" />
                      <img anima-src="./img/drinkxmlid1199.png" className="af-class-x-mlid1199" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" />
                      <div className="af-class-x-mlid1198">
                      </div>
                      <img anima-src="./img/drinkxmlid1197.png" className="af-class-x-mlid1197" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" />
                      <img anima-src="./img/drinkxmlid1196.png" className="af-class-x-mlid1196" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" />
                      <div className="af-class-x-mlid1195">
                      </div>
                      <img anima-src="./img/drinkxmlid1194.png" className="af-class-x-mlid1194" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" />
                      <img anima-src="./img/drinkxmlid1196.png" className="af-class-x-mlid1193" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" />
                      <img anima-src="./img/drinkxmlid1192.png" className="af-class-x-mlid1192" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" />
                      <img anima-src="./img/drinkxmlid1191.png" className="af-class-x-mlid1191" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" />
                    </div>
                    <img anima-src="./img/drinkxmlid1165.png" className="af-class-x-mlid1165" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" />
                  </div>
                </div>
              </div>
            </div>
            {/* Scripts */}
            {/* End of Scripts */}
          </div>
        </span>
      </span>
    )
  }
}

module.exports = DrinkView

/* eslint-enable */