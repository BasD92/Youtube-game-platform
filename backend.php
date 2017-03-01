<?php
//Connectie met database
require_once('connect.php');
mysql_connect("$dbHost", "$dbUser", "$dbPass") or die(mysql_error());
mysql_select_db("$dbDatabase") or die(mysql_error());

//Waardes uit input ophalen
$titleVideo = $_POST['titleVideo'];
$youtubeURL = $_POST['youtubeURL'];
$youtubeThumbnailURL = $_POST['youtubeThumbnailURL'];
$categoryVideo = $_POST['categoryVideo'];

//Waardes toevoegen aan database
mysql_query("INSERT INTO video (titel_video, youtube_url, youtube_thumbnail_url, category)
VALUES ('$titleVideo', '$youtubeURL', '$youtubeThumbnailURL', '$categoryVideo')");



