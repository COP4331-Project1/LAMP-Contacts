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
        $sql = "SELECT FirstName,LastName,CID FROM Contacts where FirstName like '%" . $inData["search"] . "%' or LastName like '%" . $inData["search"] . "%' and UserID=" .$inData["userId"];
        
        $result = $conn->query($sql); #Will return an array
        
        if ($result->num_rows > 0)
        {
            while($row = $result->fetch_assoc()) #Fetchesst line
            {
                if( $searchCount > 0 ) #After the firt search value
                {
                    $searchResults .= ",";
                }
                $searchCount++;
                $searchResults .= '{"firstName": '.$row["firstName"] .' ,"lastName":'.$row["lastName"].',"contactId":'.$row["contactId"].'},';
            }

        returnWithInfo( $searchResults );
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
        $retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
        sendResultInfoAsJson( $retValue );
    }
    
    function returnWithInfo( $searchResults,$searchCount )
    {
        $retValue = '{"results":[' . $searchResults . '],"error":"","entries":'.$searchCount.'}';
        sendResultInfoAsJson( $retValue );
    }
    
?>
