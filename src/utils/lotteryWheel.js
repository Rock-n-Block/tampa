export default class Lottery {
    constructor(params) {
        this.elements = [];
        this.iniElements(params.data);
        this.elCount = params.visibleElementsCount;
        this.stepAngle = 2 * Math.PI / this.elCount;
        params.element.appendChild(this.container);
        this.winner = params.winner
        this.speed = params.speed;
        this.audioEnd = params.audioEnd
        this.playingAudio = params.playingAudio
        this.callback = params.callback

        this.Boxheight = 0;
        for (let k = 0; k < params.visibleElementsCount; k++) {
            const element = this.elements.shift();
            this.listItems.appendChild(element);
        }

        const fstElement = this.listItems.children[0];
        this.hiddenPart = +getComputedStyle(fstElement).height.replace('px', '');

        for (let k = 0; k < params.visibleElementsCount / 2; k++) {
            this.Boxheight += Math.sin(this.stepAngle * k) * this.hiddenPart;
        }
        this.listItems.style.marginTop = -Math.sin(this.stepAngle * 1.5) * this.hiddenPart + 'px';
        this.listItems.style.marginBottom = -Math.sin(this.stepAngle * 1.5) * this.hiddenPart + 'px';
        this.listItems.style.height = this.Boxheight + 'px';
    }

    iniElements(data) {
        this.container = document.createElement('div');
        this.container.className = 'lottery-container';

        this.listItems = document.createElement('div');
        this.listItems.className = 'lottery-list';

        this.container.appendChild(this.listItems);

        data.forEach((item) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'lottery-item';
            const textBlock = document.createElement('div');
            textBlock.className = 'lottery-item_text';
            textBlock.innerText = item;
            itemElement.appendChild(textBlock);
            this.elements.push(itemElement);
        });
    }

    setWinner(winner) {
        debugger
        this.winner = winner
    }

    showWinner(winner) {
        this.playingAudio.pause()
        clearInterval(this.interval)
        const item = document.querySelectorAll('.lottery-item')[5].querySelector('.lottery-item_text')

        item.innerHTML = winner
        item.classList.add('winner')
        this.container.classList.add('lottery-end')
    }

    start() {
        this.playingAudio.play()
        let firstItem;
        const getFirstItemProperties = () => {
            firstItem = this.listItems.children[0];
        }
        let angle = 0;

        getFirstItemProperties();

        const checkMargins = () => {
            if (angle < -this.stepAngle) {
                angle = 0;
                this.elements.push(firstItem);
                this.listItems.removeChild(firstItem);
                this.listItems.appendChild(this.elements.shift());
                getFirstItemProperties();
                checkMargins();
            }
            return true;
        }

        const animate = () => {
            checkMargins();
            for (let k = 0; k < this.listItems.children.length; k++) {
                const el = this.listItems.children[k];
                const textElement = el.children[0];
                const scaleValue = Math.sin(this.stepAngle * k + angle);
                el.style.lineHeight = (this.hiddenPart * scaleValue) + 'px';
                textElement.style.transform = 'scale(' + scaleValue + ')';
                textElement.style.opacity = scaleValue;
                if (textElement.textContent === this.winner) {
                    this.speed += 0.05
                    clearInterval(this.interval)
                    this.interval = setInterval(animate, this.speed);
                    if (el.offsetTop - +(this.Boxheight - el.offsetTop - el.offsetHeight).toFixed(0) < 5) {
                        this.playingAudio.pause()
                        el.classList.add('winner')
                        this.audioEnd.play()
                        this.container.classList.add('lottery-end')
                        this.callback()
                        clearInterval(this.interval)
                    }
                }
            }
            angle -= 0.008;
        }
        this.interval = setInterval(animate, this.speed);
    }

    stop() {
        clearInterval(this.interval)
    }

}
