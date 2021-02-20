firstName = ""
lastName = ""
email = ""
userName = ""
dateCreated = "" //added
ID  = 0

var contacts = []

function openHTTP(url,action){

	var xhr = new XMLHttpRequest();
	xhr.open(action,url,true);
	return xhr;
}

function login() {

    userName = $("#userName").val() //Gets user name from login username field
	var password = $("#password").val() //Gets password from login password field
	
	password = md5(password) //Hashes the password

    var jsonData = JSON.stringify({"userName" : userName , "password":  password}) //formats json to be sent over to login endpoint 

	if (userName == ""||password == "") { //User needs to provide username and password to log in
		$(".errorBar").empty();
		$(".errorBar").append("<p id = 'errorText'> Please enter a username and password</p>");
		return;
	}

	url = "http://www.cop4331group17.tech/LAMPAPI/Login.php"
	
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

		} else {

			window.location.href = "/home.html" //change here
			saveCookie(); 
			}
		}

		}
		xhr.send(jsonData); //Will send the data and when the state changes will recieve a response	
	}
    catch(err){	
		$(".errorBar").append("<p> Internal Server Error </p>" );
		}

}

function register() {

	var firstName = $("#firstName").val() // Gets the first name from register fields
	var lastName = $("#lastName").val() //Gets the last name from register fields
	var userName = $("#userName").val() //gets the username from register fields
   	var password =  $("#password").val() //gets the password from register field
	var email = $("#email").val() // gets the email from register field
	var url = "http://www.cop4331group17.tech/LAMPAPI/Register.php"

	if(userName =="" || password == "") { // Need to provide username and password

	 $(".errorBar").empty();
	 $(".errorBar").append("<p id = 'errorText'> User Name and Password are required fields </p>")
	 return;

	}

	password = md5(password) //Hashes the password for the databse

	var jsonData = JSON.stringify({"firstName":firstName,"lastName":lastName,"userName":userName , "password":  password , "email": email}) 
	
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
				
		window.location.href = "/index.html" //changed here
		}

		}
	}
		xhr.send(jsonData); //Will send the data and when the state changes will recieve a response
	}
	catch(err){


	}
}

function search() {

	var search = $("#searchbar").val() //gets the value from the search bar

	var	url = "http://www.cop4331group17.tech/LAMPAPI/search.php" 
	var jsonData = JSON.stringify({"ID":ID, "search":search})
	var xhr = openHTTP(url,"GET");
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	
	try {	
	
		xhr.onreadystatechange = function() {
			
		if(this.readyState == 4 && this.status == 200) {
			
		var JSONObject = JSON.parse(xhr.responseText); //Parses the response text, converts to javascript object
		
		 //Will send the data and when the state changes will recieve a response
		fillSearchBox(JSONObject); // fill the search boxes with the necessary information
		}
		};
		xhr.send(jsonData);	
	}	
	catch(err) {

		var errorMessage = "<h3>" + err.message + "</h3>" //Determine how to handler server erros	
		$("#contacts").append(errorMessage)
		
	}

}

