class LandingState extends PIXI.Container {
    constructor() {
        super();
        this.bg = null;
        this.logo_hns_men = null;
        this.logo_nou = null;
        this.logo_gameloft = null;
        this.button_wrapper = null;
        this.button_quit = null;
        this.bacteria_wrapper = null;

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
                    // logos
                    this.logo_hns_men = new PIXI.Sprite(PIXI.Texture.from('logo_hns_men_ultra.png'));
                    this.logo_hns_men.scale.set(2);
                    this.logo_hns_men.position.set(0, 0);

                    this.logo_gameloft = new PIXI.Sprite(PIXI.Texture.from('logo_gameloft_landing.png'));
                    this.logo_gameloft.anchor.set(0, 1);
                    this.logo_gameloft.scale.set(2);
                    this.logo_gameloft.position.set(0, APP.GetHeight());

                    this.logo_nou = new PIXI.Sprite(PIXI.Texture.from('logo_nou.png'));
                    this.logo_nou.anchor.set(1, 0);
                    this.logo_nou.scale.set(1.5);
                    this.logo_nou.position.set(APP.GetWidth(), 50);

                    // bacteria images
                    this.bacteria_wrapper = new PIXI.Container();
                    let bacteria_01 = new PIXI.Sprite(PIXI.Texture.from('bacteria_01.png'));
                    bacteria_01.position.set(APP.GetWidth() / 3, APP.GetHeight() / 10);
                    bacteria_01.scale.set(1.5);


                    let bacteria_02 = new PIXI.Sprite(PIXI.Texture.from('bacteria_02.png'));
                    bacteria_02.position.set(APP.GetWidth() * 3 / 5, APP.GetHeight() / 10);
                    bacteria_02.scale.set(1.5);

                    let bacteria_03 = new PIXI.Sprite(PIXI.Texture.from('bacteria_03.png'));
                    bacteria_03.position.set(APP.GetWidth() * 6 / 8, APP.GetHeight() * 8 / 12);
                    bacteria_03.anchor.set(0, 1);
                    bacteria_03.scale.set(1.5);

                    let bacteria_04 = new PIXI.Sprite(PIXI.Texture.from('bacteria_04.png'));
                    bacteria_04.position.set(APP.GetWidth() * 2 / 5, APP.GetHeight() * 11 / 12);
                    bacteria_04.anchor.set(0, 1);
                    bacteria_04.scale.set(1.5);

                    this.bacteria_wrapper.addChild(bacteria_01);
                    this.bacteria_wrapper.addChild(bacteria_02);
                    this.bacteria_wrapper.addChild(bacteria_03);
                    this.bacteria_wrapper.addChild(bacteria_04);

                    // button play
                    this.button_wrapper = new PIXI.Container();

                    let button_play = new PIXI.Sprite(PIXI.Texture.from('button_play.png'));
                    button_play.anchor.set(0.5);
                    button_play.scale.set(1.25);
                    button_play.position.set(APP.GetWidth() * 5 / 7, APP.GetHeight() * 4 / 6);
                    button_play.interactive = true;
                    button_play.buttonMode = true;
                    button_play.hitArea = new PIXI.Rectangle(- button_play.width / 3, - button_play.height / 3, 500, 150);
                    button_play.on("click", function () {
                        console.log('button play clicked!');
                        StateManager.PushState(GameState);
                        this.Unload();
                    }.bind(this));

                    let text_play = new PIXI.Sprite(PIXI.Texture.from('text_play.png'));
                    text_play.anchor.set(0.5);
                    text_play.scale.set(1.25);
                    text_play.position.set(APP.GetWidth() * 5 / 7, APP.GetHeight() * 4 / 6);
                    
                    this.button_wrapper.addChild(button_play);
                    this.button_wrapper.addChild(text_play);

                    // button quit
                    this.button_quit = new PIXI.Sprite(PIXI.Texture.from('button_escape_landing.png'));
                    this.button_quit.anchor.set(1, 0);
                    this.button_quit.scale.set(2);
                    this.button_quit.position.set(APP.GetWidth(), 0);
                    this.button_quit.interactive = true;
                    this.button_quit.buttonMode = true;
                    // this.button_quit.hitArea = new PIXI.Rectangle(- button_play.width / 3, - button_play.height / 3, 500, 150);
                    this.button_quit.on("click", function () {
                        console.log('button quit clicked!');
                        // this.Unload();
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
        this.addChild(this.logo_hns_men);
        this.addChild(this.logo_gameloft);
        this.addChild(this.logo_nou);
        this.addChild(this.bacteria_wrapper);
        this.addChild(this.button_wrapper);
        this.addChild(this.button_quit);
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
module.exports = new LandingState();