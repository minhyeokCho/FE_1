//지역,지점선택 임시변수
var _br_loc_html = null; 
var _br_loc_code = null;
var _br1_text = "지역/지점선택";
var _br2_text = "지역/지점선택";

var _store1_html = null;

$(function(){
	
	// 지역1(렌탈지역)을 클릭했을때
	$("#dlRegion1").on('click', 'a', function(){		
		var location_cd = $(this).data('cd');			
		_br_loc_code = location_cd;
		console.log("AAA : ", location_cd);
		$("#cdId").val(location_cd);
		getBranchList(location_cd); //지점조회
	});	
	
	// 디폴트로 첫번째 지역(서울)이 선택된것으로 가정하고 첫번째지역의 지점을 조회
	//$("#dlRegion1 a:eq(0)").trigger('click');
	
	// 지역/지점 레이어 열려있을때 바깥쪽 클릭하면 닫음
	$(document).mouseup(function (e) {
		var container = $("div.layer-multiple-select-box.is-expanded");
		if (container.length > 0 && !$(e.target).hasClass('multiple-select-box') && container.find($(e.target)).length == 0){			
				$("span.multiple-select-box").removeClass('is-expanded');			
				container.removeClass('is-expanded');
				
				restore_multibox();
			}	
		});
	
});

function restore_multibox()
{
	if (_br_loc_code && _br_loc_code != $("#cdId").val())
	{
		if (_br_loc_html)
		{
			$("#dlRegion1, dlRegion2").html(_br_loc_html);
			$("#div_store_area1").html(_store1_html);
		}
		else
		{
			$("#dlRegion1 a:eq(0)").trigger('click');
		}
	}
}

//지점선택시 처리 (bundle.js에서 호출)
function select_branch($this, content)
{
	_last_event_obj = 'branch';
	console.log('지점선택 select_branch() ');
	var $thisStore = $this.closest('dl.store');
	var branchCd = $this.data('cd');	
	
	$("#cdId").val(_br_loc_code); 
	$("#cdId2").val(_br_loc_code);  
	
	var br_nm = content.split('/')[1];  // '/'뒷부분이 지점명
	
	if ($thisStore.attr('id') == 'div_store_area1') // 선택된 지점이 대여지점이면
	{	
		var branchSch = $this.data('sch');
		$("#branchSch").val(branchSch);
		
		//반납지점도 동일하게 setting
		$("#branchId").val(branchCd); 
		$("#branchId2").val(branchCd); 
		
		// 반납지점 select-box에도 대여지점과 동일한 text출력
		var $reternStore = $("dl.store:eq(1)");
		$reternStore.find("strong").text(content);	
		
		_br_loc_html = $('#dlRegion1').html();
		_br_loc_code = $("#cdId").val(); 
		
		$reternStore.html($thisStore.html());
		$('#dlRegion2').html(_br_loc_html);

		/*
		if (content.substr(0,2) == '서울') //선택된 지역이 서울이면
		{		
			$('#dlRegion2.location a:not(.is-selected)').addClass('cl-thin is-disabled'); // 선택된 지역외에는 disable 시킴
			$('#br2').removeClass('is-disabled'); //반납지점 disable 해제(지점만 선택가능)
		}
		else
		{
			$('#br2').addClass('is-disabled'); //반납지점 disable 해제(지점만 선택가능)
		}
		*/	
		
		$("#br1,#br2").text(content);  //대여지점, 반납지점 동일하게 
		_br1_text = content;
		_br2_text = content;
		
		_store1_html = $("#div_store_area1").html();
		$("#div_store_area2").html(_store1_html);
	}
	else //반납지점이면
	{
		$("#branchId2").val(branchCd); //반납지점코드만 변경
		$('#br2 ').text(content); //반납지점명만 변경
		_br2_text = content;
		
		//충정로지점 반납금지(충정로점 제외)
		if($("#branchId2").val() == "000010"){
			if($("#branchId").val() != "000010"){
				alert("광화문지점 예약시에만 반납 가능합니다.");
				
				$("#branchId2").val($("#branchId").val());
				$('#br2 ').text($('#br1 ').text());
				_br2_text = _br1_text;
				_store1_html = $("#div_store_area1").html();
				$("#div_store_area2").html(_store1_html);
			}
		}
		console.log($('#br2 ').text());
	}	
	
	getInlandPossTime();
	submitable();
}

