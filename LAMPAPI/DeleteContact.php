<?php

    $inData = getRequestInfo();

    $conn = new mysqli("localhost","group17", "cop4331c", "COP4331");

    if($conn->connect_error)
    {
        returnWithError();

    }
    else
    {
        $sql = "DELETE FROM Contacts WHERE contactId='" . $inData["contactId"] . "'";

        if($result = $conn->query($sql) != TRUE)
        {
            returnWithError($conn->error);
        }

        returnWithError("Successfully Deleted.");

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
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}   

?>
