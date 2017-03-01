function init() {
    $('#addScreenForm').on('submit', otherScreen);
    $('#searchForm').on('submit', searchVideos);
    $('#addForm').on('submit', saveVideo);
    getVideosDatabase();
    test();
}

function test() {
    console.log('Test');
}

//Wanneer er op + button wordt geklikt, ga naar addVideo.html
function otherScreen(e) {
    e.preventDefault();

    window.location = "addVideo.html";
}

//Waarde uit input in url stoppen. JSON ophalen van Youtube API en toevoegen op scherm
function searchVideos(e) {
    e.preventDefault();

    var inputSearch = $('#findVideo').val();

    if (inputSearch == '') {
        alert("You didn't type anything! Try again.");
    }

    else {
        $.get(
            "https://www.googleapis.com/youtube/v3/search", {
                part: 'snippet',
                q: inputSearch,
                maxResults: 4,
                key: 'AIzaSyDns6HiujbQbbeQscYNMPaoie95yO6oMqQ'
            },
            function (response) {
                //Hidden inputs om titel, url en thumbnail van eerste video op te halen
                $('<input type="hidden" id="titleVideo" name="titleVideo" value=' + response.items[0].snippet.title + '/>')
                    .appendTo('#addForm');
                $('<input type="hidden" id="youtubeURL" name="youtubeURL" value=' + 'http://www.youtube.com/embed/' + response.items[0].id.videoId + '/>')
                    .appendTo('#addForm');
                $('<input type="hidden" id="youtubeThumbnailURL" name="youtubeThumbnailURL" value=' + response.items[0].snippet.thumbnails.medium.url + '/>')
                    .appendTo('#addForm');

                //Eerste video groot weergeven
                $('<iframe src=' + 'http://www.youtube.com/embed/' + response.items[0].id.videoId + ' + id="first"></iframe>')
                    .appendTo('#firstVideo');

                //Andere gezochte video's klein onderaan pagina plaatsen in thumbnail vorm
                $('<img src=' + response.items[1].snippet.thumbnails.medium.url + ' class="others" >')
                    .appendTo('#otherVideos');
                $('<img src=' + response.items[2].snippet.thumbnails.medium.url + ' class="others" >')
                    .appendTo('#otherVideos');
                $('<img src=' + response.items[3].snippet.thumbnails.medium.url + ' class="others" >')
                    .appendTo('#otherVideos');
            }
        );
    }
}

function saveVideo(e) {
    e.preventDefault();

    //Variabelen om value van inputvelden op te halen
    var titleVideo = $('#titleVideo').val();
    var youtubeURL = $('#youtubeURL').val();
    var youtubeThumbnailURL = $('#youtubeThumbnailURL').val().replace(/\/$/, ""); //Verwijder laatste slash in url
    var categoryVideo = $('#categoryVideo').val();

    //Waardes inputvelden versturen naar backend
    $.ajax({
        type: 'POST',
        url: 'backend.php',
        data: {
            titleVideo: titleVideo,
            youtubeURL: youtubeURL,
            youtubeThumbnailURL: youtubeThumbnailURL,
            categoryVideo: categoryVideo,
            success: function () {
                alert('Video saved!');

                //Toegevoegde video toevoegen aan favorietenlijst na klik op add
                $('<img src=' + youtubeThumbnailURL + ' class="thumbnailYoutube" >').prependTo('.allThumbnails');
            }
        }
    });
}

//Video's ophalen uit database
function getVideosDatabase() {
    $.ajax({
        type: 'GET',
        contentType: 'application/json',
        url: 'apiDatabase.php',
        dataType: 'json',
        success: showResultsJson,
        error: ErrorMessage
    });
}

//Succes bericht
function showResultsJson(response) {
    $.each(response, function (i, item) {
        $('<img src=' + item['youtube_thumbnail_url'] + ' class="thumbnailYoutube" >').appendTo('.allThumbnails');
        $('<input type="submit" class="categoryList" value=' + item['category'] + ' name="category"/>').appendTo('#allCategories');
    });

    var totalVideos = response.length;

    //Laatste video uit database weergeven
    $('<iframe src=' + response[totalVideos - 1].youtube_url + ' + id="last"></iframe>').appendTo('#lastVideoDatabase');
}

//Error bericht
function ErrorMessage() {
    alert('Connection failed!');
}

//Uitvoeren als pagina geladen is
$(document).on('ready', init);