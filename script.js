const characters = {
  momo: {
    name: "Momo",
    message: "Happy birthday, Safa! I hope your day feels as warm and wonderful as you are.",
    audioSrc: null,
  },
  pippin: {
    name: "Pippin",
    message: "Safa, may twenty-four bring you big dreams, sweet surprises, and so many reasons to smile.",
    audioSrc: null,
  },
  bibi: {
    name: "Bibi",
    message: "Happy twenty-fourth! Keep shining bright and making every room sunnier just by being in it.",
    audioSrc: null,
  },
  olive: {
    name: "Olive",
    message: "Here is to another year of growing, blooming, and becoming even more beautifully you.",
    audioSrc: null,
  },
  nori: {
    name: "Nori",
    message: "One last birthday wish, Safa: may this year be full of magic, laughter, and love. You deserve it all.",
    audioSrc: null,
  },
};

const cards = [...document.querySelectorAll(".character-card")];
const player = document.querySelector("#now-playing");
const playerLabel = document.querySelector("#player-label");
const playerMessage = document.querySelector("#player-message");
const stopButton = document.querySelector("#stop-button");

let activeCard = null;
let activeAudio = null;
let playbackId = 0;

function setPlayerState(character, isPlaying) {
  cards.forEach((card) => {
    const selected = isPlaying && card === activeCard;
    card.classList.toggle("is-playing", selected);
    card.setAttribute("aria-pressed", String(selected));
  });

  player.classList.toggle("is-active", isPlaying);
  stopButton.hidden = !isPlaying;

  if (character) {
    playerLabel.textContent = isPlaying ? `Now playing · ${character.name}` : `Message from ${character.name}`;
    playerMessage.textContent = character.message;
  } else {
    playerLabel.textContent = "Ready when you are";
    playerMessage.textContent = "Choose a friend to begin";
  }
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
  if (!("speechSynthesis" in window)) {
    playerLabel.textContent = `Message from ${character.name}`;
    return;
  }

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
    activeAudio = new Audio(character.audioSrc);
    activeAudio.addEventListener("ended", () => {
      if (currentPlaybackId === playbackId) stopPlayback();
    }, { once: true });
    activeAudio.addEventListener("error", () => {
      if (currentPlaybackId !== playbackId) return;
      activeAudio = null;
      speakPlaceholder(character, currentPlaybackId);
    }, { once: true });
    activeAudio.play().catch(() => {
      if (currentPlaybackId === playbackId) speakPlaceholder(character, currentPlaybackId);
    });
  } else {
    speakPlaceholder(character, currentPlaybackId);
  }
}

cards.forEach((card) => {
  card.setAttribute("aria-pressed", "false");
  card.addEventListener("click", () => playMessage(card));
});

stopButton.addEventListener("click", () => stopPlayback());
window.addEventListener("beforeunload", () => stopPlayback({ keepMessage: false }));