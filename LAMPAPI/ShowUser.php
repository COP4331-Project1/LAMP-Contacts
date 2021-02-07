<?php

    $inData = getRequestInfo();

    $conn = new mysqli("localhost","group17", "cop4331c", "COP4331");

    $firstName = "";
    $lastName = "";
    $userName = "";
    $password = "";
    $email = "";
    //$dateCreated = "";

    if($conn->connect_error)
    {
        returnWithError();

    }
    else
    {
    $sql = "SELECT firstName,lastName,userName,password,email FROM Users WHERE ID= ".$inData["ID"];
    // $sql = "SELECT firstName,lastName,userName,password,email, dateCreated FROM Users WHERE ID= ".$inData["ID"];

        $result = $conn->query($sql);

        if($result->num_rows > 0)
        {
            $row = $result->fetch_assoc();
            $firstName = $row["firstName"];
            $lastName = $row["lastName"];
            $userName = $row["userName"];
            $password = $row["password"];
            $email = $row["email"];
	    //$dateCreated = $row["dateCreated"];

            returnWithInfo($firstName,$lastName,$userName, $password, $email);
	    // returnWithInfo($firstName,$lastName,$userName, $password, $email, $dateCreated);
        }
        else
        {
            returnWithError("That user does not exist given the ID.");
        }
        
        
        $conn->close();
    }

    function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"ID":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
    }
    
    function returnWithInfo($firstName,$lastName,$userName, $password, $email) //change parameters
	{
		$retValue = '{"firstName":"' . $firstName . '","lastName":"' . $lastName . '","userName":"' . $userName . '","email":"' . $email . '","error":""}';
	        //$retValue = '{"firstName":"' . $firstName . '","lastName":"' . $lastName . '","userName":"' . $userName . '","email":"' . $email . '", "dateCreated":"' . $dateCreated .'", "error":""}';
		sendResultInfoAsJson( $retValue );
	}

?>
