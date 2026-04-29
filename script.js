//Intro Text & Sound Setup
const introText = "Discover what the stars have written for you today by uncovering the hidden connection between your two names.";
let typeIndex = 0;
const typeSpeed = 80; 

// Create an object to hold the sound files for each result
const resultSounds = {
    "Friends": new Audio("sounds/friends.mp3"),
    "Love": new Audio("sounds/love.mp3"),
    "Affection": new Audio("sounds/affection.mp3"),
    "Marriage": new Audio("sounds/marriage.mp3"),
    "Enemies": new Audio("sounds/enemies.mp3"),
    "Siblings": new Audio("sounds/siblings.mp3")
};

//Typewriter Intro
function typeWriter() {
    if (typeIndex < introText.length) {
        document.getElementById("typewriter-text").innerHTML += introText.charAt(typeIndex);
        typeIndex++;
        setTimeout(typeWriter, typeSpeed);
    } else {
        document.getElementById("start-btn").style.display = "inline-block";
        document.getElementById("start-btn").style.animation = "fadeIn 1s ease";
    }
}

window.onload = typeWriter;

//Navigation & Theme Logic
function switchScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

function setTheme(gender) {
    document.body.className = `theme-${gender}`; 
    switchScreen('screen-input');
}

//  FLAMES Logic & Animation 
async function startAnimation() {
    let rawName1 = document.getElementById('name1').value.toUpperCase().replace(/\s/g, '');
    let rawName2 = document.getElementById('name2').value.toUpperCase().replace(/\s/g, '');

    if (!rawName1 || !rawName2) {
        alert("Please enter both names!");
        return;
    }

    switchScreen('screen-animation');
    
    let div1 = document.getElementById('display-name1');
    let div2 = document.getElementById('display-name2');
    div1.innerHTML = '';
    div2.innerHTML = '';

    let arr1 = rawName1.split('');
    let arr2 = rawName2.split('');

    arr1.forEach((char, i) => {
        let span = document.createElement('span');
        span.innerText = char;
        span.id = `n1-${i}`;
        div1.appendChild(span);
    });

    arr2.forEach((char, i) => {
        let span = document.createElement('span');
        span.innerText = char;
        span.id = `n2-${i}`;
        div2.appendChild(span);
    });

    let marked1 = new Array(arr1.length).fill(false);
    let marked2 = new Array(arr2.length).fill(false);

    for (let i = 0; i < arr1.length; i++) {
        if (marked1[i]) continue;
        
        for (let j = 0; j < arr2.length; j++) {
            if (!marked2[j] && arr1[i] === arr2[j]) {
                marked1[i] = true;
                marked2[j] = true;
                
                await new Promise(resolve => setTimeout(resolve, 500)); 
                
                document.getElementById(`n1-${i}`).classList.add('strike');
                document.getElementById(`n2-${j}`).classList.add('strike');
                break; 
            }
        }
    }

    let remainingCount = marked1.filter(m => !m).length + marked2.filter(m => !m).length;
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    showFinalResult(remainingCount);
}

function showFinalResult(count) {
    const flamesWords = ["Friends", "Love", "Affection", "Marriage", "Enemies", "Siblings"];
    let flames = [...flamesWords];
    
    let pos = 0;
    
    while (flames.length > 1) {
        pos = (pos + count - 1) % flames.length;
        flames.splice(pos, 1);
    }

    let finalAnswer = flames[0];

    // Show the result on screen
    document.getElementById('final-result').innerText = finalAnswer;
    switchScreen('screen-result');

    // Play the specific sound for that result
    if (resultSounds[finalAnswer]) {
        // Reset the audio to the beginning just in case it was played before
        resultSounds[finalAnswer].currentTime = 0; 
        resultSounds[finalAnswer].play().catch(error => {
            console.log("Browser blocked autoplay. The user must interact with the document first.", error);
        });
    }
}

function resetGame() {
    document.getElementById('name1').value = '';
    document.getElementById('name2').value = '';
    document.body.className = ''; 
    
    // Stop any playing sounds
    Object.values(resultSounds).forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
    });

    switchScreen('screen-gender'); 
}
