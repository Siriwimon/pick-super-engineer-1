var express = require('express');
var app = express();
var mongojs = require('mongojs');
var db = mongojs('events',['events']);
var bodyParser = require('body-parser');

var moment = require('moment-timezone');

app.use(express.static(__dirname + "/public")); 
app.use(bodyParser.json());


app.get('/events', function (req, res){
	console.log("I recieve a GET request");
	
	db.events.find(function (err, docs){
		console.log(docs);
		res.json(docs);
	});
});

app.get('/events/render/:text', function (req, res){
	// console.log("I recieve a GET request");
	var text = req.params.text;
	var arr = text.split("+"); 
	// console.log(arr)
	var dateTime = arr[0].split(",");
	// console.log(dateTime);
	var rooms = arr[1].split(",");
	console.log(rooms);
	// res.json("success")
	
	var intervalStart = dateTime[0];
	var intervalEnd = dateTime[1] ;
	// console.log(rooms[rooms.length - 1]);

	var events = [];
	var event = {};

	var iter = 0;

	console.log(intervalStart);
	console.log(intervalEnd);
	if (rooms != "") {
		rooms.forEach(function(room){
			
			db[room].find(
				{start : {$gte: intervalStart,$lte: intervalEnd}
			}).toArray(function(err,docs){

				iter++;
				console.log(iter);

				if (err){
					res.json("EmptyRooms");
				}else{
					if(docs != null){
						
						docs.forEach(function(item){
							events.push(item);
							// console.log(item);							
							// res.json(item);
						})
						// console.l cxog(events);
						// res.json(events);
					}else{
						// res.json([]);
						console.log("null")

					}


					if(iter == rooms.length){
						if (events != ""){
							// console.log(room)
							console.log(events);
							res.json(events);
							// db.close()
						}else{
							console.log("Empty")
							res.json([]);
						}

					}
				}
			});
		})
	}else{
		res.json([]);
		console.log("Empty selected Rooms")
	}

});

var formatDateTime = function(date){
	
	var d = new Date(date)
		year = d.getFullYear();
		month = (d.getMonth()+1);
		day = d.getDate();
		hour = d.getHours();
		min = d.getMinutes();
		sec = d.getSeconds();
	
	if (month.toString().length < 2){
		month = '0' + month;
	}

	if (day.toString().length < 2){
		day = '0' + day;
	}

	if (hour.toString().length < 2){
		hour = '0' + hour;
	}
	if (min.toString().length < 2){
		min = '0' + min;
	}
	if (sec.toString().length < 2){
		sec = '0' + sec;
	}

		formatDate = [year, month, day].join('-')
		formatTime = [hour,min,sec].join(":")
	return [formatDate,formatTime].join("T")
}

app.post('/events',function (req,res){
	// console.log(req.body);
	var room = req.body.id
	var event = {};
		event.title = req.body.title;
		event.start = req.body.start;
		event.end = req.body.end;
		event.color = req.body.color;
		event.id = req.body.id;
	var dt = new Date();
		parseDT = moment.tz(dt,"Asia/Bangkok").format();
		currentDate = formatDateTime(parseDT);
		event.lastModified = currentDate;
	console.log(event);	

	db[room].insert(event, function(err,doc){
		res.json(doc);
	});
});

// app.get('/events/selected/:text', function (req,res) {
// 	var text= req.params.text;
//  	console.log(text);
 	
//  	db.events.createIndex({ "$**": "text" },{ id: "TextIndex" });
//  	db.events.find({"$text": {"$search": text}}, function(err, doc) {
//  		console.log(doc); 
//  		res.json(doc);
//  	});
// });

// app.get('/events/checkid/:text', function (req,res) {
	// send from studentid input and start time,end time
// });


