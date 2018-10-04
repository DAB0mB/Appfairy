/* eslint-disable */

const React = require('react')
const ReactDOM = require('react-dom')
const { createScope, transformProxies, map } = require('./helpers')

const scripts = [
  Promise.resolve("window.anima_isHidden=void 0!==window.anima_isHidden?window.anima_isHidden:function(n){return n instanceof HTMLElement&&(\"none\"==getComputedStyle(n).display||!(!n.parentNode||!anima_isHidden(n.parentNode)))},window.anima_loadAsyncSrcForTag=void 0!==window.anima_loadAsyncSrcForTag?window.anima_loadAsyncSrcForTag:function(n){for(var i=document.getElementsByTagName(n),a=[],e=0;e<i.length;e++){var o=(d=i[e]).getAttribute(\"src\");if(!(null!=o&&0<o.length&&\"data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==\"!=o))null!=(t=d.getAttribute(\"anima-src\"))&&0!=t.length&&(anima_isHidden(d)||a.push(d))}a.sort(function(n,i){return anima_getTop(n)-anima_getTop(i)});for(e=0;e<a.length;e++){var d,t=(d=a[e]).getAttribute(\"anima-src\");d.setAttribute(\"src\",t)}},window.anima_pauseHiddenVideos=void 0!==window.anima_pauseHiddenVideos?window.anima_pauseHiddenVideos:function(n){for(var i=document.getElementsByTagName(\"video\"),a=0;a<i.length;a++){var e=i[a],o=!!(0<e.currentTime&&!e.paused&&!e.ended&&2<e.readyState),d=anima_isHidden(e);o||d||\"autoplay\"!=e.getAttribute(\"autoplay\")?o&&d&&e.pause():e.play()}},window.anima_loadAsyncSrc=void 0!==window.anima_loadAsyncSrc?window.anima_loadAsyncSrc:function(n){anima_loadAsyncSrcForTag(\"img\"),anima_loadAsyncSrcForTag(\"iframe\"),anima_loadAsyncSrcForTag(\"video\"),anima_pauseHiddenVideos()};var anima_getTop=function(n){for(var i=0;i+=n.offsetTop||0,n=n.offsetParent;);return i};anima_loadAsyncSrc(),window.anima_old_onResize=void 0!==window.anima_old_onResize?window.anima_old_onResize:window.onresize,window.anima_new_onResize=void 0!==window.anima_new_onResize?window.anima_new_onResize:void 0,window.anima_updateOnResize=void 0!==window.anima_updateOnResize?window.anima_updateOnResize:function(){null!=anima_new_onResize&&window.onresize==anima_new_onResize||(window.anima_new_onResize=void 0!==window.anima_new_onResize?window.anima_new_onResize:function(n){null!=anima_old_onResize&&anima_old_onResize(n),anima_loadAsyncSrc()},window.onresize=void 0!==window.onresize?window.onresize:anima_new_onResize,setTimeout(function(){anima_updateOnResize()},3e3))},anima_updateOnResize(),setTimeout(function(){anima_loadAsyncSrc()},200);"),
  Promise.resolve("function AnimaShowOnScroll(){this.toShow=[],this.nextEventY=void 0}AnimaShowOnScroll.prototype.show=function(t){t.style.display=\"\"},AnimaShowOnScroll.prototype.hide=function(t){t.style.display=\"none\"},AnimaShowOnScroll.prototype.getTop=function(t){if(null!=t.animaTop&&0!=t.animaTop)return t.animaTop;for(var n=0,o=t;n+=o.offsetTop||0,o=o.offsetParent;);return t.animaTop=n},AnimaShowOnScroll.prototype.onScroll=function(){var t=window.pageYOffset+window.innerHeight;if(!(null==this.nextEventY||this.nextEventY>t)){this.nextEventY=void 0;for(var n=0;n<this.toShow.length;n++){var o=this.toShow[n],i=this.getTop(o);if(!(i<t)){this.nextEventY=i;break}this.show(o),this.toShow.shift(),n--}}},AnimaShowOnScroll.prototype.resetScrolling=function(){for(var t=window.pageYOffset+window.innerHeight,n=0;n<this.toShow.length;n++){var o=this.toShow[n];this.show(o)}this.toShow=[],this.nextEventY;var i=Array.prototype.slice.call(document.getElementsByTagName(\"*\"));i=i.filter(function(t){return null!=t.getAttribute(\"anima-show-on-scroll\")});var e=this.getTop;i.sort(function(t,n){return e(t)-e(n)});for(n=0;n<i.length;n++){o=i[n];var r=this.getTop(o);r<t||(this.toShow.push(o),this.hide(o),this.nextEventY=null!=this.nextEventY?this.nextEventY:r)}},AnimaShowOnScroll.prototype.handleEvent=function(t){switch(t.type){case\"scroll\":this.onScroll();break;case\"resize\":this.resetScrolling()}},AnimaShowOnScroll.prototype.init=function(){this.resetScrolling(),window.addEventListener(\"scroll\",this),window.addEventListener(\"resize\",this)},setTimeout(function(){(new AnimaShowOnScroll).init()},250);"),
  Promise.resolve("window.animaShowOverlay=void 0!==window.animaShowOverlay?window.animaShowOverlay:function(e,a){e=\"overlay-\"+e,-1==document.getElementById(e).className.split(\" \").slice(-1)[0].lastIndexOf(\"an-animation-\")&&(document.getElementById(e).className=document.getElementById(e).className+\" \"+a)},window.animaHideOverlay=void 0!==window.animaHideOverlay?window.animaHideOverlay:function(e,a){e=\"overlay-\"+e;var n=document.getElementById(e).className.split(\" \");-1!=n.slice(-1)[0].lastIndexOf(\"an-animation-\")&&(n.splice(-1),n.push(a),document.getElementById(e).className=n.join(\" \"),n.splice(-1),setTimeout(function(){document.getElementById(e).className=n.join(\" \")},1100))};"),
]

