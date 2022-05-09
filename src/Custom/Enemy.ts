import default_scene from "../default_scene";
import Sprite from "./Sprite";
import Particle from "./Particle";
import Proj from "./Proj";
import { GameEventType } from "../Wolfie2D/Events/GameEventType";
import { TimerState } from "../Wolfie2D/Timing/Timer";

export default class Enemy{
    private static ref = ["goomba", "bat"];
    public static List: Enemy[] = [];
    private static wGen: number;

    public t: number;
    public vx: number;
    public vy: number;
    public w: number = 0;
    public hw: number = 0;
    public wl: number;
    public s: Sprite;
    private hp: number;
    private walk: number = 0;
    public grounded: boolean;
    constructor(x: number, y: number, t = 0){
        this.t = t;
        this.vx = this.vy = 0;
        this.w = Enemy.randFloat(0, 5);
        
        switch(t){
            case 0: this.vx = 1; this.grounded = true; this.hp = 10; this.wl = Enemy.randFloat(290, 350); break;
            case 1: this.wl = 50; this.hp = 5; break;
        }
        this.s = new Sprite(Enemy.ref[t].toString(), true, 5, x, y);
        Enemy.List.push(this);
    }
    static Run(del: number){
        for(var e of Enemy.List) e.run(del);
    }
    run(del: number){
        if(this.hw > 0) this.hw -= del;
        switch(this.t){
            case 0: //goomba AI
                if(this.grounded = default_scene.qid[Enemy.wGen = Math.round(this.s.y/Sprite.size)+1][Math.round(this.s.x/Sprite.size)] != 0){
                    if(default_scene.qid[Math.round(this.s.y/Sprite.size)][Math.round((this.s.x+this.vx*Sprite.qSize)/Sprite.size)]) this.vx *= -1;
                    this.vy = 0, this.s.y = (Enemy.wGen-1)*Sprite.size;
                    if(this.w < 0){ //attacking
                        //this.s.frame = this.w > -5 ? 3 : 2;
                        this.s.flip = default_scene.Player.x > this.s.x;
                        if((this.w += del) >= 0){ //firing
                            if(!default_scene.rayTo(this.s, default_scene.Player)) return;
                            var newProj = new Proj(new Sprite("spit", false, -1, this.s.x+Sprite.qSize, this.s.y+Sprite.qSize), default_scene.genX*2, default_scene.genY*2, 1);
                            newProj.h = true;
                            default_scene.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "spit", loop: false, holdReference: false});
                            this.s.frame = 3;
                        }
                    }else if((this.w += del) > this.wl) this.w = Enemy.randFloat(-30, -25); //waiting
                    else{ //walking
                        this.s.flip = this.vx < 0, this.s.x += this.vx * del;
                        if((this.walk += del) > 10){
                            this.walk = 0;
                            this.s.frame = this.s.frame == 0 ? 1 : 0;
                        }
                    }
                }else this.vy += .4 * del, this.s.y += this.vy;
            break; case 1: //bat AI
                if((this.w += del) >= this.wl){ //set the direction
                    this.vx = default_scene.Player.x-this.s.x;
                    this.vy = default_scene.Player.y-this.s.y;
                    Enemy.wGen = Math.sqrt(this.vx*this.vx+this.vy*this.vy);
                    this.vx /= Enemy.wGen; this.vy /= Enemy.wGen;
                    this.w -= this.wl;
                }
                if((Enemy.wGen = Math.round(this.s.y/Sprite.size)) < 0) this.s.y = 0, this.vy *= -1;
                else if(Enemy.wGen >= default_scene.qid.length) this.s.y = default_scene.ch-Sprite.size, this.vy *= -1;
                if((Enemy.wGen = Math.round(this.s.x/Sprite.size)) < 0) this.s.x = 0, this.vx *= -1;
                else if(Enemy.wGen >= default_scene.qid[0].length) this.s.x = default_scene.cw-Sprite.size, this.vx *= -1;
                if(default_scene.qid[Math.round(this.s.y/Sprite.size)][Math.round((this.s.x+this.vx*Sprite.qSize)/Sprite.size)] == 1) this.vx = 0;
                if(default_scene.qid[Math.round((this.s.y+this.vy*Sprite.qSize)/Sprite.size)][Math.round(this.s.x/Sprite.size)] == 1) this.vy = 0;
                if(this.hw <= 0) this.s.move(this.vx, this.vy);
                if(default_scene.dashing <= 0 && default_scene.distance(this.s, default_scene.Player) < 15) default_scene.damage();
                this.s.flip = default_scene.Player.x < this.s.x;
                if((this.walk += del) > 10){
                    this.walk = 0;
                    this.s.frame = this.s.frame == 0 ? 1 : 0;
                }
            break; case 2: //monkey? AI

            break;
        }
    }
    check(p: Proj){
        if(!this.s.check(p.s)) return false;
        if(p.t != 1){ //blood splat if not grenade
            Particle.Cloud(p.s.x+Sprite.qSize, p.s.y+Sprite.qSize, 10, 10, '#ff0000', 50, .4, p.vx, p.vy);
            Particle.Cloud(p.s.x+Sprite.qSize, p.s.y+Sprite.qSize, 10, 5, '#ff0000', 50, .4, -.2*p.vx, -.2*p.vy);
            default_scene.camShake(3, 10);
            default_scene.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "splat", loop: false, holdReference: false});
        }else p.del();
        //if(p.t == 1) p.del();
        this.hurt((p.t <= 0 ? 1 : 3)*Math.max(p.c, 1), p.vx, p.vy);
        return true;
    }
    die(x: number, y: number){
        if(Enemy.List.indexOf(this) == -1) return;
        if(!isNaN(x) || !isNaN(y)){
            console.log(x + ", " + y);
            var np = new Proj(this.s, x, y - 10, 0);
            np.f = true;
            np.bounce = .5;
            np.en = true;
            this.s.frame = 4;
            this.del(true);
        }else this.del();
        default_scene.addScore((this.t == 2 ? 100 : 50));
    }
    hurt(d: number, vx = 0, vy = 0){
        if(this.hw > 0) return;
        if((this.hp -= d) <= 0){
            var gen = Math.sqrt(vx*vx+vy*vy);
            this.die(vx / gen, vy / gen);
            return;
        }
        this.s.frame = 2;
        this.walk = 0;
        this.hw = 10;
        default_scene.addScore(10);
    }
    del(b = false){
        if(!b) this.s.del();
        Enemy.List.splice(Enemy.List.indexOf(this), 1);
    }
    public static randFloat(l: number, u: number){
        return l + Math.random()*(u-l);
    }
    static Clear(){
        for(var e of Enemy.List) e.s.del();
        Enemy.List = [];
    }
}