import Scene from "./Wolfie2D/Scene/Scene";
import Sprite from "./Custom/Sprite";
import Proj from "./Custom/Proj";
import Particle from "./Custom/Particle";
import Enemy from "./Custom/Enemy";
import CanvasRenderer from "./Wolfie2D/Rendering/CanvasRenderer";
import Emitter from "./Wolfie2D/Events/Emitter";
import Input from "./Wolfie2D/Input/Input";
import PlayerController from "./demos/PlatformerPlayerController";
import Spritesheet from "./Wolfie2D/DataTypes/Spritesheet";
import { GameEventType } from "./Wolfie2D/Events/GameEventType";
import { TimerState } from "./Wolfie2D/Timing/Timer";
import { TiledTilemapData } from "./Wolfie2D/DataTypes/Tilesets/TiledData";

export default class default_scene extends Scene{
    public size: number = 32;
    public hSize: number = this.size/2;
    public qSize: number = this.hSize/2;
    public static toLoad: number = 0;
    public static camX: number = 0;
    public static camY: number = 0;
    public static shCamX: number = 0;
    public static shCamY: number = 0;
    public static maxHP: number = 3;
    public static maxTimer: number = 500;
    public static hp: number = default_scene.maxHP;

    public static key: boolean[] = [];
    public static pey: boolean[] = [];

    public static ctx: CanvasRenderingContext2D;
    public static mr: DOMRect;

    private static mapRef: string[] = [' ', '-', '_', 'g', 's', 'f', '.'];
    private static tiles: HTMLImageElement[] = [];
    private static grid: string[][];

    public static Player: Sprite;
    public Tar: Sprite;
    public Count: Sprite;
    public Ball: Sprite;
    public static kBall: Sprite;
    public dTrail: Sprite[] = [];
    public static dots: Sprite[] = [];

    public static kl: Proj = undefined;

    public static godMode: boolean = false;

    public static genX: number;
    public static genY: number;
    public del: number;
    public static cw: number;
    public static ch: number;
    public static hcw: number; // QID??
    public static hch: number;
    public kicking: number = 0;
    public static curveX: number = 0;
    public static curveY: number = 0;
    private static curveL: number;
    public static dashing: number = -1;
    public dashCool: number = 0;
    public dashV: number;
    public throwing: number = 0;
    public static parrying: number = -1;
    public static parryCool: number = -1;
    public walking: number = 5;
    public walk: number;
    public wf: number = 2;
    public wDir: number = 1;
    public bSel: number = 0;
    public thl: number;
    public static vx: number = 0;
    public static vy: number = 0;
    public static px: number = 0;
    public static py: number = 0;
    public dashX: number = 0;
    public dashY: number = 0;
    public static mw: number;
    public static mh: number;
    public mdx: number = 0;
    public mdy: number = 0;
    public mdl: number;
    public newCamX: number = 0;
    public newCamY: number = 0;
    public static shct: number;
    public static shCam: number;
    public static mouseX: number = 0;
    public static mouseY: number = 0;
    public kfr: number = 9;
    public wGen: number;
    public static qid: number[][];
    public doubles: number[] = [87, 65, 83, 68, 0, 0, 0, 0];
    public ammo: number[] = [-1, 0, 0];
    
    public static hearts: Sprite[] = [];
    public static weapons: Sprite[] = [];

    public static hasBall: number = -1;
    public static isCurving: number = 0;
    public static grounded: boolean = true;
    public hk: boolean = false;
    public static kp: boolean;
    public static emitter: Emitter = new Emitter();
    static mark: Sprite;
    static dead: number = 1;
    static psx: number;
    static psy: number;
    static deathMark: Sprite;


    public static score: number = 0; //actual score value
    private static displayScore: number = 0; //what the text displays
    private static multiplier: number = 0;
    private static multTimer: number = 0;
    private static colRef: string[] = [
        '#0004ff',
        '#00a806',
        '#ffff00',
        '#ff6600',
        '#ff0000'
    ];
    public static titles: string[][] = [
        ("You Can Suck My").split(' '),
        ("There Once Was A").split(' '),
        ("The First Rule Of").split(' '),
        ("Hon, Bring Me The").split(' '),
        ("So Many Ways To").split(' '),
        ("Tell Your Friends About").split(' ')
    ];
    private static tPick: number = default_scene.randRange(0, default_scene.titles.length-1);
    static titleHelper: any;
    static streak: number;
    static selArrow: Sprite;
    static boom: Sprite;
    static booms: any[];
    static hw: number;
    static level: number = 1;

