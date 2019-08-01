let _list = new Array();

class Bullet {
    constructor(startX, startY, container, bgContainer, direction) {
        this.container = container;
        this.bgContainer = bgContainer;
        this.sprite = new PIXI.Sprite(PIXI.Texture.from('bullet_horizontal.png'));

        this.sprite.anchor.set(0.5, 0.5);
        this.sprite.scale.set(0.6, 0.6);
        this.sprite.position.set(startX, startY - 100);
        this.sprite.rotation = direction;

        this.container.addChild(this.sprite);

        this.bullet_speed = GameDefine.BULLET_SPEED;
        Bullet.list.push(this);
    }

    static get list() { return _list; }
    static set list(value) { _list = value; }

    update(deltaTime, mobs) {
        this.sprite.x += this.bullet_speed * Math.cos(this.sprite.rotation) * GameDefine.GAME_SPEED_BASE * deltaTime;
        this.sprite.y += this.bullet_speed * Math.sin(this.sprite.rotation) * GameDefine.GAME_SPEED_BASE * deltaTime;
        // this.sprite.y -= this.bullet_speed * GameDefine.GAME_SPEED_BASE * deltaTime;

        if (mobs.length > 0) {
            for (let i = 0; i < mobs.length; i++) {
                for (let j = mobs[i].length - 1; j >= 0; j--) {
                    if (this.collisionCheck(this.sprite, mobs[i][j].sprite) && mobs[i][j].sprite.alpha >= 1) {
                        // console.log(`hit mob at: ${i} - ${j}`);
                        //destroy bullet
                        this.sprite.destroy();
                        Bullet.list.splice(Bullet.list.indexOf(this), 1);

                        // decrease mob hp
                        mobs[i][j].hp -= 1;
                        if (mobs[i][j].hp <= 0) {
                            let dropBooster = false;

                            //destroy hit mob
                            let mobX = mobs[i][j].sprite.x;
                            let mobY = mobs[i][j].sprite.y;

                            if (mobs[i][j].haveBooster) {
                                dropBooster = true;
                            }

                            mobs[i][j].sprite.destroy();
                            mobs[i].splice(mobs[i].indexOf(mobs[i][j]), 1);
                            // console.log(mobs[i]);
                            if (!mobs[i].length) {
                                mobs.splice(mobs.indexOf(mobs[i]), 1);
                            }
                            // console.log(`${mobX} - ${mobY}`);
                            return { x: mobX, y: mobY, booster: dropBooster };
                        } else if (mobs[i][j].sprite_shield) {
                            mobs[i][j].sprite_shield.destroy();
                            mobs[i][j].sprite_shield = undefined;
                        }
                        return;
                    }
                }
            }
        }

        // destroy when bullet runs out of screen
        if (this.sprite.x < this.bgContainer.x - OFFSET ||
            this.sprite.y < this.bgContainer.y - OFFSET ||
            this.sprite.x > this.bgContainer.width + OFFSET) {
            this.sprite.destroy();
            Bullet.list.splice(Bullet.list.indexOf(this), 1);
        }

        return;
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

        if (Math.abs(vx) < combined_half_w) {
            if (Math.abs(vy) < combined_half_h / 2) {
                return true;
            }
        }

        return false;
    }
}

export default Bullet;