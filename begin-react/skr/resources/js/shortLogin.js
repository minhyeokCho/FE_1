var userClsCheck;

// 단기 페이지 로그인
function shortGoLogin(area){
    var data = JSON.stringify($('#frm').serializeObject());
    $("#login_msg").text("");
    
	if($("#userId").val() == ''){
		$("#userId").focus();
		alert("아이디 또는 비밀번호를 다시 확인하세요.");
		return;
	}
	
	if($("#passwd").val() == ''){
		$("#passwd").focus();
		alert("아이디 또는 비밀번호를 다시 확인하세요.");
		return;
	}
	
	if($('input:checkbox[id="id-presonal-remember"]').is(":checked")){
		$("#id-presonal-remember").val("Y");			
	}else{
		$("#id-presonal-remember").val("N");
	}
	
	var sDate = "";
	var lDate = "";
	if($("#params_sDate").val()!= null && $("#params_sDate").val()!="") sDate = dateFormat($("#params_sDate").val(),'',0);
	if($("#params_lDate").val()!= null && $("#params_lDate").val()!="") lDate = dateFormat($("#params_lDate").val(),'',0);
	
	var params = "?sDate=" + $("#params_sDate").val()
			   + "&sHour=" + $("#params_sHour").val()
			   + "&sMinute=" + $("#params_sMinute").val()
			   + "&lDate=" + $("#params_lDate").val()
			   + "&lHour=" + $("#params_lHour").val()
			   + "&lMinute=" + $("#params_lMinute").val()
			   + "&cdId=" + $("#params_cdId").val()
			   + "&cdId2=" + $("#params_cdId2").val()
			   + "&branchId=" + $("#params_branchId").val()
			   + "&branchId2=" + $("#params_branchId2").val()
			   + "&carTab=" + $("#params_carTab").val()
			   + "&dptDtm=" + sDate + $("#params_sHour").val() + $("#params_sMinute").val()
			   + "&arvDtm=" + lDate + $("#params_lHour").val() + $("#params_lMinute").val();
	
	var comp_reserv_url_jeju = encodeURI(Base64.encode("/rent/rentcar/short_rent_reservation_new_jeju_company.do"+params));
	console.log(comp_reserv_url_jeju);
	
	var comp_reserv_url = encodeURI(Base64.encode("/rent/rentcar/short_rent_reservation_new_company.do"+params));
	console.log(comp_reserv_url);
	
	$.ajax({
		url : '/rent/login/doLogin.json',
		type : 'POST',
		dataType : 'json',
		contentType : 'application/json',
		mimeType: 'application/json',
		processData : false,
		data : data,
		cache : false,
		success : function(response, status, xhr) {
			// Validation Message 초기화
			if(response.result == "0000") {

				if(response.userInfo.userCls == 1){
					showloading();
					if(area == "jeju") location.href = encodeURI(Base64.decode(comp_reserv_url_jeju));	//법인예약 페이지로 이동
					else location.href = encodeURI(Base64.decode(comp_reserv_url));	//법인예약 페이지로 이동
				}else{
					showloading();
					if(area == "jeju") location.href = "/rent/rentcar/short_rent_reservation_new_jeju.do"+params;
					else location.href = "/rent/rentcar/short_rent_reservation_new.do"+params;
				}
			} else if(response.result == "A1000017"){
				var custId ="";
				console.log(response.custId);
				if(response.custId != null && response.custId != "") custId = response.custId;
				
				showloading();
				if(area == "jeju") location.href = "/rent/rentcar/short_rent_reservation_new_jeju_company.do"+params+"&popupYn=Y";	//법인예약 페이지로 이동
				else location.href = "/rent/rentcar/short_rent_reservation_new_company.do"+params+"&popupYn=Y";	//법인예약 페이지로 이동
				//location.href = "/rent/corp/change_pwd.do"; //초기 비밀번호 변경 페이지 필요.
			} else if(response.result == 'A1000011'){
				alert("아이디 또는 비밀번호를 다시 확인하세요.");
				$("#userId").val("");
				$("#passwd").val("");					
			} else if(response.result == 'A1000016'){
				//alert("000");
				userClsCheck = response.userInfo.userCls;
				$("#modal-password-regular").show();
				$("#modal-login-global").hide();
				$("#hpNo").val(response.userHpNo);
			} else if(response.result == 'B0000001'){ //휴면계정일 경우
				location.href = "/rent/sign/inactive_account.do?frmCode=skr&frmId=" + response.frmId;
			}else {
				alert(response.resultMessage);
				$("#userId").val("");
				$("#passwd").val("");
			}
		},
		error : function(xhr, status, error) {
			console.log(error);
			console.log(arguments);
		}
	});
}

