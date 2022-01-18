/* SKNetwork Calendar (Mobile Long Calendar) 1.0 - 2018-2-15
 * Programmed by Lee Sangheon
 * Copyright 2018 SKNetworks 
 */

var calendar = 
	{
		_isEvent: false,
		_selectFromDate: null,
		_selectToDate: null,
		_selectFromDateIndex: 0,
		_showMonth: null, //보여줄 달력월
		_selectableDate: null, // 선택가능한 날짜
		_maxRentDate: null, // 대여가능일 최대값 (오늘로부터 90일)
		_maxReturnDate: null, // 반납가능일 최대값 (오늘로부터 151일: 3개월 + 2개월 + 1일)
		_maxMonth: null, // 달력으로 표시할 최대월		
		_disabledDateArr: null, //선택금지 날짜 배열
		_clickCount: 0,
		_eHour: 0, // 렌탈가능한 시간 (제주: 21시, 내륙: 19시)
		_today:null,
		_nextDate:null,
		_isNextDate: false, //내일날짜 선택여부
		_initOption:false,
		_disableDate:null,
		_inlandStartHour:9,
		_inlandEndHour:19,
		/**
		 * 달력 만들기
		 */
		make:function () {
			
			var _self = this;
		
			var currentDate = new Date();
			var cDate = currentDate.getDate();
			var cDateStr = this.toYmd(currentDate);
			var makeDate = currentDate;
			var cHour = currentDate.getHours();	  
			var cMin = currentDate.getMinutes();
			
			_self._today = cDateStr;
			_self._nextDate = _self.addDates(cDateStr,1); // 내일날짜
			
			var disableDate = null; // 선택불가능한 날짜
			var branchId = $("#branchId").val();
			var requestDay = 91;
			var inlandRequestDayCheck = true;

			// 제주지점은 최초 90일, 내륙은 최초 60일 예약 가능(20190403)
			if($('#rsvMode').val() == "inland"){
				if(cHour >= _self._inlandStartHour && cHour < _self._inlandEndHour){
					requestDay = 30;
					inlandRequestDayCheck = true;
					
					if(cHour == (_self._inlandEndHour-1) && cMin >= 30) {
						requestDay = 31;
						inlandRequestDayCheck = false;	
					}
				} else {
					requestDay = 31;
					inlandRequestDayCheck = false;
				}
				//_self._selectableDate = "2019-06-31";
			}
			
	    	_self._maxRentDate = _self.addDates(cDateStr,requestDay); //대여가능일: 내일부터 90일까지 (오늘은 예약불가.내일부터 90일. 그래서 91일)
	    	
	    	console.log("branchId : ", branchId)
	    	console.log("maxRentDate : ", _self._maxRentDate)
	    	// 내륙은 2019-05-31 까지 가능(20190403)
	    	//if(branchId != "000012" && _self._maxRentDate >= "20190531"  && $('#rsvMode').val() != "jeju" )
	    	//{
	    	//	_self._maxRentDate = "20190531"
	    	//}
	    	
	    	_self._maxReturnDate = _self.addDates(cDateStr,151); // 반납가능일; 내일부터 150일 (151일)
			
//			var cHour = 21;	  
//			var cMin = 01;
			var cHHMM = _self.getDigitNum(cHour) + _self.getDigitNum(cMin); 			
			$optes = $("#selectRentTime1 option");
			
			//ㅇㅖ약 가능시간이 아니면 날짜선택 disable 처리
			console.log("ㅇㅖ약 가능시간이 아니면 날짜선택 disable 처리" + $("#rsvMode").val());
			if(cMin == 0 ){
				cHour = cHour + 3;
				cMin = 0;
			}else if(cMin < 30){
				cHour = cHour + 3;
				cMin = 30;
			}else if(cMin == 30){
				cHour = cHour + 3;
				cMin = 30;
			}else if(cMin > 30){
				cHour = cHour + 4;
				cMin = 0;
			}
			
			cHHMM = _self.getDigitNum(cHour) + _self.getDigitNum(cMin);
//			if ($optes.last().val() < cHHMM)
			if ("2200" < cHHMM) //제주 마감 시간
			{
//				disableDate =_self._nextDate; // 불가능한 날짜에 내일 날짜 추가
				disableDate =_self._today;
				_self._disableDate =_self._today;
			}
			
			$tbody = _self.$tbody;
			$tbody.empty();
			
			var monthIndex = 0;
			var tdDateIndex = 0;

			for (var monthIndex = 0; monthIndex < 6 && tdDateIndex < 151; monthIndex ++)
			{
			    var year = makeDate.getFullYear();
			    var month = makeDate.getMonth();	
			    var lastDate = this.getLastDate(month, year);
			    
			    makeDate.setDate(1);
			    var firstTdIndex = makeDate.getDay();
			    
			    var lastTdIndex = firstTdIndex + lastDate - 1;
			    
			    var strd = "";
			    var date = 1;
			    var strYM = year + this.getDigitNum(month + 1);
			    
			    var wkday;
			    var tdClass;
			    
			    strd =' <div class="ui-datepicker-inline ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all ui-datepicker-multi" >' + 
			    		'<div class="ui-datepicker-group"><div class="ui-datepicker-header ui-widget-header ui-helper-clearfix ui-corner-all">'+
			    		 '<div class="ui-datepicker-title"><span class="ui-datepicker-year">' + year + '년</span>&nbsp;<span class="ui-datepicker-month">' + (month + 1) + '월</span></div></div>'+
			    	     '<table class="ui-datepicker-calendar"><tbody>' +
			    	     '</div>'
  			    
			    var skipWeeks = -1;
			    
			    if (monthIndex == 0) //첫달은 전주까지 skip
			    {
			    	skipWeeks = (Math.ceil((firstTdIndex + cDate) / 7) - 1) * 7;
			    	if (skipWeeks > 0) date = skipWeeks - firstTdIndex + 1; 
			    }
			
			    for (var i= 0; i <= 41; i++)
			    	{
			    		if (skipWeeks > i)
			    			{
			    				continue;
			    			}			    	
			    		wkday = i%7;
			    	
			    		if (wkday == 0)
			    		{
			    			strd += "<tr>";
			    		}    			
			    	
			    		if (i >= firstTdIndex && i <= lastTdIndex)
						{
			    			var strYMD = strYM + this.getDigitNum(date);	

			    			if ($('#rsvMode').val() == "jeju" && (strYMD < cDateStr || strYMD == disableDate)) // 오늘보다 과거이거나, 예약불가능한 날짜이면
			    			{
			    				strd += '<td class="ui-datepicker-unselectable  ui-state-disabled"><span class="ui-state-default">' + date + '</span></td>';    				
			    			} 
			    			else if ($('#rsvMode').val() == "inland" && strYMD <= cDateStr){ //내륙 오늘 및 과거 예약 불가
			    				strd += '<td class="ui-datepicker-unselectable  ui-state-disabled"><span class="ui-state-default">' + date + '</span></td>';
			    			}
			    			else if ($('#rsvMode').val() == "inland" && strYMD == _self.addDates(cDateStr,1) && inlandRequestDayCheck == false){ //내륙 오늘 및 과거 예약 불가
			    				strd += '<td class="ui-datepicker-unselectable  ui-state-disabled"><span class="ui-state-default">' + date + '</span></td>';
			    			}
			    			else
			    			{
			    				tdClass = (strYMD == cDateStr ? /*"ui-datepicker-today"당일예약*/"" : "") +  (wkday == 0 || wkday == 6 ? " ui-datepicker-week-end": "");			    				
				    			
				    			if (tdClass != "") tdClass = " class='" + tdClass + "'";
			    				strd += '<td ymd="' + strYMD +'" ' + tdClass + '><a class="ui-state-default" href="javascript:void(0);">' + date + '</a></td>';
			    			}
			    			
			    			date ++;			    			
			    			tdDateIndex ++;			    			
			    			if (tdDateIndex == 61)
			    			{
			    				_self._showMonth = strYMD.substr(0,6);
			    			}
						}
			    		else
			    		{
			    			strd += "<td></td>";
			    		}
			    		
			    		if (i%7 == 6)
			    		{
			    			strd += "</tr>";
			    			if (i >= lastTdIndex || strYMD >= _self._maxReturnDate )
							{
			    				break;
							}
			    		}     		
			    	}
			    
			    strd += '</tbody></table></div><div class="ui-datepicker-row-break"></div>';			
			    $tbody.append(strd);			    
			    makeDate.setMonth(month + 1);
			}
			
			$tbody.append("<div style='height:40px'><div>");	 // 높이 40짜리 여백 추가 (여백없으면 맨 아랫줄은 클릭 불가)

			_self.showMonth();
			
			// 일부 모바일 기기에서 하단 고정이 안되는 부분을 고정한다.
			$(".modal-bottom").css({"position" : "fixed" , "bottom" : "0px"});
			
			calendarHoliyDay();
		},
		
		addDates: function( fromYMD, days ) {
			var date = this.toDate(fromYMD);
			date.setDate(date.getDate() + days);
			return this.toYmd(date);
		},
		
		// 선택한 예약일에 따라 선택가능한 날짜를 제한한다.
		setRistrict: function() {
			
			var _self = this;
			var fromDate =_self._selectFromDate;
			var $tds = $("table.ui-datepicker-calendar td[ymd]");	
			console.log("A : ", fromDate);
			console.log("B : ", _self._maxRentDate);
			console.log("C : ", _self._selectableDate);
			// 대여일을 선택했으면 대여일 + 60일. 대여일을 선택하지 않았으면 maxRentDate(오늘 + 91일)
			//var maxDate = (fromDate == null) ? _self._maxRentDate : _self.addDates(fromDate, 60);
			var maxDate = (fromDate == null) ? _self._maxRentDate : (_self._selectableDate == null) ? _self.addDates(fromDate, 60) : _self._selectableDate;
			console.log("maxDate : ", maxDate);	
			var len = $tds.length;			
			for (var idx = 0; idx < len; idx ++)
				{
					var $td = $($tds[idx]);					
					if ($td.attr('ymd') <= maxDate) // 선택가능한 날짜까지는 disabled 클래스를 삭제
					{
						$td.removeClass('ui-datepicker-unselectable  ui-state-disabled');
					}
					else // 선택가능한 날짜보다 크면 disabled 클래스를 추가
					{
						$td.addClass('ui-datepicker-unselectable  ui-state-disabled');
					}
				}
		},
		
		selectRange: function()
		{
			var _self = this;
			fromDate =_self._selectFromDate;
			toDate = _self._selectToDate;
			
			// 선택영역 초기화
			$("table.ui-datepicker-calendar td.ui-state-highlight").removeClass("ui-state-highlight ui-state-highlight-start ui-state-highlight-end");
			
			if (!fromDate) return; // 예약일이 없으면 처리할 것 없으므로 종료
	
			// 예약일에 class 추가
			$("td[ymd='"+ fromDate + "']").addClass('ui-state-highlight-start ui-state-highlight');	
			
			if (!toDate) return; //반납일 없으면 종료

			// 반납일이 있으면 반납일에 class추가 (css에 ui-state-highlight-end 없어서 ui-state-highlight-start를 대신 사용)
			$("td[ymd='"+ toDate + "']").addClass('ui-state-highlight-start ui-state-highlight');
    		
			var $tds = $("table.ui-datepicker-calendar td[ymd]"); 
			
			for (var i=0, len = $tds.length ; i < len; i++ )
			{
				var $td = $($tds[i]);				
				var ymd = $td.attr("ymd");	
				
				if (ymd >= toDate) return;
				
				if (ymd > fromDate)
				{					
					$td.addClass('ui-state-highlight'); // 대여일과 반납일 사이 표시
				}	
			
				if (ymd > toDate)
				{
					break;
				}			
			}				
			_self.setDateField();
		},
		showMonth:function()
		{
			var showMonth = (this._selectFromDate == null) ? this._showMonth : this.addDates(this._selectFromDate, 61).substr(0,6);
			var $trs = $("table.ui-datepicker-calendar tbody tr");			
			var isShow = true;
			
			for (var i=0, len = $trs.length ; i < len; i++ )
			{
				var $tr = $($trs[i]);				
				var ym = $tr.attr("ym");				
				if (isShow && ym && ym > showMonth)
				{
					isShow = false;
				}
				
				if (isShow)
				{
					$tr.show();
				}
				else
				{
					$tr.hide();
				}
			}
		},		
		addEvent:function () {
			var _self = this;
		
//			if (_self._isEvent) return;
			_self._isEvent = true;
			
			$("a.modal-reset").click(function(e)
			{
				_self.resetDate();
				$("#select_branch1").val('');				
				$("#select_branch2").val('');
				$("#select_branch2").prop('disabled',true);
				setTimeDefault(); // 시간초기값 설정
				$("#selectRentTime1,#selectRentTime2").prop('disabled', true); //시간옵션 사용금지 : 날짜선택한 다음 해제
				
				if($("#branchId").val() != "000012") {
					$("#select_area1").val('');
					$("#select_area2").val('');
				}
			});
		    
			//이지웰페어 빠른검색 초기화 버튼
			$("a.date-reset").click(function(e)
			{
				_self.resetDate();
				$("#select_branch1").val('');				
				$("#select_branch2").val('');
				$("#select_branch2").prop('disabled',true);
				setTimeDefault(); // 시간초기값 설정
				$("#selectRentTime1,#selectRentTime2").prop('disabled', true); //시간옵션 사용금지 : 날짜선택한 다음 해제
				
				if($("#branchId").val() != "000012") {
					$("#select_area1").val('');
					$("#select_area2").val('');
				}
			});
			
		    $("table.ui-datepicker-calendar > tbody").on('click', 'td[class!="ui-state-disabled"]>a', function(e) {
		    	
		    	var $me = $(e.target);
		    	var $td = $me.parent();
		    	var branchId = $("#branchId").val();
		    	
		    	var nRentTime1 = $("#selectRentTime1").val();
		    	var nRentTime2 = $("#selectRentTime2").val();
		    	
		    	if (calendar._selectToDate != null) // 반납일까지 선택되었을때 클릭하면 선택금지이어도 대여일,반납일 초기화
		    	{
		    		_self._clickCount = 0;
		    		calendar._selectFromDate = null;
		    		calendar._selectToDate = null;
		    		calendar.selectRange();
		    		_self.$tbody.find("td.ui-restrict").addClass('ui-datepicker-unselectable ui-state-disabled'); //선택제한 날짜들을 선택금지처리
		    		_self._selectableDate = _self._maxRentDate;
		    		
		    		//단기메인용 확인버튼 제어
		    		$("#btn_confirm_date").addClass('disabled');
		    		$("#btn_confirm_date").prop('disabled', true);
		    		
		    		if($('#rsvMode').val() == "jeju"){
		    			$("#selectRentTime1,#selectRentTime2").prop('disabled', true);
		    			$("#altField1").val("");
		    			$("#altField2").val("");
		    			_self.setRistrict();
		    			
		    		} else {
		    			controlTimeOption(); //시간선택제어
		    		}
		    		
		    		return;
		    	}
		    	
//		    	if( $td.hasClass('ui-state-disabled')) return; // disable 선택방지	    	
//		    	if ($td.hasClass('ui-datepicker-today')) //오늘날짜는 경고 + 선택방지
//		    	{
//		    		alert('예약은 익일(현시간에서 24시간 이후)부터 가능합니다. 자세한 사항은 해당 지점으로 문의 바랍니다.');
//		    		return;
//		    	}
		    	
		    	var ymd = $td.attr('ymd');	
		    	
		    	if (_self._clickCount ==2)
		    	{
		    		_self.resetDate();
		    		//단기메인용 확인버튼 제어
		    		$("#btn_confirm_date").addClass('disabled');
		    		$("#btn_confirm_date").prop('disabled', true);
		    		
		    		if($('#rsvMode').val() == "jeju"){
		    			$("#selectRentTime1,#selectRentTime2").prop('disabled', true);
		    		} else {
		    			controlTimeOption(); //시간선택제어
		    		}
		    		
		    		return;
		    	}
		    	
		    	var cDate = new Date();
				
				var cHour = cDate.getHours();	  
				var cMin = cDate.getMinutes();
//				var cHour = 21;	  
//				var cMin = 01;
				var ableHHMM = null;
				var cHHMM = _self.getDigitNum(cHour) + _self.getDigitNum(cMin);
				if(cMin == 0){
					cHour = cHour + 3;
					cMin = 0;
				}else if(cMin < 30){
					cHour = cHour + 3;
					cMin = 30;
				}else if(cMin == 30){
					cHour = cHour + 3;
					cMin = 30;
				}else if(cMin > 30){
					cHour = cHour + 4;
					cMin = 0;
				}
				
				var hhmm = "" + ((cHour<10) ? "0"+cHour:cHour) + ((cMin<10) ? "0" + cMin:cMin);
		    	
				//startDate 클릭
		    	if (_self._clickCount == 0 || ymd < _self._selectFromDate)
		    	{
		    		if($('#rsvMode').val() == "jeju"){
		    			$("#selectRentTime1").prop('disabled', false);
		    		}
		    		
		    		_self._clickCount = 1;	
		    		_self._selectFromDate = ymd;
		    		
		    		if (ymd == _self._today/*ymd == _self._nextDate당일예약*/) // 내일날짜를 선택했을때
	    			{
		    			console.log("today click");
	    				// 대여가능시간을 설정.
	    				$optes = $("#selectRentTime1 option");
	    				console.log("1click!!!! "+cHHMM+"/"+cHour+"/"+cMin);
	    				cHHMM = _self.getDigitNum(cHour) + _self.getDigitNum(cMin);
	    				console.log("1click "+cHHMM);
	    				
	    				for (var i=0; i < $optes.length; i++)
	    				{
	    					var $opt = $($optes[i]);
//	    					if ($opt.val() <= cHHMM)
	    					if ($opt.val() < cHHMM){
//	    						$opt.hide();
	    						$opt.remove();
	    					}else{
	    						$opt.show();
	    						if (ableHHMM == null)
	    						{
	    							ableHHMM = $opt.val();
	    						}
	    					}
	    				}
	    				
	    				if($('#rsvMode').val() == "jeju"){
	    					if(parseInt(nRentTime1) < parseInt(ableHHMM)){
		    					$("#selectRentTime1").val(ableHHMM);	
		    					$("#selectRentTime2").val(nRentTime2);
		    				} else {
		    					$("#selectRentTime1").val(nRentTime1);
		    					$("#selectRentTime2").val(nRentTime2);
		    				}
	    				} else {
	    					$("#selectRentTime1").val(ableHHMM);
	    				}
	    				    				
	    				_self._isNextDate = true; // 대여일을 내일로 선택하였음
	    			}
	    			else
	    			{
	    				if (_self._isNextDate) //내일로 선택했다가 다른 날짜로 변경했을때
	    				{
		    				$("#selectRentTime1 option").show(); //모든 옵션을 show
		    				$("#modal-calendar select").prop("selectedIndex",0); // selectbox 선택 초기화	 
		    				_self._isNextDate = false;
	    				}
	    					
    					console.log("no today click!!!!!!!!!!" + $('#rsvMode').val()+"/"+hhmm);
//		    				$("#selectRentTime1 option").show(); //
	    				
	    				if($('#rsvMode').val() == "jeju"){
    						// 2021-06-03 제주 대여일 07시30분 부터 대여가능시간 변경
    						console.log("AAAAA : ", $("#selectRentTime1").val() );
    						console.log("AAAAA : ", calendar._selectFromDate);
    						console.log("AAAAA : ", calendar._selectToDate);
							if ($("#selectRentTime1").val() == "0700" || $("#selectRentTime1").val() == "0730" || typeof($("#selectRentTime1").val()) == null){
								console.log("MMM1");
								nRentTime1 = "0730";
							}
							
							setJejuResTime("branch1", "000012", null, null);
    						$("#modal-calendar select").prop("selectedIndex",0); // selectbox 선택 초기화	
	    				}else if($('#rsvMode').val() == "inland"){
    						getInlandPossTime(null, null, null, null);
    						$("#modal-calendar select").prop("selectedIndex",0); // selectbox 선택 초기화	
	    				}
	    			}
		    				    		
		    		_self.selectRange();
		    		
		    		if($('#rsvMode').val() == "jeju") {
		    			_self._selectableDate = _self.addDates(ymd, 60); //선택가능한 날짜는 대여일로부터 60일로 변경		    		
		    		} else {
		    			_self._selectableDate = _self.addDates(ymd, 29); //선택가능한 날짜는 대여일로부터 30일로 변경
		    		}
		    		
		    		_self.$tbody.find("td.ui-restrict").removeClass('ui-datepicker-unselectable ui-state-disabled'); //선택제한 날짜들을 선택금지해제
		    		
		    		console.log("selectableDate1 : ", _self._selectableDate);
		    		console.log("branchId : ", branchId);
		    		
		    		/*
		    		if(branchId !=  "000012" && $('#rsvMode').val() != "jeju")
		    		{
		    			if(_self._selectableDate >= "20190531")
		    			{
		    				console.log("NO~~~ : ", _self.$tbody);
		    				_self._selectableDate = "20190531";
		    			}
		    			console.log("selectableDate2 : ", _self._selectableDate);
		    		}
		    		*/
		    		
		    		console.log('x1' );

					// 선택불가능한 날짜처리 수정
					if( $(this).parent("td").attr("class") == "ui-state-highlight-start ui-state-highlight" || $(this).parent("td").attr("class") == "ui-datepicker-week-end ui-state-highlight-start ui-state-highlight" ){
						_self.setRistrict(); //선택불가능한 날짜처리
												
						//단기메인용 확인버튼 제어
						$("#btn_confirm_date").addClass('disabled');
						$("#btn_confirm_date").prop('disabled', true);
						_self.setDateField();
						
						$(".ui-datepicker-calendar").find("tr td").each(function (i, value){
							if(typeof $(this).attr("ymd") != "undefined"){
								//console.log("AAAAAAA : ", _self._selectFromDate, " / ", $(this).attr("ymd") );
								
								if($(this).attr("ymd") == _self._selectFromDate){
									//당일 클릭 시 예약 기본시간으로 설정
									//console.log("당일예약!!");	
									setReservationTimeDefault();
								}
								return false;
							}
						});
						
					}else{
						if($(this).parent("td").attr("class") == "ui-datepicker-week-end ui-state-highlight-start ui-state-highlight" ){
							$(this).parent("td").attr("class", "ui-datepicker-week-end ui-state-highlight-start ui-state-highlight" );
						}else{
							$(this).parent("td").attr('class', 'ui-datepicker-unselectable  ui-state-disabled');
						}
						return;
					}
		    			
		    		return;
		    	}

				//lastDate 클릭
		    	if (_self._clickCount == 1 && ymd > _self._selectFromDate)
		    	{
		    		if($('#rsvMode').val() == "jeju"){
		    			$("#selectRentTime2").prop('disabled', false);
		    		}
		    		
		    		if (ymd == _self._selectFromDate) return;
		    		
		    		if (ymd > _self._selectFromDate) 
	    			{
	    				_self._selectToDate = ymd;				    		
						$("#altField1").val("");
						$("#altField2").val("");
	    			}
		    		else // 두번째 찍은 날짜가 대여일보다 이전이면 반납일을 먼저찍은 날짜(대여일), 대여일은 두번째 찍은 날짜로 변경
	    			{
		    			_self._selectToDate = _self._selectFromDate;
		    			_self._selectFromDate = ymd;
	    			}
		    		
		    		var rsvMode = $("#rsvMode").val();
		    		var opt1 = "";
					var opt2 = "";
					
		    		if (rsvMode == "jeju"){
		    			/*
			    		if(_self._selectToDate == "20200801"){
			    			setTimeout(function(){
			    				$("#selectRentTime2").val("0800").prop("selected", true);
			    			});
			    		}
			    		*/
		    			console.log("jeju-----Rtn-----Start")
			    		
			    		setJejuRtnTime("branch1", "000012", null, null);
	    			}
		    		
		    		
    				$("#selectRentTime2 option").show(); //모든 옵션을 show
    				//$("#modal-calendar select").prop("selectedIndex",0); // selectbox 선택 초기화	
		    		
    				if($('#rsvMode').val() == "inland"){
    					controlTimeOption();
    				}
		    		
		    		// 선택불가능한 날짜처리 수정
		    		if( $(this).parent("td").attr("class") == "ui-datepicker-week-end" || $(this).parent("td").attr("class") == ""  || $(this).parent("td").attr("class") == undefined ){
		    			_self._clickCount = 2;
		    			_self.selectRange();
		    			_self.setDateField();

		    			//단기메인용 확인버튼 제어
		    			$("#btn_confirm_date").removeClass('disabled'); 
		    			$("#btn_confirm_date").prop('disabled',false);
		    			
		    			//단기 내륙일시 대여지점 disable 해제
		    			if($('#rsvMode').val() == "inland"){
		    				$("#select_area1").prop('disabled',false);
		    			}
		    		}else{
						return;
		    		}	
		    	}		    	

		    });	    
		},
		setDateField:function()
		{
			var _self = this;
			
			if (_self._selectFromDate != null)
			{
		    	var sDay = _self.toDateDay(_self._selectFromDate);
		    	var eDay = _self.toDateDay(_self._selectToDate);	    	
		    	$("#altField1").val(sDay);
		    	$("#altField2").val(eDay);			
			}
			else
			{
		    	$("#altField1").val("");
		    	$("#altField2").val("");						
			}
		},
		resetDate:function(fromDate, toDate)
		{
			var _self = this;			
			if (fromDate != null)
			{
				_self._selectFromDate = fromDate;
				_self._selectToDate = toDate;
				_self.setDateField();
				_self._clickCount = 2;
			}
			else
			{
	    		_self._selectFromDate = null;
	    		_self._selectToDate = null;
	    		$("#altField1").val("");
				$("#altField2").val("");
				
				_self._clickCount = 0;
			}
   		
    		
    		_self.selectRange(); //선택영역처리  		
    		_self.init_option();
			console.log('x3');
    		_self.setRistrict(); //선택불가능한 날짜처리

    		$("#btn_confirm_date").addClass('disabled');	  //확인버튼 사용금지
    		$("#btn_confirm_date").prop("disabled",true);
		},		
		getDigitNum:function (num) {	
		    if (num < 10) return "0" + num;
		    return "" + num;	
		},
		toYmd:function(date)
		{
			var y = date.getFullYear();
			var m = date.getMonth()+1;
			var d = date.getDate();
			return y + this.getDigitNum(m) + this.getDigitNum(d);
		},		
		toDate:function(ymd)
		{
			var y = ymd.substr(0,4);
			var m = ymd.substr(4,2);
			var d = ymd.substr(6,2);
			return new Date(y,parseInt(m)-1,d);
		},		
		toDateDay:function(ymd)
		{
			if (ymd == null || ymd == "") return "";			
			var wkArry = ['일','월','화','수','목','금','토'];			
			var y = ymd.substr(0,4);
			var m = ymd.substr(4,2);
			var d = ymd.substr(6,2);
			var dt = new Date(y,parseInt(m)-1,d);			
			return y + "." + m + "." + d + "(" + wkArry[dt.getDay()] + ")"
		},	
		
		getLastDate:function (mm, yyyy) {
		    if (mm == 1) //2월
		    {
		    	return (yyyy % 400 == 0 || (yyyy % 100 != 0 && yyyy % 4 == 0)) ? 29:28;
		    }	    
		    else if (mm == 3 || mm == 5 || mm == 8 || mm == 10) 
		    	return 30;
		    else
		    	return 31;
		},	
		
		makeTimeOption:function (sHour, eHour)
		{
			var _self = this;	
			var opt = "";
			var hh;
			for (var i=sHour ; i <= eHour; i+=1)
			{
				hh = _self. getDigitNum(i);
				opt += '<option value="' + hh + '00">' + hh + ' 시 00분</option>';		
				if (i !=  eHour)
					opt += '<option value="' + hh + '30">' + hh + ' 시 30분</option>';				
			}	
			return opt;
		},
		makeTimeOption1:function (sHour, eHour)
		{
			var _self = this;	
			var opt = "";
			var hh;
			for (var i=sHour ; i <= eHour; i+=1)
			{
				hh = _self. getDigitNum(i);
				if (i !=  7)
					opt += '<option value="' + hh + '00">' + hh + ' 시 00분</option>';		
				if (i !=  eHour)
					opt += '<option value="' + hh + '30">' + hh + ' 시 30분</option>';				
			}	
			return opt;
		},
		init_option:function()
		{
			var _self = this;	
			
			_self._initOption = true;
			
			var rsvMode = $("#rsvMode").val(); 			
			var opt1 = "";
			var opt2 = "";
			if (rsvMode == "jeju") //제주는 대여가능시간 7시~22시. 반납가능시간 6시~21시
			{
				// 메인 페이지 예약 후 넘어 왔을때 대여일 세팅
				var paramsShour = $("#params_sHour").val();
				if( paramsShour == "" || typeof(paramsShour) == "undefined"  ){
					paramsShour = "7";
					//console.log("00 : ", paramsShour);
				}else{
					var today = dateUtil.toYmd(new Date());
					var cDate = new Date();
					var cHour = cDate.getHours();	  
					var cMin = cDate.getMinutes();
					var cHour = cDate.getHours();	  
					var cMin = cDate.getMinutes();
					var ableHHMM = null;
					var cHHMM = _self.getDigitNum(cHour) + _self.getDigitNum(cMin);
					if(cMin == 0){
						cHour = cHour + 3;
						cMin = 0;
					}else if(cMin < 30){
						cHour = cHour + 3;
						cMin = 30;
					}else if(cMin == 30){
						cHour = cHour + 3;
						cMin = 30;
					}else if(cMin > 30){
						cHour = cHour + 4;
						cMin = 0;
					}
					if(today == calendar._selectFromDate){
						paramsShour = cHour;
					}else{
						paramsShour = "7";
					}
					//console.log("11 : ", paramsShour);
				}
				console.log("MAIN ----- paramsShour : ", paramsShour);
				
				//opt1 = _self.makeTimeOption1(Number(paramsShour),22); //대여시간 오전7시 30분 ~ 오후 10시(22시)
				//opt2 = _self.makeTimeOption(6,21); //반납시간 오전6시 오후 9시(21시)	
				//_self._eHour = 22;
				
				var pSHour = $("#params_sHour").val();
				var pLHour = $("#params_lHour").val();
				var pSMinute = $("#params_sMinute").val();
				var pLMinute = $("#params_lMinute").val();
				
				setJejuResTime("branch1", "000012", pSHour + pSMinute, pLHour + pLMinute);
				setJejuRtnTime("branch2", "000012", pSHour + pSMinute, pLHour + pLMinute);
			}
			else //내륙
			{
				
				var currentDate = new Date();
				var cHour = currentDate.getHours();
				var cMin = currentDate.getMinutes();
				var possSHour = _self._inlandStartHour;

				if(cHour >= _self._inlandStartHour && cHour < _self._inlandEndHour){
					var nDate = currentDate;
					nDate.setHours(nDate.getHours()+24);
					possSHour = nDate.getHours();
					
					if(cHour == (_self._inlandEndHour-1) && cMin >= 30) {
						possSHour = _self._inlandStartHour;
					}
				} else {
					possSHour = _self._inlandStartHour;
				}
				
				opt1 = _self.makeTimeOption(possSHour,_self._inlandEndHour); //대여시간 오전9시 오후 7시(19시)
				opt2 = opt1; // 대여시간과 동일
				_self._eHour = _self._inlandEndHour;
				$("#select_area1").prop('disabled',true);
				$("#select_area2").prop('disabled',true);
				$("#select_branch1").prop('disabled',true);
				$("#select_branch2").prop('disabled',true);
			}
			console.log("AAA 1: ", opt1);
			
			$("#selectRentTime1").html(opt1);  //대여시간 selectbox 셋팅
			$("#selectRentTime2").html(opt2);  //반납시간 selectbox 셋팅
			
			if ($("#rentDateTime1").val() != null)
			{
				var time1 =$("#rentDateTime1").val().substr(8);
				var time2 =$("#rentDateTime2").val().substr(8);
			
				if(time1 != "" && time2 != ""){
				$("#selectRentTime1").val(time1).prop("selected", true);
				$("#selectRentTime2").val(time2).prop("selected", true);
				
				
				$("#btn_confirm_date").removeClass('disabled');
				$("#btn_confirm_date").prop("disabled",false);
				console.log("AAA --------------- 1: ", opt1);
				}
				console.log("AAA --------------- 1: ", opt1);
			}
			
			$("#selectRentTime1,#selectRentTime2").prop('disabled', true);
			$("#btn_confirm_date").addClass('disabled');
		},
		init: function ()
		{
			var _self = this;
			if (!_self._initOption)
			{   //이미 시간옵션이 생성되어 있으면 다시 하지 않는다. 
				_self.init_option();
			}
			_self.$tbody = $("#simple-select-days-range div.ui-datepicker-inline");	
			_self.make();
			_self.setRistrict(); //선택불가능한 날짜처리
			_self.addEvent();
		}
	};

