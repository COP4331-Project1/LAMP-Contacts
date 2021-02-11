<?php
if($_POST['payload'])
{
	shell_exec( 'cd root/var/www/html/ && git pull' );
}
?>