app.get('/events/checkid/:text', function (req,res) {
	var text = req.params.text;
	var arr = text.split(",");

	var studentID = arr[0];
	var room = arr[1];

	var selectDate = arr[2];
	var parseTZ = moment.tz(selectDate,"Asia/Bangkok");
	var newTime = parseTZ.format();	
	var refTime = new Date(newTime);
	refHour = refTime.getHours();
	refMin = refTime.getMinutes()

	var limitStart = new Date(selectDate);
		limitStart.setDate(limitStart.getDate() - 1) ;
		limitStart.setHours(0);
		
	var parseST = moment.tz(limitStart,"Asia/Bangkok");
	var ST = parseST.format();
	
	var limitEnd = new Date(selectDate);
		limitEnd.setDate(limitEnd.getDate() + 1);
		limitEnd.setHours(0);
	var parseED = moment.tz(limitEnd,"Asia/Bangkok");
	var ED = parseED.format();

	var bookingTime = arr[3];
	var parseTZ = moment.tz(bookingTime,"Asia/Bangkok");
	var newBT = parseTZ.format();	
	var refBT = new Date(newBT);
	refBookHour = refBT.getHours();
	refBookMin = refBT.getMinutes();

	var status = [];

	db[room].find({$and: [ 
			{title: {$eq: studentID}},
			{start: {$gte: ST,$lte: ED}}

	]}).toArray( function (err,docs){
		if (docs != "") {
			docs.forEach(function(event){
				parseEventStart = moment.tz(event.start, "Asia/Bangkok" );
 				refEventStart = parseEventStart.format();
 				startDB = new Date(refEventStart);
 				
 				startDB.setSeconds(0);
 				startDBHour = startDB.getHours();
 				startDBMin = startDB.getMinutes();

 				if ((startDBHour - refBookHour >= 0) && (startDBMin - refBookMin >= 15)){
 					console.log("available for more booking");
 				}else{
 					status.push("unavailable");
 				}	 				
 				
			});

			if (status == ""){
		 		console.log("send available more booking");
		 		res.json("available")

	 		}else if (status != ""){

	 			console.log("send unavailable more booking");
	 			res.json("unvailable")
	 		}

		}else{
			res.json("available")
			console.log("available")
		}
	});


});

app.get('/events/checkbooking/:text', function (req,res) {
	var iter = 0;
	var text= req.params.text;
	var arr = text.split(",")
	var refId = arr[0];
	console.log(text);
	var rooms = ["Ubuntu","CentOS","Fedora","Solaris","Debian"];

	var text= req.params.text;
	var arr = text.split(",") 	

 	// room = arr[0];

	var selectStart = arr[1];
	var parseTZ = moment.tz(selectStart,"Asia/Bangkok");
	var startBooking = parseTZ.format();	

	var selectEnd = arr[2];
	var parseTZ = moment.tz(selectEnd,"Asia/Bangkok")
	var endBooking = parseTZ.format();

	var startRef = new Date(startBooking);
	startRefHour = (startRef.getHours());	

	var endRef = new Date(endBooking);
	var endRefHour = (endRef.getHours());

	var limitStart = new Date(selectStart);
		limitStart.setDate(limitStart.getDate() - 1) ;
		limitStart.getHours(0);
		// limitStart.setMinutes(0);
		var parseST = moment.tz(limitStart,"Asia/Bangkok");
		var ST = parseST.format();
	// limitEnd = toDate.getDate()
	var limitEnd = new Date(selectStart);
		limitEnd.setDate(limitEnd.getDate() + 1);
		limitEnd.setHours(0);
		var parseED = moment.tz(limitEnd,"Asia/Bangkok");
		var ED = parseED.format();

	var status = [];

	rooms.forEach(function(room){
		db[room].find(
			{$and: [ 
				{title: {$eq: refId}},
				{start: {$gte: ST,$lte: ED}}
		]}).toArray( function (err,docs){

			iter++;
			if (docs != ""){

	 			docs.forEach(function(event){
	 				
	 				parseEventStart = moment.tz(event.start, "Asia/Bangkok" );
	 				refEventStart = parseEventStart.format();
	 				EventStart = new Date(refEventStart);
	 				
	 				EventStart.setSeconds(0);
	 				formatEventStart = formatDateTime(EventStart);

	 				parseEventEnd = moment.tz(event.end, "Asia/Bangkok" );
	 				refEventEnd = parseEventEnd.format();
	 				EventEnd = new Date(refEventEnd);
	 				
	 				EventEnd.setSeconds(0);
	 				formatEventEnd = formatDateTime(EventEnd);
	 				
	 				if (selectStart != formatEventStart || selectEnd != formatEventEnd){
	 					// console.log("available");
	 					
	 					parseTZStart = moment.tz(event.start,"Asia/Bangkok");
	 					eventStart = parseTZStart.format();
	 					startDB = new Date(eventStart); 					
	 					startDBHour = (startDB.getHours());
	 					
	 					parseTZEnd = moment.tz(event.end,"Asia/Bangkok");
	 					eventEnd = parseTZEnd.format();
	 					endDB = new Date(eventEnd);
	 					endDBHour = (endDB.getHours());	 					
	 					

	 					if ((startRefHour > startDBHour && startRefHour < endDBHour) || (endRefHour > startDBHour && endRefHour < endDBHour)){	 						
	 						// status = "unavailable"
	 						status.push("unavailable");
	 						console.log("Overlap booking room");
	 					}

	 				} else{
	 					// status = "unavailable"
	 					status.push("unavailable");
	 					// console.log("not available");
	 				}
	 			});

		 		
			}
			// else{
			// 	// res.json("available");
			// 	// console.log("not Overlap selecttion");
			// };

			if(iter == rooms.length){
				if (status != ""){
					// console.log(room)
					console.log("unavailable");
					res.json("unavailable");
					// db.close()
				}else{
					console.log("available")
					res.json("available");
				}

			}



		});
	})

	// find which room have studentid same as ref id AND time in range of ref_start to ref_end 
	// if room is not empty >> not available 
	// if room is empty then >> available
	//     because just check only who booking morethan one room insame time
});

