"use strict";
//Variables
const apiUrl = "https://api.quotable.io/random?minLength=300&maxLength=400";
const textArea = document.getElementById("text");
const textField = document.getElementById("text-field");

let text = "";
let time = 60;
let timer = "";
let mistake = 0;

//Display Random Text
const renderNewText = async() => {
    textArea.innerHTML = "";
    //Fetch Text From Url
    const response = await fetch(apiUrl);
    //Store Response
    let data = await response.json();
    //Access Text
    text = data.content;
    //Array Of Characters In The Text
    let arr = text.split("").map((value) => {
        //Wrap The Characters In A Span Tag
        return "<span class='text-char'>" + value + "</span>";
    });
    //Join Array In Order To Display
    textArea.innerHTML += arr.join("");
};

window.onload = () => {
    textField.value = "";
    document.getElementById("start").style.display = "block";
    document.getElementById("try-again").style.display = "none";
    textField.disabled = true;
    renderNewText();
};

//Logic
textField.addEventListener("input", () => {
    let textChar = document.querySelectorAll(".text-char");
    textChar = Array.from(textChar);
    let textFieldChars = textField.value.split("");
    textChar.forEach((char, index) => {
        if(char.innerHTML == textFieldChars[index]) {
            char.classList.add("pass");
        }
        else if(textFieldChars[index] == null) {
            if(char.classList.contains("pass")) {
                char.classList.remove("pass");
            } else {
                char.classList.remove("fail");
            }
        } else {
            if(!char.classList.contains("fail")) {
                mistake += 1;
                char.classList.add("fail");
            }
            document.getElementById("mistake").innerHTML = mistake;
        }
        //If All Characters Are Entered
        let checkAll = textChar.every(element => {
            return element.classList.contains("fail") || element.classList.contains("pass");
        });
        //End Test If All Entered
        if (checkAll) {
            display();
        }

    });
});

//Update Timer
function timerUpdate() {
    if(time == 0) {
        display();
    } else {
        document.getElementById("timer").innerHTML = --time + "s";
    }
};

//Timer
const timeDecrement = () => {
    time = 60;
    timer = setInterval(timerUpdate, 1000);
};

//Display The Result
const display = () => {
    document.getElementById("results").style.display = "block";
    clearInterval(timer);
    document.getElementById("try-again").style.display = "block";
    document.getElementById("start").style.display = "none";
    textField.disabled = true;
    let timeTaken = 1;
    if(time != 0) {
        timeTaken = (60 - time) / 100;
    }
    document.getElementById("accuracy").innerHTML = Math.round(((textField.value.length - mistake) / textField.value.length) * 100) + "%";
    document.getElementById("wpm").innerHTML = Math.round((textField.value.length) / 5 / timeTaken);
};

//Start The Test
const start = () => {
    clearInterval(timer);
    renderNewText();
    timeDecrement();
    mistake = 0;
    textField.value = "";
    textField.disabled = false;
    document.getElementById("start").style.display = "none";
    document.getElementById("try-again").style.display = "block";
    document.getElementById("results").style.display = "none";
    document.getElementById("timer").innerHTML = 0 + "s";
    document.getElementById("mistake").innerHTML = 0;
};