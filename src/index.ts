const Discord = require('discord.js');

enum LOG_TYPES {
  LOG,
  ERROR,
  WARN,
}

export class _Ayioo {
  private _instance: any;
  private _token: string;
  private _channel_id: string;
  private _ayioo_ready: boolean;

  static readonly LOG_TYPES = LOG_TYPES;

  constructor() {
    this._instance = null;
    this._token = '';
    this._channel_id = '';
    this._ayioo_ready = false;
  }

  private _isInstancePresent() {
    if (!this._instance) throw new Error('Configure Ayioo🤖 before logging!');
  }

  private _get_channel() {
    this._isInstancePresent();
    return this._instance.channels.cache.get(this._channel_id);
  }

  public configure(token: string, channelID: string) {
    if (!this._instance) {
      this._token = token;
      this._channel_id = channelID;
      this._instance = new Discord.Client();

      this._instance.on('ready', () => {
        this._ayioo_ready = true;
        this._send('Ayioo is ready🤖', LOG_TYPES.LOG);
      });

      this._instance.on('message', (msg) => {
        if (msg.content === 'log') {
          msg.reply('Sending log file');
        }
      });

      this._instance.login(this._token);
    }

    return this._instance;
  }

  private _send(log: string, type: LOG_TYPES) {
    this._isInstancePresent();
    const channel = this._get_channel();

    switch (type) {
      case LOG_TYPES.LOG: {
        channel.send('```yaml\n' + log + '\n```');
        break;
      }
      case LOG_TYPES.ERROR: {
        channel.send('```diff\n' + '- ' + log + '\n```');
        break;
      }
      case LOG_TYPES.WARN: {
        channel.send('```fix\n' + log + '\n```');
        break;
      }
    }
  }

  public log(log: string) {
    if (!this._ayioo_ready) {
      setTimeout(() => {
        this._send(log, LOG_TYPES.LOG);
      }, 5000);
    } else {
      this._send(log, LOG_TYPES.LOG);
    }
  }

  public error(error: string) {
    if (!this._ayioo_ready) {
      setTimeout(() => {
        this._send(error, LOG_TYPES.ERROR);
      }, 5000);
    } else {
      this._send(error, LOG_TYPES.ERROR);
    }
  }

  public warn(warn: string) {
    if (!this._ayioo_ready) {
      setTimeout(() => {
        this._send(warn, LOG_TYPES.WARN);
      }, 5000);
    } else {
      this._send(warn, LOG_TYPES.WARN);
    }
  }
}

export const Ayioo = new _Ayioo();
