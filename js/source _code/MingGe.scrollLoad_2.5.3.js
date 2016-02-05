/*   MingGe.scrollLoad2.53插件（Min）
 *
 *   2.53升级内容：加入bubblScrollLoad手动冒泡事件，container容器操作，这个功能在2.0的时候忘记了，修复各种事件机制，以及各种优化修复等
 *  
 *   图片或者节点滚动加载插件
 *
 *   MingGe.scrollLoad采用MingGeJS开发，兼容IE6/7/8，及尘世间所有一齐浏览器
 *
 *   作者：明哥先生-QQ399195513 QQ群：461550716 官网：www.shearphoto.com
 */
(function(window, undefined) {
    var D = MingGe,
    DOC = document,
    delEvent = D.delEvent,
    addEvent = D.addEvent,
    trim = D.trim,
    isFunction = D.isFunction,
    isString = D.isString,
    isEmptyObject = D.isEmptyObject,
    isUndefined = D.isUndefined,
    isNumber = D.isNumber,
    cacheData = [],
    aniArr = ["ease", 500],
    MG = "MingGeScrollLoad",
    ST = setTimeout,
    scr = "scroll",
    isTransition = !!(D._protected.transition = D.html5Attribute("transition")),
    getOpacity = D._protected.opacity = D.html5Attribute("opacity"),
    defaultArg,
    del = function(eve) {
        var container = this,
        MGSL, cache, isUn = isUndefined(eve = trim(eve)),
        count,
        isWin,
        eCache,
        elem,
        bodys = DOC.body;
        for (var i = 0; i < container.length; i++) {
            elem = container[i];
            isWin = elem == window || eve == scr && (elem == DOC || bodys && elem == bodys);
            eCache = isWin ? D: elem;
            MGSL = eCache[MG];
            if (isNumber(MGSL) && (cache = cacheData[MGSL])) {
                D.each(cache,
                function(k, v) {
                    if (isUn || k == eve) {
                        count = v.callback.count;
                        if (!isWin || k != scr) {
                            delEvent(elem, k, v.callback);
                            delete cache[k];
                        } else if (count && count < 2) {
                            isWin && k == scr && delete cache[k];
                            delEvent(window, scr, v.callback);
                            delEvent(window, "resize", v.callback);
                        } else {
                            count && v.callback.count--;
                        }
                    }
                    if (isEmptyObject(cache)) {
                        delete cacheData[MGSL];
                        if (isEmptyObject(cacheData)) {
                            cacheData = [];
                        }
                        try {
                            delete eCache[MG];
                        } catch(e) {
                            eCache[MG] = undefined;
                        }
                    }
                });
            }
        }
    },
    setDefault = function(elem, arg) {
        for (var i = elem.length - 1; i > -1; i--) {
            if (elem[i].getAttribute(arg.attr)) {
                elem[i].src = arg.defaultSrc;
            } else {
                elem.splice(i, 1);
            }
        }
    },
    initCallback = function(this_) {
        return function() {
            if (this_.timer) {
                clearTimeout(this_.timer);
                this_.timer = null;
            }
            this_.timer = ST(function() {
                this_.run();
                this_.timer = null;
            },
            this_.arg.loadTime);
        };
    },
    animate = function(MimgGet, this_) {
        return function() {
            var arg = this_.arg,
            ani = arg.animate;
            MimgGet.animate({
                opacity: 1
            },
            ani[1], ani[0],
            function() {
                this.style[getOpacity] = null;
                arg.success && arg.success.call(this);
            });
            this_.callback();
        };
    },
    imgEve = function(func, imgObj, imgLoad) {
        func(imgObj, "load", imgLoad);
        func(imgObj, "error", imgLoad);
    },
    forceArg = function(arg, elem) {
        arg.attr = isString(arg.attr) ? trim(arg.attr) : null;
        arg.loadTime = isNumber(arg.loadTime = parseFloat(arg.loadTime)) && arg.loadTime !== 0 ? arg.loadTime: 50;
        isFunction(arg.success) || (arg.success = false);
        arg.defaultSrc && arg.attr && setDefault(elem, arg);
        if (arg.animate !== false && !D.isArray(arg.animate)) {
            arg.animate = aniArr;
        }
    },
    scrollLoad = function(elem, arg, func) {
        defaultArg || (defaultArg = {
            attr: "_src",
            loadTime: 50,
            container: D(window),
            del: true,
            animate: aniArr,
            event: scr
        });
        var types = toString.call(arg);
        if (!isFunction(func)) {
            func = isFunction(arg, types) ? arg: false;
        }
        D.isObject(arg, types) || (arg = {});
        arg.event = isString(arg.event) ? trim(arg.event) : defaultArg.event;
        arg.container || (arg.container = defaultArg.container);
        this.callback = initCallback(this);
        this.callback.count = 0;
        this.inImg(elem, arg, func);
    };
    scrollLoad.prototype = {
        inImg: function(elem, arg, func) {
            if (isString(arg.defaultSrc)) {
                arg.defaultSrc = trim(arg.defaultSrc);
                var loading = new Image(),
                this_ = this,
                imgLoad = function() {
                    imgEve(delEvent, loading, imgLoad);
                    this_.writeEvent(this_.callback, elem, arg);
                    func && func();
                };
                imgEve(addEvent, loading, imgLoad);
                loading.src = arg.defaultSrc;
            } else {
                this.writeEvent(this.callback, elem, arg);
                func && func();
            }
        },
        handle: function(container, elem, arg, eCache, isScroll, isForce) {
            var MGSL = eCache[MG],
            cache,
            isCache = isNumber(MGSL) && (cache = cacheData[MGSL]);
            if (!isForce && isCache && (cache = cache[arg.event])) {
                forceArg.call(cache, cache.arg = D.extend(cache.arg, arg), elem);
                cache.img = elem;
                isScroll && cache.callback();
            } else {
                var callback = this.callback;
                if (!isForce) {
                    if (isCache) {
                        isCache[arg.event] = this;
                    } else {
                        cacheData[eCache[MG] = cacheData.push({}) - 1][arg.event] = this;
                    }
                }
                this.arg || (forceArg.call(this, this.arg = D.extend(defaultArg, arg), elem), this.img = elem);
                if (container == window && isScroll) {
                    addEvent(window, scr, callback);
                    addEvent(window, "resize", callback);
                } else {
                    addEvent(container, arg.event, callback);
                }
                if (isScroll) return true;
            }
        },
        writeEvent: function(callback, elem, arg) {
            var i = 0,
            container, eCache, is = 0,
            bodys = DOC.body,
            isScroll = arg.event == scr,
            isForce;
            if (arg.container && arg.container.version) {
                while (container = arg.container.nodeList[i++]) {
                    if (isScroll && (container == window || container == DOC || bodys && container == bodys)) {
                        is || (is = 1);
                    } else {
                        eCache = container == window ? D: container;
                        if (this.handle(container, elem, arg, eCache, isScroll) === true) {
                            is++;
                            isForce = true;
                        }
                    }
                }
                if (callback.count = is) {
                    this.handle(window, elem, arg, D, isScroll, isForce);
                    this.arg && callback();
                }
            }
        },
        setSrc: function(img, i, args) {
            var imgGet = img[i],
            src = false,
            arg = this.arg;
            if (imgGet) {
                src = this.isRange(args, imgGet);
                if (src) {
                    img.splice(i, 1);
                    if (src !== true) {
                        var this_ = this,
                        loading = new Image(),
                        imgLoad = function() {
                            imgEve(delEvent, loading, imgLoad);
                            if (isTransition && arg.animate) {
                                imgGet.style[getOpacity] = 0;
                                ST(animate(D(imgGet), this_), 10);
                            } else {
                                ST(function() {
                                    this_.callback();
                                },
                                10);
                                arg.success && arg.success.call(imgGet);
                            }
                            imgGet.src = src;
                            imgGet.removeAttribute(arg.attr);
                        };
                        imgEve(addEvent, loading, imgLoad);
                        loading.src = src;
                    }
                    loading || arg.success && arg.success.call(imgGet);
                }
            }
            src === false && img.splice(i, 1);
        },
        isRange: function(arg, imgGet) {
            var src = this.arg.attr ? imgGet.getAttribute(this.arg.attr) : true;
            if (src) {
                var rect = imgGet.getBoundingClientRect(),
                RangeL = arg[0],
                RangeLEnd = RangeL + arg[2],
                RangeT = arg[1],
                RangeTEnd = RangeT + arg[3],
                imgRangeL = rect.left + RangeL + 1,
                imgRangeLEnd = imgRangeL + imgGet.offsetWidth,
                imgRangeT = rect.top + RangeT + 1,
                imgRangeTEnd = imgRangeT + imgGet.offsetHeight;
                if ((imgRangeT > RangeT && imgRangeT < RangeTEnd || imgRangeTEnd > RangeT && imgRangeTEnd < RangeTEnd) && 
				    (imgRangeL > RangeL && imgRangeL < RangeLEnd || imgRangeLEnd > RangeL && imgRangeLEnd < RangeLEnd)) {
                    return src;
                }
            } else return false;
        },
        Calculation: function(sL, sT, cw, ch) {
            var img = this.img,
            i = img.length - 1;
            if (i < 0) {
                this.arg.del && del.call(this.arg.container.nodeList, this.arg.event);
            } else {
                for (; i > -1; i--) {
                    this.setSrc(img, i, arguments);
                }
            }
        },
        run: function() {
            var elem = D(DOC);
            this.Calculation(elem.scrollLeft(), elem.scrollTop(), elem.clientWidth(), elem.clientHeight());
        }
    };
    D.fn.extend({
        delScrollLoad: function(event) {
            del.call(this.nodeList, event);
            return this;
        },
        bubblScrollLoad: function(eveName) {
            var elem, i = 0,
            MGSL, cache;
            eveName = isString(eveName) && trim(eveName) || scr;
            while (elem = this.nodeList[i++]) {
                cache = elem == window || eveName == scr && (elem == DOC || elem == DOC.body) ? D: elem;
                MGSL = cache[MG];
                if (isNumber(MGSL) && (cache = cacheData[MGSL]) && (cache = cacheData[MGSL][eveName])) {
                    cache.callback();
                }
            }
            return this;
        },
        scrollLoad: function(options, func) {
            new scrollLoad(this.nodeList.concat(), options, func);
            return this;
        }
    });
})(window);