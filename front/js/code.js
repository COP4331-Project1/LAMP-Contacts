firstName = ""
lastName = ""
ID  = 0
var contacts = []

function openHTTP(url,action){

	var xhr = new XMLHttpRequest();
	xhr.open(action,url,true);
	return xhr;
}

function login() {

    var userName = $("#userName").val() //gets the username and password from the input field
    var password = $("#password").val()

    var jsonData = JSON.stringify({"userName" : userName , "password":  password}) //Json is formatted in key value pairs

	if (userName == ""||password == "") {
		$(".errorBar").empty();
		$(".errorBar").append("<p id = 'errorText'> Please enter a username and password</p>");
		return;
	}
	url = "http://159.203.70.233/LAMPAPI/Login.php"
	
  	try {
		var xhr = openHTTP(url,"POST")
	    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

		xhr.onreadystatechange = function() {

		if(this.readyState == 4 && this.status == 200) {
		
		var jsonObject = JSON.parse(xhr.responseText); //Parses the response text, converts to javascript object
		
		ID = jsonObject.ID; //Gets the user ID form the databsae
		
		if( ID < 1 ) //Represents an error 
		{		
			$(".errorBar").empty();
			$(".errorBar").append("<p id = 'errorText'> Incorrect Username/Password </p>");
			return;
		} else{
			firstName = jsonObject.firstName; //Gets the first name
			lastName = jsonObject.lastName;
			window.location.href = "../html/home.html"
			saveCookie(); //have firstName last name saved in scope.
		}
		}
		}
		xhr.send(jsonData); //Will send the data and when the state changes will recieve a response	
	}
    catch(err)
		{	
	
		$(".errorBar").append("<p> Internal Server Error </p>" );
		}

}

function register() {

	var firstName = $("#firstName").val()
	var lastName = $("#lastName").val()
	var userName = $("#userName").val() //gets the username and password from the input field
    var password =  $("#password").val()
	var email = $("#email").val()
	var url = "http://159.203.70.233/LAMPAPI/Register.php"

	if(userName =="" || password == "") {

	 $(".errorBar").empty();
	 $(".errorBar").append("<p id = 'errorText'> User Name and Password are required fields </p>")
	 return;

	}
	var jsonData = JSON.stringify({"firstName":firstName,"lastName":lastName,"userName":userName , "password":  password , "email": email}) //Json 
	
	try {

		var xhr = openHTTP(url,"POST")
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
		xhr.onreadystatechange = function() {
		if(this.readyState == 4 && this.status == 200) {

		var jsonObject = JSON.parse(xhr.responseText); 

		if(jsonObject.error == "This username already exists, try another one."){
		$(".errorBar").empty();	
		$(".errorBar").append("<p id = 'errorText'>" + jsonObject.error + "</p>")
		return;
		}
		else {
		window.location.href = "../html/index.html"
		}

		}
	}
		xhr.send(jsonData); //Will send the data and when the state changes will recieve a response
	}
	catch(err){
		console.log(err.message)
	}
}

function search() {

	var search = $("#searchbar").val() //gets the value from the search bar

	var	url = "http://159.203.70.233/LAMPAPI/search.php"
	var jsonData = JSON.stringify({"ID":ID, "search":search})
	var xhr = openHTTP(url,"POST");
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	
	try {	
	
		xhr.onreadystatechange = function() {
			
		if(this.readyState == 4 && this.status == 200) {
			
		var JSONObject = JSON.parse(xhr.responseText); //Parses the response text, converts to javascript object
		
		 //Will send the data and when the state changes will recieve a response
		fillSearchBox(JSONObject);
		}
		};
		xhr.send(jsonData);	
	}	
	catch(err) {

		var errorMessage = "<h3>" + err.message + "</h3>"
		console.log(errorMessage)		
		$("#contacts").append(errorMessage)
		
	}

}

