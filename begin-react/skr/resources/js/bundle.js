(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var server = {
	/*
	 environment : [ 'test', 'reality' ]
	 */
	environment: "reality"
};
var gnb = require('./gnb.js');

function obj_height(object) {
	var window_height = $(window).height();
	$(object).css({height:window_height+"px"});
}

function tabDetector() {
	$("body").find(".tab-menu").each(function(){
		var targetLink = $(this).children("ul").hasClass("unlink");
		if(!targetLink) {
			var tabCurrent = $(this).children("ul").children(".selected").children("a").attr("href");
			$(tabCurrent).css({display:"block"});
		}
	});
};
function tabOpener(e) {
	var targetLink = $(this).parent("li").parent("ul").hasClass("unlink");
	if(!targetLink) {
		var a = $(this).parent();
		a.siblings().removeClass("selected");
		b = a.attr("class");
		a.addClass("selected");
		c = a.children("a").attr("href");
		a.parent("ul").parent(".tab-menu").siblings(".tab-content").css({display:"none"});
		$(c).css({display:"block"});
		e.preventDefault();
	}
	if(!$(this).parent("li").parent("ul").hasClass("tTab")){
		if (typeof tab_sub == 'function') tab_sub(a); //tab_sub 함수가 있으면 실행시킨다.
	}
};
function tabOpener2(e) {
	var targetLink = $(this).parent("li").parent("ul").hasClass("unlink");
	if(!targetLink) {
		var a = $(this).parent();
		a.siblings().removeClass("selected");
		b = a.attr("class");
		if(a.hasClass("selected")) {
			a.removeClass("selected");
			c = a.children("a").attr("href");
			a.parent("ul").parent(".tab-menu").siblings(".tab-content").css({display:"none"});
			$(c).css({display:"none"});
		} else {
			a.addClass("selected");
			c = a.children("a").attr("href");
			a.parent("ul").parent(".tab-menu").siblings(".tab-content").css({display:"none"});
			$(c).css({display:"block"});
		}
		e.preventDefault();
	}
};



/* function accordionOpener(e) {
	e.preventDefault();
	var chkSelected = $(this).parent(".subject").parent(".list").hasClass("selected");
	var clickedLi = $(this).parent(".subject").parent(".list");
	if(chkSelected) {
		clickedLi.removeClass("selected");
		clickedLi.children(".notice").slideUp("100");
	} else {
		clickedLi.addClass("selected");
		clickedLi.children(".notice").slideDown("100");
		clickedLi.siblings(".list").removeClass("selected");
		clickedLi.siblings(".list").children(".notice").slideUp("100");
	}
} */


function toggleLayer(e){
	e.preventDefault();
	var clickA = $(this).hasClass("is-open");
	if(clickA){
		$(this).removeClass("is-open");
		$(this).addClass("is-close");
		$(this).next("ul").hide();
	} else{
		$(this).removeClass("is-close");
		$(this).addClass("is-open");
		$(this).next("ul").show();
	}
}

function bottomfloat(object, num) {
	var bottom = $(document).height() - $(window).height() - $(document).scrollTop();

	if (bottom > num) {
		object.removeClass("off");
	} else if (bottom <= num) {
		object.addClass("off");
	} else {
		object.removeClass("off");
	}
}

function accordionOpener(e) {
	e.preventDefault();
	var chkSelected = $(this).parent(".list").hasClass("selected");
	var clickedSub = $(this);
	var clickedLi = $(this).parent(".list");
	if(chkSelected) {
		clickedLi.removeClass("selected");
		clickedLi.children(".notice").slideUp("100");
	} else {
		clickedLi.addClass("selected");
		clickedLi.children(".notice").slideDown("100");
		clickedLi.siblings(".list").removeClass("selected");
		clickedLi.siblings(".list").children(".notice").slideUp("100");
	}
}

function listOpener(e) {
	e.preventDefault();
	var targetElement =  $(this).parent(".estimate-list__action").parent(".estimate-list").parent(".form-group__header").parent(".form-group__list");
	var chkSelected = targetElement.hasClass("selected");
	if(chkSelected) {
		targetElement.removeClass("selected");
		targetElement.children(".form-group__body").slideUp("100");
	} else {
		targetElement.addClass("selected");
		targetElement.children(".form-group__body").slideDown("100");
		targetElement.siblings(".form-group__list").removeClass("selected");
		targetElement.siblings(".form-group__list").children(".form-group__body").slideUp("100");
	}
}

function gnbPosition() {
	if($('body').is('#start') || $('body').is('#main')) {
		var _$gnb = $('.gnb'),
				_$header = $('header'),
				_$documentPromotionIs = $('.wrapper').is('.has-promotion'),
				_$promotionHeight = $('.promotion-slider').height(),
				_$spotHeight = $('.spot').height(),
				//_$spotOffsetTop = $('.spot').offset().top,
				_scrollTop = $(document).scrollTop();
		if(_$documentPromotionIs === true) {
			if(_scrollTop >= _$promotionHeight) {
				_$header.addClass('is-fixed');
			} else {
				_$header.removeClass('is-fixed');
			}
		}
		if(_$header.css('position') == 'fixed' && _scrollTop > 0) {
			_$header.removeClass('is-opacity');
		} else {
			_$header.addClass('is-opacity');
		}
	}
}


$slick = null;
$slickArrow = null;
$slickV2 = null;
$slickThree = null;
function slickSetting() {

	//slick
	if($slick == null) {
	} else {
		$slick.slick('unslick');
		$slick = null;
	}
	$slick = $(".slider-article .slider").slick({
		autoplay: true,
		autoplaySpeed: 4000,
		dots: true,
		arrows: true
		//pauseOnDotsHover: true,
	});

	//slick arrow
	if($slickArrow == null) {
	} else {
		$slickArrow.slick('unslick');
		$slickArrow = null;
	}
	$slickArrow = $(".slider-arrow-article .slider").slick({
		autoplay: true,
		autoplaySpeed: 4000,
		dots: true,
		arrows: true
		//pauseOnDotsHover: true,
	});

	//slick arrow
	if($slickV2 == null) {
	} else {
		$slickV2.slick('unslick');
		$slickV2 = null;
	}
	$slickV2 = $(".slider-article-v2 .slider").slick({
		infinite: false,
		autoplay: true,
		autoplaySpeed: 4000,
		dots: true,
		arrows: true
		//pauseOnDotsHover: true,
	});

	//slick three
	if($slickThree == null) {
	} else {
		$slickThree.slick('unslick');
		$slickThree = null;
	}
	$slickAdMainEventPromotion = $(".ad-main-event-promotion .slider").slick({
		slidesToShow: 3,
		slidesToScroll: 3,
		infinite: true,
		autoplay: true,
		autoplaySpeed: 4000,
		dots: true,
		appendDots: $('.ad-main-event-promotion .dots'),
		arrows: true,
		appendArrows: $('.ad-main-event-promotion .arrows')
		//pauseOnDotsHover: true,
	});

	var $slider = $(".slider-article"),
			$sliderArrow = $(".slider-arrow-article"),
			$sliderAdMainEventPromotion = $('.ad-main-event-promotion');
	var $sliderBtn= $("<li><div class='pause slider-btn on'>일시정지</div><div class='play slider-btn'>재생</div></li>");
	$slider.find(".slick-dots").append($sliderBtn);
	$sliderArrow.find(".slick-dots").append($sliderBtn);
	$sliderAdMainEventPromotion.find('.slick-dots').append($sliderBtn);

	$('.slider-article .pause, .slider-arrow-article .pause').on('click', function() {
		$(this).closest('.slider')
				.slick('slickPause')
				.slick('slickSetOption', 'pauseOnDotsHover', false);
		$(this).removeClass("on")
				.siblings(".play").addClass("on");
	});

	$('.slider-article .play, .slider-arrow-article .play').on('click', function() {
		$(this).closest('.slider')
				.slick('slickPlay')
				.slick('slickSetOption', 'pauseOnDotsHover', true);
		$(this).removeClass("on")
				.siblings(".pause").addClass("on");
	});

	$('.ad-main-event-promotion .pause').on('click', function() {
		$('.ad-main-event-promotion .slider')
				.slick('slickPause')
				.slick('slickSetOption', 'pauseOnDotsHover', false);
		$(this).removeClass("on")
				.siblings(".play").addClass("on");
	});

	$('.ad-main-event-promotion .play').on('click', function() {
		$('.ad-main-event-promotion .slider')
				.slick('slickPlay')
				.slick('slickSetOption', 'pauseOnDotsHover', true);
		$(this).removeClass("on")
				.siblings(".pause").addClass("on");
	});

	$('.ad-main-event-promotion .helper').on('mouseenter', function() {
		var $this = $(this);
		$this.closest('.ad-main-event-promotion').find('.arrows').addClass('is-show');
	}).on('mouseleave', function() {
		var $this = $(this);
		$this.closest('.ad-main-event-promotion').find('.arrows').removeClass('is-show');
	});

}

$(document).ready(function() {
	var font = new FontFaceObserver('NanumBarunGothic', {});
	font.load().then(function() {
		document.documentElement.className += " fonts_loaded";
		//$("#loading").remove();

	}, function() {

	});

	var resizeElement = [ 'content-default', 'content-short', 'content-long'];

	var $main_height = $(".content-default"),
			$tickerinfo = $(".ticker-info"),
			$quickmenu = $(".quick-menu"),
			$quicktop = $(".quick-top"),
			$fixMenu = $(".float-menu"),
			$bodyId = $("body").attr("id");


	tabDetector();
	$(".tab-menu ul li a").bind("click", tabOpener);
	$(".tab-menu.js-tab-opener2 ul li a").unbind("click", tabOpener).bind("click", tabOpener2);
	$(".accordion-type .list .subject a").bind("click", accordionOpener);
	$(".estimate-list .estimate-list__action .btn").bind("click", listOpener);

	//window scroll
	bottomfloat($tickerinfo, 271);
	bottomfloat($quickmenu, 217);
	bottomfloat($quicktop, 217);
	//menufloat($fixMenu);
	$(window).scroll(function(){
		bottomfloat($tickerinfo, 271);
		bottomfloat($quickmenu, 217);
		bottomfloat($quicktop, 217);
		//menufloat($fixMenu);
		gnbPosition();
	});

	//modal)
	$(document).on('click', '.btn-modal', function(e) {		
        var modal_name = $(this).attr("href");        
        if (modal_name.indexOf("modal") > 0) // href에 'modal'이 없으면 해당소스에 구현된 이벤트핸들러를 사용
        {
    		e.preventDefault();   		
    		$($(this).attr("href")).css({display:"block"});
            $("html").addClass("no-scroll");
            $(".dimd").css({display:"block"});
        }
       
        return false;		
	});
	$(document).on('click', '.modal-pop .modal-close, .modal-pop .btn-close, .modal-pop .btn-modal-confirm', function(e) {
		// $(".modal-pop .modal-close, .dimd").click(function(e){
		e.preventDefault();
		//$(".modal-pop").css({display:"none"});
		//$("html").removeClass("no-scroll");
		//$(".dimd").css({display:"none"});
		
		var popupId = $(this).parent().parent().parent().attr("id");
		var popupCloseId = $(this).parent().parent().parent().parent().attr("id");
		$("#"+popupId).css({display:"none"});
		$("#"+popupCloseId).css({display:"none"});
		$(".wrapper").css({display:"block"});
		
		var popupCount = 0;
		$(".modal-pop").each(function(index){
			if($(this).css("display") == "block"){
				popupCount++;
			}
		});
		if(popupCount == 0){
			$("html").removeClass("no-scroll");
			$(".dimd").css({display:"none"});
		}
	});

	//quick-top
	$(".quick-top .btn-top").click(function(e){
		e.preventDefault();
		$("html,body").animate({scrollTop:0},500);
	})

	//quick-chat
	$(".quick-chat .quick-close").click(function(e){
		e.preventDefault();
		$(".quick-chat").remove();
	})

	// multiple-select-box
	$(document).on('click', '.multiple-select-box', function(e) {
		e.preventDefault();
		e.stopPropagation();
		var $this = $(this);
		if($this.hasClass('is-disabled')) return;
		
		if ($('.layer-multiple-select-box.is-expanded').length > 0) //이미 열려있는 멀티셀렉트 박스가 있으면 닫아준다
		{
			if (typeof restore_multibox == 'function') restore_multibox($this); //restore_multibox 함수가 있으면 실행시킨다.
			$('.layer-multiple-select-box.is-expanded,.multiple-select-box.is-expanded').removeClass('is-expanded');
			return;
		}
		
		if(!$this.hasClass('is-expanded')) {
			$this.addClass('is-expanded').next('.layer-multiple-select-box').addClass('is-expanded');
			$(document).off('click.multiple-select-box');
			$(document).on('click.multiple-select-box', function() {
				
				if (typeof restore_multibox == 'function') restore_multibox($this); //restore_multibox 함수가 있으면 실행시킨다.
				
				$this.removeClass('is-expanded').next('.layer-multiple-select-box').removeClass('is-expanded');
			});
		} else {
			$this.removeClass('is-expanded').next('.layer-multiple-select-box').removeClass('is-expanded');
			$(document).off('click.multiple-select-box');
		}
	});
	$(document).on('click', '.layer-multiple-select-box a', function(e) {
		e.preventDefault();
		e.stopPropagation();
		
		if($(this).hasClass('cl-thin is-disabled') == true){
			return false;
		}
		
		var $this = $(this),
				$item = $this.closest('dd'),
				$layer = $this.closest('.layer-multiple-select-box');
		$this.addClass('is-selected');
		$item.siblings().find('a').removeClass('is-selected');
		if($this.closest('.store').length) {
			var content = $layer.find('.location').find('a').filter('.is-selected').text() + '/' + $layer.find('.store').find('a').filter('.is-selected').text();
			$layer.removeClass('is-expanded').prev('.multiple-select-box').removeClass('is-expanded').find('.js-multiple-select-text').text(content);
			$(document).off('click.multiple-select-box');
			
			if (typeof select_branch == 'function') select_branch($this, content); //select_branch 함수가 있으면 실행시킨다.
		}
	});

	//drop-content
	$(".drop-content .drop-btn").click(function (e) {
		e.preventDefault();
		$(this).parent().toggleClass("selected", 500);
		var targetClass = $(this).parent().hasClass("selected");
		if(targetClass) {
			$(this).children("span").text("더보기");
		} else {
			$(this).children("span").text("접기");
		}
	});

	//ticker-info
	$(".ticker-info .ticker-btn").click(function (e) {
		e.preventDefault();
		$(".ticker-info").toggleClass( "selected", 500);
		
		if( $(".ticker-info").hasClass("selected") ){
			setTimeout(function(){
				$(".ticker-btn span").html("더보기");
			},500);
		}else{
			setTimeout(function(){
				$(".ticker-btn span").html("닫기");
			},500);
		}
	});
	//link-content
	$(".link-content .link-offeset").click(function(e){
		e.preventDefault();
		var targetOff = $(this).attr("href");
		var targetSrc = $(targetOff).offset().top;
		$("body, html").animate({scrollTop:targetSrc-110}, '500');
	});

	$(document).on('click', '#main .car-search .option-radio label', function(e) {
		e.stopPropagation();
		var index = $(this).closest('.item').index();
		$('#main .car-search .panel').removeClass('is-selected').eq(index).addClass('is-selected');
	});

	slickSetting();

	//사고정보 사진 보기
	var sliderFor = $('#modal-photo-list .slider-thumbnail .slider-for').slick({
		slidesToShow: 1,
		slidesToScroll: 1,
		arrows: false,
		draggable: false,
		asNavFor: '.slider-nav',
		vertical: true
	});
	var sliderNav = $('#modal-photo-list .slider-thumbnail .slider-nav').slick({
		slidesToShow: 4,
		slidesToScroll: 1,
		asNavFor: '.slider-for',
		dots: false,
		arrows: true,
		focusOnSelect: true,
		vertical: true
	});

	$('.btn-photo.btn-modal').on("click", function() {
		$('#modal-photo-list').css('display', 'block');
		$('#modal-photo-list .slider-thumbnail .slider-for').get(0).slick.setPosition();
		$('#modal-photo-list .slider-thumbnail .slider-nav').get(0).slick.setPosition();
	});

	//accordion
	$(".accordion-type .list .subject").bind("click", accordionOpener);
	$(".terms-list.v3 .subject").bind("click", accordionOpener);
	$(".terms-list.v3 .subject .checkbox").bind("click", function(e) { e.stopPropagation(); });

	//input file custom - 증빙서류파일첨부
	// Browser supports HTML5 multiple file?
	var multipleSupport = typeof $('<input/>')[0].multiple !== 'undefined',
			isIE = /msie/i.test( navigator.userAgent );
	$.fn.customFile = function() {
		return this.each(function() {
			var $file = $(this).addClass('custom-file-upload-hidden'), // the original file input
					$wrap = $('<div class="file-upload-wrapper">'),
					$input = $('<input type="text" class="file-upload-input" placeholder="첨부하실 파일을 선택해주세요." disabled="disabled" />'),
					// Button that will be used in non-IE browsers
					$button = $('<button type="button" class="file-upload-button btn btn-line1 btn-fix1">파일찾기</button>'),
					// Hack for IE
					$label = $('<label class="file-upload-button" for="'+ $file[0].id +'">파일찾기</label>');

			// Hide by shifting to the left so we
			// can still trigger events
			$file.css({
				position: 'absolute',
				left: '-9999px'
			});

			$wrap.insertAfter( $file )
					.append( $file, $input, ( isIE ? $label : $button ) );

			// Prevent focus
			$file.attr('tabIndex', -1);
			$button.attr('tabIndex', -1);
			$button.click(function () {
				$file.focus().click(); // Open dialog
			});

			$file.change(function() {
				var files = [], fileArr, filename;
				// If multiple is supported then extract
				// all filenames from the file array
				if ( multipleSupport ) {
					fileArr = $file[0].files;
					for ( var i = 0, len = fileArr.length; i < len; i++ ) {
						files.push( fileArr[i].name );
					}
					filename = files.join(', ');

					// If not supported then just take the value
					// and remove the path to just show the filename
				} else {
					filename = $file.val().split('\\').pop();
				}

				$input.val( filename ) // Set the value
						.attr('title', filename) // Show filename in title tootlip
						.focus(); // Regain focus
			});

			$input.on({
				blur: function() { $file.trigger('blur'); },
				keydown: function( e ) {
					if ( e.which === 13 ) { // Enter
						if ( !isIE ) { $file.trigger('click'); }
					} else if ( e.which === 8 || e.which === 46 ) { // Backspace & Del
						// On some browsers the value is read-only
						// with this trick we remove the old input and add
						// a clean clone with all the original events attached
						$file.replaceWith( $file = $file.clone( true ) );
						$file.trigger('change');
						$input.val('');
					} else if ( e.which === 9 ){ // TAB
						return;
					} else { // All other keys
						return false;
					}
				}
			});

		});

	};
	// Old browser fallback
	if ( !multipleSupport ) {
		$( document ).on('change', 'input.customfile', function() {

			var $this = $(this),
					// Create a unique ID so we
					// can attach the label to the input
					uniqId = 'customfile_'+ (new Date()).getTime(),
					$wrap = $this.parent(),

					// Filter empty input
					$inputs = $wrap.siblings().find('.file-upload-input')
							.filter(function(){ return !this.value }),

					$file = $('<input type="file" id="'+ uniqId +'" name="'+ $this.attr('name') +'"/>');

			// 1ms timeout so it runs after all other events
			// that modify the value have triggered
			setTimeout(function() {
				// Add a new input
				if ( $this.val() ) {
					// Check for empty fields to prevent
					// creating new inputs when changing files
					if ( !$inputs.length ) {
						$wrap.after( $file );
						$file.customFile();
					}
					// Remove and reorganize inputs
				} else {
					$inputs.parent().remove();
					// Move the input so it's always last on the list
					$wrap.appendTo( $wrap.parent() );
					$wrap.find('input').focus();
				}
			}, 1);
		});
	}
	$('input[type=file]').customFile();

	// input file Script
	$('.fileWrap').each(function(){
		var $fileWrap = $(this),
				$iptFileText = $fileWrap.find('.iptFileText'),
				$btnFile = $fileWrap.find('.btn.file');

		$btnFile.on({
			click : function(e){
				e.preventDefault();
				$(this).closest($fileWrap).find('.iptFile').trigger('click');
			}
		});

		$iptFileText.on({
			focus : function(e){
				e.preventDefault();
				$(this).closest($fileWrap).find('.iptFile').trigger('click');
			},
			change : function(e){
				e.preventDefault();
				var pathHeader = $(this).val().lastIndexOf('\\'),
						pathMiddle = $(this).val().lastIndexOf('.'),
						pathEnd = $(this).val().length,
						fileName = $(this).val().substring(pathHeader+1, pathMiddle),
						extName = $(this).val().substring(pathMiddle+1, pathEnd),
						allFileName = fileName+"."+extName;

				$(this).closest($fileWrap).find('.iptFileText').val(allFileName);
			}
		});
	});
	//input file photo upload
	function fileUpload() {
		var wrapper = $('<div/>').css({height:0,width:0,'overflow':'hidden'});
		var fileInput = $(this).children('input:file').wrap(wrapper);
		fileInput.change(function(){
			$this = $(this);
			$('.upload .fileName .file').text($this.val());
		})
		$(this).children('.fileInfo').click(function(){
			fileInput.click();
		}).show();
	}
	$(".photo-input .upload").each(fileUpload);

	//video
	var video = $('.video-box video'),
			videoBtn = $('.player-controls .btn-player');
	var videoStarted = false;
	function pauseVideo() {
		video[0].pause();
	}
	function playVideo() {
		video[0].play();
	}
	videoBtn.on('click', function(e){
		e.preventDefault();
		videoStarted = true;
		$(this).removeClass("active");
		playVideo();
	});
	video.on('ended', function(e) {
		$('.player-controls .play').addClass('active');
		videoStarted = false;
	});
	video.on('click', function(e){
		if (this.paused) {
			this.play();
			$(".player-controls .pause").removeClass("active");
		} else {
			this.pause();
			$(".player-controls .pause").addClass("active");
		}
	});


	/* Cookie */
	function setCookie(name, value, expiredays) {
		var _date = new Date();
		_date.setDate( _date.getDate() + expiredays );
		document.cookie = name + "=" + escape( value ) + "; path=/; expires=" + _date.toGMTString() + ";"
	}

	function getCookie(name) {
		var _cookie = document.cookie;
		if(_cookie.indexOf(name+'=true') < 0) {
			return false;
		} else {
			return true;
		}
	}

	// main
	if($bodyId == "start" || $bodyId == "main") {

		/* 변수 */
		var url = document.URL,
				urlHash = url.lastIndexOf('#') != -1 ? url.substring(url.lastIndexOf('#') + 1, url.length) : undefined,
				fileName = url.substring(url.lastIndexOf('/') + 1, url.length);

		var $body = $('body'),
				$header = $('header'),
				$contentWrap = $('#content'),
				$content = $('.content'),
				$gate = null,
				$short = null,
				$long = null,
				$footer = $('footer');

		var content = {
					gate: null,
					short: {
						header: null,
						content: null,
						footer: null
					},
					long:  {
						header: null,
						content: null,
						footer: null
					}
				},
				contentType = $content.data('type'),
				contentHeaderEffect = {
					short: null,
					long: null
				},
				contentRollring = false;

		/* 페이지 새로고침 시 해시에 맞는 파일로 이동 */
		if(typeof urlHash == 'string') {
			$body.css({'display':'none'});
			/* GNB 위치 변경 관련 변경*/
			if($body.hasClass('type-reverse')) {
				/* GNB 위치 변경 시 경로 */
				switch(urlHash) {
					case 'short' :
						if(server.environment == 'reality') {
							location.href = '/rent/rentcar/main.do';
						} else {
							location.href = 'main-short-reverse.html';
						}
						break;
					case 'long' :
						if(server.environment == 'reality') {
							location.href = '/rent/long/main.do';
						} else {
							location.href = 'main-long-reverse.html';
						}
						break;
					default :
						if(server.environment == 'reality') {
							location.href = '/rent/index.do';
						} else {
							location.href = 'gate-reverse.html';
						}
						break;
				}
			} else {
				switch(urlHash) {
					case 'short' :
						if(server.environment == 'reality') {
							location.href = '/rent/rentcar/main.do';
						} else {
							location.href = 'main-short.html';
						}
						break;
					case 'long' :
						if(server.environment == 'reality') {
							location.href = '/rent/long/main.do';
						} else {
							location.href = 'main-long.html';
						}
						break;
					default :
						if(server.environment == 'reality') {
							location.href = '/rent/index.do';
						} else {
							location.href = 'gate.html';
						}
						break;
				}
			}
		}

		/* 현재 레이아웃 정보 */
		if(contentType == 'gate') {
			console.log('Hello Gate !!!');
			var contentHeight = $(window).height();
			$contentWrap.css({ height: contentHeight});
		} else {
			console.log('Hello '+contentType+' !!!');
			var contentHeight = $content.prop('scrollHeight');
			$gate = null;
			$body.css({overflowY: 'scroll'});
			$header.addClass('is-opacity');
			$contentWrap.css({ height: contentHeight});
			console.log(contentHeight);
			content[contentType]['header'] = $header.clone();
			content[contentType]['content'] = $content.clone();
			content[contentType]['footer'] = $footer.clone();
			contentHeaderEffect[contentType] = new TimelineLite();
			contentHeaderEffect[contentType].stop();
			// contentHeaderEffect[contentType].to($header, .2, { top: -$header.height(), delay: -.4 });
			// contentHeaderEffect[contentType].to($header, .2, { top: 0, delay: .3, onStart: function() {
			contentHeaderEffect[contentType].to($header, .1, { autoAlpha: 0 });
			contentHeaderEffect[contentType].to($header, .2, { autoAlpha: 1, delay: .6, onStart: function() {
				$header.html(content[contentType]['header'].html());
				$footer.html(content[contentType]['footer'].html());
			} });
		}
		/*
		var eachIndex = 0;
		$.each(content, function(key) {
			eachIndex++;
			if($.inArray(key, [contentType, 'gate']) > -1) return true;
			var _url;
			if(server.environment == 'reality') {
				//GNB 위치 변경 관련 변경
				if($body.hasClass('type-reverse')) {
					//GNB 위치 변경 시 경로
					if(key == 'short') {
						_url = '/rent/rentcar/main.do';
					} else {
						_url = '/rent/long/main.do';
					}
				} else {
					if(key == 'short') {
						_url = '/rent/rentcar/main.do';
					} else {
						_url = '/rent/long/main.do';
					}
				}
			} else {
				//GNB 위치 변경 관련 변경
				if($body.hasClass('type-reverse')) {
					_url = './main-'+key+'-reverse.html';
				} else {
					_url = './main-'+key+'.html';
				}
				console.log(key);
			}
			$.ajax({
				url: _url,
				dataType: 'html',
				success: function(data) {
					var _data = $(data).filter('.wrapper').get(0),
							_$data = $(_data);
					content[key]['header'] = _$data.find('header');
					content[key]['content'] = _$data.find('.content').removeClass('content-original is-expanded').css({'display': 'none'});
					content[key]['footer'] = _$data.find('footer');
					contentHeaderEffect[key] = new TimelineLite();
					contentHeaderEffect[key].stop();
					// contentHeaderEffect[key].to($header, .2, { top: -$header.height(), delay: -.4 });
					// contentHeaderEffect[key].to($header, .2, { top: 0, delay: .3, onStart: function() {
					contentHeaderEffect[key].to($header, .1, { autoAlpha: 0 });
					contentHeaderEffect[key].to($header, .2, { autoAlpha: 1, delay: .6, onStart: function() {
						$header.html(content[key]['header'].html());
						$footer.html(content[key]['footer'].html());
						gnb.setting();
					} });
					$content.after(content[key]['content']);
					if(eachIndex == Object.keys(content).length) {
						var _$content = $('.content');
						if(contentType == 'gate') $gate = _$content.filter('[data-type=gate]');
						$short = _$content.filter('[data-type=short]');
						$long = _$content.filter('[data-type=long]');
						$(window).resize();
					}
				},
				complete: function() {
					console.log('ajax complete !!!')
				}
			});
		});
		*/
		/*$(document).on('click', '.btn-content-move', function(e) {
			if(contentRollring === true) return false;
			contentRollring = true;
			var _$this = $(this),
					_display = _$this.data('type-move') == 'short' ? 'short' : 'long',
					_hidden = _display == 'short' ? 'long' : 'short',
					_operator = _display == 'short' ? '' : '-',
					_direction = _display == 'short' ? 'right' : 'left',
					_isGate = false,
					_isReverse = $body.hasClass('type-reverse');  GNB 위치 변경 관련 변경 

			 //GNB 위치 변경 관련 변경 
			if(_isReverse) {
				_operator = _display != 'short' ? '' : '-';
				_direction = _display != 'short' ? 'right' : 'left';
			}

			if($gate != null) {
				_isGate = true;
				TweenLite.to($gate, .6, {
					left: _operator + '100%', onComplete: function () {
						$gate.remove();
						$gate = null;
						$body.attr('id', 'main');
					}
				});
				$('.quick-top').removeClass('off');
			}

			$body.scrollTop(0);
			$header.addClass('is-opacity');

			//GNB 위치 변경 관련 변경
			if(!_isReverse) {
				TweenLite.to($('.quick-move').filter('.short'), .5, {'left': '-70'});
				TweenLite.to($('.quick-move').filter('.long'), .5,  {'right': '-70'});
			} else {
				TweenLite.to($('.quick-move').filter('.short'), .5, {'right': '-70'});
				TweenLite.to($('.quick-move').filter('.long'), .5,  {'left': '-70'});
			}

			if(_hidden == 'short') {
				$('body').addClass('longterm-section');
				//GNB 위치 변경 관련 변경 
				if(!_isReverse) {
					TweenLite.to($('.quick-move').filter('.short'), .5, {'left': '0', delay: .8});
				} else {
					TweenLite.to($('.quick-move').filter('.short'), .5, {'right': '0', delay: .8});
				}
			} else {
				$('body').removeClass('longterm-section');
				//GNB 위치 변경 관련 변경 
				if(!_isReverse) {
					TweenLite.to($('.quick-move').filter('.long'), .5, {'right': '0', delay: .8});
				} else {
					TweenLite.to($('.quick-move').filter('.long'), .5, {'left': '0', delay: .8});
				}
			}

			eval('TweenLite.to($'+_hidden+', .6, { left: \''+_operator+'100%\', onComplete: function() { '
					+ '$'+_hidden+'.removeClass(\'is-expanded\').css({\'display\': \'none\'})'
					+ ' }});');
			eval('$'+_display+'.css({\'display\': \'block\'})');
			$body.css({overflowY: 'scroll' });
			eval('TweenLite.to($'+_display+', .6, { left: \'0\', onComplete: function() {'
					+ ' $'+_display+'.addClass(\'is-expanded\');'
					+ ' contentRollring = false;'
					+ ' }});');
			if(_isGate === true) {
				contentHeaderEffect[_hidden].stop();
				contentHeaderEffect[_display].restart();
			} else {
				gnb.setting();
			}
			slickSetting();
			basicSetting();
			if(eval('$'+_display).find('.promotion-slider').is('.is-expanded') === true) {
				$('.wrapper').removeClass('has-promotion').addClass('has-promotion');
			} else {
				$('.wrapper').removeClass('has-promotion');
			}
			$contentWrap.css({ height: $('.content-'+_display).prop('scrollHeight') });
		});*/

		$(document).on('click', '#main .gnb-anchor', function(e) {
			e.preventDefault();
			location.href = this.href;			
			return;
			// 아랫부분 버그때문에 단기메인화면에서 장기메인으로 이동이 안됬음!!!!
			
			if(contentRollring === true) return false;
			var _$this = $(this),
					_anchorType = _$this.closest('[class^=gnb-listitem gnb-listitem-]').attr('class').indexOf('short') > -1 ? 'short' : 'long',
					_$quickMove = $('.quick-move').filter('.'+_anchorType);
					
			
			if(_$quickMove.length > 0) _$quickMove.find('.btn-content-move').click();
		});

		$(window).on('load resize', function() {
			$.each(resizeElement, function(i, v) {
				obj_height($('.'+v));
			});
		});

	}

	//footer family site
	$(document).on('click', '.family-site > a', toggleLayer);

	// placeholder
	var input = document.createElement("input");
	if(('placeholder' in input)==false) {
		$('[placeholder]').focus(function() {
			var i = $(this);
			if(i.val() == i.attr('placeholder')) {
				i.val('').removeClass('placeholder');
				if(i.hasClass('password')) {
					i.removeClass('password');
					this.type='password';
				}
			}
		}).blur(function() {
			var i = $(this);
			if(i.val() == '' || i.val() == i.attr('placeholder')) {
				if(this.type=='password') {
					i.addClass('password');
					this.type='text';
				}
				i.addClass('placeholder').val(i.attr('placeholder'));
			}
		}).blur().parents('form').submit(function() {
			$(this).find('[placeholder]').each(function() {
				var i = $(this);
				if(i.val() == i.attr('placeholder'))
					i.val('');
			})
		});
	}
	$(document).on('focus', '.js-input-placeholder', function() {
		var $this = $(this);
		$this.data('placeholder', $this.attr('placeholder'));
		$this.attr('placeholder', '');
	}).on('focusout', '.js-input-placeholder', function() {
		var $this = $(this);
		$this.attr('placeholder', $this.data('placeholder'));
	});

	function basicSetting() {

		// select
		$.each($('select.option01'), function() {
			var _$this = $(this);
			_$this.removeClass('select2-hidden-accessible');
			_$this.select2({
				minimumResultsForSearch: Infinity,
				containerCssClass: _$this.attr('class'),
				dropdownCssClass: _$this.attr('class')
			});
			/* 단기 메인 셀릭트 */
			if(_$this.hasClass('st03') === true || _$this.hasClass('st02') === true) {
				_$this.on('select2:open', function(e) {
					console.log($('.select2-container').not('.select2').length);
					$('.select2-container').not('.select2').addClass('is-fixed-bottom');
				});
			}
		});

		if($('body').is('#start') || $('body').is('#main')) {

			// promotion slider
			$('.promotion-slider').find('.btn-close').on('click', function(e) {
				e.preventDefault();
				var _$this = $(this),
						_$promotionSlider = _$this.closest('.promotion-slider');
				_$promotionSlider.removeClass('is-expanded');
				$('.wrapper').removeClass('has-promotion');
				var contentHeight = $('.content.is-expanded').prop('scrollHeight');
				$contentWrap.css({ height: contentHeight});
			});


			/* Notice Layer */
			if(getCookie('main-notice-short') === false) {
				if($('#main-notice-short').length > 0) $('#main-notice-short, .dimd').css({'display': 'block'});
				$('#main-notice-short .modal-close, #main-notice-short .btn-close').on('click', function(e) {
					$('#main-notice-short').remove();
				});
			}
			if(getCookie('main-notice-long') === false) {
				if($('#main-notice-long').length > 0) $('#main-notice-long, .dimd').css({'display': 'block'});
				$('#main-notice-long .modal-close, #main-notice-long .btn-close').on('click', function(e) {
					$('#main-notice-long').remove();
				});
			}

			/* Promotion Layer */
			if($('#promotion-slider-short').length > 0) {
				if(getCookie('promotion-slider-short') === false && $('#promotion-slider-short').hasClass('is-expanded')) {
					$('.wrapper').addClass('has-promotion');
				} else {
					$('#promotion-slider-short').removeClass('is-expanded');
					$('.wrapper').removeClass('has-promotion');
					var contentHeight = $('.content.is-expanded').prop('scrollHeight');
					$contentWrap.css({ height: contentHeight});
				}
			}
			if($('#promotion-slider-long').length > 0) {
				if (getCookie('promotion-slider-long') === false && $('#promotion-slider-long').hasClass('is-expanded')) {
					$('.wrapper').addClass('has-promotion');
				} else {
					$('#promotion-slider-long').removeClass('is-expanded');
					$('.wrapper').removeClass('has-promotion');
					var contentHeight = $('.content.is-expanded').prop('scrollHeight');
					$contentWrap.css({height: contentHeight});
				}
			}

		}

		$('.promotion-slider .btn-close').on('click', function(e) {
			var _$this = $(this),
					_$popupName = _$this.closest('.promotion-slider').attr('id');
			var _timeClose = _$this.prev('.checkbox').find('input').prop('checked');
			if(_timeClose === true) setCookie(_$popupName, true, 1);
		});

		$('.modal-pop .btn-close').on('click', function(e) {
			var _$this = $(this),
					_$popupName = _$this.closest('.modal-pop').attr('id');
			var _timeClose = _$this.prev('.checkbox').find('input').prop('checked');
			if(_timeClose === true) setCookie(_$popupName, true, 1);
		});

	}

	//제휴사 top 버튼 숨기기
	var $bodyClass = $("body").hasClass("type-partnership");
	if($bodyClass) {
		var $bodyHeight = $("body").height(),
			 $bodyHeightNum = 1080;
		if($bodyHeight < $bodyHeightNum) {
			$(".quick-top").css({display:"none"});
		}
	}

	$(document).on('mouseup', function(e) {
		var $list = $(".ticker-info");
		var $listBtn = $(".ticker-btn");
		
		if ($list.has(e.target).length === 0 ) {
			$(".ticker-info").removeClass("selected", 500);
			setTimeout(function(){
				$(".ticker-btn span").html("더보기");
			},500);
		}
	});


	basicSetting();
	gnb.setting();



});
},{"./gnb.js":2}],2:[function(require,module,exports){
var setting = function() {
	var $header = $('header'),
		$gnb = $('.gnb'),
		$gnbExtend = $gnb.find('.gnb-wrapper'),
		$gnbLocal = $gnb.find('.gnb-localnav .gnb-wrapper'),
		$gnbItem = $gnb.find('.gnb-listitem'),
		$gnbBtn = $gnbItem.find('.gnb-anchor'),
		$gnbIco = $gnbItem.find('.gnb-depth-anchor-arrow'),
		$gnbExpand = $gnbItem.find('.gnb-depth-listbox-wrapper');

	function gnbIcoAnimation(offsetX, cb) {
		var _$this = $(this);
		_$this.stop().animate({'left': offsetX}, {
			queue: false,
			duration: 300,
			easing: 'easeInOutCubic',
			start: cb
		});
	}

	function gnbSelectEffect() {
		var _$this = $(this);
		if (_$this.is('header')) {
			$gnbItem.removeClass('is-selected');
			gnbIcoAnimation.call($gnbIco, 30);
			/* $gnbLocal.removeClass("off"); */
			var hasClassHeader = $("header.extend").hasClass("fixed");
			if(!hasClassHeader) {
				$gnbLocal.fadeIn(300);
			}

			return false;
		}
		$gnbItem.removeClass('is-selected').eq(_$this.closest('.gnb-listitem').index()).addClass('is-selected');
		gnbIcoAnimation.call(_$this.closest('.gnb-listitem').find('.gnb-depth-anchor-arrow'), 40, function () {
			gnbIcoAnimation.call($gnbIco, 30)
		});
	}

	function gnbDrawerView(display, cb) {
		if ($gnbItem.filter('.is-selected').length > 0) {
			var _$this = $(this),
				_offsetY = display === true ? parseInt($gnbExtend.outerHeight()) : -parseInt($gnbExpand.outerHeight()) - parseInt($gnbExtend.outerHeight());
			$gnbExpand.stop().animate({'top': _offsetY}, {
				queue: false,
				duration: 300,
				easing: 'easeInOutCubic'
			});
			//$gnbLocal.addClass("off");
			var hasClassHeader = $("header.extend").hasClass("fixed");
			if(!hasClassHeader) {
				$gnbLocal.fadeOut(300);
			}

		}
	}

	function dataRoleSet(object){
		var navHtml = $(object).siblings(".gnb-depth-layer").html();
		$(".gnb-local-depth").html(navHtml);
	}

	function dataRoleCurrentSet(){
		var aaa = $(this).hasClass("selected");
		if(aaa) {
			dataRoleSet(this);
		}
	}

	function dataRoleReSet(){
		//$(".gnb-local-depth").html("");
	}

	function loadFixed() {
		//var $hiddenDepth = $(".gnb-depth-listbox-wrapper");
		var $top = $(window).scrollTop();
		if ($top == 0) {
			$header.removeClass("fixed");
			$gnbExpand.removeClass("hidden");
		} else {
			$header.addClass("fixed");
			$gnbExpand.addClass("hidden");
		}
	}

	$('.' + $gnbBtn.attr('class') + ', .' + $gnbExpand.attr('class')).on('mouseenter keyup', function (e) {
		var _$this = $(this);
		gnbSelectEffect.call(_$this);
		gnbDrawerView.call(_$this, true);
		$header.removeClass('is-opacity');
		if (e.type == 'keyup') {
			$(document).on('keyup', function () {
				if ($(':focus').closest('.gnb').length == 0) {
					$header.trigger('mouseleave');
					$(document).off('keyup');
				}
			});
		}
	});

	$header.on('mouseleave', function () {
		var _$this = $(this);
		$(window).trigger('scroll');
		gnbDrawerView.call(_$this, false);
		gnbSelectEffect.call(_$this);

	});


    if($header.hasClass("extend")){

        loadFixed();
        $(window).scroll(loadFixed);

        var $currentTitle = $(".gnb-curent"),
            $targetcurrentLi = $(".gnb-localnav .gnb-curent > ul > li.selected"),
            $thisA = $targetcurrentLi.children("a"),
            $thisdepth = $thisA.siblings(".gnb-depth"),
            $thisdataname = $thisA.attr("data-name"),
            $thisdatarole = $thisA.attr("data-role");


	    $($thisA).siblings(".gnb-depth").children("ul").children("li").children("a").each(function(){
	    	var thisText = $(this).text();
		    var aaa = $(this).hasClass("selected");
		    if(aaa) {
			    $(".gnb-localnav .gnb-curent > ul > li > a").text(thisText);
			    dataRoleSet(this);
		    }
	    });



	    if($targetcurrentLi.length > 0) {
		    $currentTitle.addClass($thisdataname);
		    if($thisdatarole === "true") {
			    //3depth 없음
			    dataRoleSet($thisA);
		    } else {
			    //3depth 있음
			    $($targetcurrentLi).bind({
				    mouseenter: function() {
					    $thisA.addClass("selected");
					    $thisdepth.addClass("selected");
				    },
				    mouseleave: function() {
					    $thisdepth.removeClass("selected");
				    }
			    });

			    $($thisdepth).bind({
				    mouseenter: function() {
					    $thisA.addClass("selected");
					    $thisdepth.addClass("selected");
				    },
				    mouseleave: function() {
					    $thisA.removeClass("selected");
					    $thisdepth.removeClass("selected");
				    }
			    });

			    $($thisA).siblings(".gnb-depth").children("ul").children("li").children("a").bind({
				    mouseenter: function() {
					    var $depthtarget = $(this),
						    $depthrole = $depthtarget.attr("data-role");
					    if($depthrole === "true"){
						    //dataRoleSet($depthtarget);
					    }
				    },
				    mouseleave: function() {
						dataRoleReSet();
					    $($thisA).siblings(".gnb-depth").children("ul").children("li").children("a").each(function(){
						    var aaa = $(this).hasClass("selected");
						    if(aaa) {
							    dataRoleSet(this);
						    }
					    });
				    }
			    });

		    /* $($thisA).siblings(".gnb-depth").children("ul").children("li").children("a").bind("mouseenter", function(e){
			    var $depthtarget = $(this),
				    $depthrole = $depthtarget.attr("data-role");
			    if($depthrole === "true"){
				    e.preventDefault();
				    $(this).parents("li").siblings("li").children("a").removeClass("active");
				    $(this).addClass("active");
				    dataRoleSet($depthtarget);
			    }
		    }); */
		    }
	    }
        /*
        if($targetcurrentLi.length > 0) {
            $currentTitle.addClass($thisdataname);
            if($thisdatarole === "true") {
                //3depth 없음
                dataRoleSet($thisA);
            } else {
                //3depth 있음
                $($thisA).click(function(e){
                    e.preventDefault();
                    $thisA.toggleClass("selected");
                    $thisdepth.toggleClass("selected");
                    $(this).siblings(".gnb-depth").children("ul").children("li").children("a").click(function(e){
                        var $depthtarget = $(this),
                            $depthrole = $depthtarget.attr("data-role");
                        if($depthrole === "true"){
                            e.preventDefault();
                            $(this).parents("li").siblings("li").children("a").removeClass("active");
                            $(this).addClass("active");
                            dataRoleSet($depthtarget);
                        }
                    });
                });
            }
        }
        */
    }

}; setting();

exports.setting = setting;
},{}]},{},[1])


	/* 211026 GNB */