$(function () {

	calendar.init();
});

function resetDate() //달력 선택값을 초기화
{
	console.log("call resetDate()");
	calendar.resetDate();
	
	//select 박스도 초기화
	$("#modal-calendar select option").show(); //모든 옵션 show
	$("#modal-calendar select").prop("selectedIndex",0); //모든 selectbox 선택 초기화
	
//	calendar_store_data();

}

var _tempYmd1 = null;
var _tempYmd2 = null;
var _tempTime1 = null;
var _tempTime2 = null;
var _tempbr1 = null;
var _tempbr2 = null;
var _tempcd1 = null;
var _tempcd2 = null;

// 단기메인용
// 달력호출시 확인을 눌러서 기억한 대여일,반납일과 달력에서 선택하다가 말고 닫은 값이 다르면
// 기억되어 있는 값으로 reset시킨다.
$("a.btn-cal").click(function(e){
	//readonly 되어있을 경우 달력 안띄운다. 
	if($(this).parent().hasClass("readonly")){
		return false;
	}
	e.preventDefault();
	
	calendar.init();
	var isReset = false;
	
	if ((_tempYmd1 && _tempYmd1 != calendar._selectFromDate) && (_tempYmd2 && _tempYmd2 != calendar._selectToDate))
	{
		if (_tempYmd1 == "") _tempYmd1 = null;
		if (_tempYmd2 == "") _tempYmd2 = null;
		
		setTimeDefault();
		calendar._selectFromDate = _tempYmd1;
		calendar._selectToDate = _tempYmd2;
		calendar._clickCount = 2;
		calendar.selectRange();
		isReset = true;
	}
	else if ($("#rentDateTime1").val()== "" && calendar._selectFromDate != null) //달력에서 날짜를 선택했는데 그냥 닫은 경우
	{
		resetDate();
		setTimeDefault(); // 시간초기값 설정
		$("#selectRentTime1,#selectRentTime2").prop('disabled', true); //시간옵션 사용금지 : 날짜선택한 다음 해제
	}
	
	if (_tempTime1 && _tempTime1 != $("#selectRentTime1").val())
	{
		change_branch();
		$("#selectRentTime1").val(_tempTime1);
		isReset = true;
	}
	
	if (_tempTime2 && _tempTime2 != $("#selectRentTime2").val())
	{
		$("#selectRentTime2").val(_tempTime2);
		isReset = true;
	}
	
	$("#modal-calendar").css({display:"block"});
    $("html").addClass("no-scroll");

	if (isReset)
	{
		calendar.setDateField();
		calendar._clickCount = 2;		
		$("#btn_confirm_date").removeClass('disabled');
		$("#selectRentTime1,#selectRentTime2").prop('disabled', false); //시간옵션 사용해제
	}
	else
	{
		if (calendar._selectFromDate && calendar._selectToDate)
		{
			calendar._clickCount = 2;
			$("#selectRentTime1,#selectRentTime2").prop('disabled', false); //시간옵션 사용해제
		}
	}
	
	calendar.selectRange();
	
	if (_tempbr1 && _tempbr1 != $("#select_branch1").val())  
	{
		$("#select_branch1").val(_tempbr1);
		$("#select_branch2").val(_tempbr2);
		
		if(_tempbr1 != "000012") {
			$("#select_area1").val(_tempcd1);
			$("#select_area2").val(_tempcd2);
			$("#select_area1").prop('disabled',false);
			$("#select_branch1").prop('disabled',false);
		}
	}

//    modal_open("#modal-calendar");
	$("#modal-calendar").css({display:"block"});
    $("html").addClass("no-scroll");

    if(typeof $("#corp").val() != "undefined" && $("#corp").val() == "InterPark") {
    	setCustonModal('modal-calendar', 'span_date_br1');
    }
});