function fillSearchBox(JSONObject) {

	contacts = []
	$("#contacts").empty()
	
	var entries = JSONObject.entries

	if(entries == 0){
		$("#contacts").append("<p> 0 results </p>")
		return;

	} 

	for(var i = 0 ; i < entries ; i++){
	var contactFirstName = JSONObject.results[i].contactFirstName
	var contactLastName = JSONObject.results[i].contactLastName
	contacts.push(JSONObject.results[i].CID)	
	var button = "<div class = 'row w-100 border border-1 border-primary h-auto p-1 g-0' onClick = showContact('" + i +"')>" +
    "<div class = 'col-4 p-0 g-0 d-flex align-items-center justify-content-center'>" +
	"<div class = 'circle'><h3>"+ contactFirstName[0] + contactLastName[0] +"</h3></div>" + "</div>" + 
	"<div class = 'col-7 d-flex flex-column justify-content-center p-0 g-0'>" +
	"<h3 style = 'padding-left:5%'>" + contactFirstName + "</h4>" +
	"<h3 style = 'padding-left:20%'>" + contactLastName + "</h4> </div>" +
	"<div class = 'col-1'>" + "</div>"
	$("#contacts").append(button)
	}

}
function createInfoBoxes(contactFirstName,contactLastName,address,phoneNumber,email,CID) {

	var boxes = "<div class = 'col w-100 bg-light h-100 border border-2 border-primary rounded-3' id = 'showContacts'>" +
	"<div class = 'row w-100 p-3'>" +
	"<div class = 'informationBox'>" +
	  "<div class = 'titleBox'>" +
		"<h3 id = 'contactAttribute'>First</h3>" + "<div class = 'd-flex w-100 justify-content-end'>" +
		"<i class='bi-pencil' onclick = 'modify(" + '"contactFirstName"' + "," + CID + ")'></i>" + "</div>" +
	"</div> " +
	  "<div class = 'contactFirstName'>" +
	  "<p>" + contactFirstName + "</p>" + "</div>" + "</div>"  + "</div>" +

	  "<div class = 'row w-100 p-3'>" +
	  "<div class = 'informationBox'>" +
		"<div class = 'titleBox'>" +
		  "<h3 id = 'contactAttribute'>Last</h3>" + "<div class = 'd-flex w-100 justify-content-end'>" + 
		  "<i class='bi-pencil' onclick = 'modify(" + '"contactLastName"' + "," + CID + ")'></i>" + "</div>" +
	"</div> " +
		"<div class = 'contactLastName'>" +
		"<p>" + contactLastName + "</p>" + "</div>" + "</div>" + "</div>" +

		"<div class = 'row w-100 p-3'>" +
	"<div class = 'informationBox'>" +
	  "<div class = 'titleBox'>" +
		"<h3 id = 'contactAttribute'>Phone</h3>" + "<div class = 'd-flex w-100 justify-content-end'>" + 
		"<i class='bi-pencil' onclick = 'modify(" + '"phoneNumber"' + "," + CID + ")'></i>" + "</div>" +
	 "</div> " +
	  "<div class = 'phoneNumber'>" +
	  "<p>" + phoneNumber + "</p>" + "</div>" + "</div>" + "</div>" +

	  "<div class = 'row w-100 p-3'>" +
	  "<div class = 'informationBox'>" +
		"<div class = 'titleBox'>" +
		  "<h3 id = 'contactAttribute'>Address</h3>" + "<div class = 'd-flex w-100 justify-content-end'>" +
		  "<i class='bi-pencil' onclick = 'modify(" + '"address"' + "," + CID + ")'></i>" + "</div>" +
	   "</div> " +
		"<div class = 'address'>" +
		"<p>" + address + "</p>" + "</div>" + "</div>" + "</div>" +

		"<div class = 'row w-100 p-3'>" +
		"<div class = 'informationBox'>" +
		  "<div class = 'titleBox'>" +
			"<h3 id = 'contactAttribute'>Email</h3>" + "<div class = 'd-flex w-100 justify-content-end'>" +
			"<i class='bi-pencil' onclick = 'modify(" + '"email"' + "," + CID + ")'></i>" + "</div>" +
		 "</div> " +
		  "<div class = 'email'>" +
		  "<p>"+ email + "</p>" + "</div>" + "</div>" + "</div>" +
		"<div class = 'row w-100 p-2'>"+
			"<div id = 'deleteButton'>" +
			"<i class='bi-trash' style = 'color:red; font-size:30px' onclick = 'deleteContact(" + CID +")'></i>" +
			"</div>" + "</div>"

			$("#contactView").empty();
			$("#contactView").append(boxes);

}

function showContact(contactNumber){


	var url = "http://159.203.70.233/LAMPAPI/ShowContact.php"
	var CID = contacts[contactNumber]

	var jsonData= JSON.stringify({"CID":CID})

	try
	{
		var xhr = openHTTP(url,"POST")
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

		xhr.onreadystatechange = function() {

		if(this.readyState == 4 && this.status == 200) {
		
		var JSONObject = JSON.parse(xhr.responseText); //Parses the response text, converts to javascript object
		
		var contactFirstName = JSONObject.contactFirstName
		var contactLastName  = JSONObject.contactLastName
		var contactAddress = JSONObject.address
		var contactPhoneNumber = JSONObject.phoneNumber
		var contactEmail = JSONObject.email
		createInfoBoxes(contactFirstName,contactLastName,contactAddress,contactPhoneNumber,contactEmail,CID)
		}
	}
		xhr.send(jsonData); //Will send the data and when the state changes will recieve a response
		
	}
	catch (err) {
		console.log(err.message)
	}
}

function addContact() {

	var contactFirstName = $("#contactFirstName").val()
	var contactLastName = $("#contactLastName").val()
	var address= $("#address").val()
	var phoneNumber = $("#phoneNumber").val()
	var contactEmail = $("#email").val()


	if(contactFirstName == "") {
		$(".errorBar").empty();
		$(".errorBar").append("<p id = 'errorText'> First Name is Required </p>");
		return;
	}

	var jsonData = JSON.stringify({"ID":ID,"contactFirstName":contactFirstName,"contactLastName":contactLastName,"address":address,"phoneNumber":phoneNumber,"email":contactEmail})
	url = "http://159.203.70.233/LAMPAPI/AddContact.php"

	try {

		var xhr = openHTTP(url,"POST")
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8")

		xhr.onreadystatechange = function() {

			if(this.status == 200 && this.readyState == 4){
				var JSONObject = JSON.parse(xhr.responseText);
				if(JSONObject.err = "This contact already exists.");
				$(".errorBar").empty();
				$(".errorBar").append("<p id = 'errorText'> This contact already exists. </p>");

				return;
			}
		}
		xhr.send(jsonData)
	}
	catch(err){

		console.log(err.message)
	}

	$('.modal').modal('hide')
		
}

