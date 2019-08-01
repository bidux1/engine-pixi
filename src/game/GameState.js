import Ship from './Ship.js';
import MobPool from './MobPool.js';
import ScoreSprite from './ScoreSprite.js';
import Booster from './Booster.js';

let HIT_SCORE_S1 = 100;
let HIT_SCORE_S2 = 200;
let HIT_SCORE_S3 = 300;
let GET_HIT_SCORE = -300;
let HIT = 0;
let GET_HIT = 1;

class GameState extends PIXI.Container {
	constructor() {
		super();
		this.sheet = null;
		this.bg = null;
		this.logo = null;
		this.score_wrapper = null;
		this.score_icon_effect = null;
		this.score_icon = null;
		this.score_bar = null;
		this.score_pool = [];
		this.partial_score_bar = 0;
		// this.score_bar_full = null;
		this.mobs = [];
		this.boosters = Booster.list;
		this.mob_pool = null;

		this.ship = null;

		this.targetX = -1;
		this.targetY = -1;
		this.score = 0;
		this.hit_score = HIT_SCORE_S1;
		this.difficulty = 0;

		this.timer = 31;
		this.startGame = false;

		this.interactive = true;
		APP.AddChild(this);
	}

	//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

	Load() {
		const loader = PIXI.loader;

		loader.on("progress", this.LoadProgressHandler.bind(this));
		loader.on("error", this.LoadErrorHandler.bind(this));
		loader.on("complete", this.LoadCompleteHandler.bind(this));

		loader.add('imgBg', 'data/image/bg.jpg');
		loader.add('spriteSheet', 'data/image/sprites/spriteSheet.json');

		loader.load();

	}

	//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

	Unload() {
		APP.RemoveChild(this);
		// no, not THAT "End Game"
		StateManager.PushState(EndGameState);
	}

	//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

	Update(deltaTime) {
		// console.log(APP.renderer.width);

		if (this.bg) {
			if (this.score_pool.length > 0) {
				this.score_pool.map((scoreSprite) => {
					if (scoreSprite.update())
						this.score_pool.splice(this.score_pool.indexOf(scoreSprite), 1);
				})
			}

			if (this.ship) {
				if (this.ship.fireMode == 0) {
					this.hit_score = HIT_SCORE_S1;
				} else if (this.ship.fireMode == 1) {
					this.hit_score = HIT_SCORE_S2;
				} else {
					this.hit_score = HIT_SCORE_S3;
				}

				// update ship movement
				if (this.targetX != -1 || this.targetY != -1) {
					// this.ship.allowToShoot = true;
					this.startGame = true;
					this.ship.update(this.targetX, this.targetY, deltaTime);
				}
				// update ship's bullet travel
				this.ship.updateFire();
				if (this.ship.bullets) {
					this.ship.bullets.map((bullet) => {
						let isKill = bullet.update(deltaTime, this.mobs);
						// bullet killed mob
						if (isKill) {
							if (isKill.booster) {
								new Booster(isKill.x, isKill.y, this, this.bg);
							}

							// display score sprite
							let score_sprite = new ScoreSprite(HIT, this.difficulty, isKill.x, isKill.y);
							this.addChild(score_sprite);
							this.score_pool.push(score_sprite);

							// increase score if hit mob
							if (this.score_bar.children[1].width < this.partial_score_bar * 10) {
								this.score_bar.children[1].width += this.partial_score_bar * 1;
								if (this.score_bar.children[1].width >= this.partial_score_bar * 10) {
									this.ship.frenzy();
									this.score_icon_effect.visible = true;
									console.log('BOMB DROPPED!');
								}
							}

							this.score += this.hit_score;
							console.log(`Current Score: ${this.score}`);
							// respawn mob
							if (this.mobs.length <= 0) {
								setTimeout(function () {
									this.difficulty++;
									this.RespawnMob();
								}.bind(this), 1500);
							}
						}
					});
				}

				if (this.score_icon_effect.visible) {
					this.score_icon_effect.rotation += 0.1;
				}

				if (this.ship.bombs.length > 0) {
					this.ship.bombs.map((bomb) => {
						if (bomb.update(deltaTime, this.mobs)) {
							setTimeout(function () {
								bomb.detonate();
								this.ship.createShockwaves(bomb.sprite.x, bomb.sprite.y);
								// reset score bar
								this.score_bar.children[1].width = 0;
								this.score_icon_effect.visible = false;
								this.ship.exitFrenzy();
							}.bind(this), 1000);
						}

					});
				}

				if (this.boosters.length > 0) {
					this.boosters.map((booster) => {
						if (booster.update(this.ship.sprite)) {
							if (this.ship.fireMode >= 1) {
								this.ship.fireMode = 2;
							} else {
								this.ship.fireMode = 1;
							}
						}
					});
				}

				if (this.ship.shockwaves.length > 0) {
					this.ship.shockwaves.map((wave) => {
						let mobHit = wave.update(deltaTime, this.mobs);
						if (mobHit) {
							// display score sprite
							let score_sprite = new ScoreSprite(HIT, 1, mobHit.x, mobHit.y);
							this.addChild(score_sprite);
							this.score_pool.push(score_sprite);

							this.score += HIT_SCORE_S2;
							console.log(`Current Score: ${this.score}`);
							if (this.mobs.length <= 0) {
								setTimeout(function () {
									// respawn mob
									this.difficulty++;
									this.RespawnMob();
								}.bind(this), 1500);
							}
						}
					})
				}


				// if (this.score >= 1000) {
				// 	this.ship.fireMode = 1;
				// }
				// if (this.score >= 2500) {
				// 	this.ship.fireMode = 2;
				// }
				// end game based on score
				// if (this.score >= 8000) {
				// 	this.Unload();
				// }
				//end game based on time limit
			}

			// update mob's bullet travel
			if (this.mobs.length > 0) {
				// if (this.ship.allowToShoot) {
				this.mobs.forEach(function (mobRow) {
					mobRow.forEach(function (mob) {
						mob.allowToShoot = true;
						mob.update();
						mob.updateFire(this.ship.sprite.x, this.ship.sprite.y);
						if (mob.bullets) {
							mob.bullets.map((bullet) => {
								if (bullet.update(this.ship.sprite, deltaTime)) {
									// display score sprite
									let score_sprite = new ScoreSprite(GET_HIT, this.difficulty, this.ship.sprite.x, this.ship.sprite.y);
									this.addChild(score_sprite);
									this.score_pool.push(score_sprite);

									// decrease score if ship gets hit
									this.score += GET_HIT_SCORE;
									if (this.score <= 0) {
										this.score = 0;
									}
									console.log(`Current Score: ${this.score}`);
								}
							});
						}
					}.bind(this));
				}.bind(this));
				// }
			}
		}
	}

