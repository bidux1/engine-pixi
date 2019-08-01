let _list = new Array();

class FrenzyWave {
    constructor(startX, startY, container, bgContainer, direction) {
        this.container = container;
        this.bgContainer = bgContainer;

        let waveTextureArr = [];
        for (let i = 1; i <= 3; i++) {
            let texture = PIXI.Texture.from(`frenzy_wave_0${i}.png`);
            waveTextureArr.push(texture);
        }

        this.sprite = new PIXI.extras.AnimatedSprite(waveTextureArr);

        this.bullet_speed = GameDefine.BULLET_SPEED;
        this.createShockWave(startX, startY, direction);
        FrenzyWave.list.push(this);

    }
    static get list() { return _list; }
    static set list(value) { _list = value; }
    createShockWave(startX, startY, direction) {
        this.sprite.scale.set(5);
        this.sprite.anchor.set(0.5, 0.5);
        this.sprite.position.set(startX, startY);
        this.sprite.rotation = direction;
        this.sprite.animationSpeed = 0.05;

        this.container.addChild(this.sprite);
        this.sprite.play();
    }
    update(deltaTime, mobs) {
        this.sprite.x += this.bullet_speed * Math.cos(this.sprite.rotation) * GameDefine.GAME_SPEED_BASE * deltaTime;
        this.sprite.y += this.bullet_speed * Math.sin(this.sprite.rotation) * GameDefine.GAME_SPEED_BASE * deltaTime;

        if (mobs.length > 0) {
            for (let i = 0; i < mobs.length; i++) {
                for (let j = mobs[i].length - 1; j >= 0; j--) {
                    if (this.onCollisionCheck(mobs[i][j].sprite) && mobs[i][j].sprite.alpha >= 1) {
                        // console.log(`hit mob at: ${i} - ${j}`);
                        // decrease mob hp
                        mobs[i][j].hp = 0;
                        if (mobs[i][j].hp <= 0) {
                            //destroy hit mob
                            let mobX = mobs[i][j].sprite.x;
                            let mobY = mobs[i][j].sprite.y;

                            mobs[i][j].sprite.destroy();
                            if (mobs[i][j].sprite_shield) {
                                mobs[i][j].sprite_shield.destroy();
                                mobs[i][j].sprite_shield = undefined;
                            }
                            mobs[i].splice(mobs[i].indexOf(mobs[i][j]), 1);
                            // console.log(mobs[i]);
                            if (!mobs[i].length) {
                                mobs.splice(mobs.indexOf(mobs[i]), 1);
                            }
                            return { x: mobX, y: mobY };
                        }
                    }
                }
            }
        }

        if (this.sprite.rotation == Math.PI) {
            if (this.sprite.x < this.bgContainer.x - OFFSET) {
                this.sprite.destroy();
                FrenzyWave.list.splice(FrenzyWave.list.indexOf(this), 1);
            }
        } else if (this.sprite.rotation == 0) {
            if (this.sprite.x > this.bgContainer.width + OFFSET) {
                this.sprite.destroy();
                FrenzyWave.list.splice(FrenzyWave.list.indexOf(this), 1);
            }
        }
    }
    onCollisionCheck(target) {
        let vx, combined_half_w;

        this.sprite.half_w = this.sprite.width / 2;
        target.half_w = target.width / 2;
        vx = this.sprite.x - target.x;
        combined_half_w = this.sprite.half_w + target.half_w;

        if (Math.abs(vx) < combined_half_w) {
            return true;
        }

        return false;
    }
}

export default FrenzyWave;