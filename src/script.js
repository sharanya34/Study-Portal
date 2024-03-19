let jsonData;
let selection = 'test';
let adminMode = false;
const JSON_FILE_PATH = "../assets/data/card.json";

function fetchData() {
    fetch(JSON_FILE_PATH)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            jsonData = data;
            updateUI();
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

function toggleAdminMode() {
    adminMode = !adminMode;
    updateUI();
}

function deleteCard(index) {
    if (index >= 0 && index < jsonData.card[selection].length) {
        jsonData.card[selection].splice(index, 1);
        saveDataToFile(JSON_FILE_PATH, jsonData); // Save the updated JSON data
        updateUI(); // Update the UI after deleting the card
    }
}


function btn(buttonNumber) {
    const button1 = document.getElementById('test');
    const button2 = document.getElementById("production");

    if (buttonNumber === 1) {
        button1.classList.add('active');
        button2.classList.remove("active");
        selection = 'test';
    } else {
        button2.classList.add('active');
        button1.classList.remove("active");
        selection = 'production';
    }
    updateUI();
}

function addNewCard(url, imageName, text, imageDataURL) {
    if (!jsonData) {
        jsonData = { card: { test: [], production: [] } };
    }

    if (!jsonData.card[selection]) {
        console.error(`Invalid selection: ${selection}`);
        return;
    }

    const newCard = {
        url: url,
        imageName: imageName,
        text: text,
        imageDataURL: imageDataURL
    };

    jsonData.card[selection].push(newCard);

    saveDataToFile('card.json', jsonData);

    return newCard;
}

function saveDataToFile(filename, data) {
    fetch(filename, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => {
        if (!response.ok) {
            throw new Error('Error updating data');
        }
    }).catch(error => {
        console.error('Error saving data:', error);
    });
}

function updateUI() {
    const container = document.getElementById("container");
    container.innerHTML = "";
    if (!jsonData || !jsonData.card) {
        console.error("Invalid JSON data format");
        return;
    }

    const selectedData = jsonData.card[selection];

    if (!selectedData || !Array.isArray(selectedData)) {
        console.error(`Invalid data for ${selection}`);
        return;
    }

    const cardsPerRow = 7;
    const totalCards = selectedData.length;

    for (let i = 0; i < totalCards; i++) {
        const cardData = selectedData[i];
        const card = document.createElement("div");
        card.classList.add("card");

        if (i === 0) {
            card.classList.add("leftedge-card");
        } else if (i === cardsPerRow - 1 || i === totalCards - 1) {
            card.classList.add("rightedge-card");
        }

        const image = document.createElement("img");
        if (cardData.imageDataURL) {
            image.src = cardData.imageDataURL; // Use imageDataURL if available
        } else if (cardData.imageName) {
            image.src = cardData.imageName; // Use imageName if available
        }
        image.alt = cardData.text;

        const cardText = document.createElement("p");
        const commonText = document.createTextNode("Please ");
        const anchor = document.createElement("a");
        anchor.href = cardData.url;
        anchor.textContent = "click here";
        const commonText1 = document.createTextNode(" to learn ");
        const jsonDataText = document.createTextNode(cardData.text);

        cardText.appendChild(commonText);
        cardText.appendChild(anchor);
        cardText.appendChild(commonText1);
        cardText.appendChild(jsonDataText);

        card.appendChild(image);
        card.appendChild(cardText);

        if (adminMode) {
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'x';
            deleteButton.classList.add("delete");
            deleteButton.addEventListener('click', () => deleteCard(i));
            card.appendChild(deleteButton);
        }

        container.appendChild(card);

        if ((i + 1) % cardsPerRow === 0) {
            const newRow = document.createElement("div");
            newRow.classList.add("row");
            container.appendChild(newRow);
        }
    }

    const i_button = document.getElementById("i-button");
    const popup = document.getElementById("popup");
    const closeButton = document.getElementById("close");

    i_button.addEventListener("click", () => {
        popup.style.display = "flex";
    });

    closeButton.addEventListener("click", () => {
        popup.style.display = "none";
    });
}

const saveButton = document.querySelector("#save");
saveButton.addEventListener("click", () => {
    const urlInput = document.getElementById("url").value;
    const textInput = document.getElementById("text").value;
    const imageInput = document.getElementById("imageInput").files[0];

    if (!urlInput || !textInput || !imageInput) {
        alert("Please fill in all fields");
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        const imageDataURL = e.target.result;

        const newCard = addNewCard(urlInput, imageInput.name, textInput, imageDataURL);

        document.getElementById("url").value = "";
        document.getElementById("text").value = "";
        document.getElementById("imageInput").value = "";

        document.getElementById("popup").style.display = "none";

        updateUI(); // Update the UI immediately after adding a new card
    };

    reader.readAsDataURL(imageInput);
});

fetchData();
