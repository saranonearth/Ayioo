const Discord = require('discord.js');

export class _Ayioo {
  private _instance: any;
  private _token: string;
  private _channel_id: string;
  private _ayioo_ready: boolean;

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

  private _send(log: string) {
    const channel = this._get_channel();
    channel.send('```yaml\n' + log + '\n```');
  }

  public configure(token: string, channelID: string) {
    if (!this._instance) {
      this._token = token;
      this._channel_id = channelID;
      this._instance = new Discord.Client();

      this._instance.on('ready', () => {
        this._ayioo_ready = true;
        this._send('```yaml\n' + 'Ayioo is ready🤖' + '\n```');
      });

      this._instance.login(this._token);
    }

    return this._instance;
  }

  public log(log: string) {
    this._isInstancePresent();

    if (!this._ayioo_ready) {
      setTimeout(() => {
        this._send(log);
      }, 5000);
    } else {
      this._send(log);
    }
  }
}

export const Ayioo = new _Ayioo();
