## Ayioo

![Feb-27-2021 02-06-06](https://user-images.githubusercontent.com/44068102/109352155-65072680-78a0-11eb-8128-3590e416d506.gif)


Ayioo is a logger which logs your server logs on discord channel. 

Ayioo also provides a http middleware which logs requests and responses out of the box to your discord channel.🔥 

```
> npm install ayiooo
```

#### How to use the logger?

```js

import {Ayioo} from 'ayiooo'


Ayioo.configure({
    token:"DISCORD_TOKEN",
    channelID:"DISCORD_CHANNEL_ID"

})

Ayioo.log("Hey🔥");

Ayioo.warn("Warn⚠️");

Ayioo.error("error🚨");


```
#### How to use AyiooCatch middleware?


```js
import express from 'express'
import {AyiooCatch} from 'ayiooo'

const app = express()
const port = 3001

Ayioo.configure({
    token:"DISCORD_TOKEN",
    channelID:"DISCORD_CHANNEL_ID"

})

app.use(AyiooCatch(
    {token:`DISCORD_TOKEN`,
    channelId:'DISCORD_CHANNEL_ID',instance:true})) //instance property is set to false by default


app.get('/', (req, res) => {
    res.send('Hello World!')
    Ayioo.log('FROM GET /')

})



app.listen(port, () => {
    Ayioo.log(`Example app listening at http://localhost:${port}`)
})

```