// 제주,내륙예약용(메인)
function open_calendar()
{	
	calendar.init();
	var isReset = false;
	
	if ((_tempYmd1 && _tempYmd1 != calendar._selectFromDate) && (_tempYmd2 && _tempYmd2 != calendar._selectToDate))
	{
		if (_tempYmd1 == "") _tempYmd1 = null;
		if (_tempYmd2 == "") _tempYmd2 = null;
		
		setTimeDefault();
		calendar._selectFromDate = _tempYmd1;
		calendar._selectToDate = _tempYmd2;
		calendar._clickCount = 2;
		calendar.selectRange();
		isReset = true;
	}
	else if ($("#rentDateTime1").val()== "" && calendar._selectFromDate != null) //달력에서 날짜를 선택했는데 그냥 닫은 경우
	{
		resetDate();
		setTimeDefault(); // 시간초기값 설정
		$("#selectRentTime1,#selectRentTime2").prop('disabled', true); //시간옵션 사용금지 : 날짜선택한 다음 해제
	}
	
	if (_tempTime1 && _tempTime1 != $("#selectRentTime1").val())
	{
		change_branch();
		$("#selectRentTime1").val(_tempTime1);
		isReset = true;
	}
	
	if (_tempTime2 && _tempTime2 != $("#selectRentTime2").val())
	{
		$("#selectRentTime2").val(_tempTime2);
		isReset = true;
	}
	
	$("#modal-calendar").css({display:"block"});
    $("html").addClass("no-scroll");

	if (isReset)
	{
		calendar.setDateField();
		calendar._clickCount = 2;		
		$("#selectRentTime1,#selectRentTime2").prop('disabled', false); //시간옵션 사용해제
	}
	else
	{
		if (calendar._selectFromDate && calendar._selectToDate)
			{
				calendar._clickCount = 2;
				$("#selectRentTime1,#selectRentTime2").prop('disabled', false); //시간옵션 사용해제
			}
	}
	
	calendar.selectRange();
	
	if (_tempbr1 && _tempbr1 != $("#select_branch1").val())  
	{
		$("#select_branch1").val(_tempbr1);
		$("#select_branch2").val(_tempbr2);
		
		if(_tempbr1 != "000012") {
			$("#select_area1").val(_tempcd1);
			$("#select_area2").val(_tempcd2);
			$("#select_area1").prop('disabled',false);
			$("#select_branch1").prop('disabled',false);
		}
	}

//    modal_open("#modal-calendar");
	$("#modal-calendar").css({display:"block"});
    $("html").addClass("no-scroll");

    if(typeof $("#corp").val() != "undefined" && $("#corp").val() == "InterPark") {
    	setCustonModal('modal-calendar', 'span_date_br1');
    }
}

