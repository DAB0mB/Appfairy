/* eslint-disable */

const React = require('react')
const ReactDOM = require('react-dom')
const { createScope, transformProxies, map } = require('./helpers')

const scripts = [
  Promise.resolve("window.anima_isHidden=void 0!==window.anima_isHidden?window.anima_isHidden:function(n){return n instanceof HTMLElement&&(\"none\"==getComputedStyle(n).display||!(!n.parentNode||!anima_isHidden(n.parentNode)))},window.anima_loadAsyncSrcForTag=void 0!==window.anima_loadAsyncSrcForTag?window.anima_loadAsyncSrcForTag:function(n){for(var i=document.getElementsByTagName(n),a=[],e=0;e<i.length;e++){var o=(d=i[e]).getAttribute(\"src\");if(!(null!=o&&0<o.length&&\"data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==\"!=o))null!=(t=d.getAttribute(\"anima-src\"))&&0!=t.length&&(anima_isHidden(d)||a.push(d))}a.sort(function(n,i){return anima_getTop(n)-anima_getTop(i)});for(e=0;e<a.length;e++){var d,t=(d=a[e]).getAttribute(\"anima-src\");d.setAttribute(\"src\",t)}},window.anima_pauseHiddenVideos=void 0!==window.anima_pauseHiddenVideos?window.anima_pauseHiddenVideos:function(n){for(var i=document.getElementsByTagName(\"video\"),a=0;a<i.length;a++){var e=i[a],o=!!(0<e.currentTime&&!e.paused&&!e.ended&&2<e.readyState),d=anima_isHidden(e);o||d||\"autoplay\"!=e.getAttribute(\"autoplay\")?o&&d&&e.pause():e.play()}},window.anima_loadAsyncSrc=void 0!==window.anima_loadAsyncSrc?window.anima_loadAsyncSrc:function(n){anima_loadAsyncSrcForTag(\"img\"),anima_loadAsyncSrcForTag(\"iframe\"),anima_loadAsyncSrcForTag(\"video\"),anima_pauseHiddenVideos()};var anima_getTop=function(n){for(var i=0;i+=n.offsetTop||0,n=n.offsetParent;);return i};anima_loadAsyncSrc(),window.anima_old_onResize=void 0!==window.anima_old_onResize?window.anima_old_onResize:window.onresize,window.anima_new_onResize=void 0!==window.anima_new_onResize?window.anima_new_onResize:void 0,window.anima_updateOnResize=void 0!==window.anima_updateOnResize?window.anima_updateOnResize:function(){null!=anima_new_onResize&&window.onresize==anima_new_onResize||(window.anima_new_onResize=void 0!==window.anima_new_onResize?window.anima_new_onResize:function(n){null!=anima_old_onResize&&anima_old_onResize(n),anima_loadAsyncSrc()},window.onresize=void 0!==window.onresize?window.onresize:anima_new_onResize,setTimeout(function(){anima_updateOnResize()},3e3))},anima_updateOnResize(),setTimeout(function(){anima_loadAsyncSrc()},200);"),
]

let Controller

class CowView extends React.Component {
  static get Controller() {
    if (Controller) return Controller

    try {
      Controller = require('../controllers/CowController')
      Controller = Controller.default || Controller

      return Controller
    }
    catch (e) {
      if (e.code == 'MODULE_NOT_FOUND') {
        Controller = CowView

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
    const proxies = Controller !== CowView ? transformProxies(this.props.children) : {
      'close': [],
    }

    return (
      <span>
        <style dangerouslySetInnerHTML={{ __html: `
          @import url(/css/cow.css);
        ` }} />
        <span className="af-view">
          <input id="anPageName" name="page" type="hidden" defaultValue="cow" />
          <div className="af-class-cow">
            <div style={{width: 750, height: '100%', position: 'relative', margin: 'auto'}}>
              <div className="af-class-x-mlid1987">
                <img anima-src="./img/cowxmlid2793.png" className="af-class-x-mlid2793" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" />
                <img anima-src="./img/cowxmlid2792.png" className="af-class-x-mlid2792" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" />
                <img anima-src="./img/cowxmlid2791.png" className="af-class-x-mlid2791" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" />
                <img anima-src="./img/cowxmlid2790.png" className="af-class-x-mlid2790" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" />
                <img anima-src="./img/cowxmlid2789.png" className="af-class-x-mlid2789" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" />
                <img anima-src="./img/cowxmlid2788.png" className="af-class-x-mlid2788" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" />
                <img anima-src="./img/cowxmlid2787.png" className="af-class-x-mlid2787" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" />
                <img anima-src="./img/cowxmlid2786.png" className="af-class-x-mlid2786" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" />
                <img anima-src="./img/cowxmlid2785.png" className="af-class-x-mlid2785" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" />
                <img anima-src="./img/cowxmlid992.png" className="af-class-x-mlid992" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" />
                <img anima-src="./img/cowxmlid991.png" className="af-class-x-mlid991" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" />
                <img anima-src="./img/cowxmlid865.png" className="af-class-x-mlid865" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" />
                <img anima-src="./img/cowxmlid2781.png" className="af-class-x-mlid2781" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" />
                <img anima-src="./img/cowxmlid2780.png" className="af-class-x-mlid2780" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" />
                <img anima-src="./img/cowxmlid2779.png" className="af-class-x-mlid2779" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" />
                <img anima-src="./img/cowxmlid2778.png" className="af-class-x-mlid2778" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" />
                <img anima-src="./img/cowxmlid2777.png" className="af-class-x-mlid2777" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" />
                <img anima-src="./img/cowxmlid2776.png" className="af-class-x-mlid2776" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" />
                <img anima-src="./img/cowxmlid2775.png" className="af-class-x-mlid2775" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" />
                <img anima-src="./img/cowxmlid2774.png" className="af-class-x-mlid2774" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" />
                <img anima-src="./img/cowxmlid2774.png" className="af-class-x-mlid2773" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" />
                <img anima-src="./img/cowxmlid2771.png" className="af-class-x-mlid2772" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" />
                <img anima-src="./img/cowxmlid2771.png" className="af-class-x-mlid2771" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" />
                <img anima-src="./img/cowxmlid2769.png" className="af-class-x-mlid2770" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" />
                <img anima-src="./img/cowxmlid2769.png" className="af-class-x-mlid2769" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" />
              </div>
              <div className="af-class-content">
                <div className="af-class-titre">
                  <img anima-src="./img/cowsubtitle.png" className="af-class-subtitle" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" />
                  <img anima-src="./img/burgertitle.png" className="af-class-title" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" />
                </div>
                <img anima-src="./img/cowlorem ipsum dolor si.png" className="af-class-lorem-ipsum-dolor-si" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" />
              </div>
              {map(proxies['close'], props => <img anima-src="./img/burgericonclose.svg" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" {...{...props, className: `af-class-icon-close ${props.className || ''}`}}>{props.children ? props.children : <React.Fragment>
              </React.Fragment>}</img>)}</div>
          </div>
          {/* Scripts */}
          {/* End of Scripts */}
        </span>
      </span>
    )
  }
}

module.exports = CowView

/* eslint-enable */