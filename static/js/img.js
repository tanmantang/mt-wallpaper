var seting = {
	apiUrl: "https://api.tanmantang.com/api/bizhi",
	ratio: 0.618,
	types: '360new',
	downApi: 'https://image.baidu.com/search/down?tn=download&word=download&ie=utf8&fr=detail&url='
};
window.addEventListener('touchmove', function(){ passive: false })
var jigsaw = {
	count: 0,
	halfHtml: '',
	loadBig: false,
	ajaxing: false
};
window.onresize = function() {
	resizeHeight()
};
window.onload = function() {
	loadData(seting.types, true);
	resizeHeight()
};
$(function() {
	$(window).scroll(function() {
		if ($(this).scrollTop() + $(window).height() + 20 >= $(document).height() && $(this).scrollTop() > 20) {
			loadData(seting.types, false)
		}
		if(seting.types != 'bing' && seting.types != 'ciba'){
            if($(window).scrollTop() >= 300){ 
                $('#toolBall').fadeIn(1000); 
            }else{ 
                $('#toolBall').fadeOut(1000);
            } 
        }
	})
});

$("#toolBall").click(function(){
    if(seting.types == 'bing' || seting.types == 'ciba'){
        return true;
    }
    $('body,html').animate({scrollTop:0},1000);  
    return false;
});

console["log"](
	"%c \u57fa\u4e8e\u4e8c\u5f00\u7f8e\u5316\u7248\u4fee\u6539 @tanmantang.com qq\uff1a1059767677 %c",
	"color: #fadfa3; background: #030307; padding:5px", "background: #fadfa3; padding:5px");


// 加载壁纸容器中的壁纸
function loadData(types, newload) {
    console.log("types:"+types+",newload:"+newload);
	if (types != seting.types || newload === true) {
		seting.types = types;
		jigsaw = {
			count: 0,
			halfHtml: '',
			loadBig: false,
			ajaxing: false
		};
		$("#walBox").html('');
		$(".onepage-pagination").remove();
		$("body").removeClass();
		$(".jigsaw").removeAttr("style");
// 		$("#toolBall").attr('class','uptoTop');
//         $("#toolBall").attr('title','返回顶部');
//         $("#toolBall").hide();
	}
	
	switch (seting.types)
    {
        case 'bing':    //加载必应壁纸
            ajaxBingWal(-1, 8);
            ajaxBingWal(8, 8);
            $("#toolBall").show();
            $("#toolBall").attr('class','downBing');
            $("#toolBall").attr('download','下载图片');
            $("#toolBall").attr('title','下载这张图片');
        break;
        
        case 'ciba':    // 加载金山词霸每日一句壁纸
            if(newload === false) return;
            ajaxCiba(1);
            $("#toolBall").show();
            $("#toolBall").attr('class','downBing');
            $("#toolBall").attr('title','下载这张图片');
        break;
        
        default:    // 加载来自360的壁纸
            ajax360Wal(seting.types, jigsaw.count, 30);
    }
}
resizeHeight();

// 重新调整高度
function resizeHeight() {
	switch (seting.types) {
		default:
			var newHeight = $("#walBox").width() * (seting.ratio / 2);
			$(".jigsaw .item").css('height', newHeight);
			$(".jigsaw .Hhalf").css('height', newHeight / 2)
	}
	return true
}

