# Gator Blog Aggregator

## Prerequisites

1. The Latest Gator package
2. An accessable postgres instance
3. Node Package Manager
4. Typescript version 7.0.2

## Installation

1. Create a new folder in a sensible place on your computer and extract the package to that folder.
2. Open the folder in a terminal and run npm install to install the required packages
3. Create a file in `<your user space>/Documents/Gator/Config` called `gatorconfig.json`
4. Paste the following content into the json file:
`{
  "db_url": "<yourdatabasepathhere>",
  "current_user_name": ""
}`
and replace `<yourdatabasepathhere>` with the path to your postgres instance. If it is local it'll likely be `"postgres://postgres:postgres@localhost:5432/gator?sslmode=disable"`

## Setting up the database

Once installation is complete we need to run a database migration. Run `npm run migrate`. The command works if you see an output starting with `applying migrations...`. If you don't see that check that postgres is running and that your `db_url` is correct in `gatorconfig.json`.

## Using Gator

### Users

A user is a person that can follow and view feeds. There is no user auth because there is no user data.

#### Register a user
`npm run start register <username>` 
EG `npm run start register <ashley>` will register a new user called Ashley. Registering a user will also log that user in. So the following commands will be within that user space.

#### Logging in
`npm run start login <username>` will login as a previously registered user

#### List users 
`npm run start users` will list all registered users and append `(current)` to the user that is currently logged in.

### Feeds

#### Adding a feed to Gator
`npm run start addfeed <feed name> <feed url>` This adds a feed to gator which then any user can follow. The current user that adds a feed will also follow that feed immediately. 

#### Listing all feeds
`npm run start feeds` will list all feeds that have been added by any user. It will show when it was created, it's name, it's url and which user added it.

#### Following a feed
If a feed has already been added by another user then use `npm run start follow <feed url>`

#### Unfollowing a feed
`npm run start unfollow <feed url>` to unfollow a feed. This does not remove it from other users. 

#### Seeing a list of feeds you follow
`npm run start following` will list the titles of the feeds the current user is following

#### Browsing posts from feeds that you follow
`npm run start browse <optional list limit>` will display a post digest of the feeds you follow with an option list limit. The default is 2.

#### Aggregating the latest feeds
`npm run start agg <time between refresh eg[ 1s | 1m | 1h | etc ]>`This will refresh the feeds periodically based on the time you specify. Remeber it is important to be sensible with how often gator refreshes as to not overwhelm (or cause you to get blocked by) the RSS service you are subscribing to. It is recommended to run this command in a separate terminal window so that it runs in the background while you navigate gator in another terminal.

### Resetting Gator
`npm run start reset` will delete all users, feeds, and posts from gator. Resetting it back to it's first state.





