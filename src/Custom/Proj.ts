import default_scene from "../default_scene";
import Sprite from "./Sprite";
import Enemy from "./Enemy";
import { TimerState } from "../Wolfie2D/Timing/Timer";
import { GameEventType } from "../Wolfie2D/Events/GameEventType";
import Particle from "./Particle";
import Scene from "../Wolfie2D/Scene/Scene";

export default class Proj{
    public static List: Proj[] = [];
    private static wGen: number = 0;

    public s: Sprite;
    public vx: number = 0;
    public vy: number = 0;
    public c: number = 0;
    public t: number = 0;
    public sx: number = 0;
    public sy: number = 0;
    public g: number = 0;
    public bounce: number = 1;
    public h: boolean = false;
    public f: boolean = false;
    public en: boolean = false;
    public spin: number = -1;
    public l: number = 0;
    public safe: number = -1;
    constructor(s: Sprite, vx: number, vy: number, c: number, t = -1, sx = 0, sy = 0, g = 0, l = 1000){
        this.setAll(s, vx, vy, c, t, sx, sy, g, l);
        //Proj.List.push(this);
    }
    setAll(s: Sprite, vx: number, vy: number, c: number, t = -1, sx = 0, sy = 0, g = 0, l = 1000){
        this.s = s;
        this.vx = vx;
        this.vy = vy;
        this.c = c;
        this.t = t;
        this.bounce = this.t == 2 ? .1 : this.t == 0 ? 1 : .7;
        this.sx = sx;
        this.sy = sy;
        this.g = g;
        this.l = l;
        if(c == 0) this.g = -.4;
        s.p = this;
        if(Proj.List.indexOf(this) == -1) Proj.List.push(this);
    }
    static Run(del: number){
        for(var p of Proj.List) p.run(del);
    }
    del(b = false){
        if(b || this.h) this.s.del();
        if(this.t == 1){ // explode effect
            Proj.explo(this.s);
        }
        Proj.List.splice(Proj.List.indexOf(this), 1);
    }
    run(del: number){
        if(this.safe > 0) this.safe -= del;
        default_scene.genX = this.vx < 0 ? Sprite.hSize : 0;
        default_scene.genY = this.vy < 0 ? Sprite.hSize : 0;
        //console.log("X:: " + Math.round((this.s.y + this.vy - default_scene.genY)/Sprite.size));
        //console.log("Y:: " + Math.round((this.s.x-Sprite.qSize)/Sprite.size));
        if(this.s.y + this.vy < 0 || this.s.y + this.vy + Sprite.hSize > default_scene.mh || (Proj.wGen = default_scene.qid[Math.round((this.s.y + this.vy - default_scene.genY)/Sprite.size)][Math.round((this.s.x-Sprite.qSize)/Sprite.size)]) == 1 || (Proj.wGen == 2 && this.vy > 0)){
            if(this.vy > 0 && this.vy < .2/this.bounce) this.vy = 0;
            this.vy *= -.8 * this.bounce; this.vx *= .9 * this.bounce;
            this.doBounce();
        }else if(this.s.x + this.vx < 0 || this.s.x + this.vx + Sprite.hSize > default_scene.mw || default_scene.qid[Math.round((this.s.y-Sprite.qSize)/Sprite.size)][Proj.wGen = Math.round((this.s.x + this.vx - default_scene.genX)/Sprite.size)] == 1){
            this.vx *= -.8 * this.bounce; this.vy *= .9 * this.bounce;
            this.doBounce();
        }
        if(this.t == 2 && (this.spin -= del * Math.abs(this.vx + this.vy)) < 0) this.spin = 5, this.s.frame += this.s.frame == 3 ? -3 : 1;
        if((this.l -= del) <= 0) this.c = 0, this.g = -.4;
        if(this.h && this.c == 0){this.del(true); return;}
        else if(!this.h && (Math.abs(this.vx) > 14 || Math.abs(this.vy) > 14)) for(var e of Enemy.List) if(e.check(this)){
            if(this.t == 0){
                this.vx = -.1 * Math.sign(this.vx);
                this.vy = -9; this.c = 0; this.g = -.4;
            }
            if(this.f) this.del(true);
            if(this.t != 2) return;
        }
        if(this.h || (default_scene.parrying >= 0 && Math.abs(this.vx) > 10 || Math.abs(this.vy) > 10)){ //hit Player
            if(this.safe < 0 && default_scene.parrying >= 0 && default_scene.distance(this.s, default_scene.Player, Sprite.qSize, -Sprite.qSize) < Sprite.size){
                if(this.h) this.l = 100, this.f = true, default_scene.addScore(10);
                else{
                    default_scene.px = this.vx, default_scene.py = this.vy;
                    Proj.wGen = Math.sqrt(default_scene.px*default_scene.px+default_scene.py*default_scene.py);
                    default_scene.px /= Proj.wGen; default_scene.py /= Proj.wGen;
                    Proj.wGen = 16 + Math.max(0, this.c) * 2;
                    default_scene.px *= Proj.wGen; default_scene.py *= Proj.wGen;
                    //default_scene.pvEnd();
                    //default_scene.vx = default_scene.px; default_scene.vy = default_scene.py;
                    //default_scene.px = default_scene.py = 0;
                    default_scene.vy = default_scene.py;
                    default_scene.py = 0;
                }
                this.vx *= -.1; this.vy = -5; this.c = 0; this.g = -.4;
                default_scene.parrying = -1, default_scene.parryCool = this.h ? 5 : 40;
                this.h = false; default_scene.camShake(2, 10);
                default_scene.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "parry", loop: false, holdReference: false});
            }else if(default_scene.parrying < 0 && this.h && this.hitPlayer()){
                default_scene.damage();
                this.del(true); return;
            }
        }
        if(this.g == 0){ //spin
            this.vx += this.sx, this.vy += this.sy;
            if(this.sx != 0 || this.sy != 0){
                Proj.wGen = Math.sqrt(this.vx*this.vx + this.vy*this.vy);
                this.vx /= Proj.wGen; this.vy /= Proj.wGen;
                this.vx *= 20; this.vy *= 20;
            }
        }
        else if(this.vy != 0) this.vy -= this.g * del;
        else if(Math.abs(this.vx /= 2) < .1) this.del(this.f);
        this.s.move(this.vx, this.vy, del);
        this.s.rotate(this.vx, del);
    }
    private hitPlayer(): boolean{
        if(default_scene.dashing > 0) return false;
        return Math.abs(this.s.x - Sprite.qSize - default_scene.Player.x) < Sprite.hSize && (Proj.wGen = this.s.y - default_scene.Player.y) > -Sprite.qSize && Proj.wGen < Sprite.size;
    }
    private doBounce(){
        this.sx = this.sy = 0;
        if(this.en){
            Particle.Cloud(this.s.x+Sprite.qSize, this.s.y+Sprite.qSize, 10, 5, '#ff0000', 50, .4, -.02*this.vx, -.02*this.vy);
            default_scene.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "splat", loop: false, holdReference: false});
        }else switch(this.t){
            case 0: default_scene.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "bounce", loop: false, holdReference: false}); break;
            case 1: if(this.c > 0) this.del(); break;
            case 2: this.c = 0; break;
        }
        if(--this.c <= 0) this.g = -.4;
        //else if(this.f) this.del(true);
    }
    public static explo(source: Sprite){
        //explo particle effects here:
        
        for(var e of Enemy.List) if(default_scene.distance(e.s, source) <= 10) e.hurt(5);
        if(default_scene.distance(default_scene.Player, source)) default_scene.damage();
    }
}