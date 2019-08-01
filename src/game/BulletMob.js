let _list = new Array();
// let bullet_speed = GameDefine.BULLET_MOB_SPEED;

class BulletMob {
    constructor(startX, startY, shipX, shipY, container, bgContainer, bullet_speed) {
        this.container = container;
        this.bgContainer = bgContainer;

        this.sprite = new PIXI.Sprite(PIXI.Texture.from('bullet_mob.png'));

        this.sprite.anchor.set(0.5, 0.5);
        this.sprite.scale.set(1.5, 1.5);
        this.sprite.position.set(startX, startY);
        this.shipX = shipX;
        this.shipY = shipY;
        if (shipX != null && shipY != null) {
            let dx = shipX - this.sprite.x;
            let dy = shipY - this.sprite.y;
            this.direction = dy / dx;
        }

        this.container.addChild(this.sprite);

        this.bullet_speed = bullet_speed;
        BulletMob.list.push(this);
    }

    static get list() { return _list; }
    static set list(value) { _list = value; }

    update(target, deltaTime) {
        if (this.shipX != null && this.shipY != null) {
            let dx = this.shipX - this.sprite.x;
            let dy = this.shipY - this.sprite.y;
            let len = Math.sqrt(dx * dx + dy * dy);
            let vectorSpeed = { x: dx / len, y: dy / len };

            this.sprite.x += this.bullet_speed * Math.cos(this.direction) * GameDefine.GAME_SPEED_BASE * deltaTime;
            this.sprite.y += this.bullet_speed * Math.sin(this.direction) * GameDefine.GAME_SPEED_BASE * deltaTime;
        } else {
            this.sprite.y += this.bullet_speed;
        }
        this.sprite.rotation += 0.01;

        // destroy when hit player's ship
        if (this.collisionCheck(this.sprite, target)) {
            console.log('ship hit!');
            this.sprite.destroy();
            BulletMob.list.splice(BulletMob.list.indexOf(this), 1);
            return true;
        }

        // destroy when bullet runs out of screen
        if (this.sprite.y > this.bgContainer.height + OFFSET) {
            this.sprite.destroy();
            BulletMob.list.splice(BulletMob.list.indexOf(this), 1);
            return false;
        }

        return false;
    }
    collisionCheck(bullet, target) {
        let vx, vy, combined_half_w, combined_half_h;

        bullet.half_w = bullet.width / 2;
        bullet.half_h = bullet.height / 2;
        target.half_w = target.width / 2;
        target.half_h = target.height / 2;

        vx = bullet.x - target.x;
        vy = bullet.y - target.y;

        combined_half_w = bullet.half_w + target.half_w;
        combined_half_h = bullet.half_h + target.half_h;

        if (Math.abs(vx) < combined_half_w * 2 / 3) {
            if (Math.abs(vy) < combined_half_h * 4 / 5) {
                return true;
            }
        }

        return false;
    }
}

export default BulletMob;