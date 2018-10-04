/* eslint-disable */

const React = require('react')
const ReactDOM = require('react-dom')
const { createScope, transformProxies, map } = require('./helpers')

const scripts = [
  Promise.resolve("window.anima_isHidden=void 0!==window.anima_isHidden?window.anima_isHidden:function(n){return n instanceof HTMLElement&&(\"none\"==getComputedStyle(n).display||!(!n.parentNode||!anima_isHidden(n.parentNode)))},window.anima_loadAsyncSrcForTag=void 0!==window.anima_loadAsyncSrcForTag?window.anima_loadAsyncSrcForTag:function(n){for(var i=document.getElementsByTagName(n),a=[],e=0;e<i.length;e++){var o=(d=i[e]).getAttribute(\"src\");if(!(null!=o&&0<o.length&&\"data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==\"!=o))null!=(t=d.getAttribute(\"anima-src\"))&&0!=t.length&&(anima_isHidden(d)||a.push(d))}a.sort(function(n,i){return anima_getTop(n)-anima_getTop(i)});for(e=0;e<a.length;e++){var d,t=(d=a[e]).getAttribute(\"anima-src\");d.setAttribute(\"src\",t)}},window.anima_pauseHiddenVideos=void 0!==window.anima_pauseHiddenVideos?window.anima_pauseHiddenVideos:function(n){for(var i=document.getElementsByTagName(\"video\"),a=0;a<i.length;a++){var e=i[a],o=!!(0<e.currentTime&&!e.paused&&!e.ended&&2<e.readyState),d=anima_isHidden(e);o||d||\"autoplay\"!=e.getAttribute(\"autoplay\")?o&&d&&e.pause():e.play()}},window.anima_loadAsyncSrc=void 0!==window.anima_loadAsyncSrc?window.anima_loadAsyncSrc:function(n){anima_loadAsyncSrcForTag(\"img\"),anima_loadAsyncSrcForTag(\"iframe\"),anima_loadAsyncSrcForTag(\"video\"),anima_pauseHiddenVideos()};var anima_getTop=function(n){for(var i=0;i+=n.offsetTop||0,n=n.offsetParent;);return i};anima_loadAsyncSrc(),window.anima_old_onResize=\"undefined\"==typeof anima_old_onResize?window.onresize:anima_old_onResize,window.anima_new_onResize=\"undefined\"==typeof anima_new_onResize?void 0:anima_new_onResize,window.anima_updateOnResize=void 0!==window.anima_updateOnResize?window.anima_updateOnResize:function(){null!=anima_new_onResize&&window.onresize==anima_new_onResize||(window.anima_new_onResize=void 0!==window.anima_new_onResize?window.anima_new_onResize:function(n){null!=anima_old_onResize&&anima_old_onResize(n),anima_loadAsyncSrc()},window.onresize=void 0!==window.onresize?window.onresize:anima_new_onResize,setTimeout(function(){anima_updateOnResize()},3e3))},anima_updateOnResize(),setTimeout(function(){anima_loadAsyncSrc()},200);"),
  Promise.resolve("function AnimaShowOnScroll(){this.toShow=[],this.nextEventY=void 0}AnimaShowOnScroll.prototype.show=function(t){t.style.display=\"\"},AnimaShowOnScroll.prototype.hide=function(t){t.style.display=\"none\"},AnimaShowOnScroll.prototype.getTop=function(t){if(null!=t.animaTop&&0!=t.animaTop)return t.animaTop;for(var n=0,o=t;n+=o.offsetTop||0,o=o.offsetParent;);return t.animaTop=n},AnimaShowOnScroll.prototype.onScroll=function(){var t=window.pageYOffset+window.innerHeight;if(!(null==this.nextEventY||this.nextEventY>t)){this.nextEventY=void 0;for(var n=0;n<this.toShow.length;n++){var o=this.toShow[n],i=this.getTop(o);if(!(i<t)){this.nextEventY=i;break}this.show(o),this.toShow.shift(),n--}}},AnimaShowOnScroll.prototype.resetScrolling=function(){for(var t=window.pageYOffset+window.innerHeight,n=0;n<this.toShow.length;n++){var o=this.toShow[n];this.show(o)}this.toShow=[],this.nextEventY;var i=Array.prototype.slice.call(document.getElementsByTagName(\"*\"));i=i.filter(function(t){return null!=t.getAttribute(\"anima-show-on-scroll\")});var e=this.getTop;i.sort(function(t,n){return e(t)-e(n)});for(n=0;n<i.length;n++){o=i[n];var r=this.getTop(o);r<t||(this.toShow.push(o),this.hide(o),this.nextEventY=null!=this.nextEventY?this.nextEventY:r)}},AnimaShowOnScroll.prototype.handleEvent=function(t){switch(t.type){case\"scroll\":this.onScroll();break;case\"resize\":this.resetScrolling()}},AnimaShowOnScroll.prototype.init=function(){this.resetScrolling(),window.addEventListener(\"scroll\",this),window.addEventListener(\"resize\",this)},setTimeout(function(){(new AnimaShowOnScroll).init()},250);"),
  Promise.resolve("window.animaShowOverlay=void 0!==window.animaShowOverlay?window.animaShowOverlay:function(e,a){e=\"overlay-\"+e,-1==document.getElementById(e).className.split(\" \").slice(-1)[0].lastIndexOf(\"an-animation-\")&&(document.getElementById(e).className=document.getElementById(e).className+\" \"+a)},window.animaHideOverlay=void 0!==window.animaHideOverlay?window.animaHideOverlay:function(e,a){e=\"overlay-\"+e;var n=document.getElementById(e).className.split(\" \");-1!=n.slice(-1)[0].lastIndexOf(\"an-animation-\")&&(n.splice(-1),n.push(a),document.getElementById(e).className=n.join(\" \"),n.splice(-1),setTimeout(function(){document.getElementById(e).className=n.join(\" \")},1100))};"),
]

