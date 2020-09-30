let doc = document.getElementsByClassName("wiki__input");
let articles = document.getElementsByClassName("wiki__articles");
let showMoreButton = document.getElementsByClassName("wiki__showButton");
let currentData = '';

doc[0].addEventListener('input', function(el) {
    currentData = el.target.value;
});

document.addEventListener('keyup', async function(event) {
        if(currentData.length === 0) {
          articles[0].classList.remove("wiki__articlesActive");
          showMoreButton[0].classList.remove("wiki__showButtonActive");
          articles[0].classList.remove("wiki__showMoreArticles");
          return;
        }
        let response = await fetch("https://en.wikipedia.org/w/api.php?format=json&action=query&generator=search&gsrnamespace=0&gsrlimit=50&prop=pageimages|extracts&pilimit=max&exintro&explaintext&exsentences=1&exlimit=max&gsrsearch="+currentData);
        if (response.ok) { 
            let doc = "";
            let json = await response.json();
            let len;
            if( json.query && json.query.pages) {
              len = json.query.pages.length;
            } else {
              articles[0].classList.remove("wiki__articlesActive");
              showMoreButton[0].classList.remove("wiki__showButtonActive");
              return;
            }
            for(let ui in json.query.pages) {
               doc += docs(json.query.pages[ui]);
            }
         
            articles[0].classList.add("wiki__articlesActive");
            showMoreButton[0].classList.add("wiki__showButtonActive");
            articles[0].innerHTML = doc;
          } else {
            alert("Ошибка HTTP: " + response.status);
          }
});

showMoreButton[0].addEventListener('click', function(event) {
  articles[0].classList.add("wiki__showMoreArticles");

});

function cleanData() {
  articles[0].classList.remove("wiki__articlesActive");
  showMoreButton[0].classList.remove("wiki__showButtonActive ");
  articles[0].classList.remove("wiki__showMoreArticles");
}

const docs = (data) => {
    return `
    <div class="wiki__articleItem">
        <div class="wiki__articleImg"><img src="${data.thumbnail ? data.thumbnail.source : ''}"></div>
        <div class="wiki__articleBody">
          <h2 class="wiki__title">${data.title}</h2>
          <div class="wiki__text">${data.extract ? data.extract : ''}</div>
        </div>
    </div>
`
}
