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
		createAlert("Please enter a username and password","danger",".errorBar")
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
			createAlert("Incorrect Username/Password","danger",".errorBar")
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

function passwordStrength() {

	password = $("#password").val();
	var length = password.length
	var mix = 0;
	var strength;
	if(password.match("^[A-Za-z0-9]+$")) mix = 1;
	
	if(length < 6 && mix == 0 ) strength = 25;
		
	if(length < 6 && mix == 1 ) strength = 50 

	if(length >= 6 && mix == 0 ) strength = 75

	if(length >= 6 && mix == 1 ) strength = 100


	var progress = "<div class='progress'>"
  	+ "<div class='progress-bar' role='progressbar' style='width:" + strength + "%;' aria-valuenow='100' aria-valuemin='0' aria-valuemax='100'></div></div>"

	$("#passwordBox").empty()
	$("#passwordBox").append(progress)
}

function register() {

	var firstName = $("#firstName").val() // Gets the first name from register fields
	var lastName = $("#lastName").val() //Gets the last name from register fields
	var userName = $("#userName").val() //gets the username from register fields
   	var password =  $("#password").val() //gets the password from register field
	var email = $("#email").val() // gets the email from register field
	var url = "http://www.cop4331group17.tech/LAMPAPI/Register.php"

	if(userName =="" || password == "") { // Need to provide username and password

	 createAlert("User Name and Password are required fields","danger",".errorBar")	
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
		createAlert("This username already exists, try another one.","danger",".errorBar")	
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
	var xhr = openHTTP(url,"POST");
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
	"<div class = 'circle'><h3>"+ contactFirstName[0] + contactLastName[0]+"</h3></div>" + "</div>" + 
	"<div class = 'col-7 d-flex flex-column justify-content-center p-0 g-0'>" +
	"<h3 style = 'padding-left:5%'>" + contactFirstName + "</h4>" +
	"<h3 style = 'padding-left:20%'>" + contactLastName + "</h4> </div>" +
	"<div class = 'col-1'>" + "</div>"
	$("#contacts").append(button)

	}

}

function edit(field) {

	var cancel = "#cancel" + field
	var confirm = "#confirm" + field
	var edit = "#edit" + field

	$("#" + field +"Input").show();
	$("#" + field +"Text").hide();
	$(cancel).show();
	$(confirm).show();
	$(edit).hide();
}

function cancel(field) {

	var cancel = "#cancel" + field
	var confirm = "#confirm" + field
	var edit = "#edit" + field

	$("#" + field +"Input").hide();
	$("#" + field +"Text").show();
	$(cancel).hide();
	$(confirm).hide();
	$(edit).show();
}