// 비밀번호 변경 안내 팝업 닫기시 이벤트
function shortPopupClose(){
	var sDate = "";
	var lDate = "";
	if($("#params_sDate").val()!= null && $("#params_sDate").val()!="") sDate = dateFormat($("#params_sDate").val(),'',0);
	if($("#params_lDate").val()!= null && $("#params_lDate").val()!="") lDate = dateFormat($("#params_lDate").val(),'',0);
	
	var params = "?sDate=" + $("#params_sDate").val()
	   + "&sHour=" + $("#params_sHour").val()
	   + "&sMinute=" + $("#params_sMinute").val()
	   + "&lDate=" + $("#params_lDate").val()
	   + "&lHour=" + $("#params_lHour").val()
	   + "&lMinute=" + $("#params_lMinute").val()
	   + "&cdId=" + $("#params_cdId").val()
	   + "&cdId2=" + $("#params_cdId2").val()
	   + "&branchId=" + $("#params_branchId").val()
	   + "&branchId2=" + $("#params_branchId2").val()
	   + "&carTab=" + $("#params_carTab").val()
	   + "&dptDtm=" + sDate + $("#params_sHour").val() + $("#params_sMinute").val()
	   + "&arvDtm=" + lDate + $("#params_lHour").val() + $("#params_lMinute").val();

	var comp_reserv_url_jeju = encodeURI(Base64.encode("/rent/rentcar/short_rent_reservation_new_jeju_company.do"+params));
	var comp_reserv_url = encodeURI(Base64.encode("/rent/rentcar/short_rent_reservation_new_company.do"+params));
	var area = $("[name=branchId]").val() == "000012" ? "jeju" : "inland";

	if(userClsCheck == 1){
		showloading();
		if(area == "jeju") location.href = encodeURI(Base64.decode(comp_reserv_url_jeju));	//법인예약 페이지로 이동
		else location.href = encodeURI(Base64.decode(comp_reserv_url));	//법인예약 페이지로 이동
	}else{
		showloading();
		if(area == "jeju") location.href = "/rent/rentcar/short_rent_reservation_new_jeju.do"+params;
		else location.href = "/rent/rentcar/short_rent_reservation_new.do"+params;
	}
}

// 비밀번호 다음에 변경하기시 
function shortDelay(){
	///rent/login/pwdChgDelay.json
	var data = JSON.stringify($('#chFrm').serializeObject());
	
	$.ajax({
		url : '/rent/login/pwdChgDelay.json',
		type : 'POST',
		dataType : 'json',
		contentType : 'application/json',
		mimeType: 'application/json',
		processData : false,
		data : data,
		cache : false,
		success : function(response, status, xhr) {
			// Validation Message 초기화
			var sDate = "";
			var lDate = "";
			if($("#params_sDate").val()!= null && $("#params_sDate").val()!="") sDate = dateFormat($("#params_sDate").val(),'',0);
			if($("#params_lDate").val()!= null && $("#params_lDate").val()!="") lDate = dateFormat($("#params_lDate").val(),'',0);
			
			var params = "?sDate=" + $("#params_sDate").val()
			   + "&sHour=" + $("#params_sHour").val()
			   + "&sMinute=" + $("#params_sMinute").val()
			   + "&lDate=" + $("#params_lDate").val()
			   + "&lHour=" + $("#params_lHour").val()
			   + "&lMinute=" + $("#params_lMinute").val()
			   + "&cdId=" + $("#params_cdId").val()
			   + "&cdId2=" + $("#params_cdId2").val()
			   + "&branchId=" + $("#params_branchId").val()
			   + "&branchId2=" + $("#params_branchId2").val()
			   + "&carTab=" + $("#params_carTab").val()
			   + "&dptDtm=" + sDate + $("#params_sHour").val() + $("#params_sMinute").val()
			   + "&arvDtm=" + lDate + $("#params_lHour").val() + $("#params_lMinute").val();

			var comp_reserv_url_jeju = encodeURI(Base64.encode("/rent/rentcar/short_rent_reservation_new_jeju_company.do"+params));
			var comp_reserv_url = encodeURI(Base64.encode("/rent/rentcar/short_rent_reservation_new_company.do"+params));
			var area = $("[name=branchId]").val() == "000012" ? "jeju" : "inland";
			console.log(area);

			if(userClsCheck == 1){
				showloading();
				if(area == "jeju") location.href = encodeURI(Base64.decode(comp_reserv_url_jeju));	//법인예약 페이지로 이동
				else location.href = encodeURI(Base64.decode(comp_reserv_url));	//법인예약 페이지로 이동
			}else{
				showloading();
				if(area == "jeju") location.href = "/rent/rentcar/short_rent_reservation_new_jeju.do"+params;
				else location.href = "/rent/rentcar/short_rent_reservation_new.do"+params;
			}
		},
		error : function(xhr, status, error) {
			console.log(error);
			console.log(arguments);
			
		}
	});		
}

