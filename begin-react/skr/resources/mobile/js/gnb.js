$(function () {

	// gnb fixed
	var $header = $('header');
	var $contents = $('.contents');
	
	function loadFixed() {
		var $top = $(window).scrollTop();
		if ($top == 0) {
			$header.removeClass("fixed");     $contents.removeClass("fixed");
		} else {
			$header.addClass("fixed");        $contents.addClass("fixed");
		}
	}
	
	if($header.hasClass("extend") || $contents.hasClass("pull-content")){
        loadFixed();
        $(window).scroll(loadFixed);
	}
	
	
	// top & back button
	$("#toTop .page-topgo").bind("click", function () {
		$('html,body').animate({ scrollTop: 0 }, 300);
	});
	$(window).scroll(function () {
		if ($(this).scrollTop() > 0) {
			$('#toTop').fadeIn();
		}
		else {
			$('#toTop').fadeOut();
		}
	});

	$(window).scroll(function () {

		if ($(window).scrollTop() > $(document).height() - $(window).height() - 190) {
			$('.quick-top').addClass('static');
		}
		else {
			$('.quick-top').removeClass('static');
		}

	});
	/****/
	
	// lnb open
	$('.ic-lnb').click(function () {
		$('.nav-lnb').show();
		$('.nav-lnb').stop().animate({ 'left': 0 }, 500, 'easeOutExpo')
		$('header .dim').fadeIn();
		$('html,body').css({ "overflow": "hidden" });
	})

	$('header > .dim, .nav-lnb .top-link > .close').click(function () {
		$('.nav-lnb').stop().animate({ 'left': '-310px' }, 700, 'easeOutExpo', function () {
			$(this).hide();
		})
		$('header .dim').fadeOut();
		$('html,body').css({ "overflow": "initial" });
	})
	
	// rnb open
	$('.ic-my').click(function () {
		$('.nav-my').show()
		$('.nav-my').stop().animate({ 'right': 0 }, 500, 'easeOutExpo')
		$('header .dim').fadeIn();
		$('html,body').css({ "overflow": "hidden" });
	})

	$('header > .dim, .nav-my > .top-link > .close').click(function () {
		$('.nav-my').stop().animate({ 'right': '-310px' }, 700, 'easeOutExpo', function () {
			$(this).hide();
		})
		$('header .dim').fadeOut();
		$('html,body').css({ "overflow": "initial" });
	})
	/****/

	// lnb menu show/hide
	$('.nav-lnb .menu-tit').click(function () {

		if ($(this).hasClass('on')) {
			$('.sub-menu').slideUp(300);
			$(this).removeClass('on');
			$(this).parent('.tline').removeClass('open');
		}
		else {
			$('.sub-menu').slideUp(300);
			$('.nav-lnb .menu-tit').removeClass('on');
			$('.nav-lnb .tline').removeClass('open');
			$('.nav-lnb .menu-longterm').removeClass('on').removeClass('selected');
			$(this).siblings('.sub-menu').slideDown(300);
			$(this).addClass('on');
			$(this).parent('.tline').addClass('open');
		}

	});
	$('.nav-lnb .menu-longterm').click(function () {
		
		var menu_idx = $(this).attr('data-id-menu');

		if ($(this).hasClass('on')) {
			$('.sub-menu').slideUp(300);
			$(this).removeClass('on').removeClass('selected');
		}
		else {
			$('.sub-menu').slideUp(300);
			$('.nav-lnb .menu-tit').removeClass('on');
			$('.nav-lnb .tline').removeClass('open');
			$('.nav-lnb .menu-longterm').removeClass('on').removeClass('selected');
			$('.sub-menu.longterm' + [menu_idx]).slideDown(300);
			$(this).addClass('on').addClass('selected');
		}

	});

	// rnb menu show/hide
	$('.nav-my .menu-tit').click(function () {

		if ($(this).hasClass('on')) {
			$('.sub-menu').slideUp(300);
			$(this).removeClass('on');
			$(this).parent('li').removeClass('open');
		}
		else {
			$('.sub-menu').slideUp(300);
			$('.nav-my .menu-tit').removeClass('on');
			$('.nav-my .menu > li').removeClass('open');
			$(this).siblings('.sub-menu').slideDown(300);
			$(this).addClass('on');
			$(this).parent('li').addClass('open');
		}

	});

	
	var $pageSubmenu = $('header .depth-title h2');
	var $item1 = $('header .depth-title ul > li h3.item1');
	var $item2 = $('header .depth-title ul > li h3.item2');
	var $item3 = $('header .depth-title ul > li h3.item3');
	var $item4 = $('header .depth-title ul > li h3.item4');
	var $item5 = $('header .depth-title ul > li h3.item5');
	var $item6 = $('header .depth-title ul > li h3.item6');
	var $item7 = $('header .depth-title ul > li h3.item7');
	var $item8 = $('header .depth-title ul > li h3.item8');
	
	
	$pageSubmenu.click(function () {
		$pageSubmenu.next('nav').slideToggle(250);
		if ($(this).hasClass('open')) {
			$(this).removeClass('open')
		} else {
			$(this).addClass('open')
		}
		return false;
	});
	
	$item1.click(function () {
		$item1.next('ul').slideToggle(250);
		if ($(this).hasClass('active')) {
			$(this).removeClass('active')
		} else {
			$(this).addClass('active')
		}
		return false;
	});
	
	$item2.click(function () {
		$item2.next('ul').slideToggle(250);
		if ($(this).hasClass('active')) {
			$(this).removeClass('active')
		} else {
			$(this).addClass('active')
		}
		return false;
	});
	
	$item3.click(function () {
		$item3.next('ul').slideToggle(250);
		if ($(this).hasClass('active')) {
			$(this).removeClass('active')
		} else {
			$(this).addClass('active')
		}
		return false;
	});
	
	$item4.click(function () {
		$item4.next('ul').slideToggle(250);
		if ($(this).hasClass('active')) {
			$(this).removeClass('active')
		} else {
			$(this).addClass('active')
		}
		return false;
	});
	
	$item5.click(function () {
		$item5.next('ul').slideToggle(250);
		if ($(this).hasClass('active')) {
			$(this).removeClass('active')
		} else {
			$(this).addClass('active')
		}
		return false;
	});
	
	$item6.click(function () {
		$item6.next('ul').slideToggle(250);
		if ($(this).hasClass('active')) {
			$(this).removeClass('active')
		} else {
			$(this).addClass('active')
		}
		return false;
	});
	
	$item7.click(function () {
		$item7.next('ul').slideToggle(250);
		if ($(this).hasClass('active')) {
			$(this).removeClass('active')
		} else {
			$(this).addClass('active')
		}
		return false;
	});
	
	$item8.click(function () {
		$item8.next('ul').slideToggle(250);
		if ($(this).hasClass('active')) {
			$(this).removeClass('active')
		} else {
			$(this).addClass('active')
		}
		return false;
	});

	// �ٱ����� ��ġ �� ���̾� ����
	$(document).bind("touchstart", function (e) {
		var container = $(".depth-title");
		if (container.has(e.target).length === 0) {
			$(".depth-title nav").slideUp(250);
			$pageSubmenu.removeClass("open");
		}
	});

	var $pageSubDepth2 = $('header .depth-title nav li a.bu');

	$pageSubDepth2.click(function () {
		
		if ($(this).parent().hasClass('open')) {
			$(this).next('.sub').slideUp();
			$(this).parent().removeClass('open');
		}
		else {
			$(this).parent().parent().find('li .sub').slideUp();
			$(this).parent().parent().find('li').removeClass('open');
			$(this).parent().addClass('open');
			$(this).next('.sub').slideDown();

		}

		return false;
	})

	/**************************** 2018.02 : ���̷�Ʈ���� ****************************/

	// īī���� ����ϱ� ���̾� ����
	$("header .bottom-counsel .now span").click(function () {
		$("header .counsel-dim").fadeIn();
		$(".counsel-select").fadeIn();
	})
	$("header .counsel-dim, header .counsel-select .close").click(function () {
		$("header .counsel-dim").fadeOut();
		$(".counsel-select").fadeOut();
	})
	

});