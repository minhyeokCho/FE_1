var currentDate = new Date();
var current_year = currentDate.getFullYear();			//현재 연도
var current_month = currentDate.getMonth() + 1;		//현재 월
var current_day = currentDate.getDate();				//현재 일
var current_date = current_year + "" + addZero(current_month) + "" + addZero(current_day);
var t_hour = currentDate.getHours();//현재 시간
var t_min = currentDate.getMinutes();//현재 분
var s_hour = currentDate.getHours();//현재 시간으로 예약가능시
var s_min = currentDate.getMinutes();//현재 시간으로 예약가능분

var jejuResStartHour = "07"; 				// 제주 예약 시작시
var jejuResStartHourNumber = 7; 		// 제주 예약 시작시
var jejuResEndHour = "22"; 				// 제주 예약 종료시
var jejuResEndHourNumber = 22; 		// 제주 예약 종료시
var jejuResStartMin = "30"; 				// 제주 예약 시작분
var jejuResEndMin = "30"; 					// 제주 예약 종료분

var jejuRtnStartHour = "06"; 				// 제주 반납 시작시
var jejuRtnStartHourNumber = 6; 		// 제주 반납 시작시
var jejuRtnEndHour = "21"; 				// 제주 반납 종료시
var jejuRtnEndHourNumber = 21; 		// 제주 반납 종료시
var jejuRtnStartMin = "00"; 				// 제주 반납 시작분
var jejuRtnEndMin = 0; 						// 제주 반납 종료분

var jejuTodayStartHour = "";				// 제주 현재일 예약 시작시간
var jejuTodayStartHourNumber = 7;	// 제주 현재일 예약 시작시간

var inlandResStartHour = "09";			// 내륙 예약 시작시
var inlandResStartMin = "00";				// 내륙 예약 시작분
var inlandResEndHour = "19";				// 내륙 예약 종료시
var inlandResEndMin = "00";				// 내륙 예약 종료분

var inlandRtnStartHour = "09";			// 내륙 반납 시작시
var inlandRtnStartMin = "00";				// 내륙 반납 시작분
var inlandRtnEndHour = "19";				// 내륙 반납 종료시
var inlandRtnEndMin = "00";				// 내륙 반납 종료분

var inlandTodayStartHour = 9; //내륙 현재일 예약 시작시간

if(s_min > 30){
	s_hour += 4;
	s_min = 0;
}else if(s_min == 0){
	s_hour += 3;
	s_min = 0;
}else{
	s_hour += 3;
	s_min = 30;
}

$(function(){
	$(document).ajaxStart(
			function(){
				$.blockUI({             
							message: $('#sht_rnt_loading'), 
							css: { background : 'none', border: 'none'	 } 
						})
				}
		); 
	$(document).ajaxStop($.unblockUI);
});

function go_resv(me)
{
	if ($(me).hasClass('disable')) return; //불가능상태면 무시
	
	showloading(); // 단기예약화면 뜨는게 늦으므로 로딩바
	
	if(sessUserCls != "1"){	
		var jurl = "/rent/rentcar/short_rent_reservation_new_jeju.do";		
		var lurl = "/rent/rentcar/short_rent_reservation_new.do";
	}else{
		var jurl = "/rent/rentcar/short_rent_reservation_new_jeju_company.do";		
		var lurl = "/rent/rentcar/short_rent_reservation_new_company.do";
	}
	
	var type = $("[name=quickReserveType]:checked").val();	
	var sendUrl = (type == "jeju") ? jurl : lurl;
	
	if (type == 'jeju') // 제주일때는 제주지점으로
	{
		$("#branchId").val("000012");
		$("#branchId2").val("000012");
		
		$("#cdId").val("");
		$("#cdId2").val("");
	}
	
	var sDate = calendar._selectFromDate;
	var lDate = calendar._selectToDate;
	
	$("#sDate").val(sDate);
	$("#lDate").val(lDate);
	$("#branchNm").val($("#br1").text());  //대여지역/지점명
 	$("#branchNm2").val($("#br2").text()); //반납지역/지점명
	
	$("#dptDtm").val(sDate.replace(/-/g,'') + $("#sHour").val() +$("#sMinute").val());
	$("#arvDtm").val(lDate.replace(/-/g,'') + $("#lHour").val() +$("#lMinute").val());
	
	$("#formId").prop("action", sendUrl);
	$("#formId").submit();
}

function makeTimeOption(s,e)
{
	var html = "";
	var n;
	
	for (var i=s; i <= e; i++)
	{
		n = (i < 10) ? "0" + i: i;
		html +=  ("<option value=" + n + ">"  + n  + "시</option>");
	}
	return html;
}

