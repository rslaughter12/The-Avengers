const $buttonEl = $("#myButton");
const $inputEl = $("#inputField");
const $firstDiv = $(".first");
const $secondDiv = $(".second");
const $thirdDiv = $(".third");
const $liEl = $(".movie");
const $modal_1 = $(".modal-1");
const $modal_2 = $(".modal-2");
const API_KEY = "5879ce89";
const privateKey = "d86594961cf97e04100c02fa85ade28df00495a8";
const publicKey = "d2fccda0b0d266ecc697390db7fb28c9";
const ts = Number(new Date());
var strHash = md5(ts + privateKey + publicKey);
console.log(strHash);
let watchlist = [];
getWatchlist();
function searchCharacter() {
    const input = $inputEl.val().trim();
    console.log(input);
    const url = `https://gateway.marvel.com/v1/public/characters?name=${input}&limit=20&ts=${ts}&apikey=${publicKey}&hash=${strHash}`;
    // const url = `https://gateway.marvel.com/v1/public/characters?nameStartsWith=spi&limit=20&ts=${ts}&apikey=${publicKey}&hash=${strHash}`;
    console.log(url);
    // $firstDiv.text('');
    // $secondDiv.text('');
    fetch(url)
    .then(response => response.json())
    .then(function(data) {
        console.log(data.data);
        const $img = $("<img>");
        const $pTag = $("<p>");
        $pTag.text(data.data.results[0].description);
        $img.attr('src', data.data.results[0].thumbnail.path + '.jpg' );
        $firstDiv.append($img);
        $secondDiv.append($pTag);
        console.log(data.data.results[0].description);
    })
}
function listMovies() {
    const input = $inputEl.val().trim();
    const OMDB_URL =  `https://www.omdbapi.com/?s=${input}&apikey=${API_KEY}&type=movie`;
    fetch(OMDB_URL)
    .then(function(response){return response.json();})
    .then(function(data) {
        console.log(data);
        // const listEl = document.createElement("ol");
        // let movieList= data.Search.sort((a,b) => b.Year-a.Year);
        for(let i=0; i<10; i++){
            // var li = document.createElement("li");
            let text = data.Search[i].Title;
            console.log(text);
            $liEl.eq(i).text(text);
            // listEl.appendChild(li);
        }
        // thirdDiv.appendChild(listEl);
    })
    .catch(function(error){console.log(error);});
}
function renderMovie(event) {
    event.stopPropagation();
    let e = event.target;
    if(e.matches(".movie")){
        let movieTitle = e.textContent;
        console.log( typeof movieTitle);
        let movieURL = `http://www.omdbapi.com/?apikey=${API_KEY}&t=${movieTitle}`;
        console.log(movieURL);
        fetch(movieURL)
        .then(response => response.json())
        .then(function(data) {
            console.log(data);
            const $img = $("<img>");
            $img.attr('src', data.Poster);
            $('#movieTitle-1').text(data.Title)
            $('.desc-1').eq(0).text(data.Plot);
            $('.desc-1').eq(1).text('Year: '+ data.Year);
            $('.desc-1').eq(2).text('IMDB Rating: '+ data.imdbRating);
            $('#poster-1').append($img);
            $modal_1.addClass('is-active');
        })
    }
}
function renderMovieFromWatchlist(event) {
    showWatchlist();
    event.stopPropagation();
    let e = event.target;
    if(e.matches(".dropdown-item")){
        let movieTitle = e.textContent;
        console.log( typeof movieTitle);
        let movieURL = `http://www.omdbapi.com/?apikey=${API_KEY}&t=${movieTitle}`;
        console.log(movieURL);
        fetch(movieURL)
        .then(response => response.json())
        .then(function(data) {
            console.log(data);
            const $img = $("<img>");
            $img.attr('src', data.Poster);
            $('#movieTitle-2').text(data.Title)
            $('.desc-2').eq(0).text(data.Plot);
            $('.desc-2').eq(1).text('Year: '+ data.Year);
            $('.desc-2').eq(2).text('IMDB Rating: '+ data.imdbRating);
            $('#poster-2').append($img);
            $modal_2.addClass('is-active');
        })
    }
}
function closeModal_1(){
    $modal_1.removeClass('is-active');
    $('#poster-1').children('img').remove();
}
function setWatchlist(){
    let movieTitle = $('#movieTitle-1').text();
    if(watchlist.includes(movieTitle)){
        return;
    }else {
        watchlist.push(movieTitle);
        localStorage.setItem("watchlist", JSON.stringify(watchlist));
    }
}
function getWatchlist(){
    let dummy = JSON.parse(localStorage.getItem("watchlist"));
    if(dummy){
        watchlist  = dummy;
    }else{
        watchlist = [];
    }
    watchlist.forEach(element => {
        let $pTag = $('<p>');
        $pTag.text(element);
        $pTag.addClass('dropdown-item');
        $(".dropdown-content").append($pTag);
    });
    console.log(watchlist);
    console.log(typeof watchlist);
}
function showWatchlist() {
    if($('.dropdown').attr('class') === 'dropdown'){
        $('.dropdown').addClass('is-active');
    }else {
        $('.dropdown').removeClass('is-active');
    }
}
function removeFromWatchlist() {
    let movieTitle = $('#movieTitle-2').text();
    console.log(movieTitle);
    if(watchlist.includes(movieTitle)){
        watchlist.splice(watchlist.indexOf(movieTitle),1);
        console.log(watchlist);
        localStorage.setItem("watchlist", JSON.stringify(watchlist));
    }else {
        return;
    }
}
function closeModal_2(){
    $modal_2.removeClass('is-active');
    $('#poster-2').children('img').remove();
}
$buttonEl.on("click", function(){
    searchCharacter();
    listMovies();
});
$thirdDiv.on("click", renderMovie);
$('.cancel-1').on('click', closeModal_1);
$('#closeIcon-1').on('click', closeModal_1);
$('#add-to-watchlist').on('click', function(){
    setWatchlist();
    closeModal_1();
});
$('#watchlist').on('click', showWatchlist);
$('.cancel-2').on('click', closeModal_2);
$('#closeIcon-2').on('click', closeModal_2);
$('#remove-from-watchlist').on('click', function(){
    removeFromWatchlist();
    closeModal_2();
});
$(".dropdown-content").on("click",".dropdown-item",renderMovieFromWatchlist);


function hideElements() {
    document.getElementById("introColumns").style.display = "none";
  }
  function showElements() {
    document.getElementById("searchElements").classList.remove("is-hidden");
  }