// 비밀번호 변경시
function chgPwd(){
	if($("#oldPwd").val() == ''){
		alert("현재 비밀번호를 입력하세요.");
		$("#oldPwd").focus();
		return;
	}
	
	if($("#newPwd").val() == ''){
		alert("신규 비밀번호를 입력하세요.");
		$("#newPwd").focus();
		return;
	}
	
	if(!checkPasswordLayerShow("newPwd","confirm_newPwd","userId","")){
		return;
	}
	
	if($("#confirm_newPwd").val() == ''){
		alert("비밀번호가 일치하지 않습니다.");
		$("#confirm_newPwd").focus();
		return;
	}
	
	if($("#newPwd").val() != $("#confirm_newPwd").val() || $("#confirm_newPwd").val() == ''){
		alert("비밀번호가 일치하지 않습니다.");
		$("#confirm_newPwd").focus();
		return;
	}					
	
		if($("#smsAuthNo").val() == ''){
		alert("휴대폰 인증 인증번호를 입력해주세요.");
		return;			
	}
	
	var data = JSON.stringify($('#chFrm').serializeObject());
	
	$.ajax({
		url : '/rent/myrnt/prsn/doSmsAuthNoCheck.json',
		type : 'POST',
		dataType : 'json',
		contentType : 'application/json',
		mimeType: 'application/json',
		processData : false,
		data : data,
		cache : false,
		success : function(response, status, xhr) {
			// Validation Message 초기화
			
			if(response.result != "0000") {
				alert(response.resultMessage);
			} else {
				$("#smsChangeCheckYN").val("Y");
				
				//비밀번호 변경
				$.ajax({
					url : '/rent/myrnt/prsn/doChangepw.json',
					type : 'POST',
					dataType : 'json',
					contentType : 'application/json',
					mimeType: 'application/json',
					processData : false,
					data : data,
					cache : false,
					success : function(response, status, xhr) {
						// Validation Message 초기화
						if(response.result == "0000") {
							alert("비밀번호가 변경 되었습니다. 다시 로그인 후 사용하세요.");
							location.href = "/rent/login/logout.do";
						}else{
							if(response.result == 'M1000004'){
								alert('현재 비밀번호가 맞지 않습니다.');
								$("#oldPwd").focus();
							}else{
								alert(response.resultMessage);	
							}
							return;
						}
					},
					error : function(xhr, status, error) {
						console.log(error);
						console.log(arguments);
						
					}
				});						
			}
			hideloading();
		},
		error : function(xhr, status, error) {
			console.log(error);
			console.log(arguments);
			hideloading();
		}
	});			
	
}

