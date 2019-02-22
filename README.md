# kafra-line
Ragnarok mobile LINE bot helper for display some useful information or ask item price from exchange.

This project just made for fun and for study how to create own LINE bot.

## Deploy as your own bot

- Register as [LINE Developer](https://developers.line.biz) and follow [instruction](https://developers.line.biz/en/docs/messaging-api/getting-started) for create a channel.
- Deploy to [Heroku](https://dashboard.heroku.com). You can check instruction [here](https://devcenter.heroku.com/articles/getting-started-with-nodejs).
- Set CHANNEL_ACCESS_TOKEN and CHANNEL_SECRET as environment variable on Heroku app. These values are come from your channel settings on LINE Developer console.  Also instruction for set config variable on Heroku is [here](https://devcenter.heroku.com/articles/config-vars).
- On LINE Developer console at Messaging settings.  Enable __Use webhooks__.
- Webhook URL: __https://{your_heroku_app_name}.herokuapp.com/callback__.
- If you wish your bot can join group chats. Then enable __Allow bot to join group chats__.

## Usage

type __!help__ to see all commands.

type __$trend__ or __$trending__ to see what trending right now.

type __$__ and follow with part of item name. (Ex. $biotite, $cyfar, $twister)


## Credit source information
- [poporing.life](https://poporing.life/) - RO M Exchange tracker.
- [Ragnarok mobile community (Unofficial) Discord group.](https://discord.gg/NEccsCX)
- Inforgraphic or images credit to owner.

## Reference
- [LINE Message API](https://developers.line.biz/en/docs/messaging-api)