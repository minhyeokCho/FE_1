var hasCheckCar = false;
var hasNext = false;
var hasCDVal = 0;
var hasResInfo = false; //정보 다 입력했는지 여부
var hasResChange = false; //예약 확인을 위한 필수정보 변경 유무
var hasFirst = true;	//첫 예약 확인 모달여부
var hasLcnOk = false;	//라이센스 정상 여부
var lcnInputMode = "u"; //운전면허증 입력 모드  c: 카메라, u:직접입력

var jejuStartHour = "07"; 				// 제주 예약 및 반납  시작시간
var jejuStartHourNumber = 7; 		// 제주 예약 및 반납  시작시간
var jejuResEndHour = "22"; 			// 제주 예약 종료시간
var jejuResEndHourNumber = 22; 	// 제주 예약 종료시간

var jejuRtnStartHour = "06"; 				// 제주 예약 및 반납  시작시간
var jejuRtnStartHourNumber = 6; 		// 제주 예약 및 반납  시작시간
var jejuRtnEndHour = "21"; 			// 제주 반납 종료시간
var jejuRtnEndHourNumber = 21; 	// 제주 반납 종료시간
var jejuTodayStartHour = "08";			// 제주 현재일 예약 시작시간
var jejuTodayStartHourNumber = 8;	// 제주 현재일 예약 시작시간


var currentDate = new Date();
var current_year = currentDate.getFullYear();			//현재 연도
var current_month = currentDate.getMonth() + 1;		//현재 월
var current_day = currentDate.getDate();				//현재 일
var current_date = current_year + "" + addZero(current_month) + "" + addZero(current_day);
var t_hour = currentDate.getHours();//현재 시간
var t_min = currentDate.getMinutes();//현재 분
var s_hour = currentDate.getHours();//현재 시간으로 예약가능시
var s_min = currentDate.getMinutes();//현재 시간으로 예약가능분

var today_yyyy = currentDate.getFullYear();
var today_mm = currentDate.getMonth()+1;
var today_dd = currentDate.getDate();

today_dd = addZero(today_dd);
today_mm = addZero(today_mm);

