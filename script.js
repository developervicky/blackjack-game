let blackjackGame = {
    'you': { 'scoreSpan': '#yourbjcount', 'div': '#yourbox', 'score': 0 },
    'dealer': { 'scoreSpan': '#dealerbjcount', 'div': '#dealerbox', 'score': 0 },
    'cards': ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'K', 'J', 'Q', 'A'],
    'cardsmap': { '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'K': 10, 'J': 10, 'Q': 10, 'A': [1, 11] },
    'wins': 0,
    'losses': 0,
    'draws': 0,
    'isStand': false,
    'turnsover': false,

    
}

const YOU = blackjackGame['you']
const DEALER = blackjackGame['dealer']

const hitsound = new Audio('blackjack_assets1/sounds/swish.m4a');
const winsound = new Audio('blackjack_assets1/sounds/cash.mp3');
const losssound = new Audio('blackjack_assets1/sounds/aww.mp3');

document.querySelector('#bjhit').addEventListener('click', blackjackhit);
document.querySelector('#bjstand').addEventListener('click', blackjackstand);
document.querySelector('#bjdeal').addEventListener('click',blackjackdeal);

function blackjackhit() {
    if (blackjackGame['isStand'] === false) {
        let card = randomcard();
        showcard(card, YOU);
        updatescore(card, YOU);
        console.log(updatescore); 
        showscore(YOU );
        console.log(showscore);
    }

}

function blackjackdeal() {
    //let winner = computewinner();
   // showresult(winner);
    //showresult(computewinner());

    if (blackjackGame['turnsover'] === true) {

        blackjackGame['isStand'] = false;
        let yourimages = document.querySelector('#yourbox').querySelectorAll('img');
        let dealerimages = document.querySelector('#dealerbox').querySelectorAll('img');
    
    
        for (i = 0; i < yourimages.length; i++) {
            yourimages[i].remove();
        }

        for (i = 0; i < dealerimages.length; i++) {
            dealerimages[i].remove();
        }

        YOU['score'] = 0;
        DEALER['score'] = 0;

        document.querySelector('#yourbjcount').textContent = 0;
        document.querySelector('#dealerbjcount').textContent = 0;

        document.querySelector('#yourbjcount').style.color = '#ffffff';
        document.querySelector('#dealerbjcount').style.color = '#ffffff';

        document.querySelector('#head2').textContent = "Let's Play";
        document.querySelector('#head2').style.color = 'black';

        
        blackjackGame['turnsover'] = true;
        blackjackGame['isStand'] = false;

         
    }

}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


async function blackjackstand() {
    blackjackGame['isStand'] = true;

    while (DEALER['score'] < 16 && blackjackGame['isStand'] === true) {
        let card = randomcard();
        showcard(card, DEALER);
        updatescore(card, DEALER);
        showscore(DEALER);
        await sleep(1000);
    }
    
    blackjackGame['turnsover'] = true;
    let winner = computewinner();
    showresult(winner);

}

function showcard(card, activePlayer) {
    if (activePlayer['score'] <= 21) {
        let cardImage = document.createElement('img');
        cardImage.src = `blackjack_assets1/images/${card}.png`;
        document.querySelector(activePlayer['div']).appendChild(cardImage);
        hitsound.play();
    }

}

function randomcard() {
    let randomindex = Math.floor(Math.random() * 13);
    return blackjackGame['cards'][randomindex];
}

function updatescore(card, activePlayer) {

    if (card === 'A') {

        if (activePlayer['score'] + blackjackGame['cardsmap'][card][1] <= 21) {
            activePlayer['score'] += blackjackGame['cardsmap'][card][1];
        }
        else {
            activePlayer['score'] += blackjackGame['cardsmap'][card][0];
        }
    }
    else {
        activePlayer['score'] += blackjackGame['cardsmap'][card];
    }
    
}

function showscore(activePlayer) {
    if (activePlayer['score'] > 21) {
        document.querySelector(activePlayer['scoreSpan']).textContent = 'BUST';
        document.querySelector(activePlayer['scoreSpan']).style.color = 'red';
    } else {
        document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score'];
    }
}

function computewinner() {
    
     let winner;

    if (YOU['score'] <= 21) {
       
        if (YOU['score'] > DEALER['score'] || (DEALER['score'] > 21)) {
            console.log('You Won!');
            blackjackGame['wins']++;
            winner = YOU;
    
        } else if (YOU['score'] < DEALER['score']) {
            console.log('You Lost!');
            blackjackGame['losses']++;
            winner = DEALER;
    
        } else if (YOU['score'] === DEALER['score']) {
            console.log('You Drew!');
            blackjackGame['draws']++;
        }

    }
    else if (YOU['score'] > 21 && DEALER['score'] <= 21) {
        console.log('You Lost!');
        blackjackGame['losses']++;
        winner = DEALER;
    
    } else if (YOU['score'] > 21 && DEALER['score'] > 21) {
        console.log('You Drew!');
        blackjackGame['draws']++;
    }

    console.log('Winner is', winner);
    return winner; 

}

function showresult(winner) {
    let message, messagecolor;

    if (blackjackGame['turnsover'] === true) {
        
        if (winner === YOU) {
            document.querySelector('#wins').textContent = blackjackGame['wins'];
            message = 'YOU WON !';
            messagecolor = 'green';
            winsound.play();
        }
        else if (winner === DEALER) {
            document.querySelector('#losses').textContent = blackjackGame['losses'];
            message = 'YOU LOST !';
            messagecolor = 'red';
            losssound.play();
        }
        else {
            document.querySelector('#draws').textContent = blackjackGame['draws'];
            message = 'YOU DREW !';
            messagecolor = 'black';
        }
    }




    document.querySelector('#head2').textContent = message;
    document.querySelector('#head2').style.color = messagecolor;
}

