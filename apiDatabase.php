<?php

// Connectie database
require_once('connect.php');
mysql_connect("$dbHost", "$dbUser", "$dbPass") or die(mysql_error());
mysql_select_db("$dbDatabase") or die(mysql_error());

$result = mysql_query("SELECT * FROM video");

//Een loop door de resultaten van de query en toevoegen aan rows array
$rows = array();
while($row = mysql_fetch_object($result))
{
    $rows[] = $row;
}

//PHP array omzetten naar JSON
header("Content-Type: application/json");
echo json_encode($rows);