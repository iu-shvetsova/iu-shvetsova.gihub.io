<?php

$to      = 'info@cofium.ru';
$subject = 'Новая заявка с сайта Cofium';
$headers = 'From: info@cofium.ru'."\r\n".'X-Mailer: PHP/'.phpversion();

$message = implode("\r\n", $_POST);

$res = mail($to, $subject, $message, $headers);

if ($res) {
    return "success";
}

return "error";