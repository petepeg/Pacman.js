# Pacman in JS
Just a fun little exercise making the classic arcade game.

## Day One
Got some basic features put in Player, Ghosts, Level, level advancement, score, lives, collisions, pellets, power pellets, and some very basic and terrible ghost AI. All assets are just squares of different colors at the moment as I get the logic worked out.

## Day Two
I didn't like how big the steps were because it made the game feel clunky, moving 30 units every draw was pretty nasty. So I changed the player and ghost coordinate system to be more granular which meant breaking and fixing almost everything I did yesterday. 

The player and ghosts now are using the canvas data to detect walls(which may turn out to be a bad idea) they look for black pixels and if they see them wont pass. I handled ghost to ghost and ghost to player collisions but just checking the whole position range which works great for squares, but might be a little sloppy feeling once they are no longer squares. I changed pellet detection to some really sloppy divide and round, so as soon as Pacmans center enters a new square he eats the pellet, surprisingly not terrible. I have a whole host of new bugs but over all its feeling better.

Another new feature is a scary state for Pacman that ties into his super state, so that I can have the ghost run away when he dies. Otherwise he just gets spawn camped.