function makeTimeOptionCheckClosedBranch(s,e,d)
{
	var html = "";
	var n;

	var dType = dateFormat($("#"+d).val(),'',0);
	var tab = $('input[name="quickReserveType"]:checked').val();
	
	for (var i=s; i <= e; i++)
	{
		if( tab == 'inland' && dType == closedStartDate && (closedStartTime.indexOf(addZero(i)) !== -1 )){continue};
		
		n = (i < 10) ? "0" + i: i;
		html +=  ("<option value=" + n + ">"  + n  + "시</option>");
	}
	return html;
}



/* 빠른예약버튼 활성화 여부*/
function submitable()
{
	var tab = $('input[name="quickReserveType"]:checked').val(); //jeju 또는 inland
	var returnDate = calendar._selectToDate; //반납일 (선택안하면 null)
	//var carTab = $("#carTab").val(); //차종(1~6. 선택안하면 '')
	var branchId = $("#branchId").val(); //지점(선택안하면 '')
	
	//제주는 날짜 + 차종 선택. 내륙은 날짜 + 차종 + 지점까지 선택
	if ((tab == 'jeju' && returnDate ) || (tab == 'inland' && returnDate && branchId != ''))
	{
		$("#btn_quick").removeClass("disable");
	}
	else
	{
		$("#btn_quick").addClass("disable");
	}
}

/* 빠른예약 탭 변경 시 비주얼 문구 변경 */
$(document).on('change', 'input[name="quickReserveType"]', function (e) {
	
	_isCalc = false;
	
	var $this = $(this),
			$spotHeading = $('.spot.short .heading'),
			$spotTitle = $spotHeading.find('.tit'),
			$spotDescription = $spotHeading.find('.descp');
	
	$('div.option .is-expanded').removeClass('is-expanded'); //열려있는 지점선택이 있으면 닫아준다
	
	if ($this.val() === 'jeju') {
		$spotTitle.text('즐거운 여행의 시작');
		$spotDescription.text('안전하고 즐거운 여행은 SK렌터카에서 시작됩니다.');
		
		$("#fc_jeju").show();
		$("#fc_inland").hide();
		
		$("#sHour").html(makeTimeOption(jejuResStartHourNumber,jejuResEndHourNumber));
		$("#lHour").html(makeTimeOption(jejuRtnStartHourNumber,jejuRtnEndHourNumber));
		
		$("#br1,#br2").text("제주/제주지점");
		$("#br1,#br2").addClass("is-disabled");

		$("#sDate").val("대여일 선택");
		$("#lDate").val("반납일 선택");
		resetDate();
		setHour(true, null, null, null, null);
		MinuteCheck();
		//calcTotalTime();	
		submitable();
		_isCalc = true;
	} else {
		//$("#inland-info-modal").show();
		//$(".dimd").css({display:"block"});
		
		$spotTitle.text('원하는 시간, 안전한 선택');
		$spotDescription.text('일상에서 누릴 수 있는 최고의 서비스는 SK렌터카에서 시작됩니다.');
		
		$("#fc_jeju").show();
		$("#fc_inland").hide();
		
		$("#br1").text(_br1_text);
		$("#br2").text(_br2_text);
		
		//$("#br1").removeClass("is-disabled");
		
		if ($("#branchId").val("") != "")
		{
			$("#branchId").val("");
			$("#branchId2").val("");
			$("#br1").text("지역/지점선택");
			$("#br2").text("지역/지점선택");
			$("#br1").removeClass("is-disabled");
		}

		$("#sDate").val("대여일 선택");
		$("#lDate").val("반납일 선택");
		resetDate();
		setHour(true, null, null, null, null);
		MinuteCheck();
		//calcTotalTime();	
		submitable();
		_isCalc = true;
		$("#dlRegion1 a:eq(0)").trigger('click');
	}
	
});