function makeBranchOption(item, is_reserved, p_branchId ){	
	var br_cd = item.branchId;
	var br_nm = item.branchNm;	
	var br_sch = (item.schId == null ? "" : item.schId);
	var class_str ="";		
	if (is_reserved) // 예약완료이면 class로 disable처리, 지점명앞에 예약완료 표시
	{
		class_str = ' class="cl-thin is-disabled"';
		//br_nm = "[예약완료] " + br_nm;
	}
	else if (p_branchId == br_cd) // 예약완료가 아니면서 br_cd와 p_branchId가 같으면 선택상태로
	{
		class_str = ' class="is-selected"';
	}
		
	return '<dd><a'+ class_str +' href="javascript:void()" data-cd="' + br_cd +'" data-sch="' + br_sch +'">' + br_nm +'</a></dd>';
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

function getBranchList(cdId){	
	console.log("cdId1 : ", cdId);
	
	var options1 = "<dt>지점선택</dt>"; //지역에 따른 대여지점 옵션
	var options2 = "<dt>지점선택</dt>"; //지역에 따른 반납지점 옵션
	
	if (cdId == null || cdId == '') //선택된 지점이 없으면 지점선택을 모두 지움
	{
		$('dl.store').html(options1);
		$("div.rent-store-select span.multiple-select-box strong").text("지역/지점선택");
		return;
	}
	
	var sDate = "";
	if($("#sDate").val()!= null && $("#sDate").val()!="") sDate = dateFormat($('#sDate').val(),'',0);
	
	var lDate = "";
	if($("#lDate").val()!= null && $("#lDate").val()!="") lDate = dateFormat($('#lDate').val(),'',0);

	var branchId = $("#branchId").val();
	var branchId2 = $("#branchId2").val();

	var sHourMinute = $('#sHour').val()+$('#sMinute').val();
	var TMP_SDATE = sDate +$('#sHour').val()+$('#sMinute').val();
	var SDATE = TMP_SDATE.length==12?TMP_SDATE:"";
	var lHourMinute = $('#lHour').val()+$('#lMinute').val();
	var TMP_LDATE = lDate +$('#lHour').val()+$('#lMinute').val();
	var LDATE = TMP_LDATE.length==12?TMP_LDATE:"";
	console.log("cdId2 : ", cdId);
	$.ajax({
		type : "post",
		url : "/rent/rentcar/getBranch.json",
		data : {
			'cdId' :cdId
		   ,'model' : $('#carTypeName').val()
		   ,'sDate' : SDATE
		   ,'lDate' : LDATE
			},
		dataType : "json",
		success : function(data) {
			var list = data.areaList;
			sHourMinute = $('#sHour').val()+$('#sMinute').val();
			lHourMinute = $('#lHour').val()+$('#lMinute').val();
			
			for(var i = 0; i < list.length; i++){
				
				var isDisable = false;
				var isDisable2 = false;
				//console.log("test sHourMinute => " + parseInt(sHourMinute));
				//console.log("test sStHhMi => " + parseInt(list[i].sStHhMi));
				//console.log("test sEndHhMi => " + parseInt(list[i].sEndHhMi));
				if(parseInt(list[i].rsvPsblCnt)==0 || (parseInt(sHourMinute) < parseInt(list[i].sStHhMi)) 
						||(parseInt(sHourMinute) > parseInt(list[i].sEndHhMi)) )
				{//대여 가능한 차량이 없거나 대여시간이 지점 오픈시간보다 이르거나 지점 종료시간보다 늦을 경우 	
					isDisable = true;
				}
				if((parseInt(lHourMinute) < parseInt(list[i].lStHhMi )) || (parseInt(lHourMinute) > parseInt(list[i].lEndHhMi)))
				{//반납시간이 지점 오픈시간보다 이르거나 지점 종료시간보다 늦을 경우
					//isDisable2 = true;
					isDisable = true;
				}
				
				if(($("#sDate").val() == "2020-10-01" || $("#lDate").val() == "2020-10-01") && list[i].schId != null) { // 비직영만 추석(2020-10-01) 전체 휴무 
					isDisable = true;
				}
				
				if(branchHoliyDayCheck( list[i].branchId, $("#sDate").val(), $("#lDate").val() ) ){
					isDisable = true;
				}
				
				options1 += makeBranchOption(list[i], isDisable , branchId)+"\n"; //대여 지점 옵션 생성
				options2 += makeBranchOption(list[i], false, branchId2)+"\n"; //반납 지점 옵션 생성(반납지점은 disable하지 않음)
				
				if (branchId && branchId == list[i].branchId && isDisable ) //선택되어 있는 지점이 예약불가능한 경우
				{
					//alertMsg('branch');
					console.log("***getBranchList --- E02 선택되어 있는 지점이 예약불가능한 경우");	
				}
			}
			
			if(cdId != ''){//반납 지역 셋팅 및 비활성화
				$('dl.store:eq(0)').html(options1); // 대여지점목록 지정
				if(list.length > 0){
						//$('dl.store:eq(1)').html(options2); // 반납지점목록 지정

						if(parseInt(list[0].minSStHhMi)>parseInt(sHourMinute)||parseInt(list[0].maxSEndHhMi)<parseInt(sHourMinute))
						{
							//alert('선택하신 지역은 '+list[0].tMinSStHhMi+' ~ '+list[0].tMaxSEndHhMi+'까지 예약 가능합니다.');
						}
						if(parseInt(list[0].minLStHhMi)>parseInt(lHourMinute)||parseInt(list[0].maxLEndHhMi)<parseInt(lHourMinute))
						{
							//alert('선택하신 지역은 '+list[0].tMinLStHhMi+' ~ '+list[0].tMaxLEndHhMi+'까지 반납 가능합니다.');
						}
					/*}*/
				}else{
					console.log("***getBranchList --- E03");					
					alert("해당 지역에는 예약 가능한 지점이 없습니다.");
				}
			}else{
				console.log("***getBranchList --- E04 대여지역이 없을 때");	
			}
		},
		error : function(){
			alert('데이터 통신이 실패했습니다.\n잠시 후 다시 시도하세요.');
		} 
	});
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
		if(branchId == holiyDay1branchId[i] && (sDate == "2021-02-11" || lDate == "2021-02-11") ){			
			returnType = true;
		}
	}
	for(var i=0; i<holiyDay2branchId.length; i++){
		if(branchId == holiyDay2branchId[i] && (sDate == "2021-02-12" || lDate == "2021-02-12") ){			
			returnType = true;
		}
	}
	for(var i=0; i<holiyDay3branchId.length; i++){
		if(branchId == holiyDay3branchId[i] && (sDate == "2021-02-13" || lDate == "2021-02-13") ){			
			returnType = true;
		}
	}
	for(var i=0; i<holiyDay4branchId.length; i++){
		if(branchId == holiyDay4branchId[i] && (sDate == "2021-02-14" || lDate == "2021-02-14") ){			
			returnType = true;
		}
	}
	
	return returnType;
}