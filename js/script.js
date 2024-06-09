const siteNameInput = document.getElementById("siteName"),
  siteUrlInput = document.getElementById("siteUrl"),
  submitBtn = document.getElementById("submitForm"),
  contentContainer = document.getElementById("tableContent"),
  errorModalBtn = document.getElementById("openErrorModal"),
  nameRegex = /^\w{3,}(\s+\w+)*$/,
  urlRegex = /^(https?:\/\/)?(w{3}\.)?\w+\.\w{2,}\/?(:\d{2,5})?(\/\w+)*$/;

let bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];

function isValidValue(element, reg) {
  const testRegex = new RegExp(reg);
  if (testRegex.test(element.value)) {
    element.classList.remove("is-invalid");
    element.classList.add("is-valid");
  } else {
    element.classList.remove("is-valid");
    element.classList.add("is-invalid");
  }
}

function isAllowToSubmit() {
  const inputs = document.querySelectorAll("form input");
  for (let i = 0; i < inputs.length; i++) {
    if (inputs[i].value == "" || inputs[i].classList.contains("is-invalid")) {
      openErrorModal();
      return false;
    }
  }
  return true;
}

function displayBookmarks(marks) {
  contentContainer.innerHTML = "";
  if (marks.length > 0) {
    let content = "";
    for (let i = 0; i < marks.length; i++) {
      content += `<tr>
      <td>${i + 1}</td>
      <td>${marks[i].siteName}</td>
      <td>
        <a href="${setUrl(
          marks[i].siteUrl
        )}" class="btn btn-success visit-btn" id="visitBtn" target="_Blank"
          ><i class="fa-solid fa-eye pe-2"></i> Visit</a
        >
      </td>
      <td>
        <button data-index-number="${i + 1}" class="btn btn-danger delete-btn">
          <i class="fa-solid fa-trash-can"></i>Delete
        </button>
      </td>
    </tr>`;
    }
    contentContainer.innerHTML = content;
    resetiInputsValues();
    addDeleteEventToBtns();
  }
  addBookmarksToLocalStorage();
}

function resetiInputsValues() {
  siteNameInput.value = "";
  siteUrlInput.value = "";
  removeValidCalsses();
}

function removeValidCalsses() {
  siteNameInput.classList.remove("is-valid");
  siteUrlInput.classList.remove("is-valid");
}

function addDeleteEventToBtns() {
  const deleteBtns = document.querySelectorAll(".delete-btn");
  deleteBtns.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      deleteBookmark(e.target.dataset.indexNumber);
    });
  });
}

function deleteBookmark(index) {
  let newArr = [];
  for (let i = 0; i < bookmarks.length; i++) {
    if (index - 1 !== i) {
      console.log("Index - 1 !== i");
      newArr.push(bookmarks[i]);
    }
  }
  console.log(newArr);
  bookmarks = newArr;
  displayBookmarks(newArr);
}

function addBookmarksToLocalStorage() {
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
}

function openErrorModal() {
  errorModalBtn.click();
}

function setUrl(url) {
  let httpsRegex = /^https?:\/\//;
  if (httpsRegex.test(url)) {
    return url;
  } else {
    return `https://${url}`;
  }
}

window.onload = function () {
  displayBookmarks(bookmarks);
};

siteUrlInput.addEventListener("input", function () {
  isValidValue(siteUrlInput, urlRegex);
});

siteNameInput.addEventListener("input", function () {
  isValidValue(siteNameInput, nameRegex);
});

submitBtn.onclick = function (e) {
  e.preventDefault();
  if (isAllowToSubmit()) {
    const bookmark = {
      siteName: siteNameInput.value,
      siteUrl: siteUrlInput.value,
    };
    bookmarks.push(bookmark);
    displayBookmarks(bookmarks);
  }
};
