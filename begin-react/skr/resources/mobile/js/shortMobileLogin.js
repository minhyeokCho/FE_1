var userClsCheck;
var exeLocation = "top";

//단기 페이지 로그인
function goLogin(area){
    var data = JSON.stringify($('#frm').serializeObject());
    $("#login_msg").text("");
    
	if($("#userId").val() == ''){
		$("#userId").focus();
		//alert("아이디 또는 비밀번호를 다시 확인하세요.");
		
		$("#login_msg").text("아이디 또는 비밀번호를 다시 확인하세요.");
		$("#login-div").attr("class","frm-row alert-msg");
		return;
	}else{
		$("#login-div").attr("class","frm-row");
	}
	
	if($("#passwd").val() == ''){
		$("#passwd").focus();
		//alert("아이디 또는 비밀번호를 다시 확인하세요.");
		$("#login_msg").text("아이디 또는 비밀번호를 다시 확인하세요.");
		$("#passwd-div").attr("class","frm-row alert-msg");
		return;
	}else{
		$("#passwd-div").attr("class","frm-row");
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
			   + "&dptDtm=" + sDate + $("#params_sHour").val() + $("#params_sMinute").val()
			   + "&arvDtm=" + lDate + $("#params_lHour").val() + $("#params_lMinute").val();
	
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
				showloading();
				if($("#rsvMode").val() == "jeju") location.href = "/mobile/rentcar/reservation_new_jeju.do"+params;
				else location.href = "/mobile/rentcar/reservation_new.do"+params;	
			} else if(response.result == 'A1000011'){
				//alert("아이디 또는 비밀번호를 다시 확인하세요.");
				$("#login_msg").text("아이디 또는 비밀번호를 다시 확인하세요.");
				$("#login-div").attr("class","frm-row alert-msg");
				$("#passwd-div").attr("class","frm-row alert-msg");
				
				$("#userId").val("");
				$("#passwd").val("");
			} else if(response.result == 'A1000016'){
				showloading();
				if($("#rsvMode").val() == "jeju") location.replace("/mobile/rentcar/reservation_new_jeju.do"+params +"&pwdC=Y");
				else location.replace("/mobile/rentcar/reservation_new.do"+params +"&pwdC=Y");
			} else if(response.result == 'B0000001'){ //휴면계정일 경우
				location.href = "/mobile/sign/inactive_account.do?frmCode=skr&frmId=" + response.frmId;
			} else {
				//alert(response.resultMessage);
				$("#login_msg").text(response.resultMessage);
				$("#login-div").attr("class","frm-row alert-msg");
				$("#passwd-div").attr("class","frm-row alert-msg");
				
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

// 비밀번호 다음에 변경
function delay(){
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
/* 				if(("${returnUrl}").indexOf("rent/") > -1){
				location.href = "${returnUrl}";
			}else{
				location.href = encodeURI(Base64.decode("${returnUrl}"));
			} */
			
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
			
			if(area == "000012") location.href = "/mobile/rentcar/reservation_new_jeju.do"+params;
			else location.href = "/rent/rentcar/reservation_new.do"+params;
			
			//location.replace('/mobile/rentcar/reservation_new_jeju.do');
		},
		error : function(xhr, status, error) {
			console.log(error);
			console.log(arguments);
			
		}
	});		
}

