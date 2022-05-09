import default_scene from "./default_scene";
import Vec2 from "./Wolfie2D/DataTypes/Vec2";
import { GameEventType } from "./Wolfie2D/Events/GameEventType";
import { GraphicType } from "./Wolfie2D/Nodes/Graphics/GraphicTypes";
import Label from "./Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "./Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "./Wolfie2D/Scene/Layer";
import Scene from "./Wolfie2D/Scene/Scene";
import Color from "./Wolfie2D/Utils/Color";


export default class Menu extends Scene {
    // Layers, for multiple main menu screens
    private mainMenu: Layer;
    private about: Layer;
    private control: Layer;
    private cheatCodes: Layer;

    loadScene(){
        this.load.audio("menuTheme", "sounds/main menu.mp3");
        this.load.image("logo", "images/KillBallLogo.png");
    }

    startScene(){
        default_scene.emitter.fireEvent(GameEventType.PLAY_MUSIC, {key: "menuTheme", loop: true, holdReference: true});

        const center = this.viewport.getCenter();

        // The main menu
        this.mainMenu = this.addUILayer("mainMenu");

        const logo = this.add.sprite("logo", "mainMenu");
        //logo.size.set(200, 50);
        logo.position.set(600, 150);

        // Add play button, and give it an event to emit on press
        const play = this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x, center.y - 50), text: "New Game"});
        play.size.set(200, 50);
        play.borderWidth = 2;
        play.borderColor = Color.WHITE;
        play.backgroundColor = Color.TRANSPARENT;
        play.onClickEventId = "play";

        const cheats = this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x + 300, center.y - 50), text: "CHEAT CODES"});
        cheats.size.set(200, 50);
        cheats.borderWidth = 2;
        cheats.borderColor = Color.WHITE;
        cheats.backgroundColor = Color.TRANSPARENT;
        cheats.onClickEventId = "cheats";

        // Add about button
        const about = this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x, center.y + 100), text: "Credits"});
        about.size.set(200, 50);
        about.borderWidth = 2;
        about.borderColor = Color.WHITE;
        about.backgroundColor = Color.TRANSPARENT;
        about.onClickEventId = "about";

        /* ########## ABOUT SCREEN ########## */
        this.about = this.addUILayer("about");
        this.about.setHidden(true);

        const aboutHeader = <Label>this.add.uiElement(UIElementType.LABEL, "about", {position: new Vec2(center.x, center.y - 250), text: "Credits"});
        aboutHeader.textColor = Color.WHITE;

        // HOMEWORK 4 - TODO: Give yourself credit and add your name to the about page!
        const text1 = "Kill Ball";
        const text2 = "A Wolfie2D game by Liam Rea, Andy Zhang, and Edmod Zhou";
        const text3 = "";

        const line1 = <Label>this.add.uiElement(UIElementType.LABEL, "about", {position: new Vec2(center.x, center.y - 50), text: text1});
        const line2 = <Label>this.add.uiElement(UIElementType.LABEL, "about", {position: new Vec2(center.x, center.y), text: text2});
        const line3 = <Label>this.add.uiElement(UIElementType.LABEL, "about", {position: new Vec2(center.x, center.y + 50), text: text3});

        line1.textColor = Color.WHITE;
        line2.textColor = Color.WHITE;
        line3.textColor = Color.WHITE;

        const aboutBack = this.add.uiElement(UIElementType.BUTTON, "about", {position: new Vec2(center.x, center.y + 250), text: "Back"});
        aboutBack.size.set(200, 50);
        aboutBack.borderWidth = 2;
        aboutBack.borderColor = Color.WHITE;
        aboutBack.backgroundColor = Color.TRANSPARENT;
        aboutBack.onClickEventId = "menu";

        // Subscribe to the button events
        this.receiver.subscribe("play");
        this.receiver.subscribe("cheats");
        this.receiver.subscribe("about");
        this.receiver.subscribe("menu");
        this.receiver.subscribe("control");

        // Add about button
        const control = this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x, center.y + 300), text: "Controls"});
        control.size.set(200, 50);
        control.borderWidth = 2;
        control.borderColor = Color.WHITE;
        control.backgroundColor = Color.TRANSPARENT;
        control.onClickEventId = "control";

        //CONTROLS SCREEN:

        this.control = this.addUILayer("control");
        this.control.setHidden(true);

        const controlHeader = <Label>this.add.uiElement(UIElementType.LABEL, "control", {position: new Vec2(center.x, center.y - 250), text: "Controls"});
        controlHeader.textColor = Color.WHITE;

        //const ctext1 = "WASD to move";
        const ctext2 = "WASD :: Move (Double Tap to Dash)";
        const ctext3 = "Q :: Toss Ball (Hold to Throw Harder)";
        const ctext5 = "LEFT MOUSE :: Kick Ball (Hold to Build Power)";
        const ctext6 = "SPACE :: Jump";
        const ctext7 = "SHIFT :: Parry";
        const ctext8 = "NUM 1-3 :: Swap Ball (not implemented yet)";

        //const cline1 = <Label>this.add.uiElement(UIElementType.LABEL, "control", {position: new Vec2(center.x, center.y - 200), text: ctext1});
        const cline2 = <Label>this.add.uiElement(UIElementType.LABEL, "control", {position: new Vec2(center.x, center.y - 100), text: ctext2});
        const cline3 = <Label>this.add.uiElement(UIElementType.LABEL, "control", {position: new Vec2(center.x, center.y - 50), text: ctext3});
        const cline5 = <Label>this.add.uiElement(UIElementType.LABEL, "control", {position: new Vec2(center.x, center.y), text: ctext5});
        const cline6 = <Label>this.add.uiElement(UIElementType.LABEL, "control", {position: new Vec2(center.x, center.y + 50), text: ctext6});
        const cline7 = <Label>this.add.uiElement(UIElementType.LABEL, "control", {position: new Vec2(center.x, center.y + 100), text: ctext7});
        const cline8 = <Label>this.add.uiElement(UIElementType.LABEL, "control", {position: new Vec2(center.x, center.y + 150), text: ctext8});

        //cline1.textColor = Color.WHITE;
        cline2.textColor = Color.WHITE;
        cline3.textColor = Color.WHITE;
        cline5.textColor = Color.WHITE;
        cline6.textColor = Color.WHITE;
        cline7.textColor = Color.WHITE;
        cline8.textColor = Color.WHITE;

        const controlBack = this.add.uiElement(UIElementType.BUTTON, "control", {position: new Vec2(center.x, center.y + 250), text: "Back"});
        controlBack.size.set(200, 50);
        controlBack.borderWidth = 2;
        controlBack.borderColor = Color.WHITE;
        controlBack.backgroundColor = Color.TRANSPARENT;
        controlBack.onClickEventId = "menu";

        this.cheatCodes = this.addUILayer("cheats");
        this.cheatCodes.setHidden(true);

        const cheatLine = <Label>this.add.uiElement(UIElementType.LABEL, "cheats", {position: new Vec2(center.x, center.y - 100), text: "Press down on middle mouse button to enter god mode!!!"});

        const cheatBack = this.add.uiElement(UIElementType.BUTTON, "cheats", {position: new Vec2(center.x, center.y + 250), text: "Back"});
        cheatBack.size.set(200, 50);
        cheatBack.borderWidth = 2;
        cheatBack.borderColor = Color.WHITE;
        cheatBack.backgroundColor = Color.TRANSPARENT;
        cheatBack.onClickEventId = "menu";
        
        // HOMEWORK 4 - TODO
        /*
            Add a controls screen here.
            Use the About screen as inspiration for how to do so.
            The controls screen should list all controls:

            WASD to move
            Q to drop an item
            E to pick up an item
            Click to use current item
            1&2 to change items
            Z to switch to player 1
            X to switch to player 2

            You should also include a back button to return to the main menu.

            Additionally, on the main menu, you should be able to press a button to reach the controls screen.
        */
    }

    updateScene(){
        while(this.receiver.hasNextEvent()){
            let event = this.receiver.getNextEvent();

            console.log(event);

            if(event.type === "play"){
                this.sceneManager.changeToScene(default_scene, {});
            }

            if(event.type === "cheats"){
                this.mainMenu.setHidden(true);
                this.cheatCodes.setHidden(false);
            }

            if(event.type === "about"){
                this.about.setHidden(false);
                this.mainMenu.setHidden(true);
            }

            if(event.type === "menu"){
                this.mainMenu.setHidden(false);
                this.about.setHidden(true);
                this.control.setHidden(true);
                this.cheatCodes.setHidden(true);
            }
            if(event.type === "control"){
                this.mainMenu.setHidden(true);
                this.control.setHidden(false);
            }

        }
    }

    unloadScene(){
        default_scene.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "menuTheme"});
    }
}