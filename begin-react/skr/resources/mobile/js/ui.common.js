$(document).ready(function() {
	$(".mainEvtBnr").length && mainEvtSwiper(); // 메인이벤트 슬라이드
	$(".reseSlideWrap").length && mainCmpltSwiper(); // 메인이벤트 슬라이드
	$(".dirBnr").length && dirBnrSwiper(); // 링크베너 슬라이드
	$(".tab_menu_bg").length && tabMenu(); //차종선택탭
	$('.selectTime').length && selectTime(); //대여/반납 시각선택
	$('.selectTime01').length && selectTimeTab()
	$('.selectArea').length && selectArea();
	$('.btmInnerOpen').length && btmPopupInner(); //바닥팝업inner
	$(".btmPopup").length && btmPopup(); //바닥팝업
	$(".calendar-area2").length && dateCalender(); //달력
});

function mainEvtSwiper(){ // 메인이벤트 슬라이드
	mainEvt = new Swiper(".mainEvtBnr .swiper-container", {
		loop: true,
		slidesPerView:'1',
		spaceBetween:20,
		pagination:{
			el: '.swiper-pagination',
			type: 'fraction',
			renderFraction: function (currentClass, totalClass) {
				return '<span class="' + currentClass + ' current' + '"></span>' + ' <span>/</span> ' + '<span class="' + totalClass + ' total' + '"></span>';
			}
		},
	});
}

function mainCmpltSwiper(){ // 메인 예약확인 슬라이드
	mainCmplt = new Swiper(".reseSlideWrap .swiper-container", {
		loop: true,
		slidesPerView:'1',
		spaceBetween:20,
		pagination:{
			el: '.swiper-pagination',
		},
	});
}

function dirBnrSwiper() { // 링크베너 슬라이드
	$(".dirBnr").each(function(){
		// var $this = $(this);
		var dirBnrSwiper = new Swiper(this,{
			slidesPerView : 'auto',
			spaceBetween: 16,
			loop: true,
		});
	});
}

function tabMenu() { //차종선택탭
	var scrIWidth = 0;
	$('.tab_menu_bg ul').each(function(){
		var $scrItem = $(this).children("li");
		scrIWidth = 0;
		for (var i=0; i<$scrItem.length; i++) {
			scrIWidth += $scrItem.eq(i).outerWidth()+4;
		}
		$(this).css('width',scrIWidth);
		$scrItem.click(function(){
			var target = $(this);
			target.siblings("li").removeClass('on')
			target.addClass('on');
			muCenter(target);
		});
	});

	function muCenter(target){
		var box = target.closest('.tab_menu_bg');
		var boxItem = box.find('li');
		var boxHarf = box.width()/2;
		var pos;
		var listWidth=0;
		var targetLeft = 0;

		boxItem.each(function(){
			listWidth += $(this).outerWidth();
		});
		for (var i=0; i<target.index(); i++) targetLeft += boxItem.eq(i).outerWidth(); // 선택요소 까지 길이
		var selectTargetPos = (targetLeft + target.outerWidth()/2);
		if (selectTargetPos <= boxHarf) { // left
			pos = 0;

		}else if(listWidth - selectTargetPos <= boxHarf) { //right : target 절반 이후 영역이 boxHarf 보다 작을경우 right 정렬
			pos = listWidth-box.width()/2;
		}else {
			pos = selectTargetPos - boxHarf; // 중앙정렬
		}
		setTimeout(function(){
			box.animate({scrollLeft:pos},300);
		}, 200);
	}
}

function selectTime() { //대여/반납 시각선택
	var opt = {}

	$('.selectTime').scroller($.extend(opt['time'], {
		preset: 'time',
		stepMinute: 30, //분 단위 선택 (30분 단위)
		theme: 'default',
		mode:'scroller',
		display: 'inline'
	}));
}

function selectTimeTab() { //대여/반납시간 탭 선택
	$(".selStartTimeOpen").on("click", function(e) {
		e.preventDefault();
		var $this = $(this);
		var listDiv = $this.closest("div");
		listDiv.removeClass("off").siblings("div").addClass("off")
	});
}

function selectArea() { //지점선택탭
	$(".selectArea").on("click", "a", function(e) {
		e.preventDefault();
		var $this = $(this);
		var listDiv = $this.closest("li");
		listDiv.addClass("on").siblings("li").removeClass("on")
	});
}

function btmPopupInner(){ //바닥팝업 inner
	$(".btmInnerOpen").on("click", function(e) {
		e.preventDefault();
		var $this = $(this);
		var currBtmPopup = $this.closest("div");
		currBtmPopup.addClass('open').siblings("div").removeClass("open");
		currBtmPopup.removeClass("btmInert").next("div").removeClass("btmInert");
	});
}

function btmPopup(){ //바닥팝업
	var $openBtn = $(".btmOpen");

	$openBtn.on("click", function(e) { /* 열기 */
		e.preventDefault();
		var target = $(e.target).attr("open-layer-class") || e;
		$(".btmPopup").removeClass("on");
		$(".btmPopup" + '.' + target + "").fadeIn(100).addClass("on");
		dimShow();
	});

	$(document).mouseup(function (e){ /* 닫기 */
		var popArea = $(".btmPopup");
		if(popArea.has(e.target).length === 0 && popArea.hasClass("on")){
			popArea.fadeOut(150).removeClass("on");
			dimHide();
		}
	});
}

function dimShow(){ /* 딤드 show */
	$("body").addClass("dimRenew");
}
function dimHide(){ /* 딤드 hide */
	$("body").removeClass("dimRenew");
}

function dateCalender(){ //달력
	$.datepicker.setDefaults({
		changeDayName:false,
		showOn: 'both',
		dateFormat: 'yy-mm-dd',
		monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
		monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
		minDate: 0,
		showMonthAfterYear: true, // 셀렉트 박스를 년,월 순으로
	});

	$('.calendar-area2').datepicker();
}