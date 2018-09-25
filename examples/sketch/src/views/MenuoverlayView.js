/* eslint-disable */

const React = require('react')
const ReactDOM = require('react-dom')
const { createScope, transformProxies, map } = require('./helpers')

const scripts = [
  Promise.resolve("anima_isHidden=function(n){return n instanceof HTMLElement&&(\"none\"==getComputedStyle(n).display||!(!n.parentNode||!anima_isHidden(n.parentNode)))},anima_loadAsyncSrcForTag=function(n){for(var e=document.getElementsByTagName(n),a=[],i=0;i<e.length;i++){var t=(o=e[i]).getAttribute(\"src\");if(!(null!=t&&0<t.length&&\"data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==\"!=t))null!=(r=o.getAttribute(\"anima-src\"))&&0!=r.length&&(anima_isHidden(o)||a.push(o))}a.sort(function(n,e){return anima_getTop(n)-anima_getTop(e)});for(i=0;i<a.length;i++){var o,r=(o=a[i]).getAttribute(\"anima-src\");o.setAttribute(\"src\",r)}},anima_pauseHiddenVideos=function(n){for(var e=document.getElementsByTagName(\"video\"),a=0;a<e.length;a++){var i=e[a],t=!!(0<i.currentTime&&!i.paused&&!i.ended&&2<i.readyState),o=anima_isHidden(i);t||o||\"autoplay\"!=i.getAttribute(\"autoplay\")?t&&o&&i.pause():i.play()}},anima_loadAsyncSrc=function(n){anima_loadAsyncSrcForTag(\"img\"),anima_loadAsyncSrcForTag(\"iframe\"),anima_loadAsyncSrcForTag(\"video\"),anima_pauseHiddenVideos()};var anima_getTop=function(n){for(var e=0;e+=n.offsetTop||0,n=n.offsetParent;);return e};anima_loadAsyncSrc(),anima_old_onResize=window.onresize,anima_new_onResize=void 0,anima_updateOnResize=function(){null!=anima_new_onResize&&window.onresize==anima_new_onResize||(anima_new_onResize=function(n){null!=anima_old_onResize&&anima_old_onResize(n),anima_loadAsyncSrc()},window.onresize=anima_new_onResize,setTimeout(function(){anima_updateOnResize()},3e3))},anima_updateOnResize(),setTimeout(function(){anima_loadAsyncSrc()},200);"),
  Promise.resolve("function AnimaShowOnScroll(){this.toShow=[],this.nextEventY=void 0}AnimaShowOnScroll.prototype.show=function(t){t.style.display=\"\"},AnimaShowOnScroll.prototype.hide=function(t){t.style.display=\"none\"},AnimaShowOnScroll.prototype.getTop=function(t){if(null!=t.animaTop&&0!=t.animaTop)return t.animaTop;for(var n=0,o=t;n+=o.offsetTop||0,o=o.offsetParent;);return t.animaTop=n},AnimaShowOnScroll.prototype.onScroll=function(){var t=window.pageYOffset+window.innerHeight;if(!(null==this.nextEventY||this.nextEventY>t)){this.nextEventY=void 0;for(var n=0;n<this.toShow.length;n++){var o=this.toShow[n],i=this.getTop(o);if(!(i<t)){this.nextEventY=i;break}this.show(o),this.toShow.shift(),n--}}},AnimaShowOnScroll.prototype.resetScrolling=function(){for(var t=window.pageYOffset+window.innerHeight,n=0;n<this.toShow.length;n++){var o=this.toShow[n];this.show(o)}this.toShow=[],this.nextEventY;var i=Array.prototype.slice.call(document.getElementsByTagName(\"*\"));i=i.filter(function(t){return null!=t.getAttribute(\"anima-show-on-scroll\")});var e=this.getTop;i.sort(function(t,n){return e(t)-e(n)});for(n=0;n<i.length;n++){o=i[n];var r=this.getTop(o);r<t||(this.toShow.push(o),this.hide(o),this.nextEventY=null!=this.nextEventY?this.nextEventY:r)}},AnimaShowOnScroll.prototype.handleEvent=function(t){switch(t.type){case\"scroll\":this.onScroll();break;case\"resize\":this.resetScrolling()}},AnimaShowOnScroll.prototype.init=function(){this.resetScrolling(),window.addEventListener(\"scroll\",this),window.addEventListener(\"resize\",this)},setTimeout(function(){(new AnimaShowOnScroll).init()},250);"),
]

let Controller

class MenuoverlayView extends React.Component {
  static get Controller() {
    if (Controller) return Controller

    try {
      Controller = require('../controllers/MenuoverlayController')
      Controller = Controller.default || Controller

      return Controller
    }
    catch (e) {
      if (e.code == 'MODULE_NOT_FOUND') {
        Controller = MenuoverlayView

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
    const proxies = Controller !== MenuoverlayView ? transformProxies(this.props.children) : {

    }

    return (
      <span>
        <style dangerouslySetInnerHTML={{ __html: `
          @import url(/css/menuOverlay.css);
        ` }} />
        <span className="af-view">
          <div style={{margin: 0}}>
            <input id="anPageName" name="page" type="hidden" defaultValue="menuoverlay" />
            <div className="af-class-menu-overlay">
              <a href="javascript:animaHideOverlay('menuoverlay', 'anima-animate-disappear');">
                <img anima-src="./img/menu overlaymenu x@2x.png" className="af-class-menu-x af-class-an-animation-enter2 " src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" />
              </a><div className="af-class-stacked-group-layout-container"><a href="javascript:animaHideOverlay('menuoverlay', 'anima-animate-disappear');">
                </a><div className="af-class-stacked-group af-class-an-animation-enter3 "><a href="javascript:animaHideOverlay('menuoverlay', 'anima-animate-disappear');">
                  </a><a href="home.html">
                    <div className="af-class-home">
                      Home
                    </div>
                  </a>
                  <a href="projectpage.html">
                    <div className="af-class-sample-project">
                      Sample Project
                    </div>
                  </a>
                  <a href="https://animaapp.s3.amazonaws.com/medium/portfolio-template/Portfolio%20Sample.sketch" target="_blank">
                    <div className="af-class-download-template">
                      Download Template
                    </div>
                  </a>
                  <a href="https://medium.com/@AnimaApp/responsive-website-template-portfolio-d9759dd78c24" target="_blank">
                    <div className="af-class-medium-article">
                      Medium Article
                    </div>
                  </a>
                </div>
              </div>
            </div>
            <style dangerouslySetInnerHTML={{__html: "\n            .af-view .anima-overlay {\n                position            : fixed;\n            }\n        " }} />
            {/* Scripts */}
            {/* End of Scripts */}
          </div>
        </span>
      </span>
    )
  }
}

module.exports = MenuoverlayView

/* eslint-enable */