function setHour(hasTab,bran1SHour,bran1EHour,bran2SHour,bran2EHour){
	//24시간 이후라면 시간 초기화
	var revType = $("input[type=radio][name=quickReserveType]:checked").val();
	
    var sDate = dateFormat($("#sDate").val(),'',0);
	var lDate = dateFormat($("#lDate").val(),'',0);
	var tomorrow = dateFormat('','',1); //내일 날짜
	var hourFlag = false;	//24시간 이후라면 시간은 초기화 시킴
	
	var today = new Date();
	
	var today_yyyy = today.getFullYear();
	var today_mm = today.getMonth()+1;
	var today_dd = today.getDate();
	
	today_dd = addZero(today_dd);
	today_mm = addZero(today_mm);
	
	var today_date = today_yyyy +""+ today_mm +""+ today_dd;
	
	if(sDate >= tomorrow){
		hourFlag = true;
	}
	
	var todayStartHour = (revType == "jeju") ? jejuTodayStartHourNumber : inlandTodayStartHour;
	var startHour = (revType == "jeju") ? (bran1SHour == null ? jejuResStartHourNumber : parseInt(bran1SHour)) : (bran1SHour == null ? parseInt(inlandResStartHour) : parseInt(bran1SHour));
	var endHour = (revType == "jeju") ? (bran1EHour == null ? jejuResEndHourNumber : parseInt(bran1EHour)) : (bran1EHour == null ? parseInt(inlandResEndHour) : parseInt(bran1EHour));
	var lastStartHour = (revType == "jeju") ? (bran2SHour == null ? jejuRtnStartHourNumber : parseInt(bran2SHour)) : (bran2SHour == null ? parseInt(inlandRtnStartHour) : parseInt(bran2SHour));
	var lastEndHour = (revType == "jeju") ? (bran2EHour == null ? jejuRtnEndHourNumber : parseInt(bran2EHour)) : (bran2EHour == null ? parseInt(inlandRtnEndHour) : parseInt(bran2EHour));
	
	var possSHour=startHour;
	var possEHour=endHour;
	var possLastSHour=lastStartHour;
	var possLastEHour=lastEndHour;
	var nSHour = $("#sHour").val() == null ? $("#sHour option:first").val() : $("#sHour").val();
	var nLHour = $("#lHour").val() == null ? $("#lHour option:first").val() : $("#lHour").val();
	
	possSHour = s_hour;
	possEHour = parseInt(endHour);
	//possLastSHour = s_hour;
	
	var possSMin=s_min;
	
	if(revType == "jeju"){
		console.log("----- 대여일 시간 확인")
		console.log("현재시 : ", t_hour)
		console.log("영업 시작시 : ", startHour)
		console.log("영업 종료시 : ", endHour)
		console.log("예약 가능시 : ", s_hour)
		console.log("예약 가능시+1 : ", s_hour+1)
		console.log("예약 가능시+2 : ", s_hour+2)
		console.log("-----------------------")
		
		var nSHour = ($("#sHour").val() == null ? sHour : $("#sHour").val());
		
		var nSHour = ($("#sHour").val() == null ? sHour : $("#sHour").val());
		
		var currentDate = new Date();
		var checkDate = currentDate;
		checkDate.setDate(parseInt(today_dd)+1);
	    var check_yyyy = checkDate.getFullYear();
	    var check_mm = checkDate.getMonth()+1;
	    var check_dd = checkDate.getDate();
	    
	    var check_yyyy = checkDate.getFullYear();
	    var check_mm = checkDate.getMonth()+1;
	    var check_dd = checkDate.getDate();
	    checkDate = check_yyyy +""+ addZero(check_mm) +""+ addZero(check_dd);

		if(sDate == checkDate){
			// 명일예약시
			//console.log("----- 명일 예약시")
			if(t_hour == endHour-3 && t_min < 30){
				possSHour = Number(startHour)+1;
				s_min = "00";
			}else if(t_hour == endHour-3 && t_min > 30){
				possSHour = Number(startHour)+1;
				s_min = "30";
			}else if(t_hour == endHour-2 && t_min < 30){
				possSHour = Number(startHour)+2;
				s_min = "00";
			}else if(t_hour == endHour-2 && t_min > 30){
				possSHour = Number(startHour)+2;
				s_min = "30";
			}else if(t_hour == endHour-1  && t_min < 30){
				possSHour = Number(startHour)+3;
				s_min = "00";
			}else if(t_hour == endHour-1  && t_min > 30){
				possSHour = Number(startHour)+3;
				s_min = "30";
			}else if(t_hour >= endHour ){
				possSHour = Number(startHour)+3;
				s_min = "30";
			}else{
				possSHour = startHour;
			}
		}else if(sDate == today_date){
			// 금일예약시
			//console.log("----- 금일 예약시")
			if(t_hour < Number(startHour) ){
				possSHour = Number(startHour)+3;
				s_min = "30";
			}else{
				possSHour = s_hour;
			}
		}else{
			//금일 명일이 아닐시
			possSHour = startHour;
			/*
			if(s_hour > eHour || (s_hour == eHour && s_min == 30) || s_hour < eHour || (s_min == 0)){ //20181204 대여가능시간 변경 
				possSHour = sHour;
				possSMin = 30;
			}
			*/
		}
		console.log("예약시작 시간 : ", possSHour);
		
		//영업시간 설정
		possSHour > endHour ? possSHour = startHour : possSHour;
		
		$("#sHour").html(makeTimeOption(possSHour,endHour));					// 대여시간 설정
		$("#lHour").html(makeTimeOption(possLastSHour,possLastEHour));	// 반납시간 설정
		
		$("#sHour").val(addZero(possSHour));
		$("#lHour").val(addZero(possLastSHour));
		
		
		//if((sDate == today_date) || (sDate == tomorrow && (s_hour > endHour || (s_hour == endHour && s_min == 30)))){//영업시간 이후
		/*
		if(sDate == today_date){
			possSHour >= 23 ? possSHour = startHour : possSHour;
			$("#sHour").html(makeTimeOption(possSHour,endHour));					// 대여시간 설정
			$("#lHour").html(makeTimeOption(possLastSHour,possLastEHour));	// 반납시간 설정
			console.log("111111 : ", possSHour);
			console.log("111111 : ", endHour);
			
			if($("#sDate").val() == "" && $("#lDate").val() == "" ){
				console.log("BBB2 : ", possSHour, possLastSHour);				
				$("#sHour").val(addZero(possSHour));
				$("#lHour").val(addZero(possLastSHour));
				
				if(possSMin == 0){
					$("#sMinute").val("00").trigger('change');
					$("#lMinute").val("00").trigger('change');
				}else{
					$("#sMinute").val("30").trigger('change');
					$("#lMinute").val("30").trigger('change');
				}
			} else {
				//대여일 시간 고정
				if(parseInt(possSHour) <= parseInt(nSHour) && parseInt(nSHour) <= parseInt(endHour)) {
					console.log("RES ---------- FFFFF1 : ", nSHour);
					$("#sHour").val(nSHour);	
				}
				
				//반납일 시간 고정
				if(parseInt(jejuRtnStartHourNumber) <= parseInt(nLHour) && parseInt(nLHour) <= parseInt(jejuRtnEndHourNumber)) {
					console.log("RTN ---------- FFFFF1 : ", nSHour);
					$("#lHour").val(nLHour);	
				}	
			}
		}else if(sDate == parseInt(today_date)+1){//대여일이 명일
			console.log("---11 대여일 내일");
			if( s_hour > endHour ){
				console.log("---11 대여일 내일 영업시간 외");
				$("#sHour").html(makeTimeOption(possSHour,endHour));					// 대여시간 설정
				$("#lHour").html(makeTimeOption(possLastSHour,possLastEHour));	// 반납시간 설정
			}else{
				console.log("---11 대여일 내일 영업시간 내");
				$("#sHour").html(makeTimeOption(startHour,endHour));					// 대여시간 설정
				$("#lHour").html(makeTimeOption(possLastSHour,possLastEHour));	// 반납시간 설정
			}
			
			if($("#sDate").val() == "" && $("#lDate").val() == "" ){
				//console.log("BBB2 : ", possSHour, possLastSHour);				
				$("#sHour").val(addZero(possSHour));
				$("#lHour").val(addZero(possLastSHour));
				
				if(possSMin == 0){
					$("#sMinute").val("00").trigger('change');
					$("#lMinute").val("00").trigger('change');
				}else{
					$("#sMinute").val("30").trigger('change');
					$("#lMinute").val("30").trigger('change');
				}
			} else {
				//대여일 시간 고정
				if(parseInt(possSHour) <= parseInt(nSHour) && parseInt(nSHour) <= parseInt(endHour)) {
					console.log("RES ---------- FFFFF1 : ", nSHour);
					$("#sHour").val(nSHour);	
				}
				
				//반납일 시간 고정
				if(parseInt(jejuRtnStartHourNumber) <= parseInt(nLHour) && parseInt(nLHour) <= parseInt(jejuRtnEndHourNumber)) {
					console.log("RTN ---------- FFFFF1 : ", nSHour);
					$("#lHour").val(nLHour);	
				}	
			}
			
		}else if(hourFlag){
			
			$("#sHour").html(makeTimeOption(startHour, endHour));
			$("#lHour").html(makeTimeOption(lastStartHour, lastEndHour));
			
			//대여일 및 반납일 시간 고정
			if(Number($("#sHour option:last").val()) < nSHour ){
				nSHour = $("#sHour option:last").val();
			}
			if(Number($("#lHour option:last").val()) < nLHour ){
				nLHour = $("#lHour option:last").val();
			}
			
			if(Number($("#sHour option:first").val()) > nSHour){
				nSHour = $("#sHour option:first").val();
			}
			if(Number($("#lHour option:first").val()) > nLHour ){
				nLHour = $("#lHour option:first").val();
			}
			
			$("#sHour").val(nSHour);	
			$("#lHour").val(nLHour);	
		}
		*/
	}else{
		console.log("AAAAAAAAAAAAAAAAAAAAAAAAaa");
		var cHour = today.getHours();
		var cMin = today.getMinutes();
		
		if( cHour >= startHour && cHour <= endHour){
			var nDate = today;
			nDate.setHours(nDate.getHours()+24);
			
			possSHour = nDate.getHours();
			possLastSHour = nDate.getHours();
			
			if(cHour == (endHour-1) && cMin >= 30) {
				possSHour = startHour;
				possLastSHour = startHour;
			}
		} else {
			possSHour = startHour;
			possLastSHour = startHour;
		}
		
		var nShour = $("#sHour").val();
		var nLhour = $("#lHour").val();
		var sShour = "0";
		var eShour = "0";
		var sLhour = "0";
		var eLhour = "0";
		
		console.log("CCCCCCC : ", sDate);
		console.log("CCCCCCC : ", lDate);
		
		console.log("CCCCCCC : ", possEHour);
		console.log("CCCCCCC : ", endHour);
		console.log("CCCCCCC : ", possLastEHour);
		console.log("CCCCCCC : ", lastEndHour);
		
		console.log("DDDDDDD : ", possEHour);
		console.log("DDDDDDD : ", endHour);
		console.log("DDDDDDD : ", possLastEHour);
		console.log("DDDDDDD : ", lastEndHour);
		
		if(sDate == tomorrow || sDate == today_date){
			$("#sHour").html(makeTimeOptionCheckClosedBranch(possSHour,possEHour,"sDate"));
			$("#lHour").html(makeTimeOptionCheckClosedBranch(startHour,possLastEHour,"lDate"));
			$("#lHour").val(addZero(possSHour));
			sShour = possSHour;
			eShour = possEHour;
			sLhour = startHour;
			eLhour = possLastEHour;
		}else{
			$("#sHour").html(makeTimeOptionCheckClosedBranch(startHour,endHour,"sDate"));
			$("#lHour").html(makeTimeOptionCheckClosedBranch(lastStartHour,lastEndHour,"lDate"));
			sShour = startHour;
			eShour = endHour;
			sLhour = lastStartHour;
			eLhour = lastEndHour;
			
			if($('#branchId').val() == "100114" && (sDate == "20210211" || sDate == "20210213") ){
				$('#sHour option[value="'+addZero(endHour)+'"]').prop('selected',true);
				$('#lHour option[value="'+addZero(lastEndHour)+'"]').prop('selected',true);
			}
			if($('#branchId').val() == "100114" && (lDate == "20210211" || lDate == "20210213") ){
				$('#sHour option[value="'+addZero(endHour)+'"]').prop('selected',true);
				$('#lHour option[value="'+addZero(lastEndHour)+'"]').prop('selected',true);
			}
		}
		
		if($("#branchId").val() != "") {
			if(parseInt(sShour) <= parseInt(nShour) && parseInt(nShour) <= parseInt(eShour)) {
				$("#sHour").val(nShour);	
			}
			
			if(parseInt(sLhour) <= parseInt(nLhour) && parseInt(nLhour) <= parseInt(eLhour)) {
				$("#lHour").val(nLhour);	
			}
		} else {
			$("#sMinute").val("00");
			$("#lMinute").val("00").trigger('change');	
		}
	}
}

