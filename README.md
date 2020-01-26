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


```bash
curl --location --request POST 'http://localhost:3000/log' \
--header 'Content-Type: application/json' \
--data-raw '{
		"timestamp": "{{timestamp}}",
		"channel": "{{channel}}",
		"level": "{{level}}",
		"message": "{{message}}",
		"context": {{context?}}
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
