var hasCar11Possible = false;
var hasCamera = false;

$(".ldw-normal").hide();
$(".ldw-all").show();

$("#selDomain").on('change', function(){
	$("#domain").val($(this).val());
	
	if($("#selDomain").val() != "" && $("#selDomain").val() != null){//텍스트 수정 불가, 비활성화
		$("#domain").addClass("readonly");
		$("#domain").prop("readonly", true);
		$("#domain").prop("disabled", true);
		
		if($("[name=emailId]").val() != ""){
			$(".alert-email").removeClass("alert-msg");
			$("#msg-email").html("");
		}else{
			$(".alert-email").addClass("alert-msg");
			$("#msg-email").html("이메일을 입력해주세요.");
		}
	}else{//텍스트 수정가능, 활성화
		$("#domain").removeClass("readonly");
		$("#domain").prop("readonly", false);
		$("#domain").prop("disabled", false);
		
		$(".alert-email").addClass("alert-msg");
		$("#msg-email").html("이메일을 입력해주세요.");
	}
	
	var email = "";
	if($(this).val() != "" && $("[name=emailId]").val() != ""){
		email = $("[name=emailId]").val() + "@" + $(this).val();
		$("#email").val(email);
		$("#reservEmail").html(email);
	}
});


/* 이용약관 체크 */	
$("div.terms-list input").on('change', function(){	
	if (this.id == "select-terms0") //전체 동의일 경우
	{
		$("div.terms-list input:gt(0)").prop('checked', $(this).is(":checked"));
	}
	else //개별 동의일 경우 (동의갯수 확인) 5개 체크되어 있으면 전체동의 체크. 아니면 해제.
	{
		var checks = $('div.terms-list input:gt(0):checked').length;
		$("#select-terms0").prop('checked', checks == 6); 
	}
})


$("[name=userNm]").on('change', function(){
	$("#reservNm").html($(this).val());
});
$("[name=birthday]").on('change', function(){
	$("#reservBirth").html($(this).val());
});
$("[name=mobile]").on('change', function(){
	$("#reservHp").html($(this).val());
});
//메일 부분 수정 필요
$("[name=emailId]").on('change', function(){
	var email="";
	if($(this).val() != "" && $("[name=domain]").val() != ""){
		email = $(this).val() + "@" + $("[name=domain]").val();
		$("#email").val(email);
		$("#reservEmail").html(email);
	}
});

$("[name=domain]").on('change', function(){
	var email="";
	if($(this).val() != "" && $("[name=emailId]").val() != ""){
		email = $("[name=emailId]").val() + "@" + $(this).val();
		$("#email").val(email);
		$("#reservEmail").html(email);
	}
});


$('div.js-scroll-target').on('scroll', function() {
	var $this = $(this),
			$scrollBtn = $('.js-scroll-btn');
	var height = $this.height(),
			scrollTop = $this.prop('scrollTop'),
			scrollHeight = $this.prop('scrollHeight') - 50;
	if (scrollTop + height >= scrollHeight / 3) {
		$scrollBtn.removeClass('disabled');
		$(".guidbox").css('display','none');//검은거 제거
	} else if (!$scrollBtn.hasClass('disabled')) {
		$scrollBtn.addClass('disabled');
	}
});




function popupCheck(){
	var flag = false;
	
	var modal = $(".modal-pop");
	for(var i=0;i<modal.length;i++) {
		if(modal[i].getAttribute("style")!=null){
			if(modal[i].getAttribute("style").indexOf("block") > -1){
				flag = true;
			}
		}
	}
	
	return flag;
}

$("#modal-login-pop").keypress(function(event){
	if(event.which == 13 || event.keyCode == 13){
		goLogin('jeju');
	}
});

$("#guestReserve").on('click', function(){//비회원 버튼을 눌렀을 때
	if(confirm("회원으로 예약 시 다양한 혜택을 받으실 수 있습니다.\n회원 로그인 후 예약 진행 부탁드립니다.\n비회원으로 계속 진행 하시려면 확인 버튼을 눌러주세요.")){
		$("#modal-login-pop .modal-close").trigger('click');
	}
});

