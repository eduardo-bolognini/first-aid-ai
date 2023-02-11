<?

$feedback = $_GET['feedback'];

$contenuto = '
      %s
';

$contenutof = sprintf($contenuto, $feedback);
$myemail = 'web@studiobolognini.com';

$headers = "From: " .  $myemail . " <" .  $myemail . ">\r\n";
$headers .= "Reply-To: " .  $myemail . "\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

if (mail($myemail, 'nuovo feedback da First Aid AI', $contenutof, $headers ))
  header("Location: https://first.aid.ai.studiobolognini.com/chat.html");
else
  echo "Errore. Nessun messaggio inviato.";

?>

