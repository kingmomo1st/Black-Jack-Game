// Blackjack
// Deal Blackjack on a timer with setInterval
// Keep score and display the score to the DOM
// Detect Blackjack (21) for the Player, the Dealer -- or both
// Prompt Player to Hit or Stand

// Arrays for making and storing the cards:
const kinds = [2, 3, 4, 5, 6, 7, 8, 9, 10, 'Jack', 'Queen', 'King', 'Ace'];
const suits = ['Diamonds', 'Hearts', 'Spades', 'Clubs'];
const deck = [];

let holeCard = ""; // global variable for hole card file name
// hole card needs to be in global scope, since it is used by
// two diffent functions, namely deal() and stand()

// Set up a nested for loop that iterates over 
// the kinds and suits arrays:
kinds.forEach(k => {
    suits.forEach(s => {
        // make a card in all 4 suits for this kind: 2 of Diamonds, 2 of Hearts etc.
        // Concatenate the card name and image file names:
        // - name "Queen of Diamonds" corresponds to file "Queen-of-Diamonds.png"
        // let name = `${k} of ${s}`;
        // let file = `${k}-of-${s}.png`;

        // eclare a variable, valu, with an inital value of 0;
        // - valu is for storing the numeric value of the card
        // let valu = 0;

        // Set the valu property based on the kind of card
        // - the length of the kind string reveals if it is a face card
        // as only "Jack", "Queen", "King" have more than 3 characters
        
        if(k == "Ace") {
            valu = 11;
        } else if(k.length >= 4) {
            valu = 10;
        } else {
            valu = k;
        }
        
        // ternary version of the above: an if-else if-else ternary
        // to not get confused, remember: just alternate ? : ? :
        // let valu = k == "Ace" ? 11 : k.length >= 4 ? 10 : k;

        // Each card is an object with 5 properties:
        /* 
            - name: the name of the card: "Jack of Hearts"
            - file: the card file name: "Jack-of-Hearts.png"
            - kind: 2-10, 'Jack', 'Queen', 'King', 'Ace'
            - suit: 'Diamonds', 'Hearts', 'Spades', 'Clubs'
            - valu: numeric value; face card = 10, Ace = 11
        */

        // Declare a card object with the 5properties, the values of which are
        // the 5 corresponding variables 
        const card = {
            name: `${k} of ${s}`,
            file: `${k}-of-${s}.png`,
            valu: valu,
            // valu: k == "Ace" ? 11 : k.length >= 4 ? 10 : k,
            kind: k,
            suit: s,
        };

        // Push the card object into the deck array:
        deck.push(card);

    });
});

// we can also do the above ALL in ONE line of code:
kinds.forEach(k=>suits.forEach(s=>deck.push({name:`${k} of ${s}`,file:`${k}-of-${s}.png`,valu:k=="Ace"?11:k.length>=4?10:k,kind:k,suit:s})));
// Make a shoe consisting of 6 decks of cards, using the spread ... operator
const shoe = [...deck, ...deck, ...deck];
console.log(shoe);

// Shuffle (randomize) the shoe
shoe.sort(() => Math.random()-0.5);

// Shuffle again using Fisher-Yates Shuffle
for(let i = 0; i < shoe.length; i++) {
    let temp = shoe[i]; // store current item in temp var
    let r = Math.floor(Math.random()*shoe.length);
    shoe[i] = shoe[r]; // replace current item w rand item:
    shoe[r] = temp; // replace rand item w current item as temp
}

