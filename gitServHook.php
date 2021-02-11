<?php
if($_POST['payload'])
{
	shell_exec( 'cd /var/www/html/ && /usr/bin/git pull origin main > myLog.txt' );
}
?>