function calendar_store_data() // 입력한 값들을 기억해놨다가 '확인'안하고 닫는 경우를 위해 저장
{
	_tempYmd1 = calendar._selectFromDate == null ? "" : calendar._selectFromDate;
	_tempYmd2 = calendar._selectToDate == null ? "" : calendar._selectToDate;
	_tempTime1 = $("#selectRentTime1").val();
	_tempTime2 = $("#selectRentTime2").val();
	_tempbr1 = $("#select_branch1").val();
	_tempbr2 = $("#select_branch2").val();	
	_tempcd1 = $("#select_area1").val();
	_tempcd2 = $("#select_area2").val();
}



//시간선택옵션 초기화
function setTimeDefault(hasEx, hasSdate)
{
	resetDate();
	console.log("setTimeDefault!!!!! where "+$('#rsvMode').val());
	var dt = new Date();
	var d = dt.getDate();
	var h = dt.getHours();
	var m = dt.getMinutes();

//	var h = 21;
//	var m = 01;
	var hhmm = "" + ((h<10) ? "0"+h:h) + ((m<10) ? "0" + m:m);
	console.log("d "+d);
	console.log("h "+h);
	console.log("m "+m);
	
	if(hasEx){
		hhmm = "1300";
		
		if(hasSdate){
			var minTime = null;
			var $timeOption1 = $('#selectRentTime1 option');
			for (var i=0; i<$timeOption1.length; i++)
			{
				var $op = $($timeOption1[i]);
				var opval = $op.val();		
				if (opval >= hhmm)
				{
					minTime = opval;
					break;
				}	
			}
			
			if (minTime != null)
			{
				//시간을 선택가능한 시간으로 변경
				$('#selectRentTime1,#selectRentTime2').val(minTime);		
				//반납시간에는 그 시간이 없으면
				if ($("#selectRentTime2").val() == null) 
				{
					$("#selectRentTime2 option:last").prop('selected',true); // 맨마지막시간으로 설정
				}
			}
			else
			{
				$('#selectRentTime1 option:eq(0)').prop('selected',true); 
				$('#selectRentTime2 option:eq(0)').prop('selected',true)
			}
		}
	}else{
		if(calendar._selectFromDate == "20180924" && $("#branchId").val() != '000012'){
			if(hhmm < '1300')
				hhmm = '1230';
		}
		
		//여기가 디폴트 시간 세팅
		if(m == 0){
			h = h+3;
			m = 0;
		}else if(m < 30){
			h = h+3;
			m = 30;
		}else if(m == 30){
			h = h+3;
			m = 30;
		}else if(m > 30){
			h = h+4;
			m= 0;
		}
		
		hhmm = "" + ((h<10) ? "0"+h:h) + ((m<10) ? "0" + m:m);
		console.log("예약가능시간 "+hhmm + "/" + m);
		var minTime = null;
		var $timeOption1 = $('#selectRentTime1 option');
		var toDay = dateUtil.toYmd(new Date());
		var nextDay = dateUtil.addDates(toDay, 1);
		var paramsSdate = typeof $("#params_sDate").val() == "undefined" ? "" : $("#params_sDate").val().replace(/-/g, "");
		
		//console.log("ZZZZZZZZZZZZZ1 : ", $timeOption1);
		//console.log("ZZZZZZZZZZZZZ1 : ", toDay, nextDay, paramsSdate);
		
		if(paramsSdate == toDay || paramsSdate == nextDay){
			for (var i=0; i<$timeOption1.length; i++)
			{
				var $op = $($timeOption1[i]);
				var opval = $op.val();	
				
				if($('#rsvMode').val() == "jeju"){
					if(paramsSdate == toDay){
						if(hhmm >= 0800 && hhmm <= 2200){
							//보이는 부분
							if ($op.val() < hhmm){
								$op.remove();
							}else{
								$op.show();
								if (minTime == null)
								{
									minTime = $op.val();
									
								}
							}
						}else {
							if(hhmm == 2230){
								if($op.val() == "0730"){
									$op.remove();
								}else{
									$op.show();
								}
							}else if(hhmm > 2230 && hhmm < 2400){
								if($op.val() < hhmm - 1600){
									$op.remove();
								}else{
									$op.show();
								}
							}else{
								console.log("excep00");
								if($op.val() < 0800){
									$op.remove();
								}else{
									$op.show();
								}
								minTime = 0800;
							}
						}
					} else if(paramsSdate == nextDay) {
						if(hhmm == 2230){
							if($op.val() == "0730"){
								$op.remove();
							}else{
								$op.show();
							}
						}else if(hhmm > 2230 && hhmm < 2400){
							if($op.val() < hhmm - 1600){
								$op.remove();
							}else{
								$op.show();
							}
						}else if(hhmm >= 2400){
							console.log("excep00");
							if($op.val() < 0800){
								$op.remove();
							}else{
								$op.show();
							}
							minTime = 0800;
						}
					}
				}else if($('#rsvMode').val() == "inland"){
					if(hhmm >= 1200 && hhmm <= 1900){
						//보이는 부분
						if ($op.val() < hhmm){
							$op.remove();
						}else{
							$op.show();
							if (minTime == null)
							{
								minTime = $op.val();
							}
						}
					}else {
						if(hhmm == 1930){
							if($op.val() == 0900){
								$op.remove();
							}else{
								$op.show();
							}
						}else if(hhmm > 1930 && hhmm < 2200){
							if($op.val() < hhmm - 1000){
								$op.remove();
							}else{
								$op.show();
							}
						}else{
							console.log("excep01");
							if($op.val() < 1200){
								$op.remove();
							}else{
								$op.show();
							}
							minTime = 1200;
						}
					}
					
				}
				//		//선택하는부분
////		if (opval > hhmm)
//			if (opval >= hhmm)
//			{
//				minTime = opval;
//				break;
//			}
			}
		}
		
		
		console.log("ZZZZZZZZZZZZZ2 : ",$('#selectRentTime1 option'));
		
		console.log("minTime ?="+minTime);
		
		if (minTime != null)
		{
			//시간을 선택가능한 시간으로 변경
		    $('#selectRentTime1,#selectRentTime2').val(minTime);		
			
			//반납시간에는 그 시간이 없으면
			if ($("#selectRentTime2").val() == null) 
			{
				$("#selectRentTime2 option:last").prop('selected',true); // 맨마지막시간으로 설정
			}
		}
		else
		{
			$('#selectRentTime1 option:eq(0)').prop('selected',true); 
//			$('#selectRentTime2 option:eq(0)').prop('selected',true);
			$('#selectRentTime2').val($('#selectRentTime1').val());
		}
	}	
	
}

