/* eslint-disable */

const React = require('react')
const ReactDOM = require('react-dom')
const { createScope, transformProxies, map } = require('./helpers')

const scripts = [
  Promise.resolve("anima_isHidden=function(n){return n instanceof HTMLElement&&(\"none\"==getComputedStyle(n).display||!(!n.parentNode||!anima_isHidden(n.parentNode)))},anima_loadAsyncSrcForTag=function(n){for(var e=document.getElementsByTagName(n),a=[],i=0;i<e.length;i++){var t=(o=e[i]).getAttribute(\"src\");if(!(null!=t&&0<t.length&&\"data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==\"!=t))null!=(r=o.getAttribute(\"anima-src\"))&&0!=r.length&&(anima_isHidden(o)||a.push(o))}a.sort(function(n,e){return anima_getTop(n)-anima_getTop(e)});for(i=0;i<a.length;i++){var o,r=(o=a[i]).getAttribute(\"anima-src\");o.setAttribute(\"src\",r)}},anima_pauseHiddenVideos=function(n){for(var e=document.getElementsByTagName(\"video\"),a=0;a<e.length;a++){var i=e[a],t=!!(0<i.currentTime&&!i.paused&&!i.ended&&2<i.readyState),o=anima_isHidden(i);t||o||\"autoplay\"!=i.getAttribute(\"autoplay\")?t&&o&&i.pause():i.play()}},anima_loadAsyncSrc=function(n){anima_loadAsyncSrcForTag(\"img\"),anima_loadAsyncSrcForTag(\"iframe\"),anima_loadAsyncSrcForTag(\"video\"),anima_pauseHiddenVideos()};var anima_getTop=function(n){for(var e=0;e+=n.offsetTop||0,n=n.offsetParent;);return e};anima_loadAsyncSrc(),anima_old_onResize=window.onresize,anima_new_onResize=void 0,anima_updateOnResize=function(){null!=anima_new_onResize&&window.onresize==anima_new_onResize||(anima_new_onResize=function(n){null!=anima_old_onResize&&anima_old_onResize(n),anima_loadAsyncSrc()},window.onresize=anima_new_onResize,setTimeout(function(){anima_updateOnResize()},3e3))},anima_updateOnResize(),setTimeout(function(){anima_loadAsyncSrc()},200);"),
  Promise.resolve("function AnimaShowOnScroll(){this.toShow=[],this.nextEventY=void 0}AnimaShowOnScroll.prototype.show=function(t){t.style.display=\"\"},AnimaShowOnScroll.prototype.hide=function(t){t.style.display=\"none\"},AnimaShowOnScroll.prototype.getTop=function(t){if(null!=t.animaTop&&0!=t.animaTop)return t.animaTop;for(var n=0,o=t;n+=o.offsetTop||0,o=o.offsetParent;);return t.animaTop=n},AnimaShowOnScroll.prototype.onScroll=function(){var t=window.pageYOffset+window.innerHeight;if(!(null==this.nextEventY||this.nextEventY>t)){this.nextEventY=void 0;for(var n=0;n<this.toShow.length;n++){var o=this.toShow[n],i=this.getTop(o);if(!(i<t)){this.nextEventY=i;break}this.show(o),this.toShow.shift(),n--}}},AnimaShowOnScroll.prototype.resetScrolling=function(){for(var t=window.pageYOffset+window.innerHeight,n=0;n<this.toShow.length;n++){var o=this.toShow[n];this.show(o)}this.toShow=[],this.nextEventY;var i=Array.prototype.slice.call(document.getElementsByTagName(\"*\"));i=i.filter(function(t){return null!=t.getAttribute(\"anima-show-on-scroll\")});var e=this.getTop;i.sort(function(t,n){return e(t)-e(n)});for(n=0;n<i.length;n++){o=i[n];var r=this.getTop(o);r<t||(this.toShow.push(o),this.hide(o),this.nextEventY=null!=this.nextEventY?this.nextEventY:r)}},AnimaShowOnScroll.prototype.handleEvent=function(t){switch(t.type){case\"scroll\":this.onScroll();break;case\"resize\":this.resetScrolling()}},AnimaShowOnScroll.prototype.init=function(){this.resetScrolling(),window.addEventListener(\"scroll\",this),window.addEventListener(\"resize\",this)},setTimeout(function(){(new AnimaShowOnScroll).init()},250);"),
]

let Controller

class CoverView extends React.Component {
  static get Controller() {
    if (Controller) return Controller

    try {
      Controller = require('../controllers/CoverController')
      Controller = Controller.default || Controller

      return Controller
    }
    catch (e) {
      if (e.code == 'MODULE_NOT_FOUND') {
        Controller = CoverView

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
    const proxies = Controller !== CoverView ? transformProxies(this.props.children) : {

    }

    return (
      <span>
        <style dangerouslySetInnerHTML={{ __html: `
          @import url(/css/cover.css);
        ` }} />
        <span className="af-view">
          <div style={{margin: 0, background: 'rgba(255, 255, 255, 1.0)'}}>
            <input id="anPageName" name="page" type="hidden" defaultValue="cover" />
            <div className="af-class-cover">
              <div style={{width: 1200, height: '100%', position: 'relative', margin: 'auto'}}>
                <div className="af-class-header">
                  <div className="af-class-cover-bg">
                  </div>
                  <img anima-src="./img/covercover image.jpg" className="af-class-cover-image" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" />
                  <div className="af-class-hello-box af-class-an-animation-enter ">
                    <div className="af-class-background">
                    </div>
                    <img anima-src="./img/covercorner@2x.png" className="af-class-corner" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" />
                    <div className="af-class-jenny-doe">
                      JENNY
                      <br />
                      DOE
                    </div>
                    <div className="af-class-i-m">
                      I'M
                    </div>
                  </div>
                </div>
                <div className="af-class-portfolio-template af-class-an-animation-enter1 ">
                  Portfolio Template
                </div>
                <img anima-src="./img/coverbitmap.png" className="af-class-bitmap" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" />
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

module.exports = CoverView

/* eslint-enable */