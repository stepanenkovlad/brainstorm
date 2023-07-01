const btnStartNode = document.querySelector("#js-btn-start");
const btnStopNode = document.querySelector("#js-btn-stop");
const inputNode = document.querySelector("#js-input");
const outputNode = document.querySelector("#js-output");
const processNode = document.querySelector("#js-process");
const formNode = document.querySelector("#form");
const ideaInput = document.querySelector("#ideaInput");
const ideaList = document.querySelector("#ideaList");
const brainstormsList = document.querySelector("#braistormsList");
const nameInput = document.querySelector("#nameInput");
const choiceSection = document.querySelector("#js-choice");
const headerBtn = document.querySelector("#headerBtn");
const header = document.querySelector(".header");

let timeMinutes;
let timeSeconds;

let brainstorms = [];

// if (localStorage.getItem("brainstorms")) {
//   brainstorms = JSON.parse(localStorage.getItem("brainstorms"));
//   brainstorms.forEach((ideas, index) => {
//     let lastIndex = ideas.length - 1;
//     let name = ideas[lastIndex];
//     let string = "";

//     for (let i = 0; i < ideas.length - 1; i++) {
//       idea = ideas[i];
//       string += `${idea.text} `;
//     }

//     const text = `<li>
//     <div><b>${name.text} </b>
//     ${string}</div>

//     <div><button class='deleteBtn' data-action="delete" value='${index}'>Удалить</button><br></div>
//     </li>
//     `;
//     brainstormsList.insertAdjacentHTML("beforeend", text);
//   });
// }

if (localStorage.getItem("brainstorms")) {
  renderAfterNaming();
}

function renderAfterNaming() {
  brainstorms = JSON.parse(localStorage.getItem("brainstorms"));
  brainstorms.forEach((ideas, index) => {
    let lastIndex = ideas.length - 1;
    let name = ideas[lastIndex];
    let string = "";

    for (let i = 0; i < ideas.length - 1; i++) {
      idea = ideas[i];
      string += `${idea.text} `;
    }

    const text = `<li>
    <div><b>${name.text} </b>
    ${string}</div>
    
    <div><button data-action="copy">Скопировать</button><button class='deleteBtn' data-action="delete" value='${index}'>Удалить</button><br></div>
    </li>
    `;
    brainstormsList.insertAdjacentHTML("beforeend", text);
  });
}

let ideas = [];

btnStartNode.addEventListener("click", startTimer);
btnStartNode.addEventListener("click", openInput);
btnStopNode.addEventListener("click", stopTimer);
formNode.addEventListener("submit", addIdea);
nameInput.closest("form").addEventListener("submit", nameYourBrainstorm);
brainstormsList.addEventListener("click", deleteIdea);
brainstormsList.addEventListener("click", copyIdea);
headerBtn.addEventListener("click", openBrainstormlist);
let rotation = 0;
let isOpened = false;

function openBrainstormlist(event) {
  if (isOpened) {
    setTimeout(() => {
      choiceSection.classList.toggle("d-n");
    }, 500);
    isOpened = !isOpened;
  } else {
    choiceSection.classList.toggle("d-n");
    isOpened = !isOpened;
  }
  // const header = event.target.closest(".header");
  header.classList.toggle("header__opened");
  rotation += 180;
  headerBtn.style.transform = `rotate(${rotation}deg)`;
}

function startTimer() {
  timeMinutes = Number(inputNode.value);
  timeSeconds = timeMinutes * 60;

  if (timeMinutes <= 0 || timeMinutes > 100) {
    alert("Введите время от 1 до 100 минут");
    inputNode.value = "";
    inputNode.focus();
    return;
  }
  // btnStartNode.setAttribute("disabled", "disabled");
  // outputNode.classList.remove("d-n");

  headerBtn.classList.toggle("d-n");
  btnStopNode.classList.toggle("d-n");

  let hours = Math.trunc(timeSeconds / 60 / 60);
  let minutes = Math.trunc((timeSeconds / 60) % 60);
  let seconds = ((timeSeconds / 60) * 60) % 60;
  let finalStr = `${hours}:${minutes}:${seconds}`;
  outputNode.innerHTML = finalStr;
  timeSeconds--;

  const timer = () => {
    if (timeSeconds <= 0) {
      headerBtn.classList.toggle("d-n");
      btnStopNode.classList.toggle("d-n");

      clearInterval(interval);
      // outputNode.classList.add("d-n");
      if (ideas.length > 0) {
        nameInput.closest("section").classList.toggle("d-n");

        headerBtn.classList.toggle("header__btn_notclickable");
      } else {
        location.reload();
      }
    }
    let hours = Math.trunc(timeSeconds / 60 / 60);
    let minutes = Math.trunc((timeSeconds / 60) % 60);
    let seconds = Math.trunc(((timeSeconds / 60) * 60) % 60);

    let finalStr = `${hours}:${minutes}:${seconds}`;
    outputNode.innerHTML = finalStr;
    timeSeconds--;
  };
  let interval = setInterval(timer, 1000);

  inputNode.value = "";
}