    loadScene(): void {
        //this.load.image("logo", "demo_assets/images/wolfie2d_text.png");
        this.load.object("level1", "levels/level1.json");
        this.load.object("level2", "levels/level2.json");
        //this.load.object("level3", "levels/level3.json");
        //this.load.object("level4", "levels/level4.json");
        //this.load.object("level5", "levels/level5.json");
        //this.load.object("level6", "levels/level6.json");
        this.load.audio("bounce", "sounds/ball kick.aac");
        this.load.audio("parry", "sounds/parry.aac");
        this.load.audio("spit", "sounds/mob sound.aac");
        this.load.audio("hurt", "sounds/pain reaction.aac");
        this.load.audio("splat", "sounds/blood splatter.aac");
        this.load.audio("jump", "sounds/jump.aac");
        this.load.audio("gameOver", "sounds/game over.mp3");
        this.load.audio("bgm", "sounds/level.mp3");
        this.load.audio("note1", "sounds/note1.mp3");
        this.load.audio("note2", "sounds/note1.mp3");
        this.load.audio("note3", "sounds/note1.mp3");
        this.load.audio("note4", "sounds/note1.mp3");
        this.load.audio("note5", "sounds/note1.mp3");
        this.load.audio("explo", "sounds/explo.mp3");
        this.load.audio("bing", "sounds/bing.mp3");
        this.load.audio("supply", "sounds/supply.mp3");

        var myFont = new FontFace('myFont', 'url(fonts/PressStart2P-Regular.ttf)');
        myFont.load().then(function(font){
            document.fonts.add(font);
            console.log('Font loaded');
        });
    }

    startScene(): void {
        default_scene.ctx = CanvasRenderer.ctxRef;
        default_scene.cw = CanvasRenderer.cw; default_scene.hcw = default_scene.cw / 2;
        default_scene.ch = CanvasRenderer.ch; default_scene.hch = default_scene.ch / 2;
        default_scene.mr = CanvasRenderer.mr;
        
        for(var i = 0; i < 300; i++){ //initialize the key and pey list capacities
            default_scene.key.push(false);
            default_scene.pey.push(false);
        }
        window.addEventListener("keydown", function(e){if(default_scene.dead < 1 && e.keyCode != 82) return; default_scene.pey[e.keyCode] = !default_scene.key[e.keyCode]; default_scene.key[e.keyCode] = true;}, true);
        window.addEventListener("keyup", function(e){default_scene.key[e.keyCode] = false;}, true);
        window.addEventListener('mousedown', function(e){if(default_scene.dead < 1) return; default_scene.pey[229 + e.which] = !default_scene.key[229 + e.which]; default_scene.key[229 + e.which] = true;}, true);
        window.addEventListener('mouseup', function(e){default_scene.key[229 + e.which] = false;}, true); //230 = left mouse, 231 = middle, 232 = right mouse.
        window.addEventListener("mousemove", function(e){
            if(default_scene.dead < 1) return;
            if(default_scene.key[16]){
                default_scene.curveX = e.clientX - default_scene.mr.left - Sprite.size - default_scene.mouseX;
                default_scene.curveY = e.clientY - default_scene.mr.top - Sprite.size - default_scene.mouseY;
                default_scene.curveL = Math.sqrt(default_scene.curveX*default_scene.curveX + default_scene.curveY*default_scene.curveY);
                default_scene.curveX /= default_scene.curveL; default_scene.curveY /= default_scene.curveL;
                default_scene.curveX *= 5; default_scene.curveY *= 5;
                default_scene.isCurving = 10;
            }
            else if(default_scene.isCurving > 0) default_scene.isCurving--;
            else default_scene.mouseX = e.clientX - default_scene.mr.left - Sprite.size, default_scene.mouseY = e.clientY - default_scene.mr.top - Sprite.size;
        });
        //this.addLayer("primary", 1);
        //console.log("TEST CTX::: " + default_scene.ctx);
        default_scene.Player = new Sprite("pn", true, 15, 32, 64);
        this.Tar = new Sprite("tar");
        default_scene.kBall = new Sprite("ball");
        this.Count = new Sprite("count", false, 3);
        this.Count.hide();
        default_scene.kBall.hide();
        for(var i = 0; i < default_scene.hp; i++){
            default_scene.hearts.push(new Sprite("heart", false, 2, Sprite.size*1.1*i));
            default_scene.hearts[i].setUI();
        }
        var icon = new Sprite("ballIcon", false, -1, Sprite.hSize, default_scene.ch-Sprite.size*2);
        icon.setUI();
        icon = new Sprite("grenadeIcon", false, -1, Sprite.hSize + Sprite.size, default_scene.ch-Sprite.size*2);
        icon.setUI();
        icon = new Sprite("swordIcon", false, -1, Sprite.hSize + Sprite.size*2, default_scene.ch-Sprite.size*2);
        icon.setUI();

        Sprite.LoadStatic("spit", Sprite.hSize);
        default_scene.mark = new Sprite("mark");
        default_scene.deathMark = new Sprite("mark");
        default_scene.deathMark.hide();
        default_scene.mark.hide();

        default_scene.titleHelper = new Sprite("mark");
        default_scene.titleHelper.setPos(0, default_scene.hch-Sprite.size);
        default_scene.titleHelper.setUI();
        default_scene.titleHelper.hide();

        default_scene.boom = new Sprite("boom", false, 3);
        default_scene.boom.hide();
        default_scene.booms = default_scene.boom.frames;
        default_scene.boom.del(); //just an example to get the boom images into Loaded

        default_scene.selArrow = new Sprite("selArrow");
        default_scene.selArrow.setPos(Sprite.hSize, default_scene.ch-Sprite.size*3-Sprite.hSize);
        default_scene.selArrow.setUI();

        for(var i = 0; i < 10; i++){
            default_scene.dots.push(new Sprite("aim"));
            default_scene.dots[i].hidden = true;
        }

        //this.build(this.load.getObject("level1").toString());
        this.build(this.load.getObject("level1")["map"].toString());
        //this.build('                              -----                            -            0-,                               ---                             -            --,                                -                              -          0- -,                                                               -          -  -,-                                                              -        0-   -,-                                                              -        -    -,-                                                              -       -     -,-_-                                                            -      -      -,                                                               -     -       -,                ___                                            -    -        -,                                                               -   -         -,                                                               -  -          -,                                                               - -           -,                             ___-                              -             -,                                -                              --            -,                                -                              - -           -,                                -    0   -                     -  -          -,                                -_________                     -   -         -,                                -                              -    -        -,                                -                    - -0- -         -        ,                                ---                  -------          -       ,     .                          -  --                  ---             -      ,            -                   -    _-                ---              -    f,-          --    s   g   0      -0     --              ---                   -,-------------------------------------------------------------------------------');
        //default_scene.emitter.fireEvent(GameEventType.PLAY_MUSIC, {key: "bgm", loop: true, holdReference: true});
    }

