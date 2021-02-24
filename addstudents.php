<?php
    $fname;
    $lname;
    $name;
    $phoneNumber = "";
    $address = "";
    $email = " ";
    $count = 0;
    
    $myfile = fopen("students.txt", "r");
    $conn = new mysqli("localhost", "group17", "cop4331c", "COP4331");
    if ($conn->connect_error) return;
    
    while(!feof($myfile)) {
        
      count++;
        
      if(count >= 5) break;
        
      $name = fgets($myfile);
      $name = explode(" ", $name);
      $fname = $name[0];
      $lname = $name[1];

        // Generate mySql command to return any Users given the userName supplied from request.
        $sql = "SELECT contactFirstName,contactLastName FROM Contacts WHERE contactFirstName='" . $fname . "' and contactLastName='" . $lname . "' and ID=" . 97;

        $result = $conn->query($sql);

        // Check if any results come up
        if($result->num_rows > 0) continue;

      // Generates the mySql command to insert the request info.
        $sql = "insert into Contacts (contactFirstName,contactLastName,phoneNumber,address,email,ID) VALUES ('" . $fName . "','" . $lName . "','" . $phoneNumber . "','" . $address . "','" . $email ."',". 97 . ")";
    
        }
    $conn->close();
      
    ?>
    
    

    
    