$("#modal-login-pop .modal-close").on('click', function(){
	setCookie("mobGuestRental", 1);//창이 그냥 닫히면 비회원 상태로 취급
});
function checkLogin(){//로그인 상태 확인
	var userClass = $("#userClass").val();
	var guest_cookie = getCookie("mobGuestRental");
	
console.log("guest_cookie="+guest_cookie);
	
	if(guest_cookie != 1){
console.log("userClass="+userClass);
		if(userClass == -1){//비 로그인 상태
			$("#modal-login-pop").attr("style","display: block;");
		}else if(userClass == 1){//법인
			alert("법인 예약은 SK렌터카 웹사이트에서만 가능합니다.");
			location.href = "/rent/login/main.do?returnUrl=/rent/rentcar/short_rent_reservation_new_jeju_company.do";	//PC 로그인 페이지로 이동 후 예약페이지로
		}
	}
}	
	



function closeBranchModel(){
	$("#modal-branch .modal-close").trigger('click');
}
	
var searchPostSatus = null;
function search_post(){
	searchPostSatus = window.open("/mobile/etc/pop_searchaddr.do","pop","scrollbars=yes, resizable=yes");
}

function jusoCallBack(roadAddrPart1,addrDetail,jibunAddr, zipNo){
	// 팝업페이지에서 주소입력한 정보를 받아서, 현 페이지에 정보를 등록합니다.
	$("[name=homeZip]").val(zipNo);
	$("[name=homeAddr]").val(roadAddrPart1);
	$("[name=homeDtlAddr]").val(addrDetail);
	
	$(".alert-addr").removeClass("alert-msg");
	$("#msg-addr").html("");
	showResInfo();
}

function changeInput(){//완전자차를 선택하면 변한다.
	var ldwCD = $("#ldwId").val();
	var ldwTxt = $("#ldwId option:selected").text();
	var userCls = $("#userClass").val();
	
	$("#cfm_iRateAmt").text(ldwTxt);
	
	var sDate = $("#rentDateTime1").val();
	var carTypeName = _carDtl;
	var ldwId = $("#ldwId").val();
	
	
	hasResChange = true;
	setTimeout(showResInfo(),500);
	
	if(ldwCD != null && ldwCD != ""){
		$("#msg-ldw").html("");
		$("#ldwId").removeClass("borderorange");
	}else{
		$("#msg-ldw").html("차량손해면책제도를 선택해주세요.");
		$("#ldwId").addClass("borderorange");
	}
	
	accd_close('#accord_rent');
	accd_open('#accord_user');
	accd_close('#accord-term');
	
	var offset = $("#accord_user").offset();
	$("html, body").animate({scrollTop: offset.top-56}, 10);
	
	//console.log("ldwTxt="+ldwTxt);
	//console.log("ldwCD="+ldwCD);
	//console.log("userClass="+userCls);		
}

function setLicenseType(){
	hasLcnOk = false;
}

function resetDatePicker(dateArr)
{
	
}