function fillSearchBox(JSONObject) {

	contacts = []
	$("#contacts").empty() //Clears the information already in the contact boxes
	
	var entries = JSONObject.entries //Number of contacts returned

	if(entries == 0){ //Means there are no contacts matching the information.
		$("#contacts").append("<p> 0 results </p>")
		return;

	} 

	for(var i = 0 ; i < entries ; i++){ //Creates all the contact boxes that are shown when searched.

	var contactFirstName = JSONObject.results[i].contactFirstName
	var contactLastName = JSONObject.results[i].contactLastName

	contacts.push(JSONObject.results[i].CID)	
	var button = "<div class = 'row w-100 border border-1 border-muted h-auto p-1 g-0' onClick = showContact('" + i +"')>" +
    "<div class = 'col-4 p-0 g-0 d-flex align-items-center justify-content-center'>" +
	"<div class = 'circle'><h3>"+ contactFirstName[0] + contactLastName[0] +"</h3></div>" + "</div>" + 
	"<div class = 'col-7 d-flex flex-column justify-content-center p-0 g-0'>" +
	"<h3 style = 'padding-left:5%'>" + contactFirstName + "</h4>" +
	"<h3 style = 'padding-left:20%'>" + contactLastName + "</h4> </div>" +
	"<div class = 'col-1'>" + "</div>"
	$("#contacts").append(button)

	}

}
function createInfoBoxes(contactFirstName,contactLastName,address,phoneNumber,email,CID,dateCreated) { //Shows the contact information when clicked on

	var boxes = "<div class = 'col w-100 bg-light h-auto border border-2 border-muted' id = 'showContacts'>" +
	"<div class = 'row w-100 p-2'>" +
	"<div class = 'informationBox'>" +
	"<div class = 'titleBox'>" +
	"<h3 id = 'contactAttribute'>First</h3>" + 
	"<div class = 'd-flex w-100 justify-content-end'>" +
	"<i class='bi-pencil' onclick = 'modify(" + '"contactFirstName"' + "," + CID + ")'></i>" + "</div>" +
	"</div> " +
	"<div class = 'contactFirstName'>" +
	"<h4>" + contactFirstName + "</h4>" + "</div>" + "</div>"  + "</div>" +

	"<div class = 'row w-100 p-2'>" +
	"<div class = 'informationBox'>" +
	"<div class = 'titleBox'>" +
	"<h3 id = 'contactAttribute'>Last</h3>" + "<div class = 'd-flex w-100 justify-content-end'>" + 
	"<i class='bi-pencil' onclick = 'modify(" + '"contactLastName"' + "," + CID + ")'></i>" + "</div>" +
	"</div> " +
	"<div class = 'contactLastName'>" +
	"<h4>" + contactLastName + "</h4>" + "</div>" + "</div>" + "</div>" +

	"<div class = 'row w-100 p-2'>" +
	"<div class = 'informationBox'>" +
	"<div class = 'titleBox'>" +
	"<h3 id = 'contactAttribute'>Phone</h3>" + "<div class = 'd-flex w-100 justify-content-end'>" + 
	"<i class='bi-pencil' onclick = 'modify(" + '"phoneNumber"' + "," + CID + ")'></i>" + "</div>" +
	"</div> " +
	"<div class = 'phoneNumber'>" +
	"<h4>" + phoneNumber + "</h4>" + "</div>" + "</div>" + "</div>" +

	"<div class = 'row w-100 p-2'>" +
	"<div class = 'informationBox'>" +
	"<div class = 'titleBox'>" +
	"<h3 id = 'contactAttribute'>Address</h3>" + "<div class = 'd-flex w-100 justify-content-end'>" +
	"<i class='bi-pencil' onclick = 'modify(" + '"address"' + "," + CID + ")'></i>" + "</div>" +
	"</div> " +
	"<div class = 'address'>" +
	"<h4>" + address + "</h4>" + "</div>" + "</div>" + "</div>" +

	"<div class = 'row w-100 p-2'>" +
	"<div class = 'informationBox'>" +
	"<div class = 'titleBox'>" +
	"<h3 id = 'contactAttribute'>Email</h3>" + "<div class = 'd-flex w-100 justify-content-end'>" +
	"<i class='bi-pencil' onclick = 'modify(" + '"contactEmail"' + "," + CID + ")'></i>" + "</div>" +
	"</div> " +
	"<div class = 'contactEmail'>" +
	"<h4>"+ email + "</h4>" + "</div>" + "</div>" + "</div>" +
	"<div class = 'row w-100 p-2 g-0 d-flex flex-row'>"+
	"<div class = 'alert alert-dark w-50' role = 'alert'>Date Created: " + dateCreated + "</div>" +
	"<div id = 'deleteButton'>" +
	"<i class='bi-trash' style = 'color:red; font-size:30px' onclick = 'deleteAlertBox(" + CID + ")'></i>" +
	"</div>" 

	$(document).scrollTop($(document).height()) 
	$("#contactView").empty();
	$("#contactView").append(boxes);

}

function deleteAlertBox(CID) { //Displays the dialog box for deleting a contact

	var deleteModal = "<div class='modal fade in' id='deleteContact' tabindex='-1' role='dialog' aria-labelledby='exampleModalCenterTitle' aria-hidden='true'>"
	+ "<div class='modal-dialog modal-dialog-centered' role='document'>"
	+ "<div class='modal-content'>" 
	+ "<div class='modal-header'>" 
	+ "<h5 class='modal-title' id='exampleModalLongTitle'>Are you sure you want to delete this contact?</h5>"
	+ "<button type='button' class='close' onclick = 'closeDelete()' aria-label='Close'>" 
	  
	+ "<span aria-hidden='true'>&times;</span>" 
	+ "</button>" 
	+ "</div>" 
	+ "<div class= modal-body>"
	+ "<button type='button' class='btn btn-danger' onclick = 'deleteContact(" + CID + ")' aria-label='Close'>Delete</button>"
	+ "</div> " + "</div>" + "</div>" + "</div>"
		

	$("#mainContainer").append(deleteModal)
	$("#deleteContact").modal('show')

}


function checkEmpty(string) { //Function to see 

	if(!string) return "N/A"
	else return string

}