//sms 인증번호 전송
function sendSmsAuthNo(){
	
    var data = JSON.stringify($('#chFrm').serializeObject());
    
	if($("#hpNo").val() == ''){
		alert("휴대폰 번호는 필수 항목입니다. 개인정보수정 메뉴에서 등록해주세요.");
		return;
	}
    
	$.ajax({
		url : '/rent/myrnt/prsn/sendSmsForAuth.json',
		type : 'POST',
		dataType : 'json',
		contentType : 'application/json',
		mimeType: 'application/json',
		processData : false,
		data : data,
		cache : false,
		success : function(response, status, xhr) {
			// Validation Message 초기화
			
			if(response.result != "0000") {
				alert(response.resultMessage);
			} else {
				alert("인증번호가 발송되었습니다.");
				$("#seqNo").val(response.authSeqNo);
				$("#btnSendSms1").attr("style","display:none;");
				$("#btnSendSms2").attr("style","display:block;");
				$("#smsChangeCheckYN").val("N");
			}
			hideloading();
		},
		error : function(xhr, status, error) {
			console.log(error);
			console.log(arguments);
			hideloading();
		}
	});				
}

/* 애플 로그인 팝업 */
function loginPopupWithApple() {
	var str = "/rent/login/pop_apple_login.do";
	window.open(str,"pop_apple_login",'location=no,width=400,height=480,resizable=no,scrollbars=yes');
}

/* 애플 로그인 결과 처리 */
function goAppleResult(sub, socialChnl, frmCode, frmType, frmWork){
	var appleId = sub;

	console.log(".....goAppleResult :  : ", appleId);
	console.log(".....goAppleResult :  : ", socialChnl);
	console.log(".....goAppleResult :  : ", frmCode);
	console.log(".....goAppleResult :  : ", frmType);
	console.log(".....goAppleResult :  : ", frmWork);
	
	// 메인 파라미터 설정
	var sDate = "";
	var lDate = "";
	if($("#params_sDate").val()!= null && $("#params_sDate").val()!="") sDate = dateFormat($("#params_sDate").val(),'',0);
	if($("#params_lDate").val()!= null && $("#params_lDate").val()!="") lDate = dateFormat($("#params_lDate").val(),'',0);
	
	var area = $("#branchId").val();
	var params = "?sDate=" + $("#params_sDate").val()
			   + "&sHour=" + $("#params_sHour").val()
			   + "&sMinute=" + $("#params_sMinute").val()
			   + "&lDate=" + $("#params_lDate").val()
			   + "&lHour=" + $("#params_lHour").val()
			   + "&lMinute=" + $("#params_lMinute").val()
			   + "&cdId=" + $("#params_cdId").val()
			   + "&cdId2=" + $("#params_cdId2").val()
			   + "&branchId=" + $("#params_branchId").val()
			   + "&branchId2=" + $("#params_branchId2").val()
			   + "&carTab=" + $("#params_carTab").val()
			   + "&dptDtm=" + sDate + $("#params_sHour").val() + $("#params_sMinute").val()
			   + "&arvDtm=" + lDate + $("#params_lHour").val() + $("#params_lMinute").val();
	
	$.ajax({
		url : '/rent/sign/sign_check.json',
		type : 'POST',
		dataType : 'json',
		data : JSON.stringify({'socialId': appleId
				, 'ci': ""
				, 'accessToken' : ""
				, 'socialChnl': socialChnl
				, 'frmCode' : frmCode
				, 'frmType' : frmType
				, 'frmWork' : frmWork }),
		contentType : 'application/json',
		mimeType: 'application/json',
		processData : false,
		cache : false,
		success : function(response, status, xhr) {
			//console.log(".....SnsLoginResult : ", response);
			if(response.result == "0000" || response.result == "0001") {
				if(response.loginYn == "Y"){
					//console.log(".....SnsLoginSuccess : ", response);
					showloading();
					if(response.loginYn == "Y"){
						if(area == "000012") location.href = "/rent/rentcar/short_rent_reservation_new_jeju.do"+params;
						else location.href = "/rent/rentcar/short_rent_reservation_new.do"+params;
					}else{
						location.href = response.url;
					}
					hideloading();
				}else{
					location.href = response.url;
				}
				
			}else if(response.result == "E0000"){
				alert(response.resultMessage)
			}else{
				alert(response.resultMessage)
				$("#login_msg").text(response.resultMessage);
				$("#login-span").attr("class","checkbox msg-alert");
			}
		},
		error : function(xhr, status, error) {
			console.log(error);
			console.log(arguments);
			//hideloading();
		}
	});
}