function createInfoBoxes(contactFirstName,contactLastName,address,phoneNumber,email,CID,dateCreated) { //Shows the contact information when clicked on

	var boxes = "<div class = 'col w-100 bg-light border border-2 border-muted' id = 'showContacts'>" 

	+"<div class = 'row w-100 p-2'>" 
	+"<div class = 'informationBox'>" 
	+"<div class = 'titleBox'>" 
	+"<h3 id = 'contactAttribute'>First</h3>" 
	+"<div class = 'd-flex w-100 justify-content-end'>" 
	+"<i class='bi-pencil' id = 'editcontactFirstName' onclick = 'edit(" + '"contactFirstName"' + "," + CID + ")'></i>" + "</div>" 
	+"<i class='bi-x' style = 'color:red; font-size:30px' id = 'cancelcontactFirstName' onclick = cancel('contactFirstName')></i>"
	+"<i class='bi-check' style = 'color:green; font-size:30px' id = 'confirmcontactFirstName' onclick = update('contactFirstName','"+CID+"')></i>"  
	+"</div></div>"
	+"<div class = 'contactFirstName'>" 
	+"<div class='input-group mb-1'>" +"<input type='text' class='form-control' id = 'contactFirstNameInput' aria-describedby='inputGroup-sizing-default'>"
	+"</div><div id = 'contactFirstNameText' class = 'informationText'>" + contactFirstName + "</div></div></div>"

	+"<div class = 'row w-100 p-2'>" 
	+"<div class = 'informationBox'>" 
	+"<div class = 'titleBox'>" 
	+"<h3 id = 'contactAttribute'>Last</h3>" 
	+"<div class = 'd-flex w-100 justify-content-end'>" 
	+"<i class='bi-pencil' id = 'editcontactLastName' onclick = 'edit(" + '"contactLastName"' + "," + CID + ")'></i>" + "</div>" 
	+"<i class='bi-x' style = 'color:red; font-size:30px' id = 'cancelcontactLastName' onclick = cancel('contactLastName')></i>"
	+"<i class='bi-check' style = 'color:green; font-size:30px' id = 'confirmcontactLastName' onclick = update('contactLastName','"+CID+"')></i>"  
	+"</div></div>"
	+"<div class = 'contactLastName'>" 
	+"<div class='input-group mb-1'>" +"<input type='text' class='form-control' id = 'contactLastNameInput'  aria-describedby='inputGroup-sizing-default'>"
	+"</div><div id = 'contactLastNameText' class = 'informationText'>" + contactLastName + "</div></div></div>"


	+"<div class = 'row w-100 p-2'>" 
	+"<div class = 'informationBox'>" 
	+"<div class = 'titleBox'>" 
	+"<h3 id = 'contactAttribute'>Phone</h3>" 
	+"<div class = 'd-flex w-100 justify-content-end'>" 
	+"<i class='bi-pencil' id = 'editphoneNumber' onclick = 'edit(" + '"phoneNumber"' + "," + CID + ")'></i>" + "</div>" 
	+"<i class='bi-x' style = 'color:red; font-size:30px' id = 'cancelphoneNumber' onclick = cancel('phoneNumber')></i>"
	+"<i class='bi-check' style = 'color:green; font-size:30px' id = 'confirmphoneNumber' onclick = update('phoneNumber','"+CID+"')></i>"  
	+"</div></div>"
	+"<div class = 'phoneNumber'>" 
	+"<div class='input-group mb-1'>" +"<input type='text' class='form-control' id = 'phoneNumberInput'  aria-describedby='inputGroup-sizing-default'>"
	+"</div><div id = 'phoneNumberText' class = 'informationText'>" + phoneNumber + "</div></div></div>"


	+"<div class = 'row w-100 p-2'>" 
	+"<div class = 'informationBox'>" 
	+"<div class = 'titleBox'>" 
	+"<h3 id = 'contactAttribute'>Address</h3>" 
	+"<div class = 'd-flex w-100 justify-content-end'>" 
	+"<i class='bi-pencil' id = 'editaddress' onclick = 'edit(" + '"address"' + "," + CID + ")'></i>" + "</div>" 
	+"<i class='bi-x' style = 'color:red; font-size:30px' id = 'canceladdress' onclick = cancel('address')></i>"
	+"<i class='bi-check' style = 'color:green; font-size:30px' id = 'confirmaddress' onclick = update('address','"+CID+"')></i>"  
	+"</div></div>"
	+"<div class='input-group mb-1'>" +"<input type='text' class='form-control' id = 'addressInput'  aria-describedby='inputGroup-sizing-default'>"
	+"</div><div id = 'addressText' class = 'informationText'>" + address + "</div></div>"

	+"<div class = 'row w-100 p-2'>" 
	+"<div class = 'informationBox'>" 
	+"<div class = 'titleBox'>" 
	+"<h3 id = 'contactAttribute'>Email</h3>" 
	+"<div class = 'd-flex w-100 justify-content-end'>" 
	+"<i class='bi-pencil' id = 'editemail' onclick = 'edit(" + '"email"' + "," + CID + ")'></i>" + "</div>" 
	+"<i class='bi-x' style = 'color:red; font-size:30px' id = 'cancelemail' onclick = cancel('email')></i>"
	+"<i class='bi-check' style = 'color:green; font-size:30px' id = 'confirmemail' onclick = update('email','"+CID+"')></i>"  
	+"</div></div>"
	+"<div class='input-group mb-1'>" +"<input type='text' class='form-control' id = 'emailInput' aria-describedby='inputGroup-sizing-default'>"
	+"</div><div id = 'emailText' class = 'informationText'>" + email + "</div></div>"

	+"<div class = 'row w-100 p-2 g-0 d-flex flex-row'>"
	+"<div class = 'alert alert-primary w-50' role = 'alert'>Date Created: " + dateCreated + "</div>" 
	+"<div id = 'deleteButton'>" 
	+"<i class='bi-trash' style = 'color:red; font-size:30px' onclick = 'deleteAlertBox(" + CID + ")'></i>" 
	+"</div>" 

	$(document).scrollTop($(document).height()) 

	$("#contactView").empty();
	$("#contactView").append(boxes);
	$('#contactFirstNameInput').hide();
	$('#contactLastNameInput').hide();
	$('#addressInput').hide();
	$('#phoneNumberInput').hide();
	$('#emailInput').hide();

	$('#confirmcontactFirstName').hide();
	$('#cancelcontactFirstName').hide();
	$('#confirmphoneNumber').hide();
	$('#cancelphoneNumber').hide();
	$('#confirmcontactLastName').hide();
	$('#cancelcontactLastName').hide();
	$('#confirmaddress').hide();
	$('#canceladdress').hide();
	$('#confirmemail').hide();
	$('#cancelemail').hide();


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
	+ "<div class = 'errorBar'>"
	+ "</div></div></div></div>"
		

	$("#mainContainer").append(deleteModal)
	$("#deleteContact").modal('show')

}

