
function renderHeader() {

  //     <a class="navbar-item ${location.pathname === "/" ? "is-active" : ""
  // }" href="./">Home</a>
  //   <a class="navbar-item ${location.pathname === "/team.html" ? "is-active" : ""
  // }" href="./team.html">Team</a>

  document.body.insertAdjacentHTML(
    "afterbegin",
    `
  <nav class="navbar is-transparent p-3 pl-5 pr-5">
    <div class="container is-max-widescreen">
      <div class="navbar-brand">
        <a class="navbar-item" href="./">Zhutian Chen</a>
        <span
          id="navbar-burger-id"
          class="navbar-burger burger"
          data-target="navbarMenuHeroA"
          onclick="document.querySelector('.navbar-menu').classList.toggle('is-active');"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </span>
      </div>
  
      <div id="navbar-menu-id" class="navbar-menu">
        <div class="navbar-end">
        <a class="navbar-item" href="./blogs/">Blog</a>
        </div>
      </div>
    </div>
  </nav>`
  );
}

function renderFooter() {
  document.body.insertAdjacentHTML(
    "beforeend",
    `
    <footer class="footer has-text-centered">
    <p>
    All right reserved.
  </p>
  </footer>
    `
  );
}

function pubCard(data, authorLookup) {
  const authors = data.authors
    .split(",")
    .map((author) => {
      author = author.trim();

      return author === 'Zhutian Chen'
        ? `<strong>${author.replace(/\s+/g, "&nbsp;")}</strong>`
        : author.replace(/\s+/g, "&nbsp;");
    })
    .join(", ");

  const links = Object.keys(data.links)
    .map(key => ` <span>
    <a
      href="${data.links[key]}"
      target="_blank"
      rel="external"
      >${key}</a
    >
  </span>`).join('')

  return `
  <div class="pub-card">
  <div class="columns">
    <div class="column is-offset-1-mobile is-10-mobile">
      <figure class="image is-3by2">
        <img id="${data.id}" src="projects/${data.id}/${data.thumbnail}" />
      </figure>
    </div>

    <div class="column is-9">
      <div class="content">
        <p class="title">
          ${data.title}
        </p>
        <p class="authors">
          ${authors}
        </p>
        <p class="venue">
          <span class="short">${data.venue.short}</span>:
          <em>${data.venue.long}</em>, ${data.venue.year}
        </p>
        <p class="link">
          ${links}
        </p>
      </div>
    </div>
  </div>
</div>
  `
}

let allPubs = null

/**
 * 
 * @param {String[]} tags 
 */
async function loadAndRenderPublications(tags = []) {
  if (!allPubs) {
    // cache
    allPubs = await (await fetch("/assets/publications.json")).json();
  }
  // const pubs = await (await fetch("/assets/publications.json")).json();
  // const authors = await (await fetch("/assets/authors.json")).json();
  const pubs = tags.length > 0 ? allPubs.filter(pub => tags.some(tag => pub.tags.includes(tag))) : allPubs

  // clean existing
  document.querySelectorAll('.pub-card').forEach(item => item.remove())

  document.querySelector(".publications").insertAdjacentHTML(
    "beforeend",
    pubs.map((pub) => pubCard(pub, {})).join("")
  );

  pubs.filter(pub => pub.gif)
    .forEach(pub => {
      const id = pub.id
      const gifSrc = `projects/${id}/gif.gif`
      const img = new Image()

      const x = document.getElementById(id);
      let retry = 0

      img.onload = function () {
        x.src = img.src;
      };
      img.onerror = function () {
        if (retry < 5) {
          img.src = gifSrc
          ++retry
        }
      }
      img.src = gifSrc
    })
}

function tabWitcher() {
  const tabs = document.querySelectorAll('li.pub-category')
  tabs.forEach(tab => {
    tab.addEventListener('click', e => {
      document.querySelector('li.pub-category.is-active').classList.remove('is-active')
      tab.classList.add('is-active')
      // console.log(tab.value, e, tab)
      const tag = tab.dataset.value
      loadAndRenderPublications(tag ? [tag] : undefined)
    })
  })
}

/** Render the page */
renderHeader();

// if (location.pathname === "/") {
loadAndRenderPublications();
// } else if (location.pathname === "/team.html") {
//   loadAndRenderLabPeople();
// }

renderFooter();


/** Add event listeners */
tabWitcher()