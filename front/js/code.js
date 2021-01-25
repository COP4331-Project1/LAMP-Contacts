firstName = ""
lastName = ""
userId  = 0
var contacts = []

function openHTTP(url,action){

	var xhr = new XMLHttpRequest();
	xhr.open(action,url,true);
	return xhr;
}

function login() {

    var username = $("#loginName").val() //gets the username and password from the input field
    var password = $("#loginPassword").val()

    var jsonData = JSON.stringify({"userName" : username , "password":  password}) //Json is formatted in key value pairs

    url = "http://159.203.70.233/LAMPAPI/Login.php"


  	try {
		var xhr = openHTTP(url,"POST")
	        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

		var xhr = openHTTP(url,"POST")
	    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

		xhr.onreadystatechange = function() {

		if(this.readyState == 4 && this.status == 200) {
		
		var jsonObject = JSON.parse(xhr.responseText); //Parses the response text, converts to javascript object
		
		userId = jsonObject.ID; //Gets the user ID form the databsae
		
		if( userId < 1 ) //Represents an error 
		{
			$("#loginInput").append("<p> User/Password combination incorrect </p>");
			return;
		}	
		console.log(userId)
		firstName = jsonObject.firstName; //Gets the first name
		lastName = jsonObject.lastName;
		window.location.href = "../html/home.html"
		saveCookie(); //have firstName last name saved in scope.
		}
	}

	xhr.send(jsonData); //Will send the data and when the state changes will recieve a response	
	}
    catch(err)
	{
		console.log(err.message)
		$("#loginInput").append("<p>" + err.message + '</p>')  
	}

}

function register() {

	var firstName = "Ryan";
	var lastName = "Pattillo";
	var userName = $("#userName").val() //gets the username and password from the input field
    var password =  $("#password").val()
	var email = $("#email").val()
	var url = "http://159.203.70.233/LAMPAPI/Register.php"

	var jsonData = JSON.stringify({"firstName":firstName,"lastName":lastName,"userName":userName , "password":  password , "email": email}) //Json 
	
	try {

		var xhr = openHttp(url,"POST")
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
		xhr.onreadystatechange = function() {
		if(this.readyState == 4 && this.status == 200) {

	
		}
		xhr.send(jsonData); //Will send the data and when the state changes will recieve a response
		}

	}
	catch(err){
		console.log(err.message)
	}
}


function search() {

	var search = $("#searchbar").val() //gets the value from the search bar
	var	url = "http://159.203.70.233/LAMPAPI/search.php"
	var jsonData = JSON.stringify({"userId":userId, "search":search})
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

	for(var i = 0 ; i < entries ; i++){
	var contactFirstName = JSONObject.results[i].contactFirstName
	var contactLastName = JSONObject.results[i].contactLastName
	contacts.push(JSONObject.results[i].contactID)	
	var button = "<button type = 'button' class = 'btn btn-primary btn-sm bg-light text-dark' id = 'contact' onClick = showContact('" + contactFirstName + "','" + contactLastName + "','" + i +"') style = 'width:100%'> " +
    "<div class = 'd-flex justify-content-inline' id = 'flexFormat'>" +
	"<div class = 'circle'><h4>"+ contactFirstName[0] + contactLastName[0] +"</h4></div>" +
	"<div class = 'd-flex flex-column' id = 'flexFormatColumn'>" +
	"<h2 style = 'padding-left:5%'>" + contactFirstName + "</h2>" +
	"<h3 style = 'padding-left:20%'>" + contactLastName + "</h3> </div></div></button>" 

	$("#contacts").append(button)
	}

}