/* 카카오 로그인 팝업 */
function loginFormWithKakao() {
	console.log(".....loginStart")
	//팝업방식
	Kakao.Auth.loginForm({
		success: function(authObj) {
			console.log(".....loginAuthSuccess : ", authObj);
			showResult(JSON.stringify(authObj));          
		},
		fail: function(err) {
			console.log(".....loginAuthFail : ", err);
			showResult(JSON.stringify(err));
		},
	});
}

/* 카카오 로그인 처리 */
function showResult(result) {
	console.log(".....loginResult : ", result);
	Kakao.API.request({
		url: '/v2/user/me',
		success: function(res) {
			console.log(".....loginResultSuccess : ", result);
			console.log(".....loginResultSuccess : ", JSON.stringify(res));
			//alert(JSON.stringify(res));
			goSnsLogin( JSON.stringify(res), "kakao", "skr", "pc", "signIn", result ); 
		},
		fail: function(error) {
			//alert('login success, but failed to request user information: ' + JSON.stringify(error))
		},
	})
	document.getElementById('reauthenticate-popup-result').innerText = result
}

/* 카카오 로그인 결과 처리 */
function goSnsLogin(data, socialChnl, frmCode, frmType, frmWork, authData){
	var paramData = JSON.parse(data);
	var paramAuthData = JSON.parse(authData);
	//console.log(".....SnsLoginParam :  : ", paramData);
	//console.log(".....SnsLoginParam :  : ", paramAuthData);
	//console.log(".....SnsLoginParam :  : ", paramData.kakao_account);
	//console.log(".....SnsLoginParam :  : ", paramData.id);
	//console.log(".....SnsLoginParam :  : ", paramData.kakao_account.ci);
	
	// 메인 파라미터 설정
	var sDate = "";
	var lDate = "";
	if($("#params_sDate").val()!= null && $("#params_sDate").val()!="") sDate = dateFormat($("#params_sDate").val(),'',0);
	if($("#params_lDate").val()!= null && $("#params_lDate").val()!="") lDate = dateFormat($("#params_lDate").val(),'',0);
	
	var area = $("#branchId").val();
	var params = "?sDate=" + $("#params_sDate").val()
			   + "&sHour=" + $("#params_sHour").val()
			   + "&sMinute=" + $("#params_sMinute").val()
			   + "&lDate=" + $("#params_lDate").val()
			   + "&lHour=" + $("#params_lHour").val()
			   + "&lMinute=" + $("#params_lMinute").val()
			   + "&cdId=" + $("#params_cdId").val()
			   + "&cdId2=" + $("#params_cdId2").val()
			   + "&branchId=" + $("#params_branchId").val()
			   + "&branchId2=" + $("#params_branchId2").val()
			   + "&carTab=" + $("#params_carTab").val()
			   + "&dptDtm=" + sDate + $("#params_sHour").val() + $("#params_sMinute").val()
			   + "&arvDtm=" + lDate + $("#params_lHour").val() + $("#params_lMinute").val();
	
	$.ajax({
		url : '/rent/sign/sign_check.json',
		type : 'POST',
		dataType : 'json',
		data : JSON.stringify({'socialId': paramData.id
				, 'ci': paramData.kakao_account.ci
				, 'accessToken' : paramAuthData.access_token
				, 'socialChnl': socialChnl
				, 'frmCode' : frmCode
				, 'frmType' : frmType
				, 'frmWork' : frmWork }),
		contentType : 'application/json',
		mimeType: 'application/json',
		processData : false,
		cache : false,
		success : function(response, status, xhr) {
			console.log(".....SnsLoginResult : ", response);
			//memberId
			if(response.result == "0000" || response.result == "0001") {
				showloading();
				if(response.loginYn == "Y"){
					if(area == "000012") location.href = "/rent/rentcar/short_rent_reservation_new_jeju.do"+params;
					else location.href = "/rent/rentcar/short_rent_reservation_new.do"+params;
				}else{
					location.href = response.url;
				}
				hideloading();
			}else if(response.result == "E0000"){
				alert(response.resultMessage)
			}else{
				alert(response.resultMessage)
				$("#login_msg").text(response.resultMessage);
				$("#login-span").attr("class","checkbox msg-alert");
			}
		},
		error : function(xhr, status, error) {
			console.log(error);
			console.log(arguments);
			//hideloading();
		}
	});
}	