function addZero(v){
	return parseInt(v)<10?"0"+""+parseInt(v):v;
}


//20181114 김주현
function MinuteCheck(){
	var possSHour=addZero(s_hour);

    var chekStartHour = "0"; 
    var chekLastHour = "0"; //20171228 대여가능시간 변경
	var revType = $("input[type=radio][name=quickReserveType]:checked").val();
    var sDate = dateFormat($("#sDate").val(),'',0);
    var lDate = dateFormat($("#lDate").val(),'',0);
	var tomorrow = dateFormat('','',1);
	
	if(revType == "inland") {
		chekStartHour = inlandResStartHour;
		chekLastHour = inlandResEndHour ;
		for(var i=0;i<3;i++){
			if(sDate == tomorrow && s_hour == 19+i && s_min == 30){
				possSHour = 9+i;
				possSHour=addZero(possSHour);
			}
		}
	}else if(revType == "jeju"){
		//chekStartHour = "21";
		//chekLastHour = "20" ;
		chekStartHour = jejuResEndHour;
		chekLastHour = jejuRtnEndHour;
		
		for(var i=0;i<3;i++){
			if(sDate == tomorrow && s_hour == jejuResEndHourNumber+i && s_min == 30){
				possSHour = jejuResStartHourNumber+i;
				possSHour=addZero(possSHour);
			}
		}
	}
	
	//분 설정
	if(revType == "jeju") {
		setJejuTime("sDate");
		setJejuTime("lDate");
	} else {
		setInlandTime("sDate");
		setInlandTime("lDate");
	}

	calcTotalTime();
}