function closeDeleteAccount(){

	$("#deleteAccount").modal('hide')
	$("#settings").modal('show')
}

function deleteAccountModal() { //Displays the dialog box for deleting a contact

	var deleteModal = "<div class='modal fade in' id='deleteAccount' tabindex='-1' role='dialog' aria-labelledby='exampleModalCenterTitle' aria-hidden='true'>"
	+ "<div class='modal-dialog modal-dialog-centered' role='document'>"
	+ "<div class='modal-content'>" 
	+ "<div class='modal-header'>" 
	+ "<h5 class='modal-title' id='exampleModalLongTitle'>Are you sure you want to delete this account?</h5>"
	+ "<button type='button' class='close' onclick = 'closeDeleteAccount()' aria-label='Close'>" 
	  
	+ "<span aria-hidden='true'>&times;</span>" 
	+ "</button>" 
	+ "</div>" 
	+ "<div class= modal-body>"
	+ "<button type='button' class='btn btn-danger' onclick = 'deleteUser()' aria-label='Close'>Delete</button>"
	+ "</div> " + "</div>" + "</div>" + "</div>"
		
	$("#mainContainer").append(deleteModal)

	$("#settings").modal('hide')
	$("#deleteAccount").modal('show')
	

}



function showContact(contactNumber){ //Interacts with show contact endpoint to retreive necessary informatoin


	var url = "http://www.cop4331group17.tech/LAMPAPI/ShowContact.php"
	var CID = contacts[contactNumber] //Uses the array of contacts to retreive the CID of the contact clicked on .

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
		var address = JSONObject.address
		var phoneNumber = JSONObject.phoneNumber
		var email = JSONObject.email
		var dateCreated = JSONObject.dateCreated

		contactFirstName = checkEmpty(contactFirstName)
		contactLastName = checkEmpty(contactLastName)
		address = checkEmpty(address)
		phoneNumber = checkEmpty(phoneNumber)
		email = checkEmpty(email)

	
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
		createAlert("First and Last name are required fields","danger",".errorBar")
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
				createAlert("This Contact Already Exists","danger",".errorBar")
				return;
				}
				else{
					$('#add').modal('hide')
					createAlert("Successfully Added Contact","success","#mainContainer")
				}
			}
		}
		xhr.send(jsonData)
	}
	catch(err){

	}		
}
function update(field,CID){ //For updating the contact 

		var url = "http://www.cop4331group17.tech/LAMPAPI/UpdateContact.php"

		inputField = "#" +field + "Input"
		textField = "#" +field + "Text"

		var updateValue = $(inputField).val()
		console.log(updateValue)


		var jsonData = JSON.stringify({"CID":CID,"field":field,"value":updateValue,"ID":ID})
		
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
		$(textField).text(updateValue)
		cancel(field)
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

			if(jsonData.err = "Successful delete.") createAlert("Contact Deleted","success",".errorBar")
			window.location.reload();	
			}
		}
		xhr.send(jsonData)
		}	
		catch(err) {

		console.log(err.message) //otherwise output error
		}

}