// Get the DOM elements:
// - Get the DEAL button and assign a listener for calling the deal function when clicked
const dealBtn = document.getElementById('deal-btn');
dealBtn.addEventListener('click', deal);
// - Get the HIT and STAND buttons
const hitBtn = document.getElementById('hit-btn');
hitBtn.addEventListener('click', hit);
const standBtn = document.getElementById('stand-btn');
standBtn.addEventListener('click', stand);
// - Get the h2, which will be used for outputting prompts ("HIT or STAND?", etc.)
const feedbackH2 = document.querySelector('h2');
// Get the divs that hold the player and dealer hands and 
// that display the player and dealer scores
const playerCardsDiv = document.getElementById('player-cards-div');
const dealerCardsDiv = document.getElementById('dealer-cards-div');
const playerScoreSpan = document.getElementById('player-score-span');
const dealerScoreSpan = document.getElementById('dealer-score-span');

// Declare global vars need for keeping track of the deal
// - arrays for holding player and dealer cards 
let playerHand = [];
let dealerHand = [];
// - variables for keeping score; dealCounter keeps track of total cards dealt
let playerScore = dealerScore = dealCounter = 0;

// DEAL
// Now, that we have the shoe, let's deal a hand of Blackjack. 
// to emulate smooth game play, we will use setInterval to deal on a 
// 1-second delay between cards
// the deal consists of 2 hands -- player and dealer -- each of whom get 2 cards
// the dealer's first card is dealt face down -- the "hole card"

// Define the deal function:
function deal() {
    // deactivate deal btn so that it cannot be clicked again mid-game
    dealBtn.disabled = true; // turn off btn
    dealBtn.classList.toggle('disabled-btn'); // fade btn

    // clear the table of all cards: empty the divs that display the cards
    playerCardsDiv.innerHTML = "";
    dealerCardsDiv.innerHTML = "";
    // reset the player and dealer scores and reset score boxes
    playerScore = dealerScore = dealCounter = 0; // shorthand: set multiple vars to same value
    playerScoreSpan.innerHTML = "Player Score: 0";
    dealerScoreSpan.innerHTML = "Dealer Shows: 0";
    feedbackH2.innerHTML = ""; // - clear the text from the output h2
    // empty the arrays that store the player and dealer 
    playerHand = [];
    dealerHand = [];
    // Call the setInterval method with its callback function, set equal to a variable,
    // dea;Interval, which will be used to clear the interval (stop deal)
    let dealInterval = setInterval(() => {
        
        dealCounter++; // Increment the counter that keeps track of how many card have been dealt
        if(dealCounter <= 4) {
            const cardImg = new Image(); // Instantiate a new image object to hold the card image
            const cardObj = shoe.pop(); // Pop a card object off shoe array and save it as cardObj
        
            // 2 Aces testing: hard-code an Ace, so that's all that is deal, all 4 cards are Aces:
            /*
            const cardObj = {
                name: "Ace of Diamonds",
                file: "Ace-of-Diamonds.png",
                valu: 11,
                kind: "Ace",
                suit: "Diamonds",
            } */
            cardImg.src = `images/cards350px/${cardObj.file}`;
            // deal odd counter cards to player; even go to dealer

            if(dealCounter % 2 == 1) {
                playerScore += cardObj.valu; // Increment the player's score
                playerCardsDiv.appendChild(cardImg); // If this is an odd card, give it to the player
                playerHand.push(cardObj); // Push the card into the player's hand
                // check if player score == 22 before displaying score, cuz player may have 2 Aces,
                // in which case their score is actually 12:
                if(playerScore == 22) { // only true if player has 2 Aces
                    playerScore = 12; // subtract 10 from score, since 2nd Ace counts 1
                    // go into the hand, and set the 2nd card valu prop to 1 (instead of 11)
                    playerHand[1].valu = 1;
                }
                playerScoreSpan.innerHTML = `Player Score: ${playerScore}`; // output player's score
                console.log("Player Hand:", playerHand);
            } else { // even cards go to dealer
                // dealer's 2nd card (4th card overall) is dealt face-down
                dealerScore += cardObj.valu; // increment the dealer's score
                dealerHand.push(cardObj); // 26. Push the card into the dealer's hand
                if(dealerScore == 22) { // only true if dealer has 2 Aces
                    dealerScore = 12; // subtract 10 from score, since 2nd Ace counts 1
                    // go into the hand, and set the 2nd card valu prop to 1 (instead of 11)
                    dealerHand[1].valu = 1;
                }
                console.log("Dealer Hand:", dealerHand);

                if(dealCounter == 4) { // counter equals 4 only when deal is done
                    cardImg.src = 'images/cards350px/0-Back-of-Card-Red.png';
                    // now that deal is done, check if either -- or both -- got Blackjack
                    // hardwire the scores to be blackjack (21) for testing purposes:
                    // playerScore = 21;
                    // dealerScore = 21;
                    // get the file name of the hole card so that we can reveal it:
                    holeCard = dealerHand[1].file;
                    console.log('holeCard:', holeCard);
                    // detect Blackjack, but on a 1 second delay to emulate real gameplay
                    setTimeout(() => {
                        if(dealerScore == 21 && playerScore == 21) { // if BOTH have Blackjack
                            feedbackH2.innerHTML = "BOTH have Blackjack! It's a PUSH..!";
                            cardImg.src = `images/cards350px/${holeCard}`; // reveal hole card
                            enableDealBtn();
                        } else if(playerScore == 21) { // check if player only has Blackjack
                            feedbackH2.innerHTML = "You have Blackjack! You WIN..!";
                            enableDealBtn();
                        } else if(dealerScore == 21) { // check if dealer only has Blackjack
                            feedbackH2.innerHTML = "Dealer has Blackjack! You LOSE..!";
                            cardImg.src = `images/cards350px/${holeCard}`; // reveal hole card
                            enableDealBtn();
                        } else { // nobody has Blackjack
                            feedbackH2.innerHTML = "Hit or Stand..?";
                            // console.log('Hola from else of the setTimeout which only ever runs in nobody has Blackjack!');
                            hitBtn.disabled = false; // turn on btn
                            hitBtn.classList.toggle('disabled-btn'); // un-fade btn
                            standBtn.disabled = false; // turn on btn
                            standBtn.classList.toggle('disabled-btn'); // un-fade btn
                        }
                    }, 1000);
                } else { // this is the dealer's FIRST card, so output "Dealer Shows" score
                    dealerScoreSpan.innerHTML = `Dealer Shows: ${dealerScore}`;
                }
                dealerCardsDiv.appendChild(cardImg); // give even card to the dealer
                cardImg.style.width = "95px"; // shrink dealer cards to make them appear farther away in 3D space           
            }
        } else {
            clearInterval(dealInterval); // If this is 4th card being dealt, clear interval (stop deal)
        }
    }, 1000);           
} // end deal() function

