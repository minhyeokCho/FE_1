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
		
		if (typeof tab_sub == 'function') tab_sub(a); //tab_sub 함수가 있으면 실행시킨다.
	}
};
function bottomfloat(object, num) {
	var bottom = $(document).height() - $(window).height() - $(document).scrollTop();

	if (bottom > num) {
		object.removeClass("off");
	} else if (bottom <= num) {
		object.addClass("off");
	} else {
		object.removeClass("off");
	}
};

//견적조건 - 약정거리 팝업
function distancePopLayer(layerNum) {
	var poplayer = ".distance-layer" + layerNum;
	$(".distance-pop-layer").removeClass("on");
	$(poplayer).addClass("on");
}

//개인장기렌터카안내 - 팝업
function rentservicePopLayer(layerNum) {
	var poplayer = ".rentservice-layer" + layerNum;
	$(".rentservice-pop-layer").removeClass("on");
	$(poplayer).addClass("on");
}
function rentservice2PopLayer(layerNum) {
	var poplayer = ".rentservice2-layer" + layerNum;
	$(".rentservice2-pop-layer").removeClass("on");
	$(poplayer).addClass("on");
}

// 고객센터-지점안내-장기렌터카상담센터 select change ( 2017.08.03 수정 )
function centerListChange(ListNum) {
	if (ListNum == 0) {
		$(".counsel-branch ul li").show();
	}
	else {
		var region = ".region" + ListNum;
		$(".counsel-branch ul li").hide();
		$(region).show();
		$(".centerList-more").hide();
	}
}