let Controller

class ProjectpageView extends React.Component {
  static get Controller() {
    if (Controller) return Controller

    try {
      Controller = require('../controllers/ProjectpageController')
      Controller = Controller.default || Controller

      return Controller
    }
    catch (e) {
      if (e.code == 'MODULE_NOT_FOUND') {
        Controller = ProjectpageView

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
    const proxies = Controller !== ProjectpageView ? transformProxies(this.props.children) : {

    }

    return (
      <span>
        <style dangerouslySetInnerHTML={{ __html: `
          @import url(/css/menuOverlay.css);
          @import url(/css/projectpage.css);
        ` }} />
        <span className="af-view">
          <input id="anPageName" name="page" type="hidden" defaultValue="projectpage" />
          <div className="af-class-bp1-project-page-mobile">
            <img anima-src="./img/project page mobilerectangle.png" className="af-class-bp1-rectangle" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" />
            <div className="af-class-bp1-centered-layout-container">
              <div className="af-class-bp1-centered">
                <div className="af-class-bp1-a-hamburger-or-burge bp1-an-animation-enter13 ">
                  A hamburger or burger is a sandwich consisting of one or more cooked patties of ground meat, usually beef, placed inside a sliced bread roll or bun. The patty may be pan fried, barbecued, or flame broiled. Hamburgers are often served with cheese, lettuce, tomato, bacon, onion, pickles, or chiles; condiments such as mustard, mayonnaise, ketchup, relish, or "special sauce"; and are frequently placed on sesame seed buns. A hamburger topped with cheese is called a cheeseburger.
                  <br />
                  <br />
                  - Wikipedia
                </div>
                <a href="https://www.sketchappsources.com/contributor/alexisdoreau" target="_blank">
                  <div className="af-class-bp1-iphone-alexis-dorea bp1-an-animation-enter14 ">
                    iPhone: Alexis Doreau
                  </div>
                </a>
                <a href="https://www.sketchappsources.com/contributor/webalys" target="_blank">
                  <div className="af-class-bp1-icon-vincent-le-moi bp1-an-animation-enter15 ">
                    Icon: Vincent Le Moign
                  </div>
                </a>
                <div className="af-class-bp1-mockup-layout-container">
                  <img anima-src="./img/project page mobilemockup@2x.png" className="af-class-bp1-mockup bp1-an-animation-enter16 " src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" />
                </div>
                <div className="af-class-bp1-magic-burger bp1-an-animation-enter17 ">
                  Magic Burger
                </div>
              </div>
            </div>
            <a href="javascript:animaShowOverlay('menuoverlay', 'bp1-an-animation-enter19'); anima_loadAsyncSrc(); ">
              <img anima-src="./img/project page mobilemenubutton@2x.png" className="af-class-bp1-menu-button bp1-an-animation-enter18 " src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" />
            </a>
          </div>
          <div className="af-class-bp2-project-page">
            <img anima-src="./img/project pagerectangle.png" className="af-class-bp2-rectangle" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" />
            <div className="af-class-bp2-phone">
            </div>
            <div className="af-class-bp2-centered-layout-container">
              <div className="af-class-bp2-centered">
                <a href="https://www.sketchappsources.com/contributor/alexisdoreau" target="_blank">
                  <div className="af-class-bp2-iphone-alexis-dorea bp2-an-animation-enter13 ">
                    iPhone: Alexis Doreau
                  </div>
                </a>
                <a href="https://www.sketchappsources.com/contributor/webalys" target="_blank">
                  <div className="af-class-bp2-icon-vincent-le-moi bp2-an-animation-enter14 ">
                    Icon: Vincent Le Moign
                  </div>
                </a>
                <div className="af-class-bp2-a-hamburger-or-burge bp2-an-animation-enter15 ">
                  A hamburger or burger is a sandwich consisting of one or more cooked patties of ground meat, usually beef, placed inside a sliced bread roll or bun. The patty may be pan fried, barbecued, or flame broiled. Hamburgers are often served with cheese, lettuce, tomato, bacon, onion, pickles, or chiles; condiments such as mustard, mayonnaise, ketchup, relish, or "special sauce"; and are frequently placed on sesame seed buns. A hamburger topped with cheese is called a cheeseburger.
                  <br />
                  <br />
                  - Wikipedia
                </div>
                <img anima-src="./img/project pagemockup@2x.png" className="af-class-bp2-mockup bp2-an-animation-enter16 " src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" />
                <div className="af-class-bp2-magic-burger bp2-an-animation-enter17 ">
                  Magic Burger
                </div>
              </div>
            </div>
            <a href="javascript:animaShowOverlay('menuoverlay', 'bp2-an-animation-enter19'); anima_loadAsyncSrc(); ">
              <img anima-src="./img/project page mobilemenubutton@2x.png" className="af-class-bp2-menu-button bp2-an-animation-enter18 " src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" />
            </a>
          </div>
          <div className="anima-overlay" id="overlay-menuoverlay" style={{minHeight: 762}}>
            <a href="javascript:animaHideOverlay('menuoverlay', 'anima-animate-disappear');">
            </a><div className="af-class-menu-overlay"><a href="javascript:animaHideOverlay('menuoverlay', 'anima-animate-disappear');">
              </a><a href="javascript:animaHideOverlay('menuoverlay', 'anima-animate-disappear');">
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
            <style dangerouslySetInnerHTML={{__html: "\n                    .af-view .anima-overlay {\n                        position            : fixed;\n                    }\n                " }} />
          </div>
          {/* Scripts */}
          {/* End of Scripts */}
        </span>
      </span>
    )
  }
}

module.exports = ProjectpageView

/* eslint-enable */