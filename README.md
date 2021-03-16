# Tic-Tac-Toe

## Requirements
1. `npm install`
2. `pip install -r requirements.txt`

## Setup
1. Run `echo "DANGEROUSLY_DISABLE_HOST_CHECK=true" > .env.development.local` in the project directory
2. After creating heroku app: heroku addons:create heroku-postgresql:hobby-dev
3. Look at "Deploy to heroku for more details"
## Run Application
1. Create .env with value of DATABASE_URL form `heroku config`
3. Run command in terminal (in your project directory): `python app.py`
4. Run command in another terminal, `cd` into the project directory, and run `npm run start`
5. Preview web page in browser '/'
# Milestone 2
## Known problems
1. Currently, there isn't a straight forward way for users to log out and for their data to be removed from the server.*Solution:* Add a login button that emits a logout event sent to the server.
2. Currently, if a main player disconnects the game does not stop automatically.*Solution:* add a way to handle this in a better way inside of the on_disconnect() function in the server
## Past issues
1. There was no way to know who the current player was because of the structure of the data on my backend. *Solution:* restructure the data way the players and spectators are stored. They are now stored in a dictionary instead of a list of dictionaries.

2. Multiple win events were being sent when a user won. *Solution:* Only send a win event from the user that won by checking their socket id.
# Milestone 1
## Known problems
1. Currently the draw state sometimes does not sync properly when the play again button is pressed.*Solution:* Make sure to properly reset variables when reseting the game.
2. Some of the UI is lacking color and uniqueness in the font wich sometimes makes it look simplistic. *Solution:* I would check create css files for the components other than the board such as buttons etc.. to add more color to the project.
3. Sometimes when a spectator joins after a user has joined, the win state can be affected. *Solution:* modify my current implementation of adding a spectator to the server 
## Past Issues
1. I had an issue checking for the win state since I found out the setState hook is asynchronous and does not guarantee that the state has been changed when you want it to. *Solution:* create a useEffect with my board as a dependency that calls the win check function. I mainly used https://developer.mozilla.org/en-US/ to solve this issue.
2. I was not able to prevent other users to make moves when it is not their turn. *Solution:* Store a list with the ids of the users that can make moves and only allow these two to make moves. Used socketio documentation for this problem.
## Deploy to Heroku
1. Create a Heroku app: `heroku create --buildpack heroku/python`
2. Add nodejs buildpack: `heroku buildpacks:add --index 1 heroku/nodejs`
3. `heroku addons:create heroku-postgresql:hobby-dev`
4. Push to Heroku: `git push heroku main`

## Heroku link
https://quiet-bastion-86176.herokuapp.com/