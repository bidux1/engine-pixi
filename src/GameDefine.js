class GameDefine
{
	constructor()
	{
		this.GAME_SPEED_BASE = 60;
		this.BULLET_SPEED = 30;
		this.BULLET_MOB_SPEED = 0.25;
		this.SHOT_INTERVAL = 0.75;
		this.MOB_SHOT_INTERVAL = 3;
	}
}
module.exports = new GameDefine();