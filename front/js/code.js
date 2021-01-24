firstName = ""
lastName = ""
userId  = 0
var contacts = []

function openHTTP(url,action){

	var xhr = new XMLHttpRequest()
	xhr.open(action,url,true)
	return xhr
}

function login() {

    var username = $(".username").val() //gets the username and password from the input field
    var password = $(".password").val()

    var jsonData = JSON.stringify({"username" : username , "password":  password}) //Json is formatted in key value pairs

    url = "http://159.203.70.233/LAMPAPI/Login.php"

	var xhr = openHTTP(url,"POST")
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  	try {

		xhr.onreadystatechange = function() {

		if(this.readyState == 4 && this.status == 200) {
		
		var jsonObject = JSON.parse(xhr.responseText); //Parses the response text, converts to javascript object
		
		userId = jsonObject.id; //Gets the user ID form the databsae
		
		if( userId < 1 ) //Represents an error 
		{
			$("#loginInput").append("<p> User/Password combination incorrect </p>");
			return;
		}	

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

	var registerUsername = $(".registerUsername").val() //gets the username and password from the input field
    var registerPassword = $(".registerPassword").val()

	var jsonData = JSON.stringify({"username" : registerUsername , "password":  registerPassword}) //Json 
	
	try {

		var xhr = openHttp(url,"POST")
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
		xhr.onreadystatechange = function() {

		if(this.readyState == 4 && this.status == 200) {
		
		window.location.href = "index.html"

		}
		xhr.send(jsonData); //Will send the data and when the state changes will recieve a response
		}

	}
	catch(err){
		console.log(err.message)
	}
}


function search() {

	contacts = [] //hold the returned contacts

	var contactSearch = $("#searchbar").val() //gets the value from the search bar

	var	url = "http://159.203.70.233/LAMPAPI/search.php"

	var xhr = openHTTP(url,"POST")
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	var jsonData = JSON.stringify({"contactSearch":contactSearch})

	try {
		
	
		xhr.onreadystatechange = function() {
	
		if(this.readyState == 4 && this.status == 200) {
			
		var JSONObject = JSON.parse(xhr.responseText); //Parses the response text, converts to javascript object
		 //Will send the data and when the state changes will recieve a response
		console.log("No Error");
		fillSearchBox(JSONObject);

		}

		console.log("Test");
		xhr.send(jsonData)
		}
	}	
	catch(err) {
		var errorMessage = "<h3>" + err.message + "</h3>"
		console.log(errorMessage)
		$("#contacts").append(errorMessage)
		
	}


	 //Loop through all the values returned and add teh contacts
}

function fillSearchBox(JSONObject) {


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

function showContact(contactFirstName,contactLastName,contactNumber){

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

	//Load a delete button that deletes based on Id

	$("#viewContacts").append(contact) //Append the contact information

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


	var jsonData = JSON.stringify({"contactID":contactID})

	try {

		xhr = openHTTP(url,"POST")
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8")

		xhr.onreadystatechange = function() {

			if(this.status == 200 && this.readyState == 4){

			//contact was deleteed
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