//당일 예약 시간으로 설정
function setReservationTimeDefault()
{
	var dt = new Date();
	var d = dt.getDate();
	var h = dt.getHours();
	var m = dt.getMinutes();
	
	//여기가 디폴트 시간 세팅
	if(m == 0){
		h = h+3;
		m = 0;
	}else if(m < 30){
		h = h+3;
		m = 30;
	}else if(m == 30){
		h = h+3;
		m = 30;
	}else if(m > 30){
		h = h+4;
		m= 0;
	}
	
	hhmm = "" + ((h<10) ? "0"+h:h) + ((m<10) ? "0" + m:m);
	console.log("예약가능시간 "+hhmm + "/" + m);
	var minTime = null;
	var $timeOption1 = $('#selectRentTime1 option');
	for (var i=0; i<$timeOption1.length; i++)
	{
		var $op = $($timeOption1[i]);
		var opval = $op.val();	
		
		if($('#rsvMode').val() == "jeju"){
			if(hhmm >= 1100 && hhmm <= 2200){
				//보이는 부분
				if ($op.val() < hhmm){
					$op.remove();
				}else{
					$op.show();
					if (minTime == null)
					{
						minTime = $op.val();
						
					}
				}
			}else {
				if(hhmm == 2230){
					if($op.val() == "0730"){
						$op.remove();
					}else{
						$op.show();
					}
				}else if(hhmm > 2130 && hhmm < 2400){
					if($op.val() < hhmm - 1600){
						$op.remove();
					}else{
						$op.show();
					}
				}else{
					console.log("excep00");
					if($op.val() < 0800){
						$op.remove();
					}else{
						$op.show();
					}
					minTime = 0800;
				}
			}
		}
//		else if($('#rsvMode').val() == "inland"){
//			if(hhmm >= 1200 && hhmm <= 1900){
//				//보이는 부분
//				if ($op.val() < hhmm){
//					$op.remove();
//				}else{
//					$op.show();
//					if (minTime == null)
//					{
//						minTime = $op.val();
//					}
//				}
//			}else {
//				if(hhmm == 1930){
//					if($op.val() == 0900){
//						$op.remove();
//					}else{
//						$op.show();
//					}
//				}else if(hhmm > 1930 && hhmm < 2200){
//					if($op.val() < hhmm - 1000){
//						$op.remove();
//					}else{
//						$op.show();
//					}
//				}else{
//					console.log("excep01");
//					if($op.val() < 1200){
//						$op.remove();
//					}else{
//						$op.show();
//					}
//					minTime = 1200;
//				}
//			}
//		}
	}
}