$(document).ready(function(){

	// if($(window).height(0)){
	// 	$(".depth2_wrapper").hide();
	// 	$(".gnb_placeholder").addClass('active');
	// }	
	$('.slide_wrap .slide').slick({
		autoplay: true,	
		infinite: true,
		dots: true,
		arrows:false
	})

	$(".depth2_wrapper").hide().slideUp();
	$(".gnb_placeholder").hide();

	$(".header21 .gnb_depth1").mouseenter(function(){
		$(this).children().addClass('on'); // a링크에 호버효과
		// $(".gnb_placeholder").addClass('active');
		// $(".depth2_wrapper").addClass('active');
		$(".depth2_wrapper").stop().slideDown();
		$(".gnb_placeholder").show().stop().fadeIn();
	});

	$(".header21 .gnb_depth1").mouseleave(function(){
		$(this).children().removeClass('on'); // a링크에 호버효과
	});
	$(".header21").mouseleave(function(){		
		// $(".gnb_placeholder").removeClass('active');
		// $(".depth2_wrapper").removeClass('active');
		// $(".gnb_placeholder").stop().slideUp();
		$(".depth2_wrapper").stop().slideUp();
		$(".gnb_placeholder").stop().fadeOut();
	});

	$(".header21 .gnb_depth1").mouseenter(function(){	
		var $depth2_wrapper = $(this).children().attr('class');
		// console.log('ddd');
		console.log($depth2_wrapper);
		if($depth2_wrapper == 'short_rent on'){
			$('.gnb_depth_wrapper').hide();
			$('#short_rent').show();
		}else if($depth2_wrapper == 'long_rent on'){
			$('.gnb_depth_wrapper').hide();
			$('#long_rent').show();
		}else if($depth2_wrapper == 'consumer on'){
			$('.gnb_depth_wrapper').hide();
			$('#consumer').show();
		}
	});

});