function getJejuPossTime(){ //제주 예약 가능한 시간 가져오기
	var sDate = $("#sDate").val(); //yyyy-mm-dd
	var lDate = $("#lDate").val(); //yyyy-mm-dd
	var sVal = "000012";
	var sVal2 = "000012";

	if($("#sDate").val()!= null && $("#sDate").val()!="") sDate = dateFormat($('#sDate').val(),'',0);
	if($("#lDate").val()!= null && $("#lDate").val()!="") lDate = dateFormat($('#lDate').val(),'',0);
	console.log("getInlandPossTime():sDate="+sDate);
	console.log("getInlandPossTime():lDate="+lDate);
	console.log("getInlandPossTime():sVal="+sVal);
	console.log("getInlandPossTime():sVal2="+sVal2);
	
	if(sDate!=''){
		if(sVal!=''){
			$.ajax({
				type : "post",
				url : "/rent/rentcar/getPossSHour.json",
				data : {'branchId': sVal
						,'branchId2': sVal2
						,'carType' : $('#carTypeName').val()
						,'sDate' : sDate
						,'lDate' : lDate},
				dataType : "json",
				success : function(data) {
					var timeList = data.timeList;
					
					jejuResStartHour = timeList.stHh;
					jejuResStartHourNumber =timeList.stHh;
					jejuResStartMin = timeList.stMi;
					jejuResEndHour = timeList.edHh;
					jejuResEndHourNumber = timeList.edHh;
					jejuResEndMin = timeList.edMi;
														
					if(holiyDayMsg(timeList.stHh, timeList.stMi, timeList.edHh, timeList.edMi, sDate, "sDate")){
						setHour(null, "07", "22", "06", "21");
						return;
					}

					if(sVal2 != ''){
						$.ajax({
							type : "post",
							url : "/rent/rentcar/getPossLHour.json",
							data : {'branchId': sVal
									,'branchId2': sVal2
									,'carType' : $('#carTypeName').val()
									,'sDate' : sDate
									,'lDate' : lDate},
							dataType : "json",
							success : function(data) {
								var lTimeList = data.LtimeList;
								var sHour = $("#sHour").val();
								var sMin = $("#sMinute").val();
								var lHour = $("#lHour").val();
								var lMin = $("#lMinute").val();
								
								jejuRtnStartHour = lTimeList.lStHh;
								jejuRtnStartHourNumber = lTimeList.lStHh;
								jejuRtnStartMin = lTimeList.lStMi;
								jejuRtnEndHour = lTimeList.lEdHh;
								jejuRtnEndHourNumber = lTimeList.lEdHh;
								jejuRtnEndMin = lTimeList.lEdMi;
								
								if(holiyDayMsg(lTimeList.lStHh, lTimeList.lStMi,  lTimeList.lEdHh, lTimeList.lEdMi, lDate, "lDate")){
									setHour(null, "07", "22", "06", "21");
								}else{
									setHour(null, timeList.stHh, timeList.edHh, lTimeList.lStHh, lTimeList.lEdHh);
									MinuteCheck();
								}
								
							},
							error : function(){
								
								alert('데이터 통신이 실패했습니다.\n잠시 후 다시 시도하세요.');
							} 
						});	
					}
				},
				error : function(){
					alert('데이터 통신이 실패했습니다.\n잠시 후 다시 시도하세요.');
				} 
			});	
		}else{
			setHour(true, null, null, null, null);
			MinuteCheck();
	 	}
	}
}