var today_date = today_yyyy +""+ today_mm +""+ today_dd;
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
									message: $('#mob_rnt_loading'), 
									css: {        
										background : 'none',
						                border: 'none'
									 } 
								})
						}
				);  
	$(document).ajaxStop($.unblockUI);
	
	$(".onlyKor").keyup(function(event){
		var regexp = /[a-z0-9]|[ \[\]{}()<>?|`~!@#$%^&*-_+=,.;:\"'\\]/g;
		var v = $(this).val();
		if( regexp.test(v) ) {
			$(this).val(v.replace(regexp,''));
		}
	 });
	$(".onlyKorEng").keyup(function(event){
		//var regexp = /[0-9]|[ \[\]{}()<>?|`~!@#$%^&*-_+=,.;:\"'\\]/g;
		var exgexp = /[^(ㄱ-힣a-zA-Z|\u318D\u119E\u11A2\u2022\u2025a\u00B7\uFE55)]/gi;
		var v = $(this).val();
		$(this).val(v.replace(exgexp,''));
	 });
	
	$(".onlyKorNumber").keyup(function(event){
		var regexp = /[a-z]|[ \[\]{}()<>?|`~!@#$%^&\*\-\_+=,.;:\"'\\]/g;
		var v = $(this).val();
		if( regexp.test(v) ) {
			$(this).val(v.replace(regexp,''));
		}
	 });
	//기간/지점선택, 차량선택, 차량손해면책제도 
	
	//rentDateTime1, rentDateTime2, branchId, branchId2
	

	$(".modal-close").click(function(){
		$(".mevent-pop").hide();
		$("body").removeClass("no-scroll");	});     
	
	//시간 변경시 확인버튼 제어
	$("#selectRentTime1").change(function(e){  // 
		e.preventDefault();
		$("#btn_confirm_date").removeClass('disabled');
		
		if($('#rsvMode').val() == "inland"){
			setInlandBranch(null, null, null, null);			
		}
	});
	
	$("#selectRentTime2").change(function(e){  // 
		e.preventDefault();
		$("#btn_confirm_date").removeClass('disabled');
		
		if($('#rsvMode').val() == "inland"){
			setInlandBranch(null, null, null, null);			
		}
	});
});

function shtEvnt(evntSeqNo){
	$.ajax({
		type : "post",
		url : "/rent/rentcar/getShtEvntDetail.json",
		data : {
			'evntSeqNo' :evntSeqNo
			},
		dataType : "json",
		success : function(data) {

			$(".mevent-pop").show();
			$("body").addClass("no-scroll");
    		$(".eventpop_box").html("<img src='/rent/imageviewer.do?GBN=moblEvntSht&SQ="+evntSeqNo+"' alt='이벤트 이미지'>");
    		eventChange(evntSeqNo);
		}
	});
}

//이벤트 수정
function eventChange(seqNo){
	// SK렌터카 통합 기념 제주 최대 85% 할인 이벤트
	if(seqNo == "10269"){
		$(".eventpop_box").html("<a href='#' onclick='copyCpn();'><img src='/rent/imageviewer.do?GBN=evntSht&SQ="+seqNo+"' alt='이벤트 이미지'></a>");
	}
}

// 이벤트 쿠폰번호 복사
function copyCpn(){
	var copyText = "SG10173772";
	var aux = document.createElement("input");
	aux.setAttribute("value", copyText );
	document.body.appendChild(aux);
	aux.select();
	document.execCommand("copy");
	document.body.removeChild(aux);
	alert("복사되었습니다.");
}

function openBranch(cls){
	var branchId = (cls == 1)? $("#branchId").val() : $("#branchId2").val();
	if(branchId != null && branchId != "") viewBranch(branchId);
	return false;
}

function setShortParams(){//단기 메인에서 받아온 변수 셋팅
	console.log("setShortParams"+$("#params_branchId").val()+"/"+$("#params_branchId2").val());
	var pSDate = $("#params_sDate").val();
	var pLDate = $("#params_lDate").val();
	var pSHour = $("#params_sHour").val();
	var pLHour = $("#params_lHour").val();
	var pSMinute = $("#params_sMinute").val();
	var pLMinute = $("#params_lMinute").val();
	
	
	var pCdId = $("#params_cdId").val();
	var pCdId2 = $("#params_cdId2").val();
	var pBranchId = $("#params_branchId").val()
	var pBranchId2 = $("#params_branchId2").val();
		
	var sDate = dateFormat($("#params_sDate").val(),'',0);
	var lDate = dateFormat($("#params_lDate").val(),'',0);
	
	var TMP_SDATE = sDate + pSHour + pSMinute;
	var SDATE = TMP_SDATE.length==12?TMP_SDATE:"";
	
	var TMP_LDATE = lDate + pLHour + pLMinute;
	var LDATE = TMP_LDATE.length==12?TMP_LDATE:"";
	
	var sHourMinute = pSHour + pSMinute;
	var lHourMinute = pLHour + pLMinute;
	
	$("#rentDateTime1").val(TMP_SDATE);
	$("#rentDateTime2").val(TMP_LDATE);
	
	$('#branchId').val(pBranchId);
	$('#branchId2').val(pBranchId2);
	
	calendar.resetDate(sDate, lDate);
	
	if ($("#rsvMode").val() == 'inland') // 내륙 예약이면
	{
		$("#select_area1").val(pCdId);
		$("#select_area2").val(pCdId2);
		getInlandPossTime("branch1", pBranchId, pSHour + pSMinute, pLHour + pLMinute);
		getInlandPossTime("branch2", pBranchId2, pSHour + pSMinute, pLHour + pLMinute);
		setInlandBranch(sDate, pSHour + pSMinute, lDate, pLHour + pLMinute);
	}else if($("#rsvMode").val() == 'jeju'){
		console.log("SSSSSSSSSSSSSSSSSSSSSSSS")
		$("#select_area1").val(pCdId);
		$("#select_area2").val(pCdId2);
		setJejuResTime("branch1", pBranchId, pSHour + pSMinute, pLHour + pLMinute);
		setJejuRtnTime("branch2", pBranchId2, pSHour + pSMinute, pLHour + pLMinute);
		console.log("EEEEEEEEEEEEEEEEEEEEEEEEEEEEe")
	}
	console.log("GG ------ : ", pSHour + pSMinute)
	console.log("GG ------ : ", pLHour + pLMinute)
	$("#selectRentTime1").val(pSHour + pSMinute);
	$("#selectRentTime2").val(pLHour + pLMinute);
	$("#select_branch1").val(pBranchId);
	$("#select_branch2").val(pBranchId2);
	
	if (pCdId == '692001')
	{
		$("#select_branch2").prop('disabled',false);
	}
	
	//////////////////////////////////////////////////
	calendar_store_data();
	
	var br1, br2;
	
	if ($("#rsvMode").val() == 'jeju') // 제주 예약이면
	{
		br1 = "제주 / 제주지점";
		br2 = "제주 / 제주지점";
	}
	else // 내륙예약이면
	{		
		var $option1 = $('#select_branch1 option:selected');
		var $option2 = $('#select_branch2 option:selected');		
		br1 = $option1.data("aname") + " / " +$option1.data("bname");
		br2 = $option2.data("aname") + " / " +$option2.data("bname");
	}
	
	var alt1 = $("#altField1").val();
	var alt2 = $("#altField2").val();
	
	var dt1 = "";
	var dt2 = "";
	
	// 기간/지점선택 section
	if ($("#rsvMode").val() == 'inland') // 내륙 예약이면
	{
		dt1= alt1 + " " + pSHour + "시 " + pSMinute + "분";
		dt2= alt2 + " " + pLHour + "시 " + pLMinute + "분";
	} else {
		dt1= alt1 + " " + pSHour + "시 " + pSMinute + "분";
		dt2= alt2 + " " + pLHour + "시 " + pLMinute + "분";
	}
	console.log("AAAAAAAAA ----------1 : ", dt1, br1)
	console.log("AAAAAAAAA ----------2 : ", dt2, br2)
	$("#span_date_br1").html(dt1 + "<br>" + br1);
	$("#span_date_br2").html(dt2 + "<br>" + br2);
	$("#span_date_br2").parent().parent().removeClass("readonly");

	br1 = br1.split('/')[1];
	br2 = br2.split('/')[1];		

	// 티커
	$("#rentDate").text(dt1);
	$("#returnDate").text(dt2);
	$("#rentBranch").text(br1);
	$("#returnBranch").text(br2);
	
	// 예약정보확인
	$("#cfm_rentDate").text(dt1);
	$("#cfm_returnDate").text(dt2);
	$("#cfm_rentBranch").text(br1);
	$("#cfm_returnBranch").text(br2);
	
	//총 대여시간 계산
	var diffDate = calcTotalTime();
	
	// 날짜 선택 경고 제거
	$("#alert-date").removeClass("alert-msg");
	$("#msg-date").html("");
	
	//console.log("ldwAbleCheck --- 차량손해면책제도 활성화 체크");
	
	//가용차정 체크 후 차량손해면책제도 활성화 체크하도록 변경
	
	var dt1 = $("#rentDateTime1").val();
	var dt2 = $("#rentDateTime2").val();

	var BRANCH_ID = $('#branchId').val();
	
	var SLS_BRANCH_CD = getSlsBranchCd($('#branchId').val());
	if(SLS_BRANCH_CD!=''){
		var tmp = SLS_BRANCH_CD;
		SLS_BRANCH_CD = BRANCH_ID;
		BRANCH_ID = tmp;
	}
	
	var ldwRtCd ="428009"; 
	if($('#ldwId').val() != null && $('#ldwId').val() !="") ldwRtCd =$('#ldwId').val();
	
	$.ajax({
		type : "post",
		url : "/rent/rentcar/getCar.json",
		data : {
			'carType':"",
			'branchId': BRANCH_ID
			, 'sDate' : dt1
			, 'lDate' : dt2
			, 'slsBranchCd':SLS_BRANCH_CD 
			, 'dcCardId' : $("#dcCardId").val()
			, 'pLdwRtCd'     : ldwRtCd},
		dataType : "json",
		success : function(data) {
			console.log("getCar() getCar.json");
			var list = data.carList;
			var RSV_PSBL_CNT;
			
			var htmlStr= ["","","","","","","","","",""];
			var str, str2;
			var flag = false;
			
			var $rentCarList = $("div.rent-car-list");
			//var nullCarCheck = "";

			if(list != null && list.length > 0){
				for(var i = 0; i<list.length; i++){
					
					var item = list[i];
					
					if(item.rsvPsblCnt!=null){
						RSV_PSBL_CNT = item.rsvPsblCnt;
					}else{
						RSV_PSBL_CNT = item.carCnt=='예약완료'?"0":item.carCnt;	
					}
					
					flag = parseInt(RSV_PSBL_CNT)==0?true:false;
					
					var cd = item.carShtRsvClsCd;
					var type;
					switch(cd){
					case "232001":type = 1;break;	// 경차
					case "232002":type = 2;break;	// 소형
					case "232003":type = 3;break;	// 중형
					case "232004":						// 대형
					case "232006":type = 4;break;	// 특대형
					case "232005":type = 5;break;	// 승합
					case "232007":						// 소형RV
					case "232008":type = 6;break;	// 중형RV
					case "232009":type = 7;break;	// 수입
					case "232010":						// EV
					case "232011":type = 8;break;	// EV수입
					}
					
					var fuelCd = list[i].fuelCd;
					var cartypeDtlNm = list[i].cartypeDtlNm;
					var carShtRsvClsCd = list[i].carShtRsvClsCd;
					
					cartypeDtlNm!=null?cartypeDtlNm:"";
					if((fuelCd == "210007" || cartypeDtlNm.indexOf('전기차') > 0) && cartypeDtlNm.indexOf('TESLA') < 0){
						type = 8;
					}
					if(cartypeDtlNm.indexOf('캠핑') > 0){						
						str2 = setCarList(flag, item.origCartypeDtlId, item.cartypeDtlId, 9, item.cartypeDtlNm, cd);
						htmlStr[9] += str2; //개별탭에 추가
					}
					
					//flag가 true면 예약불가
					str = setCarList(flag, item.origCartypeDtlId, item.cartypeDtlId, type, item.cartypeDtlNm, cd);
					
					htmlStr[0] += str; //전체탭에 추가
					htmlStr[type] += str; //개별탭에 추가
					
					/*
					if(item.cartypeDtlNm.indexOf("스파크") >= 0){
						nullCarCheck = i;
						console.log("ITEM : ", item);
					}
					*/
				}
			}
			
			for (var i=0; i <= 9; i++)
			{
				$("#car-type" + i + " ul").html(htmlStr[i]);
			}
			
			/*
			if(nullCarCheck == ""){
				htmlStr7 = "<li><a href='javascript:void(0);' class='cl-point7' data-orgn='CH0901' data-cartype='0000000' data-car='1' data-carcd='232003'>스파크 [가솔린]</a></li>";
				console.log(" htmlStr7: ", htmlStr7 );
				$("#car-type0 ul").append(htmlStr7);
				$("#car-type1 ul").append(htmlStr7);
			}
			*/
			
			if (_carDtl != null) // 이미 선택했던 차량이 예약가능한 차량이면 cl-point1  클래스 추가
			{
				var $selectCar = $("#car-type" + _carTab + " a[data-dtl=" + _carDtl + "]"); // 선택된차량 검색				
				if ($selectCar.length == 0) //조회되지 않으면 예약불가능한 차
				{
					_carOrgn = null;
					_carDtl = null;
					_carTab = 0;
					$("#aSelectBtnCar").text(_nullCarText);	 //차량 선택 메시지로 변경
					
					$("#alert-car").addClass("alert-msg");
					$("#msg-car").html("대여차량을 선택해주세요.");
					var offset = $("#alert-cartype").offset();
					
					//getPayment();
					
				}
				else
				{
					$("div.rent-car-select .tab-menu__list.selected").removeClass("selected");
					$("div.rent-car-select .tab-menu__list.c" +_carTab).addClass("selected");
					
					if (_carTab !== 0) //선택한 탭이 0번탭이 아니면
					{
						$("#car-type0").hide();  //0번탭 감추고
						$("#car-type" + _carTab).show(); //선택된탭 show
					}					
					$selectCar.addClass("cl-point1");
				}
			}
		
			if(list != null && list.length > 10)
			{
				$("#car-type0 ul li:gt(9)").addClass("invisible"); // 10개이상이면 invisible 처리
				$("#car-type0 span.btn-drop").show(); //더보기 버튼 표시
			}
			else
			{
				$("#car-type0 span.btn-drop").hide(); //더보기 버튼 감춤
			}
			ldwAbleCheck();
			
		},
		error : function(){
			alert('데이터 통신이 실패했습니다.\n잠시 후 다시 시도하세요.');
		} 
	});	

}

//차량손해면책제도 활성화 체크
//getPayment() 안에 포함되어 있음.
function ldwAbleCheck(){
	console.log("ldwAbleCheck --- 차량손해면책제도 활성화 체크");

	console.log("지역 = "+$("[name=cdId]").val());
	console.log("지역2 = "+$("[name=cdId2]").val());
	console.log("지점 = "+$("[name=branchId]").val());
	console.log("지점2 = "+$("[name=branchId2]").val());
	console.log("차량 = "+_carDtl);

		
	if($("#rentDateTime1").val() != "" && $("#rentDateTime2").val() != "" 
	&&($("[name=cdId]").val() != "" && $("[name=cdId]").val() != null)
	&&($("[name=cdId2]").val() != "" && $("[name=cdId2]").val() != null)
	&&($("[name=branchId]").val() != "" && $("[name=branchId]").val() != null)
	&&($("[name=branchId2]").val() != "" && $("[name=branchId2]").val() != null)
	&&(_carDtl != "" && _carDtl != null)){
		console.log("ldw 활성화");		
		$("#ldwId").prop("disabled", false);
		
		//getldw();
		//가능한 면책 수수료 가져오기
		var branchId = $('#branchId').val();
		var carModel = _carDtl;
		var aLdwId = $('#ldwId').val();
		
		if(branchId != ''&& carModel != ''){
			$.ajax({
				url : "/rent/rentcar/getLdw.json",
				type : "post",
				data : JSON.stringify({"branchId":branchId, "carTypeName":carModel}),
				dataType : "json",
				contentType:"application/json",
				success : function(data){
					console.log("getldw()\n지점선택,차량선택을 했을 때 실행되는 getLdw.json");
					
					var map = data.timeList;
					
					var ldw = map.ldw.split(',');
					var str = '<option value="">차량손해면책제도 선택</option>';
					var val = '';
					for(var i = 0; i < ldw.length; i++){
						var tmp = ldw[i].split("@");
						if(tmp[0] != '428009'){
							if(tmp[2] == 0){
								str += "<option value='"+tmp[0]+"'>"+tmp[1]+"(면책금 "+tmp[2]+"원)</option>";
							}else{
								str += "<option value='"+tmp[0]+"'>"+tmp[1]+"(면책금 "+tmp[2]+"만 원)</option>";
							}
						}else{
							str += "<option value='"+tmp[0]+"'>"+tmp[1]+"</option>";
						}
					}
					$('#ldwId').html(str);
					
					$("#ldwId option[value='']").attr("selected", "selected");
					
					$("#cfm_iRateAmt").text($("#ldwId option:selected").text());
					
					getPayment();
				},
				error : function(){
					alert('데이터 통신이 실패했습니다.\n잠시 후 다시 시도하세요.');
				}
			}); 
		}	
		
	}else{
		console.log("ldw 비활성화");
		$("#ldwId").prop("disabled", true);
	}	
}

function changeLcnsType(obj, fl){
	var val = $(obj).val();
	if(val != ""){
		$(obj).parent().parent().removeClass("alert-msg");
		$(obj).parent().parent().parent().children(".msg-lcns").html("");
	}else{
		if(fl == 1){
			$(obj).parent().parent().addClass("alert-msg");
			$(obj).parent().parent().parent().children(".msg-lcns").html("면허종류를 선택해주세요.");
		}else{
			if($("[name=licenseNo]").val() != "" || $("[name=licenseAvil]").val() != ""){
				$(obj).parent().parent().addClass("alert-msg");
				$(obj).parent().parent().parent().children(".msg-lcns").html("면허종류를 선택해주세요.");
			}else{
				$("#alert-lcnsNo,#alert-lcnsAvil,#alert-lcnsNo,#alert-lcnsAvil").removeClass("alert-msg");
				$("#msg-lcnsNo,#msg-lcnsAvil,#msg-lcnsNo,#msg-lcnsAvil").html("");
			}
		}
	}
	
	changeLcnCheckData();
}

function dsBox(id,option){
	console.log("id="+id);
	console.log("option="+option);	
	$('#'+id+' option').removeAttr('selected');
	$('#'+id+' option[value="'+option+'"]').prop('selected',true);
}

function addZero(v){
	return parseInt(v)<10?"0"+""+parseInt(v):v;
}

var disabled_date;


function alertMsg(name){
	switch(name){
	case "branch":
		alert('선택하신 지점은 예약이 완료되어 예약이 불가능 합니다.');
		dsBox("branchId",'');
		dsBox("branchId2",'');
		$('#sel2_che').html('');
		return false;
		break;
	case "time" :
		$("#rentDateTime1").val('');
		$("#rentDateTime2").val('');
		
		
		////////////////////////////////////// 수정필요!!!!!!!!!!!!!!
		dsBox("sHour", "");
		dsBox("lHour", "");
		dsBox("sMinute", "");
		dsBox("lMinute", "");
		$('#s_date_end').html('');
		$('#e_date_end').html('');
		alert('선택하신 일자/시간은 예약이 완료되어 예약이 불가능 합니다.');
		return false;
		break;
	case "carNm" :
		$('[name=carTypeName]').val('');
		$('#orgnCartype').val('');
		$('#rentCarNm').html('');
		alert('선택하신 차량은 예약이 완료되어 예약이 불가능 합니다.');
		
		//ldwAbleCheck();
		/*
		ldwAbleCheck();
		getPayment();
		*/
		return false;
		break;
	default:
		break;
	}
}
///////////////////////////////////////

function getSlsBranchCd(branchId){
	var sls = '';
	for(var i = 0; i<sls_branch.length; i++){
		if(sls_branch[i].split(":")[0]==branchId){
			sls = sls_branch[i].split(":")[1]; 
		}
	}
	return sls==''?branchId:sls;
}



function checkAlert(){ //대여일, 반납일, 지점 선택에 따라 대여가능여부 판단 후 alert 띄우기
	
	var SDATE = $("#rentDateTime1").val();
	var LDATE = $("#rentDateTime2").val();
	
	var branch = $('#branchId').val();
	var branch2 = $('#branchId2').val(); 
	
	// 2016.09.01 이후 제주 지점 대여/반납은 8:00~20:00까지 ---->시간을 가져올때 제주도의 경우 8:00부터 20:00만 가져오도록 스크립트 수정함
	// 2016.05.01 이후 제주 켄싱턴호텔 중문점 영업종료 ----->DB에서 가져올 때 중문점은 가져오지 않도록 수정함
	// 2017.04.01 이후 부산역 지점 영업종료 ------>DB에서 가져올 때 부산역 지점은 가져오지 않도록 쿼리 수정함	
	// 2017.01.28 설날당일 예약 불가 ------->달력에서 지난 날짜는 선택할 수 없음
}

function dateFormat(obj, type, differ){
	//obj는 $("#sDate").val() 혹은 $("#lDate").val()
	var day;
	if(obj == null || obj == ""){
		day = new Date();
	}else if(obj.indexOf("-") > 0){
		var year 	=  	obj.substring(0,4);
		var month 	= 	obj.substring(5,7);
		var day 	=	obj.substring(8,10);
		day = new Date(Date.parse(parseInt(year)+'/'+parseInt(month)+'/'+parseInt(day)));
	}else{
		var year 	=  	obj.substring(0,4);
		var month 	= 	obj.substring(4,6);
		var day 	=	obj.substring(6,8);
		day = new Date(Date.parse(parseInt(year)+'/'+parseInt(month)+'/'+parseInt(day)));
	}
	
	if(differ > 0){
		day.setDate(parseInt(day.getDate() + differ));
	}
	
	var d_yr = day.getFullYear();
	var d_mon = day.getMonth()+1;
	if(d_mon < 10){
		d_mon="0"+d_mon;
	}
	var d_day = day.getDate();
	if(d_day < 10){
		d_day = "0"+d_day;
	}
	
	var date;
	switch(type){
	case "yyyy-MM-dd":
		date = d_yr+"-"+d_mon+"-"+d_day;
		break;
	case "yyyy/MM/dd":
		date = d_yr+"/"+d_mon+"/"+d_day;
		break;
	case "MM/dd/yyyy":
		date = d_mon+"/"+d_day+"/"+d_yr;
		break;		
	case "yyyy.MM.dd":
		date = d_yr+"."+d_mon+"."+d_day;
		break;
	default:
		date = d_yr+""+d_mon+""+d_day;//yyyyMMdd
		break;
	}
	return date;
}

function setDateTime(obj,sHour,sMin,eHour,eMin,branEHour){//시간셋팅 대상, 대여가능 시작시간, 대여가능 시작 분, 대여가능 끝시간, 대여가능 끝 분, 지점운영 끝시간
	if(obj.val()!=''){
		var gubun = obj.attr("id");
		var aHour;
		if(gubun == "sDate"){
			aHour = $("#sHour").val();
			//대여일과 오늘 날짜를 비교해서 예약가능한 시간을 불러와 option을 새로 정의한다.
			//setHour(대여일, 대여 가능 시작시간, 대여 가능 끝시간)
			var sDate = dateFormat($("#rentDateTime1").val(), "", 0);//yyyyMMdd
			setHour(sDate, sHour, eHour);
		}else{
			aHour = $("#lHour").val();
		}
		
		var aSHour = $('#sHour').val();
		var aLHour = $('#lHour').val();
		var aSMinute = $('#sMinute').val();
		var aLMinute = $('#lMinute').val();
		var changetime = false;
		
		setTime(aHour,sMin,eMin,branEHour, gubun);
		
		// 기본 시간 선택 예약가능한 시간중제일 가까운 시간으로 24시간 정의해줌
		if(aSHour != null && aSHour != ""){
			var maxHour = -1;
			var minHour = 25;
			$('#sHour option').each(function(){
				if(maxHour < parseInt($(this).val())){
					maxHour = $(this).val();
				}
				if(minHour > parseInt($(this).val())){
					minHour = $(this).val();
				}
			});
			if($('#branchId').val()==''){
				minHour = '09';
			}
			
			var tmp = aSHour;
			if(tmp != null && tmp != ''){
				minHour = $('#sHour').val();
			}else if(tmp == null || tmp == ''){
				alert('선택하신 일자의 대여일시는 '+ minHour + "시 ~ " + maxHour + "시 까지 선택 가능합니다.");
				return false;
			}
			dsBox("sHour", minHour);
		}else if(aLHour != null && aLHour != ""){
			var maxHour = -1;
			var minHour = 25;
			
			$('#lHour option').each(function(){
				if(maxHour < parseInt($(this).val())){
					maxHour = $(this).val();
				}
				if(minHour > parseInt($(this).val())){
					minHour = $(this).val();
				}
			});
			
			if($('#branchId2').val()==''){
				minHour = '09';
			}
			var tmp = aLHour;
			if(tmp!=null&&tmp!=''){
				minHour = aLHour;
			}else if(tmp==null||tmp==''){
				alert('선택하신 반납일시는 '+ minHour + "시 ~ " + maxHour + "시 까지 선택 가능합니다.");
				return false;
			}	
			dsBox("lHour", minHour);
		}
		
		var checkLastHour = '0'; //20171228 대여가능시간 변경 
		if($("#rsvMode").val() == "inland") checkLastHour = 19;
		else if($("#rsvMode").val() == "jeju") checkLastHour = jejuResEndHourNumber; //수정
		
		
		if(aSMinute != null && aSMinute != ""){
			var maxMinute = -1;
			var minMinute = 51;
			$('#sMinute option').each(function(){
				if(maxMinute < parseInt($(this).val())){
					maxMinute = $(this).val();
				}
				if(minMinute > parseInt($(this).val())){
					minMinute = $(this).val();
				}
			});
			var tmp = aSMinute;
			if(tmp != null && tmp != ''){
				minMinute = $('#sMinute').val();
			}else if(tmp == null || tmp == ''){
				alert('선택하신 대여일시는 '+ minMinute + "분 ~ " + maxMinute + "분 까지 선택 가능합니다.");
				return false;
			}	
			if(aSHour == checkLastHour){  //20171228 대여가능시간 변경
				$("#sMinute option[value=00]").prop("selected", true);
				$("#sMinute").prop("disabled", true);
			}else{
				$("#sMinute").prop("disabled", false);
				dsBox("sMinute", minMinute);
			}
		}else if(aLMinute != null && aLMinute != ""){
			var maxMinute = -1;
			var minMinute = 51;
			$('#lMinute option').each(function(){
				if(maxMinute < parseInt($(this).val())){
					maxMinute = $(this).val();
				}
				if(minMinute > parseInt($(this).val())){
					minMinute = $(this).val();
				}
			});
			var tmp = aLMinute;
			if(tmp!=null&&tmp!=''){
				minMinute = aLMinute;
			}else if(tmp==null||tmp==''){
				alert('선택하신 대여일시는 '+ minMinute + "분 ~ " + maxMinute + "분 까지 선택 가능합니다.");
				return false;
			}
			
			if(aLHour == checkLastHour-1){ //20171228 대여가능시간 변경
				$("#lMinute option[value=00]").prop("selected", true);
				$("#lMinute").prop("disabled", true);
			}else{
				$("#lMinute").prop("disabled", false);
				dsBox("lMinute", minMinute);
			}
		}
	}
	
	var sDate = dateFormat($('#rentDateTime1').val(),'',0);
	var TMP_SDATE = sDate+$('#sHour').val()+$('#sMinute').val();
	var SDATE = TMP_SDATE.length==12?TMP_SDATE:"";
	if(SDATE!=''){	
		if($('#rentDateTime1').val() != null && $('#rentDateTime1').val() != '') $('#s_date_end').html($('#rentDateTime1').val()+" "+$('#sHour').val()+"시 "+$('#sMinute').val()+"분 ");
	}
	
	var lDate = dateFormat($('#rentDateTime2').val(),'',0);
	var TMP_LDATE = lDate+$('#lHour').val()+$('#lMinute').val();
	var LDATE = TMP_LDATE.length==12?TMP_LDATE:"";

	if(LDATE!=''){
		if($('#rentDateTime2').val() != null && $('#rentDateTime2').val() != '') $('#e_date_end').html($('#rentDateTime2').val()+" "+$('#lHour').val()+"시 "+$('#lMinute').val()+"분 ");	
	}
	
}

function setHour(sDate,sHour,eHour){ //대여일, 대여가능 시작시간, 대여가능 끝시간
	var aHour = $("#sHour").val();
	var menu = $("#rsvMode").val();
	var startHour = 0;
	var startRtnHour = jejuRtnStartHourNumber;
	var endRtnHour = jejuRtnEndHourNumber;
	if(menu == "inland"){
		startHour = 9;
	}else if(menu == "jeju"){
		startHour = jejuStartHourNumber;
		var endHour = 0; //20171228 대여가능시간 변경
	}	
	if(menu == "inland"){
		endHour = 19;
	}else if(menu == "jeju"){
		endHour = jejuResEndHourNumber;
	}
	
	var possSHour=startHour;
	var possEHour=endHour;
	console.log("eHour="+eHour);

	var today = new Date();
	var s_hour = today.getHours();//현재 시간
	s_hour += 1;
	if(menu == "inland"){
		if(s_hour > 19){  //20171228 대여가능시간 변경 
			s_hour = startHour;
		}
	}else if(menu == "jeju"){
		if(s_hour > jejuResEndHourNumber){  //20171228 대여가능시간 변경 
			s_hour = startHour;
		}
	}
	
	possSHour = s_hour;
	
	possEHour = parseInt(endHour);
	
	var lDate = "";
	
	$("#rentDateTime1").val(calendar._selectFromDate + $("#selectRentTime1").val());
	$("#rentDateTime2").val(calendar._selectToDate + $("#selectRentTime2").val());
	
	
	if($("#rentDateTime2").val() != null && $("#rentDateTime2").val() != ""){
		lDate = dateFormat($('#rentDateTime2').val(),'',0);	
	}
	
	var str = "";
	var str2 = "";
	//대여일을 오늘과 비교해서 선택가능한 시간을 세팅한다.
	console.log("setHour sDate="+sDate);
	console.log("setHour possSHour="+possSHour);
	console.log("setHour S_DATE="+S_DATE);
	console.log("setHour s_hour="+s_hour);
	console.log("setHour sHour="+sHour);
	if(sDate == S_DATE){//대여일과 대여가능한 시작날짜가 같으면
		/*if(sHour != null && sHour != ""){
			startHour = parseInt(S_TIME) < sHour?sHour:parseInt(S_TIME);
		}*/
		console.log(startHour);
		for(var i=possSHour; i<=possEHour;i++){
			if(startHour <= i){
				if(i == aHour) str+="<option value='"+addZero(i)+"' selected='selected'>"+addZero(i)+"시</option>" ;
				else str+="<option value='"+addZero(i)+"'>"+addZero(i)+"시</option>" ; 
			}
		}
		console.log(str);
		$("#sHour").html(str);
		
		dsBox('lHour',possSHour);
		$('#lHour option[value="'+possSHour+'"]').trigger('change');
	}else{
		console.log("대여일이 내일이 아님");
		console.log("startHour="+startHour);
		console.log("possEHour="+possEHour);
		
		var checkShour = 0;
		if($("#rsvMode").val() == "inland") checkShour = 19;
		else if($("#rsvMode").val() == "jeju") checkShour = jejuResEndHourNumber; //수정
		
		var s_possHour;
		if((sHour >= 8 || sHour <= checkShour) && sHour != null){	//20171228 대여가능시간 변경
			s_possHour = sHour;
		}else{
			s_possHour = startHour;
		}
		for(var i=s_possHour; i<=possEHour; i++){
			str += "<option value='"+addZero(i)+"'>"+addZero(i)+"시</option>";
		}
		
		$("#sHour").html(str);
		dsBox('sHour',s_possHour);
		
		
		if($("#rsvMode").val() == "jeju") possEHour = possEHour-1;	//수정
		for(var i=startRtnHour; i<=endRtnHour; i++){
			str2 += "<option value='"+addZero(i)+"'>"+addZero(i)+"시</option>";
		}
		$("#lHour").html(str2);
		dsBox('lHour',s_possHour);
		$('#lHour option[value="'+s_possHour+'"]').trigger('change');
	}
}

function getTime(){
	var sVal = $('[name=carTypeName]').val();
	var branchId = $('#branchId').val();
	if(branchId != '' && sVal != ''){
		console.log("getTime():branchId="+branchId);
		
		$.ajax({
			type : "post",
			url : "/rent/rentcar/getTime.json",
			data : {'carType':sVal
					,'branchId': getSlsBranchCd(branchId)},
			dataType : "json",
			success : function(data) {
				disabled_date = data.timeList;//대여 불가능 날짜
				var size = data.timeList.length;
				if(size > 0){
					//특정일 막기 추가[S]
					resetDatePicker(data.timeList);
					//특정일 막기 추가[E]
				}else{
					var resetDateArr = [new Date()];
					
					var toDay = new Date();
					var nextDay = new Date();
			    	nextDay.setDate(nextDay.getDate()+1);
					var nowHour = toDay.getHours()+1;
					
					var checkShour = 0;
					if($("#rsvMode").val() == "inland") checkShour = 19;
					else if($("#rsvMode").val() == "jeju") checkShour = 20;
					
					if(nowHour > checkShour){	//20171228 대여가능시간 변경
						resetDateArr.push(nextDay);
			    	}
					resetDatePicker(resetDateArr);
				}
			},
			error : function(){
				alert('데이터 통신이 실패했습니다.\n잠시 후 다시 시도하세요.');
			} 
		});	
	}
}

//특정일 선택막기
function selectedDate(date) {    
	var m = date.getMonth(), d = date.getDate(), y = date.getFullYear();    
	for (i = 0; i < disabled_date.length; i++) {
		if(disabled_date[i].V_DATE == (y + '-' +addZero(m+1) + '-' + addZero(d))) {            
			return [false];
		}    
	}
	return [true];
}

function setTime(aHour,sMin,eMin,branEHour, gubun){//선택한 시간, 대여가능 시작 분, 대여 가능 끝 분, 지점 끝 시간, 구분
	var lastHour = 0; //20171228 대여가능시간 변경
	if($("#rsvMode").val() == "inland") lastHour = 19;
	else if($("#rsvMode").val() == "jeju") lastHour = jejuResEndHourNumber; //수정	
	if(branEHour != null && branEHour != "") lastHour = branEHour;//영업 마지막 시간 설정
	
	var aMin;
	var this_childern;
	if(gubun == "sDate"){
		aMin = $("#sMinute").val();
		this_childern = "sMinute";
	}else if(gubun == "lDate"){
		aMin = $("#lMinute").val();
		this_childern = "lMinute";
		if($("#rsvMode").val() == "jeju") lastHour = lastHour -1;
	}
	
	if(aHour >= lastHour){//선택한 시간이 영업 종료 시간이면		
		$("#"+this_childern).html('<option value="00" selected="selected">00분</option>');
		$("#"+this_childern).prop("disabled", true);		
	}else{//선택한 시간이 영업종료 시간이 아니면		
		$("#"+this_childern).prop("disabled", false);
		var time_option = "";
		for(var i = 0; i<=30; i+=30){
			var tmp = i<10?"0"+i:i;
			time_option += '<option value="'+tmp+'" '+(aMin==tmp?'selected="selected"':'')+'>';
			time_option += tmp + '분</option>\n';
		}
		$("#"+this_childern).html(time_option);
	}
}


function getPossTimeGetCar(){
	
	var dt1 = $("#rentDateTime1").val();
	var dt2 = $("#rentDateTime2").val();

	var BRANCH_ID = $('#branchId').val();
	
	var SLS_BRANCH_CD = getSlsBranchCd($('#branchId').val());
	if(SLS_BRANCH_CD!=''){
		var tmp = SLS_BRANCH_CD;
		SLS_BRANCH_CD = BRANCH_ID;
		BRANCH_ID = tmp;
	}
	
	var ldwRtCd ="428009"; 
	if($('#ldwId').val() != null && $('#ldwId').val() !="") ldwRtCd =$('#ldwId').val();
	
	$.ajax({
		type : "post",
		url : "/rent/rentcar/getCar.json",
		data : {
			'carType':"",
			'branchId': BRANCH_ID
			, 'sDate' : dt1
			, 'lDate' : dt2
			, 'slsBranchCd':SLS_BRANCH_CD 
			, 'dcCardId' : $("#dcCardId").val()
			, 'pLdwRtCd'     : ldwRtCd},
		dataType : "json",
		success : function(data) {
			console.log("getCar() getCar.json");
			var list = data.carList;
			var RSV_PSBL_CNT;
			
			var htmlStr= ["","","","","","","","","",""];
			var str, str2;
			var flag = false;
			
			var $rentCarList = $("div.rent-car-list");
			//var nullCarCheck = "";

			if(list != null && list.length > 0){
				for(var i = 0; i<list.length; i++){
					
					var item = list[i];
					
					if(item.rsvPsblCnt!=null){
						RSV_PSBL_CNT = item.rsvPsblCnt;
					}else{
						RSV_PSBL_CNT = item.carCnt=='예약완료'?"0":item.carCnt;	
					}
					
					flag = parseInt(RSV_PSBL_CNT)==0?true:false;
					
					var cd = item.carShtRsvClsCd;
					var type;
					switch(cd){
					case "232001":type = 1;break;	// 경차
					case "232002":type = 2;break;	// 소형
					case "232003":type = 3;break;	// 중형
					case "232004":						// 대형
					case "232006":type = 4;break;	// 특대형
					case "232005":type = 5;break;	// 승합
					case "232007":						// 소형RV
					case "232008":type = 6;break;	// 중형RV
					case "232009":type = 7;break;	// 수입
					case "232010":						// EV
					case "232011":type = 8;break;	// EV수입
					}
					var fuelCd = list[i].fuelCd;
					var cartypeDtlNm = list[i].cartypeDtlNm;
					var carShtRsvClsCd = list[i].carShtRsvClsCd;
					
					cartypeDtlNm!=null?cartypeDtlNm:"";
					if((fuelCd == "210007" || cartypeDtlNm.indexOf('전기차') > 0) && cartypeDtlNm.indexOf('TESLA') < 0){
						type = 8;
					}
					if(cartypeDtlNm.indexOf('캠핑') > 0){						
						str2 = setCarList(flag, item.origCartypeDtlId, item.cartypeDtlId, 9, item.cartypeDtlNm, cd);
						htmlStr[9] += str2; //개별탭에 추가
					}
					
					//flag가 true면 예약불가
					str = setCarList(flag, item.origCartypeDtlId, item.cartypeDtlId, type, item.cartypeDtlNm, cd);
					
					htmlStr[0] += str; //전체탭에 추가
					htmlStr[type] += str; //개별탭에 추가
					
					/*
					if(item.cartypeDtlNm.indexOf("스파크") >= 0){
						nullCarCheck = i;
						console.log("ITEM : ", item);
					}
					*/
				}
			}
			
			for (var i=0; i <= 9; i++)
			{
				$("#car-type" + i + " ul").html(htmlStr[i]);
			}
			
			/*
			if(nullCarCheck == ""){
				htmlStr7 = "<li><a href='javascript:void(0);' class='cl-point7' data-orgn='CH0901' data-cartype='0000000' data-car='1' data-carcd='232003'>스파크 [가솔린]</a></li>";
				console.log(" htmlStr7: ", htmlStr7 );
				$("#car-type0 ul").append(htmlStr7);
				$("#car-type1 ul").append(htmlStr7);
			}
			*/
			
			if (_carDtl != null) // 이미 선택했던 차량이 예약가능한 차량이면 cl-point1  클래스 추가
			{
				var $selectCar = $("#car-type" + _carTab + " a[data-dtl=" + _carDtl + "]"); // 선택된차량 검색				
				if ($selectCar.length == 0) //조회되지 않으면 예약불가능한 차
				{
					_carOrgn = null;
					_carDtl = null;
					_carTab = 0;
					$("#aSelectBtnCar").text(_nullCarText);	 //차량 선택 메시지로 변경
					
					//setLcnsInput(true,false);
					$("#alert-car").addClass("alert-msg");
					$("#msg-car").html("대여차량을 선택해주세요.");
					var offset = $("#alert-cartype").offset();
					
					getPayment();
				}
				else
				{
					$("div.rent-car-select .tab-menu__list.selected").removeClass("selected");
					$("div.rent-car-select .tab-menu__list.c" +_carTab).addClass("selected");
					
					if (_carTab !== 0) //선택한 탭이 0번탭이 아니면
					{
						$("#car-type0").hide();  //0번탭 감추고
						$("#car-type" + _carTab).show(); //선택된탭 show
					}					
					$selectCar.addClass("cl-point1");
				}
			}
			
			if(list != null && list.length > 10)
			{
				$("#car-type0 ul li:gt(9)").addClass("invisible"); // 10개이상이면 invisible 처리
				$("#car-type0 span.btn-drop").show(); //더보기 버튼 표시
			}
			else
			{
				$("#car-type0 span.btn-drop").hide(); //더보기 버튼 감춤
			}
		},
		error : function(){
			alert('데이터 통신이 실패했습니다.\n잠시 후 다시 시도하세요.');
		} 
	});	
}

function getPossLtime(obj){
	var sDate = $("#rentDateTime1").val().substr(0,8);
	var lDate = $("#rentDateTime2").val().substr(0,8);
	
	if(sVal!='' && sVal2!=''){ //대여지역, 반납지역 모두 선택되어있을 때
		$.ajax({
			type : "post",
			url : "/rent/rentcar/getPossLHour.json",
			data : {'branchId': sVal
					,'branchId2':sVal2
					,'carType' : $('[name=carTypeName]').val()
					,'lDate' : lDate
					,'sDate' : sDate},
			dataType : "json",
			success : function(data) {
			console.log("getPossLtime(obj)\n getPossLHour.json 대여지점, 반납지점 선택이 있을 때 실행");
			console.log(data.lStHh);
				
				// 시작일자 변경시 종료일자 셋팅
				setDateTime( $('#rentDateTime2'), data.lStHh, null, data.lEdHh, data.lEdMi, data.lBranEdHh);
				if(sVal != "000012" && sVal == "") getBranchOption();
				if($('[name=carTypeName]').val() == null || $('[name=carTypeName]').val() == "") getPossTimeGetCar();
			},
			error : function(){
				alert('데이터 통신이 실패했습니다.\n잠시 후 다시 시도하세요.');
			} 
		});	
	}else{//지점 선택이 없을 때 실행
console.log("지점 선택이 없을 때 반납날짜 실행");
		setDateTime($("#rentDateTime2"),null,null,null,null);
		getBranchOption();
		if($('[name=carTypeName]').val() == null || $('[name=carTypeName]').val() == "") getCar();
	}
}

function getBranchOption(){ //대여 지점 가져오기, 반납지역 자동 선택 고정, 대여지점 및 반납지점 선택 활성화

	var sVal = $("#cdId").val();
	var branchId = $("#branchId").val();
	var branchId2 = $("#branchId2").val();
	
	var SDATE = $("#rentDateTime1").val();
	var LDATE = $("#rentDateTime2").val();

	$.ajax({
		type : "post",
		url : "/mobile/rentcar/getBranch.json",
		data : {
			'cdId' : ''
		   ,'model' :_carDtl
		   ,'sDate' : SDATE
		   ,'lDate' : LDATE
			},
		dataType : "json",
		success : function(data) {

			var list = data.areaList;//지점
			//var zone = data.zoneList;//지역
			
			//지점 SELECT BOX 고치기
			$options = $("#select_branch1 option");
			
			for (var idx in list)
			{
				var brId = list[idx].branchId;

				var $opt = $("#" + brId);
				var brname = $opt.data("bname");
				
				var cnt = list[idx].rsvPsblCnt;
				
				if (cnt * 1 == 0) //수량이 0이면 예약불가능
				{
					$opt.text("[예약완료] " + brname);
					$opt.prop('disabled', true);
				}
				else
				{
					$opt.text(brname);
					$opt.prop('disabled', false);					
				}
			}
		},
		error : function(){
			alert('데이터 통신이 실패했습니다.\n잠시 후 다시 시도하세요.');
		} 
	});
}


//////////////////////////
//편도 가능 여부
function getOneway(){
	
	var sVal = $('#branchId').val();
	
	$.ajax({
		type : "post",
		url : "/rent/rentcar/getOneWay.json",
		data : { 'branchId':sVal },
		dataType : "json",
		success : function(data) {
			console.log("대여지점이 바뀔때 실행되는 getOneWay.json");
			var oneWay = data.oneWayCount;
			console.log("oneWay="+oneWay);
			
			if(parseInt(oneWay) == 0){//편도 선택 불가능일 때
				$("#area-return").attr("onclick", "");
				$("#label-area-return").addClass("readonly");
			}else{//편도 선택 가능할 때
				$("#area-return").attr("onclick", "areaReturn();");
				$("#label-area-return").removeClass("readonly");
			}
			
			var dt1 = $("#rentDateTime1").val();
			var dt2 = $("#rentDateTime2").val();

			var BRANCH_ID = $('#branchId').val();
			
			var SLS_BRANCH_CD = getSlsBranchCd($('#branchId').val());
			if(SLS_BRANCH_CD!=''){
				var tmp = SLS_BRANCH_CD;
				SLS_BRANCH_CD = BRANCH_ID;
				BRANCH_ID = tmp;
			}
			
			var ldwRtCd ="428009"; 
			if($('#ldwId').val() != null && $('#ldwId').val() !="") ldwRtCd =$('#ldwId').val();
			
			$.ajax({
				type : "post",
				url : "/rent/rentcar/getCar.json",
				data : {
					'carType':"",
					'branchId': BRANCH_ID
					, 'sDate' : dt1
					, 'lDate' : dt2
					, 'slsBranchCd':SLS_BRANCH_CD 
					, 'dcCardId' : $("#dcCardId").val()
					, 'pLdwRtCd'     : ldwRtCd},
				dataType : "json",
				success : function(data) {
					console.log("getCar() getCar.json");
					var list = data.carList;
					var RSV_PSBL_CNT;
					
					var htmlStr= ["","","","","","","","","",""];
					var str, str2;
					var flag = false;
					
					var $rentCarList = $("div.rent-car-list");

					if(list != null && list.length > 0){
						for(var i = 0; i<list.length; i++){
							
							var item = list[i];
							
							if(item.rsvPsblCnt!=null){
								RSV_PSBL_CNT = item.rsvPsblCnt;
							}else{
								RSV_PSBL_CNT = item.carCnt=='예약완료'?"0":item.carCnt;	
							}
							
							flag = parseInt(RSV_PSBL_CNT)==0?true:false;
							
							var cd = item.carShtRsvClsCd;
							var type;
							switch(cd){
							case "232001":type = 1;break;	// 경차
							case "232002":type = 2;break;	// 소형
							case "232003":type = 3;break;	// 중형
							case "232004":						// 대형
							case "232006":type = 4;break;	// 특대형
							case "232005":type = 5;break;	// 승합
							case "232007":						// 소형RV
							case "232008":type = 6;break;	// 중형RV
							case "232009":type = 7;break;	// 수입
							case "232010":						// EV
							case "232011":type = 8;break;	// EV수입
							}
							
							var fuelCd = list[i].fuelCd;
							var cartypeDtlNm = list[i].cartypeDtlNm;
							cartypeDtlNm!=null?cartypeDtlNm:"";
							if((fuelCd == "210007" || cartypeDtlNm.indexOf('전기차') > 0) && cartypeDtlNm.indexOf('TESLA') < 0){
								type = 8;
							}
							if(cartypeDtlNm.indexOf('캠핑') > 0){						
								str2 = setCarList(flag, item.origCartypeDtlId, item.cartypeDtlId, 9, item.cartypeDtlNm, cd);
								htmlStr[9] += str2; //개별탭에 추가
							}
							
							//flag가 true면 예약불가							
							str = setCarList(flag, item.origCartypeDtlId, item.cartypeDtlId, type, item.cartypeDtlNm, cd);
							
							htmlStr[0] += str; //전체탭에 추가
							htmlStr[type] += str; //개별탭에 추가
						}
					}
					
					for (var i=0; i <= 9; i++)
					{
						$("#car-type" + i + " ul").html(htmlStr[i]);
					}
					
					if (_carDtl != null) // 이미 선택했던 차량이 예약가능한 차량이면 cl-point1  클래스 추가
					{
						var $selectCar = $("#car-type" + _carTab + " a[data-dtl=" + _carDtl + "]"); // 선택된차량 검색				
						if ($selectCar.length == 0) //조회되지 않으면 예약불가능한 차
						{
							_carOrgn = null;
							_carDtl = null;
							_carTab = 0;
							$("#aSelectBtnCar").text(_nullCarText);	 //차량 선택 메시지로 변경
							
							//setLcnsInput(true,false);
							$("#alert-car").addClass("alert-msg");
							$("#msg-car").html("대여차량을 선택해주세요.");
							var offset = $("#alert-cartype").offset();
							
							//getPayment();
							
						}
						else
						{
							$("div.rent-car-select .tab-menu__list.selected").removeClass("selected");
							$("div.rent-car-select .tab-menu__list.c" +_carTab).addClass("selected");
							
							if (_carTab !== 0) //선택한 탭이 0번탭이 아니면
							{
								$("#car-type0").hide();  //0번탭 감추고
								$("#car-type" + _carTab).show(); //선택된탭 show
							}					
							$selectCar.addClass("cl-point1");
						}
					}

					if(list != null && list.length > 10)
					{
						$("#car-type0 ul li:gt(9)").addClass("invisible"); // 10개이상이면 invisible 처리
						$("#car-type0 span.btn-drop").show(); //더보기 버튼 표시
					}
					else
					{
						$("#car-type0 span.btn-drop").hide(); //더보기 버튼 감춤
					}
					
					
					//getTime() -start
					var sVal = $('[name=carTypeName]').val();
					var branchId = $('#branchId').val();
					if(branchId != '' && sVal != ''){
						console.log("getTime():branchId="+branchId);
						
						$.ajax({
							type : "post",
							url : "/rent/rentcar/getTime.json",
							data : {'carType':sVal
									,'branchId': getSlsBranchCd(branchId)},
							dataType : "json",
							success : function(data) {
								disabled_date = data.timeList;//대여 불가능 날짜
								var size = data.timeList.length;
								if(size > 0){
									//특정일 막기 추가[S]
									resetDatePicker(data.timeList);
									//특정일 막기 추가[E]
								}else{
									var resetDateArr = [new Date()];
									
									var toDay = new Date();
									var nextDay = new Date();
							    	nextDay.setDate(nextDay.getDate()+1);
									var nowHour = toDay.getHours()+1;
									
									var checkShour = 0;
									if($("#rsvMode").val() == "inland") checkShour = 19;
									else if($("#rsvMode").val() == "jeju") checkShour = 20;
									
									if(nowHour > checkShour){	//20171228 대여가능시간 변경
										resetDateArr.push(nextDay);
							    	}
									resetDatePicker(resetDateArr);
								}
								
								//ldwAbleCheck() - start
								console.log("getOneway -> ldwAbleCheck --- 차량손해면책제도 활성화 체크");
								
								if($("#rentDateTime1").val() != "" && $("#rentDateTime2").val() != "" 
								&&($("[name=cdId]").val() != "" && $("[name=cdId]").val() != null)
								&&($("[name=cdId2]").val() != "" && $("[name=cdId2]").val() != null)
								&&($("[name=branchId]").val() != "" && $("[name=branchId]").val() != null)
								&&($("[name=branchId2]").val() != "" && $("[name=branchId2]").val() != null)
								&&(_carDtl != "" && _carDtl != null)){
									console.log("ldw 활성화");		
									$("#ldwId").prop("disabled", false);
									
									//getldw();
									//가능한 면책 수수료 가져오기
									var branchId = $('#branchId').val();
									var carModel = _carDtl;
									var aLdwId = $('#ldwId').val();
									
									if(branchId != ''&& carModel != ''){
										$.ajax({
											url : "/rent/rentcar/getLdw.json",
											type : "post",
											data : JSON.stringify({"branchId":branchId, "carTypeName":carModel}),
											dataType : "json",
											contentType:"application/json",
											success : function(data){
												console.log("getldw()\n지점선택,차량선택을 했을 때 실행되는 getLdw.json");
												
												var map = data.timeList;
												
												var ldw = map.ldw.split(',');
												var str = '<option value="">차량손해면책제도 선택</option>';
												var val = '';
												for(var i = 0; i < ldw.length; i++){
													var tmp = ldw[i].split("@");
													if(tmp[0] != '428009'){
														if(tmp[2] == 0){
															str += "<option value='"+tmp[0]+"'>"+tmp[1]+"(면책금 "+tmp[2]+"원)</option>";
														}else{
															str += "<option value='"+tmp[0]+"'>"+tmp[1]+"(면책금 "+tmp[2]+"만 원)</option>";
														}
													}else{
														str += "<option value='"+tmp[0]+"'>"+tmp[1]+"</option>";
													}
												}
												$('#ldwId').html(str);
												
												$("#ldwId option[value='']").attr("selected", "selected");
												
												$("#cfm_iRateAmt").text($("#ldwId option:selected").text());
												
												getPayment();
											},
											error : function(){
												alert('데이터 통신이 실패했습니다.\n잠시 후 다시 시도하세요.');
											}
										}); 
									}	
									
								}else{
									console.log("ldw 비활성화");
									$("#ldwId").prop("disabled", true);
								}
								//ldwAbleCheck() - end
							},
							error : function(){
								alert('데이터 통신이 실패했습니다.\n잠시 후 다시 시도하세요.');
							} 
						});
					}
					
					//getTime() - end
					
				},
				error : function(){
					alert('데이터 통신이 실패했습니다.\n잠시 후 다시 시도하세요.');
				} 
			});
		},
		error : function(){
			alert('데이터 통신이 실패했습니다.\n잠시 후 다시 시도하세요.');
		} 
	});	
}

var _carOrgn = null;
var _carDtl = null;
var _carTab = null;
var _nullCarText = $("#aSelectBtnCar").text();



function selectCar(obj)
{
	if (_carDtl != null)
	{
		$("div.rent-car-select a.cl-point1").removeClass("cl-point1");
	}
	
	var $this = $(obj);
	_carOrgn = $this.data("orgn");
	_carDtl =  $this.data("dtl");
	_carTab =  $this.data("tab");
	var carName = $this.text();
	
	$("#aSelectBtnCar").text(carName); //
	$("#rentCarNm").text(carName); //티커 차이름
	$("#cfm_rentCarNm").text(carName); //예약정보확인 차이름
	//$("#cfm_iRateAmt").text($("#ldwId option:selected").text()); //차량 손해면책제도
	$("#cfm_iRateAmt").text($("#ldwId option:eq(0)").text()); //차량 손해면책제도 초기화
	
	$this.addClass('cl-point1');
	
	// 팝업창 닫기
	$("div.modal-pop").css({ display: "none" });
	$("html").removeClass("no-scroll");	
	
	//아이폰 사파리에서 차량 더보기 클릭 후 차량선택하면 위치가 변경되는 현상 발생하여 강제로 포커스 위치 고정
	var offset = $("#alert-cartype").offset();
	$("html, body").animate({scrollTop: offset.top-100}, 10);
	
	/////////selectCarTypeNm();
	//selectCarTypeNm() - start
	
	if(_carDtl != null){	
		$("#alert-car").removeClass("alert-msg");
		$("#msg-cartype").html("");
	}
	
	if( (_carOrgn == "BE1501" || _carOrgn == "BE1602") && $("#branchId").val() == "000012"){//제주 벤츠의 경우 2017.08.08
		if($("#ldw-all-li") != null) $("#ldw-all-li").hide();
		$("#benz_check").show();
	}else{
		if($("#ldw-all-li") != null) $("#ldw-all-li").show();
		$("#benz_check").hide();
	}
	
	var sDate = $("#rentDateTime1").val();
	var userNm = $("[name=userNm]").val();
	var birthday = $("[name=birthday]").val();
	var licenseType = $("[name=licenseType]").val();
	var licenseNo = $("[name=licenseNo]").val();
	var licenseAvil = $('[name=licenseAvil]').val();
	var branchId = $('#branchId').val();
	var branchId2 = $('#branchId2').val();
	var userClass = $("#userClass").val();	
	
	var lcnLength = licenseNo.length; 
	var hasLcnNo = false;
	var hasLncTypeG  = false;
	
	if(lcnLength == 12)
		hasLcnNo = true;
	if(licenseType == '106009')
		hasLncTypeG = true;
	
	// 수입차 면허 조건 검증
	var carCd =  $this.attr("data-carcd");
	$("#selCarCd").val(carCd);
	if(userNm != "" && birthday != "" && licenseType != "" && licenseNo != "" && licenseAvil != "" && hasLcnNo){
		if( !checkLicenImports( carCd, "step2" ) ){
			hasLcnOk = false;
			hasCheckCar = false;
			hasNext = false;
			//직접입력일 경우
			if(lcnInputMode == "u"){
				setLcnsInput(false, false);
			}else{//촬영일 경우
				initLcnData();
			}
			
			$("#alert-car").addClass("alert-msg");
			$("#msg-car").html("해당 차량은  만26세 이상, 면허 취득 3년이상, 면허 종별로 2종 보통 이상만 대여 가능합니다.");
			var offset = $('#alert-cartype').offset();
			$("html, body").animate({scrollTop: offset.top-150}, 10);
			$("#aSelectBtnCar").text("차량을 선택해주세요.");
			$('#rentCarNm').html('');
			$("#selCarCd").val('');
			$("div.rent-car-select a.cl-point1").removeClass("cl-point1");
			hasResInfo = false;
			hasResChange = false;
			_carDtl = null;
			$("#ldwId").val("428009").attr("selected", "selected");
			ldwAbleCheck();
			
			return false;
		}else{
			hasCheckCar = true;
		}
	}else{
		if( !checkLicenImports( carCd ) ){
			hasCheckCar = false;
		}else{
			hasCheckCar = true;
		}
	}
	
	//법인아닐경우
	if(userClass != 1){
		//국제면허가 아닐경우
		if(!hasLncTypeG){	
			//면허 인증가능 여부 
			if(userNm != "" && birthday != "" && licenseType != "" && licenseNo != "" && licenseAvil != "" && hasLcnNo){
				//라이센스 체크
				$.ajax({
					url : '/rent/rentcar/lcnsCheck.json',
					type : 'POST',
					dataType : 'json',
					data : {"channel":"MOBILE","licenseType":licenseType,"licenseNo":licenseNo,
						"userNm":userNm,"birthday":birthday},
					success : function(data) {
						$('#TRD_NO').val(dateValueTrd()); 
						$('#TID').val("FDIKPG_skrent00_"+dateValue()+random_num());
						$('#MxIssueNO').val("skrent00"+ dateValue());
						$('#MxIssueDate').val(dateValue());
						
						$('#pSlsBranchCd').val(getSlsBranchCd($('#branchId').val())==$('#branchId').val()?"":getSlsBranchCd($('#branchId').val()));
						$('#pSlsBranchCd2').val(getSlsBranchCd($('#branchId2').val())==$('#branchId2').val()?"":getSlsBranchCd($('#branchId2').val()));
						
						$(':disabled').prop('disabled',false);
						
						var toDay = new Date();
						var year = toDay.getFullYear();
						var month = (toDay.getMonth()+1)<10?("0"+(toDay.getMonth()+1)):(toDay.getMonth()+1);
						var date = (toDay.getDate())<10?("0"+(toDay.getDate())):(toDay.getDate());
						var chk_dt = year+""+month+""+date;  
						
						
						$("input[name=pDrvingLcnsChkDt]").val(chk_dt);
						$("input[name=pDrvingLcnsChkCd]").val(data.LCNS_RTN_CD);
						$("input[name=pDrvingLcnsChkMsg]").val(data.LCNS_RTN_NM);
						
						if(data.LCNS_RTN_CD=="00"||data.LCNS_RTN_CD=="02"){
							//날짜정보 있는지 여부 체크 날짜 정보가 있다면 
							var sDate = dateFormat($("#rentDateTime1").val(),'',0);
							removeLcnAlertMsg();
							if($('#rentDateTime1').val() != null && $('#rentDateTime1').val() != ''){
								//차량이 11인승이상인지 체크
								/*  
								 * 	12인승 차량 선택 시 
								 * */ 
								$.ajax({
									url : '/rent/rentcar/getCDVal.json',
									type : 'POST', 
									dataType : 'json',
									data : {"carTypeName":_carOrgn},
									success : function(data) {
										//26세 이상 체크
										var cdcheck = true;
										if(data.cdCnt > 0){
											//해당 라이센스로 가능한지 체크
											if(checkLicenPeriod()){
												hasLcnOk = true;
											}else{
												hasLcnOk = false;
												hasCheckCar = false;
												hasNext = false;
												//직접입력일 경우
												if(lcnInputMode == "u"){
													setLcnsInput(false, false);
												}else{//촬영일 경우
													initLcnData();
												}
												
												$("#alert-car").addClass("alert-msg");
												$("#msg-car").html("해당 차량은  만26세 이상, 면허 취득 3년이상, 면허 종별로 1종 보통 이상만 대여 가능합니다.");
												var offset = $('#alert-cartype').offset();
												$("html, body").animate({scrollTop: offset.top-150}, 10);
												$("#aSelectBtnCar").text("차량을 선택해주세요.");
												$('#rentCarNm').html('');
												$("div.rent-car-select a.cl-point1").removeClass("cl-point1");
												hasResInfo = false;
												hasResChange = false;
												_carDtl = null;
												$("#ldwId").val("428009").attr("selected", "selected");
												ldwAbleCheck();
												
												return false;
												
											}
											//해당 라이센스로 11인승 이상 가능한지 체크 종료
											hasCDVal = data.cdCnt; 											
										}else{
											if(checkLicenseInputLageSuvVan()){
												hasLcnOk = true;	
											} else {
												hasLcnOk = false;
												hasCheckCar = false;
												hasNext = false;
												//직접입력일 경우
												if(lcnInputMode == "u"){
													setLcnsInput(false, false);
												}else{//촬영일 경우
													initLcnData();
												}
												
												$("#alert-car").addClass("alert-msg");
												$("#msg-car").html("해당 차량은  만26세 이상, 면허 취득 3년이상, 면허 종별로 2종 보통 이상만 대여 가능합니다.");
												var offset = $('#alert-cartype').offset();
												$("html, body").animate({scrollTop: offset.top-150}, 10);
												$("#aSelectBtnCar").text("차량을 선택해주세요.");
												$('#rentCarNm').html('');
												$("div.rent-car-select a.cl-point1").removeClass("cl-point1");
												hasResInfo = false;
												hasResChange = false;
												_carDtl = null;
												$("#ldwId").val("428009").attr("selected", "selected");
												ldwAbleCheck();
												
												return false;
											}
											
											hasCDVal = 0;
										}
										
										checkingLicenseIssued();
										
										//ldwAbleCheck() - start
										//이것도 시점문제 생기면 위에 11인승 이상 체크하는 부분 안쪽으로 이동
										console.log("getOneway -> ldwAbleCheck --- 차량손해면책제도 활성화 체크");
										
										if($("#rentDateTime1").val() != "" && $("#rentDateTime2").val() != "" 
										&&($("[name=cdId]").val() != "" && $("[name=cdId]").val() != null)
										&&($("[name=cdId2]").val() != "" && $("[name=cdId2]").val() != null)
										&&($("[name=branchId]").val() != "" && $("[name=branchId]").val() != null)
										&&($("[name=branchId2]").val() != "" && $("[name=branchId2]").val() != null)
										&&(_carDtl != "" && _carDtl != null)){
											console.log("ldw 활성화");		
											$("#ldwId").prop("disabled", false);
											
											//getldw();
											//가능한 면책 수수료 가져오기
											var branchId = $('#branchId').val();
											var carModel = _carDtl;
											var aLdwId = $('#ldwId').val();
											
											if(branchId != ''&& carModel != ''){
												$.ajax({
													url : "/rent/rentcar/getLdw.json",
													type : "post",
													data : JSON.stringify({"branchId":branchId, "carTypeName":carModel}),
													dataType : "json",
													contentType:"application/json",
													success : function(data){
														console.log("getldw()\n지점선택,차량선택을 했을 때 실행되는 getLdw.json");
														
														var map = data.timeList;
														
														var ldw = map.ldw.split(',');
														var str = '<option value="">차량손해면책제도 선택</option>';
														var val = '';
														for(var i = 0; i < ldw.length; i++){
															var tmp = ldw[i].split("@");
															if(tmp[0] != '428009'){
																if(tmp[2] == 0){
																	str += "<option value='"+tmp[0]+"'>"+tmp[1]+"(면책금 "+tmp[2]+"원)</option>";
																}else{
																	str += "<option value='"+tmp[0]+"'>"+tmp[1]+"(면책금 "+tmp[2]+"만 원)</option>";
																}
															}else{
																str += "<option value='"+tmp[0]+"'>"+tmp[1]+"</option>";
															}
														}
														$('#ldwId').html(str);
														
														$("#ldwId option[value='']").attr("selected", "selected");
														
														$("#cfm_iRateAmt").text($("#ldwId option:selected").text());
														
														hasNext = false;
														//직접입력일 경우
														if(lcnInputMode == "u"){
															setLcnsInput(hasLcnOk, false);
														}else{//촬영일 경우 아무일도 없음.
															hasNext = false;
														}
														getPayment();
														if(hasLcnOk){
															hasResChange = true;
															showResInfo();
														}
													},
													error : function(){
														alert('데이터 통신이 실패했습니다.\n잠시 후 다시 시도하세요.');
													}
												}); 
											}	
											
										}else{
											console.log("ldw 비활성화");
											$("#ldwId").prop("disabled", true);
										}
									},
									error : function(xhr, status, error) {
										console.log(error);
										console.log(arguments);
									}
								});
								//차량 11인승 이상체크 종료
							}else{
								//날짜정보 없을 경우
								/*  
								 * 	12인승 차량 선택 시 alert
								 * */ 
								$.ajax({
									url : '/rent/rentcar/getCDVal.json',
									type : 'POST', 
									dataType : 'json',
									data : {"carTypeName":_carOrgn},
									success : function(data) {
										//26세 이상 체크
										var cdcheck = true;
										if(data.cdCnt > 0){
											alert("해당 차량은 26세 이상, 면허 취득 3년 이상,\n면허 종별로 1종 보통 이상이 아니면 대여 거부 될 수 있습니다.");
											//26세 이상인지 체크 그리고 면허가 3년이상인지 여부 체크
											hasCheckCar = true;
											hasCDVal = data.cdCnt; 
										}else{
											if(!checkLicenseInputLageSuvVanCehck()){
												alert("해당 차량은 26세 이상, 면허 취득 3년 이상,\n면허 종별로 2종 보통 이상이 아니면 대여 거부 될 수 있습니다.");
												hasCheckCar = true;
											}
											
											hasCDVal = 0;
										}

										checkingLicenseIssued();
									},
									error : function(xhr, status, error) {
										console.log(error);
										console.log(arguments);
									}
								});		
								
								//ldwAbleCheck() - start
								//이것도 시점문제 생기면 위에 11인승 이상 체크하는 부분 안쪽으로 이동
								console.log("getOneway -> ldwAbleCheck --- 차량손해면책제도 활성화 체크");
								
								if($("#rentDateTime1").val() != "" && $("#rentDateTime2").val() != "" 
								&&($("[name=cdId]").val() != "" && $("[name=cdId]").val() != null)
								&&($("[name=cdId2]").val() != "" && $("[name=cdId2]").val() != null)
								&&($("[name=branchId]").val() != "" && $("[name=branchId]").val() != null)
								&&($("[name=branchId2]").val() != "" && $("[name=branchId2]").val() != null)
								&&(_carDtl != "" && _carDtl != null)){
									console.log("ldw 활성화");		
									$("#ldwId").prop("disabled", false);
									
									//getldw();
									//가능한 면책 수수료 가져오기
									var branchId = $('#branchId').val();
									var carModel = _carDtl;
									var aLdwId = $('#ldwId').val();
									
									if(branchId != ''&& carModel != ''){
										$.ajax({
											url : "/rent/rentcar/getLdw.json",
											type : "post",
											data : JSON.stringify({"branchId":branchId, "carTypeName":carModel}),
											dataType : "json",
											contentType:"application/json",
											success : function(data){
												console.log("getldw()\n지점선택,차량선택을 했을 때 실행되는 getLdw.json");
												
												var map = data.timeList;
												
												var ldw = map.ldw.split(',');
												var str = '<option value="">차량손해면책제도 선택</option>';
												var val = '';
												for(var i = 0; i < ldw.length; i++){
													var tmp = ldw[i].split("@");
													if(tmp[0] != '428009'){
														if(tmp[2] == 0){
															str += "<option value='"+tmp[0]+"'>"+tmp[1]+"(면책금 "+tmp[2]+"원)</option>";
														}else{
															str += "<option value='"+tmp[0]+"'>"+tmp[1]+"(면책금 "+tmp[2]+"만 원)</option>";
														}
													}else{
														str += "<option value='"+tmp[0]+"'>"+tmp[1]+"</option>";
													}
												}
												$('#ldwId').html(str);
												
												$("#ldwId option[value='']").attr("selected", "selected");
												
												$("#cfm_iRateAmt").text($("#ldwId option:selected").text());
												
												hasNext = false;
												//직접입력일 경우
												if(lcnInputMode == "u"){
													setLcnsInput(true, false);
												}else{//촬영일 경우 아무일도 없음.
													hasNext = false;
												}
												getPayment();
											},
											error : function(){
												alert('데이터 통신이 실패했습니다.\n잠시 후 다시 시도하세요.');
											}
										}); 
									}	
									
								}else{
									console.log("ldw 비활성화");
									$("#ldwId").prop("disabled", true);
								}						
							}
							//날짜정보 유무 체크 종료
						}else{
							hasNext = false;
							hasResInfo = false;
							hasResChange = false;
							//직접입력일 경우
							if(lcnInputMode == "u"){
								lcnResultMsg(data);
								setLcnsInput(false, false);
							}else{//촬영일 경우
								alert(data.RTN_ALERT_MSG);
								initLcnData();
							}
							
							ldwAbleCheck();
							return false;
						}
					}	
				});
			}else{
				//정보 없어서 면허 인증 불가할 경우
				//12인승 여부만 체크하고 alert만 보여주면 된다.
				
				/*  
				 * 	12인승 차량 선택 시 alert
				 * */ 
				$.ajax({
					url : '/rent/rentcar/getCDVal.json',
					type : 'POST', 
					dataType : 'json',
					data : {"carTypeName":_carOrgn},
					success : function(data) {
						//26세 이상 체크
						var cdcheck = true;
						if(data.cdCnt > 0){
							alert("해당 차량은 26세 이상, 면허 취득 3년 이상,\n면허 종별로 1종 보통 이상이 아니면 대여 거부 될 수 있습니다.");
							//26세 이상인지 체크 그리고 면허가 3년이상인지 여부 체크
							hasCheckCar = true;
							hasCDVal = data.cdCnt;
						}else{
							if(checkLicenseInputLageSuvVanCehck()){
								hasCheckCar = true;
							} else {
								alert("해당 차량은 26세 이상, 면허 취득 3년 이상,\n면허 종별로 2종 보통 이상이 아니면 대여 거부 될 수 있습니다.");
								hasCheckCar = false;	
							}
							
							hasCDVal = 0;
						}

						checkingLicenseIssued();
					},
					error : function(xhr, status, error) {
						console.log(error);
						console.log(arguments);
					}
				});		
				
				//ldwAbleCheck() - start
				//이것도 시점문제 생기면 위에 11인승 이상 체크하는 부분 안쪽으로 이동
				console.log("selectCar -> ldwAbleCheck --- 차량손해면책제도 활성화 체크");
				
				if($("#rentDateTime1").val() != "" && $("#rentDateTime2").val() != "" 
				&&($("[name=cdId]").val() != "" && $("[name=cdId]").val() != null)
				&&($("[name=cdId2]").val() != "" && $("[name=cdId2]").val() != null)
				&&($("[name=branchId]").val() != "" && $("[name=branchId]").val() != null)
				&&($("[name=branchId2]").val() != "" && $("[name=branchId2]").val() != null)
				&&(_carDtl != "" && _carDtl != null)){
					console.log("ldw 활성화");		
					$("#ldwId").prop("disabled", false);
					
					//getldw();
					//가능한 면책 수수료 가져오기
					var branchId = $('#branchId').val();
					var carModel = _carDtl;
					var aLdwId = $('#ldwId').val();
					
					if(branchId != ''&& carModel != ''){
						$.ajax({
							url : "/rent/rentcar/getLdw.json",
							type : "post",
							data : JSON.stringify({"branchId":branchId, "carTypeName":carModel}),
							dataType : "json",
							contentType:"application/json",
							success : function(data){
								console.log("getldw()\n지점선택,차량선택을 했을 때 실행되는 getLdw.json");
								
								var map = data.timeList;
								
								var ldw = map.ldw.split(',');
								var str = '<option value="">차량손해면책제도 선택</option>';
								var val = '';
								for(var i = 0; i < ldw.length; i++){
									var tmp = ldw[i].split("@");
									if(tmp[0] != '428009'){
										if(tmp[2] == 0){
											str += "<option value='"+tmp[0]+"'>"+tmp[1]+"(면책금 "+tmp[2]+"원)</option>";
										}else{
											str += "<option value='"+tmp[0]+"'>"+tmp[1]+"(면책금 "+tmp[2]+"만 원)</option>";
										}
									}else{
										str += "<option value='"+tmp[0]+"'>"+tmp[1]+"</option>";
									}
								}
								$('#ldwId').html(str);
								
								$("#ldwId option[value='']").attr("selected", "selected");
								
								$("#cfm_iRateAmt").text($("#ldwId option:selected").text());
								
								getPayment();
							},
							error : function(){
								alert('데이터 통신이 실패했습니다.\n잠시 후 다시 시도하세요.');
							}
						}); 
					}	
					//날짜정보가 있다면
					if($('#rentDateTime1').val() != null && $('#rentDateTime1').val() != ''){
						//직접입력일 경우
						if(lcnInputMode == "u"){
							setLcnsInput(false, false);
						}else{//촬영일 경우
							initLcnData();
						}
						hasResChange = true;
						showResInfo();
					}else{
						hasNext = false;
						//직접입력일 경우
						if(lcnInputMode == "u"){
							setLcnsInput(true, false);
						}else{//촬영일 경우 아무일 없음.
						}
					}
				}else{
					console.log("ldw 비활성화");
					$("#ldwId").prop("disabled", true);
				}
				/*
				//날짜정보가 있다면 라이센스 입력박스 활성화
				if($("#rentDateTime1").val() != "" && $("#rentDateTime2").val() != ""){
					setLcnsInput(false, false);
				}else{
					setLcnsInput(true, false);
				}
				*/
			}
		//국제면허 아닐경우
		}else{
		//국제면허일 경우
			
			$.ajax({
				url : '/rent/rentcar/getCDVal.json',
				type : 'POST', 
				dataType : 'json',
				data : {"carTypeName":_carOrgn},
				success : function(data) {
					//26세 이상 체크
					var cdcheck = true;
					if(data.cdCnt > 0){
						alert("해당 차량은 26세 이상, 면허 취득 3년 이상,\n면허 종별로 1종 보통 이상이 아니면 대여 거부 될 수 있습니다.");
						//26세 이상인지 체크 그리고 면허가 3년이상인지 여부 체크
						// hasCheckCar확인 필요.
						hasCheckCar = true;
						hasCDVal = data.cdCnt; 
					}else{
						if(!checkLicenseInputLageSuvVanCehck()){
							alert("해당 차량은 26세 이상, 면허 취득 3년 이상,\n면허 종별로 2종 보통 이상이 아니면 대여 거부 될 수 있습니다.");
						}
						
						hasCDVal = 0;
					}

					checkingLicenseIssued();
				},
				error : function(xhr, status, error) {
					console.log(error);
					console.log(arguments);
				}
			});	
			
			
			$('#TRD_NO').val(dateValueTrd()); 
			$('#TID').val("FDIKPG_skrent00_"+dateValue()+random_num());
			$('#MxIssueNO').val("skrent00"+ dateValue());
			$('#MxIssueDate').val(dateValue());
			
			$('#pSlsBranchCd').val(getSlsBranchCd($('#branchId').val())==$('#branchId').val()?"":getSlsBranchCd($('#branchId').val()));
			$('#pSlsBranchCd2').val(getSlsBranchCd($('#branchId2').val())==$('#branchId2').val()?"":getSlsBranchCd($('#branchId2').val()));
			
			//$(':disabled').prop('disabled',false);
			
			ldwAbleCheck();
			
			showResInfo();
			
		}
	}else{
		//법인일 경우
		ldwAbleCheck();
		
	}
	
	if($('#rsvMode').val() == "inland"){
		setInlandBranch(null, null, null, null); //지점 disabled 처리
	}

	if(typeof $("#corp").val() != "undefined" && $("#corp").val() == "InterPark") {
		$(".dimd").css('display','none');
    }
}

//이름, 생년월일, 면허타입, 면허번호 변경시 
//비동기문제로 인하여 안전하게 처리....
/*
 * if(라이센스인증가능){
	if(라이센스 인증 성공){
		if(날짜와 차량 정보 있는지?){
			if(차량이 11인승인지?){
				if(해당 라이센스로 11인승 가능?){
					OK
					이름, 생년월일, 면허타입, 면허번호 비활성화
				}else{
					안됨
					차량, 면책제도 초기화
					이름, 생년월일, 면허타입, 면허번호 활성화
				}
			}else{
				OK
				이름, 생년월일, 면허타입, 면허번호 비활성화
			}			
		}else{
			if(차량이 11인승인지?){
				alert(대여거부가능);
			}
			이름, 생년월일, 면허타입, 면허번호 비활성화
		}
	}else{
		인증실패
		이름, 생년월일, 면허타입, 면허번호 활성화
	}
}else{
	
}
*/
function changeLcnCheckData(){
	//법인 체크 필요 
	//
	var userClass = $("#userClass").val();
	if(userClass != 1){
	//법인 아닐 경우
		var sDate = $("#rentDateTime1").val();
		var userNm = $("[name=userNm]").val();
		var birthday = $("[name=birthday]").val();
		var licenseType = $("[name=licenseType]").val();
		var licenseNo = $("[name=licenseNo]").val();
		var licenseAvil = $('[name=licenseAvil]').val();
		var branchId = $('#branchId').val();
		var branchId2 = $('#branchId2').val();
		var carTypeName = _carDtl == null?"":_carDtl;
		
		var lcnLength = licenseNo.length; 
		var hasLcnNo = false;
		var hasLncTypeG = false;
		
		if(licenseType == '106009')
			hasLncTypeG = true;
		if(lcnLength == 12){
			hasLcnNo = true;
		}
		
		var hasLcnAvil = checkLcnAvil();
		
		//면허 취득 년도
		var licYear = licenseNo.substring(2,4);
		var cDate = dateFormat(sDate, "", 0);
		var sYear2 = cDate.substring(2,4);

		if(licYear - sYear2 == 0){
			alert("면허발급일이 1년미만이라 예약이 불가합니다.");
			$("#msg-lcnsNo").html("면허발급일이 1년미만이라 예약이 불가합니다.");
			return false;
		}
		
		// 수입차 면허 조건 검증
		var carCd = $("#selCarCd").val();
		if(userNm != "" && birthday != "" && licenseType != "" && licenseNo != "" && licenseAvil != "" && hasLcnNo){
			if( !checkLicenImports( carCd, "step2" ) ){
				hasLcnOk = false;												
				if(lcnInputMode == 'u'){
					setLcnsInput(false, false);
					$("#alert-car").addClass("alert-msg");
					$("#msg-car").html("해당 차량은  만26세 이상, 면허 취득 3년 이상만 대여 가능합니다.");
					var offset = $('#alert-cartype').offset();
					$("html, body").animate({scrollTop: offset.top-150}, 10);
					$("#aSelectBtnCar").text("차량을 선택해주세요.");
					$('#rentCarNm').html('');
					$("#selCarCd").val('');
					$("div.rent-car-select a.cl-point1").removeClass("cl-point1");
					hasResInfo = false;
					hasResChange = false;
					_carDtl = null;
					$("#ldwId").val("428009").attr("selected", "selected");
					ldwAbleCheck();
					getPayment();
					return false;
				}else{
					initLcnData();
				}
			}else{
				hasCheckCar = true;
			}
		}else{
			if( !checkLicenImports( carCd, "step3" ) ){
				hasCheckCar = false;
			}else{
				hasCheckCar = true;
			}
		}
		
		//라이센스 인증 가능한지 체크
		//면허 인증가능 여부
		if(!hasLncTypeG){
			if(userNm != "" && birthday != "" && licenseType != "" && licenseNo != "" && hasLcnAvil && hasLcnNo){
				//라이센스 체크
				$.ajax({
					url : '/rent/rentcar/lcnsCheck.json',
					type : 'POST',
					dataType : 'json',
					data : {"channel":"MOBILE","licenseType":licenseType,"licenseNo":licenseNo,
						"userNm":userNm,"birthday":birthday},
					success : function(data) {
						$('#TRD_NO').val(dateValueTrd()); 
						$('#TID').val("FDIKPG_skrent00_"+dateValue()+random_num());
						$('#MxIssueNO').val("skrent00"+ dateValue());
						$('#MxIssueDate').val(dateValue());
						
						$('#pSlsBranchCd').val(getSlsBranchCd($('#branchId').val())==$('#branchId').val()?"":getSlsBranchCd($('#branchId').val()));
						$('#pSlsBranchCd2').val(getSlsBranchCd($('#branchId2').val())==$('#branchId2').val()?"":getSlsBranchCd($('#branchId2').val()));
						
						if($('#rsvMode').val() == "inland"){
							$("#ldwId, #userNm, #birthday, #mobile, #homeZip, #homeAddr, #licenseType, #licenseNo").prop('disabled',false);
						} else {
							$(':disabled').prop('disabled',false);	
						}
						
						var toDay = new Date();
						var year = toDay.getFullYear();
						var month = (toDay.getMonth()+1)<10?("0"+(toDay.getMonth()+1)):(toDay.getMonth()+1);
						var date = (toDay.getDate())<10?("0"+(toDay.getDate())):(toDay.getDate());
						var chk_dt = year+""+month+""+date;       
						
						$("input[name=pDrvingLcnsChkDt]").val(chk_dt);
						$("input[name=pDrvingLcnsChkCd]").val(data.LCNS_RTN_CD);
						$("input[name=pDrvingLcnsChkMsg]").val(data.LCNS_RTN_NM);
						//alert("면허 OK 체크전");
						if(data.LCNS_RTN_CD=="00"||data.LCNS_RTN_CD=="02"){
							removeLcnAlertMsg();
							//날짜, 차량이 선택되어있다면 
							//차량정보만있고 날짜정보가 없는경우는 없다고 판단.
							var sDate = dateFormat($("#rentDateTime1").val(),'',0);								
							if($('#rentDateTime1').val() != null && $('#rentDateTime1').val() != '' && _carDtl != "" && _carDtl != null){
								//차량이 11인승이상인지 체크
								/*  
								 * 	12인승 차량 선택 시 
								 * */ 
								$.ajax({
									url : '/rent/rentcar/getCDVal.json',
									type : 'POST', 
									dataType : 'json',
									data : {"carTypeName":_carOrgn},
									success : function(data) {
										//26세 이상 체크
										var cdcheck = true;
										if(data.cdCnt > 0){
											//해당 라이센스로 가능한지 체크
											if(checkLicenPeriod()){
												hasLcnOk = true;
											}else{
												hasLcnOk = false;												
												if(lcnInputMode == 'u'){
													setLcnsInput(false, false);
													$("#alert-car").addClass("alert-msg");
													$("#msg-car").html("해당 차량은  만26세 이상, 면허 취득 3년이상, 면허 종별로 1종 보통 이상만 대여 가능합니다.");
													var offset = $('#alert-cartype').offset();
													$("html, body").animate({scrollTop: offset.top-150}, 10);
													$("#aSelectBtnCar").text("차량을 선택해주세요.");
													$('#rentCarNm').html('');
													$("div.rent-car-select a.cl-point1").removeClass("cl-point1");
													hasResInfo = false;
													hasResChange = false;
													_carDtl = null;
													$("#ldwId").val("428009").attr("selected", "selected");
													ldwAbleCheck();
													getPayment();
													return false;
												}else{
													initLcnData();
												}
	
											}
											//해당 라이센스로 11인승 이상 가능한지 체크 종료
											hasCDVal = data.cdCnt; 
											
											showResInfo();
										}else{
											if(checkLicenseInputLageSuvVan()){
												hasLcnOk = true;
											}else{
												hasLcnOk = false;												
												if(lcnInputMode == 'u'){
													setLcnsInput(false, false);
													$("#alert-car").addClass("alert-msg");
													$("#msg-car").html("해당 차량은  만26세 이상, 면허 취득 3년이상, 면허 종별로 2종 보통 이상만 대여 가능합니다.");
													var offset = $('#alert-cartype').offset();
													$("html, body").animate({scrollTop: offset.top-150}, 10);
													$("#aSelectBtnCar").text("차량을 선택해주세요.");
													$('#rentCarNm').html('');
													$("div.rent-car-select a.cl-point1").removeClass("cl-point1");
													hasResInfo = false;
													hasResChange = false;
													_carDtl = null;
													$("#ldwId").val("428009").attr("selected", "selected");
													ldwAbleCheck();
													getPayment();
													return false;
												}else{
													initLcnData();
												}
											}
											
											//만약차량 없다면 손해면책제도 비활성화
											if(_carDtl == null || _carDtl == "")
												ldwAbleCheck();
											else{
												removeLcnAlertMsg();
												showResInfo();
											}
											
											hasCDVal = 0;
										}

										checkingLicenseIssued();
										
										//직접입력일 경우
										if(lcnInputMode == "u"){
											setLcnsInput(hasLcnOk, false);
										}else{//촬영일 경우 아무일 없음.
											hasNext = false;
										}
										
									},
									error : function(xhr, status, error) {
										console.log(error);
										console.log(arguments);
									}
								});
								//차량 11인승 이상체크 종료
							}else if($("#rentDateTime1").val() != null && $("#rentDateTime1").val() != '' && (_carDtl == "" || _carDtl == null)){
								//차량정보 없을 경우
								//이름, 생년월일, 면허타입, 면허번호 비활성화
								
								//직접입력일 경우
								if(lcnInputMode == "u"){
									setLcnsInput(true, false);
								}else{//촬영일 경우
									hasNext = false;
								}
							}else if(($("#rentDateTime1").val() == null || $("#rentDateTime1").val() == '') && (_carDtl == "" || _carDtl == null)){
								//카메라로 촬영했을경우 날짜도 없고 차도 없고 지점도 없음.
								//직접입력일 경우
								if(lcnInputMode == "u"){
									setLcnsInput(true, false);
								}else{//촬영일 경우
									hasNext = false;
									setTimeout(disableLcnData(), 500)
									return true;
								}
							}else{
								/*  
								 * 	12인승 차량 선택 시 alert
								 * */ 
								$.ajax({
									url : '/rent/rentcar/getCDVal.json',
									type : 'POST', 
									dataType : 'json',
									data : {"carTypeName":_carOrgn},
									success : function(data) {
										//26세 이상 체크
										var cdcheck = true;
										if(data.cdCnt > 0){
											alert("해당 차량은 26세 이상, 면허 취득 3년 이상,\n면허 종별로 1종 보통 이상이 아니면 대여 거부 될 수 있습니다.");
											//26세 이상인지 체크 그리고 면허가 3년이상인지 여부 체크
											hasCheckCar = true;
											hasCDVal = data.cdCnt; 
										}else{
											if(checkLicenseInputLageSuvVanCehck()){
												hasCheckCar = true;
											} else {
												alert("해당 차량은 26세 이상, 면허 취득 3년 이상,\n면허 종별로 2종 보통 이상이 아니면 대여 거부 될 수 있습니다.");
												hasCheckCar = false;	
											}
											
											hasCDVal = 0;
										}

										checkingLicenseIssued();
									},
									error : function(xhr, status, error) {
										console.log(error);
										console.log(arguments);
									}
								});		
								hasLcnOk = true;
								//ldwAbleCheck() - start
								//이것도 시점문제 생기면 위에 11인승 이상 체크하는 부분 안쪽으로 이동
								console.log("getOneway -> ldwAbleCheck --- 차량손해면책제도 활성화 체크");
								
								if($("#rentDateTime1").val() != "" && $("#rentDateTime2").val() != "" 
								&&($("[name=cdId]").val() != "" && $("[name=cdId]").val() != null)
								&&($("[name=cdId2]").val() != "" && $("[name=cdId2]").val() != null)
								&&($("[name=branchId]").val() != "" && $("[name=branchId]").val() != null)
								&&($("[name=branchId2]").val() != "" && $("[name=branchId2]").val() != null)
								&&(_carDtl != "" && _carDtl != null)){
									console.log("ldw 활성화");		
									$("#ldwId").prop("disabled", false);
									
									//getldw();
									//가능한 면책 수수료 가져오기
									var branchId = $('#branchId').val();
									var carModel = _carDtl;
									var aLdwId = $('#ldwId').val();
									
									if(branchId != ''&& carModel != ''){
										$.ajax({
											url : "/rent/rentcar/getLdw.json",
											type : "post",
											data : JSON.stringify({"branchId":branchId, "carTypeName":carModel}),
											dataType : "json",
											contentType:"application/json",
											success : function(data){
												console.log("getldw()\n지점선택,차량선택을 했을 때 실행되는 getLdw.json");
												
												var map = data.timeList;
												
												var ldw = map.ldw.split(',');
												var str = '<option value="">차량손해면책제도 선택</option>';
												var val = '';
												for(var i = 0; i < ldw.length; i++){
													var tmp = ldw[i].split("@");
													if(tmp[0] != '428009'){
														if(tmp[2] == 0){
															str += "<option value='"+tmp[0]+"'>"+tmp[1]+"(면책금 "+tmp[2]+"원)</option>";
														}else{
															str += "<option value='"+tmp[0]+"'>"+tmp[1]+"(면책금 "+tmp[2]+"만 원)</option>";
														}														
													}else{
														str += "<option value='"+tmp[0]+"'>"+tmp[1]+"</option>";
													}
												}
												$('#ldwId').html(str);
												
												$("#ldwId option[value='']").attr("selected", "selected");
												
												$("#cfm_iRateAmt").text($("#ldwId option:selected").text());
												
												//직접입력일 경우
												if(lcnInputMode == "u"){
													setLcnsInput(hasLcnOk, false);
												}else{//촬영일 경우
													hasNext = false;
												}
												getPayment();
											},
											error : function(){
												alert('데이터 통신이 실패했습니다.\n잠시 후 다시 시도하세요.');
											}
										}); 
									}	
									
								}else{
									console.log("ldw 비활성화");
									$("#ldwId").prop("disabled", true);
								}						
							}
							//날짜정보 유무 체크 종료
						}else{
							//인증 실패.. 
							//차량이 선택되어있지 않으면 비활성화 
							//선택되어있으면 활성화 처리
							if(_carDtl != null && _carDtl != ""){
								
							}else{
								$("#ldwId").val("428009").attr("selected", "selected");
								ldwAbleCheck();
								getPayment();
							}
							lcnResultMsg(data);
							return false;
						}
						//면허 인증실패 종료
					},
					error : function(){
						alert('데이터 통신이 실패했습니다.\n잠시 후 다시 시도하세요.');
						return false;
					} 
				});
				//라이센스 체크 종료
			}else{
			// 인증 불가할 경우
				//직접입력일 경우
				if(lcnInputMode == "u"){
				}else{//촬영일 경우
					
					//userNm != "" && birthday != "" && licenseType != "" && licenseNo != "" && licenseAvil != "" && hasLcnNo
					//lcnLength
					var sDate = $("#rentDateTime1").val();
					var userNm = $("[name=userNm]").val();
					var birthday = $("[name=birthday]").val();
					var licenseType = $("[name=licenseType]").val();
					var licenseNo = $("[name=licenseNo]").val();
					var licenseAvil = $('[name=licenseAvil]').val();
					var branchId = $('#branchId').val();
					var branchId2 = $('#branchId2').val();
					var carTypeName = _carDtl == null?"":_carDtl;
					
					var lcnLength = licenseNo.length; 
					//alert("이름 :" + userNm + " 생년월일 : " + birthday + " 타입 : " + licenseType + " 번호 : " + licenseNo + " 유효기간 : " + licenseAvil);
					alert("예약자 정보를 다시 확인해주세요.");
					initLcnData();
				}
			//아무짓 안함
			}
		//국제면허아닐경우 죵료
		}else{
		//국제면허일 경우
			//모두 입력됬는지 체크
			//안되어있음 해당 부분 입력하게 유도			
			if(userNm != "" && birthday != "" && licenseType != "" && licenseNo != "" && hasLcnNo && licenseAvil != ""){
				$('#TRD_NO').val(dateValueTrd()); 
				$('#TID').val("FDIKPG_skrent00_"+dateValue()+random_num());
				$('#MxIssueNO').val("skrent00"+ dateValue());
				$('#MxIssueDate').val(dateValue());
				
				$('#pSlsBranchCd').val(getSlsBranchCd($('#branchId').val())==$('#branchId').val()?"":getSlsBranchCd($('#branchId').val()));
				$('#pSlsBranchCd2').val(getSlsBranchCd($('#branchId2').val())==$('#branchId2').val()?"":getSlsBranchCd($('#branchId2').val()));
				
			//	$(':disabled').prop('disabled',false);
				hasLcnOk = true;
				showResInfo();
			}else{
				if ($('[name=licenseNo]').val().length<12 ||$('[name=licenseNo]').val().length>12) {
					$("#alert-lcnsNo").addClass("alert-msg");
					$("#msg-lcnsNo").html("면허번호를 입력해주세요.");
					var offset = $('[name=licenseNo]').offset();
					$("html, body").animate({scrollTop: offset.top-200}, 10);
					hasLcnChkVal = false;
					check = false;
				}else if($('[name=licenseNo]').val().length == 12){
					var lcnsArea = $('[name=licenseNo]').val().substring(0,2);
					
					var licenseType = $("[name=licenseType]").val();
					//국제면허일 경우 
					if(licenseType == '106009'){
						$("#alert-lcnsNo").removeClass("alert-msg");
						$("#msg-lcnsNo").html("");
					}
				}
			}
			
			
		}
	
	}else{
	//법인일 경우
	//
	}
}


//flag가 true면 예약불가
function setCarList(flag, orgnDtlId, dtlId, tabId, carTypeNm, cd){
	var str="<li>";	
	if(flag) 
		str += "<a href='javascript:void(0)' class='cl-point7'>"; // 예약불가 class
	else
		str += "<a href='javascript:void(0)' onclick='selectCar(this)' data-orgn='"+orgnDtlId+"' data-dtl='"+dtlId+"' data-tab='"+tabId+"' data-carcd='"+cd+"' >";	
	
	str += carTypeNm + '</a></li>\n';	
	return str;
}

function moreCar()
{
	// 감추어져 있던 10개의 li를 표시
	$("#car-type0 ul li.invisible:lt(10)").removeClass("invisible");

	// 감추어져있는 li가 0개면 더보기 버튼을 감추기
	if ($("#car-type0 ul li.invisible").length == 0)
	{
		$("#car-type0 span.btn-drop").hide(); //더보기 버튼 감춤
	}
}


///////////////////////////
// getCar() -- start

function getCar(){

	var dt1 = $("#rentDateTime1").val();
	var dt2 = $("#rentDateTime2").val();

	var BRANCH_ID = $('#branchId').val();
	
	var SLS_BRANCH_CD = getSlsBranchCd($('#branchId').val());
	if(SLS_BRANCH_CD!=''){
		var tmp = SLS_BRANCH_CD;
		SLS_BRANCH_CD = BRANCH_ID;
		BRANCH_ID = tmp;
	}
	
	var ldwRtCd ="428009"; 
	if($('#ldwId').val() != null && $('#ldwId').val() !="") ldwRtCd =$('#ldwId').val();
	
	$.ajax({
		type : "post",
		url : "/rent/rentcar/getCar.json",
		data : {
			'carType':"",
			'branchId': BRANCH_ID
			, 'sDate' : dt1
			, 'lDate' : dt2
			, 'slsBranchCd':SLS_BRANCH_CD 
			, 'dcCardId' : $("#dcCardId").val()
			, 'pLdwRtCd'     : ldwRtCd},
		dataType : "json",
		success : function(data) {
			console.log("getCar() getCar.json");
			var list = data.carList;
			var RSV_PSBL_CNT;
			
			var htmlStr= ["","","","","","","","","",""];
			var str,str2;
			var flag = false;
			
			var $rentCarList = $("div.rent-car-list");
			//var nullCarCheck = "";

			if(list != null && list.length > 0){
				for(var i = 0; i<list.length; i++){
					
					var item = list[i];
					
					if(item.rsvPsblCnt!=null){
						RSV_PSBL_CNT = item.rsvPsblCnt;
					}else{
						RSV_PSBL_CNT = item.carCnt=='예약완료'?"0":item.carCnt;	
					}
					
					flag = parseInt(RSV_PSBL_CNT)==0?true:false;
					
					var cd = item.carShtRsvClsCd;
					var type;
					switch(cd){
					case "232001":type = 1;break;	// 경차
					case "232002":type = 2;break;	// 소형
					case "232003":type = 3;break;	// 중형
					case "232004":						// 대형
					case "232006":type = 4;break;	// 특대형
					case "232005":type = 5;break;	// 승합
					case "232007":						// 소형RV
					case "232008":type = 6;break;	// 중형RV
					case "232009":type = 7;break;	// 수입
					case "232010":						// EV
					case "232011":type = 8;break;	// EV수입
					}
					
					var fuelCd = list[i].fuelCd;
					var cartypeDtlNm = list[i].cartypeDtlNm;
					var carShtRsvClsCd = list[i].carShtRsvClsCd;
					
					cartypeDtlNm!=null?cartypeDtlNm:"";
					if((fuelCd == "210007" || cartypeDtlNm.indexOf('전기차') > 0) && cartypeDtlNm.indexOf('TESLA') < 0){
						type = 8;
					}
					if(cartypeDtlNm.indexOf('캠핑') > 0){						
						str2 = setCarList(flag, item.origCartypeDtlId, item.cartypeDtlId, 9, item.cartypeDtlNm, cd);
						htmlStr[9] += str2; //개별탭에 추가
					}						
					
					str = setCarList(flag, item.origCartypeDtlId, item.cartypeDtlId, type, item.cartypeDtlNm, cd);
					
					htmlStr[0] += str; //전체탭에 추가
					htmlStr[type] += str; //개별탭에 추가
					
					/*
					if(item.cartypeDtlNm.indexOf("스파크") >= 0){
						nullCarCheck = i;
						console.log("ITEM : ", item);
					}
					*/
				}
			}
			
			for (var i=0; i <= 9; i++)
			{
				$("#car-type" + i + " ul").html(htmlStr[i]);
			}
			
			/*
			if(nullCarCheck == ""){
				htmlStr7 = "<li><a href='javascript:void(0);' class='cl-point7' data-orgn='CH0901' data-cartype='0000000' data-car='1' data-carcd='232003'>스파크 [가솔린]</a></li>";
				console.log(" htmlStr7: ", htmlStr7 );
				$("#car-type0 ul").append(htmlStr7);
				$("#car-type1 ul").append(htmlStr7);
			}
			*/
			
			if (_carDtl != null) // 이미 선택했던 차량이 예약가능한 차량이면 cl-point1  클래스 추가
			{
				var $selectCar = $("#car-type" + _carTab + " a[data-dtl=" + _carDtl + "]"); // 선택된차량 검색				
				if ($selectCar.length == 0) //조회되지 않으면 예약불가능한 차
				{
					_carOrgn = null;
					_carDtl = null;
					_carTab = 0;
					$("#aSelectBtnCar").text(_nullCarText);	 //차량 선택 메시지로 변경
					
					// setLcnsInput(true,false);
					$("#alert-car").addClass("alert-msg");
					$("#msg-car").html("대여차량을 선택해주세요.");
					var offset = $("#alert-cartype").offset();
					
					 getPayment();
					
				}
				else
				{
					$("div.rent-car-select .tab-menu__list.selected").removeClass("selected");
					$("div.rent-car-select .tab-menu__list.c" +_carTab).addClass("selected");
					
					if (_carTab !== 0) //선택한 탭이 0번탭이 아니면
					{
						$("#car-type0").hide();  //0번탭 감추고
						$("#car-type" + _carTab).show(); //선택된탭 show
					}					
					$selectCar.addClass("cl-point1");
				}
			}

			if(list != null && list.length > 10)
			{
				$("#car-type0 ul li:gt(9)").addClass("invisible"); // 10개이상이면 invisible 처리
				$("#car-type0 span.btn-drop").show(); //더보기 버튼 표시
			}
			else
			{
				$("#car-type0 span.btn-drop").hide(); //더보기 버튼 감춤
			}
			
		},
		error : function(){
			alert('데이터 통신이 실패했습니다.\n잠시 후 다시 시도하세요.');
		} 
	});	
}
// getCar() - end


function selectCarTypeNm(){	
/////////selectCarTypeNm();
	//selectCarTypeNm() - start
	
	if(_carDtl != null){	
		$("#alert-car").removeClass("alert-msg");
		$("#msg-cartype").html("");
	}
	
	if( (_carOrgn == "BE1501" || _carOrgn == "BE1602") && $("#branchId").val() == "000012"){//제주 벤츠의 경우 2017.08.08
		if($("#ldw-all-li") != null) $("#ldw-all-li").hide();
		$("#benz_check").show();
	}else{
		if($("#ldw-all-li") != null) $("#ldw-all-li").show();
		$("#benz_check").hide();
	}
	
	/*  
	 * 	12인승 차량 선택 시 alert
	 * */ 
	$.ajax({
		url : '/rent/rentcar/getCDVal.json',
		type : 'POST', 
		dataType : 'json',
		data : {"carTypeName":_carOrgn},
		success : function(data) {
			//26세 이상 체크
			var cdcheck = true;
			if(data.cdCnt > 0){
				hasCDVal = data.cdCnt;
				/*
				var sDate = $("#rentDateTime1").val();
				var userNm = $("[name=userNm]").val();
				var birthday = $("[name=birthday]").val();
				var licenseType = $("[name=licenseType]").val();
				var licenseNo = $("[name=licenseNo]").val();
				var branchId = $('#branchId').val();
				var branchId2 = $('#branchId2').val();
				
				if(sDate != "" && userNm != "" && birthday != "" && licenseType != "" && licenseNo != "" && branchId != "" && branchId2 != ""){
					
				}else{
					alert("해당 차량은 26세 이상, 면허 취득 3년 이상,\n면허 종별로 1종 보통 이상이 아니면 대여 거부 될 수 있습니다.");
				}
				
				//26세 이상인지 체크 그리고 면허가 3년이상인지 여부 체크
				hasCheckCar = true;
				*/
				alert("해당 차량은 26세 이상, 면허 취득 3년 이상,\n면허 종별로 1종 보통 이상이 아니면 대여 거부 될 수 있습니다.");
			}else{
				if(!checkLicenseInputLageSuvVanCehck()){
					alert("해당 차량은 26세 이상, 면허 취득 3년 이상,\n면허 종별로 2종 보통 이상이 아니면 대여 거부 될 수 있습니다.");
				}
				
				hasCDVal = 0;
				//hasCheckCar = false;
			}
			/*  이건 나중
			//포커스 이동
			$("#ldwId").focus();
			*/
			
			checkingLicenseIssued();
		},
		error : function(xhr, status, error) {
			console.log(error);
			console.log(arguments);
		}
	});
	
	if($("#rentDateTime1").val() == null || $("#rentDateTime1").val() == "") {
		/////getTime();
		//getTime() - start
		var sVal = $('[name=carTypeName]').val();
		var branchId = $('#branchId').val();
		if(branchId != '' && sVal != ''){
			console.log("getTime():branchId="+branchId);
			
			$.ajax({
				type : "post",
				url : "/rent/rentcar/getTime.json",
				data : {'carType':sVal
						,'branchId': getSlsBranchCd(branchId)},
				dataType : "json",
				success : function(data) {
					disabled_date = data.timeList;//대여 불가능 날짜
					var size = data.timeList.length;
					if(size > 0){
						//특정일 막기 추가[S]
						resetDatePicker(data.timeList);
						//특정일 막기 추가[E]
					}else{
						var resetDateArr = [new Date()];
						
						var toDay = new Date();
						var nextDay = new Date();
				    	nextDay.setDate(nextDay.getDate()+1);
						var nowHour = toDay.getHours()+1;
						
						var checkShour = 0;
						if($("#rsvMode").val() == "inland") checkShour = 19;
						else if($("#rsvMode").val() == "jeju") checkShour = jejuRtnEndHourNumber;
						
						if(nowHour > checkShour){	//20171228 대여가능시간 변경
							resetDateArr.push(nextDay);
				    	}
						resetDatePicker(resetDateArr);
					}
				},
				error : function(){
					alert('데이터 통신이 실패했습니다.\n잠시 후 다시 시도하세요.');
				} 
			});	
		}
	}
	
	console.log("branchId="+$("#branchId").val());
	if($("#branchId").val() != '000012'){
		console.log("대여지점 없을 때 차량 선택 시 실행");
		getBranchOption();
	}
	
	
	//ldwAbleCheck() - start
	console.log("getOneway -> ldwAbleCheck --- 차량손해면책제도 활성화 체크");
	
	if($("#rentDateTime1").val() != "" && $("#rentDateTime2").val() != "" 
	&&($("[name=cdId]").val() != "" && $("[name=cdId]").val() != null)
	&&($("[name=cdId2]").val() != "" && $("[name=cdId2]").val() != null)
	&&($("[name=branchId]").val() != "" && $("[name=branchId]").val() != null)
	&&($("[name=branchId2]").val() != "" && $("[name=branchId2]").val() != null)
	&&(_carDtl != "" && _carDtl != null)){
		console.log("ldw 활성화");		
		$("#ldwId").prop("disabled", false);
		
		//getldw();
		//가능한 면책 수수료 가져오기
		var branchId = $('#branchId').val();
		var carModel = _carDtl;
		var aLdwId = $('#ldwId').val();
		
		if(branchId != ''&& carModel != ''){
			$.ajax({
				url : "/rent/rentcar/getLdw.json",
				type : "post",
				data : JSON.stringify({"branchId":branchId, "carTypeName":carModel}),
				dataType : "json",
				contentType:"application/json",
				success : function(data){
					console.log("getldw()\n지점선택,차량선택을 했을 때 실행되는 getLdw.json");
					
					var map = data.timeList;
					
					var ldw = map.ldw.split(',');
					var str = '<option value="">차량손해면책제도를 선택해주세요.</option>';
					var val = '';
					for(var i = 0; i < ldw.length; i++){
						var tmp = ldw[i].split("@");
						if(tmp[0] != '428009'){
							if(tmp[2] == 0){
								str += "<option value='"+tmp[0]+"'>"+tmp[1]+"(면책금 "+tmp[2]+"원)</option>";
							}else{
								str += "<option value='"+tmp[0]+"'>"+tmp[1]+"(면책금 "+tmp[2]+"만 원)</option>";
							}
						}else{
							str += "<option value='"+tmp[0]+"'>"+tmp[1]+"</option>";
						}
					}
					$('#ldwId').html(str);
					
					$("#ldwId option[value='']").attr("selected", "selected");
					
					$("#cfm_iRateAmt").text($("#ldwId option:selected").text());
					
					getPayment();
				},
				error : function(){
					alert('데이터 통신이 실패했습니다.\n잠시 후 다시 시도하세요.');
				}
			}); 
		}	
		
	}else{
		console.log("ldw 비활성화");
		$("#ldwId").prop("disabled", true);
	}
	//ldwAbleCheck() - end
	// getTime - end
	
	//selectCarTypeNm() - end
	
}



function getldw(){
	//getldw();
	//가능한 면책 수수료 가져오기
	var branchId = $('#branchId').val();
	var carModel = _carDtl;
	var aLdwId = $('#ldwId').val();
	
	if(branchId != ''&& carModel != ''){
		$.ajax({
			url : "/rent/rentcar/getLdw.json",
			type : "post",
			data : JSON.stringify({"branchId":branchId, "carTypeName":carModel}),
			dataType : "json",
			contentType:"application/json",
			success : function(data){
				console.log("getldw()\n지점선택,차량선택을 했을 때 실행되는 getLdw.json");
				
				var map = data.timeList;
				
				var ldw = map.ldw.split(',');
				var str = '<option value="">차량손해면책제도 선택</option>';
				var val = '';
				for(var i = 0; i < ldw.length; i++){
					var tmp = ldw[i].split("@");
					if(tmp[0] != '428009'){
						if(tmp[2] == 0){
							str += "<option value='"+tmp[0]+"'>"+tmp[1]+"(면책금 "+tmp[2]+"원)</option>";
						}else{
							str += "<option value='"+tmp[0]+"'>"+tmp[1]+"(면책금 "+tmp[2]+"만 원)</option>";
						}
					}else{
						str += "<option value='"+tmp[0]+"'>"+tmp[1]+"</option>";
					}
				}
				$('#ldwId').html(str);
				
				$("#ldwId option[value='']").attr("selected", "selected");
				
				$("#cfm_iRateAmt").text($("#ldwId option:selected").text());
				
				getPayment();
			},
			error : function(){
				alert('데이터 통신이 실패했습니다.\n잠시 후 다시 시도하세요.');
			}
		}); 
	}	
	
}


//최종적으로 값 다시 산정해서 뿌릴때 사용할것.
function getPayment() {
	var model       = _carDtl;
	
	if (model == null) {
		$("#rateAmt").html("0 원");//표준금액
		$("#oneWay").html("0 원");//편도수수료
		$("#iRateAmt").html("선택안함<br/>0 원"); //자차면책보상금
		$("#discountAmt").html("-0 원");//할인금액
		$("#rentPayment").html("0"); //총 결제금액
		$("#eventAmt").html("-0 원");//벤츠 프로모션 할인가격
		return;
	}
	
	var branchId    = $("#branchId").val();
	var branchId2    = $("#branchId2").val();
	var ldwId = "428009"; 
	var benzYn = "";
	if( model.substring(0,2) == "BE"){
		benzYn = $("[name=benzYn]").is(":checked")?$("[name=benzYn]").val():"";
	}
		
	if($("#ldwId").val() != null && $("#ldwId").val() != "") ldwId = $("#ldwId").val();
	
	var dt1 = $("#rentDateTime1").val();
	var dt2 = $("#rentDateTime2").val();

	console.log(dt1);
	console.log(dt2);
	
	if(model != null && model != '' && branchId != null && branchId != '' && branchId2 != null && branchId2 != '' 
	&& dt1 != null && dt2 != '' && dt1.length == 12 && dt2.length == 12){
		console.log("ldwID="+ldwId);
		var data = {"branchId" : branchId
					,"branchId2" : branchId2
					,"sDate" : dt1
					,"lDate" : dt2
					,"model" : model
					,"dcCardId" : $("#dcCardId").val()
					,"ldwId" : ldwId
					,"benzYn" : benzYn
					,"loginId" : $("#tMode").val() 
		};
		//금액 계산
		$.ajax({
			type : "post",
			url : "/rent/rentcar/getRentPayment.json",
			data : JSON.stringify(data),
			dataType : "json",
			contentType:"application/json",
			mimeType: 'application/json',
			processData : false,
			cache : false,
			success : function(data) {
				console.log("getPayment()\n getRentPayment.json");
				var rentTerm;
				var payment = 0;
				var nRate 		= data.noRate;//정상대여료
				var discount	= data.discount;//총 할인금액
				var iRate 		= data.inRate;//면책보상수수료
				var inRateDcAmt = data.inRateDcAmt;//면책보상수수료 할인금액
				var dcRate 		= data.dcRate;//할인 후 결제 금액
				var oneWay 		= data.oneWay;//편도 수수료
				var benzAmt 	= data.benzPromotionAmt;//벤츠 프로모션 할인가격
				var branchDcAmt = data.branchDcAmt; //지점추가할인금액	
				
				console.log(nRate+"\n"+discount+"\n"+iRate+"\n"+dcRate+"\n"+oneWay+"\n"+benzAmt+"\n"+branchDcAmt);

				// 2014-09-02 : OCB 할인 추가 : P00000028041
				var ocbDiscount = 0; //OCB 할인
				var totalPayment = 0; //OCB 최종
				if(nRate > 0){
					payment = nRate*1 - discount*1 + iRate*1 + oneWay*1 - benzAmt*1 ;
				}

				if( parseInt(payment) >= 0 ){
					$("#rateAmt").html(formatCommas(nRate*1+"")+" 원");//표준금액
					$("#oneWay").html(formatCommas(oneWay*1+"")+" 원");//편도수수료
					
					var ldwNm = "";
					if(ldwId == '428001') ldwNm="일반 자차";
					if(ldwId == '428002') ldwNm="PLUS 자차";
					if(ldwId == '428003') ldwNm="SUPER 자차";
					if(ldwId == '428004') ldwNm="완전 자차";
					if(ldwId == '428009') ldwNm="선택안함";
					
					if(parseInt(inRateDcAmt) > 0){
						$("#iRateLdwAmt").show();
						$("#inRateDcAmt").show();
						
						var totalIrentAmt = (iRate*1) + (inRateDcAmt*1);
						
						$("#iRateLdwAmt").html(ldwNm+"<br/>"+formatCommas(totalIrentAmt*1+" 원")); //자차면책보상금
						$("#inRateDcAmt").html("이벤트 할인<br/>-"+formatCommas(inRateDcAmt*1+" 원")); //자차면책보상금 할인가격
						$("#iRateAmt").html("최종 보험료<br/>"+formatCommas(iRate*1+"")+" 원"); //자차면책보상금
						
						$(".counsel-dim-dcPremium").show();
						$("#eventPopup211210").show();
						$('#noEvent2112').hide();
						
						$("#noEvent2112_ldw").hide();
						$('#noEvent2112_ldw_no').show();
					}else{
						$("#iRateAmt").html(ldwNm+"<br/>"+formatCommas(iRate*1+"")+" 원"); //자차면책보상금
						$("#iRateLdwAmt").hide();
						$("#inRateDcAmt").hide();
						$('#noEvent2112').show();
						
						$("#noEvent2112_ldw").show();
						$('#noEvent2112_ldw_no').hide();
					}
					
					$("#discountAmt").html("-"+formatCommas(discount*1+"")+" 원");//할인금액
					$("#rentPayment").html(formatCommas(payment+"")); //총 결제금액
					$("#eventAmt").html("-"+formatCommas(benzAmt+"")+" 원");//벤츠 프로모션 할인가격

					if(branchDcAmt != 0){
						$("#event_apply").show();
					} else {
						$("#event_apply").hide();
					}
				}
			},
			error : function(){
				alert('데이터 통신이 실패했습니다.\n잠시 후 다시 시도하세요.');
			} 
		});	
	}else{
		$("#rateAmt").html("0 원");//표준금액
		$("#oneWay").html("0 원");//편도수수료
		$("#iRateAmt").html("선택안함<br/>0 원"); //자차면책보상금
		$("#discountAmt").html("-0 원");//할인금액
		$("#rentPayment").html("0"); //총 결제금액
		$("#eventAmt").html("-0 원");//벤츠 프로모션 할인가격
		$("#iRateLdwAmt").hide();
		$("#inRateDcAmt").hide();
	}
}

function chkRentTerm(){

}

var jejuFlag=true;
function init(){
	var s_hour = S_TIME;
	
	console.log("현재 시간 +1시간="+S_TIME);
	
	var pSDate = $("#params_sDate").val();
	if (pSDate != '')
	{
		setShortParams();
	}
	else
	{
		getCar();
	}
}

function infoClear(){
	var userClass = $("#userClass").val();
	var dcCardId = $("#dcCardId").val();
	
	if(confirm("입력하신 정보를 모두 초기화하시겠습니까?\n입력하신 정보는 저장되지 않습니다.")){
		if(dcCardId == 'P00000028088' || dcCardId == 'P00000028297' || dcCardId == ''){//닷컴
			if($("#branchId").val() == '000012'){
				location.href = "/mobile/rentcar/reservation_new_jeju.do";
			}else{
				location.href = "/mobile/rentcar/reservation_new.do";
			}
		}else{//제휴
			if($("#branchId").val() == '000012'){
				location.href = "/mobile/rentcar/corp/reservation_jeju.do";
			}else{
				location.href = "/mobile/rentcar/corp/reservation_inland.do";
			}
		}
	}
}

function corpInfoClear(){
	if(confirm("입력하신 정보를 모두 초기화하시겠습니까?\n입력하신 정보는 저장되지 않습니다.")){
		location.href = "/mobile/rentcar/corp/reservation_jeju.do";
	}
}

function dateValueTrd() {
	var time = new Date();
	var year = time.getFullYear() + "";
	var month = time.getMonth() + 1;
	var date = time.getDate();
	var hour = time.getHours();
	var min = time.getMinutes();
	var sec = time.getSeconds();
	var secadd = time.getSeconds();
	if (month < 10) {
		month = "0" + month;
	}
	if (date < 10) {
		date = "0" + date;
	}
	if (hour < 10) {
		hour = "0" + hour;
	}
	if (min < 10) {
		min = "0" + min;
	}
	if (sec < 10) {
		sec = "0" + sec;
	}
	return year + month + date + hour + min + sec + "000";
}
function dateValue() {
	var time = new Date();
	var year = time.getFullYear() + "";
	var month = time.getMonth() + 1;
	var date = time.getDate();
	var hour = time.getHours();
	var min = time.getMinutes();
	var sec = time.getSeconds();
	if (month < 10) {
		month = "0" + month;
	}
	if (date < 10) {
		date = "0" + date;
	}
	if (hour < 10) {
		hour = "0" + hour;
	}
	if (min < 10) {
		min = "0" + min;
	}
	if (sec < 10) {
		sec = "0" + sec;
	}
	return year + month + date + hour + min + sec;
}
function random_num(){
	var ran;
	ran = (Math.floor(Math.random()*9999))+1;
	
	if(ran < 10){
		ran = "000"+ran;
	}else if(ran >= 10 && ran < 99){
		ran = "00"+ran;
	}else if(ran >= 100 && ran < 999){
	    ran = "0"+ran;
	}
	
	return ran;
}

var _isRes_check = false;


//다음버튼 클릭시
function nextPage(){
	
	console.log("nextPage()");
	if ($("#nextBtn").hasClass("disabled"))
	{
		console.log("다음버튼 비활성화 상태.");
		return;
	}
	console.log("다음버튼 활성화 상태");
	
	///예약등록
	$("#carTypeName").val(_carDtl);
	
	var sDate = "";
	var lDate = "";
	
	$("#dptDtm").val($("#rentDateTime1").val());
	$("#arvDtm").val($("#rentDateTime2").val());
	
	var memId = $("#memId").val();
	var model = _carDtl;
	
	if(model && model.substring(0,2) == "BE"){
		if($("[name=benzYn]").is(":checked")) $("#benzCd").val($("[name=benzYn]").val());
		else $("#benzCd").val("");
	}else{
		$("#benzCd").val("");
	}
	
	// 운전자 체크
	if( $("#userNm").val() != $("#checkUserNm").val() && $("#birthday").val() != $("#checkBirthday").val() ){
		alert("예약자 정보와 운전자 정보가 일치하지 않습니다. 계약자 정보를 직접 입력해 주세요!");
		$("#userNm").val( $("#checkUserNm").val() );
		$("#birthday").val( $("#checkBirthday").val() );
		
		setInfoTab('u');
		$("#licenseTab ul li:eq(0)").addClass("selected");		
		$("#licenseTab ul li:eq(1)").removeClass("selected");
		
		var offset = $("[name=userNm]").offset();
		$("html, body").animate({scrollTop: offset.top-200}, 10);
		
		hasNext = false;
		return false;
	}
	
	if($("#branchId").val() == '000012'){
		try{
//			console.log('차량ID='+model+', 차량명='+$("#rentCarNm").text()+', 벤츠 동의여부='+$("#benzCd").val()+', 면책제도종류='+$("#ldwId").val()+', 개인정보입력여부='+essCheck());
			setUserSelectTrace(model, $("#rentCarNm").text(), $("#benzCd").val(), $("#ldwId").val(),essCheck()); //웹로그 정보 입력
		}catch(e){
			console.log("error : web setUserSelectTrace log 생성 오류");
		}
	}
	
	//국제면허일 경우
	var licenseType = $("[name=licenseType]").val();
	if(licenseType == '106009'){
		hasLcnOk = true;
		hasNext = true;
	}
	
	var termsOk = $("#select-terms0:checked").length == 1;
	if(!hasFirst && hasLcnOk && !hasResChange)
		hasNext = true;
	
	if(essCheck() && hasNext){
		//약관 동의를 하지 않았으면 약관동의 섹션을 열어준다
		if (!termsOk)
		{
			accd_close('#accord_rent');
			accd_close('#accord_user');
			accd_open('#accord-term');
			alert("이용약관을 동의하지 않으셨습니다. 이용약관을 미동의시 렌터카 서비스 이용이 불가능합니다.");
			//var offset = $('#select-terms0').offset();
			//$("html, body").animate({scrollTop: offset.top-150}, 10);
		}else{
			/*
			$("#licenseAvil2").blur();
			$("#modal-reservation-info").show();
			//약관동의했으면 다음페이지로 진행
			*/
			$("#reservForm").attr("action","/mobile/rentcar/reservation_update.do?mode=RentProc");
			reserve_submit();
		}
	}
	else if( $('#accord_rent').attr("class") == "accordion-list__list is-selected" ){
		var check = true;
		
		if($("#ldwId").val()==null ||$("#ldwId").val()==""){
			check = false;
		}
		
		if($.trim(_carDtl) == "" ){
			check = false;
		}

		if($("#rentDateTime1").val() == "" || $("#rentDateTime2").val() == ""){
			check = false;
		}
		
		if(check == true){
			accd_close('#accord_rent');
			accd_open('#accord_user');
			accd_close('#accord-term');	
		} else {
			accd_open('#accord_rent');
			accd_close('#accord_user');
			accd_close('#accord-term');	
		}
	}
	else{
		//show_rsv_info();
		accd_close('#accord_rent');
		accd_open('#accord_user');
		accd_close('#accord-term');
	}
}

//제휴사 예약등록 페에지 이동
function nextCorpPage(){

	///예약등록
	$("#carTypeName").val(_carDtl);
	
	var sDate = "";
	var lDate = "";
	
	$("#dptDtm").val($("#rentDateTime1").val());
	$("#arvDtm").val($("#rentDateTime2").val());
	
	var memId = $("#memId").val();
	var model = _carDtl;
	
	if(model && model.substring(0,2) == "BE"){
		if($("[name=benzYn]").is(":checked")) $("#benzCd").val($("[name=benzYn]").val());
		else $("#benzCd").val("");
	}else{
		$("#benzCd").val("");
	}
	
	if($("#branchId").val() == '000012'){
		try{
//			console.log('차량ID='+model+', 차량명='+$("#rentCarNm").text()+', 벤츠 동의여부='+$("#benzCd").val()+', 면책제도종류='+$("#ldwId").val()+', 개인정보입력여부='+essCheck());
			setUserSelectTrace(model, $("#rentCarNm").text(), $("#benzCd").val(), $("#ldwId").val(),essCheck()); //웹로그 정보 입력
		}catch(e){
			console.log("error : web setUserSelectTrace log 생성 오류");
		}
	}
	
	var termsOk = $("#select-terms0:checked").length == 1;
	
	if(!hasFirst && hasLcnOk && !hasResChange)
		hasNext = true;
	
	if(essCheck() && hasNext){
		//약관 동의를 하지 않았으면 약관동의 섹션을 열어준다
		if (!termsOk)
		{
			accd_close('#accord_rent');
			accd_close('#accord_user');
			accd_open('#accord-term');
			alert("이용약관을 동의하지 않으셨습니다. 이용약관을 미동의시 렌터카 서비스 이용이 불가능합니다.");
		}else{
			/*
			$("#licenseAvil2").blur();
			$("#modal-reservation-info").show();
			//약관동의했으면 다음페이지로 진행
			*/
			$("#reservForm").attr("action","/mobile/rentcar/corp/reservation_update.do?mode=RentProc");

			reserve_submit();
		}
	}
	else if( $('#accord_rent').attr("class") == "accordion-list__list is-selected" ){
		var check = true;
		
		if($("#ldwId").val()==null ||$("#ldwId").val()==""){
			check = false;
		}
		
		if($.trim(_carDtl) == "" ){
			check = false;
		}

		if($("#rentDateTime1").val() == "" || $("#rentDateTime2").val() == ""){
			check = false;
		}
		
		if(check == true){
			accd_close('#accord_rent');
			accd_open('#accord_user');
			accd_close('#accord-term');	
		} else {
			accd_open('#accord_rent');
			accd_close('#accord_user');
			accd_close('#accord-term');	
		}
	}
	else{
		//show_rsv_info();
		accd_close('#accord_rent');
		accd_open('#accord_user');
		accd_close('#accord-term');
	}
}


//나이 체크 
function ageCheck(age){
	var nd = new Date();
	var year = nd.getFullYear();
	var month = (nd.getMonth()+1)<10?"0"+(nd.getMonth()+1):(nd.getMonth()+1);
	var date = nd.getDate()<10?"0"+nd.getDate():nd.getDate();
	//var std = year+""+month+""+date;
	var std = $("#rentDateTime1").val().substr(0,8);
	var birthDayCheck = (Number(std)-Number($('[name=birthday]').val()) >= (age*10000));
	
	return birthDayCheck;
}

//만 나이 리턴 체크 
function ageReturnCheck(birthDay){
	//var nd = new Date();
	//var year = nd.getFullYear();
	//var month = (nd.getMonth()+1)<10?"0"+(nd.getMonth()+1):(nd.getMonth()+1);
	//var date = nd.getDate()<10?"0"+nd.getDate():nd.getDate();
	
	// 대여일 기준으로 나이 체킹
	var sDate = $("#rentDateTime1").val().substr(0,8);
	var year = sDate.substr(0,4);
	var month = sDate.substr(4,2);
	var date = sDate.substr(6,2);
	
	var std = year+""+month+""+date;
	var stdMd = month+""+date;
	
	var birthDayCheck = String(birthDay);
	var birthDayYear = birthDayCheck.substring(0,4);
	var birthDayMd = birthDayCheck.substring(4,8);
	
	var age = stdMd < birthDayMd ? year - birthDayYear -1 : year - birthDayYear;
	
	return age;
}

function essCheck(){//값 체크
	var check = true;
	var userClass = $("#userClass").val();
	
	var branchId = $("#branchId").val();
	var nd = new Date();
	var year = nd.getFullYear();
	var month = (nd.getMonth()+1)<10?"0"+(nd.getMonth()+1):(nd.getMonth()+1);
	var date = nd.getDate()<10?"0"+nd.getDate():nd.getDate();
	//var std = year+""+month+""+date; 
	var std = $("#rentDateTime1").val().substring(0,8).replace(/-/g,"");
	var birthDay = $('[name=birthday]').val();
	var birthDayCheck = (Number(std)-Number(birthDay) >= 210000);
	var birthYr = birthDay.substring(0,4);
	var birthMn = birthDay.substring(4,6);
	var birthDt = birthDay.substring(6,8);

	var startDt = "";
	var endDt = "";
	var hasLcnChkVal = true;
	var offset = "";
	
	if($("#rentDateTime1").val()!= null && $("#rentDateTime1").val()!=""){ 
		startDt = dateFormat($('#rentDateTime1').val(),'',0);
		hasLcnChkVal = false;
	}
	
	if($("#rentDateTime2").val()!= null && $("#rentDateTime2").val()!=""){
		endDt = dateFormat($('#rentDateTime2').val(),'',0);
		hasLcnChkVal = false;
	}
	
	if(branchId == "000012" && $("#ldwId").val() == "428001"){
		/*
		if(_carDtl != null && _carTab != '6'){
			alert("제주지점 일반자차는 수입/전기 차량만 이용 가능합니다.");
			check =  false;
		}
		*/ 
	}
	
	if ($('#licenseIssued').val()=='' || $('#licenseIssued').val().length<8) {
		$("#alert-lcnsIssued").addClass("alert-msg");
		$("#msg-lcnsIssued").html("운전면허 발급일을 입력해주세요.");
		offset = $('#licenseIssued').offset();
		check = false;		
	}else{
		if($("#msg-lcnsIssued").html() != ""){
			offset = $('#licenseIssued').offset();
			check = false;
		}
	}

	//기존 및 추가 만료일 체크
	var licenseType = $("[name=licenseType]").val();
	var licenseAvil = $('[name=licenseAvil]').val();
	var lcnsYr2 = licenseAvil.substring(0,4);
	var lcnsMn2 = licenseAvil.substring(4,6);
	var lcnsDt2 = licenseAvil.substring(6,8);
	licenseAvil = licenseAvilCheck();
	console.log("DDDDDDDDDDDDDDDDD1 : ", licenseAvil);
	
	if (licenseAvil == '' || licenseAvil.length < 8) {
		$("#alert-lcnsAvil").addClass("alert-msg");
		$("#msg-lcnsAvil").html("적성검사 만료일을 입력해주세요.");
		offset = $('[name=licenseAvil]').offset();
		hasLcnChkVal = false;
		check = false;
	}else if(parseInt(licenseAvil)<parseInt(startDt) || parseInt(licenseAvil)<parseInt(endDt)){
		if(licenseType != "" && licenseType != "106005"){
			$("#alert-lcnsAvil").addClass("alert-msg");
			$("#msg-lcnsAvil").html("적성검사 만료일이 반납일 이후여야 예약 가능합니다.");
			offset = $('[name=licenseAvil]').offset();
			hasLcnChkVal = false;
			check = false;	
		}
	}else if(lcnsMn2 > 12 || lcnsDt2 > 31 || lcnsMn2 == '00' || lcnsDt2 == '00'){
		$("#alert-lcnsAvil").addClass("alert-msg");
		$("#msg-lcnsAvil").html("적성검사 만료일을 정확히 입력해주세요.");					
		offset = $('[name=licenseAvil]').offset();
		hasLcnChkVal = false;
		check = false;
	}
	
	
	//alert($('[name=licenseNo2]').val());
	if ($('[name=licenseNo]').val().length<12 ||$('[name=licenseNo]').val().length>12) {
		$("#alert-lcnsNo").addClass("alert-msg");
		$("#msg-lcnsNo").html("면허번호를 입력해주세요.");
		offset = $('[name=licenseNo]').offset();
		hasLcnChkVal = false;
		check = false;
	}else if($('[name=licenseNo]').val().length == 12){
		var lcnsArea = $('[name=licenseNo]').val().substring(0,2);
		
		var licenseType = $("[name=licenseType]").val();
		//국제면허일 경우 
		if(licenseType == '106009'){
			
		}else{
			var areaFl = false;

			for(var i=0; i<areaArr.length;i++){
				if(areaArr[i] == lcnsArea) areaFl = true;
			} 
			
			if(!areaFl){
				$("#alert-lcnsNo").addClass("alert-msg");
				$("#msg-lcnsNo").html("면허번호를 정확히 입력해주세요.");
				offset = $('[name=licenseNo]').offset();
				check = false;
				hasLcnChkVal = false;
			}else{
				$("[name=licenseNo]").val($('[name=licenseNo]').val()); 
			}
		}
		
		
	}
	
	//alert($("[name=licenseNo]").val());	
	if($('[name=licenseType]').val()==''){
		$("#alert-lcnsType").addClass("alert-msg");
		$("#msg-lcnsType").html("면허종류를 선택해주세요.");
		offset = $('#licenseType').offset();
		check =  false;
		hasLcnChkVal = false;
	}

	if($('[name=homeAddr]').val()==''){
		$(".alert-addr").addClass("alert-msg");
		$("#msg-addr").html("주소를 입력해주세요.");
		offset = $('[name=homeAddr]').offset();
		check = false;
	}
	
	//이메일 필수 해제
	//if($('[name=email]').val()==''){
	//	$(".alert-email").addClass("alert-msg");
	//	$("#msg-email").html("이메일을 입력해주세요.");
	//	var offset = $('[name=emailId]').offset();
	//	$("html, body").animate({scrollTop: offset.top-200}, 10);
	//	check = false;
	//}
	
	if($('[name=mobile]').val()==''){
		$("#alert-mobile").addClass("alert-msg");
		$("#msg-mobile").html("휴대폰 번호를 입력해주세요.");
		offset = $('[name=mobile]').offset();
		check = false;
	}else if($('[name=mobile]').val().length < 10){
		$("#alert-mobile").addClass("alert-msg");
		$("#msg-mobile").html("띄어쓰기 없이 10자 이상의 숫자만 입력 가능합니다.");
		offset = $('[name=mobile]').offset();
		check = false;
	}
	
	var regExpHp = /^01([0|1|6|7|8|9]?)-?([0-9]{3,4})-?([0-9]{4})$/;
	if ( !regExpHp.test($('[name=mobile]').val()) ) {
		$("#alert-mobile").addClass("alert-msg");
		$("#msg-mobile").html("올바른 휴대폰 번호를 입력해주세요.");
		offset = $('[name=mobile]').offset();
		check = false;
	}	
	
	if(birthDay == '' ||birthDay.length < 8){
		$("#alert-birth").addClass("alert-msg");
		$("#msg-birth").html("생년월일을 입력해주세요.");
		offset = $('[name=birthday]').offset();
		check = false;
		hasLcnChkVal = false;
	}else if(!birthDayCheck){
		$("#alert-birth").addClass("alert-msg");
		$("#msg-birth").html("만 21세이상부터 예약 가능합니다.");
		offset = $('[name=birthday]').offset();
		check = false;
		hasLcnChkVal = false;
	}else if(birthMn > 12 || birthDt > 31 || birthMn == '00' || birthDt == '00'){
		$("#alert-birth").addClass("alert-msg");
		$("#msg-birth").html("생년월일을 정확히 입력해주세요.");
		offset = $('[name=birthday]').offset();
		check = false;
		hasLcnChkVal = false;
	}
	
	if($('[name=userNm]').val()==''){
		$("#alert-name").addClass("alert-msg");
		$("#msg-name").html("이름을 입력해주세요.");
		offset = $("[name=userNm]").offset();
		check = false;
		hasLcnChkVal = false;
	}
	
	if($("#ldwId").val()==null ||$("#ldwId").val()==""){
		$("#ldwId").addClass("borderorange");
		$("#msg-ldw").html("차량손해면책제도를 선택해주세요.");
		
		accd_open('#accord_rent');
		accd_close('#accord_user');
		accd_close('#accord-term');
		
		offset = $("[name=ldwId]").offset();
		check = false;
	}
	
	if($.trim(_carDtl) == "" ){
		$("#alert-car").addClass("alert-msg");
		$("#msg-car").html("대여차량을 선택해주세요.");
		
		accd_open('#accord_rent');
		accd_close('#accord_user');
		accd_close('#accord-term');
		
		offset = $("#alert-cartype").offset();
		check = false;
	}

	if($("#rentDateTime1").val() == "" || $("#rentDateTime2").val() == ""){
		$("#alert-lDate").addClass("alert-msg");
		$("#alert-sDate").addClass("alert-msg");
		$("#msg-date").html("대여/반납 정보를 선택해주세요.");
		
		accd_open('#accord_rent');
		accd_close('#accord_user');
		accd_close('#accord-term');
		
		offset = $('#msg-date').offset();
		
		check = false;
	}
	
	if(check == false) {
		$("html, body").animate({scrollTop: offset.top-200}, 10);	
	}
	
	return check;
}

function ldwAbleCheck(){
	console.log("ldwAbleCheck --- 차량손해면책제도 활성화 체크");

	console.log("지역 = "+$("[name=cdId]").val());
	console.log("지역2 = "+$("[name=cdId2]").val());
	console.log("지점 = "+$("[name=branchId]").val());
	console.log("지점2 = "+$("[name=branchId2]").val());
	console.log("차량 = "+_carDtl);

		
	if($("#rentDateTime1").val() != "" && $("#rentDateTime2").val() != "" 
			&&($("[name=cdId]").val() != "" && $("[name=cdId]").val() != null)
			&&($("[name=cdId2]").val() != "" && $("[name=cdId2]").val() != null)
			&&($("[name=branchId]").val() != "" && $("[name=branchId]").val() != null)
			&&($("[name=branchId2]").val() != "" && $("[name=branchId2]").val() != null)
			&&(_carDtl != "" && _carDtl != null)){
		console.log("ldw 활성화");		
		$("#ldwId").prop("disabled", false);
		
		// getldw() - start
		//가용차정 체크 후 차량손해면책제도 활성화 체크하도록 변경
		
		var branchId = $('#branchId').val();
		var carModel = _carDtl;
		var aLdwId = $('#ldwId').val();
		
		if(branchId != ''&& carModel != ''){
			$.ajax({
				url : "/rent/rentcar/getLdw.json",
				type : "post",
				data : JSON.stringify({"branchId":branchId, "carTypeName":carModel}),
				dataType : "json",
				contentType:"application/json",
				success : function(data){
					console.log("getldw()\n지점선택,차량선택을 했을 때 실행되는 getLdw.json");
					console.log("선택해주세요");
					
					var map = data.timeList;
					
					var ldw = map.ldw.split(',');
					var str = '<option value="">차량손해면책제도 선택</option>';
					var val = '';
					for(var i = 0; i < ldw.length; i++){
						var tmp = ldw[i].split("@");
						if(tmp[0] != '428009'){
							if(tmp[2] == 0){
								str += "<option value='"+tmp[0]+"'>"+tmp[1]+"(면책금 "+tmp[2]+"원)</option>";
							}else{
								str += "<option value='"+tmp[0]+"'>"+tmp[1]+"(면책금 "+tmp[2]+"만 원)</option>";
							}							
						}else{
							str += "<option value='"+tmp[0]+"'>"+tmp[1]+"</option>";
						}
					}
					$('#ldwId').html(str);
					
					$("#ldwId option[value='']").attr("selected", "selected");
					
					getPayment();
					
					$("#cfm_iRateAmt").text($("#ldwId option:selected").text());
					
					//setTimeout(showResInfo(),500);
				},
				error : function(){
					alert('데이터 통신이 실패했습니다.\n잠시 후 다시 시도하세요.');
				}
			}); 
		}
		
		// getldw() - end
		
	}else{
		console.log("ldw 비활성화");
		$("#ldwId").prop("disabled", true);
		
	}
	
}

//////////////////////////////

//[S]값 체크[S]//
var birthFlag = true;
var lcnsAvilFlag = true;

function checkingName(){ //이름에 숫자 못 들어가도록 체크
	var checkedValue = $("[name=userNm]").val();
	var checkedLength = checkedValue.length;
	var char_ASCII = event.keyCode;
	if(char_ASCII == 32){
		if(checkedLength == 1){
			$("[name=userNm]").val("");
		}else{
			$("[name=userNm]").val(checkedValue.trim());
		}
	}
	 
	if(checkedLength != 0){
		if(!noNumberKey()){
			if(checkedLength == 1){
				$("[name=userNm]").val("");
			}else{
				$("[name=userNm]").val(checkedValue.substring(0,checkedLength-1));
			}
		}else{
			if(checkedLength > 20){
				$("[name=userNm]").val(checkedValue.substring(0,20));
			}else{
				$("#alert-name").removeClass("alert-msg");
				$("#msg-name").html("");
			}
		}
	}else{
		$("#alert-name").addClass("alert-msg");
		$("#msg-name").html("이름을 입력해주세요.");
	}
	
}

function checkingBirth(){//생일에 문자 못 들어가도록 체크, 성인 체크
	var num_pattern = /^[0-9]+$/;//숫자패턴
	var checkedValue = $("[name=birthday]").val();
	var checkedLength = checkedValue.length;
	var char_ASCII = event.keyCode;
	if(char_ASCII == 32){
		if(checkedLength == 1){
			$("[name=birthday]").val("");
		}else{
			$("[name=birthday]").val(checkedValue.trim());
		}
	}
	
	var nd = new Date();
	var year = nd.getFullYear();
	var month = (nd.getMonth()+1)<10?"0"+(nd.getMonth()+1):(nd.getMonth()+1);
	var date = nd.getDate()<10?"0"+nd.getDate():nd.getDate();
	//var std = year+""+month+""+date;
	var std = $("#rentDateTime1").val().substring(0,8).replace(/-/g,"");
	var birthDayCheck = (Number(std)-Number($('[name=birthday]').val()) >= 210000);
	
	if(checkedLength != 0){
		if(!num_pattern.test(checkedValue)){
			if(checkedLength == 1){
				$("[name=birthday]").val("");
			}else{
				$("[name=birthday]").val(checkedValue.substring(0,checkedLength-1));
			}
			birthFlag = false;
		}else{
			if(checkedLength == 8){
				var birthYr = checkedValue.substring(0,4);
				var birthMn = checkedValue.substring(4,6);
				var birthDt = checkedValue.substring(6,8);
				
				console.log(birthYr+"-"+birthMn+"-"+birthDt);			

				if(birthMn > 12 || birthDt > 31 || birthMn == '00' || birthDt == '00'){
					$("#alert-birth").addClass("alert-msg");
					$("#msg-birth").html("생년월일을 정확히 입력해주세요.");
					$("[name=birthday]").focus();
					birthFlag = false;
					return false;
				}else{
					if(!birthDayCheck){//성인체크
						$("#alert-birth").addClass("alert-msg");
						$("#msg-birth").html("만 21세이상부터 예약 가능합니다.");
						$("#birthday").prop('readonly',false);
						$("[name=birthday]").focus();
						birthFlag = false;
						return false;
					}else{
						console.log($("#birthday").val()+"!!!!!!!!!!");	
						$("#alert-birth").removeClass("alert-msg");
						$("#msg-birth").html("");
						$("#reservBirth").val($("#birthday").val());
						
						birthFlag = true;
					}	
				}
				
			}else if(checkedLength > 8){
				$("[name=birthday]").val(checkedValue.substring(0,8));
				
				var birthYr = $("[name=birthday]").val().substring(0,4);
				var birthMn = $("[name=birthday]").val().substring(4,6);
				var birthDt = $("[name=birthday]").val().substring(6,8);
				var birthDayCheck2 = (Number(std)-Number($('[name=birthday]').val()) >= 210000);
				
				if(birthMn > 12 || birthDt > 31 || birthMn == '00' || birthDt == '00'){
					$("#alert-birth").addClass("alert-msg");
					$("#msg-birth").html("생년월일을 정확히 입력해주세요.");
					$("[name=birthday]").focus();
					birthFlag = false;
					return false;
				}else{
					if(!birthDayCheck2){//성인체크
						$("#alert-birth").addClass("alert-msg");
						$("#msg-birth").html("만 21세이상부터 예약 가능합니다.");
						$("[name=birthday]").focus();
						birthFlag = false;
						return false;
					}else{
						console.log($("#birthday").val()+"@@@@@@@@@@");	
						$("#alert-birth").removeClass("alert-msg");
						$("#msg-birth").html("");
						$("#reservBirth").val($("#birthday").val());
						birthFlag = true;
					}	
				}
			}else if(checkedLength < 8){
				$("#alert-birth").addClass("alert-msg");
				$("#msg-birth").html("생년월일을 정확히 입력해주세요.");
				$("[name=birthday]").focus();
				birthFlag = false;
				return false;
			}else{
				$("#alert-birth").removeClass("alert-msg");
				$("#msg-birth").html("");
				$("#reservBirth").val($("#birthday").val());
				birthFlag = true;
			}
		}
	}else{
		$("#alert-birth").addClass("alert-msg");
		$("#msg-birth").html("생년월일을 입력해주세요.");
	}
	
	console.log("birthFlag="+birthFlag);
}
function checkingHP(){
	var checkedValue = $("[name=mobile]").val();
	var checkedLength = checkedValue.length;
	var char_ASCII = event.keyCode;
	if(char_ASCII == 32){
		if(checkedLength == 1){
			$("[name=mobile]").val("");
		}else{
			$("[name=mobile]").val(checkedValue.trim());
		}
	}
	
	var regNumber = /^[0-9]*$/;
	
	if(checkedLength != 0){
		/*if(!onlyNumberKey()){
			if(checkedLength == 1){
				$("[name=mobile]").val("");
			}else{
				$("[name=mobile]").val(checkedValue.substring(0,checkedLength-1));
			}
		}else{*/
		var regExpHp = /^01([0|1|6|7|8|9]?)$/g;
		//var regExpHp = /^01([0|1|6|7|8|9]?)-?([0-9]{3,4})-?([0-9]{4})$/;
		var seNum = checkedValue.substring(0,3);
		
		if(seNum.length == 1 && seNum != "0"){
			$("[name=mobile]").val("");
		}else if(seNum.length < 3 && !regExpHp.test(seNum)){
			$("[name=mobile]").val(checkedValue.substring(0,1));
		}else if(seNum.length < 4 && !regExpHp.test(seNum)){
			$("[name=mobile]").val(checkedValue.substring(0,2));
		}
		else if(checkedLength > 11){
			$("[name=mobile]").val(checkedValue.substring(0,11));
console.log($("[name=mobile]").val()+"!!!!!!!!!!");				
			$("#alert-mobile").removeClass("alert-msg");
			$("#msg-mobile").html("");
			$("#reservHp").val($("[name=mobile]").val());
				
		}else if(checkedLength <= 11 && checkedLength >= 10){
console.log($("[name=mobile]").val()+"@@@@@@@@@@@@@");
			$("#alert-mobile").removeClass("alert-msg");
			$("#msg-mobile").html("");
			$("#reservHp").val($("[name=mobile]").val());
			
		}else if(checkedLength < 10){
			$("#alert-mobile").addClass("alert-msg");
			$("#msg-mobile").html("띄어쓰기 없이 10자 이상의 숫자만 입력 가능합니다.");
		}
		/*}*/
	}else{
		$("#alert-mobile").addClass("alert-msg");
		$("#msg-mobile").html("휴대폰 번호를 입력해주세요.");
	}
	
}
function checkingEmailId(){
	var pattern = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;//한글패턴
	var checkedValue = $("[name=emailId]").val();
	var checkedLength = checkedValue.length;
	var char_ASCII = event.keyCode;
	if(char_ASCII == 32){
		if(checkedLength == 1){
			$("[name=emailId]").val("");
		}else{
			$("[name=emailId]").val(checkedValue.trim());
		}
	}
	
	if(checkedLength != 0){
		if(pattern.test(checkedValue)){
			if(length == 1){
				$("[name=emailId]").val("");
			}else{
				$("[name=emailId]").val(checkedValue.substring(0,checkedLength-1));
			}
		}else{
			if(checkedLength > 30){
				$("[name=emailId]").val(checkedValue.substring(0,30));
			}else{
				if(checkedValue != "" && $("[name=domain]").val() != ""){
					$(".alert-email").removeClass("alert-msg");
					$("#msg-email").html("");
				}
			}
		}
	}else{
		//이메일 필수 해제
		//$(".alert-email").addClass("alert-msg");
		//$("#msg-email").html("이메일을 입력해주세요.");
	}
	
	
}
function checkingEmailDomain(){
	var pattern = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
	var checkedValue = $("[name=domain]").val();
	var checkedLength = checkedValue.length;
	var char_ASCII = event.keyCode;
	if(char_ASCII == 32){
		if(checkedLength == 1){
			$("[name=domain]").val("");
		}else{
			$("[name=domain]").val(checkedValue.trim());
		}
	}
	
	if(checkedLength != 0){
		if(pattern.test(checkedValue)){
			if(length == 1){
				$("[name=domain]").val("");
			}else{
				$("[name=domain]").val(checkedValue.substring(0,checkedLength-1));
			}
		}else{
			if(checkedLength > 30){
				$("[name=domain]").val(checkedValue.substring(0,30));
			}else{
				if(checkedValue != "" && $("[name=emailId]").val() != ""){
					$(".alert-email").removeClass("alert-msg");
					$("#msg-email").html("");
				}
			}
		}
	}else{
		//이메일 필수 해제
		//$(".alert-email").addClass("alert-msg");
		//$("#msg-email").html("이메일을 입력해주세요.");
	}
	
}
function checkingDtlAddr(){
	var mode = $("#rsvMode").val();
	var userCls = $("#userClass").val();
	var ldwID = $("#ldwId").val();
	
	if(mode == "jeju"){
		if(userCls == "0" && ldwID == "428004"){//제주도 회원 완전 자차일 때 처리방법
			var checkedValue = $("[name=homeDtlAddr]").val();
			var checkedLength = checkedValue.length;
			var char_ASCII = event.keyCode;
			if(char_ASCII == 32){
				if(checkedLength == 1){
					$("[name=homeDtlAddr]").val("");
				}else{
					$("[name=homeDtlAddr]").val(checkedValue.trim());
				}
			}
			
			if(checkedLength > 30){
				$("[name=homeDtlAddr]").val(checkedValue.substring(0,30));
			}			
		}else{//제주도 비회원 또는 회원이면서 완전 자차 아닐 때
			var checkedValue = $("[name=homeDtlAddr]").val();
			var checkedLength = checkedValue.length;
			var char_ASCII = event.keyCode;
			if(char_ASCII == 32){
				if(checkedLength == 1){
					$("[name=homeDtlAddr]").val("");
				}else{
					$("[name=homeDtlAddr]").val(checkedValue.trim());
				}
			}
			
			if(checkedLength > 30){
				$("[name=homeDtlAddr]").val(checkedValue.substring(0,30));
			}
			$("[name=homeDtlAddr]").val($("[name=homeDtlAddr]").val());
		}
	}else{//제주도가 아닐 때
		var checkedValue = $("[name=homeDtlAddr]").val();
		var checkedLength = checkedValue.length;
		var char_ASCII = event.keyCode;
		if(char_ASCII == 32){
			if(checkedLength == 1){
				$("[name=homeDtlAddr]").val("");
			}else{
				$("[name=homeDtlAddr]").val(checkedValue.trim());
			}
		}
		
		if(checkedLength > 30){
			$("[name=homeDtlAddr]").val(checkedValue.substring(0,30));
		}
	}
}

var areaArr = ["서울", "11", "부산", "12", "대구", "22", "인천", "23", "광주", "24", "대전", "25", "울산", "26", "경기", "13"
               ,"강원", "14", "충북", "15", "충남", "16", "전북", "17", "전남", "18", "경북", "19", "경남", "20", "제주", "21", "28"];
function checkingLicenseNo(){
	var special_pattern = /[_`~!@#$%^&*|\\\'\";:\/?/-]/gi;//특수문자 패턴
	var eng_pattern = /^[a-zA-Z]+$/gi;//영문패턴
	
	//var pattern = /^[ㄱ-ㅣ가-힣a-zA-Z0-9_\\s\\.\\?\\!\\-\\,|\u318D\u119E\u11A2\u2022\u2025a\u00B7\uFE55]*$/gi;
	
	//국제면허일 경우 패스해야함.
	var licenseType = $("[name=licenseType]").val();
	
	var mode = $("#rsvMode").val();
	var userCls = $("#userClass").val();
	var ldwID = $("#ldwId").val();
	
	
	/*20180222 면허번호검증 process 적용*/
	var checkedValue = $("[name=licenseNo]").val();
	var checkedLength = checkedValue.length;
	var eventValue = checkedValue.charAt(checkedLength-1);
	var char_ASCII = event.keyCode;
	if(char_ASCII == 32){
		if(checkedLength == 1){
			$("[name=licenseNo]").val("");
		}else{
			$("[name=licenseNo]").val(checkedValue.trim());
		}
	}
	
	//국제면허일 경우 빈값여부만 체크
	if(licenseType == '106009'){
		if(checkedLength != 0){
			if(special_pattern.test(eventValue)){//특수문자 체크
				if(checkedLength == 1){
					$("[name=licenseNo]").val("");
				}else{
					$("[name=licenseNo]").val(checkedValue.substring(0,checkedLength-1));
				}
			}
			if(checkedLength > 12){
				$("[name=licenseNo]").val(checkedValue.substring(0,12));
				var lcnsArea = checkedValue.substring(0,2);
				var areaFl = false;

				for(var i=0; i<areaArr.length;i++){
					if(areaArr[i] == lcnsArea) areaFl = true;
				}
				
				if(!areaFl){
					$("#alert-lcnsNo").addClass("alert-msg");
					$("#msg-lcnsNo").html("면허번호를 정확히 입력해주세요.");
				}else{
					$("#alert-lcnsNo").removeClass("alert-msg");
					$("#msg-lcnsNo").html("");
				}
			}else if(checkedLength == 12){
				$("#alert-lcnsNo").removeClass("alert-msg");
				$("#msg-lcnsNo").html("");
			}
		}else{
			$("#alert-lcnsNo").addClass("alert-msg");
			$("#msg-lcnsNo").html("면허번호를 입력해주세요.");
		}
	}else{
		if(checkedLength != 0){
			if(eng_pattern.test(eventValue)){//영문 체크
				if(checkedLength == 1){
					$("[name=licenseNo]").val("");
				}else{
					$("[name=licenseNo]").val(checkedValue.substring(0,checkedLength-1));
				}
			}else if(special_pattern.test(eventValue)){//특수문자 체크
				if(checkedLength == 1){
					$("[name=licenseNo]").val("");
				}else{
					$("[name=licenseNo]").val(checkedValue.substring(0,checkedLength-1));
				}
			}else{
				if(checkedLength > 12){
					$("[name=licenseNo]").val(checkedValue.substring(0,12));
					var lcnsArea = checkedValue.substring(0,2);
					var areaFl = false;

					for(var i=0; i<areaArr.length;i++){
						if(areaArr[i] == lcnsArea) areaFl = true;
					}
					
					if(!areaFl){
						$("#alert-lcnsNo").addClass("alert-msg");
						$("#msg-lcnsNo").html("면허번호를 정확히 입력해주세요.");
					}else{
						$("#alert-lcnsNo").removeClass("alert-msg");
						$("#msg-lcnsNo").html("");
					}
					
				}else if(checkedLength == 12){
					var lcnsArea = checkedValue.substring(0,2);
					var areaFl = false;

					for(var i=0; i<areaArr.length;i++){
						if(areaArr[i] == lcnsArea) areaFl = true;
					}
					
					if(!areaFl){
						$("#alert-lcnsNo").addClass("alert-msg");
						$("#msg-lcnsNo").html("면허번호를 정확히 입력해주세요.");
					}else{
						$("#alert-lcnsNo").removeClass("alert-msg");
						$("#msg-lcnsNo").html("");
					}
				}else if(checkedLength < 12){
					$("#alert-lcnsNo").addClass("alert-msg");
					$("#msg-lcnsNo").html("면허번호를 입력해주세요.");
				}
			}	
		}else{
			$("#alert-lcnsNo").addClass("alert-msg");
			$("#msg-lcnsNo").html("면허번호를 입력해주세요.");
		}
	}	
	
	
	$("[name=licenseNo]").val($("[name=licenseNo]").val());
}

function show_rsv_info()
{
	var check = essCheck();
	
	if (check)
	{
		
	}
}	

function show_terms()
{
	var termsOk = $("#select-terms0:checked").length == 1;
	
	//약관 동의를 하지 않았으면 약관동의 섹션을 열어준다
	if (!termsOk)
	{
		
		accd_close('#accord_rent');
		accd_close('#accord_user');
		accd_open('#accord-term');
		
		var offset = $('#accord-term').offset();
		$("html, body").animate({scrollTop: offset.top-159}, 10);
	}
	$("#modal-reservation-info").hide();
	
	if(typeof $("#corp").val() != "undefined" && $("#corp").val() == "InterPark") {
		$(".dimd").css('display','none');
    }
}

function checkingLicenseAvil(){
	var num_pattern = /^[0-9]+$/;//숫자패턴
	var mode = $("#rsvMode").val();
	var userCls = $("#userClass").val();
	var ldwID = $("#ldwId").val();
	
	var startDate = $("#rentDateTime1").val().substr(0,8);
	var endDate = $("#rentDateTime2").val().substr(0,8);
	
	var licenseType = $("[name=licenseType]").val();
	var checkedValue = $("[name=licenseAvil]").val();
	var checkedLength = checkedValue.length;
	var char_ASCII = event.keyCode;
	if(char_ASCII == 32){
		if(checkedLength == 1){
			$("[name=licenseAvil]").val("");
		}else{
			$("[name=licenseAvil]").val(checkedValue.trim());
		}
	}
	
	if(checkedLength != 0){
		if(!num_pattern.test(checkedValue)){
			if(checkedLength == 1){
				$("[name=licenseAvil]").val("");
			}else{
				$("[name=licenseAvil]").val(checkedValue.substring(0,checkedLength-1));
			}
			lcnsAvilFlag = false;
		}else{
			if(checkedLength == 8){
				var lcnsYr = checkedValue.substring(0,4);
				var lcnsMn = checkedValue.substring(4,6);
				var lcnsDt = checkedValue.substring(6,8);
				//console.log(lcnsYr+":"+lcnsMn+":"+lcnsDt);			

				if(lcnsMn > 12 || lcnsDt > 31 || lcnsMn == '00' || lcnsDt == '00'){
					$("#alert-lcnsAvil").addClass("alert-msg");
					$("#msg-lcnsAvil").html("적성검사 만료일을 정확히 입력해주세요.");
					lcnsAvilFlag = false;
				}else{
					//기존 및 추가 만료일 체크
					checkedValue = licenseAvilCheck();
					console.log("DDDDDDDDDDDDDDDDD2 : ", checkedValue);
					
					if(parseInt(checkedValue)<parseInt(startDate) || parseInt(checkedValue)<parseInt(endDate)){
						if(licenseType != "" && licenseType != "106005"){
							$("#alert-lcnsAvil").addClass("alert-msg");
							$("#msg-lcnsAvil").html("적성검사 만료일이 반납일 이후여야 예약 가능합니다.");
							lcnsAvilFlag = false;
						}else{
							$("#alert-lcnsAvil").removeClass("alert-msg");
							$("#msg-lcnsAvil").html("");
							lcnsAvilFlag = true;
						}
					}else{
						$("#alert-lcnsAvil").removeClass("alert-msg");
						$("#msg-lcnsAvil").html("");
						lcnsAvilFlag = true;
					}
				}
			}else if(checkedLength > 8){
				$("[name=licenseAvil]").val(checkedValue.substring(0,8));
				
				var lcnsYr = $("[name=licenseAvil]").val().substring(0,4);
				var lcnsMn = $("[name=licenseAvil]").val().substring(4,6);
				var lcnsDt = $("[name=licenseAvil]").val().substring(6,8);
				
				if(lcnsMn > 12 || lcnsDt > 31 || lcnsMn == '00' || lcnsDt == '00'){
					$("#alert-lcnsAvil").addClass("alert-msg");
					$("#msg-lcnsAvil").html("적성검사 만료일을 정확히 입력해주세요.");
					lcnsAvilFlag = false;
				}else{
					//기존 및 추가 만료일 체크
					checkedValue = licenseAvilCheck();
					console.log("DDDDDDDDDDDDDDDDD3 : ", checkedValue);
					
					if(parseInt(checkedValue)<parseInt(startDate) || parseInt(checkedValue)<parseInt(endDate)){
						if(licenseType != "" && licenseType != "106005"){
							$("#alert-lcnsAvil").addClass("alert-msg");
							$("#msg-lcnsAvil").html("적성검사 만료일이 반납일 이후여야 예약 가능합니다.");
							lcnsAvilFlag = false;
						}else{
							$("#alert-lcnsAvil").removeClass("alert-msg");
							$("#msg-lcnsAvil").html("");
							lcnsAvilFlag = true;
						}
					}else{
						$("#alert-lcnsAvil").removeClass("alert-msg");
						$("#msg-lcnsAvil").html("");
						lcnsAvilFlag = true;
					}
				}
			}else if(checkedLength < 8 && checkedLength != 0){
				$("#alert-lcnsAvil").addClass("alert-msg");
				$("#msg-lcnsAvil").html("적성검사 만료일을 정확히 입력해주세요.");
				lcnsAvilFlag = false;
			}else{
				$("#alert-lcnsAvil").removeClass("alert-msg");
				$("#msg-license").html("");
				lcnsAvilFlag = true;
			}
		}
	}else{
		$("#alert-lcnsAvil").addClass("alert-msg");
		$("#msg-lcnsAvil").html("적성검사 만료일을 입력해주세요.");
		lcnsAvilFlag = false;
	}
	$("[name=licenseAvil]").val($("[name=licenseAvil]").val());
	return lcnsAvilFlag;
}

//운전면허 발급일 체크
var lcnsIssuedFlag = false;
function checkingLicenseIssued(){
	var num_pattern = /^[0-9]+$/;//숫자패턴
	var checkedValue = $("[name=licenseIssued]").val();
	var checkedLength = checkedValue.length;
	var sDate = $("#rentDateTime1").val();
	var licenseNo = $("[name=licenseNo]").val();
	
	var char_ASCII = event.keyCode;
	if(char_ASCII == 32){
		if(checkedLength == 1){
			$("[name=licenseIssued]").val("");
		}else{
			$("[name=licenseIssued]").val(checkedValue.trim());
		}
	}
	
	if(checkedLength != 0){
		if(!num_pattern.test(checkedValue)){
			if(checkedLength == 1){
				$("[name=licenseIssued]").val("");
			}else{
				$("[name=licenseIssued]").val(checkedValue.substring(0,checkedLength-1));
			}
			lcnsIssuedFlag = false;
		}else{
			if(checkedLength == 8){
				var lcnsYr = checkedValue.substring(0,4);
				var lcnsMn = checkedValue.substring(4,6);
				var lcnsDt = checkedValue.substring(6,8);

				if(lcnsMn > 12 || lcnsDt > 31 || lcnsMn == '00' || lcnsDt == '00'){
					$("#alert-lcnsIssued").addClass("alert-msg");
					$("#msg-lcnsIssued").html("운전면허 발급일을 정확히 입력해주세요.");
					lcnsIssuedFlag = false;
				}else{
					if(licenseNo != "" && licenseNo != null) {
						var sDateYear = parseInt(sDate.toString().substring(2,4));	
						var lcncNoYear = parseInt(licenseNo.toString().substring(2,4));
						
						if(lcncNoYear > sDateYear){
							$("#alert-lcnsIssued").removeClass("alert-msg");
							$("#msg-lcnsIssued").html("");	
							lcnsIssuedFlag = true;
						} else if(lcncNoYear == sDateYear){
							if(hasCDVal > 0){ //11인승이상
								$("#alert-lcnsIssued").addClass("alert-msg");
								$("#msg-lcnsIssued").html("운전면허 발급일이 대여일보다 3년 이전이어야 예약 가능합니다.");
								lcnsIssuedFlag = false;
							}else if($("#selCarCd").val() == "232009" || $("#selCarCd").val() == "232010" || $("#selCarCd").val() == "232011"){ //수입차
								$("#alert-lcnsIssued").addClass("alert-msg");
								$("#msg-lcnsIssued").html("운전면허 발급일이 대여일보다 3년 이전이어야 예약 가능합니다.");
								lcnsIssuedFlag = false;
							}else{
								$("#alert-lcnsIssued").addClass("alert-msg");
								$("#msg-lcnsIssued").html("운전면허 발급일이 대여일보다 1년 이전이어야 예약 가능합니다.");
								lcnsIssuedFlag = false;
							}
						} else {
							if(sDate != "" && sDate != null){
								sDate = sDate.substr(0,8);
								var licenseIssuedDate = new Date(checkedValue.substring(0,4), Number(checkedValue.substring(4,6)-1), checkedValue.substring(6,8));
								var startDate = new Date(sDate.substring(0,4), Number(sDate.substring(4,6)-1), sDate.substring(6,8));
								var betweenDay = (startDate.getTime() - licenseIssuedDate.getTime())/1000/60/60/24;

								if(betweenDay <= 366 && hasCDVal == 0 && ($("#selCarCd").val() != "232009" || $("#selCarCd").val() != "232010" || $("#selCarCd").val() != "232011") && (lcncNoYear == sDateYear || lcncNoYear == (sDateYear-1))){
									$("#alert-lcnsIssued").addClass("alert-msg");
									$("#msg-lcnsIssued").html("운전면허 발급일이 대여일보다 1년 이전이어야 예약 가능합니다.");
									lcnsIssuedFlag = false;
								}else if(hasCDVal > 0 && betweenDay <= 1096 && (lcncNoYear == sDateYear || lcncNoYear == (sDateYear-1) || lcncNoYear == (sDateYear-2) || lcncNoYear == (sDateYear-3))){ //11인승이상
									$("#alert-lcnsIssued").addClass("alert-msg");
									$("#msg-lcnsIssued").html("운전면허 발급일이 대여일보다 3년 이전이어야 예약 가능합니다.");
									lcnsIssuedFlag = false;
								}else if(($("#selCarCd").val() == "232009" || $("#selCarCd").val() == "232010" || $("#selCarCd").val() == "232011") && betweenDay <= 1096 && (lcncNoYear == sDateYear || lcncNoYear == (sDateYear-1) || lcncNoYear == (sDateYear-2) || lcncNoYear == (sDateYear-3))){ //수입차
									$("#alert-lcnsIssued").addClass("alert-msg");
									$("#msg-lcnsIssued").html("운전면허 발급일이 대여일보다 3년 이전이어야 예약 가능합니다.");
									lcnsIssuedFlag = false;
								}else{
									$("#alert-lcnsIssued").removeClass("alert-msg");
									$("#msg-lcnsIssued").html("");
									lcnsIssuedFlag = true;
								}
							}else{
								$("#alert-lcnsIssued").removeClass("alert-msg");
								$("#msg-lcnsIssued").html("");	
								lcnsIssuedFlag = true;
							}
						}
					} else {
						$("#alert-lcnsIssued").removeClass("alert-msg");
						$("#msg-lcnsIssued").html("");	
						lcnsIssuedFlag = true;
					}
				}
			}else if(checkedLength > 8){
				$("[name=licenseIssued]").val(checkedValue.substring(0,8));
				lcnsIssuedFlag = false;
			}else if(checkedLength < 8 && checkedLength != 0){
				$("#alert-lcnsIssued").addClass("alert-msg");
				$("#msg-lcnsIssued").html("운전면허 발급일을 정확히 입력해주세요.");
				lcnsIssuedFlag = false;
			}else{
				$("#alert-lcnsIssued").removeClass("alert-msg");
				$("#msg-lcnsIssued").html("");
				lcnsIssuedFlag = true;
			}
		}
	}
}

function rsvCancel(){
	if(confirm("단기렌터카 예약을 취소하시겠습니까?\n취소 시 입력하신 내용은 저장되지 않습니다.")){
		location.href = "/mobile/rentcar/main.do";
	}
}
//제휴사 단기 예약 취소 펑션
function rsvCorpCancel(){
	var userClass = $("#userClass").val();
	var dcCardId = $("#dcCardCd").val();
	
	if(confirm("단기렌터카 예약을 취소하시겠습니까?\n취소 시 입력하신 내용은 저장되지 않습니다.")){
		if(dcCardId == 'P00000028088' || dcCardId == ''){//닷컴
			if($("#branchId").val() == '000012'){
				location.href = "/mobile/rentcar/reservation_new_jeju.do";
			}else{
				location.href = "/mobile/rentcar/reservation_new.do";
			}
		}else{//제휴
			if($("#branchId").val() == '000012'){
				location.href = "/mobile/rentcar/corp/reservation_jeju.do";
			}else{
				location.href = "/mobile/rentcar/corp/reservation_inland.do";
			}
		}
	}
}

$(function(){
	$("#benz_check").hide();
	$("#goCorpRserve").hide();
	
	var userClass = "";
	if($("#userClass").val() != "" && $("#userClass").val() != null) userClass = $("#userClass").val();
	
	$('#select-personal').click(function() { //개인클릭시
		$("#userCls").val("0");
		$("#userId").val("");
		$("#passwd").val("");		
	});
	$('#select-company').click(function() { //법인클릭시
		$("#userCls").val("1");
		$("#userId").val("");
		$("#passwd").val("");		
	});	
	
});

//내륙 전용
function change_area()
{
	var selectArea1 = $("#select_area1").val();
	
	$("#select_area2").val(selectArea1);
	
	$("#select_branch1").val('');
	$("#select_branch1").prop('disabled',false);

	$("#select_branch2").val('');
	
	$("#cdId").val('');
	$("#branchId").val('');
	$("#cdId2").val('');
	$("#branchId2").val('');
	
	if(selectArea1 != '') {
		$("#select_area1").find('option:eq(0)').prop( "disabled", true );
		$("#select_area2").find('option:eq(0)').prop( "disabled", true );
	}
	
	setInlandBranch(null, null, null, null);
}

// 내륙 전용
function change_branch()
{
	var $sbranch1 = $("#select_branch1");
	var $sbranch2 = $("#select_branch2");
	var altField1 = $("#altField1").val();
	var altField2 = $("#altField2").val();
	
	var branch_cd = $sbranch1.val();
	var area_cd = $sbranch1.find('option:selected').data('area');
	
	if (branch_cd != '')
	{
		$("#cdId").val(area_cd);
		$("#branchId").val(branch_cd);
		
		$("#cdId2").val(area_cd);
		$("#branchId2").val(branch_cd);
		
		$sbranch1.find('option:eq(0)').prop( "disabled", true );
		$sbranch2.find('option:eq(0)').prop( "disabled", true );
		/*
		if (area_cd == '692001')
		{
			$sbranch2.prop("disabled", false); //selectbox disabled있으면 우선 제거
			$sbranch2.find('option').hide();	// option 전부 hide
			$sbranch2.find('option').prop("disabled", true); //option 전부 disabled처리
			//$sbranch2.find('option:eq(0)').prop( "disabled", false);	//첫번째꺼 disabled 풀고			
			$sbranch2.find('option[data-area=692001]').show();	//서울데이터 있는애들 show처리
			$sbranch2.find('option[data-area=692001]').prop("disabled",false);//서울인 지역 전부 disabled 제거
			$sbranch2.find('option[data-area=692001]').filter(function(){return $.trim($(this).text()) == '서울'}).prop("disabled", true);//서울데이터 있는애들 show처리
			//alert('dd');
			//$sbranch2.prop( "disabled", false);
		}
		else
		{
			//$sbranch2.find('option').show(); //안해줘도 되지만 특정브라우져는 어떨지 모름
			$sbranch2.prop("disabled", true);
		}
		*/
		$sbranch2.val(branch_cd);
		
		//확인버튼( 대여 및 반납 지점이 선택 됐을때 만 확인 버튼 활성화 )
		if( altField1 != "" && altField2 != "" ){
			$("#btn_confirm_date").removeClass('disabled');
		}
	}

	if ($('#rsvMode').val() == "inland"){
		getInlandPossTime("branch1", null, null, null);
	}
}

// 반납지점 변경시 (지역이 서울인경우만 변경)
function change_branch2()
{
	var sbranch1 = $("#select_branch1");
	var sbranch2 = $("#select_branch2");
	var branch_cd = sbranch2.val();
	var area_cd = sbranch2.find('option:selected').data('area');
	
	var altField1 = $("#altField1").val();
	var altField2 = $("#altField2").val();
	
	$("#cdId2").val(area_cd);
	$("#branchId2").val(branch_cd);
	
	//충정로지점 반납금지(충정로점 제외)
	console.log(sbranch1.val()+"^"+sbranch2.val());
	if(sbranch2.val() == "000010"){
		if(sbranch1.val() != "000010"){
			alert("광화문지점 예약시에만 반납 가능합니다.");
			sbranch2.val(sbranch1.val());
			$("#branchId2").val(sbranch1.val());
			$("#select_branch2").html($("#select_branch1").html()); //대여지점, 반납지점 동일하게
			$('#select_branch2 option[value='+sbranch1.val() +']').attr('selected','selected');
		}
	}
	
	//확인버튼( 대여 및 반납 지점이 선택 됐을때 만 확인 버튼 활성화 )
	if( altField1 != "" && altField2 != "" ){
		$("#btn_confirm_date").removeClass('disabled');
	}
	
	if ($('#rsvMode').val() == "inland"){
		getInlandPossTime("branch2", null, null, null);
	}
}

var clickable = true;
function reserve_submit()
{
	$("#modal-terms-check a.btn-color1").removeClass("btn-color1").addClass("btn-color4");	
	$("#modal-terms-check").show();
	
	if(typeof $("#corp").val() != "undefined" && $("#corp").val() == "InterPark") {
		setCustonModal('modal-terms-check', 'accord_rent');
	}

	
	//////////////////////////// 꼭읽어보세요. 팝업
	$("#btn_checkup").click(function(){		
		
		if (clickable)
		{
			clickable = false;
			$("input:disabled").prop('disabled',false);
			$("select:disabled").prop('disabled',false);
			$("#reservForm").submit();
		}
	});

} 

//날짜 시간지점 변경시
function change_dateIfno(){
	// 티커
	$("#rentDate").text(dt1);
	$("#returnDate").text(dt2);
	$("#rentBranch").text(br1);
	$("#returnBranch").text(br2);
	
	// 예약정보확인
	$("#cfm_rentDate").text(dt1);
	$("#cfm_returnDate").text(dt2);
	$("#cfm_rentBranch").text(br1);
	$("#cfm_returnBranch").text(br2);
	
	//총 대여시간 계산
	var diffDate = calcTotalTime();
	
	// 날짜 선택 경고 제거
	$("#alert-date").removeClass("alert-msg");
	$("#msg-date").html("");
	
	//console.log("ldwAbleCheck --- 차량손해면책제도 활성화 체크");
	
	//가용차정 체크 후 차량손해면책제도 활성화 체크하도록 변경
	
	var dt1 = $("#rentDateTime1").val();
	var dt2 = $("#rentDateTime2").val();

	var BRANCH_ID = $('#branchId').val();
	
	var SLS_BRANCH_CD = getSlsBranchCd($('#branchId').val());
	if(SLS_BRANCH_CD!=''){
		var tmp = SLS_BRANCH_CD;
		SLS_BRANCH_CD = BRANCH_ID;
		BRANCH_ID = tmp;
	}
	
	var ldwRtCd ="428009"; 
	if($('#ldwId').val() != null && $('#ldwId').val() !="") ldwRtCd =$('#ldwId').val();
	
	$.ajax({
		type : "post",
		url : "/rent/rentcar/getCar.json",
		data : {
			'carType':"",
			'branchId': BRANCH_ID
			, 'sDate' : dt1
			, 'lDate' : dt2
			, 'slsBranchCd':SLS_BRANCH_CD 
			, 'dcCardId' : $("#dcCardId").val()
			, 'pLdwRtCd'     : ldwRtCd},
		dataType : "json",
		success : function(data) {
			console.log("getCar() getCar.json");
			var list = data.carList;
			var RSV_PSBL_CNT;
			
			var htmlStr= ["","","","","","","","","",""];
			var str, str2;
			var flag = false;
			
			var $rentCarList = $("div.rent-car-list");
			//var nullCarCheck = "";

			if(list != null && list.length > 0){
				for(var i = 0; i<list.length; i++){
					
					var item = list[i];
					
					if(item.rsvPsblCnt!=null){
						RSV_PSBL_CNT = item.rsvPsblCnt;
					}else{
						RSV_PSBL_CNT = item.carCnt=='예약완료'?"0":item.carCnt;	
					}
					
					flag = parseInt(RSV_PSBL_CNT)==0?true:false;
					
					var cd = item.carShtRsvClsCd;
					var type;
					switch(cd){
					case "232001":type = 1;break;	// 경차
					case "232002":type = 2;break;	// 소형
					case "232003":type = 3;break;	// 중형
					case "232004":						// 대형
					case "232006":type = 4;break;	// 특대형
					case "232005":type = 5;break;	// 승합
					case "232007":						// 소형RV
					case "232008":type = 6;break;	// 중형RV
					case "232009":type = 7;break;	// 수입
					case "232010":						// EV
					case "232011":type = 8;break;	// EV수입
					}
					
					var fuelCd = list[i].fuelCd;
					var cartypeDtlNm = list[i].cartypeDtlNm;
					var carShtRsvClsCd = list[i].carShtRsvClsCd;
					
					cartypeDtlNm!=null?cartypeDtlNm:"";
					if((fuelCd == "210007" || cartypeDtlNm.indexOf('전기차') > 0) && cartypeDtlNm.indexOf('TESLA') < 0){
						type = 8;
					}
					if(cartypeDtlNm.indexOf('캠핑') > 0){						
						str2 = setCarList(flag, item.origCartypeDtlId, item.cartypeDtlId, 9, item.cartypeDtlNm, cd);
						htmlStr[9] += str2; //개별탭에 추가
					}
					
					//flag가 true면 예약불가
					str = setCarList(flag, item.origCartypeDtlId, item.cartypeDtlId, type, item.cartypeDtlNm, cd);
					
					htmlStr[0] += str; //전체탭에 추가
					htmlStr[type] += str; //개별탭에 추가
					
					/*
					if(item.cartypeDtlNm.indexOf("스파크") >= 0){
						nullCarCheck = i;
						console.log("ITEM : ", item);
					}
					*/
				}
			}
			
			for (var i=0; i <= 9; i++)
			{
				$("#car-type" + i + " ul").html(htmlStr[i]);
			}
			
			/*
			if(nullCarCheck == ""){
				htmlStr7 = "<li><a href='javascript:void(0);' class='cl-point7' data-orgn='CH0901' data-cartype='0000000' data-car='1' data-carcd='232003'>스파크 [가솔린]</a></li>";
				console.log(" htmlStr7: ", htmlStr7 );
				$("#car-type0 ul").append(htmlStr7);
				$("#car-type1 ul").append(htmlStr7);
			}
			*/
			
			if (_carDtl != null) // 이미 선택했던 차량이 예약가능한 차량이면 cl-point1  클래스 추가
			{
				var $selectCar = $("#car-type" + _carTab + " a[data-dtl=" + _carDtl + "]"); // 선택된차량 검색				
				if ($selectCar.length == 0) //조회되지 않으면 예약불가능한 차
				{
					_carOrgn = null;
					_carDtl = null;
					_carTab = 0;
					$("#aSelectBtnCar").text(_nullCarText);	 //차량 선택 메시지로 변경
					
					$("#alert-car").addClass("alert-msg");
					$("#msg-car").html("대여차량을 선택해주세요.");
					var offset = $("#alert-cartype").offset();
					
					//getPayment();
					
				}
				else
				{
					$("div.rent-car-select .tab-menu__list.selected").removeClass("selected");
					$("div.rent-car-select .tab-menu__list.c" +_carTab).addClass("selected");
					
					if (_carTab !== 0) //선택한 탭이 0번탭이 아니면
					{
						$("#car-type0").hide();  //0번탭 감추고
						$("#car-type" + _carTab).show(); //선택된탭 show
					}					
					$selectCar.addClass("cl-point1");
				}
			}
		
			if(list != null && list.length > 10)
			{
				$("#car-type0 ul li:gt(9)").addClass("invisible"); // 10개이상이면 invisible 처리
				$("#car-type0 span.btn-drop").show(); //더보기 버튼 표시
			}
			else
			{
				$("#car-type0 span.btn-drop").hide(); //더보기 버튼 감춤
			}
			ldwAbleCheck();
			
		},
		error : function(){
			alert('데이터 통신이 실패했습니다.\n잠시 후 다시 시도하세요.');
		} 
		
	});	
}

//수입차 면허체크( 만 26세  면허 3년이상)
function checkLicenImports(carCd, checkType){
	var birthDayCheck = ageCheck(26);
	var licYear = $('[name=licenseNo]').val().substring(2,4);
	
	//대여시작일 연도
	var sDate = dateFormat($("#rentDateTime1").val(), "", 0);//yyyyMMdd
	var sYear2 = 	sDate.substring(2,4);
	
	var step1Msg = "해당 차량은 만 26세 이상, 면허 취득 3년 이상이 아니면 대여 거부 될 수 있습니다.";	
	var step2Msg = "해당 차량은  만26세 이상, 면허 취득 3년 이상만 대여 가능합니다.";
	
	// 중복 alert 및 alert 문구 구분으로 인해 checkType 구분
	if(checkType == "step2"){
		if(carCd == "232009" || carCd == "232010" || carCd == "232011"){
			if(!birthDayCheck){
				alert( step2Msg );	
				return false;
			}
			if(licYear != ""){
				if(licYear - sYear2 > -3 && licYear - sYear2 < 3){
					alert( step2Msg );	
					return false;
				}
			}else{
				alert( step2Msg );	
				return false;
			}
		}else{
			return true;
		}
	}else if(checkType == "step3"){
		if(carCd == "232009" || carCd == "232010" || carCd == "232011"){
			if(!birthDayCheck){
				return false;
			}else if(licYear != ""){
				if(licYear - sYear2 > -3 && licYear - sYear2 < 3){
					return false;
				}
			}else{
				return false;
			}
		}else{
			return true;
		}
	}else{
		if(carCd == "232009" || carCd == "232010" || carCd == "232011"){
			if(!birthDayCheck){
				alert( step1Msg );
				return false;
			}
			if(licYear != ""){
				if(licYear - sYear2 > -3 && licYear - sYear2 < 3){
					alert( step1Msg );
					return false;
				}
			}else{
				alert( step1Msg );
				return false;
			}
		}else{
			return true;
		}
	}
	return true;
}

//11인승 만 26세 면허 3년이상
function checkLicenPeriod(){
	
	var licenseType = $("[name=licenseType]").val();
	
	//2종 보통이면 불가
	if(licenseType == "106005"){
		alert("해당 차량은  만26세 이상, 면허 취득 3년이상, 면허 종별로 1종 보통 이상만 대여 가능합니다.");
		return false;
	}else if(licenseType == "106009"){
		//국제면허면 우선 그냥 패스
		return true;
	}
	
	//대여시작일 년월일
	var sDate = dateFormat($("#rentDateTime1").val(), "", 0);//yyyyMMdd
	var sYear 	=  	sDate.substring(0,4);
	var sMonth 	= 	sDate.substring(4,6);
	var sDay 	=	sDate.substring(6,8);
	var sMonDay =	sDate.substring(4,8);
	var sYear2 = 	sDate.substring(2,4);
	
	//운전자 생년월일
	var userDate = $('[name=birthday]').val();
	var userYear 	=  	userDate.substring(0,4);
	var userMonth 	= 	userDate.substring(4,6);
	var userDay 	=	userDate.substring(6,8);
	var userMonDay =	userDate.substring(4,8);
	
	//면허 취득 년도
	var licYear = $('[name=licenseNo]').val().substring(2,4);
	
	var age = sMonDay < userMonDay?sYear - userYear - 1:sYear - userYear;
	
	if(age > 25){
		//만 26세 이상
		if(licYear - sYear2 > -3 && licYear - sYear2 < 3){
			alert("해당 차량은  만26세 이상, 면허 취득 3년이상, 면허 종별로 1종 보통 이상만 대여 가능합니다.");
			return false;
		}else{
			return true;
		}
	}else{
		//만 26세 이하
		alert("해당 차량은  만26세 이상, 면허 취득 3년이상, 면허 종별로 1종 보통 이상만 대여 가능합니다.");
		return false;
	}
}

//대형,SUV,승합차 11인승 차량 체크 (내륙용)
function checkLicenseInputLageSuvVanCehck(){
	//내륙일경우
	if($("#rsvMode").val() == 'jeju'){
		return true;
	}
	
	//국제면허 패스
	if($("[name=licenseType]").val() == "106009"){
		return true;
	}
	
	//소형, 중형, 수입차일 경우
	if(!($("#selCarCd").val() == "232004" || $("#selCarCd").val() == "232005" || $("#selCarCd").val() == "232006" ||$("#selCarCd").val() == "232007" ||$("#selCarCd").val() == "232008")){
		return true;
	} else  {
		return false;
	}
}

//대형,SUV,승합차 11인승 미만 체크 (내륙용)
function checkLicenseInputLageSuvVan(){
	var licenseType = $("[name=licenseType]").val();
	
	//대형,SUV,승합차 11인승 차량 체크 (내륙용)
	if(checkLicenseInputLageSuvVanCehck()){
		return true;
	}
	
	//대여시작일 년월일
	var sDate = dateFormat($("#rentDateTime1").val(), "", 0);//yyyyMMdd
	var sYear 	=  	sDate.substring(0,4);
	var sMonth 	= 	sDate.substring(4,6);
	var sDay 	=	sDate.substring(6,8);
	var sMonDay =	sDate.substring(4,8);
	var sYear2 = 	sDate.substring(2,4);
	
	//운전자 생년월일
	var userDate = $('[name=birthday]').val();
	var userYear 	=  	userDate.substring(0,4);
	var userMonth 	= 	userDate.substring(4,6);
	var userDay 	=	userDate.substring(6,8);
	var userMonDay =	userDate.substring(4,8);
	
	//면허 취득 년도
	var licYear = $('[name=licenseNo]').val().substring(2,4);
	
	var age = sMonDay < userMonDay?sYear - userYear - 1:sYear - userYear;
	
	if(age > 25){
		//만 26세 이상
		if(licYear - sYear2 > -3 && licYear - sYear2 < 3){
			alert("해당 차량은  만26세 이상, 면허 취득 3년이상, 면허 종별로 2종 보통 이상만 대여 가능합니다.");
			return false;
		}else{
			return true;
		}
	}else{
		//만 26세 이하
		alert("해당 차량은  만26세 이상, 면허 취득 3년이상, 면허 종별로 2종 보통 이상만 대여 가능합니다.");
		return false;
	}
}

function setLcnsInput(flag, nextFlag){
	var userClass = $("#userClass").val();
	hasNext = nextFlag 
	if(userClass == "-1"){
		//비회원 비활성
		//class="readonly" readonly="readonly" disabled="disabled"
		if(flag){
			$("[name=userNm]").removeClass("readonly");
			$("[name=userNm]").addClass("readonly");
			$("[name=userNm]").prop("disabled", true);
			$("[name=userNm]").prop("readonly", true);
			
			$("[name=birthday]").removeClass("readonly");
			$("[name=birthday]").addClass("readonly");
			$("[name=birthday]").prop("disabled", true);
			$("[name=birthday]").prop("readonly", true);
			
			$("[name=licenseType]").removeClass("readonly");
			$("[name=licenseType]").addClass("readonly");
			$("[name=licenseType]").prop("disabled", true);
			$("[name=licenseType]").prop("readonly", true);
			
			$("[name=licenseNo]").removeClass("readonly");
			$("[name=licenseNo]").addClass("readonly");
			$("[name=licenseNo]").prop("disabled", true);
			$("[name=licenseNo]").prop("readonly", true);
			
			$("[name=licenseAvil]").removeClass("readonly");
			$("[name=licenseAvil]").addClass("readonly");
			$("[name=licenseAvil]").prop("disabled", true);
			$("[name=licenseAvil]").prop("readonly", true);
		}else{
		//비회원 활성화			
			$("[name=userNm]").removeClass("readonly");
			$("[name=userNm]").prop("disabled", false);
			$("[name=userNm]").prop("readonly", false);
			
			$("[name=birthday]").removeClass("readonly");			
			$("[name=birthday]").prop("disabled", false);
			$("[name=birthday]").prop("readonly", false);
			
			$("[name=licenseType]").removeClass("readonly");
			$("[name=licenseType]").prop("disabled", false);
			$("[name=licenseType]").prop("readonly", false);
			
			$("[name=licenseNo]").removeClass("readonly");
			$("[name=licenseNo]").prop("disabled", false);
			$("[name=licenseNo]").prop("readonly", false);
			
			$("[name=licenseAvil]").removeClass("readonly");
			$("[name=licenseAvil]").prop("disabled", false);
			$("[name=licenseAvil]").prop("readonly", false);
		}
	}else{
		//회원
		if(flag){
			$("[name=userNm]").removeClass("readonly");
			$("[name=userNm]").addClass("readonly");
			$("[name=userNm]").prop("disabled", true);
			$("[name=userNm]").prop("readonly", true);
			
			$("[name=birthday]").removeClass("readonly");
			$("[name=birthday]").addClass("readonly");
			$("[name=birthday]").prop("disabled", true);
			$("[name=birthday]").prop("readonly", true);
			
			$("[name=licenseType]").removeClass("readonly");
			$("[name=licenseType]").addClass("readonly");
			$("[name=licenseType]").prop("disabled", true);
			$("[name=licenseType]").prop("readonly", true);
			
			$("[name=licenseNo]").removeClass("readonly");
			$("[name=licenseNo]").addClass("readonly");
			$("[name=licenseNo]").prop("disabled", true);
			$("[name=licenseNo]").prop("readonly", true);
			
			$("[name=licenseAvil]").removeClass("readonly");
			$("[name=licenseAvil]").addClass("readonly");
			$("[name=licenseAvil]").prop("disabled", true);
			$("[name=licenseAvil]").prop("readonly", true);
		}else{
		//회원 활성화
			setLcnInputDisableClear();
		}
		
	}
	
	checkingLicenseIssued();
}

function setLcnInputDisableClear(){
	
	$("[name=licenseType]").removeClass("readonly");
	$("[name=licenseType]").prop("disabled", false);
	$("[name=licenseType]").prop("readonly", false);
	
	$("[name=licenseNo]").removeClass("readonly");
	$("[name=licenseNo]").prop("disabled", false);
	$("[name=licenseNo]").prop("readonly", false);
	
	$("[name=licenseAvil]").removeClass("readonly");
	$("[name=licenseAvil]").prop("disabled", false);
	$("[name=licenseAvil]").prop("readonly", false);	
}


function showResInfo(){
	
	var selDomain = $("#selDomain").val();
	var branchId = $('#branchId').val();
	var branchId2 = $('#branchId2').val();
	var sDate = $("#rentDateTime1").val();
	var carTypeName = _carDtl == null?"":_carDtl;
	var ldwId = $("#ldwId").val();
	var userNm = $("[name=userNm]").val();
	var birthday = $("[name=birthday]").val();
	var mobile = $("#mobile").val();
	var emailId = $("#emailId").val();
	var domain = $("#domain").val();
	var homeAddr = $("#homeAddr").val();
	var licenseType = $("[name=licenseType]").val();
	var licenseNo = $("[name=licenseNo]").val();
	var licenseAvil = $("[name=licenseAvil]").val();
	var licenseIssued = $("[name=licenseIssued]").val();
	
//	if(selDomain != "" && domain == "")
//		domain = selDomain;
	
	if(branchId != "" && branchId2 != "" && sDate != "" && carTypeName != "" && ldwId != "" 
		&& userNm != "" && birthday != "" && mobile != "" //&& emailId != "" && domain != ""
			&& homeAddr != "" && licenseType != "" && licenseNo != "" && licenseAvil !== "" && licenseIssued !== ""){
		if(hasResChange && hasLcnOk && lcnsIssuedFlag){
			//모바일에서 가상키보드 안보이도록 focus out 처리
			$("#userNm, #birthday, #mobile, #emailId, #domain, #homeAddr, #homeDtlAddr, #licenseNo, #licenseAvil, #licenseIssued").blur();
			//hasResChange
			$("#modal-reservation-info").show();
			hasResChange = false;
			hasFirst = false;
			$("#modal-reservation-info").focus();
			
			if(typeof $("#corp").val() != "undefined" && $("#corp").val() == "InterPark") {
				setCustonModal('modal-reservation-info', 'userNm');
			}
		}else{
			if(hasFirst && hasLcnOk && lcnsIssuedFlag){
				//모바일에서 가상키보드 안보이도록 focus out 처리
				$("#userNm, #birthday, #mobile, #emailId, #domain, #homeAddr, #homeDtlAddr, #licenseNo, #licenseAvil, #licenseIssued").blur();
				
				$("#modal-reservation-info").show();
				$("#modal-reservation-info").focus();
				hasFirst = false;
				
				if(typeof $("#corp").val() != "undefined" && $("#corp").val() == "InterPark") {
					setCustonModal('modal-reservation-info', 'userNm');
				}
			}
		}
	}
}
function chekLcnVal(val){
	hasLcnOk = val;
}

function removeLcnAlertMsg(){
	$("#alert-name").removeClass("alert-msg");
	$("#msg-name").html("");
	$("#alert-birth").removeClass("alert-msg");
	$("#msg-birth").html("");
	$("#alert-lcnsType").removeClass("alert-msg");
	$("#msg-lcnsType").html("");
	$("#alert-lcnsNo").removeClass("alert-msg");
	$("#msg-lcnsNo").html("");
	$("#alert-licenseAvil").removeClass("alert-msg");
	$("#msg-licenseAvil").html("");
}

function checkLcnAvil(){
	var startDate = $("#rentDateTime1").val().substr(0,8);
	var endDate = $("#rentDateTime2").val().substr(0,8);
	
	var licenseType = $("[name=licenseType]").val();
	var checkedValue = $("[name=licenseAvil]").val();
	var checkedLength = checkedValue.length;
	
	if(checkedLength != 0){
		
		if(checkedLength == 8){
			var lcnsYr = checkedValue.substring(0,4);
			var lcnsMn = checkedValue.substring(4,6);
			var lcnsDt = checkedValue.substring(6,8);

			if(lcnsMn > 12 || lcnsDt > 31 || lcnsMn == '00' || lcnsDt == '00'){
				$("#alert-lcnsAvil").addClass("alert-msg");
				$("#msg-lcnsAvil").html("적성검사 만료일을 정확히 입력해주세요.");
				return false;
			}else{
				//기존 및 추가 만료일 체크
				checkedValue = licenseAvilCheck(ageCheck); 
				console.log("DDDDDDDDDDDDDDDDD4 : ", checkedValue);
				
				if(parseInt(checkedValue)<parseInt(startDate) || parseInt(checkedValue)<parseInt(endDate)){
					if(licenseType != "" && licenseType != "106005"){
						$("#alert-lcnsAvil").addClass("alert-msg");
						$("#msg-lcnsAvil").html("적성검사 만료일이 반납일 이후여야 예약 가능합니다.");
						return false;
					}else{
						$("#alert-lcnsAvil").removeClass("alert-msg");
						$("#msg-lcnsAvil").html("");
						return true;
					}
				}else{
					$("#alert-lcnsAvil").removeClass("alert-msg");
					$("#msg-lcnsAvil").html("");
					return true;
				}
			}
		}else {
			$("#alert-lcnsAvil").addClass("alert-msg");
			$("#msg-lcnsAvil").html("적성검사 만료일을 정확히 입력해주세요.");
			return false;
		}
	}else{
		return false;
	}
	
}

function setJejuResTime(gubun, branchId, setHour1, setHour2){
	var sDate = (calendar._selectFromDate == null ? dateFormat($('#sDate').val(),'',0) : calendar._selectFromDate); //yyyy-mm-dd
	var lDate = (calendar._selectToDate == null ? dateFormat($('#lDate').val(),'',0) : calendar._selectToDate); //yyyy-mm-dd
	var sVal = (branchId == null ? $("#select_branch1").val() : branchId);
	var sVal2 = (branchId == null ? $("#select_branch2").val() : branchId);	
	console.log("RES --------------- D1 : ", sDate);
	console.log("RES --------------- D2 : ", lDate);
	if($("#sDate").val()!= null && $("#sDate").val()!="") sDate = dateFormat($('#sDate').val(),'',0);
	if($("#lDate").val()!= null && $("#lDate").val()!="") lDate = dateFormat($('#lDate').val(),'',0);
	
	if(sVal != '' && sVal != null){
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
				var stHourMin = parseInt($("#selectRentTime1").val()); 
				var edHourMin = parseInt((timeList.edHh + "00"));
				
				//해당지점의 휴무일 체크
				holiyDayMsg(timeList.stHh, timeList.stMi, timeList.edHh, timeList.edMi, sDate, "sDate");

				if(gubun == null || gubun == "branch1") {
					setJejuHour("selectRentTime1", timeList.stHh, timeList.edHh, timeList.stMi, timeList.edMi);
					
					var aHourMin = (setHour1 == null ? $("#selectRentTime1").val() : setHour1);
					aHourMin = (_tempTime1 == null ? aHourMin : _tempTime1);
					console.log("RES1 ---------------- : ", _tempTime1);
					console.log("RES1 ---------------- : ", aHourMin);
					$("#selectRentTime1").val(aHourMin);
					if(typeof($("#selectRentTime1 option:selected").val()) == "undefined"){
						aHourMin = $("#selectRentTime1 option:first").val();
						$("#selectRentTime1").val(aHourMin);
					}
				}
				
				$("#txtSlsBranch #ResTime").html(timeList.stHh + ":" + timeList.stMi +"~" + timeList.edHh + ":" + timeList.edMi );
				
				console.log("RES--------------------END")
			},
			error : function(){
				alert('데이터 통신이 실패했습니다.\n잠시 후 다시 시도하세요.');
			} 
		});
	}
}

