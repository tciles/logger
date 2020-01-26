# logger

Realtime logs in nodejs

### Init

```
yarn
yarn start
```
Open your browser on [http://localhost:3000](http://localhost:3000)

### Create log
| Field | Type |Optional|
|-------|----------|----|
|timestamp|number|X|
|channel|string||
|level|string||
|message|string||
|context|mixed|X|

#### Request
**Method** : POST<br>
**Endpoint** : http://localhost:3000/log<br>
**Content-type** : application/json<br>
**Payload** :
```json
{
  "timestamp": "{{timestamp}}",
  "channel": "{{channel}}",
  "level": "{{level}}",
  "message": "{{message}}",
  "context": {} 
}
```

**Curl**
```bash
curl --location --request POST 'http://localhost:3000/log' \
--header 'Content-Type: application/json' \
--data-raw '{
		"timestamp": "{{timestamp}}",
		"channel": "{{channel}}",
		"level": "{{level}}",
		"message": "{{message}}",
		"context": {{context}}
}'
```



### Php
```php
<?php
require_once __DIR__.'/vendor/autoload.php';
use ElephantIO\Client;
use ElephantIO\Engine\SocketIO\Version2X;

$token = 'token';

$client = new Client(new Version2X('http://localhost:3000', [
    'headers' => [
        'Authorization: Bearer ' . $token,
        'User: username',
    ]
]));

$client->initialize();

$client->emit('+message', [
    'channel' => 'php',
    'level'   => 'DEBUG',
    'message' => 'test log php',
    'context' => []
]);

$client->close();
```

![screenshot](https://github.com/tciles/logger/blob/develop/public/assets/img/screenshot.png "Screenshot")
