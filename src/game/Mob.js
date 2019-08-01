import BulletMob from './BulletMob.js';

class Mob extends PIXI.Container {
    constructor(mobX, mobY, container, variant, bgContainer) {
        // this.mobPool = new MobSpritePool();
        // console.log(this.mobPool.list);
        let textureArr = [];
        for (let i = 1; i <= 4; i++) {
            let texture = PIXI.Texture.from(`mob_${variant}${i}.png`);
            textureArr.push(texture);
        }
        // let mobTexture = PIXI.Texture.from(`mob_${variant}1.png`);
        // super(textureArr);
        super();
        this.sprite = new PIXI.extras.AnimatedSprite(textureArr);
        this.sprite.animationSpeed = 0.15;
        this.sprite.loop = true;
        this.sprite.play();

        // this.sprite_effect = new PIXI.Sprite(PIXI.Texture.from('effect_shining.png'));
        // this.sprite_effect.scale.set(1.5, 1.5);
        // this.sprite_effect.anchor.set(0.5);
        // this.sprite_effect.position.set((APP.GetWidth() / 2), 120);
        // this.sprite_effect.visible = false;

        this.sprite_effect = undefined;
        this.sprite_shield = undefined;

        this.container = container;
        this.bgContainer = bgContainer;

        this.bullets = [];
        this.bullets = BulletMob.list;
        // mob HP
        this.hp = 1;

        this.allowToShoot = false;
        // bullet shot every SHOT_INTERVAL second(s) :)
        this.fireRate = GameDefine.MOB_SHOT_INTERVAL * FPS;
        this.fireCooldown = 0;
        this.bullet_speed = 0.25;
        this.haveBooster = false;

        this.shootChance = 0.001 * 100;
        this.homingChance = 0.9 * 100;
        this.boosterDropChance = 0.2 * 100;

        this.createMob(mobX, mobY);
    }
    createMob(mobX, mobY) {
        let boostChance = Math.random() * 100;
        if (boostChance < this.boosterDropChance) {
            this.hp = 2;
            this.haveBooster = true;
            this.sprite_shield = new PIXI.Sprite(PIXI.Texture.from('shield.png'));
            this.sprite_shield.anchor.set(0.5, 0.5);
            this.sprite_shield.scale.set(1.75, 1.75);
            this.sprite_shield.position.set(mobX, mobY - 10);
            this.sprite_shield.alpha = 0;
            this.addChild(this.sprite_shield);
        }
        this.sprite.anchor.set(0.5, 0.5);
        this.sprite.scale.set(1.5, 1.5);
        // mob spawn point
        this.sprite.position.set(mobX, mobY);
        this.sprite.alpha = 0;
        this.addChild(this.sprite);
    }
    update() {
        // mob fades in when spawn
        // INVULNERABLE DURING THIS TRANSITION
        if (this.sprite.alpha < 1) {
            this.sprite.alpha += 0.05;
            if (this.sprite_shield) {
                this.sprite_shield.alpha += 0.05;
            }
        }
    }
    updateFire(shipX, shipY) {
        if (this.allowToShoot) {
            if (this.fireCooldown < this.fireRate) {
                this.fireCooldown++;
            } else {
                // roll chance to shoot for each mob
                let chance = Math.random() * 100;
                // console.log(`${chance}%`);
                if (chance < this.shootChance) {
                    let isHomingBullet = Math.random() * 100;
                    if (isHomingBullet < this.homingChance) {
                        let bullet = new BulletMob(this.sprite.x, this.sprite.y, shipX, shipY, this, this.bgContainer, this.bullet_speed);

                    } else {
                        let bullet = new BulletMob(this.sprite.x, this.sprite.y, null, null, this, this.bgContainer, this.bullet_speed);
                    }
                    // console.log(bullet.bullet_speed);
                    this.fireCooldown = 0;
                }
            }
        }
    }
}

export default Mob;