<?php
require_once __DIR__ . '/../helpers/response.php';

setCorsHeaders();
handlePreflight();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') jsonError('Method not allowed', 405);

$b       = body();
$name    = trim($b['name']    ?? '');
$email   = trim($b['email']   ?? '');
$message = trim($b['message'] ?? '');

if (!$name || !$email || !$message) jsonError('Toate câmpurile sunt obligatorii', 422);
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) jsonError('Adresă de email invalidă', 422);
if (strlen($name) < 2)      jsonError('Numele trebuie să aibă cel puțin 2 caractere', 422);
if (strlen($message) < 10)  jsonError('Mesajul trebuie să aibă cel puțin 10 caractere', 422);

$to      = 'contact@adunareademagie.ro';
$subject = '=?UTF-8?B?' . base64_encode('Mesaj nou de pe site – ' . $name) . '?=';

$body  = "Ai primit un mesaj nou de pe adunareademagie.ro\r\n";
$body .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\r\n";
$body .= "Nume:  {$name}\r\n";
$body .= "Email: {$email}\r\n";
$body .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\r\n\r\n";
$body .= $message . "\r\n";

$headers  = "From: Adunarea de Magie <contact@adunareademagie.ro>\r\n";
$headers .= "Reply-To: {$name} <{$email}>\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "Content-Transfer-Encoding: 8bit\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";

if (@mail($to, $subject, $body, $headers)) {
    jsonOk(['message' => 'Mesaj trimis cu succes!']);
} else {
    jsonError('Mesajul nu a putut fi trimis. Încearcă din nou.', 500);
}