function showContact(contactNumber){ //Interacts with show contact endpoint to retreive necessary informatoin


	var url = "http://www.cop4331group17.tech/LAMPAPI/ShowContact.php"
	var CID = contacts[contactNumber] //Uses the array of contacts to retreive the CID of the contact clicked on .

	var jsonData= JSON.stringify({"CID":CID})

	try
	{
		var xhr = openHTTP(url,"GET")
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

		xhr.onreadystatechange = function() {

		if(this.readyState == 4 && this.status == 200) {
		
		var JSONObject = JSON.parse(xhr.responseText); //Parses the response text, converts to javascript object
		
		var contactFirstName = JSONObject.contactFirstName
		var contactLastName  = JSONObject.contactLastName
		var address = JSONObject.address
		var phoneNumber = JSONObject.phoneNumber
		var email = JSONObject.email
		var dateCreated = JSONObject.dateCreated

		contactFirstName = checkEmpty(contactFirstName)
		contactLastName = checkEmpty(contactLastName)
		contactAddress = checkEmpty(address)
		contactPhoneNumber = checkEmpty(phoneNumber)
		contactEmail = checkEmpty(email)

	
		createInfoBoxes(contactFirstName,contactLastName,address,phoneNumber,email,CID,dateCreated) //update parameters with dateCreated
		}

		}
		xhr.send(jsonData); //Will send the data and when the state changes will recieve a response
		
	}
	catch (err) {
	
	}
}

function addContact() {

	var contactFirstName = $("#contactFirstName").val()
	var contactLastName = $("#contactLastName").val()
	var address= $("#address").val()
	var phoneNumber = $("#phoneNumber").val()
	var contactEmail = $("#email").val()
	
	if(contactFirstName == "" || contactLastName == "") { //Need to provide a first and last name
		$(".errorBar").empty();
		$(".errorBar").append("<p id = 'errorText'> First Name and Last Name are required field </p>");
		return;
	}

	var jsonData = JSON.stringify({"ID":ID,"contactFirstName":contactFirstName,"contactLastName":contactLastName,"address":address,"phoneNumber":phoneNumber,"email":contactEmail})
	var url = "http://www.cop4331group17.tech/LAMPAPI/AddContact.php"

	try {

		var xhr = openHTTP(url,"POST")
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8")

		xhr.onreadystatechange = function() {

			if(this.status == 200 && this.readyState == 4){
				var JSONObject = JSON.parse(xhr.responseText);
				if(JSONObject.error == "This contact already exists."){
				$(".errorBar").empty();
				$(".errorBar").append("<p id = 'errorText'> This contact already exists. </p>")
				return;
				}
				else $('#add').modal('hide')
			}
		}
		xhr.send(jsonData)
	}
	catch(err){

	}
		
}

function modify(field,CID) { //Replaces the paragraph for show contact

	var fieldName = "." + field //Gets the field needed to be changed
	var fieldText = field +"text" //For the text box
	$(fieldName).empty()
	var input = "<div class='input-group mb-1'>" + "<input type='text' class='form-control' id = '"+ fieldText + "' onchange = update('"+field+"','"+CID+"') aria-describedby='inputGroup-sizing-default'>"
	"</div>"

	$(fieldName).append(input)	
}

function modifySettings(field) { //Replaces the paragraph for settings

	var fieldName = "." + field
	var fieldText = field +"textSettings"
	$(fieldName).empty()
	var input = "<div class='input-group mb-1'>" + "<input type='text' class='form-control' id = '"+ fieldText + "' onchange = settings('" + field + "') aria-describedby='inputGroup-sizing-default'>"
	 + "</div>"

	$(fieldName).append(input)	
}

function update(fieldName,CID){ //For updating the contact 

		var field = "." + fieldName
		var updateField = "#" + fieldName + "text"
		var updateValue = $(updateField).val()
	
		var url = "http://www.cop4331group17.tech/LAMPAPI/UpdateContact.php"

		if(fieldName == "contactEmail") fieldName = "email"
		var jsonData = JSON.stringify({"CID":CID,"field":fieldName,"value":updateValue,"ID":ID})
		
		try {

		xhr = openHTTP(url,"PATCH")
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8")
		xhr.onreadystatechange = function() {

			if(this.status == 200 && this.readyState == 4){
			var JSONObject = JSON.parse(xhr.responseText)
			if(JSONObject.err == "Update Success.") return
			}

		}
		xhr.send(jsonData)

		}	
		catch(err) {
			
			return;
		}

		$(field).empty()
		$(field).append("<h4 id = " + field + " > " + updateValue + " </h4>")
		
}

