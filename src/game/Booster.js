let _list = new Array();

class Booster {
    constructor(startX, startY, container, bgContainer) {
        this.container = container;
        this.bgContainer = bgContainer;

        let boosterTextureArr = [];
        for (let i = 1; i <= 3; i++) {
            let texture = PIXI.Texture.from(`booster_0${i}.png`);
            boosterTextureArr.push(texture);
        }
        this.sprite = new PIXI.extras.AnimatedSprite(boosterTextureArr);
        this.sprite.animationSpeed = 0.15;
        this.sprite.loop = true;
        this.sprite.play();

        this.sprite.anchor.set(0.5, 0.5);
        // this.sprite.scale.set(0.6, 0.6);
        this.sprite.position.set(startX, startY + 10);

        this.container.addChild(this.sprite);

        this.bullet_speed = GameDefine.BULLET_SPEED / 10;
        Booster.list.push(this);
    }

    static get list() { return _list; }
    static set list(value) { _list = value; }

    update(target) {
        this.sprite.y += this.bullet_speed;

        // destroy when hit player's ship
        if (this.collisionCheck(this.sprite, target)) {
            console.log('booster hit!');
            this.sprite.destroy();
            Booster.list.splice(Booster.list.indexOf(this), 1);
            return true;
        }

        // destroy when Booster runs out of screen
        if (this.sprite.y > this.bgContainer.height + OFFSET) {
            this.sprite.destroy();
            Booster.list.splice(Booster.list.indexOf(this), 1);
            return false;
        }

        return false;
    }

    collisionCheck(booster, target) {
        let vx, vy, combined_half_w, combined_half_h;

        booster.half_w = booster.width / 2;
        booster.half_h = booster.height / 2;
        target.half_w = target.width / 2;
        target.half_h = target.height / 2;

        vx = booster.x - target.x;
        vy = booster.y - target.y;

        combined_half_w = booster.half_w + target.half_w;
        combined_half_h = booster.half_h + target.half_h;

        if (Math.abs(vx) < combined_half_w * 2 / 3) {
            if (Math.abs(vy) < combined_half_h * 4 / 5) {
                return true;
            }
        }

        return false;
    }
}

export default Booster;