//달력컴포넌트에서 확인버튼 눌렀을때	
function confirmCalendarBtn(){
	if($("#select_branch1 option:selected").val() == "" || $("#select_branch2 option:selected").val() == ""){
		alert("대여/반납 지점을 선택해주세요.");
		return;
	}
	
	if ($("#btn_confirm_date").hasClass('disabled')) return;
	
	// 폼변수에 대여일시, 반납일시 저장
	if (calendar._selectFromDate == null)
	{
		$("#rentDateTime1").val('');
		$("#rentDateTime2").val('');
	}
	else
	{	
		$("#rentDateTime1").val(calendar._selectFromDate + $("#selectRentTime1").val());
		$("#rentDateTime2").val(calendar._selectToDate + $("#selectRentTime2").val());	
	}
	
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
		var branch_cd = $option1.val();

		if (branch_cd != '') //  대여지점을 선택했을때
		{
			br1 = $option1.data("aname") + " / " +$option1.data("bname");
			br2 = $option2.data("aname") + " / " +$option2.data("bname");
		}
		else
		{
			br1 = "대여 지점 선택";
			br2 = "반납 지점 선택";
		}		
	}
	
	var alt1 = $("#altField1").val();
	var alt2 = $("#altField2").val();
	
	var dt1 = "";
	var dt2 = "";
	
	// 기간/지점선택 section
	if (alt1 == "")
	{
		$("#span_date_br1").html("대여 일시 선택<br>" + br1);
		$("#span_date_br2").html("반납 일시 선택<br>" + br2);
		$("#span_date_br2").parent().parent().removeClass("readonly");
		$("#span_date_br2").parent().parent().addClass("readonly");
	}
	else
	{
		dt1= alt1 + " " + $("#selectRentTime1 option:selected").text();
		dt2= alt2 + " " + $("#selectRentTime2 option:selected").text();
		$("#span_date_br1").html(dt1 + "<br>" + br1);
		$("#span_date_br2").html(dt2 + "<br>" + br2);
		$("#span_date_br2").parent().parent().removeClass("readonly");
		
		$("#alert-lDate").removeClass("alert-msg");
		$("#alert-sDate").removeClass("alert-msg");
		$("#msg-date").html("");
	}
	
	if (br1 == "대여 지점 선택")
	{
		br1 = "";
		br2 = "";
	}
	else
	{
		br1 = br1.split('/')[1];
		br2 = br2.split('/')[1];
	}

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
	
	if (diffDate == 0)      
	{
		alert("대여기간이 24시간 미만인 경우 할인혜택이 적용되지 않습니다."); 
	}
	hasResChange = true;
	// 날짜 선택 경고 제거
	$("#alert-date").removeClass("alert-msg");
	$("#msg-date").html("");
	
	//확인버튼을 눌렀을때 값을 기억해서 그냥 닫았다가 다시 열었을때 복구
	calendar_store_data();

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
	var userClass = $("#userClass").val();
	var ldwRtCd ="428009"; 
	if($('#ldwId').val() != null && $('#ldwId').val() !="") ldwRtCd =$('#ldwId').val();
	
	//법인이 아니라면
	if(userClass != 1){
		///라이센스 먼저 체크
		//라이센스 체크를 위한 데이터가 입력되어 있다면. 라이센스 체크	
		var userNm = $("[name=userNm]").val();
		var birthday = $("[name=birthday]").val();
		var licenseType = $("[name=licenseType]").val();
		var licenseNo = $("[name=licenseNo]").val();
		var licenseAvil = $('[name=licenseAvil]').val();
		var hasFlag = true; 
		
		var lcnLength = licenseNo.length; 
		var hasLcnNo = false;
		var hasLncTypeG  = false;
		
		if(lcnLength == 12)
			hasLcnNo = true;
		
		if(licenseType == '106009')
			hasLncTypeG = true;
		
		//국제면허인지 체크 아닐경우 라이센스 체크
		if(!hasLncTypeG){
				if(userNm != "" && birthday != "" && licenseType != "" && licenseNo != ""  && licenseAvil != "" && hasLcnNo){
				//라이센스 인증 가능하다면
				if($("[name=licenseType]").val()!="106009"){
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
								removeLcnAlertMsg();
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
											}
										}
										
										for (var i=0; i <= 9; i++)
										{
											$("#car-type" + i + " ul").html(htmlStr[i]);
										}
										
										if( !checkLicenImports( $("#selCarCd").val() ) ){
											hasLcnOk = false;
											hasCheckCar = false;
											hasNext = false;
											//직접입력일 경우
											if(lcnInputMode == "u"){
												setLcnsInput(false, false);
											}else{//촬영일 경우
												initLcnData();
											}
											
											//1종보통 3년 이상이 아니면 
											//조건이 안맞으면 차량선택 해제하고 노란 테두리에 위치로 이동처리
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
										}else{
											//3년 이상 이면
											ldwAbleCheck();
											hasResChange = true;
											showResInfo();
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
												
												$("#alert-car").addClass("alert-msg");
												$("#msg-car").html("대여차량을 선택해주세요.");
												var offset = $("#alert-cartype").offset();
												getPayment();
											}
											else
											{	
												//선택했던 차량 예약 가능										
												$("div.rent-car-select .tab-menu__list.selected").removeClass("selected");
												$("div.rent-car-select .tab-menu__list.c" +_carTab).addClass("selected");
												
												if (_carTab !== 0) //선택한 탭이 0번탭이 아니면
												{
													$("#car-type0").hide();  //0번탭 감추고
													$("#car-type" + _carTab).show(); //선택된탭 show
												}					
												$selectCar.addClass("cl-point1");
												
												//11인승여부 확인
												$.ajax({
													url : '/rent/rentcar/getCDVal.json',
													type : 'POST', 
													dataType : 'json',
													data : {"carTypeName":_carOrgn},
													success : function(data) {
														if(data.cdCnt > 0){
															//11인승 이상일 경우
															var sDate = $("#rentDateTime1").val();
															var userNm = $("[name=userNm]").val();
															var birthday = $("[name=birthday]").val();
															var licenseType = $("[name=licenseType]").val();
															var licenseNo = $("[name=licenseNo]").val();
															var branchId = $('#branchId').val();
															var branchId2 = $('#branchId2').val();
															hasCDVal = data.cdCnt; 
															
															if(checkLicenPeriod()){
																ldwAbleCheck();
																//1종보통 3년 이상 이면
																hasResChange = true;
																showResInfo();						
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
																
																//1종보통 3년 이상이 아니면 
																//조건이 안맞으면 차량선택 해제하고 노란 테두리에 위치로 이동처리
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
															}
														}else{
															ldwAbleCheck();
															hasResChange = true;
															showResInfo();
															hasCDVal = 0;
														}
														
														checkingLicenseIssued();	
													},
													error : function(xhr, status, error) {
														console.log(error);
														console.log(arguments);
													}
												});
											}
											//선택했던 차량 선택하고 11인승 가능 여부 체크 종료
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
										//setTimeout(showResInfo(),500);
									},
									error : function(){
										alert('데이터 통신이 실패했습니다.\n잠시 후 다시 시도하세요.');
									} 
								});
								
								$(".modal-pop").css({ display: "none" });
								$("html").removeClass("no-scroll");
							}else{
								$(".modal-pop").css({ display: "none" });
								$("html").removeClass("no-scroll");
								//유효한 운전면허가 아니다.
								
								//직접입력일 경우
								if(lcnInputMode == "u"){
									lcnResultMsg(data);
									return false;
								}else{//촬영일 경우
									alert(data.RTN_ALERT_MSG);
									initLcnData();
									return false;
								}
								
							}
						}
					});
				}
			}else{
				//라이센스 인증 불가할 경우
				//차량 정보 획득하고 11인승이상인지 플래그 전달, 면책수수료처리
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
							htmlStr7 = "<li><a href='javascript:void(0);' class='cl-point7'>스파크 [가솔린]</a></li>";
							console.log(" htmlStr7: ", htmlStr7 );
							$("#car-type0 ul").append(htmlStr7);
							$("#car-type1 ul").append(htmlStr7);
						}
						*/
						
						if( !checkLicenImports( $("#selCarCd").val() ) ){
							hasResChange = true;
							//직접입력일 경우
							if(lcnInputMode == "u"){
								setLcnsInput(false, false);
							}else{//촬영일 경우
								initLcnData();
							}
							showResInfo();
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
								
								$("#alert-car").addClass("alert-msg");
								$("#msg-car").html("대여차량을 선택해주세요.");
								var offset = $("#alert-cartype").offset();
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
								
								ldwAbleCheck();
								
								
								//11인승여부 확인
								$.ajax({
									url : '/rent/rentcar/getCDVal.json',
									type : 'POST', 
									dataType : 'json',
									data : {"carTypeName":_carOrgn},
									success : function(data) {
										if(data.cdCnt > 0){
											hasCDVal = data.cdCnt; 
											alert("해당 차량은 26세 이상, 면허 취득 3년 이상,\n면허 종별로 1종 보통 이상이 아니면 대여 거부 될 수 있습니다.");
										}else{
											hasCDVal = 0;
										}
										
										checkingLicenseIssued();	
										
										hasResChange = true;
										//직접입력일 경우
										if(lcnInputMode == "u"){
											setLcnsInput(false, false);
										}else{//촬영일 경우
											initLcnData();
										}
										showResInfo();
									},
									error : function(xhr, status, error) {
										console.log(error);
										console.log(arguments);
									}
								});
							}
						}
						
						//setLcnsInput(false, false);
						
						if(list != null && list.length > 10)
						{
							$("#car-type0 ul li:gt(9)").addClass("invisible"); // 10개이상이면 invisible 처리
							$("#car-type0 span.btn-drop").show(); //더보기 버튼 표시
						}
						else
						{
							$("#car-type0 span.btn-drop").hide(); //더보기 버튼 감춤
						}
						
						
						
						$(".modal-pop").css({ display: "none" });
						$("html").removeClass("no-scroll");
					},
					error : function(){
						alert('데이터 통신이 실패했습니다.\n잠시 후 다시 시도하세요.');
						
						$(".modal-pop").css({ display: "none" });
						$("html").removeClass("no-scroll");
					} 
					
				});	
			}
		//국제면허 아닐경우 종료
		}else{
		//국제면허 일 경우
			$('#TRD_NO').val(dateValueTrd()); 
			$('#TID').val("FDIKPG_skrent00_"+dateValue()+random_num());
			$('#MxIssueNO').val("skrent00"+ dateValue());
			$('#MxIssueDate').val(dateValue());
			
			$('#pSlsBranchCd').val(getSlsBranchCd($('#branchId').val())==$('#branchId').val()?"":getSlsBranchCd($('#branchId').val()));
			$('#pSlsBranchCd2').val(getSlsBranchCd($('#branchId2').val())==$('#branchId2').val()?"":getSlsBranchCd($('#branchId2').val()));
			
			$(':disabled').prop('disabled',false);
			
			ldwAbleCheck();
			getCar();	// 가용차정
			getPayment(); // 금액계산
			
			showResInfo();
			
		}
	//법인 아닐경우 종료	
	}else{
	//법인일경우
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
						
						$("#alert-car").addClass("alert-msg");
						$("#msg-car").html("대여차량을 선택해주세요.");
						var offset = $("#alert-cartype").offset();
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
				$(".modal-pop").css({ display: "none" });
				$("html").removeClass("no-scroll");
			},
			error : function(){
				alert('데이터 통신이 실패했습니다.\n잠시 후 다시 시도하세요.');
				
				$(".modal-pop").css({ display: "none" });
				$("html").removeClass("no-scroll");
			} 
		});	
	}
	//법인일 경우 종료
	
	checkingLicenseIssued();	
}	