function getInlandPossTime(){ //내륙 예약 가능한 시간 가져오기
	var sDate = $("#sDate").val(); //yyyy-mm-dd
	var lDate = $("#lDate").val(); //yyyy-mm-dd
	var sVal = $('#branchId').val();
	var sVal2 = $('#branchId2').val();

	if($("#sDate").val()!= null && $("#sDate").val()!="") sDate = dateFormat($('#sDate').val(),'',0);
	if($("#lDate").val()!= null && $("#lDate").val()!="") lDate = dateFormat($('#lDate').val(),'',0);
	console.log("getInlandPossTime():sDate="+sDate);
	console.log("getInlandPossTime():lDate="+lDate);
	console.log("getInlandPossTime():sVal="+sVal);
	console.log("getInlandPossTime():sVal2="+sVal2);
	
	if(sDate!=''){
		if(sVal!=''){
			$.ajax({
				type : "post",
				url : "/rent/rentcar/getPossSHour.json",
				data : {'branchId': sVal
						,'branchId2': sVal2
						,'carType' : $('#carTypeName').val()
						,'sDate' : sDate
						,'lDate' : lDate},
				dataType : "json",
				success : function(data) {
					var timeList = data.timeList;
					
					inlandResStartHour = timeList.stHh;
					inlandResStartMin = timeList.stMi;
					inlandResEndHour = timeList.edHh;
					inlandResEndMin = timeList.edMi;
					
					if(holiyDayMsg(timeList.stHh, timeList.stMi, timeList.edHh, timeList.edMi, sDate, "sDate")){
						setHour(null, "09", "19", "09", "19");
						return;
					}

					if(sVal2 != ''){
						$.ajax({
							type : "post",
							url : "/rent/rentcar/getPossLHour.json",
							data : {'branchId': sVal
									,'branchId2': sVal2
									,'carType' : $('#carTypeName').val()
									,'sDate' : sDate
									,'lDate' : lDate},
							dataType : "json",
							success : function(data) {
								var lTimeList = data.LtimeList;
								var sHour = $("#sHour").val();
								var sMin = $("#sMinute").val();
								var lHour = $("#lHour").val();
								var lMin = $("#lMinute").val();
								
								inlandRtnStartHour = lTimeList.lStHh;
								inlandRtnStartMin = lTimeList.lStMi;
								inlandRtnEndHour = lTimeList.lEdHh;
								inlandRtnEndMin = lTimeList.lEdMi;
								
								if(holiyDayMsg(lTimeList.lStHh, lTimeList.lStMi,  lTimeList.lEdHh, lTimeList.lEdMi, lDate, "lDate")){
									setHour(null, "09", "19", "09", "19");
								}else{
									setHour(null, timeList.stHh, timeList.edHh, lTimeList.lStHh, lTimeList.lEdHh);
									MinuteCheck();
								}
								
								getBranchList($("#cdId").val());
							},
							error : function(){
								
								alert('데이터 통신이 실패했습니다.\n잠시 후 다시 시도하세요.');
							} 
						});	
					}
				},
				error : function(){
					alert('데이터 통신이 실패했습니다.\n잠시 후 다시 시도하세요.');
				} 
			});	
		}else{
			setHour(true, null, null, null, null);
			MinuteCheck();
	 	}
	}
}

