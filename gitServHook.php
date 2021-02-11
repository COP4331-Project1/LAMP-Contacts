<?php
if($_POST['payload'])
{
	sleep(1);
	shell_exec( 'cd /var/www/html/ && /usr/bin/git pull origin main > myLog.txt' );
}
?>