// ticker
$(function(){
	var  $tickerinfo = $(".ticker-info");
	
	// 2016-06-09. footer가 없는데서는 티커를 위치조정 함수를 사용하지 않음
	//window scroll
	if ($("footer").length > 0)
	{
	    $(window).scroll(function(){
	        bottomfloat($tickerinfo, 140);
	    }); 			
	}
	
	tabDetector();
    $(".tab-menu ul li a").bind("click", tabOpener);
	
	//drop-content
    $(".drop-content .drop-btn").click(function (e) {
		e.preventDefault();
        $(this).parent().toggleClass( "selected", 500);
		$(this).children("span").text($(this).children("span").text() == '더보기' ? '접기' : '더보기');
    });
	
	//ticker-info
    $(".ticker-info .ticker-btn").click(function (e) {
        e.preventDefault();
        $(".ticker-info").toggleClass("selected", 500);

		// 바깥영역 터치 시 레이어 닫힘
        $(document).bind("touchstart", function (e) {
        	var container = $(".ticker-info");
        	if (container.has(e.target).length === 0) {
        		$(".ticker-info").removeClass("selected", 500);
        	}
        });
    });
    

	//다이렉트 견적조회 재검색
	var directConditionSearch = $(".direct-search-condition .search");
	directConditionSearch.click(function (e) {
		$(".direct-condition-setting").slideToggle(300);
		
		if (directConditionSearch.hasClass("on")) {
			$(".mask").remove();
			$(this).removeClass("on");
		}
		else {
			$('html').append('<div class="mask" style="display:block; z-index:1000"></div>');
			$(this).addClass("on");
		}

		// 바깥영역 터치 시 레이어 닫힘
		$(".mask").click(function () {
			$(".mask").remove();
			$(".direct-condition-setting").slideUp(300);
			$(".direct-search-condition .search").removeClass("on");
		});

	/*
		e.preventDefault();
        $(".direct-condition-setting").slideDown("fast");
        $(this).parent(".direct-search-condition").addClass("selected");
        $('html').append('<div class="mask" style="display:block; z-index:1000"></div>');
		$(".direct-search-confirm").click(function (e) {
			$(".direct-condition-setting").slideUp("fast");
			$(this).parent().parent().siblings(".direct-search-condition").removeClass("selected");
			$(".mask").remove();
		});
	*/
    });
	
	//차량옵션 선택 - slide up/down
	var directCaroptionSelect = $(".list-caroption-select>.item");
	directCaroptionSelect.click(function () {
		if ($(this).hasClass("on") == true) {
			$(this).next().slideUp("fast");			directCaroptionSelect.removeClass("on");
		}
		else {
			directCaroptionSelect.next().slideUp("fast");			$(this).next().slideDown("fast");
			directCaroptionSelect.removeClass("on");			$(this).addClass("on");
		}
	});
	
	//견적조건 선택 - slide up/down
	var estimateConditionSelect = $(".list-estimate-condition-select>.item>.ic-arr , .list-estimate-condition-select .moreview");
	estimateConditionSelect.click(function () {
		if($(this).hasClass("moreview") == true){
			if ($(this).hasClass("on2") == true) {
				$(this).parent("div").next().slideUp("fast");			$(this).removeClass("on2");
			}
			else {     $(this).parent("div").next().slideDown("fast");			$(this).addClass("on2");			}
		}
		else{
			if ($(this).parent(".item").hasClass("on") == true) {
				$(this).parent(".item").next().slideUp("fast"); estimateConditionSelect.parent(".item").removeClass("on");
			}
			else {
				estimateConditionSelect.parent(".item").next().slideUp("fast"); $(this).parent(".item").next().slideDown("fast");
				estimateConditionSelect.parent(".item").removeClass("on"); $(this).parent(".item").addClass("on");
			}
		}
	});
	
	//법인장기렌터카 장점 - slide up/down
	var companyLongcarMerit = $(".company-longcar-merit>.item");
	companyLongcarMerit.click(function () {
		if ($(this).hasClass("on") == true) {			$(this).next().slideUp("fast");			companyLongcarMerit.removeClass("on"); 		}
		else {	 companyLongcarMerit.next().slideUp("fast");			$(this).next().slideDown("fast");			companyLongcarMerit.removeClass("on");			$(this).addClass("on");		}
	});
	
	//자주찾는 질문
	var counselFaq = $(".wrap-bbsList.faq .list-bbs>li");
	counselFaq.click(function () {
		if ($(this).hasClass("on") == true) {			$(this).children('.answer').slideUp("fast");			counselFaq.removeClass("on");		}
		else {			counselFaq.children('.answer').slideUp("fast");			$(this).children('.answer').slideDown("fast");			counselFaq.removeClass("on");			$(this).addClass("on");		}
	});
	

	
	//modal
    $(".btn-modal").click(function(e){
    
        var modal_name = $(this).attr("href");        
        if (modal_name.indexOf("modal") > 0) // href에 'modal'이 없으면 해당소스에 구현된 이벤트핸들러를 사용
        {
    		e.preventDefault();
    		$("input").blur();
    		
    		$($(this).attr("href")).css({display:"block"});
            $("html").addClass("no-scroll");
        }        
        return false;
    });
    
    function modal_close(e)
    {
    	e.preventDefault();
    	$("div.modal-pop").hide();
    	$("html").removeClass("no-scroll");
    	$('.contents').off('scroll touchmove mousewheel', scroll_lock);
    	$(".dimd").css('display','none');
    }
    
    $("div.modal-pop .modal-close").click(function (e) {
    	modal_close(e);
    });
    
    // 모달창 하단 취소 버튼인데 닫기만 하는 경우 close-btn속성을 준다
    $("a.x-btn-close").click(function (e) {
    	modal_close(e);
    });
    

    var smallModalMarginTop = $(".modal-pop2").height() / 2;
    $(".modal-pop2").css("margin-top", -smallModalMarginTop);    

    $(".modal-pop2 .modal-close").click(function (e) {
    	e.preventDefault();
    	$(".modal-pop2").hide();
    	$("html").removeClass("no-scroll");
    	$(".mask").css({display:"none"});
		//$(".mask").remove();
    });

	// rentcar agree show/hide
	$('.terms-list.rent-agree .drop-btn').click(function () {
		 if ($(this).hasClass('on')) {
 			$(this).parent().siblings('.terms-content').slideUp(300);    $(this).removeClass('on');
		}
		else {
			$('.drop-btn').removeClass('on');    $('.terms-content').slideUp(300);
 			$(this).parent().siblings('.terms-content').slideDown(300);   $(this).addClass('on');
		} 
	});
	
	// 마이렌터카 견적정보 - slide up/down
	var personalEstimateList = $(".personal-estimate-wrap > .con > .tit-area > a");

	personalEstimateList.click(function () {
		$(this).toggleClass("on");
		$(this).parent().next().stop().slideToggle("slow");
		return false;
	});
	

	// 대여,반납지점 레이어 show/hide & 지역별 리스트 show/hide
	var $selectBranch = $('.tab-menu .sel-branch-tab li')
	
	$selectBranch.click(function () {
		$selectBranch.removeClass('selected');
		$(this).addClass('selected');

		var $selectBranchIdx = $(this).index();
		
		$('.sel-branch').hide();
		$('.sel-branch').eq($selectBranchIdx).show();
	})

	var $selRegion = $('.rent-scroll .menu-rent .region');

	$selRegion.click(function () {

		if ($(this).parent().hasClass('open')) {
			$(this).next('.sub-menu').slideUp();
			$(this).parent().removeClass('open');
		}
		else {
			$(this).parent().parent().find('li .sub-menu').slideUp();
			$(this).parent().parent().find('li').removeClass('open');
			$(this).parent().addClass('open');
			$(this).next('.sub-menu').slideDown();

		}

	})


	//멤버십 사용/미사용 - slide up/down
	var membershipSerciveList = $(".membership-service-price > .service-list > .tit");

	membershipSerciveList.click(function () {

		if ($(this).hasClass("on") == true) {
			$(this).next().slideUp("slow");
			membershipSerciveList.removeClass("on");
		}
		else {
			membershipSerciveList.next().slideUp("slow");
			$(this).next().slideDown("slow");
			membershipSerciveList.removeClass("on");
			$(this).addClass("on");
		}
	});

	//마이렌터카 - 상담내역 - slide up/down
	var personalCounselList = $(".counsel-wrap > .counsel-list > .cs-tit");
	var personalCounselListRentQ = $(".mycounsel.rentacar > .counsel-wrap > .counsel-list > .question");

	personalCounselList.click(function () {


		if ($(this).hasClass("on") == true) {
			$(this).parent().find(".cs-view").slideUp();
			personalCounselListRentQ.addClass("ellipsis");
			personalCounselList.removeClass("on");

		} else {
			personalCounselList.parent().find(".cs-view").slideUp();
			$(this).parent().find(".cs-view").slideDown();
			personalCounselList.removeClass("on");
			$(this).addClass("on");

			personalCounselListRentQ.addClass("ellipsis");
			$(this).next().next().removeClass("ellipsis");

		};
		

	});


	//마이렌터카 - 청구내역 상세 - 2017.08.14 수정
	$(".myuse.view .bt-detail-view").click(function () {
		$(this).toggleClass("on");
		$(".monthly-cost").stop().slideToggle();
	});

	var useDetailList = $(".use-detail-list > .list-type > .list-top");
	useDetailList.click(function () {
		$(this).toggleClass("on");
		$(this).parent().find(".list-bottom").stop().slideToggle();
		return false;
	});


	// gate 페이지 박스 모션
	$(".section-gate .card .front").click(function () {
		$(".section-gate .card .front").removeClass("zoomout");
		$(".section-gate .card .front").siblings(".back").stop().animate({ left: "110%" }, 500, "easeOutCirc");
		$(this).addClass("zoomout");
		$(this).siblings(".back").stop().animate({ left: "0%" }, 800, "easeOutExpo");
	});
	

	//마이렌터카 - 개인정보수정
	var myInfoListA = $(".section-mypage .myinfo .pw-change > .con > .tit-area > span");
	myInfoListA.click(function () {
		$(this).toggleClass("on");
		$(this).parent().next().stop().slideToggle();
		return false;
	});

	// 마이렌터카 - 대여내역 drop-content
	$(".psnl-rent-dropcon .drop-btn").click(function (e) {
		e.preventDefault();
		$(this).parent().toggleClass("selected", 500);
	});

	//단기 - 결제/할인 - 20170915 수정
	$(".payment-type > li").click(function () {
		//$(".payment-type > li").removeClass("on");
		//$(this).addClass("on");

		if ($(this).hasClass("on") == true) {
			$(".payment-type > li").removeClass("on");
		} else {
			$(".payment-type > li").removeClass("on");
			$(this).addClass("on");
		};

	});

	//마이렌터카 - 개인정보수정 - 인증버튼 클릭 시 번호입력창 show ( 0728 수정 )
	var mybtnCert = $(".phone-mail .set a.btn-round2");
	mybtnCert.click(function () {
		$(this).parent().parent(".mail-sel").hide();
		$(this).parent().parent().siblings(".cert-num").show();

		return false;
	});

	//마이렌터카 - 개인정보수정 - 하단 수신동의 영역 물음표 팝업 (2017.07.05 추가)
	var qMark = $(".receive-agree .terms-header .q-mark");
	var descpop = $(".receive-agree .desc-popup");
	var descpopClose = $(".receive-agree .desc-popup .btn-close");
	qMark.click(function () {
		descpop.hide();
		qMark.css("overflow", "hidden");
		$(this).siblings(".desc-popup").show();
		$(this).css("overflow", "visible");
	});
	descpopClose.click(function () {
		$(this).parent().hide();
		qMark.css("overflow", "hidden");
	});

	// map 선택한 mark 표시 (2017.07.14 추가)
	$(".map-mark-basic").click(function () {
		$(".map-mark-basic").removeClass("selected");
		$(this).addClass("selected");

	});

	// 단기렌터카 사용쿠폰선택 (2017.07.18 추가)
	$(".select-usecoupon>ul>li>.fr").click(function () {
		$(this).parent().hide();
	});

	//물음표 팝업 공통
	var questionMark = $(".question-mark");
	var descriptionpop = $(".description-popup");
	var descriptionpopClose = $(".description-popup .btn-close");
	questionMark.click(function () {
		descriptionpop.hide();
		questionMark.css("overflow", "hidden");
		$(this).siblings(".description-popup").show();
		$(this).css("overflow", "visible");
	});
	descriptionpopClose.click(function () {
		$(this).parent().hide();
		questionMark.css("overflow", "hidden");
	});

	//상세검색 레이어 조회기간 선택 (2017.07.26 추가)
	var choicePeriod = $(".search-detail-hide > .period-serach > ul > li > a");
	choicePeriod.click(function () {
		choicePeriod.removeClass("selected");
		$(this).addClass("selected");
		return false;
	});

	//청구내역 조회기간 선택 (2017.08.07 추가)
	var myUseListPeriod = $(".section-mypage>.myuse>.views-period>ul>li>a");
	myUseListPeriod.click(function () {
		myUseListPeriod.removeClass("selected");
		$(this).addClass("selected");
		return false;
	});


	/********************* 2018.01 다이렉트개편 *********************/


    //다이렉트 메인 추천 검색어 무한롤링
	var rollingKeyword = function () {
	    setTimeout(function () {
	        $('#rollingKeyword li:first').animate({ marginTop: '-40px' }, 600, function () {
	            $(this).detach().appendTo('ul#rollingKeyword').removeAttr('style');
	        });
	        rollingKeyword();
	    }, 3000);
	};
	rollingKeyword();


    //다이렉트 메인 가상시승 팝업 유투브 사이즈
	trialMovie();

	function trialMovie() {
	    var $iframe = $(".wrap-movie-trial iframe"); // 2018-02-09 .wrap-movie 클래스네이밍 변경
		var w = $iframe.width();
		var h = w * 0.56;
		$iframe.height(h);
	}

	$(window).resize(function () {
	    trialMovie();
	});


    //다이렉트 팝업 - 물음표 팝업
	$(".ic-question-direct").click(function () {

	    if ($(this).next().hasClass("on")) {
	        $(".wrap-guide").removeClass("on");
	    } else {
	        $(".wrap-guide").removeClass("on");
	        $(this).next().addClass("on");
	    }

	});
	$(".ic-question-direct + .wrap-guide .close-bt").click(function () {
	    $(".wrap-guide").removeClass("on");
	});


    //다이렉트 메인 사용자리뷰 팝업
	var cmtModify = $(".comment-list-item.my a.modify");
	var cmtDelete = $(".comment-list-item.my a.delete");
	var modifyCancel = $(".comment-list-item.my a.cancel");

	cmtModify.click(function () {
	    $(this).parent().siblings(".wrap-default").hide();
	    $(this).parent().siblings(".wrap-modify").show();
	    $(this).hide();
	    $(this).siblings(".delete").hide();
	    $(this).siblings(".cancel").show();

        //modify textarea placeholder
	    if (!$(this).parent().siblings(".wrap-modify").find(".cmt_text").val()) {
	        $(this).parent().siblings(".wrap-modify").find(".cmt_text").next().show();
	    } else {
	        $(this).parent().siblings(".wrap-modify").find(".cmt_text").next().hide();
	    }


	    return false;
	});

	cmtDelete.click(function () {
	    $(this).parent().parent().hide();
	    return false;
	});

	modifyCancel.click(function () {
	    $(this).parent().siblings(".wrap-modify").hide();
	    $(this).parent().siblings(".wrap-default").show();
	    $(this).hide();
	    $(this).siblings(".modify").show();
	    $(this).siblings(".delete").show();
	    return false;
	});

	$(".cmt-write-box .btn-thumbs a").click(function () {
	    $(".cmt-write-box .btn-thumbs a").removeClass("on");
	    $(this).addClass("on");
	    return false; //2018-02-08 추가
	});


    //다이렉트 비교차량변경 팝업 
	$(".car-list-wrap .car-list-item").click(function () {
	    $(".car-list-wrap .car-list-item").removeClass("selected");
	    $(this).addClass("selected");
	});


    //다이렉트 견적조회 옵션변경 팝업
	var $list = $(".detail-car-option-list ul li");
    var slideIdx = $list.length;
    var i = 0;

    for (i; i < slideIdx; i++) {

        var a = $list.eq(i).find('.slides');
        var b = $list.eq(i).find('.slides .slide-item');

        if (b.length > 1) {
            a.slidesjs({
                width: 576,
                height: 294,
                play: {
                    auto: true,
                    interval: 4000,
                    swap: true
                }
            });
        } else {
            a.css({ display: 'block' });
        }
    }
	
    $(".detail-car-option-list .bt-arr").click(function () {
        
        if (!$(this).hasClass("on")) {
            $(".detail-car-option-list .bt-arr").removeClass("on");
            $(this).addClass("on");
            $(".detail-car-option-list .view-group").removeClass("on");
            $(this).parent().siblings(".view-group").addClass("on");
        } else {
            $(".detail-car-option-list .bt-arr").removeClass("on");
            $(this).parent().siblings(".view-group").removeClass("on");
        };

    });

    //radio
    $(".detail-car-option-list input[type=radio]").click(function () {
        $(".detail-car-option-list li").removeClass("selected");
        $(this).parent().parent().parent().addClass("selected");
    });

    //checkbox
    $(".detail-car-option-list input[type=checkbox]").click(function () {        
        $(this).parent().parent().parent().toggleClass("selected");
    });


    
    //장기렌터카 차량정보 view swiper 네비게이션 바
    var $infotab = $('.section-personal-carinfo .direct-serch-result');
    var $infotabItem = $('.section-personal-carinfo .direct-serch-result .result-list .tab-item');
    var itemLenght = $infotabItem.length - 1;

    $(window).scroll(function () {

        var $winTop = $(window).scrollTop();

        if ($winTop < 480) {
            $infotab.removeClass("fixed");
            $infotabItem.removeClass("on");
        } else {
            $infotab.addClass("fixed");
        }

        for (var i = 0; i <= itemLenght; i++) {
            if ($winTop >= $(".result-info-wrap").eq(i).offset().top - 120) {
                $infotabItem.removeClass("on");
                $infotabItem.eq(i).addClass("on");
            }

            if ($infotabItem.eq(i).hasClass("on")) {
                if (i <= 2) {
                    $(".direct-serch-result .topfix .swiper-wrapper").css({
                        transform: "translateX(0px)",
                        transition: "0.2s"
                    });
                }
                if (i > 2) {

                    var deviceW = $(window).width();
                    
                    if (deviceW <= 320) {
                        $(".direct-serch-result .topfix .swiper-wrapper").css({
                            transform: "translateX(-100%)",
                            transition: "0.2s"
                        });
                    } else if (deviceW <= 410) {
                        $(".direct-serch-result .topfix .swiper-wrapper").css({
                            transform: "translateX(-71.5%)",
                            transition: "0.2s"
                        });
                    } else if (deviceW <= 640) {
                        $(".direct-serch-result .topfix .swiper-wrapper").css({
                            transform: "translateX(-50%)",
                            transition: "0.2s"
                        });
                    } else {
                        $(".direct-serch-result .topfix .swiper-wrapper").css({
                            transform: "translateX(-21%)",
                            transition: "0.2s"
                        });
                    }
                    
                }
            }
        }
    });

    $(".topfix .swiper-slide").click(function () {
        var i = $(this).index();
        var j = $(".result-info-wrap").eq(i).offset().top - 110;
        $("html, body").animate({ scrollTop: j }, 300);
        return false;
    })

    //차량정보 상세 - 가상시승 iframe 스크롤 이슈
    var $trialMovie = $(".section-personal-carinfo .wrap-movie-trial");

    $(window).on('load', function () {
        $trialMovie.find('iframe').css({ 'display': 'block' });
    });

    
    //댓글 작성 placeholder 기능
    $(".cmt-write-box .cmt_text").keyup(function () {

        var a = $(this).val();
        var b = a.length;

        if (b < 1) {
            $(this).next("label").show();
        }
        else {
            $(this).next("label").hide();
        }
    })
})


	function scroll_lock(event)
	{
    	event.preventDefault();
    	event.stopPropagation();
    	return false;
	}
	
	function modal_open(selector)
	{
		$(selector).show();
        $("html").addClass("no-scroll");            
 	    $('.contents').on('scroll touchmove mousewheel', scroll_lock);
	}