function deleteUser(){

	var url = "http://www.cop4331group17.tech/LAMPAPI/DeleteAccount.php"
	var jsonData = JSON.stringify({"ID":ID})

	try {
		
		xhr = openHTTP(url,"DELETE")
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8")

		xhr.onreadystatechange = function() {

			if(this.status == 200 && this.readyState == 4){
				window.location.href = "/index.html"
			}
		}
		xhr.send(jsonData)
		}	
		catch(err) {
			console.log(err.message) //otherwise output error
		}
}

function deleteContact(CID){

	$("#mainContaner").remove("#deleteContact")
	
	var url = "http://www.cop4331group17.tech/LAMPAPI/DeleteContact.php"

	var jsonData = JSON.stringify({"CID":CID})

	try {

		xhr = openHTTP(url,"DELETE")
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8")

		xhr.onreadystatechange = function() {

			if(this.status == 200 && this.readyState == 4){

			window.location.reload();	
			}
		}
		xhr.send(jsonData)
		}	
		catch(err) {

		console.log(err.message) //otherwise output error
		}

}


function settings(fieldName) { //updates the user settings.

	var field = "." + fieldName
	var updateField = "#" + fieldName + "textSettings"
	var updateValue = $(updateField).val()

	if(fieldName == "password") {
		updateValue = md5(updateValue)
	}
	
	var url = "http://www.cop4331group17.tech/LAMPAPI/UpdateUser.php"

	var jsonData = JSON.stringify({"ID":ID,"field":fieldName,"value":updateValue})


	try {

		xhr = openHTTP(url,"PATCH")
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8")
		xhr.onreadystatechange = function() {

			if(this.status == 200 && this.readyState == 4){
			var JSONObject = JSON.parse(xhr.responseText);

			if(JSONObject.error == "That username already exists!"){
				$(".userName").append("<p id = 'errorText'>Username already exists</p>");
				return;
			} 

			if(JSONObject.error == "Update Success.") return;
			}
		}

		xhr.send(jsonData)
		}	
		catch(err) {
			console.log(err.message) //otherwise output error
			return;
		}

		$(field).empty()

		if(fieldName == "password"){
			$(field).append("<button type='button' class='btn btn-primary' onclick = modifySettings(" + '"password"' +")>Change Password</button></div><br></br>")
			return;
		}
		$(field).append("<p id = " + field + " > " + updateValue + " </p>")


}
	
function saveCookie(){ //Need to save cookies so if user refreshes page they are still remembered

	var minutes = 20; //The time to save cookie
	var date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
    document.cookie = "userName=" + userName + ",ID=" + ID + ";expires=" + date.toGMTString();
    
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
		if( tokens[0] == "userName" )
		{
			userName = tokens[1];
		}
		else if( tokens[0] == "ID" )
		{
			ID = parseInt( tokens[1].trim() );
		}
	}
	if( ID < 0 )
	{
		window.location.href = "/index.html";
	}

	gettingStarted(userName)
	
}

function searchAll(){

	$("#searchbar").val("");
	search();
}

//Following code is for the modals

function addModal() {

	$(".errorBar").empty();
	$('#add').modal('show')
}

function closeAdd() {

	$('#add').modal('hide')
}

function closeDelete() {

	$('#deleteContact').modal('hide')
}

function settingsModal() {

	$('#settings').modal('show')
	showUser()
}

function closeModal() {

	$('#settings').modal('hide')
}