function setJejuTime(gubun){
	var pHours        = (gubun == "sDate" ? $('#sHour').val() : $('#lHour').val());
	var pMin          = (gubun == "sDate" ? $('#sMinute').val() : $('#lMinute').val());
	var this_childern = (gubun == "sDate" ? "sMinute" : "lMinute");
	
	var time_option = "";
	var this_childern;
	var aMin; 
	if(gubun == "sDate"){
		aMin = $("#sMinute").val();
		this_childern = "sMinute";
	}else if(gubun == "lDate"){
		aMin = $("#lMinute").val();
		this_childern = "lMinute";
		//if($.trim($("#reservMenu .selected").text()) == "제주예약") startLastHour = startLastHour -1;
		if($.trim($("#reservMenu .selected").text()) == "제주예약") startLastHour = startLastHour;
	}
	
	if(gubun == "sDate"){
		if( $("#sHour").val() == jejuResStartHour && jejuResStartMin == 30 ){
			console.log("setTime 접근33333 ST ----- 11111");
			time_option += '<option value="30" selected="selected">30분</option>';
			
			$("#"+this_childern).html(time_option);
		}else if( $("#sHour").val() == jejuResEndHour && jejuResEndMin != 30 ){
			console.log("setTime 접근33333 ST ----- 22222");
			time_option += '<option value="00" selected="selected">00분</option>';
			
			$("#"+this_childern).html(time_option);
		}else{
			console.log("setTime 접근33333 ST ----- 33333");
			if($("#sHour").val() == $("#sHour option:first").val() && s_min == 30){
                time_option += '<option value="30" selected="selected">30분</option>';
			}else{
				for(var i = 0; i<=30; i+=30){
					var tmp = i<10?"0"+i:i;
					time_option += '<option value="'+tmp+'" '+(aMin==tmp?'selected="selected"':'')+'>';
					time_option += tmp + '분</option>\n';
				}
			}
			
			$("#"+this_childern).html(time_option);
		}
	}else{
		if( $("#lHour").val() == jejuRtnStartHour && jejuRtnStartMin == 30 ){
			console.log("setTime 접근33333 LT ----- 11111");
			time_option += '<option value="30" selected="selected">30분</option>';
			
			$("#"+this_childern).html(time_option);
		}else if( $("#lHour").val() == jejuRtnEndHour && jejuRtnEndMin != 30 ){
			console.log("setTime 접근33333 LT ----- 22222");
			time_option += '<option value="00" selected="selected">00분</option>';
			
			$("#"+this_childern).html(time_option);
		}else{
			console.log("setTime 접근33333 LT ----- 33333");
			for(var i = 0; i<=30; i+=30){
				var tmp = i<10?"0"+i:i;
				time_option += '<option value="'+tmp+'" '+(aMin==tmp?'selected="selected"':'')+'>';
				time_option += tmp + '분</option>\n';
			}
			
			$("#"+this_childern).html(time_option);
		}
	}
}

