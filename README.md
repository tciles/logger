# logger

Realtime logs in nodejs

### Init

```
yarn
yarn start
```
Open your browser on [http://localhost:3000](http://localhost:3000)

### Create log

**POST** http://localhost:3000/log

Body
```json
{
  "timestamp": "{{timestamp}}",
  "channel": "{{channel}}",
  "level": "{{level}}",
  "message": "{{message}}",
  "context": {} // Optional
}
```

![screenshot](https://github.com/tciles/logger/blob/develop/public/assets/img/screenshot.png "Screenshot")
