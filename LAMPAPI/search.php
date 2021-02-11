<?php
    

    $inData = getRequestInfo();
    
    $searchResults = "";
    $searchCount = 0;
    
    $conn = new mysqli("localhost", "group17", "cop4331c", "COP4331");
    
    if ($conn->connect_error)
    {
        returnWithError( $conn->connect_error );
    }
    
    else
    {
        $sql = "SELECT contactFirstName,contactLastName,CID FROM Contacts where contactFirstName LIKE '%" .$inData["search"] . "%' AND ID=" . $inData["ID"] . " OR contactLastName LIKE '%" . $inData["search"] . "%' AND ID=" .$inData["ID"];
        
        $result = $conn->query($sql); #Will return an array
        
        if ($result->num_rows > 0)
        {
            while($row = $result->fetch_assoc())
            {
                if( $searchCount > 0 ) #After the firt search value
                {
                    $searchResults .= ",";
                }
                $searchCount++;
                $searchResults .= '{"contactFirstName": "'.$row["contactFirstName"] .'" ,"contactLastName":"'.$row["contactLastName"].'","CID":"'.$row["CID"].'"}';
            }

        returnWithInfo($searchResults,$searchCount);
            
        }
        else
        {
        returnWithError( "No Records Found" );
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
        $retValue = '{"CID":0,"firstName":"","lastName":"","error":"' . $err . '"}';
        sendResultInfoAsJson( $retValue );
    }
    
    function returnWithInfo( $searchResults,$searchCount )
    {
        $retValue = '{"results":[' . $searchResults . '],"error":"","entries":'.$searchCount.'}';
        sendResultInfoAsJson( $retValue );
    }
    
?>
