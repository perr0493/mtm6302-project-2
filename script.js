const $favItems = document.getElementById('fav-items')
const $favButton = document.getElementById('fav-button')
const $apodButton = document.getElementById('apod-button')
const $apodForm = document.getElementById('apod-form')
const $Content = document.getElementById('apod-content')
const $Date = document.getElementById('apod-date')



// favourite list

function addFavourites () {

    const newFav = []

        for(let i = 0; i < favobj.fav.length; i++ ) {

            newFav.unshift(`<li class="fav-item">
                <div>
                    <img src="${favobj.fav[i].url}" alt="" class="fav-img">
                </div>
                <div class="fav-text">
                    <h3 class="fav-header">${favobj.fav[i].title}</h3>
                    <p class="fav-date">${favobj.fav[i].date}</p>
                    <button class="fav-button" data-delete="${i}">Delete</button>
                </div>
            </li>`)

        }

    $favItems.innerHTML = newFav.join('')

}



// Async function to add new content 

async function addContent (e) {

    e.preventDefault()

    const nasaDate = $Date.value

    const fetchURL = `https://api.nasa.gov/planetary/apod?api_key=C2EN3jqUgKYZcp9c4lHzr7j8CzcddpJR1P6hmGUn&date=${nasaDate}`

    const response = await fetch(fetchURL)
    let nasa = await response.json()

    console.log(nasa.url)


    // If statement to check if it is an image or not

    if(nasa.media_type === "image") {

        $Content.innerHTML = `<img src="${nasa.url}" alt="content image" class="content-img" id="content-img">
        <div class="content-text">
            <h2 class="content-header">${nasa.title}</h2>
            <p class="content-date">${nasa.date}</p>
            <p class="content-desc">${nasa.explanation}</p>
            <button class="content-button" id="content-button">Save to Favourites</button>
        </div>
        <div class="apod-overlay" id="apod-overlay">
            <img src="${nasa.hdurl}" alt="content image" class="overlay-image" id="overlay-image">
        </div>`

    }

    else {
        $Content.innerHTML = `<h2 class="request">Please enter another date</h2>`
    }

    $apodForm.reset()

    const $apodOverlay = document.getElementById('apod-overlay')
    const $contentImg = document.getElementById('content-img')
    const $contentButton = document.getElementById('content-button')

    
    $contentImg.addEventListener('click', function (e) {
        $apodOverlay.classList.add('show')
    })

    $apodOverlay.addEventListener('click', function (e) {
        $apodOverlay.classList.remove('show')
    })

    // Pushing the content to favourites

    $contentButton.addEventListener('click', function (e) {

        favobj.fav.push({
            title : nasa.title,
            date : nasa.date,
            explanation : nasa.explanation,
            url : nasa.url,
            hdurl : nasa.hdurl,
        })

        addFavourites()

        localStorage.setItem('favobj', JSON.stringify(favobj))

    })

    localStorage.setItem('nasa', JSON.stringify(nasa))

}

let favobj = {
    fav : []
}

$apodForm.addEventListener('submit', addContent)

// Delete Button for Favourites

function deleteItem (e) {
    
    const $deleteButton = e.target.closest('[data-delete]')
    
        const deleteIndex = $deleteButton.dataset.delete
        favobj.fav.splice(deleteIndex, 1)
        console.log(deleteIndex)
        addFavourites()

    // update local storage

    localStorage.setItem('favobj', JSON.stringify(favobj))
}

$favItems.addEventListener('click', deleteItem)

// Local Storage

const lsdetails = localStorage.getItem('nasa')

if(lsdetails) {

    nasa = JSON.parse(lsdetails)

    $Content.innerHTML = `<img src="${nasa.url}" alt="content image" class="content-img" id="content-img">
    <div class="content-text">
        <h2 class="content-header">${nasa.title}</h2>
        <p class="content-date">${nasa.date}</p>
        <p class="content-desc">${nasa.explanation}</p>
        <button class="content-button" id="content-button">Save to Favourites</button>
    </div>
    <div class="apod-overlay" id="apod-overlay">
        <img src="${nasa.hdurl}" alt="content image" class="overlay-image" id="overlay-image">
    </div>`

    localStorage.setItem('nasa', JSON.stringify(nasa))

    const $contentButton = document.getElementById('content-button')

    $contentButton.addEventListener('click', function (e) {

        favobj.fav.push({
            title : nasa.title,
            date : nasa.date,
            explanation : nasa.explanation,
            url : nasa.url,
            hdurl : nasa.hdurl,
        })

        addFavourites()

        localStorage.setItem('favobj', JSON.stringify(favobj))

    })

}

const lsFav = localStorage.getItem('favobj')

if(lsFav) {

    favobj = JSON.parse(lsFav)

    addFavourites()

    $favItems.addEventListener('click', deleteItem)

}




