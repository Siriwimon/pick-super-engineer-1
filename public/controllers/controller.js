

var myApp = angular.module('RoomBookingApp', ['ui.calendar','ngAnimate', 'ngSanitize', 'ui.bootstrap']);

myApp.service();

myApp.controller('BookingCtrl',['$scope','$http','$compile','$filter','$timeout','$uibModal','$log',function($scope,$http,$compile,$filter,$timeout,$uibModal,$log,uiCalendarConfig){

	// event in Calendar //
	$scope.eventsUbuntu = [];
	$scope.eventsCentOS = [];
	$scope.eventsFedora = [];
	$scope.eventsSolaris = [];
	$scope.eventsDebian = [];


	$scope.event = {};
	// intervalTime renderView //
	var limitStart = "";
  	var limitEnd = "";
  	var room = "";

  	$scope.date = new Date();

	var initTime = new Date();
	initTime.setMinutes(0);
	initTime.setSeconds(0);
	$scope.startTime = initTime;
	$scope.endTime = initTime;

	var minTime = new Date();
	minTime.setHours(8);
	minTime.setMinutes(0);
	$scope.min = minTime;

	var maxTime = new Date();
	maxTime.setHours(18);
	maxTime.setMinutes(0);
	$scope.max = maxTime;


	var maxDate = new Date();
	maxDate.setDate((new Date()).getDate() + 13);

	var selectedHour = 3;

	$scope.rooms = ["Ubuntu","CentOS","Fedora","Solaris","Debian"];
  	$scope.selectRoom = ["Ubuntu","CentOS","Fedora","Solaris","Debian"];

  	var colors = ["#ffb74d","#9575cd","#64b5f6","#9ccc65","#ef9a9a"]

	var renderView = function(start,end,roomSelected){
	  	intervalTime = [start,end,"+" + roomSelected];  
	  	// console.log(intervalTime);
	  	if (roomSelected == "Ubuntu"){$scope.eventsUbuntu.splice(0, $scope.eventsUbuntu.length);}
	  	else if (roomSelected == "CentOS"){$scope.eventsCentOS.splice(0, $scope.eventsCentOS.length);}
	  	else if (roomSelected == "Fedora"){$scope.eventsFedora.splice(0, $scope.eventsFedora.length);}
	  	else if (roomSelected == "Solaris"){$scope.eventsSolaris.splice(0, $scope.eventsSolaris.length);}
	  	else if (roomSelected == "Debian"){$scope.eventsDebian.splice(0, $scope.eventsDebian.length);} 	  	
	  	
	  	$http.get('/events/render/' + intervalTime).then(successCallback,errorCallback);

	  	function successCallback(response){
	  		console.log(response.data);
	  		if (roomSelected == "Ubuntu"){
	  			// $scope.eventsUbuntu.splice(0, $scope.eventsUbuntu.length);
	  			$scope.eventsUbuntu.push.apply($scope.eventsUbuntu,response.data);
	  			console.log($scope.eventSources1);

		 		 
	  		}else if (roomSelected == "CentOS"){
	  			// $scope.eventsCentOS.splice(0, $scope.eventsCentOS.length);
	  			$scope.eventsCentOS.push.apply($scope.eventsCentOS,response.data);
		 		
	  		}else if (roomSelected == "Fedora"){
	  			// $scope.eventsFedora.splice(0, $scope.eventsFedora.length);
	  			$scope.eventsFedora.push.apply($scope.eventsFedora,response.data);
		 		
	  		}else if (roomSelected == "Solaris"){
	  			// $scope.eventsSolaris.splice(0, $scope.eventsSolaris.length);
	  			$scope.eventsSolaris.push.apply($scope.eventsSolaris,response.data);
		 		
	  		}else if (roomSelected == "Debian"){
	  			// $scope.eventsDebian.splice(0, $scope.eventsDebian.length);
	  			$scope.eventsDebian.push.apply($scope.eventsDebian,response.data);
		 		
	  		}
	  	};
	  	function errorCallback(error){
	  		console.log("error");
	  		
	  	};	
	 
	};

  	$scope.renderCalendar = function (calendarId) {
    	$timeout(function () {
        	calendarTag = $('#' + calendarId);
        	calendarTag.fullCalendar('render');
    	}, 0);
	};

    

    $scope.uiConfigUbuntu = {
  	calendar:{
	    selectable: true,
	    selectHelper: true,
	    editable: false,
	    timeFormat: 'HH:mm',
	    height: 630,
	    minTime: "08:00:00",
	    maxTime: "20:00:00",
	    // events: $scope.eventsUbuntu,	    
	    defaultView: 'agendaWeek',	    
	    header:{
	        left: 'prev,next today',
	        center: 'title',
	        right: 'month,agendaWeek,agendaDay,listWeek'
	    },
	    viewRender: function(view, element) {
	    	room = "Ubuntu"
	    	limitStart = $filter('date')(view.intervalStart._d, "yyyy-MM-dd");
	    	limitEnd = $filter('date')(view.intervalEnd._d, "yyyy-MM-dd");
	    	console.log(view);
	    	
	    	renderView(limitStart,limitEnd,room);
        },
	    eventRender: function(event, element, view){
	    		$scope.eventRender(event, element, view);
	    },		
	 	eventClick: function(event, jsEvent, view){
	    		$scope.openModal(event, jsEvent, view);
	    }
	  
	}
			
  	};

  	$scope.uiConfigCentOS= {
  	calendar:{
	    selectable: true,
	    selectHelper: true,
	    editable: false,
	    timeFormat: 'HH:mm',
	    height: 630,
	    minTime: "08:00:00",
	    maxTime: "20:00:00",
	    // events: $scope.eventsCentOS,	    
	    defaultView: 'agendaWeek',	    
	    header:{
	        left: 'prev,next today',
	        center: 'title',
	        right: 'month,agendaWeek,agendaDay,listWeek'
	    },
	    viewRender: function(view, element) {
	    	room = "CentOS"
	    	limitStart = $filter('date')(view.intervalStart._d, "yyyy-MM-dd");
	    	limitEnd = $filter('date')(view.intervalEnd._d, "yyyy-MM-dd");
	    	renderView(limitStart,limitEnd,room);
        },
	    eventRender: function(event, element, view){
	    		$scope.eventRender(event, element, view);
	    },		
	 	eventClick: function(event, jsEvent, view){
	    		$scope.openModal(event, jsEvent, view);
	    }
	  
	}
			
  	};

  	$scope.uiConfigFedora = {
  	calendar:{
	    selectable: true,
	    selectHelper: true,
	    editable: false,
	    timeFormat: 'HH:mm',
	    height: 630,
	    minTime: "08:00:00",
	    maxTime: "20:00:00",	
	    // events: $scope.eventsFedora,    
	    defaultView: 'agendaWeek',	    
	    header:{
	        left: 'prev,next today',
	        center: 'title',
	        right: 'month,agendaWeek,agendaDay,listWeek'
	    },
	    viewRender: function(view, element) {
	    	room = "Fedora"
	    	limitStart = $filter('date')(view.intervalStart._d, "yyyy-MM-dd");
	    	limitEnd = $filter('date')(view.intervalEnd._d, "yyyy-MM-dd");
	    	renderView(limitStart,limitEnd,room);
        },
	    eventRender: function(event, element, view){
	    		$scope.eventRender(event, element, view);
	    },		
	 	eventClick: function(event, jsEvent, view){
	    		$scope.openModal(event, jsEvent, view);
	    }
	  
	}
			
  	};

  	$scope.uiConfigSolaris = {
  	calendar:{
	    selectable: true,
	    selectHelper: true,
	    editable: false,
	    timeFormat: 'HH:mm',
	    height: 630,
	    minTime: "08:00:00",
	    maxTime: "20:00:00",
	    // events: $scope.eventsSolaris,
	    defaultView: 'agendaWeek',	    
	    header:{
	        left: 'prev,next today',
	        center: 'title',
	        right: 'month,agendaWeek,agendaDay,listWeek'
	    },
	    viewRender: function(view, element) {
	    	room = "Solaris"
	    	limitStart = $filter('date')(view.intervalStart._d, "yyyy-MM-dd");
	    	limitEnd = $filter('date')(view.intervalEnd._d, "yyyy-MM-dd");
	    	renderView(limitStart,limitEnd,room);
        },
	    eventRender: function(event, element, view){
	    		$scope.eventRender(event, element, view);
	    },		
	 	eventClick: function(event, jsEvent, view){
	    		$scope.openModal(event, jsEvent, view);
	    }
	  
	}
			
  	};

  	$scope.uiConfigDebian = {
  	calendar:{
	    selectable: true,
	    selectHelper: true,
	    editable: false,
	    timeFormat: 'HH:mm',
	    height: 630,
	    minTime: "08:00:00",
	    maxTime: "20:00:00",
	    // events: $scope.eventsDebian,
	    defaultView: 'agendaWeek',
	    // timeFormat : {
	    //             month : ' ', // for hide on month view
	    //             agenda: 'h:mm t'
	    // },
	    header:{
	        left: 'prev,next today',
	        center: 'title',
	        right: 'month,agendaWeek,agendaDay,listWeek'
	    },
	    viewRender: function(view, element) {
	    	room = "Debian"
	    	limitStart = $filter('date')(view.intervalStart._d, "yyyy-MM-dd");
	    	limitEnd = $filter('date')(view.intervalEnd._d, "yyyy-MM-dd");
	    	renderView(limitStart,limitEnd,room);
        },
	    eventRender: function(event, element, view){
	    		$scope.eventRender(event, element, view);
	    },		
	 	eventClick: function(event, jsEvent, view){
	    		$scope.openModal(event, jsEvent, view);
	    }
	  
	}
			
  	};

  	$scope.open = function(){
    	$scope.popup.opened = true;
    };

    $scope.popup = {
    	opened: false
  	};

  	$scope.dateOptions = {
    	dateDisabled: disabled,
    	formatYear: 'yy',
    	maxDate: maxDate,
    	minDate: new Date(),
    	startingDay: 1
  	};

  	function disabled(data) {
    	var date = data.date,
      	mode = data.mode;
    	return mode === 'day' && (date.getDay() === 0 );
  	}

  	$scope.clearDate = function(){
  		$scope.date = null;
  	}

  	$scope.stateSelectRoom = true;
    var isNumber = false;

    $scope.checkValidID = function(){       	
    	console.log("validation");
    	var checkedTitleName = "";
    	if($scope.event.title != ""){
    		checkedTitleName = $scope.event.title;
    		console.log(checkedTitleName);
    		if (checkedTitleName.length == 13){
	    		if(isNaN(checkedTitleName)){
	    			console.log("Not Number");
	    			isNumber = false;    			
	    		}else{
	    			console.log("Number");
	    			isNumber = true;
	    		}
    		}else{
    			isNumber = false;
    		}

    		if (isNumber == true){
    			$scope.stateSelectRoom = false;
    			console.log("stateSelectRoom");
    			if ($scope.startTime != ""){
		    		if (selectedDate == ""){
						d = new Date()
						selectedDate = $filter('date')(d, "yyyy-MM-dd");
						if ($scope.event.id === undefined){
							
							selectedRoom = "events";
							
						}else{
							selectedRoom = $scope.events.id;

						}
					}
					var selectedEndTime = $filter('date')($scope.endTime, "HH:mm:ss");
					selectedEnd = selectedDate + 'T' + selectedEndTime;

					var selectedStartTime = $filter('date')($scope.startTime, "HH:mm:ss");
					selectedStart = selectedDate + 'T' + selectedStartTime;

					ID = $scope.event.title;
		    		
		    		checkIDBooking(ID,selectedRoom,selectedStart);
		    		checkRoomOverlap(ID,selectedStart,selectedEnd);
		    		
		    		$scope.stateSelectRoom = false;
	    			$scope.stateSelectDate = false;
	    			$scope.stateSelectTime = false;
	    			
		    	}
    		}else{
    			$scope.stateSelectRoom = true;
    			$scope.stateSelectDate = true;
    			$scope.stateSelectTime = true;
    			$scope.stateAddEvent = true;
    			
    		}

    	}else{
    		$scope.stateSelectRoom = true;
    		$scope.stateSelectDate = true;
    		$scope.stateSelectTime = true;
    		$scope.stateAddEvent = true;
    		
    	}

   //  	if ($scope.startTime != ""){
   //  		if (selectedDate == ""){
			// 	d = new Date()
			// 	selectedDate = $filter('date')(d, "yyyy-MM-dd");
			// 	if ($scope.event.id === undefined){
					
			// 		selectedRoom = "events";
					
			// 	}else{
			// 		selectedRoom = $scope.events.id;

			// 	}
			// }
			// var selectedEndTime = $filter('date')($scope.endTime, "HH:mm:ss");
			// selectedEnd = selectedDate + 'T' + selectedEndTime;

			// var selectedStartTime = $filter('date')($scope.startTime, "HH:mm:ss");
			// selectedStart = selectedDate + 'T' + selectedStartTime;

			// ID = $scope.event.title;
   //  		checkRoomOverlap(ID,selectedStart,selectedEnd);
   //  	}
    };

    $scope.stateSelectDate = true;
    $scope.checkRoom = function(){
    	if ($scope.event.id != ""){
    		$scope.stateSelectDate = false;
    	}else{
    		$scope.stateSelectDate = true;
    	}
    };

    $scope.stateSelectTime = true;
    
    var addEventResult = [];
    $scope.stateAddEvent = true;

  	$scope.addEvent = function(){	
  		

		formatStartDate = $filter('date')($scope.date, "yyyy-MM-dd");		
		formatEndDate = $filter('date')($scope.date, "yyyy-MM-dd");					

		if ($scope.startTime == null){
			
			$scope.event.start = formatStartDate;
		}
			
		else{

			formatStartTime = $filter('date')($scope.startTime, "HH:mm:ss");
			$scope.event.start = formatStartDate + 'T' + formatStartTime;					
		}
		
		if ($scope.endTime == null){

			$scope.event.end = formatEndDate;			
		}
		else{

			formatEndTime = $filter('date')($scope.endTime, "HH:mm:ss");
			$scope.event.end = formatEndDate + 'T' + formatEndTime;						
		}

		for (var i=0; i<colors.length; i++){

			
			if ($scope.event.id == $scope.rooms[i]){
				console.log(colors[i]);
				$scope.event.color = colors[i];
			}
		}		
		
		

		console.log($scope.event);		


    	$http.post('/events', $scope.event).then(successCallback,errorCallback);

	  	function successCallback(response){	
	  		
	  		renderView(limitStart,limitEnd,room);
	  	};
	  	function errorCallback(error){
	  		console.log("error");
	  		   
	  	};   	


	};

	$scope.reset = function(){
		$scope.event = {};
		// $scope.event.title = "";
		$scope.date = "";
		$scope.startTime = "";
		$scope.endTime = "";	
		selectedRoom = "";	
		selectedDate = "";
		$scope.stateSelectRoom = true;
		$scope.stateSelectDate = true;
		$scope.stateSelectTime = true;
		$scope.stateAddEvent = true;
		addEventResult = [];
		
	};

	$scope.ctrlStartTime = function(){
		
		
		if ($scope.endTime != ""){	        
			if (($scope.endTime.getHours() - $scope.startTime.getHours()) >= 3){
				limitEndTime = new Date($scope.startTime);
				limitEndTime.setHours(limitEndTime.getHours() + 3);
				$scope.endTime = limitEndTime;
				console.log("A1");
				if ($scope.endTime.getTime() > $scope.max.getTime()){
					$scope.endTime = $scope.max;
					console.log("A2");				
				}
				
			}				
			
			if ($scope.startTime.getTime() == $scope.endTime.getTime()){
				limitEndTime = new Date($scope.endTime);
				limitEndTime.setHours(limitEndTime.getHours() + 1);
				$scope.endTime = limitEndTime;
				console.log("A3");

				if ($scope.endTime.getTime() > $scope.max.getTime()){
					$scope.endTime = $scope.max;
					limitStartTime = new Date($scope.endTime);
					limitStartTime.setHours(limitStartTime.getHours() - 1);
					$scope.startTime = limitStartTime;	
					console.log("A4");			
				}

				// if ($scope.)
			}			

		} else {
			if ($scope.startTime.getHours() <= 17){
				// console.log("*************use thisloop***************")
				$scope.startTime = initTime;
				refStartTime = $scope.startTime;
				endTime = new Date(refStartTime);
				endTime.setHours(endTime.getHours() + 1);			
				$scope.endTime = endTime;
				console.log("A5");

			} else {
				
				$scope.startTime = initTime;
				$scope.endTime = $scope.max;
				console.log("A6");
			}
			
		}

		
	};

	$scope.ctrlEndTime = function(){
		// $scope.endTime = initTime;
		if ($scope.startTime != ""){		
			
			if (($scope.endTime.getHours() - $scope.startTime.getHours()) >= 3){
				limitStartTime = new Date($scope.endTime);
				limitStartTime.setHours(limitStartTime.getHours() - 3);
				$scope.startTime = limitStartTime;
				console.log("B1");
				if ($scope.startTime.getTime() < $scope.min.getTime()){
					$scope.startTime = $scope.min;
					console.log("B2");
				}
				
			}
			

			if ($scope.startTime.getTime() == $scope.endTime.getTime()){
				limitStartTime = new Date($scope.startTime);
				limitStartTime.setHours(limitStartTime.getHours() - 1);
				$scope.startTime = limitStartTime;
				console.log("B3");

				if ($scope.startTime.getTime() < $scope.min.getTime()){
					$scope.startTime = $scope.min;	
					limitEndTime = new Date($scope.startTime);
					limitEndTime.setHours(limitEndTime.getHours() + 1 );
					$scope.endTime = limitEndTime;
					console.log("B4");
				}
			}

			

		} else {
			if ($scope.endTime.getHours() >= 9){
				refEndTime = $scope.endTime;
				startTime = new Date(refEndTime);
				startTime.setHours(startTime.getHours() - 1);
				$scope.startTime = startTime;
				console.log("B5");
			} else {
				
				$scope.endTime = new Date();
				$scope.start = $scope.min;
				console.log("B6");
			}
		}
		// selectedStartTime = $scope.startTime;
		console.log($scope.startTime);
		console.log($scope.endTime);
		
	};

	$scope.ismeridian = true;
	$scope.hstep = 1;
	$scope.mstep = 30;

	var selectedRoom = "";
	var selectedDate = "";
	var selectedStartTime = "";

	$scope.changeRoom = function(){
		
		console.log($scope.event.id);
		if ($scope.date == ""){
			// console.log($scope.event.id);
			selectedRoom = $scope.event.id;
			if ($scope.startTime == ""){
				
				console.log($scope.event.id);
			}else{
				// console.log('2.startTime != "" && dat = ""');
				selectedRoom = $scope.event.id;
				d = new Date()
				selectedDate = $filter('date')(d, "yyyy-MM-dd");
				$scope.isStartOverlap();
			}
		}else{
			selectedRoom = $scope.event.id;
			$scope.isEmptyDate();
			selectedRoom = $scope.event.id;
			if ($scope.startTime == ""){				
				$scope.isEmptyDate();
			}else{
				
				selectedRoom = $scope.event.id;
				$scope.isStartOverlap();
				$scope.isEmptyDate();

				ID = $scope.event.title;
				selectedDate = $filter('date')($scope.date, "yyyy-MM-dd");
				selectedStartTime = $filter('date')($scope.startTime, "HH:mm:ss");
				selectedStart = selectedDate + 'T' + selectedStartTime;

				checkIDBooking(ID,selectedRoom,selectedStart);
			}
		}

		
	}

	$scope.isEmptyDate = function(){
		// console.log($scope.events.id)
		if (selectedRoom == ""){

			if ($scope.event.id === undefined){
				// $scope.event.id = "events";
				selectedRoom = "events";
				// console.log($scope.event.id)

			}else{
				selectedRoom = $scope.events.id;

			}
		}else{
			console.log(selectedRoom);			
		}
		
		selectedDate = $filter('date')($scope.date, "yyyy-MM-dd")
		checkEmpty = [selectedDate,"+"+selectedRoom,"vacation"];
		// emptyDate = $scope.event.id;


		$http.get('/events/checkdate/' + checkEmpty).then(successCallback,errorCallback);

	  	function successCallback(response){
	  		if (response.data == "unavailable"){
				console.log(response);
				$scope.stateSelectTime = true;
				$scope.stateAddEvent = true;
			}else{
				$scope.stateSelectTime = false;
				
			   
			}
	  	};
	  	function errorCallback(error){
	  		console.log("error");
	  		
	  	};	

		if ($scope.startTime == ""){
				
		}else{
			var selectedEndTime = $filter('date')($scope.endTime, "HH:mm:ss");
			selectedEnd = selectedDate + 'T' + selectedEndTime;

			var selectedStartTime = $filter('date')($scope.startTime, "HH:mm:ss");
			selectedStart = selectedDate + 'T' + selectedStartTime;

			ID = $scope.event.title;
		    checkRoomOverlap(ID,selectedStart,selectedEnd);
			checkIDBooking(ID,selectedRoom,selectedStart);			
			$scope.isStartOverlap();
		}

	};

	$scope.stateStart = "unavailable";
	$scope.isStartOverlap = function(){

		if (selectedDate == ""){
			d = new Date()
			selectedDate = $filter('date')(d, "yyyy-MM-dd");
			if ($scope.event.id === undefined){
				// $scope.event.id = "events";
				selectedRoom = "events";
				// console.log($scope.event.id)
			}else{
				selectedRoom = $scope.events.id;

			}
		}

		var selectedEndTime = $filter('date')($scope.endTime, "HH:mm:ss");
		selectedEnd = selectedDate + 'T' + selectedEndTime;

		var selectedStartTime = $filter('date')($scope.startTime, "HH:mm:ss");
		selectedStart = selectedDate + 'T' + selectedStartTime;
		ID = $scope.event.title;
		// send room & starttime
		console.log("room: " + selectedRoom + " startTime: " + selectedStart);
		checkStartOverlap = [selectedRoom,selectedStart];

		$http.get('/events/checkstart/' + checkStartOverlap).then(successCallback,errorCallback);

	  	function successCallback(response){
	  		// console.log("isStartOverlap:" + response);
	  		$scope.stateStart = response.data;
	  		// checkRoomOverlap(ID,selectedStart,selectedEnd);

	  		checkIDBooking(ID,selectedRoom,selectedStart);
	  	};
	  	function errorCallback(error){
	  		console.log("error");
	  		
	  	};

	 //  	if ($scope.endTime == ""){
					
		// }else{
					
		// 	$scope.isEndOverlap();
		// }
		
	}

	$scope.stateEnd = "unavailable";
	$scope.isEndOverlap = function(){

		if (selectedDate == ""){
			d = new Date()
			selectedDate = $filter('date')(d, "yyyy-MM-dd");
			if ($scope.event.id === undefined){
				
				selectedRoom = "events";
				
			}else{
				selectedRoom = $scope.events.id;

			}
		}
		var selectedEndTime = $filter('date')($scope.endTime, "HH:mm:ss");
		selectedEnd = selectedDate + 'T' + selectedEndTime;

		var selectedStartTime = $filter('date')($scope.startTime, "HH:mm:ss");
		selectedStart = selectedDate + 'T' + selectedStartTime;

		ID = $scope.event.title;

		checkEndOverlap = [selectedRoom,selectedEnd,selectedStart];
		

		$http.get('/events/checkend/' + checkEndOverlap)
		.then(successCallback,errorCallback);

	  	function successCallback(response){
	  		// console.log("isEndOverlap:" + response);
	  		// console.log(response.data);
	  		$scope.stateEnd = response.data;
	    	checkRoomOverlap(ID,selectedStart,selectedEnd);

	    	// checkAddEvent();
	  	};
	  	function errorCallback(error){
	  		console.log("error");
	  		
	  	};	

	  	
	    
	};

	$scope.stateID = "unavailable";
	var checkIDBooking = function(studentID,room,bookingStart){

		date = new Date();
		var timeNow = $filter('date')(date, "HH:mm:ss");
		var dateNow = $filter('date')(date, "yyyy-MM-dd");
		var now = dateNow + "T" + timeNow;
		console.log(now);
		checkBookDetail = [studentID,room,bookingStart,now];
		$http.get('/events/checkid/' + checkBookDetail).then(successCallback,errorCallback);

		function successCallback(response){
			$scope.stateID = response.data;
			console.log("stateID: " + $scope.stateID);
		};
		function errorCallback(response){
			console.log("error");
		}

	}
	
	$scope.stateRoom = "unavailable";
	var checkRoomOverlap = function(studentID,bookingStart,bookingEnd){
		roomDetail = [studentID,bookingStart,bookingEnd];
		$http.get('/events/checkbooking/' + roomDetail).then(successCallback,errorCallback);

		function successCallback(response){
			$scope.stateRoom = response.data;

			checkAddEvent();
		};
		function errorCallback(error){
			console.log("error");
		};
	};

	var checkAddEvent = function(){
		console.log("stateStart: "+$scope.stateStart + " stateEnd: " + $scope.stateEnd + " stateRoom: " + $scope.stateRoom + " stateID: " + $scope.stateID );
		if (($scope.stateStart == "available" && $scope.stateEnd == "available" ) && ($scope.stateRoom == "available" && $scope.stateID == "available") ){
	    	$scope.stateAddEvent = false;
	    }else{
	    	$scope.stateAddEvent = true;
	    }
	}	

	$scope.eventRender = function(event, element ,view){		
		// console.log("eventRender")
		element.attr({'uib-tooltip': event.title,'uibtooltip-append-to-body': true}); //fix bug https://github.com/angular-ui/ui-calendar/issues/357
        $compile(element)($scope);
  			
  		
	};

	$scope.openModal = function (event, jsEvent, view) {
		// console.log(event);
	    var modalInstance = $uibModal.open({
	      templateUrl: 'myModalContent.html',
	      controller: 'ModalInstanceCtrl',
	      // size: size,
	      resolve: {
	        item: function () {
	          // console.log(event);
	          return event;
	        }
	      }
	    });

	    modalInstance.result.then(function (selectedItem) {
	      $scope.selected = selectedItem;
	    }, function () {
	      $log.info('Modal dismissed at: ' + new Date());
	    });
	};

  	

	$scope.eventSources1 = [$scope.eventsUbuntu];
	$scope.eventSources2 = [$scope.eventsCentOS];
	$scope.eventSources3 = [$scope.eventsFedora];
	$scope.eventSources4 = [$scope.eventsSolaris];
	$scope.eventSources5 = [$scope.eventsDebian];
	// console.log($scope.eventSources3);
	// $scope.eventSources1 = [];
	// $scope.eventSources2 = [];
	// $scope.eventSources3 = [];
	// $scope.eventSources4 = [];
	// $scope.eventSources5 = [];
  
}]);