//대여,반납시간 옵션 제어
function controlTimeOption()
{
	if (calendar._selectFromDate && calendar._selectToDate) //대여일,반납일 모두 선택됬을때
	{
		var today = dateUtil.toYmd(new Date());
		var nextDay = dateUtil.addDates(today, 1);
		
		if (today == calendar._selectFromDate  /*|| nextDay == calendar._selectFromDate당일예약*/)
		{
			//초기시간
			var endTime = $('#selectRentTime1').val();
			//setTimeDefault(); // 시간초기값 절정
			//첫번째시간으로 선택
			$('#selectRentTime1 option:eq(0)').prop('selected',true); 
			
			//반납시간 설정
			if(Number(endTime) >= 2030){
				$('#selectRentTime2').val("2000");
			}else{
				$('#selectRentTime2').val($('#selectRentTime1').val());
			}
//			$('#selectRentTime2 option:eq(0)').prop('selected',true);
			
			
		}
//		else if(calendar._selectFromDate == "20180924" && $("#branchId").val() != '000012'){
//			setTimeDefault(true, true);
//		}
//		else if(calendar._selectToDate == "20180924" && $("#branchId").val() != '000012'){
//			setTimeDefault(true, false);
//		}
		else
		{
			//첫번째시간으로 선택
			$('#selectRentTime1 option:eq(0)').prop('selected',true); 
//			$('#selectRentTime2 option:eq(0)').prop('selected',true);
			$('#selectRentTime2').val($('#selectRentTime1').val());
			
		}
		$("#selectRentTime1,#selectRentTime2").prop('disabled', false); //시간옵션 사용해제
	}
	else
	{
		setTimeDefault();
		$("#selectRentTime1,#selectRentTime2").prop('disabled', true); //시간옵션 사용금지 : 날짜선택한 다음 해제
	}
	
	// 20190115 추가
	// 20190417 제거 calenderValidateEvent_m.js branchHoliyday() 대체
	/*
	if($('#rsvMode').val() == "inland"){
		$("#txtClosedBranch").hide();
		if( calendar._selectFromDate == closedStartDate ){
			$("#txtClosedBranch").show();
			if( $("#selectRentTime1").val() < Number(openTime) ){
//				alert("설명절 연휴 당일 오전시간 예약/반납이 불가합니다.");
				$("#selectRentTime1").val(openTime);
			}
		}else if( calendar._selectToDate == closedStartDate ){
			$("#txtClosedBranch").show();
			if( $("#selectRentTime2").val() < Number(openTime) ){
//				alert("설명절 연휴 당일 오전시간 예약/반납이 불가합니다.");
				$("#selectRentTime2").val(openTime);
			}
		}
	}
	*/
}

$(function(){	
	//setTimeDefault(); // 시간초기값 설정
	$("#selectRentTime1,#selectRentTime2").prop('disabled', true); //시간옵션 사용금지 : 날짜선택한 다음 해제
});

// 달력 휴무일 표시
function calendarHoliyDay()
{
	$.getJSON("/resources/js/calendarHoliyDay.json", function(holiyDay){
		$(".ui-datepicker-calendar").find("tr td").each(function (i, value){
			for(var j=0; j<holiyDay.length; j++){
				if($(this).attr("ymd") == holiyDay[j].holiyDay.replace(/-/g, "") ){
					$(this).addClass(" ui-datepicker-week-end");
					$(this).attr("title", holiyDay[j].holiyDayName);
				}else{
					if( typeof $(this).attr("title") == "undefined" ){
						$(this).attr("title", $(this).attr("ymd"));	
					}
				}
			}
		});
	});
}


