// const nav = document.querySelector("");
// const info_box = document.querySelector(".info_box");
// const input = document.querySelector('input[type="search"]');

// input.addEventListener("search", () => {
//   console.log(`The term searched for was ${input.value}`);
// });

const buttonEl = document.getElementById("myButton");
const inputEl = document.getElementById("inputField");
const firstDiv = document.querySelector(".first");
const secondDiv = document.querySelector(".second");
const thirdDiv = document.querySelector(".third");


const privateKey = "d86594961cf97e04100c02fa85ade28df00495a8";
const publicKey = "d2fccda0b0d266ecc697390db7fb28c9";
const ts = Number(new Date());
var strHash = md5(ts + privateKey + publicKey);
console.log(strHash);

buttonEl.addEventListener("click", function() {
    const input = inputEl.value.trim();
    console.log(input);
    const url = `https://gateway.marvel.com/v1/public/characters?name=${input}&limit=20&ts=${ts}&apikey=${publicKey}&hash=${strHash}`;
    // const url = `https://gateway.marvel.com/v1/public/characters?nameStartsWith=spi&limit=20&ts=${ts}&apikey=${publicKey}&hash=${strHash}`;
    console.log(url);
    fetch(url) 
    .then(response => response.json())
    .then(function(data) {
        console.log(data.data);
        const $img = document.createElement("img");
        const pTag = document.createElement("p");
        pTag.textContent = data.data.results[0].description;
        $img.setAttribute('src', data.data.results[0].thumbnail.path + '.jpg' );
        firstDiv.appendChild($img);
        secondDiv.appendChild(pTag);

        console.log(data.data.results[0].description);
    })

    
    const API_KEY = "5879ce89";
    // const OMDB_URL = `http://www.omdbapi.com/?apikey=${API_KEY}&t=Hollywood%20Party`;
    const OMDB_URL =  `https://www.omdbapi.com/?s=${input}&apikey=${API_KEY}&type=movie`;

    fetch(OMDB_URL)
    .then(function(response){return response.json();})
    .then(function(data) {
        console.log(data);
        const listEl = document.createElement("ol");
        
        for(let i=0; i<10; i++){
            let li = document.createElement("li");
            let text = data.Search[i].Title;
            console.log(text);
            li.textContent = text;
            listEl.appendChild(li);
        }
        thirdDiv.appendChild(listEl);
    })
    .catch(function(error){console.log(error);});
});