app.get('/events/checkdate/:text', function (req,res){
	var iter = 0;
	var text = req.params.text;
	var arr = text.split("+");
	// console.log(text);
	dateEvent = arr[0];

	
		// toDate = formatDateTime(parseDT);
	var limitStart = new Date(dateEvent);
		limitStart.setDate(limitStart.getDate() - 1) ;
		limitStart.getHours(0);
		// limitStart.setMinutes(0);
		var parseST = moment.tz(limitStart,"Asia/Bangkok")
		var ST = parseST.format();
	// limitEnd = toDate.getDate()
	var limitEnd = new Date(dateEvent);
		limitEnd.setDate(limitEnd.getDate() + 1);
		limitEnd.setHours(0);
		var parseED = moment.tz(limitEnd,"Asia/Bangkok")
		var ED = parseED.format();
		console.log(ST,ED);// limitEnd.setMinutes(0);

	
	rooms = arr[1].split(",");
	// console.log(arr[1])
	// check vacation or available date
	var events = [];
	// res.json("ok")
	var isHoliday = false;
	rooms.forEach(function (room){
		// iter++;
		
		db[room].find(
			{start : {$gt: ST,$lt: ED}
		}).toArray(function(err,docs){
			// console.log(docs);
			iter++;
			if (err){
					// return res.send();
					res.json("EmptyRooms");
			}else{
		 		if (docs != ""){
		 			docs.forEach(function(item){
		 				events.push(item);
		 			});

		 			if (room == "vacation"){
		 				isHoliday = true;
		 			}
		 			// console.log("Please chack available!")
		 		}else{
		 			// console.log("null")
		 			// console.log(events);
		 		}
		 		// console.log(events);
		 		if (iter == rooms.length){
		 			if (isHoliday == true){
		 				res.json("unavailable")
		 			}else{
			 			if(events != ""){
			 				res.json("checkTime");
			 				// console.log("events != null")
			 			}else{
			 				res.json("available");
			 			}
		 			}
		 		}
		 	}
		})
		
	})
	
});

// var formatDate = function(date){
	
// 	var d = new Date(date)
// 		year = d.getFullYear();
// 		month = (d.getMonth()+1);
// 		day = d.getDate();

	
// 	if (month.toString().length < 2){
// 		month = '0' + month;
// 	}

// 	if (day.toString().length < 2){
// 		day = '0' + day;
// 	}

// 	return [year, month, day].join('-')
// }

