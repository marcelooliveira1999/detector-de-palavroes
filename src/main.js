import { palavroes } from "./modules/db_palavroes.js";
import { palavras } from "./modules/db_palavras.js";
import { typesEmails } from "./modules/db_emails.js";

const messageContent = document.getElementById("message-content");
const messages = document.getElementById("messages");
const getUserMessage = document.getElementById("button-submit");
let finalMessage = "";

const regex = ["@", "#", "$", "&", "%", "*", "0", "1", "3", "4"];

function messageVerification() {
  let initialMessage = messageContent.value || "Nenhuma mensagem digitada";
  let messageForVerification = initialMessage
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  messageContent.value = "";

  const messageArr = messageForVerification.split(" ");

  function strTransform(value, srtIndex) {
    let num = value.length;
    value = "";

    for (let i = 0; i < num; i++) {
      value += "*";
    }

    messageArr[srtIndex] = value;
  }

  palavroes.forEach((element) => {
    messageArr.forEach((value, index) => {
      let strValue = value.split("");
      let exist = false;
      let notBadWord = false;
      let isEmail = false;

      strValue.filter((char) => (char == "-" ? (exist = true) : false));
      palavras.filter((word) => (word == value ? (notBadWord = true) : false));
      typesEmails.filter((emails) => (value.endsWith(emails) ? (isEmail = true) : false));

      strValue.forEach((char) => {
        regex.forEach((charInRegex) => {
          if (char != charInRegex) return;
          if (isEmail) return;
          if (isNaN(value) == false) return;

          strTransform(value, index);
        });
      });

      if (!value.includes(element)) return;

      if (notBadWord) return;
      if (exist) return;

      strTransform(value, index);
    });
  });

  const initialMessageArr = initialMessage.split(" ");
  messageArr.forEach((str, index) => {
    if (str.includes("**") == false) return;

    initialMessageArr[index] = str;
  });

  finalMessage = initialMessageArr.reduce((acc, valorAtual) => acc + valorAtual + " ", " ");

  messages.innerHTML += `<p class="message">${finalMessage}</p>`;
}

messageContent.addEventListener("keydown", (e) => {
  if (e.code == "Enter") messageVerification();
});

getUserMessage.addEventListener("click", messageVerification);