/* 총대여기간 계산 */
function calcTotalTime()
{
	var dt1 = $("#rentDateTime1").val();
	var dt2 = $("#rentDateTime2").val();
	
	$totmsg = $("p.select-period-msg");
	
	if (dt1 == "" || dt2 == "")
	{
		$totmsg.hide();
		return;
	}
	
     var sDateTime = calendar.toDate(dt1);
     sDateTime.setHours(dt1.substr(8,2));
     sDateTime.setMinutes(dt1.substr(10,2));
     
     var lDateTime = calendar.toDate(dt2);
     lDateTime.setHours(dt2.substr(8,2));
     lDateTime.setMinutes(dt2.substr(10,2));
     
     var oneDaytime = 86400000;
     var diffTime = lDateTime - sDateTime;
     var diffDate = Math.floor(diffTime / oneDaytime);
     var diffHour = Math.floor((diffTime - diffDate * oneDaytime) / 3600000);
     var diffMin = Math.floor((diffTime - diffDate * oneDaytime - diffHour * 3600000) / 60000);
     
     //대여 기간 출력
     $totmsg.find('span.time').text(diffDate + "일 " + diffHour + "시간 " + diffMin + "분");
     $totmsg.show();
     
     return diffDate; // 24시간이 안되면 0이 리턴됨
}


