import Bullet from './Bullet.js';
import FrenzyBomb from './FrenzyBomb.js';
import FrenzyWave from './FrenzyWave.js';

class Ship extends PIXI.Container {
    // class Ship extends PIXI.Sprite {
    constructor(container, bgContainer) {

        let shipTextureArr = [];
        for (let i = 1; i <= 4; i++) {
            let shipTexture = PIXI.Texture.from(`blue_ship_0${i}.png`);
            shipTextureArr.push(shipTexture);
        }

        // let shipTexture = PIXI.Texture.from('blue_ship_01.png');
        // super(shipTexture);
        super();
        // static sprite
        // this.sprite = new PIXI.Sprite(PIXI.Texture.from('blue_ship_01.png'));
        // animated sprite
        this.frenzy_effect = new PIXI.Sprite(PIXI.Texture.from('ship_frenzy.png'));

        this.sprite = new PIXI.extras.AnimatedSprite(shipTextureArr);
        this.sprite.animationSpeed = 0.15;
        this.sprite.loop = true;
        this.sprite.play();

        this.container = container;
        this.bgContainer = bgContainer;

        // this.sprite.hitArea = new PIXI.Rectangle( - this.width / 2, - this.height / 2, 100, 100);

        this.sprite.interactive = true;
        this.sprite.on("pointerup", this.TouchHandler);
        this.sprite.on("pointerdown", this.TouchHandler);
        this.sprite.on("pointermove", this.TouchHandler);

        this.bullets = Bullet.list;
        this.bombs = FrenzyBomb.list;
        this.shockwaves = FrenzyWave.list;

        this.allowToShoot = true;

        // bullet shot every SHOT_INTERVAL second(s) :)
        this.fireRate = GameDefine.SHOT_INTERVAL * FPS;
        this.fireCooldown = 0;
        this.fireMode = 0;
        this.createShip();
        console.log('Ship Created!');
    }
    createShip() {
        this.frenzy_effect.anchor.set(0.5, 0.5);
        this.frenzy_effect.scale.set(1.5);
        this.frenzy_effect.position.set(APP.GetWidth() / 2, APP.GetHeight() * 5 / 6);
        this.frenzy_effect.visible = false;

        this.sprite.anchor.set(0.5, 0.5);
        this.sprite.scale.set(1.25);
        // ship spawn point
        this.sprite.position.set(APP.GetWidth() / 2, APP.GetHeight() * 5 / 6);
        this.addChild(this.frenzy_effect);
        this.addChild(this.sprite);
    }
    update(targetX, targetY, deltaTime) {
        // console.log(`ship coord: ${this.x} - ${this.y}`);
        let dx = targetX - this.sprite.x;
        let dy = targetY - this.sprite.y;
        let len = Math.sqrt(dx * dx + dy * dy);
        let vectorSpeed = { x: dx / len, y: dy / len };
        this.sprite.x += 10 * GameDefine.GAME_SPEED_BASE * vectorSpeed.x * deltaTime;
        this.sprite.y += 10 * GameDefine.GAME_SPEED_BASE * vectorSpeed.y * deltaTime;
        this.frenzy_effect.x = this.sprite.x;
        this.frenzy_effect.y = this.sprite.y;
        
        // this.sprite.position.x = targetX;
        // this.sprite.position.y = targetY;

        if (this.sprite.x < this.getBoundary(this.bgContainer.x, 'left') ||
            this.sprite.y < this.getBoundary(this.bgContainer.height, 'top') ||
            this.sprite.x > this.getBoundary(this.bgContainer.width, 'right') ||
            this.sprite.y > this.getBoundary(this.bgContainer.height, 'bottom')) {
            this.containShip();
        }
    }
    updateFire() {
        if (this.allowToShoot) {
            if (this.fireCooldown < this.fireRate) {
                this.fireCooldown++;
            } else {
                this.shoot();
                this.fireCooldown = 0;
            }
        }
    }
    shoot() {
        switch (this.fireMode) {
            case 0:
                new Bullet(this.sprite.x, this.sprite.y, this.container, this.bgContainer, - Math.PI / 2);
                break;
            case 1:
                new Bullet(this.sprite.x, this.sprite.y, this.container, this.bgContainer, - Math.PI * 2 / 6);
                new Bullet(this.sprite.x, this.sprite.y, this.container, this.bgContainer, - Math.PI * 3 / 6);
                new Bullet(this.sprite.x, this.sprite.y, this.container, this.bgContainer, - Math.PI * 4 / 6);
                break;
            case 2:
                new Bullet(this.sprite.x, this.sprite.y, this.container, this.bgContainer, - Math.PI * 1 / 6);
                new Bullet(this.sprite.x, this.sprite.y, this.container, this.bgContainer, - Math.PI * 2 / 6);
                new Bullet(this.sprite.x, this.sprite.y, this.container, this.bgContainer, - Math.PI * 3 / 6);
                new Bullet(this.sprite.x, this.sprite.y, this.container, this.bgContainer, - Math.PI * 4 / 6);
                new Bullet(this.sprite.x, this.sprite.y, this.container, this.bgContainer, - Math.PI * 5 / 6);
                break;
        }

    }
    frenzy() {
        this.allowToShoot = false;
        this.frenzy_effect.visible = true;
        let targetX = APP.GetWidth() / 2;
        let targetY = APP.GetHeight() / 2;
        let dx = targetX - this.sprite.x;
        let dy = targetY - this.sprite.y + 100;
        let angle = dy / dx;

        let frenzy_bomb = new FrenzyBomb(this.sprite.x, this.sprite.y, this.container, this.bgContainer, angle);
    }
    exitFrenzy() {
        this.allowToShoot = true;
        this.frenzy_effect.visible = false;
    }
    
