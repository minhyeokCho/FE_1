var _AceTM=(_AceTM||{});

function setBuyInfo(vOrderNo,vModeId,vModelNm,vTotalPrice){
	vTotalPrice = vTotalPrice.replace(/(,)/g, "");
console.log("===_AceTM.Buy...=="+vOrderNo+"/"+vModeId+"/"+vModelNm+"/"+vTotalPrice);

	_AceTM.Buy={
			bOrderNo:vOrderNo, //주문번호(필수)
			bTotalPrice:vTotalPrice, //주문 총가격(필수)
			bPay:'',  //지불방법(ex : 무통장,신용카드 ,~~~)
			bItem:[] // 주문리스트(필수)
		};
	
	_AceTM.Buy.bItem.push({
		pCode:vModeId,	 //제품아이디
		pName:vModelNm,  	 //제품이름
		pQuantity:0, //제품수량 or 옵션수량
		pPrice:vTotalPrice, 	 //판매가 
		oCode:'',    //옵션아이디
		oName:''     //옵션이름
	});		
console.log(_AceTM);	
}	

function setContractInfo(vOrderNo,vModeId,vModelNm,vTotalPrice){
	vTotalPrice = vTotalPrice.replace(/(,)/g, "");
console.log("===_AceTM.setContractInfo...=="+vOrderNo+"/"+vModeId+"/"+vModelNm+"/"+vTotalPrice);

	_AceTM.Buy={
			bOrderNo:vOrderNo, //주문번호(필수)
			bTotalPrice:vTotalPrice, //주문 총가격(필수)
			bPay:'',  //지불방법(ex : 무통장,신용카드 ,~~~)
			bItem:[] // 주문리스트(필수)
		};	
	
	_AceTM.Buy.bItem.push({
		pCode:vModeId,	 //제품아이디
		pName:vModelNm,  	 //제품이름
		pQuantity:0, //제품수량 or 옵션수량
		pPrice:vTotalPrice, 	 //판매가 
		oCode:'',    //옵션아이디
		oName:''     //옵션이름
	});	
}

//vParam1 : 동의
//vParam2 : 면책 428001 :완전자차, 428003 : 슈퍼자차, 428009 : 선택안함.
//vParam3 : 정보
function setUserSelectTrace(vModeId,vModelNm,vParam1,vParam2,vParam3){
	
	if(vModeId.substring(0,2) == "BE"){
		var vCategory = "0";
		
		vModelNm = vModelNm.replace(/\s/gi, "");
		
		if(vParam1 =='N' || vParam1 =='' ){ //동의
			vCategory = vCategory+""+"1";
		}else{
			vCategory = vCategory+""+"0";
		}
		
		if(vParam2 !='428001' ){ //면책 428001 :완전자차, 428003 : 슈퍼자차, 428009 : 선택안함.
			vCategory = vCategory+""+"1";
		}else{
			vCategory = vCategory+""+"0";
		}
		
		if(!vParam3){ //정보
			vCategory = vCategory+""+"1";
		}else{
			vCategory = vCategory+""+"0";
		}
console.log("===_AceTM.setUserSelectTrace..vCategory.="+vCategory+"/vModelNm="+vModelNm);		
		_AceTM.Product={
				pCode:vModeId,   //제품아이디(필수)
				pName:vModelNm,  //제품이름(필수)
				pPrice:1,     	   //판매가(필수)
				pCategory:vCategory,    //제품 카테고리명(선택)
				pImageURl:'',
				pLink:'', //제품상세페이지 주소(선택)
				oItem:[]
			};
		
		_AceTM.PV("/step1");
	}
}