function stopTimer() {
  timeSeconds = 0;
}

function openInput(event) {
  if (timeSeconds <= 0 || timeMinutes > 100) {
    return;
  }
  processNode.classList.toggle("d-n");
  // brainstormsList.classList.toggle("d-n");
  choiceSection.classList.toggle("d-n");
  const func = () => {
    if (timeSeconds < 0) {
      clearInterval(interval);
      processNode.classList.toggle("d-n");
    }
  };
  const interval = setInterval(func, 1000);
}

function addIdea(event) {
  event.preventDefault();

  const ideaText = ideaInput.value;
  ideaInput.value = "";
  ideaInput.focus();

  const idea = {
    text: ideaText,
  };

  ideas.push(idea);
  renderIdea(idea);
}

function renderIdea(idea) {
  const ideaHtml = `<li>${idea.text}</li>`;
  ideaList.insertAdjacentHTML("afterbegin", ideaHtml);
}

function addToBrainstorms(ideas) {
  brainstorms.push(ideas);
  localStorage.setItem("brainstorms", JSON.stringify(brainstorms));
}

function nameYourBrainstorm(event) {
  event.preventDefault();
  const nameText = nameInput.value;
  const idea = {
    text: nameText,
  };

  ideas.push(idea);
  addToBrainstorms(ideas);
  // location.reload();

  headerBtn.classList.toggle("header__btn_notclickable");
  resetEverything();
}

function resetEverything() {
  ideas = [];
  nameInput.closest("section").classList.toggle("d-n");
  brainstormsList.innerHTML = "";
  renderAfterNaming();
  choiceSection.classList.toggle("d-n");
  ideaList.innerHTML = "";
  nameInput.value = "";
  openBrainstormlist();
}

function deleteIdea(event) {
  if (event.target.dataset.action != "delete") {
    return;
  }
  let answer = confirm("Вы точно хотите удалить этот брейншторм?");
  if (!answer) {
    return;
  }
  const ideaLi = event.target.closest("li");
  const btnId = event.target.closest("button").value;
  brainstorms.splice(btnId, 1);
  ideaLi.remove();
  localStorage.setItem("brainstorms", JSON.stringify(brainstorms));
}

function copyIdea(event) {
  if (event.target.dataset.action != "copy") {
    return;
  }
  let parentEl = event.target.closest("li");
  let firstDiv = parentEl.querySelector("div");
  let r = new Range();
  r.selectNodeContents(firstDiv);
  window.getSelection().removeAllRanges();
  window.getSelection().addRange(r);
  document.execCommand("copy");
  window.getSelection().removeAllRanges();

  let text = "Скопирован!";
  event.target.innerHTML = text;
  event.target.classList.add("b");

  changeHtmlOnCOpy(parentEl);
}

function changeHtmlOnCOpy(li) {
  let siblings = [];
  let sibling = li;
  while (sibling.previousSibling) {
    sibling = sibling.previousSibling;
    sibling.nodeType == 1 && siblings.push(sibling);
  }
  sibling = li;
  while (sibling.nextSibling) {
    sibling = sibling.nextSibling;
    sibling.nodeType == 1 && siblings.push(sibling);
  }
  // return siblings;

  siblings.forEach((el) => {
    let btn = el.querySelector("button");
    btn.classList.remove("b");
    btn.innerHTML = "Скопировать";
  });
}

function render(index) {
  const ideaText = ``;
  brainstormsList.insertAdjacentHTML(
    "beforeend",
    `<button class='deleteBtn' value='${index}'>-</button><br>`
  );
}
