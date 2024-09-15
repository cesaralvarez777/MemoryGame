import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-memory-game',
  templateUrl: './memory-game.component.html',
  styleUrls: ['./memory-game.component.css']
})
export class MemoryGameComponent implements OnInit {
  gameConfigForm: FormGroup;
  cards: any[] = [];
  flippedCards: any[] = [];
  matchedPairs: number = 0;
  totalPairs: number = 0;
  attempts: number = 0;
  gameStarted: boolean = false;
  timeElapsed: number = 0;
  timerInterval: any;
  score: number = 0;


  images: string[] = [
    'https://i.pinimg.com/564x/c8/b2/1e/c8b21eb42cf63591be52396cd2532524.jpg',
    'https://i.pinimg.com/736x/ac/a1/bb/aca1bb2340d5ffa457b0814ba46992bf.jpg',
    'https://i.pinimg.com/736x/fb/7b/80/fb7b80c3cf5c40bf89628263c3dc72de.jpg',
    'https://i.pinimg.com/564x/bf/17/26/bf1726ca535d3e165d498a18a27a929b.jpg',
    'https://i.pinimg.com/564x/27/e9/2d/27e92dc089708835f047c2f712aacce7.jpg',
    'https://i.pinimg.com/736x/04/fe/34/04fe347b119ef89dcb4be0ab8b890192.jpg',
    'https://i.pinimg.com/736x/c4/6a/5e/c46a5e9932b199f425948bad82a14e3f.jpg',
    'https://i.pinimg.com/564x/c2/c8/fa/c2c8fa29e2d78528df0de2331eae08c0.jpg',
    'https://i.pinimg.com/736x/20/92/b2/2092b22e8936b18b1bb6077445a44422.jpg',
    'https://i.pinimg.com/564x/1e/79/91/1e7991ef30b8be45c5469646452cd450.jpg',
    
  ];

  constructor(private fb: FormBuilder) {
    this.gameConfigForm = this.fb.group({
      pairs: [
        10,
        [
          Validators.required,
          Validators.min(1),
          Validators.max(10)
        ]
      ]
    });
  }

  ngOnInit() {}

  startGame() {
    const numberOfPairs = this.gameConfigForm.value.pairs;
    this.totalPairs = numberOfPairs;
    this.cards = this.generateCards(numberOfPairs);
    this.matchedPairs = 0;
    this.attempts = 0;
    this.timeElapsed = 0;
    this.flippedCards = [];
    this.score = 0;
    this.gameStarted = true;

    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }

    // Iniciar el cronómetro
    this.timerInterval = setInterval(() => {
      this.timeElapsed++;
    }, 1000);
  }

  generateCards(pairs: number) {
    if (pairs > this.images.length) {
      throw new Error('Número de pares excede el número de imágenes disponibles.');
    }

    const selectedImages = this.images.slice(0, pairs);
    const cardImages = [...selectedImages, ...selectedImages];
    return this.shuffleArray(cardImages.map(image => ({
      image: `${image}`,
      flipped: false,
      matched: false
    })));
  }

  shuffleArray(array: any[]) {
    return array.sort(() => Math.random() - 0.5);
  }

  flipCard(card: any) {
    if (this.flippedCards.length < 2 && !card.flipped && !card.matched) {
      card.flipped = true;
      this.flippedCards.push(card);

      if (this.flippedCards.length === 2) {
        setTimeout(() => {
          this.checkForMatch();
        }, 1000); // Delay before checking for a match
      }
    }
  }

  checkForMatch() {
    const [card1, card2] = this.flippedCards;
    this.attempts++;

    if (card1.image === card2.image) {
      card1.matched = true;
      card2.matched = true;
      this.matchedPairs++;

      if (this.matchedPairs === this.totalPairs) {
        clearInterval(this.timerInterval);
        this.calculateScore();
        alert(`¡Ganaste! Tiempo: ${this.timeElapsed} segundos. Intentos: ${this.attempts}. Puntuación: ${this.score}`);
      }
    } else {
      card1.flipped = false;
      card2.flipped = false;
    }

    this.flippedCards = [];
  }

  calculateScore() {
    const basePoints = this.totalPairs * 10; // Puntos base por cada par encontrado
    const timeBonus = Math.max(0, 100 - this.timeElapsed); // Bonificación si el tiempo es bajo
    const attemptPenalty = Math.max(0, 50 - this.attempts); // Penalización por intentos excesivos
    this.score = basePoints + timeBonus + attemptPenalty;
  }

  restartGame() {
    this.gameStarted = false;
    clearInterval(this.timerInterval);
  }

  getPairsOptions(): number[] {
    return Array.from({ length: 10 }, (_, i) => i + 1);
  }
}