function isApp()
{
	//return navigator.userAgent.indexOf("SKRENT-app-Agent") > 0;
	var appType = navigator.userAgent;
	
	if (/iPhone|iPad|iPod/i.test(appType)) {
		return true;
	} else {
		return navigator.userAgent.indexOf("SKRENT-app-Agent") > 0;
	}

}


function showCarList()
{
	if ($("#modal-car div.rent-car-list li").length == 0)
	{
		getCar();
	}	
}


var timer;
function accordionOpener(e) {
	e.preventDefault();
	var chkSelected = $(this).parent(".accordion-list__list").hasClass("is-selected");
	var clickedLi = $(this).parent(".accordion-list__list");

	var clickedOffset = clickedLi.offset().top;
	if(chkSelected) {
		clickedLi.removeClass("is-selected");
		clickedLi.children(".accordion-list__view").slideUp("100");
	} else {
		clickedLi.siblings(".accordion-list__list").removeClass("is-selected");
		clickedLi.siblings(".accordion-list__list").children(".accordion-list__view").slideUp("100");
		clearTimeout(timer);
		timer = setTimeout(function (){
			clickedLi.addClass("is-selected");
			clickedLi.children(".accordion-list__view").slideDown("100");
		}, 300);
		$('body,html').stop().animate({scrollTop: clickedOffset});
	}
}

