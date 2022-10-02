<html>
<head><title>SSS Msg sent</title>
</head>

<body bgcolor="#ffffff">
<h3>New SSS encrypted message request</h3>

<?php

if (eregi("^[a-f0-9]+$",$sss_arc4msg)) {
	$msgfile = fopen("messages.txt","a");
	fwrite ($msgfile,$sss_arc4msg."\n");
	fclose($msgfile);
	echo "Message saved";
}
else {
	echo "Message was <i>bad...</i>";
}

?>


<h2>Your message has been processed</h2>

<p>
<a href="messageboard.php">Back</a> to message board.
</p>

<p>
<a href="index.html">Main</a> page
</p>

</body>
</html>