// 显示一张拼图壁纸
function addJigsaw(img, alt) {
	var newHtml;
	var imgWidth, imgHeight;
	jigsaw.count++;
	if (jigsaw.halfHtml !== '') {
		imgWidth = parseInt(screen.width / 4);
		imgHeight = parseInt(imgWidth * seting.ratio);
		console.log("这是IMG_"+img);
		newHtml = '<div class="Hhalf oneImg"><a href="' + decode360Url(img, 0, 0, 100) +
			'" data-fancybox="images"><img  src="' + decode360Url(img, imgWidth, imgHeight, 0) + '" alt="' + alt +
			'"title="关键字：' + alt + '" class="pimg"></a>    </div></div>';
		contAdd(jigsaw.halfHtml + newHtml);
		jigsaw.halfHtml = '';
		return true
	}
	
	if (((jigsaw.count - 1) % 5) === 0) {
		jigsaw.loadBig = false
	}
	if ((jigsaw.loadBig === false) && ((Math.floor(Math.random() * 3) === 0) || ((jigsaw.count % 5) === 0))) {
		imgWidth = parseInt(screen.width / 2);
		imgHeight = parseInt(imgWidth * seting.ratio);
		newHtml = '<div class="item half oneImg"><a href="' + decode360Url(img, 0, 0, 100) +
			'" data-fancybox="images"><img src="' + decode360Url(img, imgWidth, imgHeight, 0) + '" alt="' + alt +
			'" title="关键字：' + alt + '" class="pimg"></a></div>';
		contAdd(newHtml);
		jigsaw.loadBig = true;
		return true
	}
	imgWidth = parseInt(screen.width / 4);
	imgHeight = parseInt(imgWidth * seting.ratio);
	jigsaw.halfHtml = '<div class="item quater">    <div class="Hhalf oneImg"><a href="' + decode360Url(img, 0, 0, 100) +
		'" data-fancybox="images"><img src="' + decode360Url(img, imgWidth, imgHeight, 0) + '" alt="' + alt + '" title="关键字：' +
		alt + '" class="pimg"></a>    </div>';
	return true
}

// 往壁纸容器中加入内容
function contAdd(html) {
	var myBox = $("#walBox");
	var $newHtml = $(html);
	myBox.append($newHtml);
	$("img", $newHtml).lazyload({
		effect: 'fadeIn',
		threshold: 200
	})
}

// 判断是否为pc页面
function IsPC() {
  var userAgentInfo = navigator.userAgent;
  var Agents = ["Android", "iPhone","SymbianOS", "Windows Phone","iPad", "iPod"];
  var flag = true;
  for (var v = 0; v < Agents.length; v++) {
    if (userAgentInfo.indexOf(Agents[v]) > 0) {
      flag = false;
      break;
    }
  }
  return flag;
}

// ajax加载必应壁纸
function ajaxBingWal(start, count){
    $.ajax({
        type: "GET", 
        url: seting.apiUrl, 
        data: "cid=bing&start=" + start + "&count=" + count,
        dataType : "json",
        success: function(jsonData){
            console.log("这是jsonData_"+jsonData);
            var newHtml = '<link rel="stylesheet" href="../../static/css/onepage-scroll.css">',downUrl = '';
            $("#walBox").append(newHtml);   // 全屏滚动插件css
            if (IsPC()){
                $(".container-wallpaper").attr('style','height: 700px;padding: 0px');
            }else{
                $(".container-wallpaper").attr('style','height: 400px;padding: 0px');
                $("#toolBall").attr('style','right: auto;width: auto;bottom: 15%;');
                $(".note").attr('style','bottom: 16%;');
            }
            for (var i = 0; i < jsonData.images.length; i++){
                if(jsonData.images[i].wp === true){ // BING官方不让下载的图片处理
                    downUrl = 'https://cn.bing.com/hpwp/' + jsonData.images[i].hsh;
                }else{
                    downUrl = 'https://cn.bing.com' + jsonData.images[i].url;
                }
                newHtml += '<section data-url="' + downUrl + '" data-img="https://cn.bing.com' + jsonData.images[i].url + '"><p class="note">' + jsonData.images[i].copyright + '</p></section>';
            }
            $("#walBox").append(newHtml);
            
            $('#walBox').onepage_scroll({
                // sectionContainer: '#walBox',
                // direction: 'horizontal',  // 水平滚动
                pagination: true,  // 是否显示右侧圆点
                // easing: 'ease-in',
                loop: true,    // 循环滚动
                beforeMove: function(index){
                    $("#toolBall").attr('href', $(".section").eq(index-1).attr('data-url'));
                    $(".section").eq(index-1).attr('style','background: url('+ $(".section").eq(index-1).attr('data-img') +');background-size: 100% 100%;background-repeat: no-repeat;');
                },
                afterMove: function(index){
                    $(".section").eq(index).attr('style','background: url('+ $(".section").eq(index).attr('data-img') +');background-size: 100% 100%;background-repeat: no-repeat;');
                    $(".section").eq(index-2).attr('style','background: url('+ $(".section").eq(index-2).attr('data-img') +');background-size: 100% 100%;background-repeat: no-repeat;');
                    $(".section").eq(index-1).attr('style','background: url('+ $(".section").eq(index-1).attr('data-img') +');background-size: 100% 100%;background-repeat: no-repeat;');
                }
            });
            $("#toolBall").attr('href', $(".section").eq(0).attr('data-url'));
            $(".section").eq(0).attr('style','background: url('+ $(".section").eq(0).attr('data-img') +');background-size: 100% 100%;background-repeat: no-repeat;');
            
        }
    });
    return true;
}

