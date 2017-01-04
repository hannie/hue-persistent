# Hue persistent
Small NodeJS script to persist the color state of the Philips Hue when switching the lights on/off. The detection mechanism works by comparing the color state with the default color state. This way the detection also works when quickly turning the lights off and on. Note that the script might only work with the Philips Hue color bulbs. This is because other bulbs might have different default color state. If you wish to improve the script feel free to fork this repository and insert a pull request.

## Setup

### npm
```
npm install
```

### Bridge ip
You need to know your bridge ip address. You can visit [meethue site](http://www.meethue.com/api/nupnp) to help you out.

### Create username
run the following in a terminal (you need curl)
```
curl -H "Content-Type: application/json" -X POST -d '{"devicetype":"my_hue_app#android yourname"}' http://BRIDGE_IP/api
```
it will tell you to push the button, do it, then call that again. It should return a new username.

## Run
Without using a nodejs process manager
```
node main.js --host=BRIDGE_IP --user=USERNAME
```
But I recommend using [forever](https://github.com/foreverjs/forever)
```
forever start main.js --host=BRIDGE_IP --user=USERNAME
```
or using [pm2](https://github.com/Unitech/pm2), edit process.yaml: replace the host and user.
```
pm2 start process.yaml
```
## Credits
Credits go to [hue-state](https://github.com/damsonn/hue-state) which inspired me to write this script.
