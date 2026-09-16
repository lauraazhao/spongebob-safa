const characters = {
  aaron: {
    name: "Aaron",
    message: "Happy birthday, Safa! I hope your day feels as warm and wonderful as you are.",
    audioSrc: "assets/audio/aaron.mp3",
  },
  gary: {
    name: "Gary",
    message: "Safa, may twenty-four bring you big dreams, sweet surprises, and so many reasons to smile.",
    audioSrc: "assets/audio/gary.mp3",
  },
  liny: {
    name: "Liny",
    message: "Happy twenty-fourth! Keep shining bright and making every room sunnier just by being in it.",
    audioSrc: "assets/audio/liny.mp3",
  },
  mike: {
    name: "Mike",
    message: "Here is to another year of growing, blooming, and becoming even more beautifully you.",
    audioSrc: "assets/audio/mike.mp3",
  },
  laura: {
    name: "Laura",
    message: "One last birthday wish, Safa: may this year be full of magic, laughter, and love. You deserve it all.",
    audioSrc: "assets/audio/laura.mp3",
  },
};

const cards = [...document.querySelectorAll(".character-card")];

let activeCard = null;
let activeAudio = null;
let playbackId = 0;

function setPlayerState(character, isPlaying) {
  cards.forEach((card) => {
    const selected = isPlaying && card === activeCard;
    card.classList.toggle("is-playing", selected);
    card.setAttribute("aria-pressed", String(selected));
  });

}

function stopPlayback({ keepMessage = true } = {}) {
  playbackId += 1;

  if (activeAudio) {
    activeAudio.pause();
    activeAudio.currentTime = 0;
    activeAudio = null;
  }

  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }

  const character = activeCard ? characters[activeCard.dataset.character] : null;
  setPlayerState(keepMessage ? character : null, false);
  activeCard = null;
}

function speakPlaceholder(character, currentPlaybackId) {
  if (!("speechSynthesis" in window)) return;

  const utterance = new SpeechSynthesisUtterance(character.message);
  utterance.rate = 0.92;
  utterance.pitch = 1.08;
  utterance.onend = () => {
    if (currentPlaybackId === playbackId) stopPlayback();
  };
  utterance.onerror = () => {
    if (currentPlaybackId === playbackId) stopPlayback();
  };
  window.speechSynthesis.speak(utterance);
}

function playMessage(card) {
  const character = characters[card.dataset.character];
  const wasActive = card === activeCard;

  stopPlayback();
  if (wasActive) return;

  const currentPlaybackId = playbackId;
  activeCard = card;
  setPlayerState(character, true);

  if (character.audioSrc) {
    const audio = new Audio(character.audioSrc);
    let fallbackStarted = false;
    activeAudio = audio;

    const fallBackToPlaceholder = () => {
      if (currentPlaybackId !== playbackId || fallbackStarted) return;
      fallbackStarted = true;
      if (activeAudio === audio) activeAudio = null;
      speakPlaceholder(character, currentPlaybackId);
    };

    audio.addEventListener("ended", () => {
      if (currentPlaybackId === playbackId) stopPlayback();
    }, { once: true });
    audio.addEventListener("error", fallBackToPlaceholder, { once: true });
    audio.play().catch(fallBackToPlaceholder);
  } else {
    speakPlaceholder(character, currentPlaybackId);
  }
}

cards.forEach((card) => {
  card.setAttribute("aria-pressed", "false");
  card.addEventListener("click", () => playMessage(card));
});

window.addEventListener("beforeunload", () => stopPlayback({ keepMessage: false }));