# AI Platformer

This is a platformer game developed by me (Nathan Hinthorne). 

This project is basically an ongoing experiment to see how well I can implement deep learning AI into a platformer game. Various deep learning algorithms will be used, including NEAT.

## Plans

These are my development plans:
- Implement complex physics systems to allow for more interesting gameplay.
- Use the NEAT algorithm to train AI enemies to fight the player and navigate the level.
    - This will be done by creating a fitness function that rewards the AI for getting closer to the player and penalizes it for taking damage.
- Display visualizations of NEAT algorithm while it's in the midst of learning and making new neuron connections.
- Implement a tilemap editor to create custom levels (similar to Mario Maker).
    - This should output a JSON file that can be read by a parser to create the level.
- Implement a color-based image parser to read tilemaps from an image file.
    - Each color represents a different tile type.
    - This system will allow the user to submit random images which will be fed through an edge detection algorithm, reduced to a more pixelated image, and finally output a JSON file that can be read by the tilemap parser.


## Credits

- Most music, artwork, and code are taken from my team's game titled "The Good, The Bad, and Chad" which can be found [here](https://github.com/GoodBadChad/good-bad-chad-br)
- The artwork in this game is made by me and my three teammates, Caleb Krauter, Trae Claar, and Devin Peevy.
- The music is composed by Caleb Krauter and I. 
    - You can listen to more of Caleb's music [here](https://www.youtube.com/@calebkrauterdev).
    - You can listen to more of my music [here](https://www.youtube.com/channel/UCDfVvgwwc6MoM7CtsUDdhXA).

Please note that all artwork and music used in this project belong to their respective creators and should not be used without permission.
