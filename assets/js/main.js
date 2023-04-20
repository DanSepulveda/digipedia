;(function () {
  const container = document.getElementById('results')
  drawMessage(container, 'Getting data...')
  fetch('https://digimon-api.vercel.app/api/digimon')
    .then((data) => data.json())
    .then((data) => main(data))
    .catch(() => {
      drawMessage(container, 'Somenthing went wrong. Try again later')
    })
})()

function main(digimons) {
  setListeners(digimons)
  drawCards(digimons)
}

function setListeners(digimons) {
  // listener for input, select and radio buttons
  const elements = ['searchInput', 'sortForm']
  elements.map((item) => {
    document.getElementById(item).addEventListener('input', (event) => handleForm(event, digimons))
  })

  // listener to show/hide 'Go top' button
  window.addEventListener('scroll', handleScroll)

  // listener to go top
  document.getElementById('return').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  })
}

function handleScroll() {
  const upButton = document.getElementById('return')
  const { className } = upButton
  const { pageYOffset } = window
  //   console.log(pageYOffset)
  //   console.log(upButton.className)
  if (pageYOffset > 800 && className === 'hidden') {
    upButton.className = 'show'
  }
  if (pageYOffset <= 800 && className === 'show') {
    // upButton.classList.toggle('hidden')
    upButton.className = 'hidden'
  }
  // if(pageYOffset)
  //   console.log(display)
  //   const result = window.pageYOffset > 800 ? 'flex' : 'none'
  //   upButton.style.display = result
}

function handleForm(event, data) {
  const form = new FormData(event.target.form)
  const formData = Object.fromEntries(form)
  const filteredData = readFilters(formData, data)
  drawCards(filteredData)
}

function readFilters(formData, data) {
  const { search, sortBy, groupBy } = formData
  const searched = filterByName(data, search)
  const ordered = sortByName(searched, sortBy)
  return groupByLevel(ordered, groupBy)
}

function filterByName(data, name) {
  return data.filter((item) => item.name.toLowerCase().includes(name.toLowerCase()))
}

function sortByName(data, type = 'asc') {
  if (type === 'default') {
    return data
  }
  return data.sort((a, b) => {
    return type === 'desc' ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name)
  })
}

function groupByLevel(data, type = 'group') {
  if (type === 'group') {
    const levels = {}
    data.forEach((item) => {
      levels[item.level] ? levels[item.level].push(item) : (levels[item.level] = [item])
    })
    return levels
  }
  return data
}

function drawCards(data) {
  const container = document.getElementById('results')
  container.innerHTML = ''

  if (data.length) {
    drawCategory(container, data, `Digimon's List (${data.length})`)
  } else if (Object.keys(data).length) {
    Object.keys(data).map((level) => {
      drawCategory(container, data[level], `${level} (${data[level].length})`, false)
    })
  } else {
    drawMessage(container, 'No results. Try another search')
  }
}

function drawCategory(container, data, title, lvlInfo = true) {
  const sectionTitle = document.createElement('h2')
  sectionTitle.innerText = title
  container.appendChild(sectionTitle)
  const section = document.createElement('section')
  section.className = 'digimons'
  data.forEach((digimon) => drawCard(section, digimon, lvlInfo))
  container.appendChild(section)
}

function drawCard(container, digimon, lvlInfo) {
  const { name, img, level } = digimon
  const card = document.createElement('article')
  const title = document.createElement('h3')
  const image = document.createElement('img')
  card.className = 'card'
  card.id = name
  title.textContent = name
  image.src = img
  image.alt = `Imagen de ${name}`
  card.appendChild(title)
  card.appendChild(image)

  if (lvlInfo) {
    const lvl = document.createElement('p')
    lvl.textContent = level
    card.appendChild(lvl)
  }
  container.appendChild(card)
  card.addEventListener('click', () => modal(digimon))
}

function drawMessage(container, message) {
  const messageContainer = document.createElement('article')
  messageContainer.className = 'message-box'
  const box = document.createElement('article')
  box.innerText = message
  messageContainer.appendChild(box)
  container.appendChild(messageContainer)
}

function modal(digimon) {
  console.log('me ejecuto')
  const { name, img, level } = digimon
  const modalContainer = document.getElementById('modal')
  modalContainer.classList.toggle('hide')
  const card = document.createElement('article')
  const title = document.createElement('h3')
  const image = document.createElement('img')
  // card.className = 'card'
  card.id = name
  title.textContent = name
  image.src = img
  image.alt = `Imagen de ${name}`
  card.appendChild(title)
  card.appendChild(image)
  modalContainer.appendChild(card)
}
