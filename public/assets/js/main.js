class Logger {
    constructor() {
        this.socket = io();
        this.socket.on('+message', this.handleOnSocketMessage.bind(this));

        this.stack = [];
        this.stackHandler = null;

        this.logs = [];
        this.channels = [];
        this.levels = [];
        this.selectedChannels = [];
        this.selectedLevels = [];

        this._stop = true;
        this.buttonStartStop = document.getElementById('play_stop');

        if (this.buttonStartStop) {
            this.buttonStartStop.addEventListener('click', this.handleStartStopClick.bind(this));
        }

        this.play();
    }

    /**
     *
     * @param message
     */
    handleOnSocketMessage(message) {
        this.addLog(JSON.parse(message));
    }

    /**
     *
     * @param e
     */
    handleStartStopClick(e) {
        e.preventDefault();

        if (this._stop) {
            this.play();
            e.target.innerText = 'Stop';
        } else {
            this.stop();
            e.target.innerText = 'Play';
        }
    }

    /**
     *
     */
    destroyStackConsumer() {
        if (null !== this.stackHandler) {
            clearInterval(this.stackHandler);
            this.stackHandler = null;
        }
    }

    /**
     *
     */
    startStackConsumer() {
        if (null !== this.stackHandler) {
            this.destroyStackConsumer();
        }

        this.stackHandler = setInterval(() => {
            const stackLen = this.stack.length;

            if (stackLen < 1) {
                return;
            }

            for (let i = 0; i < stackLen; i++) {
                const log = this.stack.shift();
                this.addRow(log);
            }

            this.updateRowsVibility();
        }, 1000);
    }


    /**
     *
     */
    stop() {
        this._stop = true;
        this.destroyStackConsumer();
    }

    /**
     *
     */
    play() {
        this._stop = false;

        const logsContainer = document.getElementById('messages');
        logsContainer.innerHTML = '';

        for (const log of this.logs) {
            this.addRow(log);
        }

        this.startStackConsumer();
        this.updateRowsVibility();
    }

    /**
     *
     * @param channel
     * @returns {T[]}
     */
    getLogsByChannel(channel) {
        return this.logs.filter((log) => log.channel === channel);
    }

    /**
     *
     * @param level
     * @returns {T[]}
     */
    getLogsByLevel(level) {
        return this.logs.filter((log) => log.level === level);
    }

    /**
     *
     * @param level
     */
    addLevel(level) {
        if (this.levels.indexOf(level) > -1) {
            return;
        }

        this.levels.push(level);
        this.buildListLevels(this.levels);
    }

    /**
     *
     * @param levels
     */
    buildListLevels(levels) {
        const orderedLevels = levels.sort((a, b) =>  a < b ? -1 : 1);

        const levelsContainer = document.getElementById('levels');
        levelsContainer.innerHTML = '';

        for (const level of orderedLevels) {
            const li = document.createElement('li');
            const ch = document.createElement('input');
            const id = 'checkbox__level__'+btoa(level);

            li.classList.add('level__'+level.toLowerCase());

            ch.setAttribute('id', id);
            ch.type = 'checkbox';
            ch.value = level;

            li.innerHTML = `<label for="${id}">${level}</label>`;
            li.prepend(ch);

            levelsContainer.appendChild(li);

            ch.addEventListener('change', (e) => {
                const level = e.target.value;

                if (!e.target.checked) {
                    this.selectedLevels = this.selectedLevels.filter((c) => c !== level);
                    this.updateRowsVibility();

                    return;
                }

                if (this.selectedLevels.indexOf(level) < 0) {
                    this.selectedLevels.push(level);
                }

                this.updateRowsVibility();
            });
        }
    }

    /**
     *
     * @param channel
     */
    addChannel(channel) {
        if (this.channels.indexOf(channel) > -1) {
            return;
        }

        this.channels.push(channel);

        this.buildListChannels(this.channels);
    }

    /**
     *
     * @param channels
     */
    buildListChannels(channels) {
        const orderedChannels = channels.sort((a, b) =>  a < b ? -1 : 1);

        const channelsContainer = document.getElementById('channels');
        channelsContainer.innerHTML = '';

        for (const channel of orderedChannels) {
            const li = document.createElement('li');
            const ch = document.createElement('input');
            const id = 'checkbox__channel__'+btoa(channel);

            ch.setAttribute('id', id);
            ch.type = 'checkbox';
            ch.value = channel;

            li.innerHTML = `<label for="${id}">${channel}</label>`;
            li.prepend(ch);
            channelsContainer.appendChild(li);

            ch.addEventListener('change', (e) => {
                const channel = e.target.value;

                if (!e.target.checked) {
                    this.selectedChannels = this.selectedChannels.filter((c) => c !== channel);
                    this.updateRowsVibility();

                    return;
                }

                if (this.selectedChannels.indexOf(channel) < 0) {
                    this.selectedChannels.push(channel);
                }

                this.updateRowsVibility();
            });
        }
    }

    /**
     *
     * @param log
     */
    addLog(log) {
        this.logs.push(log);
        this.addChannel(log.channel);
        this.addLevel(log.level);

        if (this._stop) {
            return;
        }

        this.stack.push(log);
    }

    /**
     *
     * @param log
     */
    addRow(log) {
        const li = document.createElement('li');
        li.classList.add('log');

        Object.keys(log).forEach((key) => {
            let value = log[key];

            if ('uuid' === key) {
                li.setAttribute('id', 'log__'+value);
                return;
            }

            const e = document.createElement('pre');
            e.classList.add('log__entry');
            e.classList.add('log__entry__'+key);

            if ('timestamp' === key) {
                value = new Date(value).toISOString();
            }

            if ('level' === key) {
                li.classList.add('level__' + btoa(value.toLowerCase()));
                li.classList.add('level__' + value.toLowerCase());
            }

            if ('channel' === key) {
                li.classList.add('channel__' + btoa(value.toLowerCase()));
            }

            if ('context' === key) {
                value = JSON.stringify(value);
            }

            e.innerText = value;
            li.appendChild(e);
        });

        const logContainer = document.getElementById('messages');
        logContainer.prepend(li);
    }

    /**
     *
     */
    updateRowsVibility() {
        const els = document.getElementsByClassName('log');

        for (const el of els) {
            if (this.selectedChannels.length === 0 && this.selectedLevels.length === 0) {
                el.classList.remove('hidden');

                continue;
            }

            let haveSelectedChannel = this.selectedChannels.length === 0;
            let haveSelectedLevel = this.selectedLevels.length === 0;

            for (const channel of this.selectedChannels) {
                if (el.classList.contains('channel__' + btoa(channel))) {
                    haveSelectedChannel = true;
                    break;
                }
            }

            if (haveSelectedChannel && this.selectedLevels.length === 0) {
                el.classList.remove('hidden');

                continue;
            }

            for (const level of this.selectedLevels) {
                if (el.classList.contains('level__' + btoa(level.toLowerCase()))) {
                    haveSelectedLevel = true;
                    break;
                }
            }

            if (haveSelectedChannel && haveSelectedLevel) {
                el.classList.remove('hidden');
            } else {
                el.classList.add('hidden');
            }
        }
    }
}