// var formatTime = function(time){

// 	var t = new Date(time);
	
// 		hour = t.getHours();
// 		min = t.getMinutes();
// 		sec = t.getSeconds();
// 		// console.log(hour)
	
// 	if (hour.toString().length < 2){
// 		hour = '0' + hour;
// 	}

// 	if (min.toString().length < 2){
// 		min = '0' + min;
// 	}

// 	if (sec.toString().length < 2){
// 		sec = '0' + sec;
// 	}

// 	return [hour, min, sec].join(':')
// }
// var startRefHour = "";
app.get('/events/checkstart/:text', function (req,res) {

	var text= req.params.text;
	var arr = text.split(",")
 	

 	room = arr[0];

	var selectStart = arr[1];
	var parseTZ = moment.tz(selectStart,"Asia/Bangkok");
	var startBooking = parseTZ.format();
	
	// var startDate = formatDate(startBooking);
	// var startTime = formatTime(startBooking);
	
	var startRef = new Date(startBooking);
	startRefHour = (startRef.getHours());
	console.log("startRefHour: " + startRefHour);

	var limitStart = new Date(selectStart);
		limitStart.setDate(limitStart.getDate() - 1) ;
		limitStart.getHours(0);
		// limitStart.setMinutes(0);
		var parseST = moment.tz(limitStart,"Asia/Bangkok");
		var ST = parseST.format();
	// limitEnd = toDate.getDate()
	var limitEnd = new Date(selectStart);
		limitEnd.setDate(limitEnd.getDate() + 1);
		limitEnd.setHours(0);
		var parseED = moment.tz(limitEnd,"Asia/Bangkok");
		var ED = parseED.format();
		// console.log(ST,ED);

	// var status = "available";
	var status = [];

	if (startRefHour < 9 || startRefHour >= 18){
		// console.log(startRefHour);
		console.log("startTime "+ startRefHour +" is not in range");
		// console.log("send unavailable to controller");
		res.json("unavailable")

	}else{
		// db[room].createIndex({ "$**": "text" },{ name: "TextIndex" });
	 // 	db[room].find({"$text": {"$search": startDate}}, function(err, docs) {
	 	db[room].find(
			{start : {$gt: ST,$lt: ED}
		}).toArray(function(err,docs){


	 		// console.log(docs); 
	 		if (docs != ""){
	 			// console.log("Please chack available!")
	 			docs.forEach(function(event){
	 				// console.log(event.start);
	 				parseEventStart = moment.tz(event.start, "Asia/Bangkok" );
	 				refEventStart = parseEventStart.format();
	 				EventStart = new Date(refEventStart);
	 				// EventStart.setMinutes(0);
	 				EventStart.setSeconds(0);
	 				formatEventStart = formatDateTime(EventStart);
	 				console.log("selectStart:" + selectStart);
	 				// console.log("formatEventStart:" + formatEventStart);

	 				// console.log(formatEventStart);
	 				if (selectStart != formatEventStart){
	 					// console.log("available");
	 					
	 					parseTZStart = moment.tz(event.start,"Asia/Bangkok");
	 					eventStart = parseTZStart.format();
	 					startDB = new Date(eventStart); 					
	 					startDBHour = (startDB.getHours());
	 					
	 					parseTZEnd = moment.tz(event.end,"Asia/Bangkok");
	 					eventEnd = parseTZEnd.format();
	 					endDB = new Date(eventEnd);
	 					endDBHour = (endDB.getHours());	 					
	 					

	 					if (startRefHour > startDBHour && startRefHour < endDBHour){	 						
	 						// status = "unavailable"
	 						status.push("unavailable");
	 						console.log("Overlap start Time");
	 					}

	 				} else{
	 					// status = "unavailable"
	 					status.push("unavailable");
	 					// console.log("not available");
	 				}
	 			})

		 		if (status == ""){

		 			console.log("send available start");
		 			res.json("available")

		 		}else if (status != ""){

		 			console.log("send unavailable start");
		 			res.json("unvailable")
		 		}

	 		}else{
	 			res.json("available")
	 			console.log("send available start");
	 			console.log("null")
	 		}
	 	});
	}
});