function settings(field) { //updates the user settings.


	inputField = "#" +field + "Input"
	textField = "#" +field + "Text"

	var updateValue;
	var correctField;

	if(field == "password"){
		updateValue = md5($('#newPassword').val())
		correctField = field
	}
	else {
		updateValue = $(inputField).val()
		correctField = field;
		if(field == "userEmail") correctField = "email"
	}

	var url = "http://www.cop4331group17.tech/LAMPAPI/UpdateUser.php"
	var jsonData = JSON.stringify({"ID":ID,"field":correctField,"value":updateValue})

	try {

		xhr = openHTTP(url,"PATCH")
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8")
		xhr.onreadystatechange = function() {

			if(this.status == 200 && this.readyState == 4){
			var JSONObject = JSON.parse(xhr.responseText);

			if(JSONObject.error == "That username already exists!"){
				createAlert("That username already exists!","danger",".errorBar")
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

		if(field!= "password"){
 		$(textField).text(updateValue)
		cancel(field)
		} else closeChangePassword();


}
	
function searchAll(){

	$("#searchbar").val("");
	search();
}

//Following code is for the modals

function showAdd() {

	$(".errorBar").empty();
	$('#add').modal('show')
}

function closeAdd() {

	$('#add').modal('hide')
}

function closeDelete() {

	$('#deleteContact').modal('hide')
}

function showSettings() {

	$('#settings').modal('show')
	showUser()
}

function closeSettings() {

	$('#settings').modal('hide')
}

function closeChangePassword() {

	$("#changePassword").modal('hide')
	$("#settings").modal('show')

}

function confirmChange() {

	var initialPassword = $('#initialPassword').val();
	var newPassword = $('#newPassword').val();

	if(newPassword != initialPassword) createAlert("Passwords Do Not Match","danger","#changePassword")
	else settings("password")

}

function createAlert(errorMessage,type,page) {

	$(page).remove("#alertBox")

	var alert = "<div class='alert alert-dismissible alert-" +type+" id ='alertBox' >" + errorMessage + "</div>"
		
	$(page).prepend(alert)

	$(".alert-dismissible").fadeTo(2000, 500).slideUp(500, function(){
		$(".alert-dismissible").alert('close');
	});
}

function changePassword() {

	var modal = "<div class='modal fade in' id='changePassword' tabindex='-1' role='dialog' aria-labelledby='exampleModalCenterTitle' aria-hidden='true'>"
	+ "<div class='modal-dialog modal-dialog-centered' role='document'>"
	+ "<div class='modal-content'>" 
	+ "<div class='modal-header'>" 
	+ "<h5 class='modal-title' id='exampleModalLongTitle'>Change Password</h5>"
	+ "<button type='button' class='close' onclick = 'closeChangePassword()' aria-label='Close'>" 
	+ "<span aria-hidden='true'>&times;</span>" 
	+ "</button>" 

	+"</div>" 
	+"<div class= modal-body>"
	+"<div class='input-group mb-3'>" +"<input type='text' class='form-control' placeholder= Password id = 'initialPassword' aria-describedby='inputGroup-sizing-default'></div>"
	+"<div class='input-group mb-3'>" +"<input type='text' class='form-control' placeholder= Confirm id = 'newPassword'  aria-describedby='inputGroup-sizing-default'></div>"

	+"<div class='modal-footer'>"
	+ "<button type='button' class='btn btn-primary' onclick = 'confirmChange()' aria-label='Close'>Confirm</button>"
	+ "</div> " + "</div>" + "</div>" + "</div>"

	$("#mainContainer").append(modal)
	$("#settings").modal('hide')
	$("#changePassword").modal('show')
		
}

function changeSettings() {

	var boxes = "<div class = 'row w-100 p-3'>" 
	
	+"<div class = 'row w-100 p-2'>" 
	+"<div class = 'informationBox'>" 
	+"<div class = 'titleBox'>" 
	+"<h3 id = 'contactAttribute'>Username</h3>" 
	+"<div class = 'd-flex w-100 justify-content-end'>" 
	+"<i class='bi-pencil' id = 'edituserName' onclick = edit('userName')></i>" + "</div>" 
	+"<i class='bi-x' style = 'color:red; font-size:30px' id = 'canceluserName' onclick = cancel('userName')></i>"
	+"<i class='bi-check' style = 'color:green; font-size:30px' id = 'confirmuserName' onclick = settings('userName',)></i>"  
	+"</div></div>"
	+"<div class = 'userName'>" 
	+"<div class='input-group mb-1'>" +"<input type='text' class='form-control' id = 'userNameInput' aria-describedby='inputGroup-sizing-default'>"
	+"</div><div id = 'userNameText' class = 'informationText'>" + userName + "</div></div></div>"

	+"<div class = 'row w-100 p-2'>" 
	+"<div class = 'informationBox'>" 
	+"<div class = 'titleBox'>" 
	+"<h3 id = 'contactAttribute'>First</h3>" 
	+"<div class = 'd-flex w-100 justify-content-end'>" 
	+"<i class='bi-pencil' id = 'editfirstName' onclick = edit('firstName')></i>" + "</div>" 
	+"<i class='bi-x' style = 'color:red; font-size:30px' id = 'cancelfirstName' onclick = cancel('firstName')></i>"
	+"<i class='bi-check' style = 'color:green; font-size:30px' id = 'confirmfirstName' onclick = settings('firstName')></i>"  
	+"</div></div>"
	+"<div class = 'firstName'>" 
	+"<div class='input-group mb-1'>" +"<input type='text' class='form-control' id = 'firstNameInput'  aria-describedby='inputGroup-sizing-default'>"
	+"</div><div id = 'firstNameText' class = 'informationText'>" + firstName + "</div></div></div>"


	+"<div class = 'row w-100 p-2'>" 
	+"<div class = 'informationBox'>" 
	+"<div class = 'titleBox'>" 
	+"<h3 id = 'contactAttribute'>Last</h3>" 
	+"<div class = 'd-flex w-100 justify-content-end'>" 
	+"<i class='bi-pencil' id = 'editlastName' onclick = edit('lastName')></i>" + "</div>" 
	+"<i class='bi-x' style = 'color:red; font-size:30px' id = 'cancellastName' onclick = cancel('lastName')></i>"
	+"<i class='bi-check' style = 'color:green; font-size:30px' id = 'confirmlastName' onclick = settings('lastName')></i>"  
	+"</div></div>"
	+"<div class = 'lastName'>" 
	+"<div class='input-group mb-1'>" +"<input type='text' class='form-control' id = 'lastNameInput'  aria-describedby='inputGroup-sizing-default'>"
	+"</div><div id = 'lastNameText' class = 'informationText'>" + lastName + "</div></div></div>"


	+"<div class = 'row w-100 p-2'>" 
	+"<div class = 'informationBox'>" 
	+"<div class = 'titleBox'>" 
	+"<h3 id = 'contactAttribute'>Email</h3>" 
	+"<div class = 'd-flex w-100 justify-content-end'>" 
	+"<i class='bi-pencil' id = 'edituserEmail' onclick = edit('userEmail')></i>" + "</div>" 
	+"<i class='bi-x' style = 'color:red; font-size:30px' id = 'canceluserEmail' onclick = cancel('userEmail')></i>"
	+"<i class='bi-check' style = 'color:green; font-size:30px' id = 'confirmuserEmail' onclick = settings('userEmail')></i>"  
	+"</div></div>"
	+"<div class='input-group mb-1'>" +"<input type='text' class='form-control' id = 'userEmailInput'  aria-describedby='inputGroup-sizing-default'>"
	+"</div><div id = 'userEmailText' class = 'informationText'>" + address + "</div></div></div>"

	+"<div class = 'password'>" 
	+"<button type='button' class='btn btn-primary' onclick = changePassword() >Change Password</button>" + "</div><br></br>"
	+ "<div class = 'alert alert-primary' role = 'alert'>Date Created: " + dateCreated + "</div>" 
	+ "<button type='button' class='btn btn-danger' onclick = deleteAccountModal()>Delete Account</button>"

	$("#settingsModal").empty();
	$("#settingsModal").append(boxes);


	$('#firstNameInput').hide();
	$('#lastNameInput').hide();
	$('#userEmailInput').hide();
	$('#userNameInput').hide();

	$('#confirmfirstName').hide();
	$('#cancelfirstName').hide();
	$('#confirmuserName').hide();
	$('#canceluserName').hide();
	$('#confirmlastName').hide();
	$('#cancellastName').hide();
	$('#confirmuserEmail').hide();
	$('#canceluserEmail').hide();


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
	+ "<h1 style id = 'startPageTitle'> Welcome, " + userName + "!</h1>"
	
	+ "<center>"
	+"<div class='col-10 align-self-center p-2'>"
	+ "<h2 id='quote' style='font-size:17px; color:grey; font-family: arial'>Thank you for choosing The People Wallet where all of your people are stored, updated, and deleted within the reach of your pocket.</h2></div>"
	+"</center>"
	+"<p></p>"
	
	+"<div class='row justify-content-center'>"
    +"<div class='col align-self-center'>"
   	+ "<center id='startPageGuide'>Today's Date</center>"
   	+ "</div>"
	+"</div>"

	+"<center>"
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
	+"</center>"
	
	+"<div class='container'>"
    +"<div class='row justify-content-center'>"

    +"<div class='col-lg-8 d-flex align-items-center justify-content-center'>"
   	+"<img class='img-fluid' src='/images/friends.png' alt='Responsive Image' width='270'>"
    +" </div>"
    +"</div>"
	+"</div>"
    + "</div>"

	$("#contactView").append(box)

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


function checkEmpty(string) { //Function to see 

	if(!string || string.length == 0) return "N/A"
	else return string

}
