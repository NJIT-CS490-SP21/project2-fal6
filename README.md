# Flask and create-react-app

## Requirements
1. `npm install`
2. `pip install -r requirements.txt`

## Setup
1. Run `echo "DANGEROUSLY_DISABLE_HOST_CHECK=true" > .env.development.local` in the project directory

## Run Application
1. Run command in terminal (in your project directory): `python app.py`
2. Run command in another terminal, `cd` into the project directory, and run `npm run start`
3. Preview web page in browser '/'


## Known problems
1. Currently the draw state sometimes does not sync properly when the play again button is pressed.*Solution:* Make sure to properly reset variables when reseting the game.
2. Some of the UI is lacking color and uniqueness in the font wich sometimes makes it look simplistic. *Solution:* I would check create css files for the components other than the board such as buttons etc.. to add more color to the project.
3. Sometimes when a spectator joins after a user has joined, the win state can be affected. *Solution:* modify my current implementation of adding a spectator to the server 
## Past Issues
1. I had an issue checking for the win state since I found out the setState hook is asynchronous and does not guarantee that the state has been changed when you want it to. *Solution:* create a useEffect with my board as a dependency that calls the win check function. I mainly used https://developer.mozilla.org/en-US/ to solve this issue.
2. I was not able to prevent other users to make moves when it is not their turn. *Solution:* Store a list with the ids of the users that can make moves and only allow these two to make moves. Used socketio documentation for this problem.
## Deploy to Heroku
*Don't do the Heroku step for assignments, you only need to deploy for Project 2*
1. Create a Heroku app: `heroku create --buildpack heroku/python`
2. Add nodejs buildpack: `heroku buildpacks:add --index 1 heroku/nodejs`
3. Push to Heroku: `git push heroku main`

## Heroku link
https://powerful-crag-56867.herokuapp.com/