//For changing user information
function changeSettings() {

	var boxes = "<div class = 'row w-100 p-3'>" +
	"<div class = 'informationBox'>" +
	"<div class = 'titleBox'>" +
	"<h3 id = 'contactAttribute'>Username</h3>" + "<div class = 'd-flex w-100 justify-content-end'>" +
	"<i class='bi-pencil' onclick = 'modifySettings(" + '"userName"' +")'></i>" + "</div>" +
	"</div> " +
	"<div class = 'userName'>" +
	"<p>" + userName + "</p>" + "</div>" + "</div>"  + "</div>" +

	"<div class = 'row w-100 p-3'>" +
	"<div class = 'informationBox'>" +
	"<div class = 'titleBox'>" +
	"<h3 id = 'contactAttribute'>First</h3>" + "<div class = 'd-flex w-100 justify-content-end'>" + 
	"<i class='bi-pencil' onclick = 'modifySettings(" + '"firstName"' +")'></i>" + "</div>" +
	"</div> " +
    "<div class = 'firstName'>" +
	"<p>" + firstName + "</p>" + "</div>" + "</div>" + "</div>" +


	"<div class = 'row w-100 p-3'>" +
	"<div class = 'informationBox'>" +
	"<div class = 'titleBox'>" +
	"<h3 id = 'contactAttribute'>Last</h3>" + "<div class = 'd-flex w-100 justify-content-end'>" +
	"<i class='bi-pencil' onclick = 'modifySettings(" + '"lastName"' + ")'></i>" + "</div>" +
	"</div> " +
	"<div class = 'lastName'>" +
	"<p>" + lastName + "</p>" + "</div>" + "</div>" + "</div>" +

	"<div class = 'row w-100 p-3'>" +
	"<div class = 'informationBox'>" +
	"<div class = 'titleBox'>" +
	"<h3 id = 'contactAttribute'>Email</h3>" + "<div class = 'd-flex w-100 justify-content-end'>" +
	"<i class='bi-pencil' onclick = 'modifySettings(" + '"email"' +")'></i>" + "</div>" +
	"</div> " +
	"<div class = 'email'>" +
	"<p>"+ email + "</p>" + "</div>" + "</div>" + "</div>" +
	    
	//Change made here
	"<div class = 'alert alert-dark' role = 'alert'>Date Created: " + dateCreated + "</div>" +

	"<div class = 'password'>" +
	"<button type='button' class='btn btn-primary' onclick = modifySettings(" + '"password"' +")>Change Password</button>" + "</div><br></br>"
	+ "<button type='button' class='btn btn-danger' onclick = deleteUser()>Delete Account</button>"
		
	$("#settingsModal").empty();
	$("#settingsModal").append(boxes);

}

function showUser() {

	var url = "http://www.cop4331group17.tech/LAMPAPI/ShowUser.php"

	var jsonData= JSON.stringify({"ID":ID})

	try
	{
		var xhr = openHTTP(url,"POST")
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

		xhr.onreadystatechange = function() {

		if(this.readyState == 4 && this.status == 200) {
		
		var JSONObject = JSON.parse(xhr.responseText); //Parses the response text, converts to javascript object
		
		firstName = JSONObject.firstName
		lastName  = JSONObject.lastName
		address = JSONObject.address
		userName = JSONObject.userName
		email = JSONObject.email
		dateCreated = JSONObject.dateCreated //added

		firstName = checkEmpty(firstName)
		lastName = checkEmpty(lastName)
		address = checkEmpty(address)
		phoneNumber = checkEmpty(phoneNumber)
		email = checkEmpty(email)
		dateCreated = checkEmpty(dateCreated) //added

		changeSettings()
		}
		}
		xhr.send(jsonData); //Will send the data and when the state changes will recieve a response
		
	}
	catch (err) {
		console.log(err.message)
	}

}


function gettingStarted(userName){

	var box = "<div class = 'col-10 bg-light h-100 border border-2 border-muted rounded-3 shadow-lg bg-white rounded p-2'>" 
	+ "<h1 style id = 'startPageTitle' style = 'text-align:center'> Welcome, " + userName + "!</h1>"
	
	+ "<div class = 'row w-100 p-1'>"
	+ "<p id ='startPageGuide'>Today's Date</p>"
	+ "</div>"


    + "<div class='datetime'>"
   	 + "<div class='date'>"
         + "<span id ='day'>Day</span>, "
		+ "<script> var dt = new Date(); var temp = dt.getDay(); var week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']; document.getElementById('day').innerHTML = week[temp]; </script>"
         + "<span id='month'>Month</span> "
		+ "<script> var dt = new Date(); var temp = dt.getMonth(); var month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']; document.getElementById('month').innerHTML = month[temp]; </script>"
         + "<span id='daynum'>00</span>, "
		+ "<script> var dt = new Date(); document.getElementById('daynum').innerHTML = dt.getDate(); </script>"
         + "<span id='year'>Year</span> "
		+ "<script> var dt = new Date(); document.getElementById('year').innerHTML = dt.getFullYear(); </script>"
    + "</div>"
	
    +"<div class='time'>"
        + "<span id='hour'>00</span>: "	
        + "<span id='minutes'>00</span>: "
        + "<span id='seconds'>00</span> "
        + "<span id='period'>AM</span> "
		+ "<script> var dt = new Date(); var hr = dt.getHours(), pe = 'AM', min = dt.getMinutes() ; if(hr == 0){ hr = 12;} if(hr > 12){ hr = hr - 12; pe='PM';} document.getElementById('hour').innerHTML = hr; document.getElementById('minutes').innerHTML= min; document.getElementById('seconds').innerHTML = dt.getSeconds(); document.getElementById('period').innerHTML = pe; </script>"
    +"</div>"
	+"</div>"
    + "</div>"


	$("#contactView").append(box)


}
