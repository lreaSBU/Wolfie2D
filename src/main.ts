
import Game from "./Wolfie2D/Loop/Game";
import default_scene from "./default_scene";
import Menu from "./Menu";

// The main function is your entrypoint into Wolfie2D. Specify your first scene and any options here.
(function main(){
    // Run any tests
    runTests();

    // Set up options for our game
    let options = {
        canvasSize: {x: 1180, y: screen.height*.8},          // The size of the game
        clearColor: {r: 252, g: 102, b: 3},   // The color the game clears to
    }

    // Create a game with the options specified
    const game = new Game(options);

    // Start our game
    game.start(Menu, {});
})();

function runTests(){};