const playSuccessSound = () => {
  const audioContext = new (window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext)();

  // Crear una melodía de victoria
  const times = [0, 0.15, 0.3, 0.5];
  const frequencies = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6

  times.forEach((time, index) => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = frequencies[index];
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime + time);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + time + 0.5);

    oscillator.start(audioContext.currentTime + time);
    oscillator.stop(audioContext.currentTime + time + 0.5);
  });
};


const playFailureSound = () => {
  const audioContext = new (window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext)();

  // Crear un sonido descendente de derrota
  const times = [0, 0.2, 0.4];
  const frequencies = [400, 300, 200]; // Frecuencias descendentes

  times.forEach((time, index) => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = frequencies[index];
    oscillator.type = 'sawtooth';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime + time);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + time + 0.4);

    oscillator.start(audioContext.currentTime + time);
    oscillator.stop(audioContext.currentTime + time + 0.4);
  });
};


const playShootSound = () => {
    const audioContext = new (window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext)();
    
    // Crear un sonido de disparo corto y agudo
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'square';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  };


  const playSinkingSound = () => {
    const audioContext = new (window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext)();
    
    // Sonido de barco hundiéndose - descendente con efecto de burbujas
    const times = [0, 0.3, 0.6, 0.9, 1.2];
    const frequencies = [300, 250, 200, 150, 100];
    
    times.forEach((time, index) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequencies[index];
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime + time);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + time + 0.3);
      
      oscillator.start(audioContext.currentTime + time);
      oscillator.stop(audioContext.currentTime + time + 0.3);
    });
  };


export {
  playSuccessSound,
  playFailureSound,
  playShootSound,
  playSinkingSound
}