    /* param =
        0: 1 bullet per volley
        1: 3 bullets
        2: 5 bullets
    */
    setFireMode(param) {
        switch (param) {
            case 0:
                this.fireMode = 0;
                break;
            case 1:
                this.fireMode = 1;
                break;
            case 2:
                this.fireMode = 2;
                break;
            default:
                this.fireMode = 0;
                break;
        }
    }
    TouchHandler(event) {
        if (StateManager.stateNext == null) {
            Input.Update(event);
            StateManager.TouchHandler(event);
            Input.Reset(event);
        }
    }
    containShip() {
        let collision = undefined;
        let leftBound = this.getBoundary(this.bgContainer.x, 'left');
        let topBound = this.getBoundary(this.bgContainer.height, 'top');
        let rightBound = this.getBoundary(this.bgContainer.width, 'right');
        let bottomBound = this.getBoundary(this.bgContainer.height, 'bottom');

        //Left
        if (this.sprite.x < leftBound) {
            this.sprite.x = leftBound;
            collision = 'left';
        }

        //Top
        if (this.sprite.y < topBound) {
            this.sprite.y = topBound;
            collision = "top";
        }

        //Right
        if (this.sprite.x > rightBound) {
            this.sprite.x = rightBound;
            collision = "right";
        }

        //Bottom
        if (this.sprite.y > bottomBound) {
            this.sprite.y = bottomBound;
            collision = "bottom";
        }

        return collision;
    }
    getBoundary(bound, direction) {
        switch (direction) {
            case 'left':
                return bound + OFFSET;
            case 'top':
                return bound * 2 / 3 + OFFSET * 1.5;
            case 'right':
                return bound - OFFSET;
            case 'bottom':
                return bound - OFFSET;
            default:
                return;
        }
    }
    createShockwaves(startX, startY) {
        let frenzy_wave_right = new FrenzyWave(startX, startY, this.container, this.bgContainer, 0);
        let frenzy_wave_left = new FrenzyWave(startX, startY, this.container, this.bgContainer, Math.PI);
    }
}

export default Ship;