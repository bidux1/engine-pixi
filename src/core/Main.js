require('pixi.js');

global.GameDefine	= require('../GameDefine');
global.GameConfig	= require('../Config');
global.Input		= require('./Input');
global.StateManager	= require('./StateManager');
global.APP			= require('./Application');
global.LandingState	= require('../game/LandingState');
global.GameState	= require('../game/GameState');
global.EndGameState	= require('../game/EndGameState');
global.OFFSET = 100;
global.FPS = 60;

function GameLoop(deltaTime)
{
	// 60 FPS
	deltaTime = deltaTime / (FPS * APP.ticker.speed);
	APP.Update(deltaTime);
	APP.Render();
}

window.main = function()
{
	APP.Init(GameLoop);
	StateManager.PushState(LandingState);
	// StateManager.PushState(GameState);
}