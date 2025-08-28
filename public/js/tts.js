function initSpeechSynthesis() {
    const synth = window.speechSynthesis;
    let isSpeaking = false;
    let currentUtterance = null;

    function speak(text) {
        if (synth.speaking) {
            console.error('Speech synthesis is already speaking.');
            return;
        }

        currentUtterance = new SpeechSynthesisUtterance(text);
        currentUtterance.onend = () => {
            isSpeaking = false;
            currentUtterance = null;
        };
        currentUtterance.onerror = (event) => {
            console.error('Speech synthesis error:', event.error);
        };

        synth.speak(currentUtterance);
        isSpeaking = true;
    }

    function pause() {
        if (synth.speaking && isSpeaking) {
            synth.pause();
            isSpeaking = false;
        }
    }

    function resume() {
        if (synth.paused) {
            synth.resume();
            isSpeaking = true;
        }
    }

    function stop() {
        synth.cancel();
        isSpeaking = false;
        currentUtterance = null;
    }

    return {
        speak,
        pause,
        resume,
        stop,
    };
}

const tts = initSpeechSynthesis();
export default tts;