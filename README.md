### DJ-TRINIRY

#### Web bms actuator with multiplay game

#### TODO

-game 모듈은 db 커넥션자체를 하지 않게 변경
--> -core 의 jpa 들을 -api 로 옮긴다.
--> dependency (spring-data-jpa) 아예 -api 단독으로 옮긴다. 

-api db 핸들링.
-game 에서 db 핸들링하려면 -api 모듈에 rest 요청할 것.
-game - redis, redis pub/sub 활용한 클라와 실시간 연결(websocket) 서비스에 집중