// ajax加载金山词霸壁纸
function ajaxCiba(data){
    $.ajax({
        type: "GET", 
        // url: "http://open.iciba.com/dsapi/", 
        url: seting.apiUrl, 
        data: "cid=ciba",
        dataType : "json",
        success: function(jsonData){
            
            if (!IsPC()){
                $(".container-wallpaper").attr('style','padding: 0px');
                $("#toolBall").attr('style','right: auto;width: auto;bottom: 15%;');
                $("#walBox .note").attr('style','padding-bottom: 40px;');
                $("img").attr('style','padding-bottom: 10px;');
            }
            
            var newHtml = 
						'<link rel="stylesheet" href="../../static/css/onepage-scroll.css"><style>#walBox .note{position: absolute;color: #fff;line-height: normal;left: 30px;bottom: 10px;font-size: 14px}.ciba-eng {cursor: pointer;} .container-wallpaper{padding: 0px;}</style>' +
            '<p class="note" title="' + jsonData.translation + '"><span onclick="$(\'audio\')[0].play();" title="点击朗读" class="ciba-eng">' + jsonData.content + '</span><br>' + jsonData.note + //❤
            ' <span title="' + jsonData.love + '人喜欢" class="ciba-love" onclick="$(\'.love-count\').html(parseInt($(\'.love-count\').html()) + 1)"><span style="color: red;">❤</span>+<span class="love-count">' + jsonData.love + '</span></span></p>' + 
            '<audio src="' + jsonData.tts + '" hidden></audio>' + 
						'<img src="'+ jsonData.picture2 +'"alt="" width="100%" height="100%" />';
            
            $("#walBox").append(newHtml);
            $("#toolBall").attr('href', seting.downApi + jsonData.picture2);    // 下载链接
            
        }
    });
    return true;
}

// ajax加载来自360的壁纸
function ajax360Wal(cid, start, count) {
	if (jigsaw.ajaxing === true) return false;
	$("#loadmore").html('努力加载中……');
	$("#loadmore").show();
	jigsaw.ajaxing = true;
	$.ajax({
		type: "GET",
		url: seting.apiUrl,
		data: "cid=" + cid + "&start=" + start + "&count=" + count,
		dataType: "json",
		success: function(jsonData) {
		    console.log(jsonData.data.list.length);
			for (var i = 0; i < jsonData.data.list.length; i++) {
				// addJigsaw("https"+jsonData.data.list[i].url.slice(4), decode360Tag(jsonData.data.list[i].tag))
				addJigsaw("https"+jsonData.data.list[i].url.slice(4),jsonData.data.list[i].tag)
			}
			resizeHeight();
			jigsaw.ajaxing = false;
			if (jsonData.data.length === 0) {
				$("#loadmore").html('所有的壁纸都已经加载完啦！')
			} else {
				$("#loadmore").hide()
			}
		}
	});
	return true
}

// 解码360api获取的tag标签
function decode360Tag(oldTag) {
	return oldTag.match(/_category_[^_]+_/g).join(" ").replace(/_category_([^_]+)_/g, "$1")
}

// 解码360图片的链接，获得指定尺寸图片
function decode360Url(oldUrl, width, height, quality) {
	return oldUrl.replace("r\/__85", "m\/" + parseInt(width) + "_" + parseInt(height) + "_" + quality)
}

// 同步改变浏览器标题
function changeTitle(obj) {
	$('title').html($(obj).html() + ' - 电脑壁纸')
}
console.info(
	'Github源码：https://github.com/tanmantang/mt-wallpaper 点亮你的小♥(ˆ◡ˆԅ)哟\n\n作者：mengkun(http://mkblog.cn)\n壁纸来源于：360壁纸库、必应首页壁纸以及金山词霸开放平台 \n 美化版Github：https://github.com/uxiaohan/wallpaper \n 原版Github：https://github.com/mengkunsoft/wallpaper '
);

