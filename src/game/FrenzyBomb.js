let _list = new Array();

class FrenzyBomb {
    constructor(startX, startY, container, bgContainer, direction) {
        this.container = container;
        this.bgContainer = bgContainer;

        // this.sprite_wrapper = new PIXI.Container();

        let bombTextureArr = [];
        for (let i = 1; i <= 4; i++) {
            let texture = PIXI.Texture.from(`bomb_0${i}.png`);
            bombTextureArr.push(texture);
        }

        this.sprite = new PIXI.extras.AnimatedSprite(bombTextureArr);
        this.sprite.animationSpeed = 0.15;
        this.sprite.loop = true;
        this.sprite.play();
        this.sprite.rotation = direction;

        this.blastTextureArr = [];
        for (let i = 1; i <= 3; i++) {
            let texture = PIXI.Texture.from(`frenzy_blast_0${i}.png`);
            this.blastTextureArr.push(texture);
        }

        this.shockwaveTextureArr = [];
        for (let i = 1; i <= 3; i++) {
            let texture = PIXI.Texture.from(`frenzy_wave_0${i}.png`);
            this.shockwaveTextureArr.push(texture);
        }
        this.shockwaves = [];

        this.bullet_speed = GameDefine.BULLET_SPEED;
        this.bomb_reached = false;
        this.createBomb(startX, startY);
        FrenzyBomb.list.push(this);

    }
    static get list() { return _list; }
    static set list(value) { _list = value; }

    createBomb(startX, startY) {
        this.sprite.anchor.set(0.5, 0.5);
        // this.sprite.scale.set(1.25, 1.25);
        // ship spawn point
        this.sprite.position.set(startX, startY - 100);
        // this.sprite_wrapper.addChild(this.sprite);
        // this.container.addChild(this.sprite_wrapper);

        this.container.addChild(this.sprite);
    }
    createBlast() {
        this.blastEffect = new PIXI.extras.AnimatedSprite(this.blastTextureArr);
        this.blastEffect.animationSpeed = 0.1;
        this.blastEffect.loop = false;
        this.blastEffect.scale.set(3, 3);
        this.blastEffect.anchor.set(0.5, 0.5);
        this.blastEffect.position.set(this.sprite.x, this.sprite.y);
        this.container.addChild(this.blastEffect);
        this.blastEffect.play();
        this.blastEffect.onComplete = function () {
            //shoot out waves
            this.blastEffect.destroy();
        }.bind(this);
    }
    update(deltaTime) {
        // send frenzy bomb flying
        let targetX = APP.GetWidth() / 2;
        let targetY = APP.GetHeight() / 3;
        let dx = targetX - this.sprite.x;
        let dy = targetY - this.sprite.y;
        let len = Math.sqrt(dx * dx + dy * dy);
        let vectorSpeed = { x: dx / len, y: dy / len };

        this.sprite.x += this.bullet_speed * GameDefine.GAME_SPEED_BASE * vectorSpeed.x * deltaTime;
        this.sprite.y += this.bullet_speed * GameDefine.GAME_SPEED_BASE * vectorSpeed.y * deltaTime;

        if (this.sprite.x > targetX - 20 && this.sprite.x < targetX + 20 && this.sprite.y > targetY - 20 && this.sprite.y < targetY + 20 && !this.bomb_reached) {
            this.bomb_reached = true;
            return true;
        }
        return;
    }
    detonate() {
        this.createBlast();
        this.sprite.visible = false;
        setTimeout(function () {
            this.sprite.destroy();
            FrenzyBomb.list.splice(FrenzyBomb.list.indexOf(this), 1);
        }.bind(this), 3000);
    }
}

export default FrenzyBomb;