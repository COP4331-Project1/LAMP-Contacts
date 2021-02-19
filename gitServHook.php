<?php
if($_POST['payload'])
{
	sleep(5);
	shell_exec( 'cd /var/www/html/ && /usr/bin/git pull origin main > log.txt' );
}
?>
