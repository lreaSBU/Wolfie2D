import default_scene from "../default_scene";
import Sprite from "./Sprite";
import Enemy from "./Enemy";
import { TimerState } from "../Wolfie2D/Timing/Timer";

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
    public h: boolean = false;
    public f: boolean = false;
    public l: number = 0;
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
        default_scene.hasBall = true;
        Proj.List.splice(Proj.List.indexOf(this), 1);
    }
    run(del: number){
        default_scene.genX = this.vx < 0 ? Sprite.hSize : 0;
        default_scene.genY = this.vy < 0 ? Sprite.hSize : 0;
        if(this.s.y + this.vy < 0 || this.s.y + this.vy + Sprite.hSize > default_scene.mh || (Proj.wGen = default_scene.qid[Math.round((this.s.y + this.vy - default_scene.genY)/Sprite.size)][Math.round((this.s.x-Sprite.qSize)/Sprite.size)]) == 1 || (Proj.wGen == 2 && this.vy > 0)){
            if(this.vy > 0 && this.vy < .2) this.vy = 0;
            this.vy *= -.8; this.vx *= .9;
            this.sx = this.sy = 0;
            if(--this.c <= 0) this.g = -.4;
            //else if(this.f) this.del(true);
        }else if(this.s.x + this.vx < 0 || this.s.x + this.vx + Sprite.hSize > default_scene.mw || default_scene.qid[Math.round((this.s.y-Sprite.qSize)/Sprite.size)][Proj.wGen = Math.round((this.s.x + this.vx - default_scene.genX)/Sprite.size)] == 1){
            this.vx *= -.8; this.vy *= .9;
            this.sx = this.sy = 0;
            if(--this.c <= 0) this.g = -.4;
            //else if(this.f) this.del(true);
        }
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
            if(default_scene.parrying >= 0 && default_scene.distance(this.s, default_scene.Player, Sprite.qSize, -Sprite.qSize) < Sprite.size){
                if(this.h) this.l = 100, this.f = true;
                else default_scene.px = this.vx, default_scene.py = this.vy;
                this.vx *= -.1; this.vy = -5; this.c = 0; this.g = -.4;
                default_scene.parrying = -1, default_scene.parryCool = 40;
                this.h = false; default_scene.camShake(2, 10);
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
}