function accd_open(selector)
{
	$accd = $(selector);
	$accd.addClass("is-selected");
	$accd.find("div.accordion-list__view").show();
}

function accd_close(selector)
{
	$accd = $(selector);
	$accd.removeClass("is-selected");
	$accd.find("div.accordion-list__view").hide();	
}

function open_rent_only()
{
	accd_open("#accord-rent"); // 렌터카 예약 열고
	accd_close("#accord_user"); // 계약자 정보 닫고
	accd_close("#accord-term"); // 약관 동의 닫고
}

function open_user_only()
{
	accd_open("#accord_user"); // 계약자 정보 열고
	accd_close("#accord-rent"); // 렌터카 예약 닫고 
	accd_close("#accord-term"); // 약관 동의 닫고
}

function open_term_only()
{
	accd_open("#accord-term"); // 약관 동의  열고
	accd_close("#accord_user"); // 계약자 정보 닫고
	accd_close("#accord-rent"); // 렌터카 예약 닫고
}


function disabled(obj, bool)
{
	//obj는 selector string이나 
	var $o = $(obj);
	if (bool != null && boo == false)
	{
		$o.removeAttr('disabled');
		$o.addClass('disabled');
	}
}

$(function(){
	
	$(".accordion-list .accordion-list__list .accordion-list__title").bind("click", accordionOpener);
	$(".accordion-list .accordion-list__list:first-child").addClass("is-selected");
	$(".accordion-list .accordion-list__list.is-selected .accordion-list__view").slideDown("100");
	
	//# href='#'인 경우 void(0)로 자동 변경
	$("a[href='#']").attr('href','javascript:void(0);');	
	
	$('.license_bt').click(function(){
		$('.modal-pop.license').css('display', 'block');
	})
	
	// x-로 시작하는 class는 css와 상관없고 event-handling만을 위해 사용하는 class명이다.
	
	// 앱의 webview에서 호출될때만 show. 웹브라우져에서는 hide
	$("div.x-app-only").hide();
	
	if (isApp())
	{
		$(".x-app-only").show();
	}
	
	$('.license_bt').click(function(){
		$('.modal-pop.license').css('display', 'block');
	})
})

function cameraInfo(str)
{
	//name/jumin/addr1/addr2/lictype/licnum/expdate
	var obj = JSON.parse(str);
	
	$("[name=userNm]").val(obj.name);
	$("#birthday").val(obj.jumin);
	$("#homeAddr").val(obj.addr1);
	$("#homeDtlAddr").val(obj.addr2);
	$("#licenseNo").val(obj.licnum);
	$("#licenseAvil").val(obj.expdate);
 
	$("#licenseType option").filter(function() {return this.text ==$.trim(obj.lictype);}).prop('selected', true);
	
	hasCamera = true;
	
	$("#cameraBtn").show();
	changeLcnCheckData();
}

