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
		let myelement = document.createElement('div')
		let createCloseBtn = document.createElement('div')
		createCloseBtn.classList.add('collected-repository-close')

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
			myelement.remove()
		})

		const newlist = document.querySelector('.collected-repositories')
		newlist.append(myelement)
	})
}
console.log('sosite')

async function autoComplitApi(value) {
	console.log(value)
	if (!value.trim()) {
		document.querySelector('.searcher-block__list').innerHTML = ''
	} else {
		let response = await fetch(
			`https://api.github.com/search/repositories?q=${value}`,
			{
				method: 'GET',
			}
		)

		if (response.ok) {
			let json = await response.json()
			console.log(json)
			let nameList = json.items.map(e => e)
			console.log(nameList)
			document.querySelector('.searcher-block__list').innerHTML = ''
			for (let i = 0; i < 5; i++) {
				createElement(
					'.searcher-block__list',
					'a',
					'link',
					nameList[i].name,
					nameList[i].owner.login,
					nameList[i].stargazers_count
				)
			}
		} else {
			alert('Ошибка HTTP: ' + response.status)
		}
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
	console.log('value', e.target.value)
	debouncedApi(e.target.value)
})

input.addEventListener('change', e => {
	if (!e.target.value.trim()) {
		document.querySelector('.searcher-block__list').innerHTML = ''
	}
})