let Controller

class HomeView extends React.Component {
  static get Controller() {
    if (Controller) return Controller

    try {
      Controller = require('../controllers/HomeController')
      Controller = Controller.default || Controller

      return Controller
    }
    catch (e) {
      if (e.code == 'MODULE_NOT_FOUND') {
        Controller = HomeView

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
    const proxies = Controller !== HomeView ? transformProxies(this.props.children) : {
      'cow': [],
      'drink': [],
      'burger': [],
      'menu': [],
    }

    return (
      <span>
        <style dangerouslySetInnerHTML={{ __html: `
          @import url(/css/menuOverlay.css);
          @import url(/css/home.css);
        ` }} />
        <span className="af-view">
          <input id="anPageName" name="page" type="hidden" defaultValue="home" />
          <form action="form1" className="af-class-bp2-home" method="post" name="form1">
            <div className="af-class-bp2-grid-layout-container">
              <div className="af-class-bp2-grid">
                {map(proxies['cow'], props => <a {...props}>{props.children ? props.children : <React.Fragment>
                  <div anima-show-on-scroll className="af-class-bp2-cell bp2-an-animation-enter ">
                    <img anima-src="./img/homecontent@2x.png" className="af-class-bp2-content" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" />
                    <div className="af-class-bp2-overlay">
                      <div className="af-class-bp2-white-overlay">
                      </div>
                      <div className="af-class-bp2-the-cow-goes-app">
                        THE COW GOES
                        <br />
                        <br />
                        #APP
                      </div>
                    </div>
                  </div>
                </React.Fragment>}</a>)}
                <a href="projectpage.html">
                  <div anima-show-on-scroll className="af-class-bp2-view1 bp2-an-animation-enter1 ">
                    <img anima-src="./img/homecontent  1@2x.png" className="af-class-bp2-image1" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" />
                    <div className="af-class-bp2-view2">
                      <div className="af-class-bp2-view3">
                      </div>
                      <div className="af-class-bp2-coin-logo">
                        COIN
                        <br />
                        <br />
                        #LOGO
                      </div>
                    </div>
                  </div>
                </a>
                <a href="projectpage.html">
                  <div anima-show-on-scroll className="af-class-bp2-view4 bp2-an-animation-enter2 ">
                    <img anima-src="./img/homecontent  2@2x.png" className="af-class-bp2-image2" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" />
                    <div className="af-class-bp2-view5">
                      <div className="af-class-bp2-view6">
                      </div>
                      <div className="af-class-bp2-pine-logo">
                        PINE
                        <br />
                        <br />
                        #LOGO
                      </div>
                    </div>
                  </div>
                </a>
                {map(proxies['drink'], props => <a {...props}>{props.children ? props.children : <React.Fragment>
                  <div anima-show-on-scroll className="af-class-bp2-view7 bp2-an-animation-enter3 ">
                    <img anima-src="./img/homecontent  3@2x.png" className="af-class-bp2-image3" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" />
                    <div className="af-class-bp2-view8">
                      <div className="af-class-bp2-view9">
                      </div>
                      <div className="af-class-bp2-hava-drink-app">
                        HAVA DRINK
                        <br />
                        <br />
                        #APP
                      </div>
                    </div>
                  </div>
                </React.Fragment>}</a>)}
                {map(proxies['burger'], props => <a {...props}>{props.children ? props.children : <React.Fragment>
                  <div anima-show-on-scroll className="af-class-bp2-view10 bp2-an-animation-enter4 ">
                    <img anima-src="./img/homecontent  4@2x.png" className="af-class-bp2-image4" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" />
                    <div className="af-class-bp2-view11">
                      <div className="af-class-bp2-view12">
                      </div>
                      <div className="af-class-bp2-magic-burger-app">
                        MAGIC BURGER
                        <br />
                        <br />
                        #APP
                      </div>
                    </div>
                  </div>
                </React.Fragment>}</a>)}
                <a href="projectpage.html">
                  <div anima-show-on-scroll className="af-class-bp2-view13 bp2-an-animation-enter5 ">
                    <img anima-src="./img/homecontent  5@2x.png" className="af-class-bp2-image5" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" />
                    <div className="af-class-bp2-view14">
                      <div className="af-class-bp2-view15">
                      </div>
                      <div className="af-class-bp2-open-orange-logo">
                        OPEN ORANGE
                        <br />
                        <br />
                        #LOGO
                      </div>
                    </div>
                  </div>
                </a>
              </div>
            </div>
            <div className="af-class-bp2-my-work-layout-container">
              <div anima-show-on-scroll className="af-class-bp2-my-work bp2-an-animation-enter6 ">
                - MY WORK -
              </div>
            </div>
            <div className="af-class-bp2-keep-in-touch-layout-container">
              <div anima-show-on-scroll className="af-class-bp2-keep-in-touch bp2-an-animation-enter7 ">
                - KEEP IN TOUCH -
              </div>
            </div>
            <div className="af-class-bp2-top-bar-bg">
            </div>
            <div className="af-class-bp2-header-layout-container">
              <div className="af-class-bp2-header">
                <div className="af-class-bp2-cover-bg">
                </div>
                <img anima-src="./img/homecover image.jpg" className="af-class-bp2-cover-image" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" />
                <div className="af-class-bp2-hello-box bp2-an-animation-enter8 ">
                  <div className="af-class-bp2-background">
                  </div>
                  <img anima-src="./img/homecorner@2x.png" className="af-class-bp2-corner" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" />
                  <div className="af-class-bp2-jenny-doe">
                    JENNY
                    <br />
                    DOE
                  </div>
                  <div className="af-class-bp2-i-m">
                    I'M
                  </div>
                </div>
                <div className="af-class-bp2-ux-designer bp2-an-animation-enter9 ">
                  UX DESIGNER
                </div>
                <div className="af-class-bp2-hello bp2-an-animation-enter10 ">
                  Hello.
                </div>
              </div>
            </div>
            {map(proxies['menu'], props => <a {...props}>{props.children ? props.children : <React.Fragment>
              <img anima-src="./img/project page mobilemenubutton@2x.png" className="af-class-bp2-menu-button bp2-an-animation-enter11 " src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" />
            </React.Fragment>}</a>)}
            <div className="af-class-bp2-footer-layout-container">
              <div className="af-class-bp2-footer">
                <div className="af-class-bp2-footer-bg">
                </div>
                <a href="https://launchpad.animaapp.com" target="_blank">
                  <div className="af-class-bp2-a-portfolio-template">
                    A Portfolio Template by AnimaApp.com
                  </div>
                </a>
                <a href="tel:+1-800-555-123456">
                  <div className="af-class-bp2-phone">
                    1.800.555.123456
                  </div>
                </a>
                <div className="af-class-bp2-social">
                  <a href="https://twitter.com/AnimaApp" target="_blank">
                    <img anima-src="./img/homedribbble@2x.png" className="af-class-bp2-dribbble" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" />
                  </a>
                  <a href="https://facebook.com/groups/animaapp/" target="_blank">
                    <img anima-src="./img/homebehance@2x.png" className="af-class-bp2-behance" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" />
                  </a>
                  <a href="https://facebook.com/groups/animaapp/" target="_blank">
                    <img anima-src="./img/homefacebook@2x.png" className="af-class-bp2-facebook" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" />
                  </a>
                  <a href="https://twitter.com/AnimaApp">
                    <img anima-src="./img/hometwitter@2x.png" className="af-class-bp2-twitter" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" />
                  </a>
                </div>
                <a href="mailto:hello@mydomain.com">
                  <div className="af-class-bp2-email-link">
                    hello@mydomain.com
                  </div>
                </a>
                <div className="af-class-bp2-form">
                  <div className="af-class-bp2-top-fields">
                    <input className="af-class-bp2-text-name" name="textName" placeholder="Name" />
                    <input className="af-class-bp2-text-email" name="textEmail" placeholder="Email" />
                    <img anima-src="./img/homeline.png" className="af-class-bp2-line" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" />
                  </div>
                  <div className="af-class-bp2-view16">
                    <div className="af-class-bp2-rectangle3">
                    </div>
                    <textarea className="af-class-bp2-text-how-can-i-help" name="textHowCanIHelp" placeholder="How Can I Help?

        " defaultValue={"                        </div>\n                        <a href=\"#\" onclick=\"document.getElementsByName('form1')[0].submit(); if (window.submitted) window.submitted();\">\n                            <div class=\"af-class-bp2-send\">\n                                <div class=\"af-class-bp2-view17\">\n                                </div>\n                                <div class=\"af-class-bp2-label1\">\n                                    SEND\n                                </div>\n                            </div>\n                        </a>\n                    </div>\n                </div>\n            </div>\n        </form>\n        <form action=\"form2\" class=\"af-class-bp1-home-mobile\" method=\"post\" name=\"form2\">\n            <div class=\"af-class-bp1-grid-layout-container\">\n                <div class=\"af-class-bp1-grid\">\n                    <a href=\"projectpage.html\">\n                        <div anima-show-on-scroll=\"\" class=\"af-class-bp1-cell bp1-an-animation-enter \">\n                            <img anima-src=\"./img/home mobilecontent@2x.png\" class=\"af-class-bp1-content\" src=\"data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==\"/>\n                        </div>\n                    </a>\n                    <a href=\"projectpage.html\">\n                        <div anima-show-on-scroll=\"\" class=\"af-class-bp1-view1 bp1-an-animation-enter1 \">\n                            <img anima-src=\"./img/home mobilecontent  1@2x.png\" class=\"af-class-bp1-image1\" src=\"data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==\"/>\n                        </div>\n                    </a>\n                    <a href=\"projectpage.html\">\n                        <div anima-show-on-scroll=\"\" class=\"af-class-bp1-view2 bp1-an-animation-enter2 \">\n                            <img anima-src=\"./img/home mobilecontent  2@2x.png\" class=\"af-class-bp1-image2\" src=\"data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==\"/>\n                        </div>\n                    </a>\n                    <a href=\"projectpage.html\">\n                        <div anima-show-on-scroll=\"\" class=\"af-class-bp1-view3 bp1-an-animation-enter3 \">\n                            <img anima-src=\"./img/home mobilecontent  3@2x.png\" class=\"af-class-bp1-image3\" src=\"data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==\"/>\n                        </div>\n                    </a>\n                    <a href=\"projectpage.html\">\n                        <div anima-show-on-scroll=\"\" class=\"af-class-bp1-view4 bp1-an-animation-enter4 \">\n                            <img anima-src=\"./img/home mobilecontent  4@2x.png\" class=\"af-class-bp1-image4\" src=\"data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==\"/>\n                        </div>\n                    </a>\n                    <a href=\"projectpage.html\">\n                        <div anima-show-on-scroll=\"\" class=\"af-class-bp1-view5 bp1-an-animation-enter5 \">\n                            <img anima-src=\"./img/home mobilecontent  5@2x.png\" class=\"af-class-bp1-image5\" src=\"data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==\"/>\n                        </div>\n                    </a>\n                </div>\n            </div>\n            <div class=\"af-class-bp1-my-work-layout-container\">\n                <div anima-show-on-scroll=\"\" class=\"af-class-bp1-my-work bp1-an-animation-enter6 \">\n                    - MY WORK -\n                </div>\n            </div>\n            <div class=\"af-class-bp1-keep-in-touch-layout-container\">\n                <div anima-show-on-scroll=\"\" class=\"af-class-bp1-keep-in-touch bp1-an-animation-enter7 \">\n                    - KEEP IN TOUCH -\n                </div>\n            </div>\n            <div class=\"af-class-bp1-top-bar-bg\">\n            </div>\n            <div class=\"af-class-bp1-header-layout-container\">\n                <div class=\"af-class-bp1-header\">\n                    <div class=\"af-class-bp1-cover-bg\">\n                    </div>\n                    <img anima-src=\"./img/home mobilecover image.jpg\" class=\"af-class-bp1-cover-image\" src=\"data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==\"/>\n                    <div class=\"af-class-bp1-hello-box bp1-an-animation-enter8 \">\n                        <div class=\"af-class-bp1-background\">\n                        </div>\n                        <img anima-src=\"./img/home mobilecorner@2x.png\" class=\"af-class-bp1-corner\" src=\"data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==\"/>\n                        <div class=\"af-class-bp1-jenny-doe\">\n                            JENNY\n                            <br/>\n                            DOE\n                        </div>\n                        <div class=\"af-class-bp1-i-m\">\n                            I'M\n                        </div>\n                    </div>\n                    <div class=\"af-class-bp1-ux-designer bp1-an-animation-enter9 \">\n                        UX DESIGNER\n                    </div>\n                    <div class=\"af-class-bp1-hello bp1-an-animation-enter10 \">\n                        Hello.\n                    </div>\n                </div>\n            </div>\n            <a href=\"javascript:animaShowOverlay('menuoverlay', 'bp1-an-animation-enter12'); anima_loadAsyncSrc(); \">\n                <img anima-src=\"./img/project page mobilemenubutton@2x.png\" class=\"af-class-bp1-menu-button bp1-an-animation-enter11 \" src=\"data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==\"/>\n            </a>\n            <div class=\"af-class-bp1-footer-layout-container\">\n                <div class=\"af-class-bp1-footer\">\n                    <div class=\"af-class-bp1-footer-bg\">\n                    </div>\n                    <a href=\"https://launchpad.animaapp.com\" target=\"_blank\">\n                        <div class=\"af-class-bp1-a-portfolio-template\">\n                            A Portfolio Template by AnimaApp.com\n                        </div>\n                    </a>\n                    <a href=\"tel:+1-800-555-123456\">\n                        <div class=\"af-class-bp1-phone\">\n                            1.800.555.123456\n                        </div>\n                    </a>\n                    <div class=\"af-class-bp1-social\">\n                        <a href=\"https://facebook.com/groups/animaapp/\" target=\"_blank\">\n                            <img anima-src=\"./img/homefacebook@2x.png\" class=\"af-class-bp1-facebook\" src=\"data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==\"/>\n                        </a>\n                        <a href=\"https://twitter.com/AnimaApp\">\n                            <img anima-src=\"./img/home mobiletwitter@2x.png\" class=\"af-class-bp1-twitter\" src=\"data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==\"/>\n                        </a>\n                        <a href=\"https://twitter.com/AnimaApp\" target=\"_blank\">\n                            <img anima-src=\"./img/home mobiledribbble@2x.png\" class=\"af-class-bp1-dribbble\" src=\"data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==\"/>\n                        </a>\n                        <a href=\"https://facebook.com/groups/animaapp/\" target=\"_blank\">\n                            <img anima-src=\"./img/home mobilebehance@2x.png\" class=\"af-class-bp1-behance\" src=\"data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==\"/>\n                        </a>\n                    </div>\n                    <a href=\"mailto:hello@mydomain.com\">\n                        <div class=\"af-class-bp1-email-link\">\n                            hello@mydomain.com\n                        </div>\n                    </a>\n                    <div class=\"af-class-bp1-form\">\n                        <div class=\"af-class-bp1-top-fields\">\n                            <input class=\"af-class-bp1-text-name\" name=\"textName\" placeholder=\"Name\"/>\n                            <img anima-src=\"./img/home mobileline  1.png\" class=\"af-class-bp1-line\" src=\"data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==\"/>\n                        </div>\n                        <div class=\"af-class-bp1-view6\">\n                            <input class=\"af-class-bp1-text-email\" name=\"textEmail\" placeholder=\"Email\"/>\n                            <img anima-src=\"./img/home mobileline  1.png\" class=\"af-class-bp1-image6\" src=\"data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==\"/>\n                        </div>\n                        <div class=\"af-class-bp1-view7\">\n                            <div class=\"af-class-bp1-rectangle3\">\n                            </div>\n                            <textarea class=\"af-class-bp1-text-how-can-i-help\" name=\"textHowCanIHelp\" placeholder=\"How Can I Help?\n\n\"/>\n                        </div>\n                        <a href=\"#\" onclick=\"document.getElementsByName('form2')[0].submit(); if (window.submitted) window.submitted();\">\n                            <div class=\"af-class-bp1-send\">\n                                <div class=\"af-class-bp1-view8\">\n                                </div>\n                                <div class=\"af-class-bp1-label1\">\n                                    SEND\n                                </div>\n                            </div>\n                        </a>\n                    </div>\n                </div>\n            </div>\n        </form>\n        <div class=\"anima-overlay\" id=\"overlay-menuoverlay\" style=\"min-height:2442px;\">\n            <a href=\"javascript:animaHideOverlay('menuoverlay', 'anima-animate-disappear');\">\n                <div class=\"af-class-menu-overlay\">\n                    <a href=\"javascript:animaHideOverlay('menuoverlay', 'anima-animate-disappear');\">\n                        <img anima-src=\"./img/menu overlaymenu x@2x.png\" class=\"af-class-menu-x af-class-an-animation-enter2 \" src=\"data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==\"/>\n                        <div class=\"af-class-stacked-group-layout-container\">\n                            <div class=\"af-class-stacked-group af-class-an-animation-enter3 \">\n                                <a href=\"home.html\">\n                                    <div class=\"af-class-home\">\n                                        Home\n                                    </div>\n                                </a>\n                                <a href=\"projectpage.html\">\n                                    <div class=\"af-class-sample-project\">\n                                        Sample Project\n                                    </div>\n                                </a>\n                                <a href=\"https://animaapp.s3.amazonaws.com/medium/portfolio-template/Portfolio%20Sample.sketch\" target=\"_blank\">\n                                    <div class=\"af-class-download-template\">\n                                        Download Template\n                                    </div>\n                                </a>\n                                <a href=\"https://medium.com/@AnimaApp/responsive-website-template-portfolio-d9759dd78c24\" target=\"_blank\">\n                                    <div class=\"af-class-medium-article\">\n                                        Medium Article\n                                    </div>\n                                </a>\n                            </div>\n                        </div>\n                    </a>\n                </div>\n                <style>\n                    .af-view .anima-overlay {\n                        position            : fixed;\n                    }\n                </style>\n            </a>\n        </div>\n        <!-- Scripts -->\n        \n        \n        \n        <!-- End of Scripts -->\n    \n  </span>\n"} /></div></div></div></div></form></span>
      </span>
    )
  }
}

module.exports = HomeView

/* eslint-enable */