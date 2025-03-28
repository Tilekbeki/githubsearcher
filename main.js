const input = document.querySelector('.searcher-block__input')

const debounce = (fn, debounceTime) => {
	let timeOut
	return function (...args) {
		clearTimeout(timeOut)
		timeOut = setTimeout(() => fn.apply(this, args), debounceTime)
	}
}

function addToList(element, repositoryName, repositoryOwner, repositoryStars) {
	element.addEventListener('click', e => {
		e.preventDefault()

		// Очищаем поле ввода и список автокомплита
		input.value = ''
		document.querySelector('.searcher-block__list').innerHTML = ''

		let myelement = document.createElement('div')
		let createCloseBtn = document.createElement('div')
		createCloseBtn.classList.add('collected-repository-close')
		createCloseBtn.title = 'Удалить репозиторий'

		myelement.innerHTML = `
      <div class="collected-repository-info">
        <div class="collected-repository__name">Name: ${repositoryName}</div>
        <div class="collected-repository__owner">Owner: ${repositoryOwner}</div>
        <div class="collected-repository__stars">Stars: ${repositoryStars}</div>
      </div>
    `

		myelement.appendChild(createCloseBtn)
		myelement.classList.add('collected-repository')

		createCloseBtn.addEventListener('click', e => {
			e.stopPropagation()
			myelement.remove()
		})

		const newlist = document.querySelector('.collected-repositories')
		newlist.append(myelement)
	})
}

async function autoComplitApi(value) {
	if (!value.trim()) {
		document.querySelector('.searcher-block__list').innerHTML = ''
		return
	}

	try {
		let response = await fetch(
			`https://api.github.com/search/repositories?q=${value}`,
			{ method: 'GET' }
		)

		if (!response.ok) {
			throw new Error(`Ошибка HTTP: ${response.status}`)
		}

		let json = await response.json()
		document.querySelector('.searcher-block__list').innerHTML = ''

		// Ограничиваем количество результатов и проверяем их наличие
		const items = json.items.slice(0, 5)
		if (items.length === 0) {
			return
		}

		items.forEach(item => {
			createElement(
				'.searcher-block__list',
				'a',
				'link',
				item.name,
				item.owner.login,
				item.stargazers_count
			)
		})
	} catch (error) {
		console.error('Ошибка при загрузке данных:', error)
		// Можно добавить отображение ошибки пользователю
	}
}

function createElement(
	parentElement,
	tagElement,
	classElement,
	repositoryName,
	repositoryOwner,
	repositoryStars
) {
	let element = document.createElement(tagElement)
	element.classList.add(classElement)
	element.textContent = repositoryName
	element.setAttribute('data-repository-name', repositoryName)
	element.setAttribute('data-repository-owner', repositoryOwner)
	element.setAttribute('data-repository-stars', repositoryStars)
	const parent = document.querySelector(parentElement)

	parent.append(element)
	addToList(element, repositoryName, repositoryOwner, repositoryStars)
}

const debouncedApi = debounce(autoComplitApi, 1000)

input.addEventListener('input', e => {
	debouncedApi(e.target.value)
})

input.addEventListener('change', e => {
	if (!e.target.value.trim()) {
		document.querySelector('.searcher-block__list').innerHTML = ''
	}
})
