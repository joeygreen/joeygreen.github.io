## Compass/SASS ##
Install  
(the `gem install compass` can take a while)
```
sudo apt-get install ruby ruby-dev
sudo gem install compass
```

Configure (Skip this if config.rb exists )
```
compass create --bare --sass-dir=sass --css-dir=public/_fe/css/
```

Run
```
compass watch --poll
```

## Simple HTTP Server ##
If you have python, you can easily run this in a simple http server to get this app to connect to the API.
```
cd public
python -m SimpleHTTPServer 8000
```
Use your browser to connect to 127.0.0.1:8000