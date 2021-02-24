<?php
    $fname;
    $lname;
    $name;
    $phoneNumber = " ";
    $address = " ";
    $email = " ";
    
    $myfile = fopen("students.txt", "r");
    $conn = new mysqli("localhost", "group17", "cop4331c", "COP4331");
    if ($conn->connect_error)
    {
            returnWithError( $conn->connect_error );
    }
    
    while(!feof($myfile)) {
      $name = fgets($myfile);
      $name = explode(" ", $name);
      $fname = $name[0];
      $lname = $name[1];
  
    // Attempt to connect to the server

        // Generate mySql command to return any Users given the userName supplied from request.
        $sql = "SELECT contactFirstName,contactLastName FROM Contacts WHERE contactFirstName='" . $fname . "' and contactLastName='" . $lname . "' and ID=" . 97;

        $result = $conn->query($sql);

        // Check if any results come up
        if($result->num_rows > 0)
        {
            // The same exact contact already exists.
            returnWithError("This contact already exists.");
        }
        else
        {
            // Generates the mySql command to insert the request info.
            $sql = "insert into Contacts (contactFirstName,contactLastName,phoneNumber,address,email,ID) VALUES ('" . $fName . "','" . $lName . "','" . $phoneNumber . "','" . $address . "','" . $email ."',". 97 . ")";
            
            if($result = $conn->query($sql) != TRUE)
            {
                returnWithError($conn->error);
            }
            else
            {
                returnWithError("Successfully added contact.");
            }

        }
        
        $conn->close();
    }
      
      
    

    ?>
    
    

    
    

