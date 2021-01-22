firstName = ""
lastName = ""
userId  = 0


function openHTTP(url,action){

	var xhr = new XMLHttpRequest()
	xhr.open("POST",url,false)
	return xhr
}


function login() {

    var username = $(".username").val() //gets the username and password from the input field
    var password = $(".password").val()

    var jsonData = '{"username" : "' + username + '", "password" : "' + password + '"}'; //Json is formatted in key value pairs

    url = "http://159.203.70.233/LAMPAPI/Login.php"

	window.location.href = "home.html"

  	try
	{
		var xhr = openHTTP(url,"POST")
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
		xhr.send(jsonData);
		
		var jsonObject = JSON.parse( xhr.responseText ); //Parses the response text, converts to javascript object
		
		userId = jsonObject.id; //Gets the user ID form the databsae
		
		if( userId < 1 ) //Represents an error 
		{
			$(".loginInput").append("<p> User/Password combination incorrect </p>");
			return;
		}	
		firstName = jsonObject.firstName; //Gets the first name
		lastName = jsonObject.lastName;

		saveCookie();
        window.location.href = "home.html"
	}
    catch(err)
	{
		$("#loginInput").append("<p>" + err.message + '<p>')  
	}

}

function saveCookie(){ //Need to save cookies

	var minutes = 20; //The time to save cookie
	var date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
    document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
    
    //Saves the cookie to keep track of the user
}

function showContact(id){

	var columnFirst = "<div class = 'col-6'>"
	var columnSecond = "<div class = 'col-6'>"

	var contact = "<div class ='contact' style = 'background-color:black; height:100%'>sdfdsfdsfsdfdfdsfds</div>"

	$("#viewContacts").append(contact)

}



function search() {

	var contactSearch = $("#searchbar").val()

	url = "http://COP4331-17.com/LAMPAPI/Login.php"

	try{

		xhr = openHTTP(url,"POST")

		var jsonData = '{"contactSearch" : "' + contactSearch + '"}'

		xhr.send(jsonData)

		JSONObject = JSON.parse(xhr.responseText)

	}
	catch(err) {

		$(".contacts").append(err.message)

	}

	/*

	for(i in JSONObject.results) {

		var contactFirstName = JSONObject.results[i].contactFirstName
		var contactLastName = JSONObject.results[i].contactLastName
		var address = JSONObject.results[i].address
		var phoneNumber = JSONObject.results[i].phoneNumber
		var email = JSONObject.results[i].email

		var button = "<button type = 'button' id = 'contact' onClick = showContact('123') style = 'width:100%'> " +
		"<div class = 'd-flex justify-content-inline' id = 'flexFormat'>" +
		"<span class = 'circle'>'contactFirstName[0] + contactLastName[0] '</span>" +
		"<div class = 'd-flex flex-column' id = 'flexFormatColumn'>" +
		"<h2 style = 'padding-left:5%'>'contactFirstName'</h2>" +
		"<h3 style = 'padding-left:20%'>'contactLastName'</h3> </div></div></button>" 
		"<p hidden id = "address">address</p>"
		"<p hidden id = "phoneNumber">phoneNUmber</p>"
		"<p hidden id = "email">email</p>"
		$(".contacts").append(button)
		}
		*/
	
	$(".contacts").empty()

	for(var i = 0 ; i < 20 ; i++){
	var button = "<button type = 'button' class = 'btn btn-primary btn-xs bg-dark' id = 'contact' onClick = showContact('123') style = 'width:100%'> " +
    "<div class = 'd-flex justify-content-inline' id = 'flexFormat'>" +
	"<span class = 'circle'>RP</span>" +
	"<div class = 'd-flex flex-column' id = 'flexFormatColumn'>" +
	"<h2 style = 'padding-left:5%'>Paola</h2>" +
	"<h3 style = 'padding-left:20%'>C </h3> </div></div></button>" 

	$(".contacts").append(button)
	}

	 //Loop through all the values returned and add teh contacts
}


function register() {

	var registerUsername = $(".registerUsername").val() //gets the username and password from the input field
    var registerPassword = $(".registerPassword").val()

	window.location.href = "index.html"
	var jsonData = '{"username" : "' + registerUsername + '", "password" : "' + registerPassword + '"}'; //Json 
	var xhr = openHttp(url,"POST")

	try {

		xhr.send(jsonData)

		JSONobject = JSON.parse(xhr.responseText)


	}
	catch(err){


	}

}

function addContact() {

	var contactFirstName = $(".firstName").val()
	var contactLastName = $(".lastName").val()
	var address= $(".address").val()
	var phoneNumber = $(".phoneNumber").val()
	var email = $(".email").val()


	var jsonData = '{"contactFirstName" : ' + contactFirstName + ',\
	"contactLastName" : ' + contactLastName + ' ,\
	"contactLastName" : ' + address + ' ,\
	"contactLastName" : ' + phoneNumber + ' ,\
	"contactLastName" : ' + email + ' ,\
	}'

	xhr = openHTTP(url,"POST")

	try {

		xhr.send(jsonData)

	}
	catch(err){

		//Log ERror 

	}
		
	}
/*





function removeContact(){






}

function update(){






}



*/