function modify(field,CID) { //Just to replace the textvalue

	var fieldName = "." + field
	var fieldText = field +"text"
	$(fieldName).empty()
	var input = "<div class='input-group mb-1'>" + "<input type='text' class='form-control' id = '"+ fieldText + "' onchange = update('" + field + "','" + CID + "') aria-describedby='inputGroup-sizing-default'>" +
	"</div>"

	$(fieldName).append(input)
	console.log("Test")
	
}

function update(fieldName,CID){ //For updating the contact 

		var field = "." + fieldName
		var updateField = "#" + fieldName + "text"
		var updateValue = $(updateField).val()
	
		var url = "http://159.203.70.233/LAMPAPI/UpdateContact.php"

		var jsonData = JSON.stringify({"CID":CID,"field":fieldName,"value":updateValue})
		
		try {

		xhr = openHTTP(url,"POST")
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8")
		xhr.onreadystatechange = function() {

			if(this.status == 200 && this.readyState == 4){
			var JSONObject = JSON.parse(xhr.responseText);
			if(JSONObject.err == "Update Success.") return;
			}
		}
		xhr.send(jsonData)
		}	
		catch(err) {
			console.log(err.message) //otherwise output error
			return;
		}

		$(field).empty()
		$(field).append("<p id = " + field + " > " + updateValue + " </p>")
		
}


function deleteUser(){

	var url = "http://159.203.70.233/LAMPAPI/DeleteAccount.php"
	var jsonData = JSON.stringify({"ID":ID})

	try {
		
		xhr = openHTTP(url,"POST")
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8")

		xhr.onreadystatechange = function() {

			if(this.status == 200 && this.readyState == 4){

				window.location.href = "../html/index.html"
			}
		}
		xhr.send(jsonData)
		}	

		catch(err) {
			console.log(err.message) //otherwise output error
		}
}

function deleteContact(CID){

	var url = "http://159.203.70.233/LAMPAPI/DeleteContact.php"

	var jsonData = JSON.stringify({"CID":CID})

	try {

		xhr = openHTTP(url,"POST")
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8")

		xhr.onreadystatechange = function() {

			if(this.status == 200 && this.readyState == 4){

			}
		}
		xhr.send(jsonData)
		}	

		catch(err) {

		console.log(err.message) //otherwise output error
		}

}


function settings() {
	var firstName = $("#firstName").val()
	var lastName = $("#lastName").val()
	var userName = $("#userName").val()
	var password = $("#password").val()
	var email = $("#email").val()
	//var hash = md5(password); //do we need to re-hash?

	var url = "http://159.203.70.233/LAMPAPI/UpdateUser.php"

//	var jsonData = '{"first": "'+first+'", "last:" "'+last+'", "user:" "'+user+'", "password:" "'+hash+'", "email:" "'+email+'" }';
//	var dat = {firstName: firstName, lastName: lastName, userName: userName, email: email, password: password};
//	var jsonData = JSON.stringify(dat);

    	var jsonData = JSON.stringify({"firstName": firstName, "lastName": lastName, "userName" : userName , "password":  password, "email": email})

	//in case it doesnt work
	alert(jsonData);

	try {

		xhr = openHTTP(url,"POST")
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8")

		xhr.onreadystatechange = function() {

			if(this.status == 200 && this.readyState == 4){
				window.location("index.html");
			}
		}
		xhr.send(jsonData)
		}

		catch(err) {

		console.log(err.message) //otherwise output error
		}
}
	
function saveCookie(){ //Need to save cookies so if user refreshes page they are still remembered

	var minutes = 20; //The time to save cookie
	var date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
    document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",ID=" + ID + ";expires=" + date.toGMTString();
    
    //Saves the cookie to keep track of the user
}

function readCookie()
{
	ID = -1;
	var data = document.cookie;
	var splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		var thisOne = splits[i].trim();
		var tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "ID" )
		{
			ID = parseInt( tokens[1].trim() );
		}
	}
	if( ID < 0 )
	{
		window.location.href = "index.html";
	}
	
}

function searchAll(){

	$("#searchbar").val("");
	search();
}

function addModal() {

	$('#add').modal('show')
}

function closeAdd() {

	$('#add').modal('hide')
}


function settingsModal() {

	$('#settings').modal('show')
}

function closeModal() {

	$('#settings').modal('hide')
}


/*
function changeSettings() {



	$("#changeUserName").
	$("#changePassWord").
	$("#changeEmail").

}

function displaySettings() {

	#("#userName")
	#("#passWord")



}
*/
