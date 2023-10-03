import { palavroes } from "./modules/db_palavroes.js";
import { palavras } from "./modules/db_palavras.js";

const messageContent = document.getElementById("message-content");
const messages = document.getElementById("messages");
const getUserMessage = document.getElementById("button-submit");
let finalMessage = "";

function messageVerification() {
  let initialMessage = messageContent.value || "Nenhuma mensagem digitada";
  let messageForVerification = initialMessage
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  messageContent.value = "";

  const regex = ["@", "#", "$", "&", "%", "*", "0", "1", "3", "4"];
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

      strValue.forEach((char) => {
        regex.forEach((charInRegex) => {
          if (char != charInRegex) return;
          if (value.endsWith(".com")) return;
          if (isNaN(value) == false) return;

          strTransform(value, index);
        });
      });

      if (!value.includes(element)) return;

      strValue.filter((val) => (val == "-" ? (exist = true) : false));
      palavras.filter((val) => (val == value ? (notBadWord = true) : false));

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

  finalMessage = initialMessageArr.reduce(
    (acc, valorAtual) => acc + valorAtual + " ",
    " "
  );

  messages.innerHTML += `<p class="message">${finalMessage}</p>`;
}

messageContent.addEventListener("keydown", (e) => {
  if (e.code == "Enter") messageVerification();
});

getUserMessage.addEventListener("click", messageVerification);