function setInlandTime(gubun){
	var pHours        = (gubun == "sDate" ? $('#sHour').val() : $('#lHour').val());
	var pMin          = (gubun == "sDate" ? $('#sMinute').val() : $('#lMinute').val());
	var this_childern = (gubun == "sDate" ? "sMinute" : "lMinute");
	
	var time_option = "";
	var this_childern;
	var aMin; 
	if(gubun == "sDate"){
		aMin = $("#sMinute").val();
		this_childern = "sMinute";
	}else if(gubun == "lDate"){
		aMin = $("#lMinute").val();
		this_childern = "lMinute";
	}
	
	if(gubun == "sDate"){
		if( $("#sHour").val() == inlandResStartHour && inlandResStartMin == 30 ){
			console.log("setTime 접근33333 ST ----- 11111");
			time_option += '<option value="30" selected="selected">30분</option>';
			
			$("#"+this_childern).html(time_option);
		}else if( $("#sHour").val() == inlandResEndHour && (inlandResEndMin != 30 && inlandResEndMin < 30) ){
			console.log("setTime 접근33333 ST ----- 22222");
			time_option += '<option value="00" selected="selected">00분</option>';
			
			$("#"+this_childern).html(time_option);
		}else{
			console.log("setTime 접근33333 ST ----- 33333");
			for(var i = 0; i<=30; i+=30){
				var tmp = i<10?"0"+i:i;
				time_option += '<option value="'+tmp+'" '+(aMin==tmp?'selected="selected"':'')+'>';
				time_option += tmp + '분</option>\n';
			}
			
			$("#"+this_childern).html(time_option);
		}
	}else{
		if( $("#lHour").val() == inlandRtnStartHour && inlandRtnStartMin == 30 ){
			console.log("setTime 접근33333 LT ----- 11111");
			time_option += '<option value="30" selected="selected">30분</option>';
			
			$("#"+this_childern).html(time_option);
		}else if( $("#lHour").val() == inlandRtnEndHour && (inlandRtnEndMin != 30 && inlandRtnEndMin < 30) ){
			console.log("setTime 접근33333 LT ----- 22222");
			time_option += '<option value="00" selected="selected">00분</option>';
			
			$("#"+this_childern).html(time_option);
		}else{
			console.log("setTime 접근33333 LT ----- 33333");
			for(var i = 0; i<=30; i+=30){
				var tmp = i<10?"0"+i:i;
				time_option += '<option value="'+tmp+'" '+(aMin==tmp?'selected="selected"':'')+'>';
				time_option += tmp + '분</option>\n';
			}
			
			$("#"+this_childern).html(time_option);
		}
	}
}

function holiyDayMsg(stHH, stMI, edHH, edMI, holyDay, dateType){
	var msg = "";
	dateType == "sDate" ? msg = "대여일" : msg = "반납일";
	
	if(stHH == "00" && stMI == "00" && edHH == "00" && edMI == "00"){
		alert("선택하신 지점의 "+msg+"("+ holyDay.substr(0,4) + "년 " + holyDay.substr(4,2) + "월 " + holyDay.substr(6,8) + "일)은 휴무일 입니다." );
		resetDate();
		
		$("#btn_quick").addClass("disable");
		return true;
	}
}