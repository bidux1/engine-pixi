let GAME_WIDTH = 1334;
let GAME_HEIGHT = 750;

class GameConfig
{
	constructor()
	{
		this.isMigGamePortrait = true;

		this.CalculateScreenSize();
	}

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

	CalculateScreenSize()
	{
		if (this.isMigGamePortrait)
		{
			// this.width	= 750;
			this.width	= GAME_HEIGHT;
			this.height	= GAME_WIDTH;
		}
		else
		{
			this.width	= GAME_WIDTH;
			this.height	= GAME_HEIGHT;
			// this.height	= 750;
		}
	}
}
module.exports = new GameConfig();