	//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

	LoadProgressHandler(loader, resource) {
		console.log("LoadProgressHandler: " + resource.name);

		switch (resource.name) {
			case 'imgBg':
				{
					this.bg = new PIXI.Sprite(PIXI.Texture.from('imgBg'));
					// scale BG to canvas size
					this.bg.width = APP.renderer.width;
					this.bg.height = APP.renderer.height;
					break;
				}
			case 'spriteSheet':
				{
					this.sheet = PIXI.loader.resources['spriteSheet'];
					console.log(this.sheet);
					//1. create UI
					// HnS Logo
					this.logo = new PIXI.Sprite(PIXI.Texture.from('logo_hns_01.png'));
					this.logo.scale.set(1.25);
					this.logo.position.set(0, 0);

					// score
					this.score_wrapper = new PIXI.Container();
					this.score_icon_effect = new PIXI.Sprite(PIXI.Texture.from('effect_shining.png'));
					this.score_icon_effect.scale.set(1.5, 1.5);
					this.score_icon_effect.anchor.set(0.5);
					this.score_icon_effect.position.set((APP.GetWidth() / 2), 120);
					this.score_icon_effect.visible = false;

					this.score_icon = new PIXI.Sprite(PIXI.Texture.from('icon_score.png'));
					this.score_icon.scale.set(1.5, 1.5);
					this.score_icon.anchor.set(0.5);
					this.score_icon.position.set((APP.GetWidth() / 2), 120);

					this.score_bar = new PIXI.Container();
					let score_bar_full = new PIXI.Sprite(PIXI.Texture.from('bar_full.png'));
					score_bar_full.scale.set(1.5, 1.5);
					score_bar_full.position.set((APP.GetWidth() / 2) + this.score_icon.width / 4, 80);
					this.partial_score_bar = score_bar_full.width / 10;

					let score_bar_empty = new PIXI.Sprite(PIXI.Texture.from('bar_empty.png'));
					score_bar_empty.scale.set(1.5, 1.5);
					score_bar_empty.position.set((APP.GetWidth() / 2) + this.score_icon.width / 4, 80);

					this.score_bar.addChild(score_bar_empty);
					this.score_bar.addChild(score_bar_full);
					this.score_wrapper.addChild(this.score_icon_effect);
					this.score_wrapper.addChild(this.score_icon);
					this.score_wrapper.addChild(this.score_bar);

					this.score_bar.children[1].width = 0;

					//2. create ship
					this.ship = new Ship(this, this.bg);

					//3. create mobs
					this.mob_pool = new MobPool(this, this.bg);
					this.mob_pool.generateMobs(this.difficulty);
					this.mobs = this.mob_pool.getMobs();


					break;
				}
		}
	}

	//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

	LoadErrorHandler(error) {
		console.log("LoadErrorHandler: " + error);
	}

	//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

	LoadCompleteHandler() {
		console.log("LoadCompleteHandler");

		this.addChild(this.bg);
		this.addChild(this.logo);
		// this.addChild(this.score_icon);
		// this.addChild(this.score_bar);
		this.addChild(this.score_wrapper);
		setTimeout(function () {
			for (let i = 0; i < this.mobs.length; i++) {
				for (let j = 0; j < this.mobs[i].length; j++) {
					this.addChild(this.mobs[i][j]);
				}
			}
		}.bind(this), 1);
		this.addChild(this.ship);
	}

	//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

	TouchHandler(event) {
		if (Input.IsTouchMove(event)) {
			this.targetX = Input.touchX + Input.touchDX;
			this.targetY = Input.touchY + Input.touchDY;
		}
		else if (Input.IsTouchUp(event) || Input.IsTouchUpOutside(event)) {
			this.targetX = -1;
			this.targetY = -1;
		}
	}

	RespawnMob() {
		this.mob_pool.generateMobs(this.difficulty);
		this.mobs = this.mob_pool.getMobs();
		for (let i = 0; i < this.mobs.length; i++) {
			for (let j = 0; j < this.mobs[i].length; j++) {
				this.addChild(this.mobs[i][j]);
			}
		}
	}
}
module.exports = new GameState();