myApp.controller('ModalInstanceCtrl',['$scope','$http','$uibModalInstance','item','$filter', function($scope,$http,$uibModalInstance,item,$filter){

	
	$scope.item = item;
	$scope.isReadonly = "readonly"
	$scope.toggleState = true;
	$scope.toggleName = "Edit"

	$scope.start = $filter('date')($scope.item.start._i, "dd-MMMM-yyyy HH:mm ");
	$scope.end = $filter('date')($scope.item.end._i, "dd-MMMM-yyyy HH:mm ");

	var newEvent = {};
	// console.log($scope.item);
	$scope.selected = {
	    item: $scope.item[0]
	};

	$scope.ok = function () {
	    $uibModalInstance.close($scope.selected.item);
	};

	$scope.cancel = function () {
	    $uibModalInstance.dismiss('cancel');
	};

	$scope.edit = function (){
		// $scope.isReadonly = "";
		$scope.toggleState  =! $scope.toggleState;
		if ($scope.toggleState == false){
			$scope.isReadonly = "";
			$scope.toggleName = "Update";
			$scope.isShow = false;
		}else{
			$scope.isReadonly = "readonly";
			$scope.toggleName = "Edit"

			updateEvent();
		}
	};

	var updateEvent = function(){
		
		start = new Date($scope.start);
		end = new Date($scope.end);

		start = $filter('date')(start, "yyyy-MM-dd HH:mm:ss ");
		end = $filter('date')(end, "yyyy-MM-dd HH:mm:ss ");
		
		newEvent._id = $scope.item._id;
		newEvent.title = $scope.item.title;
		newEvent.id = $scope.item.id;
		newEvent.start = start;
		newEvent.end = end

		console.log(newEvent);

		

	};
	$scope.isShow = true;
	$scope.cancelEdit = function(){
		$scope.start = $filter('date')($scope.item.start._i, "dd-MMMM-yyyy HH:mm ");
		$scope.end = $filter('date')($scope.item.end._i, "dd-MMMM-yyyy HH:mm ");
		$scope.toggleState = true;
		$scope.isReadonly = "readonly";
		$scope.toggleName = "Edit";
		$scope.isShow = true;

	}

	$scope.delete = function(){
		console.log($scope.item._id);
	}

	$scope.ismeridian = true;
	$scope.hstep = 1;
	$scope.mstep = 30;

	
		
	
}]);
	

	
	

	