function createInfoBoxes() {

	var contactFirstName = "test"
	var contactLastName = "test"
	var contactAddress= "test"
	var contactPhoneNumber = "test"
	var contactEmail = "test"


	var boxes =    "<div class = 'container w-100 bg-light h-100 border border-2 border-primary rounded-3' id = 'showContacts'>" +
	"<div class = 'row w-100 p-3'>" +
	"<div class = 'informationBox'>" +
	  "<span class = 'titleBox'>" +
		"<h3 id = 'contactAttribute'>First</h3>" + "<div class = 'd-flex justify-content-end'>" +
		"<i class='bi-pencil' onclick = 'modify(" + '"contactFirstName"' + ")'></i>" + "</div"> +
	"</span> " +
	  "<div class = 'contactFirstName'>" +
	  "<p>" + contactFirstName + "</p>" + "</div>" + "</div>"  +

	  "<div class = 'row w-100 p-3'>" +
	  "<div class = 'informationBox'>" +
		"<span class = 'titleBox'>" +
		  "<h3 id = 'contactAttribute'>Last</h3>" + "<div class = 'd-flex justify-content-end'>" + 
		  "<i class='bi-pencil' onclick = 'modify(" + '"contactLastName"' + ")'></i>" + "</div"> +
	"</span> " +
		"<div class = 'contactLastName'>" +
		"<p>" + contactLastName + "</p>" + "</div>" + "</div>" + "</div>" +

		"<div class = 'row w-100 p-3'>" +
	"<div class = 'informationBox'>" +
	  "<span class = 'titleBox'>" +
		"<h3 id = 'contactAttribute'>Phone</h3>" + "<div class = 'd-flex justify-content-end'>" + 
		"<i class='bi-pencil' onclick = 'modify(" + '"contactPhoneNumber"' + ")'></i>" + "</div"> +
	 "</span> " +
	  "<div class = 'contactPhoneNumber'>" +
	  "<p>" +contactPhoneNumber + "</p>" + "</div>" + "</div>" + "</div>" +

	  "<div class = 'row w-100 p-3'>" +
	  "<div class = 'informationBox'>" +
		"<span class = 'titleBox'>" +
		  "<h3 id = 'contactAttribute'>Address</h3>" + "<div class = 'd-flex justify-content-end'>" +
		  "<i class='bi-pencil' onclick = 'modify(" + '"contactAddress"' + ")'></i>" + "</div"> +
	   "</span> " +
		"<div class = 'contactAddress'>" +
		"<p>" + contactAddress + "</p>" + "</div>" + "</div>" + "</div>" +

		"<div class = 'row w-100 p-3'>" +
		"<div class = 'informationBox'>" +
		  "<span class = 'titleBox'>" +
			"<h3 id = 'contactAttribute'>Email</h3>" + "<div class = 'd-flex justify-content-end'>" +
			"<i class='bi-pencil' onclick = 'modify(" + '"contactEmail"' + ")'></i>" + "</div"> +
		 "</span> " +
		  "<div class = 'contactEmail'>" +
		  "<p>"+ contactEmail + "</p>" + "</div>" + "</div>" + "</div>" +
		"<div class = 'row w-100 p-2'>"+
			"<div id = 'deleteButton'>" +
			"<i class='bi-trash' style = 'color:red; font-size:30px' onclick = 'deleteContact(" + contactEmail +")'></i>" +
			"</div>" + "</div>"

			$("#contactView").empty();
			$("#contactView").append(boxes);

}

function showContact(contactFirstName,contactLastName,contactNumber){


	createInfoBoxes();
	var url = "http://159.203.70.233/LAMPAPI/showContact.php"
	var contactId = contacts[contactNumber]

	var jsonData= JSON.stringify({"contactId":contactId})

	try
	{
		var xhr = openHTTP(url,"POST")
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

		xhr.onreadystatechange = function() {

		if(this.readyState == 4 && this.status == 200) {
		
		var JSONObject = JSON.parse(xhr.responseText); //Parses the response text, converts to javascript object
		
		var contactAddress = JSONObject.contactAddress
		var contactPhoneNumber = JSONObject.contactPhoneNumber
		var contactEmail = JSONObject.contactEmail
		}
		xhr.send(jsonData); //Will send the data and when the state changes will recieve a response
		}

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

	var jsonData = JSON.stringify({"contactFirstName":contactFirstName,"contactLastName":contactLastName,"address":address,"phoneNumber":phoneNumber,"contactEmail":contactEmail})
	url = "http://159.203.70.233/LAMPAPI/addContact.php"

	try {

		var xhr = openHTTP(url,"POST")
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8")

		xhr.onreadystatechange = function() {

			if(this.status == 200 && this.readyState == 4){

					$().append("Has been added")
					//Contact was added , 

			}
		}
		xhr.send(jsonData)

	}
	catch(err){

		console.log(err.message)
	}
		
}

function update(value){ //For updating the contact 

		var element = "." + value
		var update = "#" + value + "text"
		console.log(element)
		var updateValue = $(update).val()
		console.log(updateValue)
		
		var url = "http://159.203.70.233/LAMPAPI/showContact.php"

		var jsonData = JSON.stringify({value: updateValue })

		try {
		xhr = openHTTP(url,"POST")
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8")

		xhr.onreadystatechange = function() {

			if(this.status == 200 && this.readyState == 4){

			//Output update succsessful 
			}
		}
		xhr.send(jsonData)
		}	

		catch(err) {

			console.log(err.message) //otherwise output error
		}

		$(element).empty()
		$(element).append("<p id = " + value + " > " + updateValue + " </p>")
		console.log(update)
	
}

function deleteContact(contactNumber){

	contactId = contacts[contactNumber]

	var url = "http://159.203.70.233/LAMPAPI/deleteContact.php"

	var jsonData = JSON.stringify({"CID":contactID})

	try {

		xhr = openHTTP(url,"POST")
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8")

		xhr.onreadystatechange = function() {

			if(this.status == 200 && this.readyState == 4){

			console.log("Deleted")
			}
		}
		xhr.send(jsonData)
		}	

		catch(err) {

			console.log(err.message) //otherwise output error
		}


	var search = $("#searchBar").val()
	$("#searchBar").val(search)

}

	
function modify(value) { //Just to replace the textvalue

		var element = "." + value
		var textId = value +"text"
		
		$(element).empty()
		
		var input = "<div class='input-group mb-1'>" + "<input type='text' class='form-control' id = '"+ textId + "' onchange = update('" + value + "') aria-describedby='inputGroup-sizing-default'>" +
		"</div>"
  
		$(element).append(input)
		console.log("Test")
		
	}

function saveCookie(){ //Need to save cookies so if user refreshes page they are still remembered

	var minutes = 20; //The time to save cookie
	var date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
    document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
    
    //Saves the cookie to keep track of the user
}

function readCookie()
{
	userId = -1;
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
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	
}