function hit() { // give the player a card:
    const cardImg = new Image(); // make a new img
    const cardObj = shoe.pop(); // pop another card off the shoe
    cardImg.src = `images/cards350px/${cardObj.file}`; // set card img src
    playerCardsDiv.appendChild(cardImg); // output card to player card div
    playerHand.push(cardObj); // save cardObj to playerHand array
    playerScore += cardObj.valu; // update player score
    playerScoreSpan.innerHTML = `Player Score: ${playerScore}`;

    // playerScore = 21; // testing
    // check if player Busted (in which case it's game over)
    if(playerScore > 21) {
        // before declaring player busted, check if they have an Ace to "un-bust" them
        // use array.findIndex() method to check if there is an Ace 11 in the hand, if there is not, findIndex() will return -1
        let indexOfAce11 = playerHand.findIndex(item => item.valu == 11);
        console.log('indexOfAce11:', indexOfAce11);
        if(indexOfAce11 != -1) { // if an Ace 11 was found in playerHand
            playerHand[indexOfAce11].valu = 1; // set its valu to 1
            playerScore -= 10; // subtract 10 from playerScore
            playerScoreSpan.innerHTML = `Player Score: ${playerScore}`;
        } else { // playerScore is over 21 AND there is no Ace 11 to bail them out
            feedbackH2.innerHTML = "You're Busted..!";
            enableDealBtn();
            disbleHitStandBtns();
        }
        // check if score is 21 after "unbusting"
        if(playerScore == 21) { // player is done;
            disbleHitStandBtns();
            feedbackH2.innerHTML = "Dealer's turn..";
            stand(); // player is done, so call stand function to play out dealer's hand
        }
    // check if playerScore is 21 exactly without having been unbusted
    } else if(playerScore == 21) { // if player hit results in exactly 21, player is done
        // turn off hit and stand btns -- but do NOT turn on deal btn, cuz game isn't over
        // yet; it is now the dealer's turn
        feedbackH2.innerHTML = "Dealer's turn..";
        disbleHitStandBtns();
        stand(); // player is done, so call stand function to play out dealer's hand
    } else { // player score is less than 21
        feedbackH2.innerHTML = "Hit again or Stand..?";
    }
} // end hit() function