function lcnResultMsg(obj){
	/*
	 00 : 정상
	 01 : 면허번호 없음
	 02 : 재발급된 면허
	 03 : 분실된 면허
	 04 : 사망 취소된 면허
	 11 : 취소 된 면허
	 12 : 정지 된 면허
	 13 : 기간 중 취소 면허
	 14 : 기간 중 정지 면허
	 21 : 정보불일치(이름)
	 22 : 정보불일치(생년월일)
	 23 : 정보불일치(암호일련번호)
	 24 : 정보불일치(종별)
	 31 : 암호화 안 된 면허 
	 */
	switch(obj.LCNS_RTN_CD){
	case "01" :
		$("#alert-lcnsNo").addClass("alert-msg");
		$("#msg-lcnsNo").html(obj.RTN_ALERT_MSG);
		var offset = $("[name=licenseNo]").offset();
		$("html, body").animate({scrollTop: offset.top-150}, 10);
		alert(obj.RTN_ALERT_MSG);
		break;
	case "21" :
		$("#alert-name").addClass("alert-msg");
		$("#msg-name").html(obj.RTN_ALERT_MSG);
		var offset = $("[name=userNm]").offset();
		$("html, body").animate({scrollTop: offset.top-150}, 10);
		alert(obj.RTN_ALERT_MSG);
		break;
	case "22" :
		$("#alert-birth").addClass("alert-msg");
		$("#msg-birth").html(obj.RTN_ALERT_MSG);
		var offset = $("[name=birthday]").offset();
		$("html, body").animate({scrollTop: offset.top-150}, 10);
		alert(obj.RTN_ALERT_MSG);
		break;
	case "24" :
		$("#alert-lcnsType").addClass("alert-msg");
		$("#msg-lcnsType").html(obj.RTN_ALERT_MSG);
		var offset = $("[name=licenseType]").offset();
		$("html, body").animate({scrollTop: offset.top-150}, 10);
		alert(obj.RTN_ALERT_MSG);
		break;
	default :
		alert(obj.RTN_ALERT_MSG);
		break;
	}
}


function setInfoTab(mode){
	//탭으로 이동한다면 무조건 그냥 초기화 시키자.
	lcnInputMode = mode;
	initLcnData();
	if(mode == "u"){
		$("#cameraBtn").hide();
		$("#homepost").show();
		//대여일, 지점, 차가 선택되어있다면 입력창 활성화 시켜줘야 하기 때문에
		if($("#rentDateTime1").val() != "" && $("#rentDateTime2").val() != "" 
			&&($("[name=cdId]").val() != "" && $("[name=cdId]").val() != null)
			&&($("[name=cdId2]").val() != "" && $("[name=cdId2]").val() != null)
			&&($("[name=branchId]").val() != "" && $("[name=branchId]").val() != null)
			&&($("[name=branchId2]").val() != "" && $("[name=branchId2]").val() != null)
			&&(_carDtl != "" && _carDtl != null)){
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
		}else{
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
		}
	}else if(mode == "c"){
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
		
		$("[name=homeDtlAddr]").removeClass("readonly");
		$("[name=homeDtlAddr]").addClass("readonly");
		$("[name=homeDtlAddr]").prop("disabled", true);
		$("[name=homeDtlAddr]").prop("readonly", true);
		//wjsghkqjsgh
		
		$("#homepost").hide();
		if(hasCamera){
			$("#cameraBtn").show();
		}
		
		//cameraInfo();
	}
}

function initLcnData(){
	hasLcnOk = false;
	hasNext = false;
	$("[name=userNm]").val("");
	$("#birthday").val("");
	$("#homeZip").val("");
	$("#homeAddr").val("");
	$("#homeDtlAddr").val("");
	$("#licenseNo").val("");
	$("#licenseAvil").val("");
	$("#licenseType option:eq(0)").prop('selected', true);
}

function disableLcnData(){
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
	
	$("[name=homeDtlAddr]").removeClass("readonly");
	$("[name=homeDtlAddr]").addClass("readonly");
	$("[name=homeDtlAddr]").prop("disabled", true);
	$("[name=homeDtlAddr]").prop("readonly", true);
	
	$("[name=homeAddr]").removeClass("readonly");
	$("[name=homeAddr]").addClass("readonly");
	$("[name=homeAddr]").prop("disabled", true);
	$("[name=homeAddr]").prop("readonly", true);
}