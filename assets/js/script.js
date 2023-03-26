const $buttonEl = $("#myButton");
const $inputEl = $("#inputField");
const $thirdDiv = $(".third");
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


function searchCharacter(input) {
    // let input = $inputEl.val().trim();
    let character = '';
    if(input === 'Spider-Man'){
        character = 'Spider-Man (Peter Parker)';
    }else {
        character = input;
    }
    const url = `https://gateway.marvel.com/v1/public/characters?nameStartsWith=${character}&limit=20&ts=${ts}&apikey=${publicKey}&hash=${strHash}`;
    
    fetch(url) 
    .then(response => response.json())
    .then(function(data) {
        console.log(data);
        console.log(data.data);
        if(data.data.results.length === 0){
            $('#error').text(`Cannot find the Character "${input}"!`);
            $('#note').text('Note: Please spell the character right or try another one.');
            $('.modal-3').addClass('is-active');
        } else {
        $('#character-title').text(data.data.results[0].name);
        // $('#bio').text(`${data.data.results[0].name}'s Bio`);
        let intro = 'Marvel Comics features the greatest superheroes and villains who exhibit the coolest powers and super-enhanced abilities.'
        if(data.data.results[0].description){
            $('#description').text(data.data.results[0].description);
        }else {
            $('#description').text(intro);
        }
        $('#character-img').attr('src', data.data.results[0].thumbnail.path + '.jpg');
        $('#character-img').attr('alt', `picture of ${data.data.results[0].name}`);
        const result = data.data.results[0].urls.filter(obj => obj.type === 'comiclink')
        $('#comicsLink').attr('href', result[0].url);
        listMovies(input);
        }
        $inputEl.val('');
    })
}
function listMovies(input) {
    // const input = $inputEl.val().trim();
    const OMDB_URL =  `https://www.omdbapi.com/?s=${input}&apikey=${API_KEY}&type=movie`;
    fetch(OMDB_URL)
    .then(function(response){return response.json();})
    .then(function(data) {
        console.log(data);
        console.log(data.Response)
        if(data.Response === 'False'){
            $('#modal-4-note').text('Cannot fetch movies list. Try again!');
            $('.modal-4').addClass('is-active');
        } else{
            $('#movies').text('');
            for(let i=0; i < data.Search.length; i++){
                let text = data.Search[i].Title;
                let liEl = $(`<li>${text}</li>`);
                liEl.addClass('movie');
                liEl.attr('titleId',data.Search[i].imdbID);
                $('#movies').append(liEl);
            }

        }        
    })
    .catch(function(error){console.log(error);});
}
function renderMovie(event) {
    event.stopPropagation();
    let e = event.target;
    if(e.matches(".movie")){
        let movieTitle = e.textContent;
        let movieId = e.getAttribute('titleId');
        console.log( typeof movieTitle);
        let movieURL = `http://www.omdbapi.com/?apikey=${API_KEY}&i=${movieId}`;
        console.log(movieURL);
        fetch(movieURL)
        .then(response => response.json())
        .then(function(data) {
            console.log(data);
            const $img = $("<img>");
            try{
                $img.attr('src', data.Poster);
            }catch(err){
                $('#modal-4-note').text('Cannot fetch the movie poster!');
                $('.modal-4').addClass('is-active');
            }
            $('#movieTitle-1').text(data.Title)
            $('.desc-1').eq(0).text(data.Plot);
            $('.desc-1').eq(1).text('Year: '+ data.Year);
            $('.desc-1').eq(2).text('IMDB Rating: '+ data.imdbRating);
            $('#poster-1').append($img);
            $modal_1.addClass('is-active');
        })
        .catch(function(error){console.log(error);});
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
        let $pTag = $('<p>');
            $pTag.text(movieTitle);
            $pTag.addClass('dropdown-item');
            $(".dropdown-content").append($pTag);
    }
}
function getWatchlist(){
    let dummy = JSON.parse(localStorage.getItem("watchlist"));
    if(dummy){
        watchlist  = dummy;
        watchlist.forEach(element => {
            let $pTag = $('<p>');
            $pTag.text(element);
            $pTag.addClass('dropdown-item');
            $(".dropdown-content").append($pTag);
        });
    }else{
        watchlist = [];
    }
    
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
        $('.dropdown-content').text('');
        getWatchlist();
    }else {
        return;
    }
}
function closeModal_2(){
    $modal_2.removeClass('is-active');
    $('#poster-2').children('img').remove();
}
// Autocomplete widget
$(function () {
    var characterNames = [
      'Iron Man',
      'Black Widow',
      'Black Panther',
      'Thor',
      'Thanos',
      'Hulk',
      'Captain America',
      'Falcon',
      'Wolverine',
      'Spider-Man',
      'Doctor Strange',
      'Deadpool',
    ];
    $('#inputField').autocomplete({
      source: characterNames,
    });
});
$buttonEl.on("click", function(){
    let input = $inputEl.val().trim();
    console.log(input);
    searchCharacter(input);
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
$('#closeIcon-3').on('click', function(){
    $('.modal-3').removeClass('is-active');
});
$('#closeIcon-4').on('click', function(){
    $('.modal-4').removeClass('is-active');
});


function hideElements() {
    document.getElementById("introColumns").style.display = "none";
  }
  function showElements() {
    document.getElementById("searchElements").classList.remove("is-hidden");
  }

  function clickCharacter(event) {
    let character = event.target.dataset.character
    console.log(character)
    showElements()
    searchCharacter(character);
  }