app.get('/events/checkend/:text', function (req,res) {
	var text= req.params.text;
	var arr = text.split(",")
 	
 	room = arr[0];

	var selectEnd = arr[1];
	var parseTZ = moment.tz(selectEnd,"Asia/Bangkok")
	var endBooking = parseTZ.format();

	var selectStart = arr[2];
	var parseTZ = moment.tz(selectStart,"Asia/Bangkok");
	var startBooking = parseTZ.format();
	
	// var endDate = formatDate(endBooking);
	// var endTime = formatTime(endBooking);
	// console.log(startTime);
	var endRef = new Date(endBooking);
	var endRefHour = (endRef.getHours());
	// console.log(startRefHour);
	var startRef = new Date(startBooking);
	var startRefHour = (startRef.getHours());

	var limitStart = new Date(selectEnd);
		limitStart.setDate(limitStart.getDate() - 1) ;
		limitStart.getHours(0);
		// limitStart.setMinutes(0);
		var parseST = moment.tz(limitStart,"Asia/Bangkok")
		var ST = parseST.format();
	// limitEnd = toDate.getDate()
	var limitEnd = new Date(selectEnd);
		limitEnd.setDate(limitEnd.getDate() + 1);
		limitEnd.setHours(0);
		var parseED = moment.tz(limitEnd,"Asia/Bangkok")
		var ED = parseED.format();
		// console.log(ST,ED);

	// var status = "available";
	var status = [];

	if (endRefHour < 9 || endRefHour > 18 ){

		console.log("not in range");
		res.json("unavailable");
	}else{
		// db[room].createIndex({ "$**": "text" },{ name: "TextIndex" });
	 // 	db[room].find({"$text": {"$search": endDate}}, function(err, docs) {
	 		// console.log(docs); 
	 	db[room].find(
			{start : {$gt: ST,$lt: ED}
		}).toArray(function(err,docs){
	 		if (docs != ""){
	 			// console.log("Please chack available!")
	 			docs.forEach(function(event){
	 				// console.log(event.end);

	 				parseEventEnd = moment.tz(event.end, "Asia/Bangkok" );
	 				refEventEnd = parseEventEnd.format();
	 				EventEnd = new Date(refEventEnd);
	 				// EventStart.setMinutes(0);
	 				EventEnd.setSeconds(0);
	 				formatEventEnd = formatDateTime(EventEnd);
	 				console.log("selectEnd:" + selectEnd);
	 				// console.log("formatEventEnd:" + formatEventEnd);
	 				if (selectEnd != formatEventEnd){
	 					// console.log("available");
	 					
	 					parseTZStart = moment.tz(event.start,"Asia/Bangkok");
	 					eventStart = parseTZStart.format();
	 					startDB = new Date(eventStart); 					
	 					startDBHour = (startDB.getHours());
	 					
	 					parseTZEnd = moment.tz(event.end,"Asia/Bangkok");
	 					eventEnd = parseTZEnd.format();
	 					endDB = new Date(eventEnd);
	 					endDBHour = (endDB.getHours());	 					
	 					

	 					if (endRefHour > startDBHour && endRefHour < endDBHour){	 						
	 						// status = "unavailable"
	 						status.push("unavailable");
	 						console.log("Overlap end Time");
	 					}
	 					console.log("startRefHour2: " + startRefHour);
	 					if (startRefHour > startDBHour && startRefHour < endDBHour){	 						
	 						// status = "unavailable"
	 						status.push("unavailable");
	 						console.log("Overlap start Time");
	 					}

	 				} else{
	 					// status = "unavailable"
	 					status.push("unavailable");
	 					// console.log("not available");
	 				}
	 			})

		 		if (status == ""){
		 			res.json("available")
		 			console.log("send available end");
		 		}else if (status != ""){
		 			res.json("unavailable")
		 			console.log("send unavailable end");
		 		}

	 		}else{
	 			res.json("available")
	 			console.log("send available end");
	 			console.log("null")
	 		}
	 	});
	}
});

app.listen(8080);
console.log('Server runnning on port 8080');