    updateScene(delta: number): void {
        if(default_scene.toLoad > 0) return;
        if(default_scene.pey[231]){
            //default_scene.godMode = true;
            //console.log("GOD MODE ACTIVATED --> NO DAMAGE");
            console.log(default_scene.titleHelper.sx + ", " + default_scene.hearts[0].x + ", " + default_scene.ctx.font);
        }
        this.del = delta*50;
        if(default_scene.hasBall > 0) default_scene.hasBall -= this.del;
        if(default_scene.hw > 0) default_scene.hw -= this.del;
        default_scene.ctx.clearRect(0, 0, default_scene.cw, default_scene.ch);
        default_scene.ctx.fillStyle = '#333';
        default_scene.ctx.fillRect(0, 0, default_scene.cw, default_scene.ch);
        default_scene.kp = this.kicking <= 0 || this.kicking > 290 || !this.hk;
        if(default_scene.kp) if(default_scene.dashing > 0){
            this.dashV = default_scene.dashing / 3;
            default_scene.vx = this.dashX * this.dashV * this.del;
            default_scene.vy = this.dashY * this.dashV * this.del;
            if(10 - Math.floor(default_scene.dashing / 3) > this.dTrail.length){
                this.dTrail.push(new Sprite(default_scene.Player.getImage(), false, -1, default_scene.Player.x, default_scene.Player.y));
                //new Particle(Player.x+hSize, Player.y+hSize, '#a2a1ff', 10, -.1, -vx, -vy);
            }
            for(var i = 0; i < this.dTrail.length; i++) this.dTrail[i].alpha = (i+1)/this.dTrail.length * (default_scene.dashing/50);
            if((default_scene.dashing -= this.del) <= 0){
                for(var d of this.dTrail) d.del();
                this.dTrail = [];
            }
        }else{
            if(this.throwing == 0) for(var i = 49; i < 52; i++) if(default_scene.pey[i]){
                this.bSel = i-49;
                default_scene.selArrow.x = Sprite.hSize + Sprite.size*(i-49);
                //animation for switching
            }

            this.walk = (+default_scene.key[68] - +default_scene.key[65]);
            if((this.kicking > 0 || (default_scene.parrying -= this.del) >= 0) && default_scene.grounded) this.walk = 0;
            if(this.walk != 0 && (this.walking -= this.del) < 0) this.walking = 5, this.wf += this.wDir, this.wDir *= +(this.wf == 2)*2-1;
            default_scene.Player.frame = this.wf;
            if(default_scene.key[65]) default_scene.Player.flip = true;
            else if(default_scene.key[68]) default_scene.Player.flip = false;
            else default_scene.Player.frame = 0;
            default_scene.vx += this.walk, default_scene.vx *= this.del;
            if(default_scene.parrying <= 0 && default_scene.parryCool < 0 && default_scene.pey[16]) default_scene.parrying = 50;
        }
        if(default_scene.dead == 1){
            if((default_scene.multTimer -= this.del) < 0){
                default_scene.multiplier = 0;
                default_scene.streak = 0;
                default_scene.tPick = default_scene.randRange(0, default_scene.titles.length-1);
            }
            this.wGen = default_scene.qid[Math.round(default_scene.Player.y/this.size)][Math.round(default_scene.Player.x/this.size)];
            if(this.wGen > 2){
                if(this.wGen < 5){
                    this.ammo[this.wGen-2] += (this.wGen-2)*5;
                    default_scene.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "supply", loop: false, holdReference: false});
                    default_scene.qid[Math.round(default_scene.Player.y/this.size)][Math.round(default_scene.Player.x/this.size)] = 0;
                }else if(default_scene.pey[87]){
                    //default_scene.toLoad++;
                    //console.log('BUILD NEW LEVEL!!!');
                    default_scene.grid = [];
                    default_scene.qid = [];
                    //Sprite.Clear();
                    Enemy.Clear();
                    Particle.Clear();
                    Proj.Clear();
                    default_scene.level++;
                    //console.log("/levels/level"+default_scene.level+".json");
                    //this.load.object("level"+default_scene.level, "/levels/level"+default_scene.level+".json");
                    this.build(this.load.getObject("level"+default_scene.level)["map"].toString());
                    default_scene.kBall.hide();
                    //default_scene.toLoad--;
                }
            }
            this.wallCheck(true);
            if(!default_scene.grounded){
                if(default_scene.kp && default_scene.dashing < 0 && default_scene.dead == 1) default_scene.vy += this.del * .5, default_scene.Player.frame = default_scene.vy < 0 ? 7 : 8;
                if(default_scene.vy < 0 || default_scene.py < 0){
                    if(default_scene.Player.y + default_scene.vy + default_scene.py - this.qSize < 0) this.dashY = default_scene.vy = default_scene.py = 0, default_scene.Player.y = .01;
                    else if(default_scene.Player.y > default_scene.mh) default_scene.die();
                    else if(default_scene.qid[this.wGen = Math.floor((default_scene.Player.y-this.qSize)/this.size)][Math.floor((default_scene.Player.x+this.qSize)/this.size)] == 1 || default_scene.qid[this.wGen][Math.ceil((default_scene.Player.x-this.qSize)/this.size)] == 1) default_scene.vy = 0;
                    else this.wallCheck(false);
                }else{
                    var curCheck;
                    if((curCheck = default_scene.qid[this.wGen = Math.floor((default_scene.Player.y+this.size+default_scene.vy+default_scene.py)/this.size)][Math.round(default_scene.Player.x/this.size)]) == 1 || curCheck == 2) default_scene.grounded = true, default_scene.px = default_scene.py = 0, default_scene.pvEnd(), this.dashY = default_scene.vy = 0, default_scene.Player.y = (this.wGen-1)*this.size;
                    this.wallCheck(false);
                }
            }else if(default_scene.dashing < 0 && default_scene.key[32] && default_scene.qid[this.wGen = Math.floor((default_scene.Player.y-this.qSize)/this.size)][Math.floor((default_scene.Player.x+this.qSize)/this.size)] != 1 && default_scene.qid[this.wGen][Math.ceil((default_scene.Player.x-this.qSize)/this.size)] != 1){
                default_scene.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "jump", loop: false, holdReference: false});
                default_scene.grounded = false; default_scene.vy = -8;
            }else if(default_scene.qid[this.wGen = Math.round((default_scene.Player.y+this.size)/this.size)][Math.floor((default_scene.Player.x+this.qSize)/this.size)] == 0 && default_scene.qid[this.wGen][Math.ceil((default_scene.Player.x-this.qSize)/this.size)] == 0) default_scene.grounded = false, default_scene.vy = 0;

            if(default_scene.parrying >= 0) default_scene.Player.frame = 12;
            else if(default_scene.parryCool > 0){
                default_scene.Player.frame = 13;
                if((default_scene.parryCool -= this.del) < 0) default_scene.pvEnd();
            }
            if(default_scene.kp) default_scene.Player.move(default_scene.vx + default_scene.px, default_scene.vy + default_scene.py);
        }
        this.mdx = default_scene.mouseX - default_scene.Player.x+default_scene.camX+this.hSize;
        this.mdy = default_scene.mouseY - default_scene.Player.y+default_scene.camY+this.hSize;
        this.mdl = Math.sqrt(this.mdx*this.mdx+this.mdy*this.mdy);
        this.mdx /= this.mdl; this.mdy /= this.mdl;
        this.Tar.setPos(default_scene.Player.x+this.hSize+this.mdx*20-3.5, default_scene.Player.y+this.hSize+this.mdy*20-3.5);

        if(this.dashCool > 0) this.dashCool -= this.del;
        else if(default_scene.parrying < 0) for(var i = 0; i < 4; i++){
            if(default_scene.pey[this.doubles[i]]) this.doubles[i+4] = this.doubles[i+4] > 0 ? -1 : 10;
            else this.doubles[i+4] = Math.max(this.doubles[i+4] - this.del, 0);
            if(this.doubles[i+4] == -1){
                this.dashX = this.getDash(i, true); this.dashY = this.getDash(i, false);
                if(default_scene.key[this.doubles[this.wGen = this.wrap(i+1, 4)]] || default_scene.key[this.doubles[this.wGen = this.wrap(i-1, 4)]]) this.dashX += this.getDash(this.wGen, true), this.dashY += this.getDash(this.wGen, false), this.dashX *= .707, this.dashY *= .707;
                default_scene.dashing = 30; this.dashCool = 40;
                if(this.dashY > 0 && default_scene.grounded) this.dashY = 0;
                this.doubles[i+4] = 0; default_scene.pvEnd(); break;
            }
        }

        if((default_scene.key[81] && this.kicking == 0 && default_scene.parrying < 0 && default_scene.hasBall < 0) || this.throwing > 0){
            if(this.throwing == 0){
                if(this.ammo[this.bSel] == 0) this.throwing = -this.del;
                else{
                    this.ammo[this.bSel]--;
                    if(this.bSel == 0){
                        if(default_scene.kBall.hidden) default_scene.kBall.setPos(default_scene.Player.x, default_scene.Player.y);
                        (this.Ball = default_scene.kBall).show();
                        this.Ball.show();
                    }else{
                        this.Ball = new Sprite(this.bSel == 1 ? "grenade" : "sword", false, this.bSel == 0 ? -1 : (this.bSel == 1 ? 2 : 4));
                        this.Ball.setPos(default_scene.Player.x, default_scene.Player.y);
                    }
                    //Count.show();
                    this.Ball.moveTo(this.Tar, 25, -this.qSize, -this.qSize);
                }
            }
            this.throwing = Math.min(25, this.throwing + this.del);
            this.thl = Math.floor(this.throwing / 8);
            default_scene.Player.frame = Math.min(6, this.thl + 4);
            if(default_scene.key[81]) default_scene.key[81] = this.throwing < 25; //limit hit
        }if(this.throwing > 0){
            if(this.thl > 0 && !default_scene.key[81]){ //throw!
                this.thl *= 3;
                this.Ball.moveTo(undefined);
                this.Ball.setPos(this.Tar.x-this.qSize, this.Tar.y-this.qSize);
                if(this.Ball.p == undefined) new Proj(this.Ball, this.mdx * this.thl, this.mdy * this.thl, 0, this.bSel);
                else this.Ball.p.setAll(this.Ball, this.mdx * this.thl, this.mdy * this.thl, 0, this.bSel);
                this.Count.hide(); default_scene.hasBall = 20;
                this.Count.sh = this.throwing = 0; 
            }//else Player.frame = thfr + thl;
            default_scene.Player.flip = this.mdx < 0;
        }

        if(this.kicking > 0){
            default_scene.Player.flip = this.mdx < 0;
            default_scene.Player.frame = this.kfr + Math.floor(Math.min((300 - this.kicking)/3, 2));
            this.kicking -= this.del;
            if(!this.hk && this.kicking < 290){ //end wind up (hbox)
                default_scene.kl = this.getKick(default_scene.Player.x+this.hSize, default_scene.Player.y+this.hSize, this.size);
                if(this.kicking < 275) this.kicking = -50; //wiff for real
                else if(default_scene.kl != undefined){
                    this.hk = true;
                    default_scene.kl.del(false, true); //delete the proj with explo safety
                    default_scene.kl.vx = default_scene.kl.vy = default_scene.kl.sx = default_scene.kl.sy = 0;
                    default_scene.kl.s.shake(5, 290);
                    default_scene.kl.s.moveTo(this.Tar, 290, -this.qSize, -this.qSize);
                    this.Count.show();
                }
            }else if(this.hk && (!default_scene.key[230] || this.kicking < 0)){ //release proj
                default_scene.kl.s.shake(); default_scene.kl.s.moveTo(undefined);
                default_scene.kl.s.setPos(this.Tar.x-this.qSize, this.Tar.y-this.qSize);
                default_scene.kl.vx = this.mdx * 20; default_scene.kl.vy = this.mdy * 20;
                default_scene.kl.sx = default_scene.curveX; default_scene.kl.sy = default_scene.curveY;
                default_scene.kl.c = default_scene.kl.en ? 0 : Math.min(this.thl+1, 3), default_scene.kl.g = 0;
                this.Count.hide(); this.Count.shake(undefined);
                this.Count.frame = default_scene.vy = 0;
                Proj.List.push(default_scene.kl);
                default_scene.kl.safe = 5;
                for(var d of default_scene.dots) d.hidden = true;
                default_scene.mark.hidden = true;
                //default_scene.kl = undefined;
                //camShake(3, 10);
                this.kicking = -30;
            }else if(default_scene.kl){
                default_scene.ray(this.Tar.x+this.qSize, this.Tar.y+this.qSize, this.mdx, this.mdy, 500);
                default_scene.mark.setPos(default_scene.genX-this.qSize, default_scene.genY-this.qSize);
                default_scene.mark.hidden = false;
                this.thl = Math.floor((290-this.kicking)/30);
                this.Count.frame = default_scene.clamp(this.thl-1, 0, 2);
                this.Count.shake(this.Count.frame, 290);
                this.Count.setPos(default_scene.Player.x+this.qSize, default_scene.Player.y-this.hSize);
            }
        }else if(this.kicking < 0 && (this.kicking += this.del) > 0) this.kicking = 0; //cooldown
        else if(default_scene.pey[230] && default_scene.parrying < 0) this.kicking = 300, default_scene.curveX = default_scene.curveY = 0, this.hk = false, default_scene.kl = undefined;

        this.newCamX = default_scene.camX + (default_scene.Player.x-default_scene.hcw - default_scene.camX)/10;
        if(this.newCamX > 0 && this.newCamX < default_scene.mw - default_scene.cw) default_scene.camX = this.newCamX;
        this.newCamY = default_scene.camY + (default_scene.Player.y-default_scene.hch - default_scene.camY)/10;
        if(this.newCamY > 0 && this.newCamY < default_scene.mh - default_scene.ch) default_scene.camY = this.newCamY;
        if((default_scene.shct -= this.del) > 0){
            default_scene.shCamX = default_scene.rand(default_scene.shCam);
            default_scene.shCamY = default_scene.rand(default_scene.shCam);
        }
        //BACKGROUND LAYER:::
        if(default_scene.dead < 1){
            default_scene.ctx.fillStyle = '#ff0000';
            default_scene.ctx.fillRect(0, 0, default_scene.cw, default_scene.ch);
            default_scene.ctx.fillStyle = '#000';
            default_scene.ctx.textAlign = 'center';
            default_scene.ctx.globalCompositeOperation = 'xor';
            default_scene.ctx.fillText("Press R to Restart", default_scene.hcw, default_scene.hch);
            default_scene.ctx.globalCompositeOperation = 'source-over';
            default_scene.ctx.textAlign = 'left';
            if((default_scene.dead -= this.del * .01) < 0) default_scene.dead = 0;
            if(default_scene.pey[82]){ //RESTART LEVEL!!!
                default_scene.dead = 1;
                default_scene.deathMark.setPos(0, 0);
                default_scene.Player.moveTo(undefined);
                default_scene.hp = default_scene.maxHP;
                for(var h of default_scene.hearts) h.frame = 0;
                default_scene.PlayerStart();
                default_scene.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "gameOver"});
                default_scene.emitter.fireEvent(GameEventType.PLAY_MUSIC, {key: "bgm", loop: true, holdReference: true});
            }
        }
        //MAP LAYER:::
        this.makeMap();
        //SPRITE LAYER:::
        if(default_scene.dead == 1){
            Enemy.Run(this.del);
            Proj.Run(this.del);
        }
        if(default_scene.hw > 20) default_scene.Player.frame = 14;
        Sprite.Run(this.del);
        Particle.Run(this.del);
        //UI LAYER:::
        Sprite.UIRun(this.del);
        if(default_scene.multiplier > 0){
            default_scene.ctx.textAlign = 'left';
            default_scene.ctx.fillStyle = default_scene.colRef[default_scene.multiplier-1];
            default_scene.ctx.fillRect(0, default_scene.hch, (Sprite.size*5) * (default_scene.multTimer/default_scene.maxTimer), Sprite.qSize/2);
            default_scene.ctx.font = "10px myFont";
            default_scene.ctx.fillText('x'+default_scene.multiplier, Sprite.size*5.5, default_scene.hch+Sprite.qSize);
            default_scene.ctx.font = "30px myFont";
            default_scene.ctx.fillText(default_scene.multiplier == 5 ? "KILLBALL" : default_scene.titles[default_scene.tPick][default_scene.multiplier-1], default_scene.titleHelper.x+default_scene.titleHelper.sx, default_scene.titleHelper.y+default_scene.titleHelper.sy);
        }
        default_scene.displayScore += (default_scene.score-default_scene.displayScore)/2;
        default_scene.ctx.fillStyle = '#fff';
        default_scene.ctx.font = "20px myFont";
        default_scene.ctx.fillText(Math.round(default_scene.displayScore).toString(), Sprite.qSize, default_scene.hch+Sprite.hSize);

        if(default_scene.dead == 1){
            default_scene.ctx.font = "10px myFont";
            for(var i = 1; i < 3; i++) default_scene.ctx.fillText(this.ammo[i].toString(), Sprite.hSize + Sprite.size*i, default_scene.ch-Sprite.size*2);
        }

        default_scene.pey = [];
    }
    public static addScore(s: number){
        this.streak += s;
        this.score += s * Math.max(this.multiplier, 1);
        this.multTimer = this.maxTimer;
        if(this.streak >= this.multiplier*100){ //multiplier up
            this.multiplier = Math.min(this.multiplier+1, 5);
            this.titleHelper.x = -this.hcw; //might be too far left
            this.titleHelper.moveTo(this.hearts[0], 20, 0, this.hch-Sprite.size);
            this.titleHelper.shake(this.multiplier, this.maxTimer*2);
            default_scene.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "note"+this.multiplier, loop: false, holdReference: false});
        }
        
    }
    public wallCheck(ex: boolean): void{
        if(default_scene.vx == 0) return;
        if(default_scene.vx < 0){
            if(ex && default_scene.Player.x + default_scene.vx + default_scene.px < -this.qSize) default_scene.Player.x = -this.qSize, default_scene.vx = default_scene.px = 0;
            else if(default_scene.qid[ex ? Math.round(default_scene.Player.y/this.size) : Math.ceil(default_scene.Player.y/this.size)][this.wGen = Math.floor((default_scene.Player.x+this.qSize+default_scene.vx+default_scene.px)/this.size)] == 1) default_scene.Player.x = (this.wGen+1)*this.size - this.qSize, default_scene.vx = default_scene.px = 0
        }else{
            if(ex && default_scene.Player.x + default_scene.vx + default_scene.px > default_scene.mw - this.hSize - this.qSize) default_scene.Player.x = default_scene.mw - this.hSize - this.qSize, default_scene.vx = default_scene.px = 0;
            else if(default_scene.qid[ex ? Math.round(default_scene.Player.y/this.size) : Math.ceil(default_scene.Player.y/this.size)][this.wGen = Math.floor((default_scene.Player.x+this.hSize+this.qSize+default_scene.vx+default_scene.px)/this.size)] == 1) default_scene.Player.x = (this.wGen-1)*this.size + this.qSize, default_scene.vx = default_scene.px = 0;
        }
    }
    public static rand(x: number): number{
        return (Math.random()*2-1)*x;
    }
    public static randRange(l: number, u: number){
        return l + Math.round(Math.random()*(u-l));
    }
    public static camShake(i: number, t: number): void{
        default_scene.shCam = i;
        default_scene.shct = t;
    }
    public static distance(s1: Sprite, s2: Sprite, d1 = 0, d2 = 0): number{
        //return Math.sqrt((default_scene.genX = s2.x+d1-s1.x-d2)*default_scene.genX + (default_scene.genY = s2.y+d1-s1.y-d2)*default_scene.genY);
        return this.pDistance(s1.x-d2, s1.y-d2, s2.x+d1, s2.y+d1);
    }
    public static pDistance(x1: number, y1: number, x2: number, y2: number){
        return Math.sqrt((default_scene.genX = x2-x1)*default_scene.genX + (default_scene.genY = y2-y1)*default_scene.genY);
    }

    private build(str: string): void{
        default_scene.grid = str.split(',').map(s => s.split(''));
        default_scene.mh = default_scene.grid.length * this.size; default_scene.mw = default_scene.grid[0].length * this.size; //set dimensions of the map
        default_scene.qid = []; var loads = [], mGen;
        for(var i = 0; i < default_scene.grid.length; i++){ //build qid and decide what images to load / unload
            default_scene.qid.push([]);
            for(var n = 0; n < default_scene.grid[i].length; n++){
                if((mGen = default_scene.mapRef.indexOf(default_scene.grid[i][n])) > 5 || mGen == -1) switch(default_scene.grid[i][n]){
                    case '.': default_scene.PlayerStart(n*this.size, i*this.size); break;
                    //case 'f': new Sprite("door", false, -1, n*this.size, i*this.size); break;
                    default: new Enemy(n*this.size, i*this.size, parseInt(default_scene.grid[i][n])); mGen = 0; break; //Enemy placement
                }
                default_scene.qid[default_scene.qid.length-1].push(mGen > 5 ? 0 : mGen);
                loads[default_scene.qid[i][n]] = true;
            }
        }
        var tl = Math.max(default_scene.tiles.length, loads.length);
        while(default_scene.tiles.length < tl) default_scene.tiles.push(undefined);
        while(loads.length < tl) loads.push(undefined);
        for(var i = 1; i < tl; i++){
            if(loads[i] && default_scene.tiles[i] == undefined){ //load
                default_scene.tiles[i] = new Image(this.size, this.size);
                default_scene.tiles[i].src = "images/tile" + i + ".png";
                default_scene.tiles[i].onload = function(){default_scene.toLoad--;}
                default_scene.toLoad++;
            }else if(!loads[i] && default_scene.tiles[i] != undefined) default_scene.tiles[i] = undefined; //unload
        }
    }

    public makeMap(): void{
        for(var i = 0; i < default_scene.qid.length; i++) for(var n = 0; n < default_scene.qid[i].length; n++) if(default_scene.qid[i][n] != 0 && Math.abs(n*this.size-default_scene.camX) < default_scene.cw && Math.abs(i*this.size-default_scene.camY) < default_scene.ch) this.make(n, i);
        default_scene.ctx.globalAlpha = 1;
    }

    public make(x: number, y: number): void{
        default_scene.ctx.globalAlpha = default_scene.dead;
        default_scene.ctx.drawImage(default_scene.tiles[default_scene.qid[y][x]], x*this.size - default_scene.camX - default_scene.shCamX, y*this.size - default_scene.camY - default_scene.shCamY);
    }
    public static damage(): void{
        if(this.hw > 0) return;
        if(!this.godMode) default_scene.hp--;
        console.log("OUCH!!! --> took damage! " + default_scene.hp);
        if(default_scene.hp == 0) this.die();
        else if(!this.godMode){
            default_scene.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "hurt", loop: false, holdReference: false});
            default_scene.hearts[Math.max(default_scene.hp, 0)].frame = 1;
        }
        this.hw = 50;
    }
    public static PlayerStart(a = -1, b = -1){
        if(a == -1){
            a = default_scene.psx;
            b = default_scene.psy;
        }else{
            console.log("SETTING PSX AND PSY");
            default_scene.psx = a;
            default_scene.psy = b;
        }
        default_scene.Player.setPos(a, b); 
        //default_scene.camX = default_scene.clamp(default_scene.Player.x - default_scene.hcw, 0, default_scene.mw-default_scene.cw);
        //default_scene.camY = default_scene.clamp(default_scene.Player.y + default_scene.hch, default_scene.ch, default_scene.mh);
    }
    public static pvEnd(){
        default_scene.vx += default_scene.px, default_scene.vy += default_scene.py, default_scene.px = default_scene.py = 0;
    }
    private static die(): void{
        console.log("DEAD!!!");
        default_scene.streak = 0;
        default_scene.multiplier = 0;
        default_scene.dead -= .0001;
        for(var i = 0; i < default_scene.key.length; i++) default_scene.key[i] = false; //clear key inputs
        default_scene.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "bgm"});
        default_scene.emitter.fireEvent(GameEventType.PLAY_MUSIC, {key: "gameOver", loop: true, holdReference: true});
        this.deathMark.setPos(this.camX+this.hcw-Sprite.qSize, this.camY+this.hch+Sprite.size*2);
        this.mark.hidden = true;
        this.Player.moveTo(this.deathMark, 5000);
    }
    private getKick(x: number, y: number, d: number): Proj{
        for(var p of Proj.List) if(!p.h && Math.sqrt((default_scene.genX = p.s.x-x+this.qSize)*default_scene.genX + (default_scene.genY = p.s.y-y+this.qSize)*default_scene.genY) <= d) return p;
        return undefined;
    }
    public static clamp(n: number, min: number, max: number): number{
        return Math.min(Math.max(n, min), max);
    }
    private wrap(p: number, l: number): number{
        while(p < 0) p += l;
        return p % l;
    }
    private getDash(x: number, b: boolean){
        return this.sign(x) * ((b ? x : x+1) % 2);
    }
    private sign(x: number): number{
        return Math.floor(x/2)*2-1;
    }
    public static rayTo(s1: Sprite, s2: Sprite){ //start Sprite, dest Sprite
        var wGen = default_scene.distance(s1, s2);
        default_scene.genX /= wGen; default_scene.genY /= wGen;
        return this.ray(s1.x, s1.y, default_scene.genX, default_scene.genY, wGen, 1, false);
    }
    public static ray(sx: number, sy: number, dx: number, dy: number, d: number, poll = 1, draw = true){
        var rx = sx, ry = sy, rl = d/10, rd = rl, ri = 0, rg;
        while((d -= poll) > 0){
            rx += dx * poll;
            ry += dy * poll;
            if(draw){
                dx += this.curveX * .0031 * poll;
                dy += this.curveY * .0031 * poll;
                rg = Math.sqrt(dx*dx + dy*dy);
                dx /= rg; dy /= rg;
                default_scene.genX = rx, default_scene.genY = ry;
                if((rd -= poll) < 0){
                    //console.log(rx + ", " + ry);
                    default_scene.dots[ri].setPos(rx-Sprite.qSize, ry-Sprite.qSize);
                    default_scene.dots[ri].hidden = false;
                    rd = rl; ri++;
                }
            }
            try{
                if(default_scene.qid[Math.round((ry-Sprite.qSize)/Sprite.size)][Math.round((rx-Sprite.qSize)/Sprite.size)] == 1){d = -2; break;}
            }catch(e){d = -1; break;}
        }
        if(draw) for(var i = ri; i < 10; i++) default_scene.dots[i].hidden = true;
        //  console.log("ray ret: " + d);
        return d != -2;
    }
    //private get(y: number, x: number, b = false){
    //    return default_scene.qid[y][x];
    //}
}