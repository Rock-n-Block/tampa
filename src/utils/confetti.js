export const confettiNow = (hard) => {
    function random(mi, ma) {
        return parseInt(Math.random() * (ma - mi) + mi);
    }
    const particleCount = hard ? random(122, 245) : random(2, 15);
    window.confetti({
        particleCount,
        angle: random(0, 360),
        spread: random(360, 360),
        origin: {
            x: Math.random(),
            y: Math.random()
        }
    });
};

export const confetti = (time) => {
    [...new Array(time/1000)].map(() => setTimeout(() => {
        confettiNow(true)
    },time * Math.random()))
};