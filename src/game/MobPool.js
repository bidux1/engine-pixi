import Mob from './Mob.js';

class MobPool {
    constructor(container, bgContainer) {
        //init vars
        this.container = container;
        this.bg = bgContainer;
        this.mobs = [];
        this.MOB_VARIANT = 3;
        this.PADDING_TOP = 300;
        this.GAP = 200;

        // console.log(this.list);
    }
    generateMobs(difficulty) {
        let mob_per_row = 8;
        let row_count = 3;
        for (let i = 0; i < mob_per_row; i++) {
            this.mobs[i] = [];
            // set distance between mobs
            let mob_x = OFFSET + 50 + this.GAP * i;
            for (let j = 0; j < row_count; j++) {
                // random mob appearance
                let random_mob_variant = Math.floor(1 + (Math.random() * this.MOB_VARIANT));
                let mob_y = this.PADDING_TOP + this.GAP * j;
                let mob = new Mob(mob_x, mob_y, this, random_mob_variant, this.bg);
                this.mobs[i].push(mob);
            }
        }
    }
    getMobs() {
        return this.mobs;
    }
    clearMobs() {
        this.mobs = []
        return this.mobs;
    }
}

export default MobPool;