function stand() { // runs when user clicks Stand or gets to non-blackjack score of 21
    setTimeout(() => {
        console.log('hello from stand function');
        // reveal hole card by setting src of children[1] (2nd card) in dealer cards div:
        if(dealerHand.length == 2) {
            dealerCardsDiv.children[1].src = `images/cards350px/${holeCard}`;
        }
        // show the dealer's actual score, as opposed to what they were showing
        dealerScoreSpan.innerHTML = `Dealer Score: ${dealerScore}`;

        if(dealerScore <= 16) { // give the dealer a new card
            const cardImg = new Image();
            const cardObj = shoe.pop();
            cardImg.src = `images/cards350px/${cardObj.file}`;
            cardImg.style.width = "95px";
            dealerCardsDiv.appendChild(cardImg);
            dealerHand.push(cardObj);
            dealerScore += cardObj.valu;
            dealerScoreSpan.innerHTML = `Dealer Score: ${dealerScore}`;
            stand(); // after giving dealer a new card, call function again
        } else if(dealerScore <= 21) { // dealer does NOT get card AND did not bust
            evalWinner(); // dealer has not busted but they are done, so see who won
        } else { // dealer score is greater than 21, so check for Ace to unbust with
            let indexOfAce11 = dealerHand.findIndex(item => item.valu == 11);
            console.log('indexOfAce11:', indexOfAce11);
            if(indexOfAce11 != -1) { // if an Ace 11 was found in playerHand
                dealerHand[indexOfAce11].valu = 1; // set its valu to 1
                dealerScore -= 10; // subtract 10 from playerScore
                dealerScoreSpan.innerHTML = `Dealer Score: ${dealerScore}`;
                stand(); // reducing dealer score by 10 may mean dealer gets yet another card, 
                // so recursively call stand function again to check if dealer gets another card, is done or is busted
            } else { // dealer score is more than 21 and could not "unbust"
                feedbackH2.innerHTML = "Dealer Busted! You Win!";
                enableDealBtn();
                disbleHitStandBtns();
            }
        }
    },2000);
}

function evalWinner() {
    if(playerScore == dealerScore) {
        feedbackH2.innerHTML = "It's a Push..!";
    } else if(playerScore > dealerScore) {
        feedbackH2.innerHTML = "You Win..!";
    } else {
        feedbackH2.innerHTML = "You Lose..!";
    }
    // game over so reset buttons
    enableDealBtn();
    disbleHitStandBtns();
}

// disable Hit & Stand btns if someone gets Blackjack or if player busts
function disbleHitStandBtns() {
    hitBtn.disabled = true;
    hitBtn.classList.toggle('disabled-btn');
    standBtn.disabled = true;
    standBtn.classList.toggle('disabled-btn');
}

// enable deal button when game ends so player can click Deal for new hand
function enableDealBtn() {
    dealBtn.disabled = false; // reactivate deal btn
    dealBtn.classList.toggle('disabled-btn');
}