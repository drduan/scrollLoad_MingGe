/*   MingGe.scrollLoad2.5.4插件（Min）
 *
 *   2.5.4升级内容：加入bubblScrollLoad手动冒泡事件，container容器操作，这个功能在2.0的时候忘记了，修复各种事件机制，以及各种优化修复等
 *  
 *   图片或者节点滚动加载插件
 *
 *   MingGe.scrollLoad采用MingGeJS开发，兼容IE6/7/8，及尘世间所有一齐浏览器
 *
 *   作者：明哥先生-QQ399195513 QQ群：461550716 官网：www.shearphoto.com
 */
!function(a,b){var c,d=MingGe,e=document,f=d.delEvent,g=d.addEvent,h=d.trim,i=d.isFunction,j=d.isString,k=d.isEmptyObject,l=d.isUndefined,m=d.isNumber,n=[],o=["ease",500],p="MingGeScrollLoad",q=a.setTimeout,r=Object.prototype.toString,s="scroll",t=!!(d._protected.transition=d.html5Attribute("transition")),u=d._protected.opacity=d.html5Attribute("opacity"),v=function(c){var g,i,j,o,q,r,t,u=this,v=l(c=h(c)),w=e.body;for(t=0;t<u.length;t++)r=u[t],o=r==a||c==s&&(r==e||w&&r==w),q=o?d:r,g=q[p],m(g)&&(i=n[g])&&d.each(i,function(d,e){if((v||d==c)&&(j=e.callback.count,o&&d==s?j&&2>j?(o&&d==s&&delete i[d],f(a,s,e.callback),f(a,"resize",e.callback)):j&&e.callback.count--:(f(r,d,e.callback),delete i[d])),k(i)){delete n[g],k(n)&&(n=[]);try{delete q[p]}catch(h){q[p]=b}}})},w=function(a,b){for(var c=a.length-1;c>-1;c--)a[c].getAttribute(b.attr)?a[c].src=b.defaultSrc:a.splice(c,1)},x=function(a){return function(){a.timer&&(clearTimeout(a.timer),a.timer=null),a.timer=q(function(){a.run(),a.timer=null},a.arg.loadTime)}},y=function(a,b){return function(){var c=b.arg,d=c.animate;a.animate({opacity:1},d[1],d[0],function(){this.style[u]=null,c.success&&c.success.call(this)}),b.callback()}},z=function(a,b,c){a(b,"load",c),a(b,"error",c)},A=function(a,b){a.attr=j(a.attr)?h(a.attr):null,a.loadTime=m(a.loadTime=parseFloat(a.loadTime))&&0!==a.loadTime?a.loadTime:50,i(a.success)||(a.success=!1),a.defaultSrc&&a.attr&&w(b,a),a.animate===!1||d.isArray(a.animate)||(a.animate=o)},B=function(b,e,f){c||(c={attr:"_src",loadTime:50,container:d(a),del:!0,animate:o,event:s});var g=r.call(e);i(f)||(f=i(e,g)?e:!1),d.isObject(e,g)||(e={}),e.event=j(e.event)?h(e.event):c.event,e.container||(e.container=c.container),this.callback=x(this),this.callback.count=0,this.inImg(b,e,f)};B.prototype={inImg:function(a,b,c){if(j(b.defaultSrc)){b.defaultSrc=h(b.defaultSrc);var d=new Image,e=this,i=function(){z(f,d,i),e.writeEvent(e.callback,a,b),c&&c()};z(g,d,i),d.src=b.defaultSrc}else this.writeEvent(this.callback,a,b),c&&c()},handle:function(b,e,f,h,i,j){var k,l,o=h[p],q=m(o)&&(k=n[o]);if(!j&&q&&(k=k[f.event]))A.call(k,k.arg=d.extend(k.arg,f),e),k.img=e,i&&k.callback();else if(l=this.callback,j||(q?q[f.event]=this:n[h[p]=n.push({})-1][f.event]=this),this.arg||(A.call(this,this.arg=d.extend(c,f),e),this.img=e),b==a&&i?(g(a,s,l),g(a,"resize",l)):g(b,f.event,l),i)return!0},writeEvent:function(b,c,f){var g,h,i,j=0,k=0,l=e.body,m=f.event==s;if(f.container&&f.container.version){for(;g=f.container[j++];)m&&(g==a||g==e||l&&g==l)?k||(k=1):(h=g==a?d:g,this.handle(g,c,f,h,m)===!0&&(k++,i=!0));(b.count=k)&&(this.handle(a,c,f,d,m,i),this.arg&&b())}},setSrc:function(a,b,c){var e,h,i,j=a[b],k=!1,l=this.arg;j&&(k=this.isRange(c,j),k&&(a.splice(b,1),k!==!0&&(e=this,h=new Image,i=function(){z(f,h,i),t&&l.animate?(j.style[u]=0,q(y(d(j),e),10)):(q(function(){e.callback()},10),l.success&&l.success.call(j)),j.src=k,j.removeAttribute(l.attr)},z(g,h,i),h.src=k),h||l.success&&l.success.call(j))),k===!1&&a.splice(b,1)},isRange:function(a,b){var c,d,e,f,g,h,i,j,k,l=this.arg.attr?b.getAttribute(this.arg.attr):!0;return l?(c=b.getBoundingClientRect(),d=a[0],e=d+a[2],f=a[1],g=f+a[3],h=c.left+d+1,i=h+b.offsetWidth,j=c.top+f+1,k=j+b.offsetHeight,(j>f&&g>j||k>f&&g>k)&&(h>d&&e>h||i>d&&e>i)?l:void 0):!1},Calculation:function(){var a=this.img,b=a.length-1;if(0>b)this.arg.del&&v.call(this.arg.container,this.arg.event);else for(;b>-1;b--)this.setSrc(a,b,arguments)},run:function(){var a=d(e);this.Calculation(a.scrollLeft(),a.scrollTop(),a.clientWidth(),a.clientHeight())}},d.fn.extend({delScrollLoad:function(a){return v.call(this,a),this},bubblScrollLoad:function(b){var c,f,g,i=0;for(b=j(b)&&h(b)||s;c=this[i++];)g=c==a||b==s&&(c==e||c==e.body)?d:c,f=g[p],m(f)&&(g=n[f])&&(g=n[f][b])&&g.callback();return this},scrollLoad:function(a,b){return new B(this.slice(),a,b),this}})}(window);