function setJejuRtnTime(gubun, branchId, setHour1, setHour2){
	var sDate = (calendar._selectFromDate == null ? dateFormat($('#sDate').val(),'',0) : calendar._selectFromDate); //yyyy-mm-dd
	var lDate = (calendar._selectToDate == null ? dateFormat($('#lDate').val(),'',0) : calendar._selectToDate); //yyyy-mm-dd
	var sVal = (branchId == null ? $("#select_branch1").val() : branchId);
	var sVal2 = (branchId == null ? $("#select_branch2").val() : branchId);
	
	if($("#sDate").val()!= null && $("#sDate").val()!="") sDate = dateFormat($('#sDate').val(),'',0);
	if($("#lDate").val()!= null && $("#lDate").val()!="") lDate = dateFormat($('#lDate').val(),'',0);
	
	if(sVal2 != '' && sVal2 != null){
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
				
				//해당지점의 휴무일 체크
				holiyDayMsg(lTimeList.lStHh, lTimeList.lStMi,  lTimeList.lEdHh, lTimeList.lEdMi, lDate, "lDate");
				
				if(gubun == null || gubun == "branch1" || gubun == "branch2") {
					setJejuHour("selectRentTime2", lTimeList.lStHh, lTimeList.lEdHh, lTimeList.lStMi, lTimeList.lEdMi);
					
					var bHourMin = (setHour2 == null ? $("#selectRentTime2").val() : setHour2);
					bHourMin = (_tempTime2 == null ? bHourMin : _tempTime2);
					console.log("RTN1 ---------------- : ", _tempTime2);
					console.log("RTN1 ---------------- : ", bHourMin);
					$("#selectRentTime2").val(bHourMin);
					if(typeof($("#selectRentTime2 option:selected").val()) == "undefined"){
						bHourMin = $("#selectRentTime1 option:first").val();
						$("#selectRentTime2").val(bHourMin);
					}
				}
			
				$("#txtSlsBranch #RtnTime").html(lTimeList.lStHh + ":" + lTimeList.lStMi + "~" + lTimeList.lEdHh + ":" + lTimeList.lEdMi);
				
				console.log("RTN--------------------END")
			},
			error : function(){
				alert('데이터 통신이 실패했습니다.\n잠시 후 다시 시도하세요.');
			} 
		});	
	}
}

