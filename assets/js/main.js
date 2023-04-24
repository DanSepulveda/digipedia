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

function main(data) {
  setListeners(data)
  drawCards(data)
}

function setListeners(data) {
  // listener for input, select and radio buttons
  const elements = ['searchInput', 'sortForm']
  elements.map((item) => {
    document
      .getElementById(item)
      .addEventListener('input', (event) => handleForm(event, data))
  })

  // listener to show/hide 'Go top' button
  const upButton = document.getElementById('return')
  window.addEventListener('scroll', () => handleScroll(upButton))

  // listener to go top
  upButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  })
}

function handleScroll(upButton) {
  const { className } = upButton
  const { pageYOffset } = window

  if (pageYOffset > 800 && className === 'hidden') {
    upButton.className = 'show'
  }
  if (pageYOffset <= 800 && className === 'show') {
    upButton.className = 'hidden'
  }
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
  return data.filter((item) =>
    item.name.toLowerCase().includes(name.toLowerCase())
  )
}

function sortByName(data, type = 'asc') {
  if (type === 'default') {
    return data
  }
  return data.sort((a, b) => {
    return type === 'desc'
      ? b.name.localeCompare(a.name)
      : a.name.localeCompare(b.name)
  })
}

function groupByLevel(data, type = 'group') {
  if (type === 'group') {
    const levels = {}
    data.forEach((item) => {
      levels[item.level]
        ? levels[item.level].push(item)
        : (levels[item.level] = [item])
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
      drawCategory(
        container,
        data[level],
        `${level} (${data[level].length})`,
        false
      )
    })
  } else {
    drawMessage(container, 'No results. Try another search')
  }
}

function drawCategory(container, data, title, lvlInfo = true) {
  const sectionTitle = document.createElement('h2')
  sectionTitle.innerText = title
  sectionTitle.className = 'text-center text-white mb-3 fs-1 fw-bold ls-1'
  container.appendChild(sectionTitle)
  const section = document.createElement('section')
  section.className = 'row'
  data.forEach((digimon) => drawCard(section, digimon, lvlInfo))
  container.appendChild(section)
}

function drawCard(container, digimon, lvlInfo) {
  const { name, img, level } = digimon
  const cardContainer = document.createElement('div')
  cardContainer.className = 'col-12 col-sm-6 col-lg-4 col-xl-3 col-xxl-2 p-3'
  const card = document.createElement('article')
  const title = document.createElement('h3')
  const image = document.createElement('img')
  card.className =
    'card d-flex flex-column align-items-center rounded bg-white shadow-sm'
  card.id = name
  title.textContent = name
  title.className = 'w-100 text-center py-3 bg-main-yellow fw-bold text-gray'
  image.src = img
  image.alt = `Imagen de ${name}`
  image.className = 'py-3 img-fluid'
  card.appendChild(title)
  card.appendChild(image)

  if (lvlInfo) {
    const lvl = document.createElement('p')
    lvl.textContent = level
    lvl.className = 'w-100 text-center py-1 bg-ternary'
    card.appendChild(lvl)
  }
  cardContainer.appendChild(card)
  container.appendChild(cardContainer)
  card.addEventListener('click', () => modal(digimon))
}

function drawMessage(container, message) {
  const messageContainer = document.createElement('article')
  messageContainer.className = 'd-flex justify-content-center pt-5'
  const box = document.createElement('article')
  box.innerText = message
  box.className = 'rounded text-center fs-3 bg-light text-gray py-4 px-3 w-100'
  messageContainer.appendChild(box)
  container.innerHTML = ''
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
  modalContainer.innerHTML =
    '<i class="fa-solid fa-circle-xmark" style="color: red"></i>'
  card.className = 'card card-h'
  card.id = name
  title.textContent = name
  image.src = img
  image.alt = `Imagen de ${name}`
  card.appendChild(title)
  card.appendChild(image)
  const anchor = document.createElement('button')
  anchor.innerText = 'Descargar'
  anchor.onclick = () => descargar(img)
  card.appendChild(anchor)
  modalContainer.appendChild(card)
}

async function descargar(url) {
  console.log(url)
  fetch(url, {
    mode: 'no-cors',
  })
    .then((response) => response.blob())
    .then((blob) => {
      console.log(blob)
      let blobUrl = window.URL.createObjectURL(blob)
      let a = document.createElement('a')
      a.download = url.replace(/^.*[\\\/]/, '')
      a.href = blobUrl
      document.body.appendChild(a)
      a.click()
      a.remove()
    })
}
