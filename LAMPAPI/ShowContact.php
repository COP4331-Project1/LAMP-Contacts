<?php

    $inData = getRequestInfo();

    $conn = new mysqli("localhost","group17", "cop4331c", "COP4331");

    $phoneNumber = "";
    $email = "";
    $address = "";

    if($conn->connect_error)
    {
        returnWithError();

    }
    else
    {
        $sql = "SELECT phoneNumber,email,address FROM Contacts WHERE CID=" . $inData["CID"];

        $result = $conn->query($sql);

        if($result->num_rows > 0)
        {
            $row = $result->fetch_assoc();
            $phoneNumber = $row["phoneNumber"];
            $email = $row["email"];
            $address = $address["address"];

            returnWithInfo($phoneNumber, $email, $address);
        }
        else
        {
            returnWithError("That contact does not exist given the CID.");
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
    
    function returnWithInfo($phoneNumber, $email, $address)
	{
		$retValue = '{"phoneNumber":' . $phoneNumber . ',"email":"' . $email . '","address":"' . $address . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}

?>