// 비밀번호 변경
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

	if(!checkPasswordLayerShow("newPwd","confirm_newPwd","chgPwd_userId","")){
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
	
		if($("#smsChangeCheckYN").val() != 'Y'){
		alert("휴대폰 인증을 수행해 주세요.");
		return;			
	}
	
	var data = JSON.stringify($('#chFrm').serializeObject());
	
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
			
			if(response.result == "0000") {
				alert("비밀번호가 변경 되었습니다.");
				if($("#rsvMode").val() == "jeju") location.replace("/mobile/rentcar/reservation_new_jeju.do"+params);
				else location.replace("/mobile/rentcar/reservation_new.do"+params);
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
	hideloading();
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
				$("#sms-span").attr("style","display:block;");
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

//sms 인증번호 인증 
function doSmsAuthNoCheck(){
    var data = JSON.stringify($('#chFrm').serializeObject());
    
    if($("#smsAuthNo").val() ==''){
    	alert("인증번호를 입력해주세요.");
    	return;
    }
    
	$.ajax({
		url : '/mobile/myrnt/prsn/doSmsAuthNoCheck.json',
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
				alert("인증이 완료되었습니다.");
				$("#smsChangeCheckYN").val("Y");
				$("#smsAuthNo").val("");
				//$("#sms-span").attr("style","display:none;");
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
function loginPopupWithApple(place) {
	console.log("place : "+place);
	if(location == "bottom"){
		exeLocation = place;
	}
	
	var str = "/mobile/login/pop_apple_login.do";
	
	if( /Android/i.test(navigator.userAgent)) { // 앱 실행여부 판단
		if (navigator.userAgent.indexOf("SKRENT-app-Agent")>0){
			// 소셜 AOS 로그인 처리
			location.href = "skrent://signinApple";
		}else{
			window.open(str,"pop_apple_login",'location=no,width=400,height=480,resizable=no,scrollbars=yes');
		}
	} else if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) { // iOS
		if (navigator.userAgent.indexOf("SKRENT-app-Agent")>0){
			// 소셜 IOS 로그인 처리
			location.href = "skrent://signinApple";
		}else{
			window.open(str,"pop_apple_login",'location=no,width=400,height=480,resizable=no,scrollbars=yes');
		}
	}else{
		window.open(str,"pop_apple_login",'location=no,width=400,height=480,resizable=no,scrollbars=yes');
	}
}

/* 애플 로그인 결과 처리 */
function goAppleResult(sub, socialChnl, frmCode, frmType, frmWork){
	var appleId = sub;

	console.log(".....goAppleResult :  : ", appleId);
	console.log(".....goAppleResult :  : ", socialChnl);
	console.log(".....goAppleResult :  : ", frmCode);
	console.log(".....goAppleResult :  : ", frmType);
	console.log(".....goAppleResult :  : ", frmWork);
	
	// 모바일 로그인 처리
	if( /Android/i.test(navigator.userAgent)) { // 앱 실행여부 판단
		if (navigator.userAgent.indexOf("SKRENT-app-Agent")>0){
			// 소셜 AOS 로그인 처리
			location.href = "skrent://signinApple";
		}else{
			// 소셜 로그인 처리
			resSiginData( "mobile",  "apple", appleId, null, null, null, null );
		}
	} else if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) { // iOS
		// 소셜 IOS 로그인 처리
		if (navigator.userAgent.indexOf("SKRENT-app-Agent")>0){
			location.href = "skrent://signinApple";
		}else{
			resSiginData( "mobile",  "apple", appleId, null, null, null, null );
		}
	}else{
		resSiginData( "mobile",  "apple", appleId, null, null, null, null );
	}
}

/* 카카오 로그인 팝업 */
function loginFormWithKakao(place) {
	console.log("place : "+place);
	if(location == "bottom"){
		exeLocation = place;
	}
	
	if( /Android/i.test(navigator.userAgent)) { // 앱 실행여부 판단
		if (navigator.userAgent.indexOf("SKRENT-app-Agent")>0){
			// 소셜 AOS 로그인 처리
			location.href = "skrent://signinKaKao";
		}else{
			loginFormKakao();
		}
	}else if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) { // iOS
		if (navigator.userAgent.indexOf("SKRENT-app-Agent")>0){
			// 소셜 IOS 로그인 처리
			location.href = "skrent://signinKaKao";
		}else{
			loginFormKakao();
		}
	}else{
		loginFormKakao();
	}
}

function loginFormKakao(){
	// 모바일 로그인 처리
	Kakao.Auth.loginForm({
		success: function(authObj) {
			console.log(".....loginAuthSuccess : ", authObj);
			showResult(JSON.stringify(authObj));          
		},
		fail: function(err) {
			console.log(".....loginAuthFail : ", err);
			showResult(JSON.stringify(err));
		},
	})
}

/* 카카오 로그인 처리 */
function showResult(result) {
	console.log(".....loginResult : ", result);
	Kakao.API.request({
		url: '/v2/user/me',
		success: function(res) {
			console.log(".....loginResultSuccess : ", result);
			//alert(JSON.stringify(res));
			if(exeLocation == "top"){
				console.log("kakao signin");
				goSnsLogin( JSON.stringify(res), "kakao", "skr", "mobile", "signIn", result );
			}else{
				console.log("kakao signUp");
				goSnsLogin( JSON.stringify(res), "kakao", "skr", "mobile", "signUp", result );
			}
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
	console.log(".....SnsLoginParam :  : ", paramData);
	console.log(".....SnsLoginParam :  : ", paramAuthData);
	console.log(".....SnsLoginParam :  : ", paramData.kakao_account);
	console.log(".....SnsLoginParam :  : ", paramData.id);
	console.log(".....SnsLoginParam :  : ", paramData.kakao_account.ci);
	
	// 모바일 로그인 처리
	if( /Android/i.test(navigator.userAgent)) { // 앱 실행여부 판단
		if (navigator.userAgent.indexOf("SKRENT-app-Agent")>0){
			// 소셜 AOS 로그인 처리
			location.href = "skrent://signinKaKao";
		}else{
			// 소셜 로그인 처리
			resSiginData( "mobile", "kakao", paramData.id, paramData.kakao_account.email, paramData.kakao_account.ci, paramAuthData.access_token, paramAuthData.refresh_token );
		}
	} else if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) { // iOS
		if (navigator.userAgent.indexOf("SKRENT-app-Agent")>0){
			// 소셜 IOS 로그인 처리
			location.href = "skrent://signinApple";
		}else{
			resSiginData( "mobile", "kakao", paramData.id, paramData.kakao_account.email, paramData.kakao_account.ci, paramAuthData.access_token, paramAuthData.refresh_token );
		}
	}else{
		resSiginData( "mobile", "kakao", paramData.id, paramData.kakao_account.email, paramData.kakao_account.ci, paramAuthData.access_token, paramAuthData.refresh_token );
	}
	
}

/* 소셜 로그인 처리 */ 
function resSiginData(userType, socialChnl, userId, email, ci, accessToken, refreshToken){
	console.log(".....resSiginData start");
	
	if(userType == "AOS" || userType == "IOS"){
		userType = "app";
	}
	var frmType = userType;
	
	var frmWork = "signIn";
	
	if(exeLocation != "top"){
		frmWork = "signUp";
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
			   + "&dptDtm=" + sDate + $("#params_sHour").val() + $("#params_sMinute").val()
			   + "&arvDtm=" + lDate + $("#params_lHour").val() + $("#params_lMinute").val();
	
	$.ajax({
		url : '/rent/sign/sign_check.json',
		type : 'POST',
		dataType : 'json',
		data : JSON.stringify({'frmType' : userType
				, 'socialChnl': socialChnl.toLowerCase() 
				, 'frmCode' : 'skr'	// skr, biy ,ods
				, 'socialId': userId
				, 'email': email
				, 'ci': ci
				, 'accessToken' : accessToken
				, 'frmWork' : frmWork }),
		contentType : 'application/json',
		mimeType: 'application/json',
		processData : false,
		cache : false,
		success : function(response, status, xhr) {
			console.log(".....SnsLoginSuccess : ", response);
			if(response.result == "0000" || response.result == "0001") {
				showloading();
				
				if(response.loginYn == "Y"){
					if($("#rsvMode").val() == "jeju") location.href = "/mobile/rentcar/reservation_new_jeju.do"+params;
					else location.href = "/mobile/rentcar/reservation_new.do"+params;	
				}else{
					location.href = response.url;
				}
			}else if(response.result == "A1000017"){
				alert(response.resultMessage);
			}else{
				alert(response.resultMessage);
				$("#login_msg").text(response.resultMessage);
				$("#login-span").attr("class","frm-row alert-msg");
			}
		},
		error : function(xhr, status, error) {
			console.log(error);
			console.log(arguments);
			//hideloading();
		}
	});
}


