// HOW THE GAME SHOULD WORK:
// functionality should work where user selects card, then a second if they match the cards stay visible, if they don't then the card flip back over
// win scenario is when all pairs are found within the number of turns
// lose scenario is when at least 1 of the pairs does not match when the number of turns hits zero
// when a user has finished the game, they can select a 'play again' button which refreshes the page and randomises the locations of the monkey pairs


// FUNCTIONS WE NEED
// Function to randomise the monkey pictures layout between turns
// function to refresh the page when 'play again' button is selected
// function to flip cards
// function to count down turns as cards are selected - 1 turn per 2 cards clicked, clicking the same card twice doesn't count as a turn

// background music
class audioController {
    constructor() {
        this.bgMusic = new Audio('jungle-story-168459.mp3');
        this.bgMusic.volume = 0.5;
        this.bgMusic.loop = true;
    }
    startMusic() {
        this.bgMusic.play();
    }
    stopMusic() {
        this.bgMusic.pause();
        this.bgMusic.currentTime = 0;
    }
}

class MixOrMatch {
    constructor(totalTime, cards) {
        this.cardsArray = cards;
        this.totalTime = totalTime;
        this.timeRemaining = totalTime;
        this.timer = document.getElementById('time-remaining');
        this.ticker = document.getElementById('flips');
        this.audioController = new audioController();
    }

    startGame() {
        this.cardToCheck = null;
        this.totalClicks = 0;
        this.timeRemaining = this.totalTime;
        this.matchedCards = [];
        this.busy = true;

    setTimeout(() => {
        this.audioController.startMusic();
        this.shuffleCards();
        this.countdown = this.startCountdown();
        this.busy = false;
        }, 500);
        this.hideCards();
        this.timer.innerText = this.timeRemaining;
        this.ticker.innerText = this.totalClicks;
    }

    hideCards() {
        this.cardsArray.forEach(card => {
            card.classList.remove('visible');
            card.classList.remove('matched');
        });
    }

    flipCard(card) {
        if(this.canFlipCard(card)) {
            this.totalClicks++;
            this.ticker.innerText = this.totalClicks;
            card.classList.add('visible');

            if(this.cardToCheck) {
                this.checkForCardMatch(card);
            } else {
                this.cardToCheck = card;
            }
        }
    }

        checkForCardMatch(card) {
            if(this.getCardType(card) === this.getCardType(this.cardToCheck)) {
                this.cardMatch(card, this.cardToCheck);
            } else {
            this.cardMisMatch(card, this.cardToCheck);
            }
            this.cardToCheck = null;
    }

    cardMatch(card1, card2) {
        this.matchedCards.push(card1);
        this.matchedCards.push(card2);
        card1.classList.add('matched');
        card2.classList.add('matched');
        if(this.matchedCards.length === this.cardsArray.length) {
            this.victory();
        }
    }

    cardMisMatch(card1, card2) {
        this.busy = true;
        setTimeout(() => {
            card1.classList.remove('visible');
            card2.classList.remove('visible');
            this.busy = false;
        }, 1000);
    }

        getCardType(card){
            return card.getElementsByClassName('card-value')[0].src;
        }

        startCountdown() {
            return setInterval(() => {
                this.timeRemaining --;
                this.timer.innerText = this.timeRemaining;
                if(this.timeRemaining === 0)
                    this.gameOver();
            }, 1000);
        }


    gameOver() {
        clearInterval(this.countdown);
        document.getElementById('game-over-text').classList.add('visible');
        this.hideCards();
    }

    victory() {
        clearInterval(this.countdown);
        document.getElementById('you-win-text').classList.add('visible');
        this.hideCards();
    }

    shuffleCards() {
        for (let i = this.cardsArray.length - 1; i > 0; i-- ) {
            let randIndex = Math.floor(Math.random() * (i + 1));
            this.cardsArray[randIndex].style.order = i;
            this.cardsArray[i].style.order = randIndex;
        }
    }

    canFlipCard(card) {
        // return true;
        return (!this.busy && !this.matchedCards.includes(card) && card !== this.cardToCheck);
    }
}

// function to ensure all HTML is loaded before JS is run
function ready() {
    let overlays = Array.from(document.getElementsByClassName('overlay-text'));
    let cards = Array.from(document.getElementsByClassName('card'));
    let game = new MixOrMatch(100, cards);

    overlays.forEach(overlay => {
        overlay.addEventListener('click', () => {
            overlay.classList.remove('visible');
            game.startGame();
        });
    });

    cards.forEach(card => {
        card.addEventListener('click', () => {
            game.flipCard(card);
        });
    });
}

if(document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
} else {
    ready();
}
