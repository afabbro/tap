(function(e){"use strict";function v(e,t){r.async(function(){e.trigger("promise:resolved",{detail:t});e.isResolved=true;e.resolvedValue=t})}function m(e,t){r.async(function(){e.trigger("promise:failed",{detail:t});e.isRejected=true;e.rejectedValue=t})}var t=typeof window!=="undefined"?window:{};var n=t.MutationObserver||t.WebKitMutationObserver;var r,i;if(typeof process!=="undefined"&&{}.toString.call(process)==="[object process]"){i=function(e,t){process.nextTick(function(){e.call(t)})}}else if(n){var s=[];var o=new n(function(){var e=s.slice();s=[];e.forEach(function(e){var t=e[0],n=e[1];t.call(n)})});var u=document.createElement("div");o.observe(u,{attributes:true});i=function(e,t){s.push([e,t]);u.setAttribute("drainQueue","drainQueue")}}else{i=function(e,t){setTimeout(function(){e.call(t)},1)}}var a=function(e,t){this.type=e;for(var n in t){if(!t.hasOwnProperty(n)){continue}this[n]=t[n]}};var f=function(e,t){for(var n=0,r=e.length;n<r;n++){if(e[n][0]===t){return n}}return-1};var l=function(e){var t=e._promiseCallbacks;if(!t){t=e._promiseCallbacks={}}return t};var c={mixin:function(e){e.on=this.on;e.off=this.off;e.trigger=this.trigger;return e},on:function(e,t,n){var r=l(this),i,s;e=e.split(/\s+/);n=n||this;while(s=e.shift()){i=r[s];if(!i){i=r[s]=[]}if(f(i,t)===-1){i.push([t,n])}}},off:function(e,t){var n=l(this),r,i,s;e=e.split(/\s+/);while(i=e.shift()){if(!t){n[i]=[];continue}r=n[i];s=f(r,t);if(s!==-1){r.splice(s,1)}}},trigger:function(e,t){var n=l(this),r,i,s,o,u;if(r=n[e]){for(var f=0,c=r.length;f<c;f++){i=r[f];s=i[0];o=i[1];if(typeof t!=="object"){t={detail:t}}u=new a(e,t);s.call(o,u)}}}};var h=function(){this.on("promise:resolved",function(e){this.trigger("success",{detail:e.detail})},this);this.on("promise:failed",function(e){this.trigger("error",{detail:e.detail})},this)};var p=function(){};var d=function(e,t,n,r){var i,s;if(n){try{i=n(r.detail)}catch(o){s=o}}else{i=r.detail}if(i instanceof h){i.then(function(e){t.resolve(e)},function(e){t.reject(e)})}else if(n&&i){t.resolve(i)}else if(s){t.reject(s)}else{t[e](i)}};h.prototype={then:function(e,t){var n=new h;if(this.isResolved){r.async(function(){d("resolve",n,e,{detail:this.resolvedValue})},this)}if(this.isRejected){r.async(function(){d("reject",n,t,{detail:this.rejectedValue})},this)}this.on("promise:resolved",function(t){d("resolve",n,e,t)});this.on("promise:failed",function(e){d("reject",n,t,e)});return n},resolve:function(e){v(this,e);this.resolve=p;this.reject=p},reject:function(e){m(this,e);this.resolve=p;this.reject=p}};c.mixin(h.prototype);r={async:i,Promise:h,Event:a,EventTarget:c};e.RSVP=r})(window);var XDomainMessageClient=function(e){var t=e.RSVP;t.all=function(e){var n,r=[];var i=new t.Promise;var s=e.length;var o=function(e){return function(t){u(e,t)}};var u=function(e,t){r[e]=t;if(--s===0){i.resolve(r)}};var a=function(e){i.reject(e)};for(n=0;n<s;n++){e[n].then(o(n),a)}return i};var n=function(n){var r=0;var i={};var s=[];var o;var u;var a=this;var f=new t.Promise;var l=function(e,t,n){return function(){e.relay.postMessage({id:t,body:n},"*")}};if(!n){return null}u=e.frames[n];document.addEventListener("DOMContentLoaded",function(t){if(!u){temp=document.createElement("iframe");temp.setAttribute("name",n);temp.src=n;temp=document.body.appendChild(temp);temp.style.display="none";temp.addEventListener("load",function(t){a.relay=e.frames[n];f.resolve()},false)}},false);this.ready=function(e){s.push(e)};this.send=function(){var e=this.request.apply(this,arguments);e.resolve();return e};this.request=function(){var e=this,n,s=[],o;for(n=0;n<arguments.length;n++){r++;i[r]=new t.Promise;o=arguments[n];f.then(l(e,r,o));s.push(i[r])}return t.all(s)};e.addEventListener("message",function(e){if(e.data.id){i[e.data.id].resolve(e.data.body);delete i[e.data.id]}},false)};return n}(window);var XDomainMessageServer=function(){return{receive:function(e){var t=e;window.addEventListener("message",function(e){var n=function(){return{send:function(t){e.source.postMessage({id:e.data.id,body:t},"*")}}}();t({data:e.data.body,origin:e.origin,source:e.source},n)},false)}}}();var tap=function(){var e,t=[];var n=document.head||document.getElementsByTagName("head")[0];var r={};var i=function(e){var t=document.createElement("script");t.text=e;n.appendChild(t)};var s=function(e){return Array.prototype.slice.call(e,0)};return{setRepo:function(e,t){r[e]=new XDomainMessageClient(t)},init:function(){var r=[];var i=s(n.querySelectorAll("meta[name='tap-repository']"));var o=s(n.querySelectorAll("[data-tap-get]"));i.forEach(function(e){var t=e.getAttribute("data-id")||"default";tap.setRepo(t,e.getAttribute("content"))});o.forEach(function(e){r.push({url:e.getAttribute("data-tap-get")})});this.get(r).then(function(){e=true;t.forEach(function(e){e()})})},get:function(e,t){var n=arguments.length>1?e:"default";var s=arguments.length>1?t:arguments[0];client=r[n];return client.request(s).then(function(e){e=e[0];for(var t=0;t<e.length;t++){i(e[t])}})},ready:function(n){if(e){n()}else{t.push(n)}}}}();tap.init()