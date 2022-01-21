import Input from "../../../Wolfie2D/Input/Input";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { HW4_Color } from "../../hw4_color";
import { HW4_Events } from "../../hw4_enums";
import { PlayerStates } from "../PlayerController";
import OnGround from "./OnGround";

export default class Walk extends OnGround {
	owner: AnimatedSprite;

	onEnter(options: Record<string, any>): void {
		this.parent.speed = this.parent.MIN_SPEED;
		if (this.parent.suitColor == HW4_Color.RED){ 
			this.owner.animation.play("RED_WALK", true);
		}
		else if (this.parent.suitColor == HW4_Color.GREEN){
			this.owner.animation.play("GREEN_WALK", true);
		}
		else if (this.parent.suitColor == HW4_Color.BLUE){
			this.owner.animation.play("BLUE_WALK", true);
		}
	}

	update(deltaT: number): void {
		super.update(deltaT);

		let dir = this.getInputDirection();

		if(dir.isZero()){
			this.finished(PlayerStates.IDLE);
		} else {
			if(Input.isPressed("run")){
				this.finished(PlayerStates.RUN);
			}
		}

		this.parent.velocity.x = dir.x * this.parent.speed

		this.emitter.fireEvent(HW4_Events.PLAYER_MOVE, {position: this.owner.position.clone()});
		this.owner.move(this.parent.velocity.scaled(deltaT));
	}

	onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}