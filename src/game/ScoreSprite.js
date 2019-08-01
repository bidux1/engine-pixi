class ScoreSprite extends PIXI.Sprite {
    constructor(type, diff, spawnX, spawnY) {
        let texture;
        // texture = PIXI.Texture.from('score_plus_100.png');
        switch (type) {
            case 0:
                switch (diff) {
                    case 0:
                        texture = PIXI.Texture.from('score_plus_100.png');
                        break;
                    case 1:
                        texture = PIXI.Texture.from('score_plus_200.png');
                        break;
                    case 2:
                        texture = PIXI.Texture.from('score_plus_300.png');
                        break;
                    default:
                        texture = PIXI.Texture.from('score_plus_300.png');
                        break;
                }
                break;
            case 1:
                texture = PIXI.Texture.from('score_minus_300.png');
                break;
            default:
                texture = PIXI.Texture.from('score_minus_300.png');
                break;
        }
        super(texture);
        this.anchor.set(0.5);
        this.startY = spawnY;
        this.position.set(spawnX, spawnY);
        this.alpha = 0;
    }
    update() {
        this.y -= 1;
        if (this.y > (this.startY - 50) && this.alpha <= 1) {
            this.alpha += 0.1;
            return false;
        } else {
            this.alpha -= 0.1;
            if (this.alpha <= 0) {
                this.destroy();
                return true;
            }
        }
    }
}

export default ScoreSprite;