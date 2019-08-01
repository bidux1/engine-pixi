class EndGameState extends PIXI.Container {
    constructor() {
        super();
        this.bg = null;
        this.button_play = null;

        this.interactive = true;
        APP.AddChild(this);
    }

    //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    Load() {
        const loader = PIXI.loader;

        loader.on("progress", this.LoadProgressHandler.bind(this));
        loader.on("error", this.LoadErrorHandler.bind(this));
        loader.on("complete", this.LoadCompleteHandler.bind(this));

        loader.add('landingImg', 'data/image/mig_landscape_host_landscape.jpg');
        loader.add('landingSpriteSheet', 'data/image/sprites/landing_state_sprite/landing_sprite_sheet.json');

        loader.load();

    }

    //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    Unload() {
        APP.RemoveChild(this);
        StateManager.PushState(GameState);
    }

    //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    Update(deltaTime) {
        // console.log(APP.renderer.width);

        if (this.bg) {

        }
    }

    //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    LoadProgressHandler(loader, resource) {
        console.log("LoadProgressHandler: " + resource.name);

        switch (resource.name) {
            case 'landingImg':
                {
                    this.bg = new PIXI.Sprite(PIXI.Texture.from('landingImg'));
                    // scale BG to canvas size
                    this.bg.width = APP.renderer.width;
                    this.bg.height = APP.renderer.height;
                    break;
                }
            case 'landingSpriteSheet':
                {
                    this.button_play = new PIXI.Sprite(PIXI.Texture.from('button_play.png'));
                    this.button_play.anchor.set(0.5);
                    this.button_play.scale.set(1.5);
                    this.button_play.interactive = true;
                    this.button_play.buttonMode = true;
                    this.button_play.position.set(APP.GetWidth() * 3 / 4, APP.GetHeight() * 3 / 4);
                    this.button_play.on("click", function () {
                        console.log('button clicked!');
                        this.Unload();
                    }.bind(this));

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
        this.addChild(this.button_play);
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
}
module.exports = new EndGameState();