function getInlandPossTime(gubun, branchId, setHour1, setHour2){ //내륙 예약 가능한 시간 가져오기
	var sDate = calendar._selectFromDate; //yyyy-mm-dd
	var lDate = calendar._selectToDate; //yyyy-mm-dd
	var sVal = (branchId == null ? $("#select_branch1").val() : branchId);
	var sVal2 = (branchId == null ? $("#select_branch2").val() : branchId);
	var aHourMin = (setHour1 == null ? $("#selectRentTime1").val() : setHour1);
	var bHourMin = (setHour2 == null ? $("#selectRentTime2").val() : setHour2);
	
	if($("#sDate").val()!= null && $("#sDate").val()!="") sDate = dateFormat($('#sDate').val(),'',0);
	if($("#lDate").val()!= null && $("#lDate").val()!="") lDate = dateFormat($('#lDate').val(),'',0);
	console.log("getInlandPossTime(): sDate="+sDate);
	console.log("getInlandPossTime(): lDate="+lDate);
	console.log("getInlandPossTime(): sVal="+sVal);
	console.log("getInlandPossTime(): sVal2="+sVal2);
	
	if(sDate != ''){
		if(sVal != '' && sVal != null){
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
					var stHourMin = parseInt($("#selectRentTime1").val()); 
					var edHourMin = parseInt((timeList.edHh + "00"));
					
					//해당지점의 휴무일 체크
					holiyDayMsg(timeList.stHh, timeList.stMi, timeList.edHh, timeList.edMi, sDate, "sDate");
					
					//해당지점의 영업일시간 기준으로 시간과 분셋팅
					setDateTime($("#sDate"),timeList.stHh,timeList.stMi,timeList.edHh,timeList.edMi,timeList.edHh);	
					
					if(gubun == null || gubun == "branch1") {
						setInlandHour("selectRentTime1", timeList.stHh, timeList.edHh, timeList.stMi, timeList.edMi);
						
    					$("#selectRentTime1").val(aHourMin);
    					if(typeof($("#selectRentTime1 option:selected").val()) == "undefined"){
    						aHourMin = $("#selectRentTime1 option:first").val();
    						$("#selectRentTime1").val(aHourMin);
    					}
					}
					
					if(sVal2 != '' && sVal2 != null){
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
								
								//해당지점의 휴무일 체크
								holiyDayMsg(lTimeList.lStHh, lTimeList.lStMi,  lTimeList.lEdHh, lTimeList.lEdMi, lDate, "lDate");
								
								if(gubun == null || gubun == "branch1" || gubun == "branch2") {
									setInlandHour("selectRentTime2", lTimeList.lStHh, lTimeList.lEdHh, lTimeList.lStMi, lTimeList.lEdMi);
									
									$("#selectRentTime2").val(bHourMin);
									if(typeof($("#selectRentTime2 option:selected").val()) == "undefined"){
										bHourMin = $("#selectRentTime2 option:first").val();
			    						$("#selectRentTime2").val(bHourMin);
			    					}									
								}
							
								$("#txtSlsBranch").html(
										"예약가능시간 : <span class='cl-point1'>"+ $('#select_branch2 option:selected').text() + "(대여 " 
										+ timeList.stHh + ":" + timeList.stMi +"~" + timeList.edHh + ":" + timeList.edMi + " / 반납 " 
										+ lTimeList.lStHh + ":" + lTimeList.lStMi + "~" + lTimeList.lEdHh + ":" + lTimeList.lEdMi + ")</span>");
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
			setInlandHour("selectRentTime1", null, null, null, null);
			setInlandHour("selectRentTime2", null, null, null, null);
	 	}
	}
}

function holiyDayMsg(stHH, stMI, edHH, edMI, holyDay, dateType){
	var msg = "";
	dateType == "sDate" ? msg = "대여일" : msg = "반납일";
	
	if(stHH == "00" && stMI == "00" && edHH == "00" && edMI == "00"){
		alert("선택하신 지점의 "+msg+"("+ holyDay.substr(0,4) + "년 " + holyDay.substr(4,2) + "월 " + holyDay.substr(6,8) + "일)은 휴무일 입니다." );
		resetDate();
	}
}

function setJejuHour(id,sHour,eHour,sMin,eMin){
	var currentDate = new Date();
	var cHour = currentDate.getHours();
	var cMin = currentDate.getMinutes();
	var possSHour = 9;
	var setId = $("#"+id);
	var startHour = (sHour == null ? 9 : parseInt(sHour));
	var endHour = (eHour == null ? 19 : parseInt(eHour));
	var sDate = calendar._selectFromDate;
	
	//console.log("TC --------- : ", cHour);
	//console.log("TC --------- : ", startHour);
	//console.log("TC --------- : ", endHour);
	//console.log("TC --------- : ", sDate);
	
	var checkDate = currentDate;
	checkDate.setDate(parseInt(today_dd)+1);
    var check_yyyy = checkDate.getFullYear();
    var check_mm = checkDate.getMonth()+1;
    var check_dd = checkDate.getDate();
    
    var check_yyyy = checkDate.getFullYear();
    var check_mm = checkDate.getMonth()+1;
    var check_dd = checkDate.getDate();
    checkDate = check_yyyy +""+ addZero(check_mm) +""+ addZero(check_dd);

	//console.log("TC --------- : ", checkDate);

	if(sDate == checkDate){
		// 명일예약시
		//console.log("----- 명일 예약시")
		if(t_hour == eHour-3 && t_min < 30){
			possSHour = Number(sHour)+1;
			sMin = "00";
		}else if(t_hour == eHour-3 && t_min >= 30){
			possSHour = Number(sHour)+1;
			sMin = "30";
		}else if(t_hour == eHour-2 && t_min < 30){
			possSHour = Number(sHour)+2;
			sMin = "00";
		}else if(t_hour == eHour-2 && t_min >= 30){
			possSHour = Number(sHour)+2;
			sMin = "30";
		}else if(t_hour == eHour-1  && t_min < 30){
			possSHour = Number(sHour)+3;
			sMin = "00";
		}else if(t_hour == eHour-1  && t_min >= 30){
			possSHour = Number(sHour)+3;
			sMin = "30";
		}else if(t_hour >= eHour ){
			possSHour = Number(sHour)+3;
			sMin = "30";
		}else{
			possSHour = Number(sHour);
		}
	}else if(sDate == today_date){
		// 금일예약시
		//console.log("----- 금일 예약시")
		if(t_hour < Number(sHour) ){
			possSHour = Number(sHour)+3;
			sMin = "30";
		}else{
			possSHour = Number(s_hour);
		}
	}else{
		//금일 명일이 아닐시
		possSHour = Number(sHour);
	}
	console.log("예약시작 시간 : ", possSHour);
	console.log("예약시작 시간 : ", sMin);
	console.log("예약시작 시간 : ", eMin);

	//시간 분 생성
	setId.empty();
	
	if("selectRentTime1" == id) {
		for(var i=possSHour; i<=endHour; i++){
			for(var j=0; j<2; j++){
				if(j == 0 && i == possSHour && sMin == "30" ){
					setId.append('<option value="' + calendar.getDigitNum(i) +'30">' + calendar.getDigitNum(i) + ' 시 30분</option>');	
				}else if(j == 0 && i == possSHour && sMin == "00" ){
					setId.append('<option value="' + calendar.getDigitNum(i) +'00">' + calendar.getDigitNum(i) + ' 시 00분</option>');	
				}else if(j == 0 && i != startHour){
					setId.append('<option value="' + calendar.getDigitNum(i) +'00">' + calendar.getDigitNum(i) + ' 시 00분</option>');
				}else if(j == 1 && i != possSHour &&  i != endHour){
					setId.append('<option value="' + calendar.getDigitNum(i) +'30">' + calendar.getDigitNum(i) + ' 시 30분</option>');	
				}else if(j == 1 && i == endHour && eMin != "00" && eMin != null){
					setId.append('<option value="' + calendar.getDigitNum(i) +'30">' + calendar.getDigitNum(i) + ' 시 30분</option>');	
				}
			}
			/*
			for(var j=0; j<2; j++){
				if(j == 0 && i != startHour){
					setId.append('<option value="' + calendar.getDigitNum(i) +'00">' + calendar.getDigitNum(i) + ' 시 00분</option>');
				}else if(j == 0 && i == possSHour && sMin == "30" && sMin != null){
					setId.append('<option value="' + calendar.getDigitNum(i) +'30">' + calendar.getDigitNum(i) + ' 시 30분</option>');	
				}else if(j == 0 && i == possSHour && sMin == "00" && sMin != null){
					setId.append('<option value="' + calendar.getDigitNum(i) +'00">' + calendar.getDigitNum(i) + ' 시 00분</option>');	
				}else if(j == 1 && i != endHour){
					setId.append('<option value="' + calendar.getDigitNum(i) +'30">' + calendar.getDigitNum(i) + ' 시 30분</option>');	
				}else if(j == 1 && i == endHour && sMin != "00" && eMin != null){
					setId.append('<option value="' + calendar.getDigitNum(i) +'30">' + calendar.getDigitNum(i) + ' 시 30분</option>');	
				}
			}
			*/
		}
		console.log("SSSSS2 : ", setId)
	}else{
		for(var i=startHour; i<=endHour; i++){
			for(var j=0; j<2; j++){
				if(j == 0 && i != startHour){
					setId.append('<option value="' + calendar.getDigitNum(i) +'00">' + calendar.getDigitNum(i) + ' 시 00분</option>');
				}else if(j == 0 && i == startHour && sMin == null){
					setId.append('<option value="' + calendar.getDigitNum(i) +'00">' + calendar.getDigitNum(i) + ' 시 00분</option>');
				}else if(j == 0 && i == startHour && sMin == "00"){
					setId.append('<option value="' + calendar.getDigitNum(i) +'00">' + calendar.getDigitNum(i) + ' 시 00분</option>');
				}else if(j == 1 && i != endHour){
					setId.append('<option value="' + calendar.getDigitNum(i) +'30">' + calendar.getDigitNum(i) + ' 시 30분</option>');	
				}else if(j == 1 && i == endHour && eMin != "00" && eMin != null){
					setId.append('<option value="' + calendar.getDigitNum(i) +'30">' + calendar.getDigitNum(i) + ' 시 30분</option>');	
				}
			}
		}

	}
	
	/*
	if(calendar._nextDate == calendar._selectFromDate){
		console.log("SSSSSSSSSS ----- 1 : ", possSHour)
		for(var i=possSHour; i<=endHour; i++){
			for(var j=0; j<2; j++){
				if(j == 0 && i != startHour){
					setId.append('<option value="' + calendar.getDigitNum(i) +'00">' + calendar.getDigitNum(i) + ' 시 00분</option>');
				}else if(j == 0 && i == startHour && s_min == null){
					setId.append('<option value="' + calendar.getDigitNum(i) +'00">' + calendar.getDigitNum(i) + ' 시 00분</option>');
				}else if(j == 0 && i == startHour && s_min == "00" && sMin != null){
					setId.append('<option value="' + calendar.getDigitNum(i) +'00">' + calendar.getDigitNum(i) + ' 시 00분</option>');	
				}else if(j == 1 && i != endHour){
					setId.append('<option value="' + calendar.getDigitNum(i) +'30">' + calendar.getDigitNum(i) + ' 시 30분</option>');	
				}else if(j == 1 && i == endHour && s_min != "00" && eMin != null){
					setId.append('<option value="' + calendar.getDigitNum(i) +'30">' + calendar.getDigitNum(i) + ' 시 30분</option>');	
				}
			}
		}	
	} else {
		console.log("SSSSSSSSSS ----- 2 : ", possSHour)
		if(chk_dt == calendar._selectFromDate){
			startHour = possSHour;
		}else{
			startHour = Number(sHour);
		}
		console.log("SSSSSSSSSS ----- 2 : ", startHour)
		for(var i=startHour; i<=endHour; i++){
			for(var j=0; j<2; j++){
				if(j == 0 && i != startHour){
					setId.append('<option value="' + calendar.getDigitNum(i) +'00">' + calendar.getDigitNum(i) + ' 시 00분</option>');
				}else if(j == 0 && i == startHour && sMin == null){
					setId.append('<option value="' + calendar.getDigitNum(i) +'00">' + calendar.getDigitNum(i) + ' 시 00분</option>');
				}else if(j == 0 && i == startHour && sMin == "00"){
					setId.append('<option value="' + calendar.getDigitNum(i) +'00">' + calendar.getDigitNum(i) + ' 시 00분</option>');
				}else if(j == 1 && i != endHour){
					setId.append('<option value="' + calendar.getDigitNum(i) +'30">' + calendar.getDigitNum(i) + ' 시 30분</option>');	
				}else if(j == 1 && i == endHour && eMin != "00" && eMin != null){
					setId.append('<option value="' + calendar.getDigitNum(i) +'30">' + calendar.getDigitNum(i) + ' 시 30분</option>');	
				}
			}
		}
	}
	 */
}

function setInlandHour(id,sHour,eHour,sMin,eMin){
	var currentDate = new Date();
	var cHour = currentDate.getHours();
	var cMin = currentDate.getMinutes();
	var possSHour = 9;
	var setId = $("#"+id);
	var startHour = (sHour == null ? 9 : parseInt(sHour));
	var endHour = (eHour == null ? 19 : parseInt(eHour));
	console.log("setInlandHour(): startHour="+startHour);
	console.log("setInlandHour(): endHour="+endHour);
	
	if("selectRentTime1" == id) {
		if( cHour >= startHour && cHour <= endHour){
			var nDate = currentDate;
			nDate.setHours(nDate.getHours()+24);
			
			possSHour = nDate.getHours();
			
			if(cHour == (endHour-1) && cMin >= 30) {
				possSHour = startHour;
			}
		} else {
			possSHour = startHour;
		}
	} else {
		if( cHour >= startHour && cHour <= endHour){
			possSHour = (sHour == null ? 9 : parseInt(sHour));
		} else {
			possSHour = 9;
		}
	}

	//시간 분 생성
	setId.empty();
	
	if(calendar._nextDate == calendar._selectFromDate){
		for(var i=possSHour; i<=endHour; i++){
			for(var j=0; j<2; j++){
				if(j == 0 && i != startHour){
					setId.append('<option value="' + calendar.getDigitNum(i) +'00">' + calendar.getDigitNum(i) + ' 시 00분</option>');
				}else if(j == 0 && i == startHour && sMin == null){
					setId.append('<option value="' + calendar.getDigitNum(i) +'00">' + calendar.getDigitNum(i) + ' 시 00분</option>');
				}else if(j == 0 && i == startHour && sMin == "00" && sMin != null){
					setId.append('<option value="' + calendar.getDigitNum(i) +'00">' + calendar.getDigitNum(i) + ' 시 00분</option>');	
				}else if(j == 1 && i != endHour){
					setId.append('<option value="' + calendar.getDigitNum(i) +'30">' + calendar.getDigitNum(i) + ' 시 30분</option>');	
				}else if(j == 1 && i == endHour && eMin != "00" && eMin != null){
					setId.append('<option value="' + calendar.getDigitNum(i) +'30">' + calendar.getDigitNum(i) + ' 시 30분</option>');	
				}
			}
		}	
	} else {
		for(var i=startHour; i<=endHour; i++){
			for(var j=0; j<2; j++){
				if(j == 0 && i != startHour){
					setId.append('<option value="' + calendar.getDigitNum(i) +'00">' + calendar.getDigitNum(i) + ' 시 00분</option>');
				}else if(j == 0 && i == startHour && sMin == null){
					setId.append('<option value="' + calendar.getDigitNum(i) +'00">' + calendar.getDigitNum(i) + ' 시 00분</option>');
				}else if(j == 0 && i == startHour && sMin == "00"){
					setId.append('<option value="' + calendar.getDigitNum(i) +'00">' + calendar.getDigitNum(i) + ' 시 00분</option>');
				}else if(j == 1 && i != endHour){
					setId.append('<option value="' + calendar.getDigitNum(i) +'30">' + calendar.getDigitNum(i) + ' 시 30분</option>');	
				}else if(j == 1 && i == endHour && eMin != "00" && eMin != null){
					setId.append('<option value="' + calendar.getDigitNum(i) +'30">' + calendar.getDigitNum(i) + ' 시 30분</option>');	
				}
			}
		}
	}
}

function setInlandBranch(shortSDate, shortSTime, shortLDate, shortLTime){ //내륙 지점의 영업시간을 비교하여 dsiabled 처리
	var tempStartDate = (shortSDate == null ? calendar._selectFromDate : shortSDate) + (shortSTime == null ? $("#selectRentTime1").val() : shortSTime);
	var tempLastDate = (shortLDate == null ? calendar._selectToDate : shortLDate) + (shortLTime == null ? $("#selectRentTime2").val() : shortLTime);
	var sDate = tempStartDate.length==12 ? tempStartDate : "";
	var lDate = tempLastDate.length==12 ? tempLastDate : "";
	var area = $("#select_area1").val();
	var branchId = $("#select_branch1").val();
	
	$.ajax({
		type : "post",
		url : "/rent/rentcar/getBranch.json",
		data : {
			'cdId'  : area
		   ,'model' : _carDtl
		   ,'sDate' : sDate
		   ,'lDate' : lDate
			},
		dataType : "json",
		success : function(data) {
			var list = data.areaList;
			var sHour = parseInt((shortSTime == null ? $("#selectRentTime1").val() : shortSTime));
			var lHour = parseInt((shortLTime == null ? $("#selectRentTime2").val() : shortLTime));
			var options1 = "<option value=''>지점선택</option>";
			var selectFromDate = (shortSDate == null ? calendar._selectFromDate : shortSDate);
			var selectToDate = (shortLDate == null ? calendar._selectToDate : shortLDate);
			
			for(var i =0; i < list.length; i++){
				var isDisable = false;
				
				if(list[i].rsvPsblCnt == 0 || (sHour < list[i].sStHhMi) ||(sHour > list[i].sEndHhMi) )
				{//대여 가능한 차량이 없거나 대여시간이 지점 오픈시간보다 이르거나 지점 종료시간보다 늦을 경우 	
					isDisable = true;
				}
				
				if((lHour < list[i].lStHhMi) || (lHour > list[i].lEndHhMi))
				{//반납시간이 지점 오픈시간보다 이르거나 지점 종료시간보다 늦을 경우
					isDisable = true;
				}

				if((selectFromDate  == "20201001" || selectToDate == "20201001") && list[i].schId != null) { // 비직영만 추석(2020-10-01) 전체 휴무 
					isDisable = true;
				}
				
				if(branchHoliyDayCheck( list[i].branchId, calendar._selectFromDate, calendar._selectToDate ) ){
					isDisable = true;
				}
				
				
				options1 += makeOption(list[i], isDisable);
			}
			
			$("#select_branch1").html(options1);
			$("#select_branch1").val(branchId);
		},
		error : function(){
			alert('데이터 통신이 실패했습니다.\n잠시 후 다시 시도하세요.');
		} 
	});
}

function layerPopupAllClose(){
	var list = $('.modal-pop');

	for(var i = 0; i < list.length; i++){
		var display = document.getElementById(list[i].id).style.display;
		
		if(display == "block") {
			if(list[i].id == "modal-terms-check"){
				$("#modal-terms-check").hide();
				$("#modal-terms-check").prop('disabled',true);
				$("#btn_checkup").addClass('disabled');
				$(".guidbox").css('display','block');
				return true;
			} else {		
				$("#" + list[i].id + " .modal-close").trigger("click");
				return true;
			}
		}
 	}
	
	//주소창 닫기
	if(searchPostSatus != null) {
		if(searchPostSatus.closed == false) {
			window.open('','pop').close();
			return true;
		}
	}
	
	return false;
}

//인터파크 제휴 iframe 팝업 호출
function openCustomModal(popId, tagId){
	$("#" + popId).show();
	setCustonModal(popId, tagId);
}

//인터파크 제휴 iframe 팝업 설정
function setCustonModal(popId, tagId){
	$("#" + popId).css('margin-left', '25px');
	$("#" + popId).css('overflow', 'hidden');
	$("#" + popId).css('width', '650px');
	$("#" + popId).css('height', '650px');
	$("#" + popId).css('top', $("#" + tagId).offset().top-100);
	
	$(".dimd").css('display','block');
	
	if(popId == "modal-car"){
		$(".tab-menu.tab-menu--car-select").removeClass("ios-slide");
		$(".tab-menu.tab-menu--car-select").addClass('noAfter');
	} else if(popId == "modal-calendar"){
		$(".modal-bottom").css('margin-left', '25px');
		$(".modal-bottom").css('width', '650px');
		$(".modal-bottom").css('top', $("#" + tagId).offset().top-100+650);
	} else if(popId == "modal-reservation-info"){
		$(".modal-bottom").css('margin-left', '25px');
		$(".modal-bottom").css('width', '650px');
		$(".modal-bottom").css('top', $("#" + tagId).offset().top-100+570);
	} else if(popId == "modal-terms-check"){
		$(".rent-scroll3").removeClass('ios-slide');
		$(".rent-scroll3").css('overflow-y','scroll');
		$(".modal-bottom").css('margin-left', '25px');
		$(".modal-bottom").css('width', '650px');
		$(".modal-bottom").css('top', $("#" + tagId).offset().top-100+583);
	} else if(popId == "modal-mapview"){
		if(tagId == "map1"){
			openBranch(1);	
		} else {
			openBranch(2);
		}
	}
}

function makeOption(item, is_reserved){	
	if (is_reserved) // 예약완료이면 class로 disable처리, 지점명앞에 예약완료 표시
	{
		return '<option disabled id="' + item.branchId + '" data-area="' + item.rgsprCd + '" value="' + item.branchId + '" data-aname="' + $('#select_area1 option:selected').text() + '" data-bname="' + item.branchNm + '">' + item.branchNm + '</option>';
	}
	else
	{
		return '<option id="' + item.branchId + '" data-area="' + item.rgsprCd + '" value="' + item.branchId + '" data-aname="' + $('#select_area1 option:selected').text() + '" data-bname="' + item.branchNm + '">' + item.branchNm + '</option>';
	}
}

function branchHoliyDayCheck(branchId, sDate, lDate){
	//2021-02-11 휴무 지점
	var holiyDay1branchId = ["100163"/*경기지점*/ ,"100249"/*경상지점*/];
	
	//2021-02-12 휴무 지점
	var holiyDay2branchId = [,"100128" ,"100118" ,"100112" ,"100137" ,"100108"
	                         			,"100114" ,"100120" ,"100102" ,"100125" ,"100135" 
	                         			,"100669" ,"100119" ,"100126", "100663" /*서울지점*/
	                         			,"100144" ,"100154" /*인천지점*/
	                         			,"100111" ,"100667" ,"100130" ,"100113" ,"100171"
	                         			,"100159" ,"100160" ,"100174" ,"100116" ,"100143"
	                         			,"100180" ,"100181" ,"100163" ,"100147" ,"000510"
	                         			,"100167" ,"100169" /*경기지점*/
	                         			,"100183" ,"100188" ,"100189" /*강원지점*/
	                         			,"100206" ,"100209" ,"100212" ,"100213" ,"100661"
	                         			,"100214" ,"100217" ,"100223" ,"100225" ,"100227"
	                         			,"100218" /*충청지점*/
	                         			,"100240" ,"100236" ,"100231" ,"100662" ,"100249"
	                         			,"100250" ,"100239" ,"100253" ,"100238" /*경상지점*/
	                         			,"100191" ,"100196" ,"100198" ,"100199" ,"100205"
	                         			,"100202" /*전라지점*/];
	
	//2021-02-13 휴무 지점	
	var holiyDay3branchId = ["100128" ,"100137" ,"100108" ,"100102" ,"100135"
	                         			,"100669" ,"100119" ,"100126" /*서울지점*/
	                         			,"100154" /*인천지점*/
	                         			,"100163" /*경기지점*/
	                         			,"100231", "100249" ,"100238" /*경상지점*/];
	
	//2021-02-14 휴무 지점	
	var holiyDay4branchId = ["100163" /*경기지점*/];
	
	var returnType = false;
	
	for(var i=0; i<holiyDay1branchId.length; i++){
		if(branchId == holiyDay1branchId[i] && (sDate == "20210211" || lDate == "20210211") ){			
			returnType = true;
		}
	}
	for(var i=0; i<holiyDay2branchId.length; i++){
		if(branchId == holiyDay2branchId[i] && (sDate == "20210212" || lDate == "20210212") ){			
			returnType = true;
		}
	}
	for(var i=0; i<holiyDay3branchId.length; i++){
		if(branchId == holiyDay3branchId[i] && (sDate == "20210213" || lDate == "20210213") ){			
			returnType = true;
		}
	}
	for(var i=0; i<holiyDay4branchId.length; i++){
		if(branchId == holiyDay4branchId[i] && (sDate == "20210214" || lDate == "20210214") ){			
			returnType = true;
		}
	}
	
	return returnType;
}

//기존 및 추가 만료일 체크
function licenseAvilCheck(){
	var birthDay = $("[name=birthday]").val();	
	var ageCheck = ageReturnCheck(birthDay);
	var licenseType = $("[name=licenseType]").val();
	var licenseAvil = $('[name=licenseAvil]').val();
	var lcnsYr = licenseAvil.substring(0,4);
	var lcnsMn = licenseAvil.substring(4,6);
	var lcnsDt = licenseAvil.substring(6,8);
	
	if( ageCheck < 75){
		if( ageCheck < 70){
			//70세 미만 2종보통 이상
			if(licenseType != "" && licenseType != "106005"){
				// 1종보통이상 적성검사 만료일 이후 1년까지 유효면허
				//console.log("1종 보통 이상 70세 미만 A : ", licenseAvil);
				licenseAvil = (Number(lcnsYr) + 1) + lcnsMn + lcnsDt;
				//console.log("1종 보통 이상 70세 미만 B : ", licenseAvil);
			}else{
				//70세 미만 2종보통 미만
				/*
				if( parseInt(licenseAvil) >= parseInt(20200222) && parseInt(licenseAvil) <= parseInt(20201231) ){
					licenseAvil = "20210331";
					//console.log("1종 보통 미만 70세 미만 20201231 이전 : ", licenseAvil);
				}else if( parseInt(licenseAvil) >= parseInt(20210101) && parseInt(licenseAvil) <= parseInt(20210630) ){
					licenseAvil = "20210630";
					//console.log("1종 보통 미만 70세 미만 20210630 이전 : ", licenseAvil);
				}
				*/
			}
		}else{
			//70세 이상 운전자 만료일 이후 종별상관없이 +1년까지 유효면허 
			//console.log("70세 이상 0630이후 A : ", licenseAvil);
			licenseAvil = (Number(lcnsYr) + 1) + lcnsMn + lcnsDt;
			//console.log("70세 이상 0630이후 B : ", licenseAvil);
		}
	}else if( ageCheck >= 75){
		if( parseInt(licenseAvil) >= parseInt(20200222) && parseInt(licenseAvil) <= parseInt(20201231) ){
			licenseAvil = "20211231";
			//console.log("75세 이상 20201231 이전 : ", licenseAvil);
		}/*else if( parseInt(licenseAvil) >= parseInt(20210101) && parseInt(licenseAvil) <= parseInt(20210630) ){
			licenseAvil = "20210630";
			console.log("75세 이상 20210630 이전 : ", licenseAvil);
		}*/else{
			//75세 이상 운전자 만료일 이후 종별상관없이 +1년까지 유효면허
			//console.log("75세 이상 A : ", licenseAvil);
			licenseAvil = (Number(lcnsYr) + 1) + lcnsMn + lcnsDt;
			//console.log("75세 이상 B : ", licenseAvil);
		}
	}
	console.log("CheckLicenseAvil : ", licenseAvil);
	return licenseAvil;
}
