document.addEventListener('DOMContentLoaded', () => {
let allDogs = []
let currentDog = null
let regDogsContainer = document.querySelector('#table-body')
const dogForm = document.querySelector('#dog-form')

  fetch('http://localhost:3000/dogs')
  .then( response => response.json() )
  .then( parsed => {
      allDogs = parsed
      regDogsContainer.innerHTML = renderDogs(allDogs)
  })

  regDogsContainer.addEventListener('click', function(e){
    e.preventDefault()
    if(e.target.tagName === "BUTTON"){
      currentDog = allDogs.find(dog => dog.id == e.target.dataset.id)
      dogForm.name.value = currentDog.name
      dogForm.breed.value = currentDog.breed
      dogForm.sex.value = currentDog.sex
    } //end of if stmt
  }) // end of click listener

  dogForm.addEventListener('submit', function(e){
    e.preventDefault()
    // console.log(currentDog);
    const origDog = allDogs.find(dog => {
      dog.id === currentDog.id
    })

    fetch(`http://localhost:3000/dogs/${currentDog.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        name: e.target.name.value,
        breed: e.target.breed.value,
        sex: e.target.sex.value
      })
    }) // end of fetch
    .then(r => r.json()) // next render to the DOM
    .then( newDog => {
      // console.log(newDog);
      dogIndex = allDogs.findIndex(dog => dog.id == newDog.id)
      allDogs[dogIndex].name = newDog.name
      allDogs[dogIndex].breed = newDog.breed
      allDogs[dogIndex].sex = newDog.sex
      console.log(newDog.name, newDog.breed, newDog.sex);

    let patchedDog = document.getElementById(newDog.id)
      console.log(patchedDog.children[0].innerText);
      patchedDog.children[0].innerText = newDog.name
      patchedDog.children[1].innerText = newDog.breed
      patchedDog.children[2].innerHTML = newDog.sex
    }) //end of 2nd then
  })
}) //end of dom

const renderDogs = (dogArray) => {
  return dogArray.map((dog) => dogHTML(dog)).join('')
}

const dogHTML = (dog) => {
  return `
  <tr id="${dog.id}">
  <td id="name-${dog.id}">${dog.name}</td>
  <td id="breed-${dog.id}">${dog.breed}</td>
  <td id="sex-${dog.id}">${dog.sex}</td>
  <td><button data-id=${dog.id}>Edit</button></td>
  </tr>
  `
}
