<?php

    $inData = getRequestInfo();

    $conn = new mysqli("localhost","group17", "cop4331c", "COP4331");

    $FirstName = "";
    $LastName = "";
    $UserName = "";
    $Password = "";
    $Email = "";

    if($conn->connect_error)
    {
        returnWithError();

    }
    else
    {
    $sql = "SELECT FirstName,LastName,UserName,Password,Email FROM Users WHERE ID= ".$inData["ID"];

        $result = $conn->query($sql);

        if($result->num_rows > 0)
        {
            $row = $result->fetch_assoc();
            $FirstName = $row["FirstName"];
            $LastName = $row["LastName"];
            $UserName = $row["UserName"];
            $Password = $row["Password"];
            $Email = $row["Email"];

            returnWithInfo($FirstName,$LastName,$UserName, $Password, $Email);
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
    
    function returnWithInfo($FirstName,$LastName,$UserName, $Password, $Email)
	{
		$retValue = '{"FirstName":"' . $cFirstName . '","LastName":"' . $LastName . '","UserName":"' . $UserName . '","Password":"' . $Password . '","Email":"' . $Email . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}

?>
