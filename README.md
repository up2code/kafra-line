# kafra-line
Ragnarok mobile LINE bot helper for display some useful information or ask item price from exchange. 

Also you can customize this bot for other game or as you want.

This project just made for fun and for study how to create own LINE bot.

Video demo: https://www.youtube.com/watch?v=6zaEf3WksLg

## Requirement

- [Heroku](https://dashboard.heroku.com) - For deploy bot. Or you can use your own server if you have one. But for this I'll use Heroku for reference.
- [Firebase](https://firebase.google.com) - Easy to use for backend server. I had used this for store bot condition and answers.
- [LINE Developer](https://developers.line.biz) - Register and follow [instruction](https://developers.line.biz/en/docs/messaging-api/getting-started) for create channel

## Setup Heroku environment variable

Access your Dyno and check at tab **settings** and **Reveal Config Vars**. you can set environment variable here

| Key  | Meaning |
| ------------- | ------------- |
| CHANNEL_ACCESS_TOKEN  | Your LINE Channel access token  |
| CHANNEL_SECRET  | Your LINE Channel secret  |
| FIREBASE_ACCOUNT  | **service.account.json** content. Check in [Firebase Admin SDK instruction](https://firebase.google.com/docs/admin/setup?authuser=0).   |


## Deploy as your own LINE bot

- Deploy to [Heroku](https://dashboard.heroku.com). You can check instruction [here](https://devcenter.heroku.com/articles/getting-started-with-nodejs).
- On LINE Developer console at Messaging settings.  Enable __Use webhooks__.
- Webhook URL: __https://{your_heroku_app_name}.herokuapp.com/callback__.
- If you wish your bot can join group chats. Then enable __Allow bot to join group chats__.

## Usage

### Query item from poporing.life

type __$__ and follow with part of item name. (Ex. $biotite, $cyfar, $twister)

### Query item from romexchange.com

type __$$__ and follow with part of item name. (Ex. $$biotite, $$cyfar, $$twister)

### Command

type __!__ and follow command text. (See below for how to add your custom command)

## Add your own custom bot commands/answers

You need to add commands and answers in firebase database with 2 collection.

- chat : For response and answer normal chat.
- ref : List of bot command

Check in **sample** directory for example values and response template.

## Credit source information
- [poporing.life](https://poporing.life/) - RO M Exchange tracker.
- [romexchange.com](https://www.romexchange.com) - Another site for price tracking.
- [Ragnarok mobile community (Unofficial) Discord group.](https://discord.gg/NEccsCX)
- Inforgraphic or images credit to owner.

## Reference
- [LINE Message API](https://developers.line.biz/en/docs/messaging-api)